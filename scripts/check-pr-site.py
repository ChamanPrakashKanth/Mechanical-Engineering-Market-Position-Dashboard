"""Check assembled pages, sitemap metadata and direct references without network access."""
import json
import re
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parent.parent / "_site"
BASE = "/Mechanical-Engineering-Market-Position-Dashboard/"
ORIGIN = "https://chamanprakashkanth.github.io"
HOST = urlsplit(ORIGIN).netloc
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
ROBOTS_NAMES = {"robots", "googlebot", "googlebot-news", "bingbot", "msnbot"}


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []
        self.titles = []
        self.descriptions = []
        self.canonicals = []
        self.robots = []
        self.structured_data = []
        self.in_head = False
        self.in_title = False
        self.json_ld = None

    def handle_starttag(self, tag, attrs):
        for attribute, value in attrs:
            if value and attribute in ATTRIBUTES.get(tag, ()):
                self.references.append((self.getpos()[0], value))
        attrs = dict(attrs)
        if tag == "head":
            self.in_head = True
        if tag == "script" and (attrs.get("type") or "").strip().lower() == "application/ld+json":
            self.json_ld = (self.getpos()[0], [])
        if not self.in_head:
            return
        if tag == "title":
            self.in_title = True
            self.titles.append([])
        if tag == "link" and "canonical" in (attrs.get("rel") or "").lower().split():
            self.canonicals.append(attrs.get("href") or "")
        if tag == "meta":
            name = (attrs.get("name") or "").strip().lower()
            if name == "description":
                self.descriptions.append(attrs.get("content") or "")
            if name in ROBOTS_NAMES:
                self.robots.append(attrs.get("content") or "")

    def handle_data(self, data):
        if self.in_title:
            self.titles[-1].append(data)
        if self.json_ld is not None:
            self.json_ld[1].append(data)

    def handle_endtag(self, tag):
        if tag == "head":
            self.in_head = False
            self.in_title = False
        if tag == "title":
            self.in_title = False
        if tag == "script" and self.json_ld is not None:
            line, data = self.json_ld
            self.structured_data.append((line, "".join(data)))
            self.json_ld = None


def local_file(source_url, value):
    value = value.strip()
    if not value or value.startswith("#"):
        return None
    url = urlsplit(urljoin(source_url, value))
    if url.scheme not in {"http", "https"} or url.netloc.casefold() != HOST:
        return None
    path = unquote(url.path)
    if not path.startswith(BASE):
        raise ValueError(f"outside the project base path: {value}")
    target = ROOT / path[len(BASE):]
    if path.endswith("/") or target.is_dir():
        target /= "index.html"
    target = target.resolve()
    if not target.is_relative_to(ROOT):
        raise ValueError(f"escapes the assembled site: {value}")
    return target


def reject_json_constant(value):
    raise ValueError(f"not a JSON value: {value}")


def main():
    errors, count, sitemap_entries = [], 0, 0
    page_urls = {}

    for sitemap in ("sitemap.xml", "fieldnotes/sitemap.xml"):
        try:
            urls = ET.parse(ROOT / sitemap).findall("{*}url/{*}loc")
            if not urls:
                errors.append(f"{sitemap}: no page entries")
            seen = set()
            for loc in urls:
                value = (loc.text or "").strip()
                sitemap_entries += 1
                if value in seen:
                    errors.append(f"{sitemap}: duplicate URL {value}")
                    continue
                seen.add(value)
                try:
                    url = urlsplit(value)
                    if (url.scheme != "https" or url.netloc != HOST or not url.path.startswith(BASE)
                            or "?" in value or "#" in value):
                        raise ValueError(f"expected a canonical project URL, got {value!r}")
                    target = local_file(value, value)
                    if not target.is_file():
                        raise ValueError(f"{value} → missing {target.relative_to(ROOT)}")
                    if target.suffix == ".html":
                        old_url = page_urls.setdefault(target, value)
                        if old_url != value:
                            raise ValueError(f"multiple sitemap URLs for {target.relative_to(ROOT)}: {old_url}, {value}")
                except ValueError as error:
                    errors.append(f"{sitemap}: {error}")
        except (ET.ParseError, OSError) as error:
            errors.append(f"{sitemap}: {error}")

    # The root sitemap intentionally incorporates Fieldnotes entries from its own
    # sitemap. Check that shared pages are inspected once, using their actual URL.
    pages = dict(page_urls)
    for key in KEY_PAGES:
        page = ROOT / key
        if not page.is_file():
            errors.append(f"Missing key page: {key}")
        else:
            pages.setdefault(page, f"{ORIGIN}{BASE}{key}")

    for file, source_url in sorted(pages.items()):
        source = file.relative_to(ROOT)
        parser = Page()
        try:
            parser.feed(file.read_text(encoding="utf-8"))
            parser.close()
        except (OSError, UnicodeError) as error:
            errors.append(f"{source}: {error}")
            continue
        if file in page_urls:
            if len(parser.titles) != 1 or not "".join(parser.titles[0]).strip():
                errors.append(f"{source}: expected exactly one non-empty title in head")
            if len(parser.descriptions) != 1 or not parser.descriptions[0].strip():
                errors.append(f"{source}: expected exactly one non-empty meta description in head")
            if parser.canonicals != [source_url]:
                errors.append(f"{source}: expected canonical {source_url}; found {parser.canonicals!r}")
            if any({"noindex", "none"} & set(re.split(r"[,\s]+", value.lower())) for value in parser.robots):
                errors.append(f"{source}: sitemap page declares noindex")
        if parser.json_ld is not None:
            errors.append(f"{source}:{parser.json_ld[0]}: unclosed JSON-LD script")
        for line, value in parser.structured_data:
            try:
                if not isinstance(json.loads(value, parse_constant=reject_json_constant), (dict, list)):
                    raise ValueError("expected an object or array")
            except ValueError as error:
                errors.append(f"{source}:{line}: invalid JSON-LD: {error}")
        for line, value in parser.references:
            try:
                target = local_file(source_url, value)
                if target is not None:
                    count += 1
                    if not target.is_file():
                        errors.append(f"{source}:{line}: {value} → missing {target.relative_to(ROOT)}")
            except ValueError as error:
                errors.append(f"{source}:{line}: {error}")

    if errors:
        raise SystemExit("\n".join(errors))
    print(f"Verified {len(pages)} assembled pages ({len(page_urls)} sitemap HTML pages), "
          f"{count} local references, and {sitemap_entries} entries across both sitemaps")


if __name__ == "__main__":
    main()
