export type Person = {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'paused' | 'done';
  tags: string[];
};

export const PEOPLE: Person[] = [
  {id: '1', name: '김민수', role: '프론트엔드', status: 'active', tags: ['React', '접근성']},
  {id: '2', name: '이서연', role: '디자인', status: 'active', tags: ['UI', '모바일']},
  {id: '3', name: '박준호', role: '백엔드', status: 'paused', tags: ['API']},
  {id: '4', name: '최유진', role: 'QA', status: 'done', tags: ['테스트']},
  {id: '5', name: '정하늘', role: '프론트엔드', status: 'active', tags: ['React', '성능']},
  {id: '6', name: '한지아', role: '기획', status: 'paused', tags: ['요구사항']},
  {id: '7', name: '오세진', role: '백엔드', status: 'active', tags: ['DB']},
  {id: '8', name: '윤다은', role: '디자인', status: 'done', tags: ['프로토타입']},
];

export const CITIES = [
  '서울',
  '부산',
  '인천',
  '대구',
  '광주',
  '대전',
  '울산',
  '세종',
  '수원',
  '성남',
];

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
