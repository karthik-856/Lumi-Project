from fastapi import APIRouter

from app.api.routes.analysis import router as analysis_router
from app.api.routes.evaluation import router as evaluation_router
from app.api.routes.learning import router as learning_router
from app.api.routes.prompts import router as prompts_router
from app.api.routes.templates import router as templates_router
from app.api.routes.user import router as user_router

api_router = APIRouter()
api_router.include_router(user_router)
api_router.include_router(prompts_router)
api_router.include_router(templates_router)
api_router.include_router(analysis_router)
api_router.include_router(learning_router)
api_router.include_router(evaluation_router)
