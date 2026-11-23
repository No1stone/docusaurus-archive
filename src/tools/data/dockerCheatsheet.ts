import type {CheatsheetEntry} from '../components/CheatsheetTool';

export const DOCKER_CHEATSHEET_ENTRIES: CheatsheetEntry[] = [
  {
    id: 'docker-ps',
    category: '컨테이너',
    title: '실행 중 목록',
    command: 'docker ps',
  },
  {
    id: 'docker-ps-a',
    category: '컨테이너',
    title: '전체 목록',
    command: 'docker ps -a',
  },
  {
    id: 'docker-logs',
    category: '로그',
    title: '컨테이너 로그',
    command: 'docker logs -f --tail 200 <container>',
  },
  {
    id: 'docker-exec',
    category: '셸',
    title: '셸 접속',
    command: 'docker exec -it <container> /bin/sh',
  },
  {
    id: 'docker-run',
    category: '실행',
    title: '이미지 한 번 실행',
    command: 'docker run --rm -p 8080:80 nginx:alpine',
  },
  {
    id: 'docker-build',
    category: '빌드',
    title: '이미지 빌드',
    command: 'docker build -t myapp:local .',
  },
  {
    id: 'docker-compose-up',
    category: 'Compose',
    title: '백그라운드 기동',
    command: 'docker compose up -d',
  },
  {
    id: 'docker-compose-logs',
    category: 'Compose',
    title: '서비스 로그',
    command: 'docker compose logs -f api',
  },
  {
    id: 'docker-prune',
    category: '정리',
    title: '미사용 리소스 삭제',
    command: 'docker system prune -f',
    note: '사용하지 않는 이미지·컨테이너가 삭제됩니다.',
  },
  {
    id: 'docker-inspect',
    category: '진단',
    title: '상세 정보',
    command: 'docker inspect <container>',
  },
  {
    id: 'docker-stats',
    category: '진단',
    title: '리소스 사용량',
    command: 'docker stats',
  },
  {
    id: 'docker-tag-push',
    category: '레지스트리',
    title: '태그 후 푸시',
    command: 'docker tag myapp:local registry.example.com/myapp:v1 && docker push registry.example.com/myapp:v1',
  },
];