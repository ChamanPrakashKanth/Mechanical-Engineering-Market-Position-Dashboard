"""Check shipped routes and their direct local HTML references without fetching URLs."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent / "_site"
BASE = "/Mechanical-Engineering-Market-Position-Dashboard/"
ORIGIN = "https://chamanprakashkanth.github.io"
KEY_PAGES = (
    "index.html", "fieldnotes/index.html", "fieldnotes/reference.html",
    "fieldnotes/tools/pressure-drop.html", "engineering-careers/index.html",
    "engineering-careers/mechanical-tolerance-stack-calculator.html",
    "engineering-careers/gate-mechanical-books.html", "answerlens/index.html",
    "gate-practice-coach/index.html", "industrial/index.html",
    "ai-intelligence/index.html", "supply-chain-intelligence/index.html",
    "robotics-intelligence.html",
)
ATTRIBUTES = {
    "a": {"href"}, "audio": {"src"}, "iframe": {"src"}, "img": {"src"},
    "link": {"href"}, "script": {"src"}, "source": {"src"}, "video": {"src", "poster"},
}


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []

    def handle_starttag(self, tag, attrs):
        for attribute, value in attrs:
            if value and attribute in ATTRIBUTES.get(tag, ()):
                self.references.append((self.getpos()[0], value))


def local_file(source, value):
    if value.startswith("#") or not value.strip():
        return None
    url = urlsplit(urljoin(f"{ORIGIN}{BASE}{source}", value))
    if url.scheme not in {"http", "https"} or url.netloc.casefold() != urlsplit(ORIGIN).netloc:
        return None
    path = unquote(url.path)
    if not path.startswith(BASE):
        raise ValueError(f"outside the project base path: {value}")
    target = (ROOT / path[len(BASE):]).resolve()
    if not target.is_relative_to(ROOT):
        raise ValueError(f"escapes the assembled site: {value}")
    return target / "index.html" if path.endswith("/") or target.is_dir() else target


def main():
    errors, count = [], 0

    def check(source, value):
        nonlocal count
        try:
            target = local_file(source.split(":", 1)[0], value)
            if target is not None:
                count += 1
                if not target.is_file():
                    errors.append(f"{source}: {value} → missing {target.relative_to(ROOT)}")
        except ValueError as error:
            errors.append(f"{source}: {error}")

    for page in KEY_PAGES:
        file = ROOT / page
        if not file.is_file():
            errors.append(f"Missing key page: {page}")
            continue
        parser = Links()
        parser.feed(file.read_text(encoding="utf-8"))
        for line, value in parser.references:
            check(f"{page}:{line}", value)

    for sitemap in ("sitemap.xml", "fieldnotes/sitemap.xml"):
        try:
            urls = ET.parse(ROOT / sitemap).findall("{*}url/{*}loc")
            if not urls:
                errors.append(f"{sitemap}: no page entries")
            for loc in urls:
                check(sitemap, loc.text or "")
        except (ET.ParseError, OSError) as error:
            errors.append(f"{sitemap}: {error}")

    if errors:
        raise SystemExit("\n".join(errors))
    print(f"Verified {len(KEY_PAGES)} assembled pages and {count} local references/sitemap URLs")


if __name__ == "__main__":
    main()
