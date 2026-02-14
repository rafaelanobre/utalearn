import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

DATA_DIR = Path(os.environ.get("DATA_DIR", "../localdata"))

app = FastAPI(title="UtaLearn API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "ok"}


@app.get("/poc/song")
def get_song():
    return FileResponse(DATA_DIR / "song_data.json", media_type="application/json")


@app.get("/poc/audio")
def get_audio():
    return FileResponse(DATA_DIR / "audio.mp3", media_type="audio/mpeg")
