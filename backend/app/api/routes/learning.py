from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.connection import get_db
from app.models.tables import Achievement, Challenge, ChallengeResult, LearningProgress, Lesson, User
from app.schemas.records import (
    AchievementRead,
    ChallengeResultCreate,
    ChallengeResultRead,
    LessonProgressRead,
    LessonProgressUpdate,
)
from app.services.clock import utcnow
from app.services.learning import achievement_views, refresh_user_level, sync_achievements

router = APIRouter(prefix="/learning", tags=["learning"])


@router.get("/progress", response_model=list[LessonProgressRead])
def read_progress(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list[LearningProgress]:
    return list(db.scalars(select(LearningProgress).where(LearningProgress.user_id == user.id)).all())


@router.patch("/lessons/{lesson_id}", response_model=LessonProgressRead)
def update_lesson(
    lesson_id: str,
    body: LessonProgressUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if db.get(Lesson, lesson_id) is None:
        raise HTTPException(status_code=404, detail="That lesson is not on the path.")
    row = db.scalar(
        select(LearningProgress).where(LearningProgress.user_id == user.id, LearningProgress.lesson_id == lesson_id)
    )
    now = utcnow()
    if row is None:
        row = LearningProgress(user_id=user.id, lesson_id=lesson_id, status=body.status, completed_at=None)
        db.add(row)
    row.status = body.status
    row.completed_at = now if body.status == "completed" else None
    refresh_user_level(db, user)
    sync_achievements(db, user.id)
    db.commit()
    db.refresh(row)
    return row


@router.get("/challenges", response_model=list[ChallengeResultRead])
def read_challenges(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list[ChallengeResult]:
    return list(db.scalars(select(ChallengeResult).where(ChallengeResult.user_id == user.id)).all())


@router.post("/challenges/{challenge_id}/result", response_model=ChallengeResultRead)
def save_challenge(
    challenge_id: str,
    body: ChallengeResultCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if db.get(Challenge, challenge_id) is None:
        raise HTTPException(status_code=404, detail="That challenge is not in the practice list.")
    row = db.scalar(
        select(ChallengeResult).where(ChallengeResult.user_id == user.id, ChallengeResult.challenge_id == challenge_id)
    )
    now = utcnow()
    if row is None:
        row = ChallengeResult(
            user_id=user.id,
            challenge_id=challenge_id,
            selected_answer=body.selected_answer,
            is_correct=body.is_correct,
            completed_at=now,
        )
        db.add(row)
    else:
        row.selected_answer = body.selected_answer
        row.is_correct = body.is_correct
        row.completed_at = now
    sync_achievements(db, user.id)
    db.commit()
    db.refresh(row)
    return row


@router.get("/achievements", response_model=list[AchievementRead])
def read_achievements(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list[dict]:
    return achievement_views(db, user.id)


@router.post("/reset", response_model=list[LessonProgressRead])
def reset_learning(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list:
    """Clear lessons, challenges, and achievements. Saved prompts stay."""
    db.execute(delete(LearningProgress).where(LearningProgress.user_id == user.id))
    db.execute(delete(ChallengeResult).where(ChallengeResult.user_id == user.id))
    db.execute(delete(Achievement).where(Achievement.user_id == user.id))
    user.level = "Getting started"
    db.commit()
    return []
