from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.records import TemplateRead
from app.services.templates import get_template, list_templates

router = APIRouter(prefix="/templates", tags=["templates"])


@router.get("", response_model=list[TemplateRead])
def read_templates(category: str | None = None, search: str | None = None, db: Session = Depends(get_db)) -> list:
    return list_templates(db, category, search)


@router.get("/{template_id}", response_model=TemplateRead)
def read_template(template_id: str, db: Session = Depends(get_db)):
    return get_template(db, template_id)
