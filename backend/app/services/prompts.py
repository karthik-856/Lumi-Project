import uuid

from fastapi import HTTPException
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.tables import Prompt, PromptAnalysis, User
from app.schemas.records import PromptCreate, PromptUpdate
from app.services.clock import utcnow
from app.services.engine import EngineError, engine_http_error, run_engine


def list_prompts(db: Session, user: User) -> list[Prompt]:
    return list(
        db.scalars(select(Prompt).where(Prompt.user_id == user.id).order_by(Prompt.updated_at.desc())).all()
    )


def get_prompt(db: Session, user: User, prompt_id: str) -> Prompt:
    prompt = db.get(Prompt, prompt_id)
    if prompt is None or prompt.user_id != user.id:
        raise HTTPException(status_code=404, detail="That prompt is not in the library.")
    return prompt


def create_prompt(db: Session, user: User, body: PromptCreate) -> Prompt:
    prompt_id = body.id or str(uuid.uuid4())
    if db.get(Prompt, prompt_id) is not None:
        raise HTTPException(status_code=409, detail="A prompt with that id already exists.")
    now = utcnow()
    prompt = Prompt(
        id=prompt_id,
        user_id=user.id,
        title=body.title,
        original_text=body.original_text,
        improved_text=body.improved_text,
        category=body.category,
        score=body.score,
        created_at=now,
        updated_at=now,
        is_favorite=body.is_favorite,
        excerpt=body.excerpt,
        idea=body.idea,
        saved=body.saved,
        sections=[section.model_dump() for section in body.sections],
        answers=[answer.model_dump() for answer in body.answers],
        template_id=body.template_id,
        template_category=body.template_category,
        analysis_summary=body.analysis_summary,
        analysis_breakdown=[item.model_dump() for item in body.analysis_breakdown] if body.analysis_breakdown else None,
        improvements=body.improvements,
    )
    db.add(prompt)
    db.commit()
    db.refresh(prompt)
    return prompt


def update_prompt(db: Session, user: User, prompt_id: str, body: PromptUpdate) -> Prompt:
    prompt = get_prompt(db, user, prompt_id)
    data = body.model_dump(exclude_unset=True)
    if "sections" in data and data["sections"] is not None:
        data["sections"] = [section if isinstance(section, dict) else section for section in data["sections"]]
    if "answers" in data and data["answers"] is not None:
        data["answers"] = [answer if isinstance(answer, dict) else answer for answer in data["answers"]]
    if "analysis_breakdown" in data and data["analysis_breakdown"] is not None:
        data["analysis_breakdown"] = [item if isinstance(item, dict) else item for item in data["analysis_breakdown"]]
    for key, value in data.items():
        setattr(prompt, key, value)
    prompt.updated_at = utcnow()
    db.commit()
    db.refresh(prompt)
    return prompt


def delete_prompt(db: Session, user: User, prompt_id: str) -> None:
    prompt = get_prompt(db, user, prompt_id)
    db.execute(delete(PromptAnalysis).where(PromptAnalysis.prompt_id == prompt.id))
    db.delete(prompt)
    db.commit()


def favorite_prompt(db: Session, user: User, prompt_id: str, is_favorite: bool) -> Prompt:
    prompt = get_prompt(db, user, prompt_id)
    prompt.is_favorite = is_favorite
    prompt.updated_at = utcnow()
    db.commit()
    db.refresh(prompt)
    return prompt


def store_analysis(db: Session, user: User, text: str, prompt_id: str | None) -> dict:
    try:
        result = run_engine("analyze", text)
    except EngineError:
        raise engine_http_error() from None
    if prompt_id is not None:
        prompt = get_prompt(db, user, prompt_id)
        scores = {item["id"]: int(item["score"]) for item in result["dimensions"]}
        db.add(
            PromptAnalysis(
                prompt_id=prompt.id,
                overall_score=int(result["overall"]),
                clarity=scores["clarity"],
                context=scores["context"],
                specificity=scores["specificity"],
                audience=scores["audience"],
                output=scores["output"],
                constraints=scores["constraints"],
                examples=scores["examples"],
                suggestions=result["suggestions"],
                created_at=utcnow(),
            )
        )
        prompt.score = int(result["overall"])
        prompt.updated_at = utcnow()
        db.commit()
    return result


def improve_text(text: str) -> dict:
    try:
        return run_engine("improve", text)
    except EngineError:
        raise engine_http_error() from None
