"""Assemble an offline PR preview; keep the production workflow untouched."""
import os
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

import update_robotics_intelligence as robotics

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "_site"
ROOT_FILES = (
    "index.html", "defense-engineering-resources.html", "defense-engineering-feed.xml",
    "llms.txt", "app.js", "styles.css", "refinement.css", "robots.txt", "sitemap.xml",
    ".nojekyll", "analytics.js", "analytics.css", "engineering_reference_profiles.json",
    "shared/mechintel-core.js", "assets/mechintel-social-cover.png",
)
TREE_PATHS = (
    "assets/cad", "assets/gate-books", "answerlens", "industrial",
    "ai-intelligence", "supply-chain-intelligence", "gate-practice-coach",
)


class FixtureClock(datetime):
    @classmethod
    def now(cls, tz=None):
        return cls(2026, 11, 22, tzinfo=timezone.utc).astimezone(tz)


def main():
    # Refuse to reuse a stale build: a leftover file can mask missing packaging.
    OUTPUT.mkdir()

    def copy_file(source):
        relative = source.relative_to(ROOT)
        target = OUTPUT / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)

    for name in ROOT_FILES:
        copy_file(ROOT / name)
    for folder in TREE_PATHS:
        shutil.copytree(ROOT / folder, OUTPUT / folder)
    for pattern in ("engineering-careers/*.html", "manim_courses/renders/*.mp4"):
        files = sorted(ROOT.glob(pattern))
        if not files:
            raise RuntimeError(f"No input files matched {pattern}")
        for source in files:
            copy_file(source)
    copy_file(ROOT / "engineering-careers/app.js")

    subprocess.run(["node", "fieldnotes-app/scripts/integrate.mjs"], cwd=ROOT, check=True)
    # Use the production feed renderer with an empty successful fixture, never live RSS.
    robotics_args = [
        "update_robotics_intelligence.py", "--output", str(OUTPUT / "robotics-intelligence.html"),
        "--sitemap", str(OUTPUT / "sitemap.xml"),
    ]
    with patch("sys.argv", robotics_args), patch.object(robotics, "read_feed", return_value=([], None)), patch.object(
        robotics, "datetime", FixtureClock
    ):
        if robotics.main() != 0:
            raise RuntimeError("Robotics preview generation failed")
    subprocess.run(["node", "scripts/configure-analytics.cjs", "_site"], cwd=ROOT, env={"PATH": os.environ["PATH"]}, check=True)


if __name__ == "__main__":
    main()
