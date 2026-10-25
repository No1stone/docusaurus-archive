---
format: md
id: k-git-alias
title: "git alias"
description: "git alias"
tags:
  - Git
status: active
slug: /knowledge/k-git-alias
---
# git alias

```jsx
cat << 'EOF' >> ~/.zshrc

# 👉 Git 유틸리티 alias 등록
alias gl="git log --oneline --graph --decorate --all"

alias gdel='function _gdel() {
  if [ -z "$1" ]; then echo "❗ 삭제할 브랜치명을 입력하세요."; return 1; fi
  if [ "$(git rev-parse --abbrev-ref HEAD)" == "$1" ]; then echo "❌ 현재 브랜치는 삭제할 수 없습니다."; return 1; fi
  git branch -D "$1" && echo "🧹 로컬 브랜치 $1 삭제 완료"
  git push origin --delete "$1" && echo "🌐 원격 브랜치 $1 삭제 완료"
}; _gdel'

EOF

```

```jsx
source ~/.zshrc

```
