#!/usr/bin/env python3
"""Build library.json for the YMU Library home page.

A book is any top-level folder with an index.html, or any top-level .html file (not index.html, 404.html, old_*,
or a redirect page left at a book's old address: one with <meta http-equiv="refresh">).
Details come from the book's own page (title, description, og:image), its chNN folders (lesson count) and git
history (first published, last updated). An optional book.json in the folder (or <name>.book.json next to a single
.html book) overrides or adds fields:

  {"title": "...", "author": "...", "tag": "...", "tag_ml": "...", "blurb": "...", "blurb_ml": "...",
   "motif": "loop|compass|stairs|sun|wave|spiral|tree|lamp", "accent": "#c9a84c", "lessons": 17,
   "total": 16, "status": "building|complete|hidden", "order": 1}

Run from the repo root:  python3 scripts/build_library.py
"""
import html, json, os, re, subprocess, sys
from datetime import datetime, timezone

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SKIP_DIRS = {"assets", "scripts", ".github", ".git", "node_modules"}
SKIP_FILES = {"index.html", "404.html"}


def meta(text, name):
    for pat in (rf'<meta[^>]+(?:name|property)="{re.escape(name)}"[^>]+content="([^"]*)"',
                rf'<meta[^>]+content="([^"]*)"[^>]+(?:name|property)="{re.escape(name)}"'):
        m = re.search(pat, text, re.I)
        if m:
            return html.unescape(m.group(1)).strip()
    return ""


def clean_title(t):
    return re.split(r"\s+[·|–-]\s+", t, maxsplit=1)[0].strip() if t else ""


def git_dates(path):
    try:
        out = subprocess.run(["git", "log", "--format=%cI", "--", path], cwd=ROOT, capture_output=True,
                             text=True, check=True).stdout.split()
        return (out[-1], out[0]) if out else ("", "")
    except Exception:
        return ("", "")


def load_json(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def book_entry(slug, href, page_path, override_path, folder=None):
    try:
        text = open(page_path, encoding="utf-8", errors="ignore").read()
    except OSError:
        return None
    o = load_json(override_path)
    if o.get("status") == "hidden":
        return None
    title_tag = re.search(r"<title>([^<]*)</title>", text, re.I)
    title = o.get("title") or clean_title(meta(text, "og:title")) or clean_title(html.unescape(title_tag.group(1)) if title_tag else "") or slug
    lessons = o.get("lessons")
    if lessons is None and folder:
        lessons = sum(1 for d in os.listdir(folder)
                      if re.fullmatch(r"ch\d+", d) and os.path.isfile(os.path.join(folder, d, "index.html")))
    first, last = git_dates(folder or page_path)
    total = o.get("total")
    status = o.get("status") or ("building" if total and lessons and lessons < total else "complete")
    ml = bool(re.search(r"lang=ml|മലയാളം|Malayalam", text))
    return {
        "slug": slug, "href": href, "title": title, "author": o.get("author", ""),
        "tag": o.get("tag", ""), "tag_ml": o.get("tag_ml", ""),
        "blurb": o.get("blurb") or meta(text, "description") or meta(text, "og:description"),
        "blurb_ml": o.get("blurb_ml", ""),
        "motif": o.get("motif", ""), "accent": o.get("accent", ""),
        "lessons": lessons or 0, "total": total or 0, "status": status,
        "languages": ["en", "ml"] if ml else ["en"],
        "published": first, "updated": last, "order": o.get("order", 999),
    }


LINK_TAG = '<script src="{rel}assets/library-link.js" defer></script>'
WAKE_TAG = '<script src="{rel}assets/wake-lock.js"></script>'


def add_tag(page_path, rel, name, tag):
    """Add a shared library script to a page's <head>, once."""
    try:
        text = open(page_path, encoding="utf-8").read()
    except OSError:
        return
    if name in text or "</head>" not in text:
        return
    text = text.replace("</head>", tag.format(rel=rel) + "\n</head>", 1)
    with open(page_path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"{name} added: {os.path.relpath(page_path, ROOT)}", file=sys.stderr)


def add_library_link(page_path, rel):
    """Book home: 'back to the library' link. Every page of the book: keep the screen on while a lesson plays."""
    add_tag(page_path, rel, "library-link.js", LINK_TAG)
    add_tag(page_path, rel, "wake-lock.js", WAKE_TAG)
    folder = os.path.dirname(page_path)
    if os.path.basename(page_path) == "index.html" and folder != ROOT:
        for sub in sorted(os.listdir(folder)):
            ch = os.path.join(folder, sub, "index.html")
            if os.path.isfile(ch):
                add_tag(ch, rel + "../", "wake-lock.js", WAKE_TAG)


def is_redirect(path):
    """A page that only forwards old links to a book's new address."""
    try:
        head = open(path, encoding="utf-8", errors="ignore").read(4000)
    except OSError:
        return False
    return bool(re.search(r'<meta[^>]+http-equiv="refresh"', head, re.I))


def main():
    books = []
    for name in sorted(os.listdir(ROOT)):
        p = os.path.join(ROOT, name)
        if name.startswith(".") or name in SKIP_DIRS:
            continue
        if os.path.isdir(p) and os.path.isfile(os.path.join(p, "index.html")):
            e = book_entry(name, name + "/", os.path.join(p, "index.html"), os.path.join(p, "book.json"), folder=p)
        elif name.endswith(".html") and name not in SKIP_FILES and not name.startswith("old_") and not is_redirect(p):
            stem = name[:-5]
            e = book_entry(stem, name, p, os.path.join(ROOT, stem + ".book.json"))
        else:
            continue
        if e:
            books.append(e)
            add_library_link(os.path.join(p, "index.html") if os.path.isdir(p) else p, "../" if os.path.isdir(p) else "")
    books.sort(key=lambda b: (b["order"], b["published"] or "9999"))
    out = {"generated": datetime.now(timezone.utc).isoformat(timespec="seconds"), "books": books}
    with open(os.path.join(ROOT, "library.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"library.json: {len(books)} books", file=sys.stderr)


if __name__ == "__main__":
    main()
