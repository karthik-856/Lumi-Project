"""Run the frontend's deterministic analyzer.

The TypeScript modules in frontend/src/lib are the only scoring and improvement
implementation. This service asks that code to run so the API and the browser
cannot drift apart.
"""

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

from fastapi import HTTPException

FRONTEND = Path(__file__).resolve().parents[3] / "frontend"


class EngineError(Exception):
    pass


def engine_command() -> list[str]:
    """Launch the shared analyzer. On Windows, npx is a .cmd file and cannot be started directly."""
    args = ["npx", "--yes", "tsx", "src/cli/engine.ts"]
    if sys.platform != "win32":
        return args
    node = shutil.which("node")
    npx_cmd = shutil.which("npx")
    if node and npx_cmd:
        cli = Path(npx_cmd).resolve().parent / "node_modules" / "npm" / "bin" / "npx-cli.js"
        if cli.is_file():
            return [node, str(cli), "--yes", "tsx", "src/cli/engine.ts"]
    return [os.environ.get("ComSpec", "cmd.exe"), "/d", "/c", subprocess.list2cmdline(args)]


def run_engine(op: str, text: str) -> dict:
    if op not in {"analyze", "improve"}:
        raise EngineError("Unknown engine operation.")
    try:
        completed = subprocess.run(
            engine_command(),
            input=json.dumps({"op": op, "text": text}),
            text=True,
            capture_output=True,
            cwd=FRONTEND,
            timeout=40,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise EngineError("The prompt engine did not respond.") from exc
    if completed.returncode != 0 or not completed.stdout.strip():
        raise EngineError("The prompt engine did not respond.")
    try:
        payload = json.loads(completed.stdout)
    except json.JSONDecodeError as exc:
        raise EngineError("The prompt engine returned an unreadable result.") from exc
    if not isinstance(payload, dict):
        raise EngineError("The prompt engine returned an unreadable result.")
    return payload


def engine_http_error() -> HTTPException:
    return HTTPException(status_code=503, detail="Lumi could not read that prompt just now. You can try again.")
