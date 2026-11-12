import os
from collections.abc import Generator
from pathlib import Path

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.models.tables import Base

DEFAULT_DB = Path(__file__).resolve().parents[2] / "lumi.db"

_engine = None
_session_factory = None


def database_path() -> Path:
    configured = os.environ.get("LUMI_DB")
    if configured:
        return Path(configured)
    return DEFAULT_DB


def get_engine():
    global _engine, _session_factory
    if _engine is None:
        path = database_path()
        path.parent.mkdir(parents=True, exist_ok=True)
        _engine = create_engine(
            f"sqlite:///{path}",
            connect_args={"check_same_thread": False},
        )
        _session_factory = sessionmaker(bind=_engine, autoflush=True, autocommit=False)
    return _engine


def session_factory() -> sessionmaker[Session]:
    get_engine()
    assert _session_factory is not None
    return _session_factory


def reset_engine() -> None:
    """Drop the cached engine so tests can point at a fresh database."""
    global _engine, _session_factory
    if _engine is not None:
        _engine.dispose()
    _engine = None
    _session_factory = None


def get_db() -> Generator[Session, None, None]:
    db = session_factory()()
    try:
        yield db
    finally:
        db.close()


def ensure_prompt_columns() -> None:
    """Add saved-result columns to a database created before they existed."""
    columns = {
        "template_id": "VARCHAR(80)",
        "template_category": "VARCHAR(40)",
        "analysis_summary": "TEXT",
        "analysis_breakdown": "JSON",
        "improvements": "JSON",
    }
    with get_engine().begin() as connection:
        existing = {row[1] for row in connection.execute(text("PRAGMA table_info(prompts)")).all()}
        for name, column_type in columns.items():
            if name not in existing:
                connection.execute(text(f"ALTER TABLE prompts ADD COLUMN {name} {column_type}"))


def init_db() -> None:
    from app.services.seed import seed

    get_engine()
    Base.metadata.create_all(bind=get_engine())
    ensure_prompt_columns()
    db = session_factory()()
    try:
        seed(db)
    finally:
        db.close()
