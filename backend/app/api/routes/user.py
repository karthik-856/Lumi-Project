from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.tables import User
from app.schemas.records import UserRead

router = APIRouter(tags=["user"])


@router.get("/user", response_model=UserRead)
def read_user(user: User = Depends(get_current_user)) -> User:
    return user
