#!/usr/bin/env python3
"""Reorganize docs into the archive taxonomy while preserving public URLs via slug."""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def split_frontmatter(text: str) -> tuple[str | None, str, str]:
    if not text.startswith("---\n"):
        return None, "", text
    end = text.find("\n---\n", 4)
    if end < 0:
        return None, "", text
    fm = text[4:end]
    body = text[end + 5 :]
    return fm, text[: end + 5], body


def ensure_slug(path: Path, old_docs_rel: str) -> None:
    text = read_text(path)
    fm, prefix, body = split_frontmatter(text)
    if fm is None:
        slug = "/" + old_docs_rel.replace("\\", "/").rsplit(".", 1)[0]
        write_text(path, f"---\nslug: {json.dumps(slug, ensure_ascii=False)}\n---\n{text}")
        return
    if re.search(r"^slug:\s*", fm, re.M):
        return
    stem = old_docs_rel.replace("\\", "/").rsplit(".", 1)[0]
    # Prefer id-based decision URLs: decisions/adr-0001
    id_match = re.search(r'^id:\s*["\']?([^"\'\n]+)["\']?\s*$', fm, re.M)
    if old_docs_rel.startswith("decisions/") and id_match and id_match.group(1) not in {
        "decisions",
    }:
        slug = f"/decisions/{id_match.group(1)}"
    else:
        slug = "/" + stem
    new_fm = fm.rstrip() + f'\nslug: {json.dumps(slug, ensure_ascii=False)}\n'
    write_text(path, f"---\n{new_fm}---\n{body}")


def git_mv(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        raise SystemExit(f"destination exists: {dest}")
    subprocess.run(["git", "mv", str(src), str(dest)], cwd=ROOT, check=True)


def move_tree(src_rel: str, dest_rel: str) -> list[tuple[str, str]]:
    src = DOCS / src_rel
    dest = DOCS / dest_rel
    if not src.exists():
        print(f"skip missing {src_rel}")
        return []
    moved: list[tuple[str, str]] = []
    if src.is_file():
        old = str(src.relative_to(DOCS))
        ensure_slug(src, old)
        git_mv(src, dest)
        moved.append((old, str(dest.relative_to(DOCS))))
        return moved

    for path in sorted(src.rglob("*")):
        if path.is_dir():
            continue
        rel_inside = path.relative_to(src)
        target = dest / rel_inside
        old = str(path.relative_to(DOCS))
        if path.suffix in {".md", ".mdx"}:
            ensure_slug(path, old)
        git_mv(path, target)
        moved.append((old, str(target.relative_to(DOCS))))
    # remove emptied dirs
    for dirpath, dirnames, filenames in os.walk(src, topdown=False):
        p = Path(dirpath)
        if not any(p.iterdir()):
            p.rmdir()
    return moved


def write_category(path: Path, label: str, position: int, link_id: str | None = None) -> None:
    data: dict = {"label": label, "position": position}
    if link_id:
        data["link"] = {"type": "doc", "id": link_id}
    write_text(path, json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def main() -> None:
    moves = [
        # Infrastructure
        ("knowledge/infrastructure/aws", "infrastructure/aws"),
        ("knowledge/infrastructure/linux", "infrastructure/linux"),
        ("knowledge/networking", "infrastructure/networking"),
        # Containers
        ("knowledge/infrastructure/docker", "containers/docker"),
        # Development
        ("knowledge/backend", "development/spring"),
        ("knowledge/data", "development/database"),
        ("knowledge/client", "development/frontend"),
        ("knowledge/messaging", "development/messaging"),
        # DevOps
        ("knowledge/infrastructure/observability", "devops/observability"),
        ("knowledge/tooling/ci", "devops/cicd"),
        ("knowledge/infrastructure/deploy", "devops/cicd"),
        ("knowledge/tooling", "devops/tooling"),
        # Security
        ("knowledge/security", "security"),
        # Architecture
        ("decisions", "architecture/adr"),
        ("patterns", "architecture/patterns"),
        ("postmortems", "architecture/postmortems"),
    ]

    all_moved: list[tuple[str, str]] = []
    for src, dest in moves:
        all_moved.extend(move_tree(src, dest))

    # Remaining infrastructure misc (workspace, sam, hangul, etc.)
    infra = DOCS / "knowledge/infrastructure"
    if infra.exists():
        for path in sorted(infra.iterdir()):
            if path.name.startswith("."):
                continue
            if path.is_dir() and path.name in {"aws", "linux", "docker", "observability", "deploy"}:
                continue
            rel = path.relative_to(DOCS)
            target_rel = Path("infrastructure") / "misc" / path.name
            all_moved.extend(move_tree(str(rel), str(target_rel)))

    # Kubernetes-ish docs under aws → containers/kubernetes
    k8s_names = ("kubernates-install.md", "aws-eks.md", "amazon-eks로-웹-애플리케이션-구축하기.md")
    aws_dir = DOCS / "infrastructure/aws"
    for name in k8s_names:
        for path in aws_dir.rglob(name):
            old = str(path.relative_to(DOCS))
            dest = DOCS / "containers/kubernetes" / path.name
            ensure_slug(path, old)
            git_mv(path, dest)
            all_moved.append((old, str(dest.relative_to(DOCS))))

    # knowledge leftover files (index, no1stone)
    knowledge = DOCS / "knowledge"
    if knowledge.exists():
        for path in sorted(knowledge.rglob("*")):
            if path.is_dir():
                continue
            if path.name == "_category_.json":
                continue
            old = str(path.relative_to(DOCS))
            # keep a thin knowledge hub later; move leaf docs to infrastructure/misc if any
            if path.parent == knowledge and path.suffix in {".md", ".mdx"} and path.name != "index.md":
                dest = DOCS / "infrastructure/misc" / path.name
                ensure_slug(path, old)
                git_mv(path, dest)
                all_moved.append((old, str(dest.relative_to(DOCS))))

    # Category metadata for new tops
    write_category(DOCS / "infrastructure/_category_.json", "Infrastructure", 2)
    write_category(DOCS / "containers/_category_.json", "Containers", 3)
    write_category(DOCS / "development/_category_.json", "Development", 4)
    write_category(DOCS / "devops/_category_.json", "DevOps", 5)
    write_category(DOCS / "security/_category_.json", "Security", 6)
    # architecture already exists — update position
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

    # Harness later in sidebar
    harness_cat = DOCS / "harness/_category_.json"
    if harness_cat.exists():
        data = json.loads(read_text(harness_cat))
        data["position"] = 8
        write_text(harness_cat, json.dumps(data, ensure_ascii=False, indent=2) + "\n")

    report = ROOT / "scripts/reorganize-moved.json"
    write_text(report, json.dumps(all_moved, ensure_ascii=False, indent=2) + "\n")
    print(f"moved {len(all_moved)} files; report {report}")


if __name__ == "__main__":
    main()
