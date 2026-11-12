import json
from datetime import timedelta
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.tables import Challenge, LearningProgress, Lesson, Prompt, Template, User
from app.services.catalog import CHALLENGES, DEMO_USER_ID, DEMO_USER_NAME, LESSONS, SEED_PROGRESS
from app.services.clock import utcnow
from app.services.learning import refresh_user_level, sync_achievements

SEED_FILE = Path(__file__).resolve().parents[1] / "seed" / "prompts.json"
TEMPLATE_FILE = Path(__file__).resolve().parents[3] / "frontend" / "src" / "data" / "templates.json"


def seed(db: Session) -> None:
    if db.get(User, DEMO_USER_ID) is None:
        _seed_demo(db)
    seed_templates(db)


def seed_templates(db: Session) -> None:
    items = json.loads(TEMPLATE_FILE.read_text(encoding="utf-8"))
    existing = set(db.scalars(select(Template.id)).all())
    now = utcnow()
    added = False
    for item in items:
        if item["id"] in existing:
            continue
        db.add(
            Template(
                id=item["id"],
                title=item["title"],
                description=item["description"],
                category=item["category"],
                difficulty=item["difficulty"],
                icon=item["icon"],
                starting_idea=item["startingIdea"],
                suggested_goal=item["suggestedGoal"],
                suggested_audience=item["suggestedAudience"],
                suggested_context=item["suggestedContext"],
                suggested_tone=item["suggestedTone"],
                suggested_output=item["suggestedOutput"],
                why_it_works=item["whyItWorks"],
                best_for=item["bestFor"],
                position=item["position"],
                created_at=now,
            )
        )
        added = True
    if added:
        db.commit()


def _seed_demo(db: Session) -> None:
    now = utcnow()
    user = User(id=DEMO_USER_ID, name=DEMO_USER_NAME, level="Getting started", created_at=now)
    db.add(user)

    for number, lesson_id, title, description, difficulty in LESSONS:
        db.add(Lesson(id=lesson_id, number=number, title=title, description=description, difficulty=difficulty))

    for challenge_id, category, title, kind in CHALLENGES:
        db.add(Challenge(id=challenge_id, category=category, title=title, kind=kind))

    db.flush()

    for lesson_id, status in SEED_PROGRESS.items():
        db.add(
            LearningProgress(
                user_id=user.id,
                lesson_id=lesson_id,
                status=status,
                completed_at=now if status == "completed" else None,
            )
        )

    prompts = json.loads(SEED_FILE.read_text(encoding="utf-8"))
    for item in prompts:
        updated = now - timedelta(days=item["age_days"])
        bodies = "\n\n".join(section["body"] for section in item["sections"])
        db.add(
            Prompt(
                id=item["id"],
                user_id=user.id,
                title=item["title"],
                original_text=item["idea"],
                improved_text=bodies,
                category=item["category"],
                score=None,
                created_at=updated,
                updated_at=updated,
                is_favorite=item["is_favorite"],
                excerpt=item["excerpt"],
                idea=item["idea"],
                saved=item["saved"],
                sections=item["sections"],
                answers=item["answers"],
            )
        )

    db.flush()
    refresh_user_level(db, user)
    sync_achievements(db, user.id)
    db.commit()


def user_or_none(db: Session) -> User | None:
    return db.scalar(select(User).where(User.id == DEMO_USER_ID))
