from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.connection import get_db
from app.models.tables import User
from app.schemas.records import FavoriteUpdate, PromptCreate, PromptRead, PromptUpdate
from app.services.prompts import create_prompt, delete_prompt, favorite_prompt, get_prompt, list_prompts, update_prompt

router = APIRouter(prefix="/prompts", tags=["prompts"])


@router.get("", response_model=list[PromptRead])
def read_prompts(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list:
    return list_prompts(db, user)


@router.get("/{prompt_id}", response_model=PromptRead)
def read_prompt(prompt_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return get_prompt(db, user, prompt_id)


@router.post("", response_model=PromptRead, status_code=201)
def post_prompt(body: PromptCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return create_prompt(db, user, body)


@router.put("/{prompt_id}", response_model=PromptRead)
def put_prompt(prompt_id: str, body: PromptUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return update_prompt(db, user, prompt_id, body)


@router.delete("/{prompt_id}", status_code=204)
def remove_prompt(prompt_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> Response:
    delete_prompt(db, user, prompt_id)
    return Response(status_code=204)


@router.patch("/{prompt_id}/favorite", response_model=PromptRead)
def patch_favorite(
    prompt_id: str,
    body: FavoriteUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return favorite_prompt(db, user, prompt_id, body.is_favorite)
