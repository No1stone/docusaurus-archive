#!/usr/bin/env python3
"""Finish reorganization after partial run; merge trees; fix image URLs."""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, cwd=ROOT, check=True)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def split_frontmatter(text: str) -> tuple[str | None, str]:
    if not text.startswith("---\n"):
        return None, text
    end = text.find("\n---\n", 4)
    if end < 0:
        return None, text
    return text[4:end], text[end + 5 :]


def ensure_slug(path: Path, old_docs_rel: str) -> None:
    text = read_text(path)
    fm, body = split_frontmatter(text)
    if fm is None:
        slug = "/" + old_docs_rel.replace("\\", "/").rsplit(".", 1)[0]
        write_text(path, f"---\nslug: {json.dumps(slug, ensure_ascii=False)}\n---\n{text}")
        return
    if re.search(r"^slug:\s*", fm, re.M):
        return
    stem = old_docs_rel.replace("\\", "/").rsplit(".", 1)[0]
    id_match = re.search(r'^id:\s*["\']?([^"\'\n]+)["\']?\s*$', fm, re.M)
    if old_docs_rel.startswith("decisions/") and id_match and id_match.group(1) != "decisions":
        slug = f"/decisions/{id_match.group(1)}"
    elif old_docs_rel.startswith("decisions/") and id_match and id_match.group(1) == "decisions":
        slug = "/decisions/"
    else:
        slug = "/" + stem
    write_text(path, f"---\n{fm.rstrip()}\nslug: {json.dumps(slug, ensure_ascii=False)}\n---\n{body}")


def git_mv_file(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        if src.name in {"_category_.json", "index.md", "index.mdx"}:
            # Prefer the destination hub; keep the source under a prefixed name when it is a doc.
            if src.name.startswith("index.") and src.suffix in {".md", ".mdx"}:
                alt = dest.with_name(f"{src.parent.name}-index{src.suffix}")
                if alt.exists():
                    run(["git", "rm", "-f", str(src)])
                    return
                run(["git", "mv", str(src), str(alt)])
                return
            run(["git", "rm", "-f", str(src)])
            return
        raise SystemExit(f"collision: {dest}")
    run(["git", "mv", str(src), str(dest)])


def move_tree(src_rel: str, dest_rel: str) -> int:
    src = DOCS / src_rel
    dest = DOCS / dest_rel
    if not src.exists():
        print("skip", src_rel)
        return 0
    count = 0
    if src.is_file():
        old = str(src.relative_to(DOCS))
        if src.suffix in {".md", ".mdx"}:
            ensure_slug(src, old)
        git_mv_file(src, dest)
        return 1
    for path in sorted(p for p in src.rglob("*") if p.is_file()):
        rel_inside = path.relative_to(src)
        target = dest / rel_inside
        old = str(path.relative_to(DOCS))
        if path.suffix in {".md", ".mdx"}:
            ensure_slug(path, old)
        git_mv_file(path, target)
        count += 1
    for dirpath, _, _ in os.walk(src, topdown=False):
        p = Path(dirpath)
        try:
            if p.exists() and not any(p.iterdir()):
                p.rmdir()
        except OSError:
            pass
    print(f"moved {count}: {src_rel} -> {dest_rel}")
    return count


def write_category(path: Path, label: str, position: int, link_id: str | None = None) -> None:
    data: dict = {"label": label, "position": position}
    if link_id:
        data["link"] = {"type": "doc", "id": link_id}
    write_text(path, json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def merge_images() -> None:
    src = DOCS / "knowledge/img"
    dest = ROOT / "static/img"
    if not src.exists():
        return
    for path in sorted(p for p in src.rglob("*") if p.is_file()):
        rel = path.relative_to(src)
        target = dest / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists():
            # keep existing static asset; remove docs copy
            run(["git", "rm", "-f", str(path)])
        else:
            run(["git", "mv", str(path), str(target)])
    for dirpath, _, _ in os.walk(src, topdown=False):
        p = Path(dirpath)
        try:
            if p.exists() and not any(p.iterdir()):
                p.rmdir()
        except OSError:
            pass
    print("merged knowledge/img into static/img")


def rewrite_image_links() -> int:
    pat = re.compile(r"\]\((?:\.\./)+img/([^)]+)\)")
    n = 0
    for path in DOCS.rglob("*.md"):
        text = read_text(path)
        new, c = pat.subn(r"](/img/\1)", text)
        if c:
            write_text(path, new)
            n += c
    for path in DOCS.rglob("*.mdx"):
        text = read_text(path)
        new, c = pat.subn(r"](/img/\1)", text)
        if c:
            write_text(path, new)
            n += c
    print(f"rewrote {n} image links")
    return n


def main() -> None:
    merge_images()
    rewrite_image_links()

    remaining = [
        ("knowledge/infrastructure/deploy", "devops/cicd"),
        ("knowledge/tooling", "devops/tooling"),
        ("knowledge/security", "security"),
        ("knowledge/infrastructure", "infrastructure/misc"),
        ("decisions", "architecture/adr"),
        ("patterns", "architecture/patterns"),
        ("postmortems", "architecture/postmortems"),
        ("knowledge/no1stone-start-page.md", "infrastructure/misc/no1stone-start-page.md"),
    ]
    total = 0
    for src, dest in remaining:
        total += move_tree(src, dest)

    # k8s docs
    for name in (
        "kubernates-install.md",
        "aws-eks.md",
        "amazon-eks로-웹-애플리케이션-구축하기.md",
    ):
        for path in (DOCS / "infrastructure").rglob(name):
            old = str(path.relative_to(DOCS))
            dest = DOCS / "containers/kubernetes" / path.name
            ensure_slug(path, old)
            git_mv_file(path, dest)
            total += 1
            print("k8s", old, "->", dest.relative_to(DOCS))

    write_category(DOCS / "infrastructure/_category_.json", "Infrastructure", 2)
    write_category(DOCS / "containers/_category_.json", "Containers", 3)
    write_category(DOCS / "development/_category_.json", "Development", 4)
    write_category(DOCS / "devops/_category_.json", "DevOps", 5)
    write_category(DOCS / "security/_category_.json", "Security", 6)
    write_category(
        DOCS / "architecture/_category_.json",
        "Architecture & ADR",
        7,
        "architecture/architecture",
    )
    for rel, label, pos in [
        ("infrastructure/aws", "AWS", 1),
        ("infrastructure/linux", "Linux", 2),
        ("infrastructure/networking", "Networking", 3),
        ("infrastructure/misc", "Misc", 9),
        ("containers/docker", "Docker", 1),
        ("containers/kubernetes", "Kubernetes", 2),
        ("development/spring", "Spring", 1),
        ("development/database", "Database", 2),
        ("development/frontend", "Frontend", 3),
        ("development/messaging", "Messaging", 4),
        ("devops/cicd", "CI/CD", 1),
        ("devops/observability", "Observability", 2),
        ("devops/tooling", "Tooling", 3),
        ("architecture/adr", "ADR", 1),
        ("architecture/patterns", "Patterns", 2),
        ("architecture/postmortems", "Postmortems", 3),
    ]:
        path = DOCS / rel
        if path.exists():
            write_category(path / "_category_.json", label, pos)

    harness_cat = DOCS / "harness/_category_.json"
    if harness_cat.exists():
        data = json.loads(read_text(harness_cat))
        data["position"] = 8
        write_text(harness_cat, json.dumps(data, ensure_ascii=False, indent=2) + "\n")

    # thin knowledge hub
    write_text(
        DOCS / "knowledge/index.md",
        """---
id: knowledge
title: Knowledge
description: Legacy knowledge hub. Content now lives under topic categories.
slug: /knowledge/
sidebar_position: 9
---
# Knowledge

기존 Knowledge 글은 주제별 분류로 옮겼습니다.
공개 URL(`slug`)은 가능한 한 그대로 유지합니다.

| 새 위치 | 이전 분야 |
|------|------|
| [Infrastructure](../infrastructure/) | AWS, Linux, Networking |
| [Containers](../containers/) | Docker, Kubernetes |
| [Development](../development/) | Spring, Database, Frontend, Messaging |
| [DevOps](../devops/) | CI/CD, Observability, Tooling |
| [Security](../security/) | 인증, 토큰, 암호 |
| [Architecture & ADR](../architecture/) | ADR, Patterns, Postmortems |
""",
    )
    write_category(DOCS / "knowledge/_category_.json", "Knowledge (legacy)", 9, "knowledge")

    print("resume total file ops", total)


if __name__ == "__main__":
    main()
