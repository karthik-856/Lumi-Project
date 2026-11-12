from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.tables import Achievement, ChallengeResult, LearningProgress, User
from app.services.catalog import ACHIEVEMENT_CATALOG, DEMO_USER_ID
from app.services.clock import utcnow


def level_for(completed: int) -> str:
    if completed >= 5:
        return "Prompt Explorer"
    if completed >= 1:
        return "Building the basics"
    return "Getting started"


def refresh_user_level(db: Session, user: User) -> None:
    completed = db.scalars(
        select(LearningProgress).where(LearningProgress.user_id == user.id, LearningProgress.status == "completed")
    ).all()
    user.level = level_for(len(completed))


def sync_achievements(db: Session, user_id: str = DEMO_USER_ID) -> None:
    progress = db.scalars(select(LearningProgress).where(LearningProgress.user_id == user_id)).all()
    results = db.scalars(select(ChallengeResult).where(ChallengeResult.user_id == user_id)).all()
    completed = {row.lesson_id for row in progress if row.status == "completed"}
    earned = {
        "first-lesson": len(completed) >= 1,
        "first-challenge": len(results) >= 1,
        "clear-communicator": "clear-goal" in completed,
        "context-builder": "context" in completed,
        "prompt-explorer": len(completed) >= 5,
    }
    existing = {
        row.achievement_key: row
        for row in db.scalars(select(Achievement).where(Achievement.user_id == user_id)).all()
    }
    now = utcnow()
    for key, unlocked in earned.items():
        row = existing.get(key)
        if unlocked and row is None:
            db.add(Achievement(user_id=user_id, achievement_key=key, unlocked_at=now))
        if not unlocked and row is not None:
            db.delete(row)


def achievement_views(db: Session, user_id: str = DEMO_USER_ID) -> list[dict]:
    unlocked = {
        row.achievement_key: row.unlocked_at
        for row in db.scalars(select(Achievement).where(Achievement.user_id == user_id)).all()
    }
    return [
        {
            "achievement_key": key,
            "title": title,
            "detail": detail,
            "unlocked_at": unlocked.get(key),
        }
        for key, title, detail in ACHIEVEMENT_CATALOG
    ]
