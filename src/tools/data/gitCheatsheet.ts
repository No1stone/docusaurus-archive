import type {CheatsheetEntry} from '../components/CheatsheetTool';

export const GIT_CHEATSHEET_ENTRIES: CheatsheetEntry[] = [
  {
    id: 'git-clone',
    category: '저장소',
    title: '원격 저장소 클론',
    command: 'git clone https://github.com/org/repo.git',
    note: '새 디렉터리에 전체 히스토리를 받습니다.',
  },
  {
    id: 'git-status',
    category: '상태',
    title: '작업 트리 상태',
    command: 'git status -sb',
    note: '짧은 형식으로 브랜치와 변경 파일을 봅니다.',
  },
  {
    id: 'git-add',
    category: '스테이징',
    title: '전체 스테이징',
    command: 'git add -A',
  },
  {
    id: 'git-commit',
    category: '커밋',
    title: '커밋 메시지 작성',
    command: 'git commit -m "feat: add user signup"',
  },
  {
    id: 'git-log',
    category: '히스토리',
    title: '최근 커밋 그래프',
    command: 'git log --oneline --graph -20',
  },
  {
    id: 'git-branch',
    category: '브랜치',
    title: '브랜치 만들고 이동',
    command: 'git switch -c feature/my-task',
  },
  {
    id: 'git-fetch',
    category: '동기화',
    title: '원격 갱신만',
    command: 'git fetch origin',
    note: '로컬 브랜치는 바꾸지 않고 참조만 업데이트합니다.',
  },
  {
    id: 'git-pull-rebase',
    category: '동기화',
    title: '리베이스 풀',
    command: 'git pull --rebase origin main',
  },
  {
    id: 'git-stash',
    category: '임시 저장',
    title: '스태시에 넣기',
    command: 'git stash push -m "wip"',
  },
  {
    id: 'git-stash-pop',
    category: '임시 저장',
    title: '스태시 꺼내기',
    command: 'git stash pop',
  },
  {
    id: 'git-diff',
    category: '비교',
    title: '스테이징과 워킹 트리',
    command: 'git diff',
  },
  {
    id: 'git-reset-soft',
    category: '되돌리기',
    title: '마지막 커밋만 취소(변경 유지)',
    command: 'git reset --soft HEAD~1',
    note: '푸시한 커밋에는 주의하세요.',
  },
  {
    id: 'git-cherry-pick',
    category: '히스토리',
    title: '특정 커밋만 가져오기',
    command: 'git cherry-pick <commit-sha>',
  },
  {
    id: 'git-remote-v',
    category: '원격',
    title: '원격 URL 확인',
    command: 'git remote -v',
  },
];