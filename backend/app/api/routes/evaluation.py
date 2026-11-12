from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database.connection import get_db
from app.models.tables import User
from app.schemas.records import EvaluationRead, EvaluationWrite
from app.services.evaluation import clear_evaluation, get_evaluation, save_evaluation, to_read

router = APIRouter(prefix="/evaluation", tags=["evaluation"])


@router.get("", response_model=EvaluationRead)
def read_evaluation(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> EvaluationRead:
    row = get_evaluation(db, user)
    if row is None:
        raise HTTPException(status_code=404, detail="There is no evaluation yet.")
    return to_read(row)


@router.put("", response_model=EvaluationRead)
def write_evaluation(
    body: EvaluationWrite,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> EvaluationRead:
    return to_read(save_evaluation(db, user, body))


@router.delete("", status_code=204)
def delete_evaluation(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> Response:
    clear_evaluation(db, user)
    return Response(status_code=204)
