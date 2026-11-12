# Lumi

Make AI easier to understand.

Lumi helps you turn an everyday idea into a prompt. It asks for the missing details, shows the prompt taking shape, and explains why each change helps. There is no account and no API key. Nothing you type is sent to an AI service.

On Windows, double-click `START_LUMI.bat`. The steps below are the same thing done by hand. See `RUN_LUMI.md` if Windows blocks the file.

## Requirements

Install both of these, then close and reopen any terminal you already had open:

- [Node.js 22](https://nodejs.org/) (Node.js 20.19 or newer also works). This includes npm.
- [Python 3.11 or newer](https://www.python.org/downloads/). On the Windows installer, tick **Add python.exe to PATH**.

You also need two terminals. In VS Code, use **Terminal → New Terminal**, then the **+** button for a second one.

No API key, password, or database server is required.

## 1. Install the frontend

Open a terminal in the project folder. That folder must contain `frontend` and `backend`.

```bat
cd frontend
npm install
```

Wait until it finishes. You only need to do this once.

## 2. Install the backend

Open the second terminal in the same project folder.

```bat
cd backend
py -3 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

If `py` is not recognized, use `python` instead of `py -3`.

When the virtual environment is active, the line starts with `(.venv)`.

On macOS or Linux, use these commands instead:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 3. Start the backend

In the backend terminal, with `(.venv)` showing:

```bat
python -m uvicorn app.main:app --reload --port 8000
```

Leave this terminal running. The first start creates `backend\lumi.db` on that computer and fills it with sample lessons, templates, and a demo profile named Lumi Explorer.

## 4. Start the frontend

In the frontend terminal:

```bat
npm run dev
```

Leave this terminal running too.

## 5. Open Lumi

In a browser, open:

http://localhost:4731

Start the backend before you open the page. If you opened the page first, refresh it after the backend is running.

The API is at http://127.0.0.1:8000. Its docs are at http://127.0.0.1:8000/docs. You do not need to open those to use Lumi.

## If the backend is unavailable

You can still open http://localhost:4731 after `npm run dev`.

Lumi keeps working in the browser. A line at the top says that Lumi is in local mode. Studio, Analyze, Learn, Challenges, Explore, My Work, Evaluate, and Settings still open. Prompts and progress stay in that browser until the backend is running. Refresh the page after you start the backend.

## If something goes wrong

**`python` or `py` is not recognized.** Reinstall Python and tick **Add python.exe to PATH**. Close the terminal and open a new one.

**`npm` is not recognized.** Reinstall Node.js, then open a new terminal.

**Port 8000 is already in use.** Close the other program using that port, then start the backend again.

**Port 4731 is already in use.** Close the other program using that port, then run `npm run dev` again. Lumi stays on port 4731.

**The page says Lumi is in local mode.** The backend terminal is not running, or the page was opened too early. Start the backend, then refresh http://localhost:4731.

**PowerShell will not activate `.venv`.** Use Command Prompt instead, and run `.venv\Scripts\activate`.

**A link looks blank.** Use http://localhost:4731. Do not double-click `index.html`.
