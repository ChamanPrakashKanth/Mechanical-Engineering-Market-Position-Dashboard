import argparse
import json
import mimetypes
import os
import random
import time
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

ROOT = Path(__file__).resolve().parent
CATALOG_PATH = ROOT / "course_catalog.json"
CLIENT_SECRETS = ROOT / "client_secrets.json"
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
RETRIABLE_STATUS_CODES = {500, 502, 503, 504}
MAX_RETRIES = 8


def token_path():
    app_data = os.environ.get("APPDATA") or str(Path.home() / ".config")
    token_dir = Path(app_data) / "mech-eng-pathfinder"
    token_dir.mkdir(parents=True, exist_ok=True)
    return token_dir / "youtube-upload-token.json"


def load_lesson(slug):
    with CATALOG_PATH.open("r", encoding="utf-8") as f:
        lessons = json.load(f)["lessons"]
    for lesson in lessons:
        if lesson["slug"] == slug:
            return lesson
    raise ValueError(f"Unknown lesson slug: {slug}")


def get_credentials():
    if not CLIENT_SECRETS.exists():
        raise FileNotFoundError(
            f"Missing {CLIENT_SECRETS}. Create an OAuth desktop client in Google Cloud and save it there."
        )

    token_file = token_path()
    creds = None
    if token_file.exists():
        creds = Credentials.from_authorized_user_file(str(token_file), SCOPES)

    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    elif not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRETS), SCOPES)
        creds = flow.run_local_server(port=0)

    token_file.write_text(creds.to_json(), encoding="utf-8")
    return creds


def upload_video(youtube, lesson, privacy):
    video_path = Path(lesson["file"])
    if not video_path.is_absolute():
        video_path = ROOT.parent / video_path
    if not video_path.exists():
        raise FileNotFoundError(f"Render not found: {video_path}")

    media_type = mimetypes.guess_type(video_path.name)[0] or "video/mp4"
    body = {
        "snippet": {
            "title": lesson["title"],
            "description": lesson["description"],
            "tags": lesson.get("tags", []),
            "categoryId": "27",
        },
        "status": {
            "privacyStatus": privacy,
            "selfDeclaredMadeForKids": False,
        },
    }

    request = youtube.videos().insert(
        part="snippet,status",
        body=body,
        media_body=MediaFileUpload(str(video_path), mimetype=media_type, chunksize=-1, resumable=True),
        notifySubscribers=False,
    )

    response = None
    retry = 0
    while response is None:
        try:
            status, response = request.next_chunk()
            if status:
                print(f"Upload progress: {int(status.progress() * 100)}%")
        except HttpError as exc:
            if exc.resp.status not in RETRIABLE_STATUS_CODES:
                raise
            retry += 1
            if retry > MAX_RETRIES:
                raise
            sleep_seconds = random.random() * (2 ** retry)
            print(f"Retryable YouTube error {exc.resp.status}. Sleeping {sleep_seconds:.1f}s.")
            time.sleep(sleep_seconds)

    video_id = response["id"]
    print(f"Uploaded {lesson['slug']} as video ID: {video_id}")
    print(f"Paste this into COURSE_CATALOG['{lesson['cluster']}']['youtube_video_id'].")
    return video_id


def main():
    parser = argparse.ArgumentParser(description="Upload a rendered Manim lesson to YouTube with OAuth.")
    parser.add_argument("--lesson", required=True, help="Lesson slug from manim_courses/course_catalog.json")
    parser.add_argument("--privacy", default="private", choices=["private", "unlisted", "public"])
    args = parser.parse_args()

    creds = get_credentials()
    youtube = build("youtube", "v3", credentials=creds)
    lesson = load_lesson(args.lesson)
    upload_video(youtube, lesson, args.privacy)


if __name__ == "__main__":
    main()
