from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Category = Literal["Write", "Study", "Code", "Create", "Work"]
LessonStatus = Literal["not_started", "in_progress", "completed"]
def id_field(default: str | None = None):
    return Field(default=default, min_length=1, max_length=80, pattern=r"^[A-Za-z0-9][A-Za-z0-9_-]*$")


class Section(BaseModel):
    label: str = Field(min_length=1, max_length=80)
    body: str = Field(min_length=1, max_length=4000)


class Answer(BaseModel):
    label: str = Field(min_length=1, max_length=80)
    value: str = Field(min_length=1, max_length=4000)


class BreakdownScore(BaseModel):
    id: str = Field(min_length=1, max_length=40)
    label: str = Field(min_length=1, max_length=40)
    score: int = Field(ge=0, le=100)


class PromptCreate(BaseModel):
    id: str | None = id_field()
    title: str = Field(min_length=1, max_length=160)
    original_text: str = Field(min_length=1, max_length=8000)
    improved_text: str | None = Field(default=None, max_length=8000)
    category: Category
    score: int | None = Field(default=None, ge=0, le=100)
    is_favorite: bool = False
    excerpt: str = Field(min_length=1, max_length=400)
    idea: str = Field(min_length=1, max_length=4000)
    saved: bool = True
    sections: list[Section] = Field(min_length=1, max_length=20)
    answers: list[Answer] = Field(default_factory=list, max_length=20)
    template_id: str | None = Field(default=None, max_length=80)
    template_category: str | None = Field(default=None, max_length=40)
    analysis_summary: str | None = Field(default=None, max_length=400)
    analysis_breakdown: list[BreakdownScore] | None = Field(default=None, max_length=12)
    improvements: list[str] | None = Field(default=None, max_length=8)


class PromptUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=160)
    original_text: str | None = Field(default=None, min_length=1, max_length=8000)
    improved_text: str | None = Field(default=None, max_length=8000)
    category: Category | None = None
    score: int | None = Field(default=None, ge=0, le=100)
    is_favorite: bool | None = None
    excerpt: str | None = Field(default=None, min_length=1, max_length=400)
    idea: str | None = Field(default=None, min_length=1, max_length=4000)
    saved: bool | None = None
    sections: list[Section] | None = Field(default=None, min_length=1, max_length=20)
    answers: list[Answer] | None = Field(default=None, max_length=20)
    template_id: str | None = Field(default=None, max_length=80)
    template_category: str | None = Field(default=None, max_length=40)
    analysis_summary: str | None = Field(default=None, max_length=400)
    analysis_breakdown: list[BreakdownScore] | None = Field(default=None, max_length=12)
    improvements: list[str] | None = Field(default=None, max_length=8)


class FavoriteUpdate(BaseModel):
    is_favorite: bool


class PromptRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    original_text: str
    improved_text: str | None
    category: str
    score: int | None
    created_at: datetime
    updated_at: datetime
    is_favorite: bool
    excerpt: str
    idea: str
    saved: bool
    sections: list[Section]
    answers: list[Answer]
    template_id: str | None = None
    template_category: str | None = None
    analysis_summary: str | None = None
    analysis_breakdown: list[BreakdownScore] | None = None
    improvements: list[str] | None = None


class TemplateRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: str
    category: str
    difficulty: str
    icon: str
    starting_idea: str
    suggested_goal: str
    suggested_audience: str
    suggested_context: str
    suggested_tone: str
    suggested_output: str
    why_it_works: str
    best_for: str
    position: int
    created_at: datetime


class AnalyzeRequest(BaseModel):
    text: str = Field(min_length=1, max_length=8000)
    prompt_id: str | None = id_field()


class ImproveRequest(BaseModel):
    text: str = Field(min_length=1, max_length=8000)


class LessonProgressRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    lesson_id: str
    status: LessonStatus
    completed_at: datetime | None


class LessonProgressUpdate(BaseModel):
    status: LessonStatus


class ChallengeResultRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    challenge_id: str
    selected_answer: str
    is_correct: bool
    completed_at: datetime


class ChallengeResultCreate(BaseModel):
    selected_answer: str = Field(min_length=1, max_length=500)
    is_correct: bool


class AchievementRead(BaseModel):
    achievement_key: str
    title: str
    detail: str
    unlocked_at: datetime | None


EvaluationPhase = Literal[
    "intro",
    "unaided",
    "unaided-confidence",
    "guided",
    "guided-confidence",
    "questionnaire",
    "results",
]


class EvaluationTask(BaseModel):
    prompt: str = Field(min_length=1, max_length=8000)
    started_at: str = Field(min_length=10, max_length=40)
    completed_at: str = Field(min_length=10, max_length=40)
    duration_ms: int = Field(ge=0)
    revisions: int = Field(ge=0)
    score: int = Field(ge=0, le=100)
    breakdown: list[BreakdownScore] = Field(default_factory=list, max_length=12)
    confidence: int | None = Field(default=None, ge=1, le=5)
    steps_used: list[str] = Field(default_factory=list, max_length=8)


class QuestionnaireAnswers(BaseModel):
    model_config = ConfigDict(extra="ignore")

    easy: int | None = Field(default=None, ge=1, le=5)
    clear: int | None = Field(default=None, ge=1, le=5)
    why: int | None = Field(default=None, ge=1, le=5)
    confident: int | None = Field(default=None, ge=1, le=5)
    again: int | None = Field(default=None, ge=1, le=5)


class EvaluationWrite(BaseModel):
    id: str = Field(min_length=1, max_length=80, pattern=r"^[A-Za-z0-9][A-Za-z0-9_-]*$")
    phase: EvaluationPhase
    created_at: str = Field(min_length=10, max_length=40)
    updated_at: str = Field(min_length=10, max_length=40)
    unaided_draft: str = Field(default="", max_length=8000)
    unaided_started_at: str | None = Field(default=None, max_length=40)
    unaided_last_edit_ms: int | None = Field(default=None, ge=0)
    unaided_revisions: int = Field(default=0, ge=0)
    unaided: EvaluationTask | None = None
    guided_draft: dict | None = None
    guided_step: int = Field(default=0, ge=0, le=12)
    guided_ready: bool = False
    guided_started_at: str | None = Field(default=None, max_length=40)
    guided_last_edit_ms: int | None = Field(default=None, ge=0)
    guided_revisions: int = Field(default=0, ge=0)
    guided: EvaluationTask | None = None
    questionnaire: QuestionnaireAnswers = Field(default_factory=QuestionnaireAnswers)


class EvaluationRead(EvaluationWrite):
    pass


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    level: str
    created_at: datetime
