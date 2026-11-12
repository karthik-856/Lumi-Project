from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.types import JSON


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    level: Mapped[str] = mapped_column(String(80), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class Prompt(Base):
    __tablename__ = "prompts"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    original_text: Mapped[str] = mapped_column(Text, nullable=False)
    improved_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(40), nullable=False)
    score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_favorite: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    excerpt: Mapped[str] = mapped_column(String(400), nullable=False)
    idea: Mapped[str] = mapped_column(Text, nullable=False)
    saved: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    sections: Mapped[list] = mapped_column(JSON, nullable=False)
    answers: Mapped[list] = mapped_column(JSON, nullable=False)
    template_id: Mapped[str | None] = mapped_column(String(80), nullable=True)
    template_category: Mapped[str | None] = mapped_column(String(40), nullable=True)
    analysis_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    analysis_breakdown: Mapped[list | None] = mapped_column(JSON, nullable=True)
    improvements: Mapped[list | None] = mapped_column(JSON, nullable=True)


class PromptAnalysis(Base):
    __tablename__ = "prompt_analyses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    prompt_id: Mapped[str] = mapped_column(ForeignKey("prompts.id", ondelete="CASCADE"), nullable=False, index=True)
    overall_score: Mapped[int] = mapped_column(Integer, nullable=False)
    clarity: Mapped[int] = mapped_column(Integer, nullable=False)
    context: Mapped[int] = mapped_column(Integer, nullable=False)
    specificity: Mapped[int] = mapped_column(Integer, nullable=False)
    audience: Mapped[int] = mapped_column(Integer, nullable=False)
    output: Mapped[int] = mapped_column(Integer, nullable=False)
    constraints: Mapped[int] = mapped_column(Integer, nullable=False)
    examples: Mapped[int] = mapped_column(Integer, nullable=False)
    suggestions: Mapped[list] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(String(400), nullable=False)
    difficulty: Mapped[str] = mapped_column(String(40), nullable=False)


class LearningProgress(Base):
    __tablename__ = "learning_progress"
    __table_args__ = (UniqueConstraint("user_id", "lesson_id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    lesson_id: Mapped[str] = mapped_column(ForeignKey("lessons.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class Challenge(Base):
    __tablename__ = "challenges"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    category: Mapped[str] = mapped_column(String(40), nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    kind: Mapped[str] = mapped_column(String(32), nullable=False)


class ChallengeResult(Base):
    __tablename__ = "challenge_results"
    __table_args__ = (UniqueConstraint("user_id", "challenge_id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    challenge_id: Mapped[str] = mapped_column(ForeignKey("challenges.id"), nullable=False)
    selected_answer: Mapped[str] = mapped_column(String(500), nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class Template(Base):
    __tablename__ = "templates"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str] = mapped_column(String(400), nullable=False)
    category: Mapped[str] = mapped_column(String(40), nullable=False)
    difficulty: Mapped[str] = mapped_column(String(40), nullable=False)
    icon: Mapped[str] = mapped_column(String(40), nullable=False)
    starting_idea: Mapped[str] = mapped_column(Text, nullable=False)
    suggested_goal: Mapped[str] = mapped_column(String(40), nullable=False)
    suggested_audience: Mapped[str] = mapped_column(String(40), nullable=False)
    suggested_context: Mapped[str] = mapped_column(Text, nullable=False)
    suggested_tone: Mapped[str] = mapped_column(String(40), nullable=False)
    suggested_output: Mapped[str] = mapped_column(String(40), nullable=False)
    why_it_works: Mapped[str] = mapped_column(Text, nullable=False)
    best_for: Mapped[str] = mapped_column(String(400), nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class Evaluation(Base):
    __tablename__ = "evaluations"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, unique=True, index=True)
    phase: Mapped[str] = mapped_column(String(40), nullable=False)
    created_at: Mapped[str] = mapped_column(String(40), nullable=False)
    updated_at: Mapped[str] = mapped_column(String(40), nullable=False)
    unaided_draft: Mapped[str] = mapped_column(Text, nullable=False, default="")
    unaided_started_at: Mapped[str | None] = mapped_column(String(40), nullable=True)
    unaided_last_edit_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    unaided_revisions: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    unaided_prompt: Mapped[str | None] = mapped_column(Text, nullable=True)
    unaided_completed_at: Mapped[str | None] = mapped_column(String(40), nullable=True)
    unaided_duration_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    unaided_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    unaided_confidence: Mapped[int | None] = mapped_column(Integer, nullable=True)
    unaided_breakdown: Mapped[list | None] = mapped_column(JSON, nullable=True)
    guided_draft: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    guided_step: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    guided_ready: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    guided_started_at: Mapped[str | None] = mapped_column(String(40), nullable=True)
    guided_last_edit_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    guided_revisions: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    guided_prompt: Mapped[str | None] = mapped_column(Text, nullable=True)
    guided_completed_at: Mapped[str | None] = mapped_column(String(40), nullable=True)
    guided_duration_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    guided_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    guided_confidence: Mapped[int | None] = mapped_column(Integer, nullable=True)
    guided_breakdown: Mapped[list | None] = mapped_column(JSON, nullable=True)
    guided_steps: Mapped[list | None] = mapped_column(JSON, nullable=True)
    questionnaire: Mapped[dict | None] = mapped_column(JSON, nullable=True)


class Achievement(Base):
    __tablename__ = "achievements"
    __table_args__ = (UniqueConstraint("user_id", "achievement_key"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    achievement_key: Mapped[str] = mapped_column(String(80), nullable=False)
    unlocked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
