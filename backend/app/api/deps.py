from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.tables import User
from app.services.catalog import DEMO_USER_ID


def get_current_user(db: Session = Depends(get_db)) -> User:
    """The demo profile. Authentication can replace this later."""
    user = db.get(User, DEMO_USER_ID)
    if user is None:
        raise HTTPException(status_code=500, detail="Lumi could not find the demo profile.")
    return user
