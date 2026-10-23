#!/usr/bin/env python3
"""Migrate remaining Notion import pages into archive docs (preserve body/images)."""
from __future__ import annotations

import hashlib
import json
import re
import shutil
import unicodedata
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMPORTS = ROOT / "_imports" / "notion"
INV_PATH = ROOT / "docs" / "harness" / "history" / "notion-import-inventory.json"
MAP_PATH = ROOT / "docs" / "harness" / "history" / "notion-import-mapping.json"
DOCS = ROOT / "docs"

DONE_PATH_SUBSTR = ("아이컴시스", "민팃")
DONE_TITLE_SUBSTR = (
    "ACM + ALB",
    "팩토리 매서드",
    "Factory Method",
    "S3 API Reference",
    "민팃의 개선 사례",
    "아이컴시스 개선사례",
)

# Auth-secret patterns in image alt/text — flag for mapping; do not auto-mask pixels here
SECRET_HINT = re.compile(
    r"(password|secret[_ ]?access[_ ]?key|api[_ ]?secret|private[_ ]?key|session[_ ]?token|Bearer\s+[A-Za-z0-9\-._~+/]+=*)",
    re.I,
)


def nfc(s: str) -> str:
    return unicodedata.normalize("NFC", s)


def slugify(title: str) -> str:
    t = nfc(title).strip()
    # prefer ascii from english words
    s = t.lower()
    s = re.sub(r"[^\w\s\-가-힣]", "", s, flags=re.UNICODE)
    s = re.sub(r"[\s_]+", "-", s).strip("-")
    if not s or len(s.encode("utf-8")) > 80:
        s = "n-" + hashlib.md5(t.encode()).hexdigest()[:12]
    # filesystem-safe
    s = s[:60]
    return s


def title_of(md: Path) -> str:
    return nfc(re.sub(r"\s+[0-9a-f]{32}$", "", md.stem))


def is_done(title: str, rel: str) -> bool:
    t, p = nfc(title), nfc(rel)
    if any(x in p for x in DONE_PATH_SUBSTR):
        return True
    if any(x in t for x in DONE_TITLE_SUBSTR):
        return True
    return False


def area_for(item: dict, title: str, path: str) -> str:
    a = item.get("area") or "Knowledge"
    if a == "Patterns" or "Gof design pattern" in path or "design pattern" in path.lower():
        # factory already done
        return "patterns"
    if a == "Architecture":
        return "architecture"
    if a == "Postmortems":
        return "postmortems"
    if a == "Decisions":
        return "decisions"
    if a == "Experiments":
        return "experiments"
    return "knowledge"


def load_inventory() -> dict[str, dict]:
    inv = json.loads(INV_PATH.read_text(encoding="utf-8"))
    by_path = {}
    for i in inv:
        by_path[nfc(i["path"]).replace("\\", "/")] = i
    return by_path


def find_img_dir(md: Path) -> Path | None:
    title = title_of(md)
    parent = md.parent
    for d in parent.iterdir():
        if d.is_dir() and nfc(d.name) == title:
            return d
    # sometimes folder matches stem
    cand = parent / md.stem
    if cand.is_dir():
        return cand
    return None


def convert_page(md: Path, dest_md: Path, img_rel_prefix: str, img_out: Path) -> dict:
    """Write dest_md with rewritten images. Returns meta."""
    text = md.read_text(encoding="utf-8", errors="replace")
    title = title_of(md)
    body = re.sub(r"^상위 항목:.*\n?", "", text, flags=re.M)
    body = re.sub(r"^하위 항목:.*\n?", "", body, flags=re.M)
    body = re.sub(r"^# .+\n+", "", body, count=1)

    imgdir = find_img_dir(md)
    images: list[dict] = []
    if imgdir:
        files = sorted(
            f
            for f in imgdir.iterdir()
            if f.is_file() and f.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"}
        )
        slug = slugify(title)
        for i, f in enumerate(files, 1):
            ext = f.suffix.lower()
            if ext == ".bmp":
                ext = ".png"
                dest_name = f"{slug}-{i}{ext}"
                # copy as-is; docusaurus may not render bmp — try sips later if needed
                dest_name = f"{slug}-{i}{f.suffix.lower()}"
            else:
                dest_name = f"{slug}-{i}{ext}"
            img_out.mkdir(parents=True, exist_ok=True)
            shutil.copy2(f, img_out / dest_name)
            images.append({"src": f.name, "dest": dest_name})

    img_iter = iter(images)

    def repl(m: re.Match) -> str:
        try:
            im = next(img_iter)
        except StopIteration:
            return ""
        alt = m.group(1) or im["dest"]
        if alt in ("Untitled", ""):
            alt = im["dest"]
        return f"![{alt}]({img_rel_prefix}/{im['dest']})"

    new_body = re.sub(r"!\[([^\]]*)\]\([^)]+\)", repl, body)
    # drop unresolved notion-internal links keep label
    new_body = re.sub(r"\[([^\]]+)\]\((?!https?://)[^)]+\)", r"\1", new_body)
    new_body = re.sub(r"\n{3,}", "\n\n", new_body).strip()

    # extract https links for link-material handling
    links = re.findall(r"https?://[^\s\)\"']+", new_body)

    secret_hit = bool(SECRET_HINT.search(new_body))

    return {
        "title": title,
        "body": new_body,
        "images": images,
        "links": links,
        "secret_hit": secret_hit,
        "chars": len(new_body),
    }


def write_doc(dest: Path, doc_id: str, title: str, tags: list[str], body: str, description: str = "") -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    tags_yaml = "\n".join(f"  - {t}" for t in tags) if tags else ""
    fm = f"""---
id: {doc_id}
title: {json.dumps(title, ensure_ascii=False)}
description: {json.dumps(description or title, ensure_ascii=False)}
tags:
{tags_yaml if tags_yaml else "  - notes"}
status: active
---
# {title}

{body}
"""
    # fix empty tags
    if not tags:
        fm = fm.replace("tags:\n  - notes\n", "tags:\n  - notes\n")
    dest.write_text(fm, encoding="utf-8")


def main(batch_filter: str | None = None) -> None:
    inv_by = load_inventory()
    mapping: list[dict] = []
    if MAP_PATH.exists():
        mapping = json.loads(MAP_PATH.read_text(encoding="utf-8"))

    existing_paths = {m["source_path"] for m in mapping if m.get("status") in ("이전", "통합", "재사용")}

    md_files = sorted(IMPORTS.rglob("*.md"))
    # exclude already migrated sources
    pages = []
    for md in md_files:
        rel = nfc(str(md.relative_to(IMPORTS)).replace("\\", "/"))
        title = title_of(md)
        if is_done(title, rel):
            continue
        if rel in existing_paths:
            continue
        # top folder filter for batches
        parts = Path(rel).parts
        top = parts[1] if len(parts) > 1 and parts[0].startswith("No1Stone") else parts[0]
        top = nfc(top)
        if batch_filter and batch_filter not in top and batch_filter not in rel:
            continue
        inv_key = rel
        # inventory paths start with No1Stone Start Page/
        item = inv_by.get(inv_key) or inv_by.get(nfc(inv_key))
        if not item:
            # try match by suffix
            for k, v in inv_by.items():
                if k.endswith(md.name) or title_of(Path(k)) == title:
                    item = v
                    break
        pages.append((md, rel, title, item, top))

    print(f"batch={batch_filter!r} pages={len(pages)}")

    # Group by immediate parent directory under Start Page for bundles
    by_parent: dict[str, list] = defaultdict(list)
    for md, rel, title, item, top in pages:
        parent = nfc(str(Path(rel).parent))
        by_parent[parent].append((md, rel, title, item, top))

    created = 0
    held = 0
    excluded = 0

    for parent, group in sorted(by_parent.items()):
        # classify each
        for md, rel, title, item, top in group:
            status_src = (item or {}).get("status", "미완성")
            chars = (item or {}).get("chars", md.stat().st_size)
            tags = [t.strip() for t in ((item or {}).get("tags") or "").split(",") if t.strip()]
            area = area_for(item or {}, title, rel)

            # empty / title-only
            text = md.read_text(encoding="utf-8", errors="replace")
            body_only = re.sub(r"^(상위|하위) 항목:.*\n?", "", text, flags=re.M)
            body_only = re.sub(r"^# .+\n+", "", body_only, count=1).strip()
            substance = len(re.sub(r"\s+", "", body_only))
            has_img = bool(find_img_dir(md))
            links = re.findall(r"https?://[^\s\)\"']+", text)

            if status_src == "제목만" or (substance < 20 and not has_img and not links):
                mapping.append(
                    {
                        "source_path": rel,
                        "title": title,
                        "status": "보류" if status_src == "제목만" else "제외",
                        "reason": "제목만·의도 불명" if status_src == "제목만" else "본문·첨부 없음",
                        "dest": None,
                        "section": None,
                        "area": area,
                    }
                )
                if status_src == "제목만":
                    held += 1
                else:
                    excluded += 1
                continue

            slug = slugify(title)
            # destination
            if area == "patterns":
                dest_dir = DOCS / "patterns" / "img" / slug
                dest_md = DOCS / "patterns" / f"{slug}.md"
                img_prefix = f"./img/{slug}"
                doc_id = f"pattern-{slug}"[:60]
            elif area == "architecture":
                dest_dir = DOCS / "architecture" / "img" / slug
                dest_md = DOCS / "architecture" / f"{slug}.md"
                img_prefix = f"./img/{slug}"
                doc_id = f"arch-{slug}"[:60]
            else:
                # knowledge topic file (flat under knowledge/imported subject — use notes path by topic slug only)
                dest_dir = DOCS / "knowledge" / "img" / slug
                dest_md = DOCS / "knowledge" / f"{slug}.md"
                img_prefix = f"./img/{slug}"
                doc_id = f"k-{slug}"[:60]

            # avoid overwrite of hand-written pilots
            if dest_md.exists() and dest_md.name in {
                "factory-method.md",
                "https-on-alb-with-acm.md",
                "amazon-s3-api-reference.md",
            }:
                mapping.append(
                    {
                        "source_path": rel,
                        "title": title,
                        "status": "재사용",
                        "reason": "기완료 문서",
                        "dest": str(dest_md.relative_to(DOCS)),
                        "section": None,
                        "area": area,
                    }
                )
                continue

            # collision: append short hash
            if dest_md.exists():
                h = hashlib.md5(rel.encode()).hexdigest()[:6]
                slug = f"{slug}-{h}"
                dest_dir = dest_dir.parent / slug
                dest_md = dest_md.with_name(f"{slug}.md")
                img_prefix = f"./img/{slug}"
                doc_id = f"k-{slug}"[:60]

            meta = convert_page(md, dest_md, img_prefix, dest_dir)
            body = meta["body"]
            if not body and meta["images"]:
                body = "\n".join(f"![{im['dest']}]({img_prefix}/{im['dest']})" for im in meta["images"])

            if status_src == "링크자료" and substance < 80 and links:
                # keep links; body may be short — preserve as-is without inventing
                pass

            desc = (item or {}).get("title") or title
            write_doc(dest_md, doc_id, title, tags or ["notes"], body, description=str(desc)[:160])
            created += 1
            mapping.append(
                {
                    "source_path": rel,
                    "title": title,
                    "status": "이전",
                    "reason": None,
                    "dest": str(dest_md.relative_to(ROOT / "docs")),
                    "section": f"# {title}",
                    "area": area,
                    "images": len(meta["images"]),
                    "secret_hint": meta["secret_hit"],
                    "src_status": status_src,
                }
            )

    MAP_PATH.write_text(json.dumps(mapping, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"created={created} held={held} excluded={excluded} mapping_total={len(mapping)}")


if __name__ == "__main__":
    import sys

    batch = sys.argv[1] if len(sys.argv) > 1 else None
    main(batch)
