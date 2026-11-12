# Run Lumi on Windows

Lumi needs two programs on the computer:

- Node.js 22. Node.js 20.19 or newer also works. Download it from https://nodejs.org/
- Python 3.11 or newer. Download it from https://www.python.org/downloads/ and tick **Add python.exe to PATH**.

No API key is required.

## Start Lumi

1. Extract the project ZIP.
2. Open the folder that contains `START_LUMI.bat`, `frontend`, and `backend`.
3. Double-click `START_LUMI.bat`.

The first time, it installs the project files. That can take a few minutes. Leave the window open.

It then opens two more windows:

- **Lumi backend** on port 8000
- **Lumi frontend** on port 4731

When the page is ready, your browser opens http://localhost:4731

Leave those two windows open while you use Lumi. You can close the first window after it says Lumi is running.

## If Windows blocks the file

Windows sometimes says it protected your PC, or that the file came from another computer.

1. Right-click `START_LUMI.bat`.
2. Choose **Properties**.
3. If you see **Unblock**, tick it and choose **OK**.
4. Double-click `START_LUMI.bat` again.

If a blue window says Windows protected your PC:

1. Choose **More info**.
2. Choose **Run anyway**.

## Stop Lumi

Close the **Lumi backend** window and the **Lumi frontend** window.

If a window asks `Terminate batch job (Y/N)?`, press Y.

Closing only the first launcher window does not stop Lumi.

## If a port is already in use

The launcher will not start a second copy. Close the old Lumi windows, then double-click `START_LUMI.bat` again.

## Manual commands

Use these if the launcher cannot start. Open two Command Prompt windows in the project folder.

Backend:

```bat
cd backend
py -3 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

If `py` is not recognized, use `python` instead of `py -3`.

Frontend, in the other window:

```bat
cd frontend
npm install
npm run dev
```

Then open http://localhost:4731

## If the backend is not running

You can still use the website after the frontend starts. The page says Lumi is in local mode. Your work stays in that browser until the backend is running. Start the backend, then refresh the page.
