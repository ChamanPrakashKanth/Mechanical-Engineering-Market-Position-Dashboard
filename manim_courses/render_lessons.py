import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CATALOG_PATH = ROOT / "course_catalog.json"
SCENE_FILE = ROOT / "course_scenes.py"
RENDERS_DIR = ROOT / "renders"


def load_lessons():
    with CATALOG_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)["lessons"]


def render_lesson(lesson, quality="m"):
    RENDERS_DIR.mkdir(exist_ok=True)
    output_name = Path(lesson["file"]).stem
    cmd = [
        sys.executable,
        "-m",
        "manim",
        str(SCENE_FILE),
        lesson["scene"],
        f"-q{quality}",
        "--media_dir",
        str(ROOT / "media"),
        "-o",
        output_name,
    ]
    subprocess.run(cmd, check=True)

    matches = list((ROOT / "media").glob(f"**/{output_name}.mp4"))
    if not matches:
        raise FileNotFoundError(f"Could not find rendered MP4 for {lesson['slug']}")

    target = ROOT / "renders" / f"{lesson['slug']}.mp4"
    target.write_bytes(matches[0].read_bytes())
    print(f"Rendered {target}")


if __name__ == "__main__":
    selected_slug = sys.argv[1] if len(sys.argv) > 1 else None
    lessons = load_lessons()
    for lesson in lessons:
        if selected_slug and lesson["slug"] != selected_slug:
            continue
        render_lesson(lesson)
