from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.tables import Evaluation, User
from app.schemas.records import EvaluationRead, EvaluationTask, EvaluationWrite, QuestionnaireAnswers


def _task(row_prompt, started, completed, duration, revisions, score, breakdown, confidence, steps):
    if row_prompt is None or started is None or completed is None or duration is None or score is None:
        return None
    return EvaluationTask(
        prompt=row_prompt,
        started_at=started,
        completed_at=completed,
        duration_ms=duration,
        revisions=revisions,
        score=score,
        breakdown=breakdown or [],
        confidence=confidence,
        steps_used=steps or [],
    )


def to_read(row: Evaluation) -> EvaluationRead:
    return EvaluationRead(
        id=row.id,
        phase=row.phase,
        created_at=row.created_at,
        updated_at=row.updated_at,
        unaided_draft=row.unaided_draft or "",
        unaided_started_at=row.unaided_started_at,
        unaided_last_edit_ms=row.unaided_last_edit_ms,
        unaided_revisions=row.unaided_revisions,
        unaided=_task(
            row.unaided_prompt,
            row.unaided_started_at,
            row.unaided_completed_at,
            row.unaided_duration_ms,
            row.unaided_revisions,
            row.unaided_score,
            row.unaided_breakdown,
            row.unaided_confidence,
            [],
        ),
        guided_draft=row.guided_draft,
        guided_step=row.guided_step,
        guided_ready=row.guided_ready,
        guided_started_at=row.guided_started_at,
        guided_last_edit_ms=row.guided_last_edit_ms,
        guided_revisions=row.guided_revisions,
        guided=_task(
            row.guided_prompt,
            row.guided_started_at,
            row.guided_completed_at,
            row.guided_duration_ms,
            row.guided_revisions,
            row.guided_score,
            row.guided_breakdown,
            row.guided_confidence,
            row.guided_steps,
        ),
        questionnaire=QuestionnaireAnswers.model_validate(row.questionnaire or {}),
    )


def get_evaluation(db: Session, user: User) -> Evaluation | None:
    return db.scalar(select(Evaluation).where(Evaluation.user_id == user.id))


def _apply(row: Evaluation, body: EvaluationWrite, *, created_at: str) -> None:
    unaided = body.unaided
    guided = body.guided
    row.phase = body.phase
    row.created_at = created_at
    row.updated_at = body.updated_at
    row.unaided_draft = body.unaided_draft
    row.unaided_started_at = unaided.started_at if unaided else body.unaided_started_at
    row.unaided_last_edit_ms = body.unaided_last_edit_ms
    row.unaided_revisions = unaided.revisions if unaided else body.unaided_revisions
    row.unaided_prompt = unaided.prompt if unaided else None
    row.unaided_completed_at = unaided.completed_at if unaided else None
    row.unaided_duration_ms = unaided.duration_ms if unaided else None
    row.unaided_score = unaided.score if unaided else None
    row.unaided_confidence = unaided.confidence if unaided else None
    row.unaided_breakdown = [item.model_dump() for item in unaided.breakdown] if unaided else None
    row.guided_draft = body.guided_draft
    row.guided_step = body.guided_step
    row.guided_ready = body.guided_ready
    row.guided_started_at = guided.started_at if guided else body.guided_started_at
    row.guided_last_edit_ms = body.guided_last_edit_ms
    row.guided_revisions = guided.revisions if guided else body.guided_revisions
    row.guided_prompt = guided.prompt if guided else None
    row.guided_completed_at = guided.completed_at if guided else None
    row.guided_duration_ms = guided.duration_ms if guided else None
    row.guided_score = guided.score if guided else None
    row.guided_confidence = guided.confidence if guided else None
    row.guided_breakdown = [item.model_dump() for item in guided.breakdown] if guided else None
    row.guided_steps = guided.steps_used if guided else None
    row.questionnaire = body.questionnaire.model_dump()


def save_evaluation(db: Session, user: User, body: EvaluationWrite) -> Evaluation:
    existing = get_evaluation(db, user)
    if existing is not None and existing.id != body.id:
        db.delete(existing)
        db.flush()
        existing = None
    if existing is None:
        existing = Evaluation(id=body.id, user_id=user.id, phase=body.phase, created_at=body.created_at, updated_at=body.updated_at)
        db.add(existing)
        created_at = body.created_at
    else:
        created_at = existing.created_at
    _apply(existing, body, created_at=created_at)
    db.commit()
    db.refresh(existing)
    return existing


def clear_evaluation(db: Session, user: User) -> None:
    existing = get_evaluation(db, user)
    if existing is None:
        return
    db.delete(existing)
    db.commit()
