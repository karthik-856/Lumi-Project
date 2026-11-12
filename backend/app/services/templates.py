from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.tables import Template


def _haystack(row: Template) -> str:
    return " ".join(
        [
            row.title,
            row.description,
            row.category,
            row.starting_idea,
            row.best_for,
            row.why_it_works,
            row.difficulty,
        ]
    ).lower()


def list_templates(db: Session, category: str | None = None, search: str | None = None) -> list[Template]:
    rows = list(db.scalars(select(Template).order_by(Template.position, Template.title)).all())
    selected = (category or "").strip().lower()
    if selected and selected != "all":
        rows = [row for row in rows if row.category.lower() == selected]
    query = (search or "").strip().lower()
    if query:
        words = query.split()
        rows = [row for row in rows if all(word in _haystack(row) for word in words)]
    return rows


def get_template(db: Session, template_id: str) -> Template:
    row = db.get(Template, template_id)
    if row is None:
        raise HTTPException(status_code=404, detail="That template is not available.")
    return row
