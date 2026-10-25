#!/usr/bin/env python3
"""Restore Decisions + Knowledge menu skeleton and place new posts into Korean groups."""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
STAGING = ROOT / ".restore-staging"


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, cwd=ROOT, check=True)


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


def ensure_slug_preserve_current(path: Path, current_docs_rel: str) -> None:
    """Keep published URL when moving a new post to a new folder."""
    text = read_text(path)
    fm, _prefix, body = split_frontmatter(text)
    slug = "/" + current_docs_rel.replace("\\", "/").rsplit(".", 1)[0]
    if fm is None:
        write_text(path, f"---\nslug: {json.dumps(slug, ensure_ascii=False)}\n---\n{text}")
        return
    if re.search(r"^slug:\s*", fm, re.M):
        return
    new_fm = fm.rstrip() + f"\nslug: {json.dumps(slug, ensure_ascii=False)}\n"
    write_text(path, f"---\n{new_fm}---\n{body}")


def move_path(src: Path, dest: Path) -> None:
    if not src.exists():
        print(f"skip missing {src}")
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        if dest.is_dir() and src.is_dir():
            for child in sorted(src.iterdir()):
                move_path(child, dest / child.name)
            if src.exists() and not any(src.iterdir()):
                src.rmdir()
            return
        raise SystemExit(f"destination exists: {dest} (from {src})")
    shutil.move(str(src), str(dest))


def rmdir_empty(path: Path) -> None:
    if not path.exists() or not path.is_dir():
        return
    for child in list(path.iterdir()):
        if child.is_dir():
            rmdir_empty(child)
    if path.exists() and not any(path.iterdir()):
        path.rmdir()


def write_category(path: Path, label: str, position: int, link_id: str | None = None) -> None:
    data: dict = {"label": label, "position": position}
    if link_id:
        data["link"] = {"type": "doc", "id": link_id}
    write_text(path, json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def stage_new_posts() -> list[tuple[str, str]]:
    """Move newly added posts out before reversing taxonomy. Returns (staging_rel, target_group)."""
    if STAGING.exists():
        shutil.rmtree(STAGING)
    STAGING.mkdir(parents=True)

    plan = [
        ("infrastructure/aws/cost-optimization/savings-plans-personal-infrastructure.md", "비용"),
        ("infrastructure/aws/cost-optimization/savings-plans-utilization-coverage.md", "비용"),
        ("infrastructure/aws/ec2-t-instance-cpu-credit-optimization.md", "비용"),
        ("infrastructure/networking/reverse-ssh.md", "접속"),
        ("containers/kubernetes/k3d.md", "로컬 클러스터"),
        ("containers/kubernetes/k3d-local-cluster.md", "로컬 클러스터"),
        ("containers/kubernetes/k3d-namespace-ingress.md", "로컬 클러스터"),
        ("devops/deployment-strategies/blue-green-buffer-deployment.md", "배포"),
        ("ai-engineering/harness-engineering.md", "운영 메모"),
    ]
    staged: list[tuple[str, str]] = []
    for rel, group in plan:
        src = DOCS / rel
        if not src.exists():
            print(f"stage skip missing {rel}")
            continue
        ensure_slug_preserve_current(src, rel)
        dest = STAGING / group / src.name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dest))
        staged.append((str(dest.relative_to(STAGING)), group))
        print(f"staged {rel} -> {group}/{src.name}")
    return staged


def reverse_taxonomy() -> None:
    moves = [
        ("infrastructure/aws", "knowledge/infrastructure/aws"),
        ("infrastructure/linux", "knowledge/infrastructure/linux"),
        ("infrastructure/networking", "knowledge/networking"),
        ("containers/docker", "knowledge/infrastructure/docker"),
        ("development/spring", "knowledge/backend"),
        ("development/database", "knowledge/data"),
        ("development/frontend", "knowledge/client"),
        ("development/messaging", "knowledge/messaging"),
        ("devops/observability", "knowledge/infrastructure/observability"),
        ("devops/cicd", "knowledge/tooling/ci"),
        ("devops/tooling", "knowledge/tooling"),
        ("security", "knowledge/security"),
        ("architecture/adr", "decisions"),
        ("architecture/patterns", "patterns"),
        ("architecture/postmortems", "postmortems"),
    ]
    for src_rel, dest_rel in moves:
        src = DOCS / src_rel
        dest = DOCS / dest_rel
        if not src.exists():
            print(f"reverse skip missing {src_rel}")
            continue
        print(f"reverse {src_rel} -> {dest_rel}")
        move_path(src, dest)

    # unwrap infrastructure/misc/* back under knowledge/infrastructure/
    misc = DOCS / "infrastructure/misc"
    if misc.exists():
        for child in sorted(misc.iterdir()):
            target = DOCS / "knowledge/infrastructure" / child.name
            print(f"unwrap misc {child.name} -> knowledge/infrastructure/{child.name}")
            move_path(child, target)

    # k8s docs that lived under aws before
    k8s_names = (
        "kubernates-install.md",
        "aws-eks.md",
        "amazon-eks로-웹-애플리케이션-구축하기.md",
    )
    k8s_dir = DOCS / "containers/kubernetes"
    if k8s_dir.exists():
        for name in k8s_names:
            src = k8s_dir / name
            if src.exists():
                dest = DOCS / "knowledge/infrastructure/aws" / name
                print(f"k8s restore {name}")
                move_path(src, dest)


def place_staged_posts() -> None:
    for group_dir in sorted(STAGING.iterdir()):
        if not group_dir.is_dir():
            continue
        group = group_dir.name
        target_root = DOCS / "knowledge" / group
        target_root.mkdir(parents=True, exist_ok=True)
        for path in sorted(group_dir.iterdir()):
            if path.is_dir():
                continue
            dest = target_root / path.name
            print(f"place {path.name} -> knowledge/{group}/")
            move_path(path, dest)


def group_decisions() -> None:
    """Split ADRs into Korean topic groups; keep slug URLs."""
    groups = {
        "문서와 아카이브": [
            "ADR-0001-markdown-git-as-engineering-source-of-truth.md",
            "ADR-0002-docusaurus-as-archive-reading-ui.md",
            "ADR-0003-archive-ad-placement.md",
        ],
        "플랫폼과 하네스": [
            "ADR-0004-blocking-flow-uses-mvc.md",
            "ADR-0005-code-conventions-as-team-agreement.md",
            "ADR-0006-conventions-via-templates-and-harness.md",
            "ADR-0007-harness2-rrsi-and-local-harness-direction.md",
            "ADR-0008-ai-harness-references-and-operating-principles.md",
        ],
        "런타임과 보안": [
            "ADR-0009-php-security-runtime-upgrade.md",
        ],
    }
    decisions = DOCS / "decisions"
    if not decisions.exists():
        return
    for label, files in groups.items():
        folder = decisions / label
        folder.mkdir(parents=True, exist_ok=True)
        write_category(folder / "_category_.json", label, list(groups).index(label) + 1)
        for name in files:
            src = decisions / name
            if src.exists():
                move_path(src, folder / name)
                print(f"decision group {name} -> {label}")


def restore_categories() -> None:
    # top-level positions matching previous skeleton
    write_category(DOCS / "knowledge/_category_.json", "Knowledge", 2, "knowledge/knowledge")
    write_category(DOCS / "architecture/_category_.json", "Architecture", 3, "architecture/architecture")
    write_category(DOCS / "patterns/_category_.json", "Patterns", 4, "patterns/patterns")
    write_category(DOCS / "decisions/_category_.json", "Decisions", 5, "decisions/decisions")
    write_category(DOCS / "experiments/_category_.json", "Experiments", 6, "experiments/experiments")
    write_category(DOCS / "postmortems/_category_.json", "Postmortems", 7, "postmortems/postmortems")

    harness_cat = DOCS / "harness/_category_.json"
    if harness_cat.exists():
        data = json.loads(read_text(harness_cat))
        data["position"] = 8
        data["label"] = data.get("label", "Harness")
        write_text(harness_cat, json.dumps(data, ensure_ascii=False, indent=2) + "\n")

    history_cat = DOCS / "history/_category_.json"
    if history_cat.exists():
        data = json.loads(read_text(history_cat))
        data["position"] = 9
        write_text(history_cat, json.dumps(data, ensure_ascii=False, indent=2) + "\n")

    # Knowledge bottom Korean groups — high position so they sit at the bottom
    for label, pos in [
        ("비용", 20),
        ("접속", 21),
        ("로컬 클러스터", 22),
        ("배포", 23),
        ("운영 메모", 24),
    ]:
        path = DOCS / "knowledge" / label
        if path.exists():
            write_category(path / "_category_.json", label, pos)

    # restore nested knowledge categories if missing labels from 8eddced where useful
    nested = [
        ("knowledge/backend", "Backend", 1),
        ("knowledge/client", "Client", 2),
        ("knowledge/data", "Data", 3),
        ("knowledge/infrastructure", "Infrastructure", 4),
        ("knowledge/messaging", "Messaging", 5),
        ("knowledge/networking", "Networking", 6),
        ("knowledge/security", "Security", 7),
        ("knowledge/tooling", "Tooling", 8),
    ]
    for rel, label, pos in nested:
        path = DOCS / rel
        if path.exists():
            cat = path / "_category_.json"
            if not cat.exists():
                write_category(cat, label, pos)


def restore_home_index() -> None:
    # Prefer previous archive home if current is the taxonomy hub
    old = subprocess.check_output(
        ["git", "show", "8eddced:docs/index.md"], cwd=ROOT
    ).decode("utf-8")
    write_text(DOCS / "index.md", old)

    # knowledge hub
    try:
        old_k = subprocess.check_output(
            ["git", "show", "8eddced:docs/knowledge/index.md"], cwd=ROOT
        ).decode("utf-8")
        write_text(DOCS / "knowledge/index.md", old_k)
    except subprocess.CalledProcessError:
        pass

    try:
        old_d = subprocess.check_output(
            ["git", "show", "8eddced:docs/decisions/index.md"], cwd=ROOT
        ).decode("utf-8")
        write_text(DOCS / "decisions/index.md", old_d)
    except subprocess.CalledProcessError:
        pass


def cleanup_taxonomy_shells() -> None:
    for rel in [
        "infrastructure",
        "containers",
        "development",
        "devops",
        "security",
        "ai-engineering",
        "architecture/adr",
        "architecture/patterns",
        "architecture/postmortems",
    ]:
        path = DOCS / rel
        if path.exists():
            # remove leftover index/_category only trees
            rmdir_empty(path)
            if path.exists():
                # if only indexes left, remove them
                for p in sorted(path.rglob("*"), reverse=True):
                    if p.is_file() and p.name in {"_category_.json", "index.md"}:
                        # keep if sibling content exists
                        siblings = [x for x in p.parent.iterdir() if x != p]
                        contentish = [
                            x
                            for x in siblings
                            if x.suffix in {".md", ".mdx"} and x.name != "index.md"
                        ]
                        if not contentish and not any(x.is_dir() and any(x.iterdir()) for x in siblings if x.is_dir()):
                            p.unlink()
                rmdir_empty(path)
                if path.exists():
                    print(f"left non-empty: {rel} -> {list(path.iterdir())[:5]}")


def main() -> None:
    print("== stage new posts ==")
    stage_new_posts()
    print("== reverse taxonomy ==")
    reverse_taxonomy()
    print("== place staged posts ==")
    place_staged_posts()
    print("== group decisions ==")
    group_decisions()
    print("== restore categories ==")
    restore_categories()
    print("== restore home indexes ==")
    restore_home_index()
    print("== cleanup ==")
    cleanup_taxonomy_shells()
    if STAGING.exists():
        shutil.rmtree(STAGING)
    print("done")


if __name__ == "__main__":
    main()
