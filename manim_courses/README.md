# Manim Video Course Production

This folder contains the production tooling for the Streamlit mini-course videos.

## Setup

Use a separate Python 3.10 environment on this machine so the main Streamlit app stays lightweight. Manim 0.19.1 is pinned because the installed Python 3.12/3.13 launchers cannot currently bootstrap pip here, while Manim 0.20.x requires Python 3.11+.

```powershell
py -3.10 -m venv .venv-manim
.\.venv-manim\Scripts\python.exe -m pip install -r manim_courses\requirements-render.txt
```

Manim Community also needs system render tools. FFmpeg is already available on this machine. V1 scenes avoid LaTeX-only objects, so `pdflatex` is not required.

## Render videos

Render all five low-latency preview videos:

```powershell
.\.venv-manim\Scripts\python.exe manim_courses\render_lessons.py
```

Rendered MP4s should land in `manim_courses/renders/` with filenames matching the Streamlit course catalog.

These MP4s are also embedded directly into the client-side Learning Hub course cards (`Machine Design`, `Finite Element Analysis`, `Robotics`, `Six Sigma`, `Heat Transfer`) via `VIDEO_LESSONS` in `app.js`. The compile scripts inline them as base64 data URIs into `blogspot_deploy.html` / `blogspot_deploy_safe.html`, so the single-file builds stay self-contained.

## Upload to YouTube

1. Create an OAuth desktop app in Google Cloud.
2. Enable the YouTube Data API v3.
3. Save the OAuth client file as `manim_courses/client_secrets.json`.
4. Upload one private test video first:

```powershell
.\.venv-manim\Scripts\python.exe manim_courses\upload_youtube.py --lesson cad-lewis-gear-bending --privacy private
```

The OAuth token is stored under the current user's app-data folder, not in this repo. After upload, paste the returned YouTube video ID into `COURSE_CATALOG` in `app_streamlit.py`.

Note: YouTube may restrict uploads from unverified API projects to private viewing until the API project passes Google's audit.
