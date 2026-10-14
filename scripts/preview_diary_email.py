#!/usr/bin/env python3
"""Generate a local diary email preview. Does not contact Sender or send email."""
from pathlib import Path
from html import escape
import json
import re
import sys

BASE = "https://marlowerosemusic.com"
INTRO = "Some things are easier to write than to say."
BLURB = "There's a new page in the diary, and this one is a little more personal."
DEFAULT_DESCRIPTION = "A few words about finding a voice, the thoughts we keep to ourselves, and the woman behind the music."

def frontmatter(path):
    raw = path.read_text(encoding="utf-8")
    match = re.match(r"\A---\s*\n(.*?)\n---\s*\n", raw, re.S)
    if not match:
        raise ValueError(f"Missing YAML frontmatter: {path}")
    def field(name):
        m = re.search(rf"(?m)^{re.escape(name)}:\s*(.*)$", match.group(1))
        return m.group(1).strip().strip("'\"") if m else ""
    return {"title": field("title"), "date": field("date"), "excerpt": field("excerpt")}

def main():
    paths = list(Path("_diary").glob("*.md"))
    if not paths:
        sys.exit("No diary entries found")
    entries = [(frontmatter(path), path) for path in paths]
    meta, path = max(entries, key=lambda item: item[0]["date"])
    if not meta["title"] or not meta["date"]:
        sys.exit("Diary title or date is missing")
    url = f"{BASE}/diary/{path.stem}/"
    subject = "A little closer. A new page from Marlowe 🌹"
    description = meta["excerpt"] or DEFAULT_DESCRIPTION
    plain = (f"{INTRO}\n\n{BLURB}\n\n{meta['title']}\n\n"
             f"{description}\n\nRead the diary entry: {url}\n\n"
             "With love,\nMarlowe 🌹\n")
    html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f5f0ed;color:#302423;font-family:Georgia,serif;">
<div style="max-width:560px;margin:32px auto;padding:38px 30px;background:#fffaf7;border:1px solid #e8dcd6;">
<p style="font:12px Arial,sans-serif;letter-spacing:3px;color:#865d66;text-align:center;">MARLOWE ROSE · FROM THE DIARY</p>
<h1 style="font-size:27px;line-height:1.3;font-weight:normal;">{escape(INTRO)}</h1>
<p style="line-height:1.7;">{escape(BLURB)}</p>
<h2 style="font-size:22px;font-weight:normal;">{escape(meta['title'])}</h2>
<p style="line-height:1.7;">{escape(description)}</p>
<p style="margin:28px 0;"><a href="{escape(url,quote=True)}" style="background:#6b394b;color:#fff;text-decoration:none;padding:13px 20px;font:14px Arial,sans-serif;">Read the diary entry</a></p>
<p style="line-height:1.7;">With love,<br>Marlowe 🌹</p>
<hr style="border:0;border-top:1px solid #e8dcd6;margin-top:30px;">
<p style="font:11px Arial,sans-serif;color:#776d6c;">You are receiving this because you subscribed to Marlowe Rose. Future emails sent through Sender must include Sender's unsubscribe link and required sender details.</p>
</div></body></html>"""
    out = Path("diary-email-preview")
    out.mkdir(exist_ok=True)
    (out / "email.html").write_text(html, encoding="utf-8")
    (out / "email.txt").write_text(plain, encoding="utf-8")
    (out / "details.json").write_text(json.dumps({"title": meta["title"], "date": meta["date"], "subject": subject, "url": url, "source": str(path)}, indent=2), encoding="utf-8")
    print("PREVIEW ONLY — no emails sent and no API requests")
    print("Subject:", subject)
    print("Diary title:", meta["title"])
    print("Link:", url)
    print("Files: diary-email-preview/email.html, email.txt, details.json")

if __name__ == "__main__":
    main()
