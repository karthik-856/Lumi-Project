from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def client(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("LUMI_DB", str(tmp_path / "lumi.db"))
    from app.database.connection import reset_engine

    reset_engine()
    from app.main import app

    with TestClient(app) as test_client:
        yield test_client


def sample_prompt(prompt_id: str = "study-plan") -> dict:
    return {
        "id": prompt_id,
        "title": "Study plan",
        "original_text": "Help me study databases.",
        "improved_text": "Help me study databases for Friday's exam.",
        "category": "Study",
        "score": 70,
        "is_favorite": False,
        "excerpt": "Help me study databases for Friday's exam.",
        "idea": "Help me study databases.",
        "saved": True,
        "sections": [{"label": "Task", "body": "Help me study databases for Friday's exam."}],
        "answers": [{"label": "Goal", "value": "Learn"}],
    }


def test_user_and_seeded_prompts(client: TestClient):
    user = client.get("/api/user")
    assert user.status_code == 200
    assert user.json()["name"] == "Lumi Explorer"
    assert user.json()["level"] == "Building the basics"

    listed = client.get("/api/prompts")
    assert listed.status_code == 200
    ids = [item["id"] for item in listed.json()]
    assert ids[:3] == ["exam-prep", "resume", "python-functions"]
    assert listed.json()[0]["is_favorite"] is True


def test_prompt_create_update_favorite_delete(client: TestClient):
    created = client.post("/api/prompts", json=sample_prompt())
    assert created.status_code == 201
    assert created.json()["id"] == "study-plan"

    updated = client.put("/api/prompts/study-plan", json={"title": "Friday study plan", "score": 80})
    assert updated.status_code == 200
    assert updated.json()["title"] == "Friday study plan"
    assert updated.json()["score"] == 80

    favorite = client.patch("/api/prompts/study-plan/favorite", json={"is_favorite": True})
    assert favorite.status_code == 200
    assert favorite.json()["is_favorite"] is True

    removed = client.delete("/api/prompts/study-plan")
    assert removed.status_code == 204
    missing = client.get("/api/prompts/study-plan")
    assert missing.status_code == 404


def test_invalid_score_is_rejected(client: TestClient):
    body = sample_prompt("too-high")
    body["score"] = 140
    response = client.post("/api/prompts", json=body)
    assert response.status_code == 400
    assert "detail" in response.json()
    assert "Traceback" not in response.text


def test_learning_progress_and_challenge(client: TestClient):
    progress = client.get("/api/learning/progress")
    assert progress.status_code == 200
    statuses = {row["lesson_id"]: row["status"] for row in progress.json()}
    assert statuses["clear-goal"] == "completed"
    assert statuses["audience"] == "in_progress"

    updated = client.patch("/api/learning/lessons/audience", json={"status": "completed"})
    assert updated.status_code == 200
    assert updated.json()["status"] == "completed"

    missing = client.patch("/api/learning/lessons/not-a-lesson", json={"status": "completed"})
    assert missing.status_code == 404

    result = client.post(
        "/api/learning/challenges/mixed-study/result",
        json={"selected_answer": "situation", "is_correct": True},
    )
    assert result.status_code == 200
    listed = client.get("/api/learning/challenges")
    assert listed.json()[0]["challenge_id"] == "mixed-study"
    assert listed.json()[0]["is_correct"] is True

    achievements = client.get("/api/learning/achievements")
    unlocked = {item["achievement_key"]: item["unlocked_at"] for item in achievements.json()}
    assert unlocked["first-lesson"] is not None
    assert unlocked["first-challenge"] is not None
    assert unlocked["prompt-explorer"] is None


def test_reset_keeps_prompts(client: TestClient):
    before = client.get("/api/prompts")
    reset = client.post("/api/learning/reset")
    assert reset.status_code == 200
    assert reset.json() == []
    assert client.get("/api/learning/challenges").json() == []
    after = client.get("/api/prompts")
    assert [item["id"] for item in after.json()] == [item["id"] for item in before.json()]
    assert client.get("/api/user").json()["level"] == "Getting started"


def test_analyze_and_improve_use_the_shared_engine(client: TestClient):
    created = client.post("/api/prompts", json=sample_prompt("explain-python"))
    assert created.status_code == 201
    analyzed = client.post("/api/analyze", json={"text": "Explain Python.", "prompt_id": "explain-python"})
    assert analyzed.status_code == 200
    body = analyzed.json()
    assert body["overall"] == 48
    assert body["dimensions"]
    stored = client.get("/api/prompts/explain-python")
    assert stored.json()["score"] == 48

    improved = client.post("/api/improve", json={"text": "Explain Python."})
    assert improved.status_code == 200
    assert improved.json()["improved_text"].startswith("Explain Python to a beginner")


def test_templates_search_and_seed_once(client: TestClient):
    listed = client.get("/api/templates")
    assert listed.status_code == 200
    rows = listed.json()
    assert len(rows) >= 12
    assert rows[0]["id"] == "exam-study-planner"
    assert rows[0]["difficulty"] in {"Beginner", "Intermediate"}
    assert all(item["difficulty"] != "Expert" for item in rows)

    study = client.get("/api/templates", params={"category": "education", "search": "study"})
    assert study.status_code == 200
    study_ids = [item["id"] for item in study.json()]
    assert "exam-study-planner" in study_ids
    assert all(item["category"] == "Education" for item in study.json())

    missed = client.get("/api/templates", params={"category": "coding", "search": "resume"})
    assert missed.json() == []

    one = client.get("/api/templates/exam-study-planner")
    assert one.status_code == 200
    assert one.json()["starting_idea"] == "I need help preparing for an exam."
    assert client.get("/api/templates/missing-template").status_code == 404

    from app.database.connection import session_factory
    from app.services.seed import seed

    with session_factory()() as db:
        seed(db)
    again = client.get("/api/templates")
    assert [item["id"] for item in again.json()] == [item["id"] for item in rows]


def test_save_updates_the_same_prompt(client: TestClient):
    created = client.post("/api/prompts", json=sample_prompt("exam-study"))
    assert created.status_code == 201
    created_at = created.json()["created_at"]

    updated = client.put(
        "/api/prompts/exam-study",
        json={
            "title": "Exam Study Planner",
            "idea": "I need help preparing for an exam.",
            "original_text": "I need help preparing for an exam.",
            "improved_text": "Help me prepare for the databases exam with a step-by-step plan.",
            "score": 82,
            "template_id": "exam-study-planner",
            "template_category": "Education",
            "analysis_summary": "82 out of 100. Strong.",
            "analysis_breakdown": [{"id": "audience", "label": "Audience", "score": 80}],
            "improvements": ["Added a clearer audience", "Added output structure"],
        },
    )
    assert updated.status_code == 200
    body = updated.json()
    assert body["id"] == "exam-study"
    assert body["created_at"] == created_at
    assert body["updated_at"] != created_at
    assert body["score"] == 82
    assert body["template_id"] == "exam-study-planner"
    assert body["template_category"] == "Education"
    assert body["idea"] == "I need help preparing for an exam."
    assert body["improved_text"].startswith("Help me prepare")
    assert body["improvements"] == ["Added a clearer audience", "Added output structure"]
    assert body["is_favorite"] is False

    listed = client.get("/api/prompts")
    matches = [item for item in listed.json() if item["id"] == "exam-study"]
    assert len(matches) == 1


def test_evaluation_round_trip_keeps_prompts(client: TestClient):
    before = client.get("/api/prompts").json()
    assert client.get("/api/evaluation").status_code == 404
    body = {
        "id": "eval-session",
        "phase": "results",
        "created_at": "2026-11-12T09:00:00.000Z",
        "updated_at": "2026-11-12T09:05:00.000Z",
        "unaided_draft": "Explain machine learning.",
        "unaided_started_at": "2026-11-12T09:00:00.000Z",
        "unaided_revisions": 0,
        "unaided": {
            "prompt": "Explain machine learning.",
            "started_at": "2026-11-12T09:00:00.000Z",
            "completed_at": "2026-11-12T09:00:42.000Z",
            "duration_ms": 42000,
            "revisions": 0,
            "score": 48,
            "breakdown": [{"id": "clarity", "label": "Clarity", "score": 40}],
            "confidence": 2,
            "steps_used": [],
        },
        "guided_revisions": 2,
        "guided": {
            "prompt": "Explain machine learning to a beginner with three simple examples.",
            "started_at": "2026-11-12T09:02:00.000Z",
            "completed_at": "2026-11-12T09:03:08.000Z",
            "duration_ms": 68000,
            "revisions": 2,
            "score": 80,
            "breakdown": [{"id": "audience", "label": "Audience", "score": 90}],
            "confidence": 4,
            "steps_used": ["Goal", "Audience"],
        },
        "questionnaire": {"easy": 4, "clear": 5, "why": 4, "confident": 4, "again": 5},
    }
    saved = client.put("/api/evaluation", json=body)
    assert saved.status_code == 200
    payload = saved.json()
    assert payload["id"] == "eval-session"
    assert payload["created_at"] == "2026-11-12T09:00:00.000Z"
    assert payload["unaided"]["score"] == 48
    assert payload["guided"]["confidence"] == 4
    assert payload["guided"]["steps_used"] == ["Goal", "Audience"]
    assert payload["questionnaire"]["again"] == 5

    updated = client.put("/api/evaluation", json={**body, "updated_at": "2026-11-12T09:06:00.000Z"})
    assert updated.status_code == 200
    assert updated.json()["created_at"] == payload["created_at"]
    assert updated.json()["updated_at"] == "2026-11-12T09:06:00.000Z"

    replaced = dict(body)
    replaced["id"] = "eval-next"
    replaced["phase"] = "intro"
    replaced["created_at"] = "2026-11-12T10:00:00.000Z"
    replaced["updated_at"] = "2026-11-12T10:00:00.000Z"
    replaced["unaided"] = None
    replaced["guided"] = None
    fresh = client.put("/api/evaluation", json=replaced)
    assert fresh.status_code == 200
    assert fresh.json()["id"] == "eval-next"
    assert fresh.json()["unaided"] is None
    assert [item["id"] for item in client.get("/api/prompts").json()] == [item["id"] for item in before]

    assert client.delete("/api/evaluation").status_code == 204
    assert client.get("/api/evaluation").status_code == 404
    assert [item["id"] for item in client.get("/api/prompts").json()] == [item["id"] for item in before]


def test_docs_available(client: TestClient):
    response = client.get("/docs")
    assert response.status_code == 200
    assert "swagger" in response.text.lower() or "Lumi" in response.text
