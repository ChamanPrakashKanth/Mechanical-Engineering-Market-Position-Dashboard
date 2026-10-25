#!/usr/bin/env python3
"""Build a source-attributed robotics headlines page from public RSS feeds."""
from __future__ import annotations

import argparse
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from html import escape
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlparse
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "robotics-intelligence.template.html"
BASE = "https://chamanprakashkanth.github.io/Mechanical-Engineering-Market-Position-Dashboard"
FEEDS = [
    {
        "publisher": "The Robot Report", "url": "https://www.therobotreport.com/feed/",
        "domain": "therobotreport.com", "topic": "industry", "label": "Industrial & commercial robots",
        "source": "https://www.therobotreport.com/",
    },
    {
        "publisher": "IEEE Spectrum Robotics", "url": "https://spectrum.ieee.org/feeds/topic/robotics.rss",
        "domain": "spectrum.ieee.org", "topic": "research", "label": "Robotics research & engineering",
        "source": "https://spectrum.ieee.org/topic/robotics/",
    },
    {
        "publisher": "MIT News Robotics", "url": "https://news.mit.edu/topic/mitrobotics-rss.xml",
        "domain": "news.mit.edu", "topic": "research", "label": "Research & public science",
        "source": "https://news.mit.edu/topic/robotics",
    },
    {
        "publisher": "NASA Technology", "url": "https://www.nasa.gov/technology/feed/",
        "domain": "nasa.gov", "topic": "research", "label": "Public science & space robotics",
        "source": "https://www.nasa.gov/technology/",
    },
    {
        "publisher": "DRONELIFE", "url": "https://dronelife.com/feed/",
        "domain": "dronelife.com", "topic": "civilian", "label": "Civilian drones & autonomy",
        "source": "https://dronelife.com/",
    },
    {
        "publisher": "Defense News", "url": "https://www.defensenews.com/arc/outboundfeeds/rss/category/unmanned/?outputType=xml",
        "domain": "defensenews.com", "topic": "defense", "label": "Defense & unmanned reporting",
        "source": "https://www.defensenews.com/unmanned/",
    },
]
MAX_BYTES = 2_000_000
MAX_AGE = timedelta(days=45)
MAX_PER_FEED = 14
MAX_TOTAL = 70


def text_of(parent: ET.Element, names: tuple[str, ...]) -> str:
    for name in names:
        node = parent.find(name)
        if node is not None and node.text:
            return node.text.strip()
    return ""


def parse_date(value: str) -> datetime | None:
    if not value:
        return None
    try:
        result = parsedate_to_datetime(value)
        if result.tzinfo is None:
            result = result.replace(tzinfo=timezone.utc)
        return result.astimezone(timezone.utc)
    except (TypeError, ValueError, OverflowError):
        pass
    try:
        result = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if result.tzinfo is None:
            result = result.replace(tzinfo=timezone.utc)
        return result.astimezone(timezone.utc)
    except (TypeError, ValueError, OverflowError):
        return None


def valid_article_url(value: str, allowed_domain: str) -> bool:
    try:
        parsed = urlparse(value.strip())
        host = (parsed.hostname or "").lower().rstrip(".")
        return parsed.scheme == "https" and (host == allowed_domain or host.endswith("." + allowed_domain)) and not parsed.username and not parsed.password
    except ValueError:
        return False


def read_feed(feed: dict, now: datetime) -> tuple[list[dict], str | None]:
    req = Request(feed["url"], headers={"User-Agent": "MechIntel-Robotics-Headlines/1.0 (+https://chamanprakashkanth.github.io/Mechanical-Engineering-Market-Position-Dashboard/)"})
    try:
        with urlopen(req, timeout=25) as response:
            raw = response.read(MAX_BYTES + 1)
        if len(raw) > MAX_BYTES:
            return [], "feed exceeds size limit"
        root = ET.fromstring(raw)
    except Exception as exc:  # Feed errors are isolated and never inserted into public output.
        return [], type(exc).__name__

    nodes = root.findall(".//item")
    if not nodes:
        atom = "{http://www.w3.org/2005/Atom}"
        nodes = root.findall(f".//{atom}entry")
    results = []
    for node in nodes:
        title = text_of(node, ("title", "{http://www.w3.org/2005/Atom}title"))
        url = text_of(node, ("link", "guid", "{http://www.w3.org/2005/Atom}id"))
        if not url:
            link_node = node.find("{http://www.w3.org/2005/Atom}link")
            url = link_node.attrib.get("href", "") if link_node is not None else ""
        date_text = text_of(node, (
            "pubDate", "published", "updated", "{http://www.w3.org/2005/Atom}published", "{http://www.w3.org/2005/Atom}updated",
        ))
        published = parse_date(date_text)
        if not title or not published or not valid_article_url(url, feed["domain"]):
            continue
        if published > now + timedelta(hours=12) or now - published > MAX_AGE:
            continue
        results.append({
            "title": re.sub(r"\s+", " ", title)[:280], "url": url.strip(), "published": published,
            "publisher": feed["publisher"], "source": feed["source"],
            "topic": feed["topic"], "label": feed["label"],
        })
    results.sort(key=lambda row: row["published"], reverse=True)
    return results[:MAX_PER_FEED], None


def render_story(story: dict) -> str:
    title = escape(story["title"], quote=True)
    url = escape(story["url"], quote=True)
    publisher = escape(story["publisher"])
    source = escape(story["source"], quote=True)
    label = escape(story["label"])
    topic = escape(story["topic"], quote=True)
    dt = story["published"].isoformat(timespec="seconds").replace("+00:00", "Z")
    display_date = story["published"].strftime("%d %b %Y, %H:%M UTC")
    searchable = escape(f"{story['title']} {story['publisher']} {story['label']}", quote=True)
    return (
        f'<article class="story" data-topic="{topic}" data-search="{searchable}">'
        f'<div class="story-top"><span class="tag {topic}">{label}</span>'
        f'<time datetime="{dt}">{display_date}</time></div>'
        f'<h3><a href="{url}" target="_blank" rel="noopener noreferrer">{title}</a></h3>'
        f'<p class="source">Source: <a href="{source}" target="_blank" rel="noopener noreferrer">{publisher}</a> · '
        f'<a href="{url}" target="_blank" rel="noopener noreferrer">Read original ↗</a></p></article>'
    )


def update_sitemap(path: Path, date_text: str) -> None:
    content = path.read_text(encoding="utf-8")
    marker = f"{BASE}/robotics-intelligence.html"
    pattern = re.compile(r"<url>\s*<loc>" + re.escape(marker) + r"</loc>.*?</url>", re.DOTALL)
    match = pattern.search(content)
    if not match:
        raise RuntimeError("Robotics Intelligence URL is missing from the main sitemap")
    block = re.sub(r"<lastmod>[^<]*</lastmod>", f"<lastmod>{date_text}</lastmod>", match.group(0), count=1)
    path.write_text(content[:match.start()] + block + content[match.end():], encoding="utf-8")


def write_rss(path: Path, stories: list[dict], now: datetime) -> None:
    ET.register_namespace("atom", "http://www.w3.org/2005/Atom")
    rss = ET.Element("rss", {"version": "2.0"})
    channel = ET.SubElement(rss, "channel")
    ET.SubElement(channel, "title").text = "MechIntel Robotics Intelligence — Daily Source-Linked Headlines"
    ET.SubElement(channel, "link").text = f"{BASE}/robotics-intelligence.html"
    ET.SubElement(channel, "description").text = "Daily attributed headlines on industrial and civilian robotics, drones, research, and public unmanned-systems reporting. Each item links to its original publisher."
    ET.SubElement(channel, "language").text = "en"
    ET.SubElement(channel, "lastBuildDate").text = now.strftime("%a, %d %b %Y %H:%M:%S +0000")
    ET.SubElement(channel, "{http://www.w3.org/2005/Atom}link", {"href": f"{BASE}/robotics-intelligence-feed.xml", "rel": "self", "type": "application/rss+xml"})
    for story in stories:
        item = ET.SubElement(channel, "item")
        ET.SubElement(item, "title").text = story["title"]
        ET.SubElement(item, "link").text = story["url"]
        ET.SubElement(item, "guid", {"isPermaLink": "true"}).text = story["url"]
        ET.SubElement(item, "pubDate").text = story["published"].strftime("%a, %d %b %Y %H:%M:%S +0000")
        ET.SubElement(item, "category").text = story["label"]
        ET.SubElement(item, "source", {"url": story["source"]}).text = story["publisher"]
        ET.SubElement(item, "description").text = f"Source: {story['publisher']}. Follow the link to read the original headline and article."
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(b'<?xml version="1.0" encoding="utf-8"?>\n' + ET.tostring(rss, encoding="utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--sitemap", type=Path, required=True)
    args = parser.parse_args()
    now = datetime.now(timezone.utc).replace(microsecond=0)
    stories, successful, errors = [], 0, []
    for feed in FEEDS:
        found, error = read_feed(feed, now)
        if error:
            errors.append((feed["publisher"], error))
            print(f"Feed unavailable: {feed['publisher']} ({error})", file=sys.stderr)
            continue
        successful += 1
        stories.extend(found)
    if successful == 0:
        raise RuntimeError("All public RSS sources failed; refusing to replace the published edition")
    unique = {}
    for story in stories:
        unique.setdefault(story["url"], story)
    stories = sorted(unique.values(), key=lambda row: row["published"], reverse=True)[:MAX_TOTAL]
    template = TEMPLATE.read_text(encoding="utf-8")
    if stories:
        rendered = "\n".join(render_story(story) for story in stories)
    else:
        rendered = '<p class="empty">No recent headlines matched the feed window. Check publisher sources below for their latest coverage.</p>'
    schema = {
        "@context": "https://schema.org", "@type": "CollectionPage",
        "name": "Daily Robotics News: Industrial Robots, Drones and Autonomy",
        "url": f"{BASE}/robotics-intelligence.html",
        "description": "Daily source-attributed headlines across industrial and civilian robotics, drones, research, and public unmanned-systems reporting.",
        "dateModified": now.date().isoformat(),
        "mainEntity": {"@type": "ItemList", "numberOfItems": len(stories), "itemListElement": [
            {"@type": "ListItem", "position": i, "name": row["title"], "url": row["url"]}
            for i, row in enumerate(stories, 1)
        ]},
        "breadcrumb": {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE}/"},
            {"@type": "ListItem", "position": 2, "name": "Robotics Intelligence", "item": f"{BASE}/robotics-intelligence.html"},
        ]},
    }
    schema_text = json.dumps(schema, ensure_ascii=False).replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")
    html = template.replace("__ROBOTICS_SCHEMA__", schema_text)
    html = html.replace("__ROBOTICS_STORIES__", rendered)
    html = html.replace("__ROBOTICS_UPDATED_ISO__", now.isoformat(timespec="seconds").replace("+00:00", "Z"))
    html = html.replace("__ROBOTICS_UPDATED_DISPLAY__", now.strftime("%d %b %Y, %H:%M UTC"))
    if re.search(r"__ROBOTICS_[A-Z_]+__", html):
        raise RuntimeError("An unfilled robotics page template marker remains")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(html, encoding="utf-8")
    write_rss(args.output.with_name("robotics-intelligence-feed.xml"), stories, now)
    update_sitemap(args.sitemap, now.date().isoformat())
    print(f"Published {len(stories)} credited headlines from {successful}/{len(FEEDS)} feeds; {len(errors)} feeds unavailable.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"Robotics intelligence update failed: {type(exc).__name__}: {exc}", file=sys.stderr)
        raise SystemExit(1)
