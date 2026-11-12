from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.connection import get_db
from app.models.tables import User
from app.schemas.records import AnalyzeRequest, ImproveRequest
from app.services.prompts import improve_text, store_analysis

router = APIRouter(tags=["analysis"])


@router.post("/analyze")
def analyze(body: AnalyzeRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> dict:
    return store_analysis(db, user, body.text, body.prompt_id)


@router.post("/improve")
def improve(body: ImproveRequest) -> dict:
    return improve_text(body.text)
