export type DemoMeta = {
  id: string;
  /** Page H1 / AI request name — include English in parentheses when useful. */
  title: string;
  /** Short sidebar label when title is long. Defaults to title. */
  sidebarLabel?: string;
  /** Canonical English name for search / AI prompts. */
  english: string;
  categoryDir: string;
  categoryLabel: string;
  slug: string;
  guide: string;
  mock?: boolean;
  /** Named UI pieces on the screen (compound demos). */
  elements?: string[];
  /** Pattern demos that combine multiple elements. */
  pattern?: boolean;
};

/** Canonical demo list — sidebar pages and registry keys. URLs (slug) stay stable. */
export const UI_DEMOS: DemoMeta[] = [
  // 01 layout
  {id: 'header', categoryDir: '01-layout', categoryLabel: '화면 골격과 레이아웃', title: '헤더 (Header)', english: 'Header', slug: 'header', guide: '데모 영역 안 상단 헤더의 로고와 동작을 확인합니다. 사이트 전역 헤더와 별개입니다.'},
  {id: 'sticky-header', categoryDir: '01-layout', categoryLabel: '화면 골격과 레이아웃', title: '스티키 헤더 (Sticky Header)', sidebarLabel: '스티키 헤더', english: 'Sticky Header', slug: 'sticky-header', guide: '데모 스크롤 영역 안에서만 헤더가 고정됩니다. 테이블 헤더 고정은 데이터 테이블 데모를 봅니다.'},
  {id: 'sidebar', categoryDir: '01-layout', categoryLabel: '화면 골격과 레이아웃', title: '사이드바 (Sidebar)', english: 'Sidebar', slug: 'sidebar', guide: '접기와 펼치기로 본문 폭 변화를 확인합니다.'},
  {id: 'footer', categoryDir: '01-layout', categoryLabel: '화면 골격과 레이아웃', title: '푸터 (Footer)', english: 'Footer', slug: 'footer', guide: '데모 스크롤 끝의 푸터 링크와 여백을 확인합니다.'},
  {id: 'sticky-action-bar', categoryDir: '01-layout', categoryLabel: '화면 골격과 레이아웃', title: '스티키 액션 바 (Sticky Action Bar)', sidebarLabel: '스티키 액션 바', english: 'Sticky Action Bar', slug: 'sticky-action-bar', guide: '스크롤해도 하단 저장/취소 바가 영역에 남는지 확인합니다.'},
  {id: 'columns', categoryDir: '01-layout', categoryLabel: '화면 골격과 레이아웃', title: '단일·다중 열 (Columns)', sidebarLabel: '단일·다중 열', english: 'Columns', slug: 'columns', guide: '폭 옵션을 바꿔 한 열과 여러 열 배치를 비교합니다.'},
  {id: 'split-panel', categoryDir: '01-layout', categoryLabel: '화면 골격과 레이아웃', title: '분할 패널 (Split Panel)', english: 'Split Panel', slug: 'split-panel', guide: '가운데 핸들을 드래그해 좌우 비율을 바꿉니다. Resizable panes.'},
  {id: 'list-detail', categoryDir: '01-layout', categoryLabel: '화면 골격과 레이아웃', title: '목록·상세 (Master-Detail)', sidebarLabel: '목록·상세', english: 'Master-Detail', slug: 'list-detail', guide: '목록에서 항목을 고르면 상세 패널이 채워집니다.'},
  {id: 'responsive-grid', categoryDir: '01-layout', categoryLabel: '화면 골격과 레이아웃', title: '반응형 그리드 (Responsive Grid)', sidebarLabel: '반응형 그리드', english: 'Responsive Grid', slug: 'responsive-grid', guide: '데모 폭을 줄이며 카드 열이 재배치되는지 확인합니다.'},
  {id: 'bento-grid', categoryDir: '01-layout', categoryLabel: '화면 골격과 레이아웃', title: '벤토 그리드 (Bento Grid)', english: 'Bento Grid', slug: 'bento-grid', guide: '크기가 다른 타일 배치를 스크롤하며 확인합니다.'},

  // 02 navigation
  {id: 'top-menu', categoryDir: '02-navigation', categoryLabel: '내비게이션', title: '상단 메뉴 (Top Navigation)', sidebarLabel: '상단 메뉴', english: 'Top Navigation', slug: 'top-menu', guide: '메뉴를 눌러 활성 항목이 바뀌는지 확인합니다.'},
  {id: 'hamburger-menu', categoryDir: '02-navigation', categoryLabel: '내비게이션', title: '햄버거 메뉴 (Hamburger Menu)', sidebarLabel: '햄버거 메뉴', english: 'Hamburger Menu', slug: 'hamburger-menu', guide: '햄버거로 오버레이 메뉴를 열고 항목을 고른 뒤 닫습니다.'},
  {id: 'bottom-nav', categoryDir: '02-navigation', categoryLabel: '내비게이션', title: '하단 내비 (Bottom Navigation)', sidebarLabel: '하단 내비', english: 'Bottom Navigation', slug: 'bottom-nav', guide: '하단 탭을 눌러 화면 라벨이 바뀌는지 확인합니다.'},
  {id: 'tabs', categoryDir: '02-navigation', categoryLabel: '내비게이션', title: '탭 (Tabs)', english: 'Tabs', slug: 'tabs', guide: '탭을 바꿔 패널 내용만 교체되는지 확인합니다.'},
  {id: 'breadcrumb', categoryDir: '02-navigation', categoryLabel: '내비게이션', title: '브레드크럼 (Breadcrumb)', english: 'Breadcrumb', slug: 'breadcrumb', guide: '경로 조각을 눌러 상위 위치로 이동합니다.'},
  {id: 'accordion-menu', categoryDir: '02-navigation', categoryLabel: '내비게이션', title: '아코디언 (Accordion)', english: 'Accordion', slug: 'accordion-menu', guide: '그룹을 펼치고 접어 하위 항목을 드러냅니다.'},
  {id: 'stepper', categoryDir: '02-navigation', categoryLabel: '내비게이션', title: '스텝퍼 (Stepper)', english: 'Stepper', slug: 'stepper', guide: '다음/이전으로 단계를 이동하고 완료 표시를 확인합니다.'},
  {id: 'page-toc', categoryDir: '02-navigation', categoryLabel: '내비게이션', title: '페이지 목차 (Table of Contents)', sidebarLabel: '페이지 목차', english: 'Table of Contents', slug: 'page-toc', guide: '목차 항목을 눌러 데모 안 구역으로 스크롤합니다.'},
  {id: 'pagination', categoryDir: '02-navigation', categoryLabel: '내비게이션', title: '페이지네이션 (Pagination)', english: 'Pagination', slug: 'pagination', guide: '페이지 번호로 목록 구간을 바꿉니다. 무한 스크롤은 별도 데모입니다.'},
  {id: 'load-more', categoryDir: '02-navigation', categoryLabel: '내비게이션', title: '더 보기 (Load More)', english: 'Load More', slug: 'load-more', guide: '더 보기를 눌러 다음 묶음이 이어 붙는지 확인합니다.'},

  // 03 controls
  {id: 'button', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '버튼 (Button)', english: 'Button', slug: 'button', guide: '기본/강조/비활성 버튼을 눌러 상태 차이를 확인합니다.'},
  {id: 'icon-button', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '아이콘 버튼 (Icon Button)', english: 'Icon Button', slug: 'icon-button', guide: '아이콘 버튼을 눌러 aria-label 안내를 확인합니다.'},
  {id: 'fab', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '플로팅 액션 버튼 (FAB)', sidebarLabel: 'FAB', english: 'Floating Action Button', slug: 'fab', guide: '스크롤 중 FAB를 눌러 동작이 실행되는지 확인합니다.'},
  {id: 'button-group', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '버튼 그룹 (Button Group)', english: 'Button Group', slug: 'button-group', guide: '묶인 버튼 중 하나를 골라 선택 상태를 유지합니다.'},
  {id: 'segmented', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '세그먼트 컨트롤 (Segmented Control)', sidebarLabel: '세그먼트', english: 'Segmented Control', slug: 'segmented', guide: '세그먼트를 바꿔 보기 모드가 바뀌는지 확인합니다.'},
  {id: 'text-input', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '텍스트 필드 (Text Field)', sidebarLabel: '텍스트 필드', english: 'Text Field', slug: 'text-input', guide: '한 줄 입력, 지우기, 글자 수 표시를 확인합니다.'},
  {id: 'textarea', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '텍스트 영역 (Textarea)', sidebarLabel: '텍스트 영역', english: 'Textarea', slug: 'textarea', guide: '여러 줄 입력과 높이 변화를 확인합니다.'},
  {id: 'checkbox-select-all', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '체크박스 (Checkbox)', english: 'Checkbox', slug: 'checkbox-select-all', guide: '개별/전체 선택과 중간(indeterminate) 상태를 확인합니다.', elements: ['체크박스 (Checkbox)', '전체 선택 (Select All)']},
  {id: 'radio', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '라디오 (Radio)', english: 'Radio', slug: 'radio', guide: '배타적 선택지 중 하나만 고를 수 있는지 확인합니다.'},
  {id: 'toggle', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '토글 스위치 (Switch)', sidebarLabel: '토글 스위치', english: 'Switch', slug: 'toggle', guide: '스위치를 켜고 끄며 즉시 반영을 확인합니다.'},
  {id: 'select', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '셀렉트 (Select)', english: 'Select', slug: 'select', guide: '목록에서 항목을 고릅니다.'},
  {id: 'combobox', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '콤보박스 (Combobox)', english: 'Combobox', slug: 'combobox', guide: '직접 입력과 목록 선택을 섞어 값을 정합니다.'},
  {id: 'autocomplete', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '자동완성 (Autocomplete)', english: 'Autocomplete', slug: 'autocomplete', guide: '글자를 치며 제안을 고릅니다. 목록 검색 데모는 결과 갱신 흐름을 봅니다.'},
  {id: 'slider', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '슬라이더 (Slider)', english: 'Slider', slug: 'slider', guide: '핸들을 끌어 숫자 값이 바뀌는지 확인합니다.'},
  {id: 'number-input', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '숫자 입력 (Number Input)', english: 'Number Input', slug: 'number-input', guide: '스텝 버튼과 직접 입력으로 범위를 지킵니다.'},
  {id: 'date-picker', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '날짜 피커 (Date Picker)', english: 'Date Picker', slug: 'date-picker', guide: '날짜를 고르고 표시 형식을 확인합니다.'},
  {id: 'time-picker', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '시간 피커 (Time Picker)', english: 'Time Picker', slug: 'time-picker', guide: '시간을 고르고 값을 확인합니다.'},
  {id: 'date-range', categoryDir: '03-controls', categoryLabel: '버튼과 입력 컨트롤', title: '날짜 범위 피커 (Date Range Picker)', sidebarLabel: '날짜 범위', english: 'Date Range Picker', slug: 'date-range', guide: '시작/종료를 고르고 잘못된 범위를 막아 봅니다.'},

  // 04 forms
  {id: 'required-hint', categoryDir: '04-forms', categoryLabel: '폼과 검증', title: '필수 표시 (Required Indicator)', sidebarLabel: '필수 표시', english: 'Required Indicator', slug: 'required-hint', guide: '필수 표시(*)와 제출 전 안내를 확인합니다.', elements: ['필수 표시 (Required Indicator)', '텍스트 필드 (Text Field)']},
  {id: 'inline-validation', categoryDir: '04-forms', categoryLabel: '폼과 검증', title: '인라인 검증 (Inline Validation)', sidebarLabel: '인라인 검증', english: 'Inline Validation', slug: 'inline-validation', guide: '잘못된 값 아래 필드 오류가 뜨는지 확인합니다.', pattern: true, elements: ['텍스트 필드 (Text Field)', '인라인 메시지 (Inline Message)']},
  {id: 'error-summary', categoryDir: '04-forms', categoryLabel: '폼과 검증', title: '오류 요약 (Error Summary)', sidebarLabel: '오류 요약', english: 'Error Summary', slug: 'error-summary', guide: '제출 실패 시 요약에서 첫 오류 필드로 이동합니다.', pattern: true, elements: ['오류 요약 (Error Summary)', '텍스트 필드 (Text Field)']},
  {id: 'password-reveal', categoryDir: '04-forms', categoryLabel: '폼과 검증', title: '비밀번호 필드 (Password Field)', sidebarLabel: '비밀번호 필드', english: 'Password Field', slug: 'password-reveal', guide: '보기 아이콘으로 가리기/표시를 전환합니다.'},
  {id: 'otp-input', categoryDir: '04-forms', categoryLabel: '폼과 검증', title: 'OTP 입력 (OTP Input)', english: 'OTP Input', slug: 'otp-input', guide: '칸 단위 입력과 자동 이동을 확인합니다.'},
  {id: 'dynamic-rows', categoryDir: '04-forms', categoryLabel: '폼과 검증', title: '동적 폼 행 (Dynamic Form Rows)', sidebarLabel: '동적 폼 행', english: 'Dynamic Form Rows', slug: 'dynamic-rows', guide: '행을 추가/삭제한 뒤 값이 유지되는지 확인합니다.', pattern: true, elements: ['텍스트 필드 (Text Field)', '버튼 (Button)']},
  {id: 'multi-step-form', categoryDir: '04-forms', categoryLabel: '폼과 검증', title: '멀티스텝 폼 (Multi-step Form)', sidebarLabel: '멀티스텝 폼', english: 'Multi-step Form', slug: 'multi-step-form', guide: '단계 이동 시 이전 값이 보존되는지 확인합니다.', pattern: true, elements: ['스텝퍼 (Stepper)', '텍스트 필드 (Text Field)', '셀렉트 (Select)']},
  {id: 'save-result', categoryDir: '04-forms', categoryLabel: '폼과 검증', title: '저장 피드백 (Save Feedback)', sidebarLabel: '저장 피드백', english: 'Save Feedback', slug: 'save-result', guide: '클릭→눌림→처리 중→성공/실패를 재현합니다.', mock: true, pattern: true, elements: ['버튼 (Button)', '인라인 메시지 (Inline Message)']},
  {id: 'unsaved-leave', categoryDir: '04-forms', categoryLabel: '폼과 검증', title: '이탈 확인 (Unsaved Changes)', sidebarLabel: '이탈 확인', english: 'Unsaved Changes Guard', slug: 'unsaved-leave', guide: '값을 바꾼 뒤 나가기에서 확인 대화를 받습니다.', pattern: true, elements: ['확인 다이얼로그 (Confirm Dialog)', '텍스트 영역 (Textarea)']},

  // 05 display
  {id: 'card', categoryDir: '05-display', categoryLabel: '정보 표시', title: '카드 (Card)', english: 'Card', slug: 'card', guide: '카드 제목, 본문, 동작을 확인합니다.'},
  {id: 'list', categoryDir: '05-display', categoryLabel: '정보 표시', title: '리스트 (List)', english: 'List', slug: 'list', guide: '행을 선택해 강조 상태를 확인합니다.'},
  {id: 'badge', categoryDir: '05-display', categoryLabel: '정보 표시', title: '배지 (Badge)', english: 'Badge', slug: 'badge', guide: '상태·수치를 표시하는 읽기 전용 배지입니다. 선택형 칩·알림 배지와 구분합니다.'},
  {id: 'chip', categoryDir: '05-display', categoryLabel: '정보 표시', title: '칩 (Chip)', english: 'Chip', slug: 'chip', guide: '눌러 선택하거나 제거할 수 있는 칩입니다. 배지(읽기 전용)·태그(분류 라벨)와 다릅니다. 필터 칩은 검색 카테고리를 봅니다.'},
  {id: 'tag', categoryDir: '05-display', categoryLabel: '정보 표시', title: '태그 (Tag)', english: 'Tag', slug: 'tag', guide: '읽기 전용 분류 라벨입니다. 칩처럼 선택하지 않습니다.'},
  {id: 'avatar', categoryDir: '05-display', categoryLabel: '정보 표시', title: '아바타 (Avatar)', english: 'Avatar', slug: 'avatar', guide: '이니셜/폴백과 겹치는 아바타 그룹을 확인합니다.', elements: ['아바타 (Avatar)', '아바타 그룹 (Avatar Group)']},
  {id: 'divider', categoryDir: '05-display', categoryLabel: '정보 표시', title: '구분선 (Divider)', english: 'Divider', slug: 'divider', guide: '구역을 나누는 선과 여백을 확인합니다.'},
  {id: 'description-list', categoryDir: '05-display', categoryLabel: '정보 표시', title: '설명 목록 (Description List)', sidebarLabel: '설명 목록', english: 'Description List', slug: 'description-list', guide: '라벨-값 쌍 정렬을 확인합니다.'},
  {id: 'timeline', categoryDir: '05-display', categoryLabel: '정보 표시', title: '타임라인 (Timeline)', english: 'Timeline', slug: 'timeline', guide: '이벤트를 시간 순으로 스크롤합니다.'},
  {id: 'expand-detail', categoryDir: '05-display', categoryLabel: '정보 표시', title: '디스클로저 (Disclosure)', sidebarLabel: '디스클로저', english: 'Disclosure', slug: 'expand-detail', guide: '요약/상세를 접고 펼칩니다. details/summary 패턴입니다.'},
  {id: 'stat-card', categoryDir: '05-display', categoryLabel: '정보 표시', title: '수치 카드 (Stat Card)', english: 'Stat Card', slug: 'stat-card', guide: '핵심 숫자와 증감 표시를 확인합니다.'},
  {id: 'chart-legend', categoryDir: '05-display', categoryLabel: '정보 표시', title: '차트·범례 (Chart & Legend)', sidebarLabel: '차트·범례', english: 'Chart Legend', slug: 'chart-legend', guide: '범례를 눌러 시리즈를 숨기고 켭니다.', elements: ['차트 (Chart)', '범례 (Legend)']},

  // 06 search-table
  {id: 'list-search', categoryDir: '06-search-table', categoryLabel: '검색, 필터, 데이터 테이블', title: '목록 검색 (List Search)', sidebarLabel: '목록 검색', english: 'List Search', slug: 'list-search', guide: '검색 입력에 따라 목록이 즉시 갱신됩니다. 자동완성과 달리 결과 목록 필터에 초점을 둡니다.', pattern: true, elements: ['검색 필드 (Search Field)', '리스트 (List)']},
  {id: 'filter-chips', categoryDir: '06-search-table', categoryLabel: '검색, 필터, 데이터 테이블', title: '필터 칩 (Filter Chips)', english: 'Filter Chips', slug: 'filter-chips', guide: '칩으로 목록을 좁히고 한 번에 초기화합니다.', pattern: true, elements: ['칩 (Chip)', '리스트 (List)', '초기화 버튼 (Button)']},
  {id: 'sort', categoryDir: '06-search-table', categoryLabel: '검색, 필터, 데이터 테이블', title: '정렬 (Sort)', english: 'Sort', slug: 'sort', guide: '오름/내림차순을 전환합니다.'},
  {id: 'infinite-scroll', categoryDir: '06-search-table', categoryLabel: '검색, 필터, 데이터 테이블', title: '무한 스크롤 (Infinite Scroll)', sidebarLabel: '무한 스크롤', english: 'Infinite Scroll', slug: 'infinite-scroll', guide: '끝으로 스크롤하면 다음 묶음이 모의 로딩됩니다.', mock: true, pattern: true},
  {id: 'bulk-actions', categoryDir: '06-search-table', categoryLabel: '검색, 필터, 데이터 테이블', title: '일괄 작업 (Bulk Actions)', sidebarLabel: '일괄 작업', english: 'Bulk Actions', slug: 'bulk-actions', guide: '여러 행을 고른 뒤 일괄 동작을 실행합니다.', pattern: true, elements: ['체크박스 (Checkbox)', '버튼 (Button)']},
  {id: 'sticky-table', categoryDir: '06-search-table', categoryLabel: '검색, 필터, 데이터 테이블', title: '고정 테이블 헤더 (Sticky Table Header)', sidebarLabel: '고정 테이블 헤더', english: 'Sticky Table Header', slug: 'sticky-table', guide: '스크롤해도 헤더·첫 열이 남는지 확인합니다.', elements: ['테이블 (Table)', '스티키 헤더 (Sticky Header)']},
  {id: 'column-config', categoryDir: '06-search-table', categoryLabel: '검색, 필터, 데이터 테이블', title: '열 설정 (Column Config)', english: 'Column Config', slug: 'column-config', guide: '열을 숨기고 순서를 바꿉니다.', pattern: true},
  {id: 'row-expand', categoryDir: '06-search-table', categoryLabel: '검색, 필터, 데이터 테이블', title: '행 확장 (Expandable Row)', sidebarLabel: '행 확장', english: 'Expandable Row', slug: 'row-expand', guide: '행을 펼쳐 상세를 확인합니다.'},
  {id: 'inline-edit', categoryDir: '06-search-table', categoryLabel: '검색, 필터, 데이터 테이블', title: '인라인 편집 (Inline Edit)', english: 'Inline Edit', slug: 'inline-edit', guide: '셀을 고쳐 값이 반영되는지 확인합니다.', elements: ['텍스트 필드 (Text Field)', '테이블 (Table)']},
  {id: 'narrow-table', categoryDir: '06-search-table', categoryLabel: '검색, 필터, 데이터 테이블', title: '반응형 테이블 (Responsive Table)', sidebarLabel: '반응형 테이블', english: 'Responsive Table', slug: 'narrow-table', guide: '폭을 줄여 카드형 대체 보기를 확인합니다.', pattern: true, elements: ['테이블 (Table)', '카드 (Card)']},

  // 07 overlays
  {id: 'modal', categoryDir: '07-overlays', categoryLabel: '오버레이와 보조 화면', title: '모달 (Modal)', english: 'Modal', slug: 'modal', guide: '중앙 모달을 열고 Esc/바깥 클릭/버튼으로 닫습니다. 닫으면 열기 버튼으로 포커스가 돌아옵니다. 드로어·바텀 시트와 위치를 비교하세요.'},
  {id: 'confirm-dialog', categoryDir: '07-overlays', categoryLabel: '오버레이와 보조 화면', title: '확인 다이얼로그 (Confirm Dialog)', sidebarLabel: '확인 다이얼로그', english: 'Confirm Dialog', slug: 'confirm-dialog', guide: '삭제 확인에서 취소와 확인을 각각 눌러 봅니다. 일반 모달보다 결정 동작에 초점을 둡니다.'},
  {id: 'drawer', categoryDir: '07-overlays', categoryLabel: '오버레이와 보조 화면', title: '드로어 (Drawer)', english: 'Drawer', slug: 'drawer', guide: '옆에서 열리는 패널입니다. 모달(중앙)·바텀 시트(하단)와 비교하세요.'},
  {id: 'bottom-sheet', categoryDir: '07-overlays', categoryLabel: '오버레이와 보조 화면', title: '바텀 시트 (Bottom Sheet)', english: 'Bottom Sheet', slug: 'bottom-sheet', guide: '아래에서 올라오는 시트입니다. 모달·드로어와 비교하세요.'},
  {id: 'tooltip', categoryDir: '07-overlays', categoryLabel: '오버레이와 보조 화면', title: '툴팁 (Tooltip)', english: 'Tooltip', slug: 'tooltip', guide: '호버/포커스로 짧은 설명을 띄웁니다. 팝오버보다 단순합니다.'},
  {id: 'popover', categoryDir: '07-overlays', categoryLabel: '오버레이와 보조 화면', title: '팝오버 (Popover)', english: 'Popover', slug: 'popover', guide: '앵커 옆 패널에서 부가 정보를 봅니다. 툴팁보다 내용이 깁니다.'},
  {id: 'dropdown-menu', categoryDir: '07-overlays', categoryLabel: '오버레이와 보조 화면', title: '드롭다운 메뉴 (Dropdown Menu)', sidebarLabel: '드롭다운 메뉴', english: 'Dropdown Menu', slug: 'dropdown-menu', guide: '트리거로 메뉴를 열어 항목을 고릅니다.'},
  {id: 'context-menu', categoryDir: '07-overlays', categoryLabel: '오버레이와 보조 화면', title: '컨텍스트 메뉴 (Context Menu)', sidebarLabel: '컨텍스트 메뉴', english: 'Context Menu', slug: 'context-menu', guide: '우클릭 또는 대체 버튼으로 메뉴를 엽니다.'},
  {id: 'fullscreen-preview', categoryDir: '07-overlays', categoryLabel: '오버레이와 보조 화면', title: '라이트박스 (Lightbox)', sidebarLabel: '라이트박스', english: 'Lightbox', slug: 'fullscreen-preview', guide: '미리보기를 전체 화면으로 열고 닫습니다.'},

  // 08 feedback
  {id: 'toast', categoryDir: '08-feedback', categoryLabel: '알림과 피드백', title: '토스트 (Toast)', english: 'Toast', slug: 'toast', guide: '짧은 알림이 나타났다 자동으로 사라집니다. 실행 취소 버튼이 있는 스낵바와 구분합니다.'},
  {id: 'snackbar-undo', categoryDir: '08-feedback', categoryLabel: '알림과 피드백', title: '스낵바 (Snackbar)', english: 'Snackbar', slug: 'snackbar-undo', guide: '삭제 후 실행 취소 액션이 있는 스낵바입니다. 토스트(자동 소멸, 액션 없음)와 다릅니다.'},
  {id: 'inline-message', categoryDir: '08-feedback', categoryLabel: '알림과 피드백', title: '인라인 메시지 (Inline Message)', sidebarLabel: '인라인 메시지', english: 'Inline Message', slug: 'inline-message', guide: '패널 안 고정 안내 메시지를 확인합니다.'},
  {id: 'announcement-banner', categoryDir: '08-feedback', categoryLabel: '알림과 피드백', title: '배너 (Banner)', english: 'Banner', slug: 'announcement-banner', guide: '상단 공지 배너를 닫을 수 있습니다.'},
  {id: 'copy-feedback', categoryDir: '08-feedback', categoryLabel: '알림과 피드백', title: '복사 피드백 (Copy Feedback)', sidebarLabel: '복사 피드백', english: 'Copy Feedback', slug: 'copy-feedback', guide: '복사 버튼 후 완료 표시를 확인합니다.', mock: true, pattern: true, elements: ['버튼 (Button)', '인라인 메시지 (Inline Message)']},
  {id: 'notification-badge', categoryDir: '08-feedback', categoryLabel: '알림과 피드백', title: '알림 배지 (Notification Badge)', sidebarLabel: '알림 배지', english: 'Notification Badge', slug: 'notification-badge', guide: '아이콘 위 미확인 개수 배지입니다. 일반 상태 배지와 역할이 다릅니다.'},
  {id: 'notification-center', categoryDir: '08-feedback', categoryLabel: '알림과 피드백', title: '알림 센터 (Notification Center)', sidebarLabel: '알림 센터', english: 'Notification Center', slug: 'notification-center', guide: '알림을 읽으면 미확인 건수가 줄어듭니다.', pattern: true, elements: ['알림 배지 (Notification Badge)', '리스트 (List)']},

  // 09 loading
  {id: 'button-pending', categoryDir: '09-loading-states', categoryLabel: '로딩과 화면 상태', title: '버튼 로딩 (Button Loading)', sidebarLabel: '버튼 로딩', english: 'Button Loading', slug: 'button-pending', guide: '저장을 눌러 대기 잠금을 확인합니다.', mock: true, elements: ['버튼 (Button)']},
  {id: 'spinner', categoryDir: '09-loading-states', categoryLabel: '로딩과 화면 상태', title: '스피너 (Spinner)', english: 'Spinner', slug: 'spinner', guide: '짧은 대기 스피너를 켭니다.', mock: true},
  {id: 'skeleton', categoryDir: '09-loading-states', categoryLabel: '로딩과 화면 상태', title: '스켈레톤 (Skeleton)', english: 'Skeleton', slug: 'skeleton', guide: '콘텐츠 모양 스켈레톤을 확인합니다.'},
  {id: 'progress', categoryDir: '09-loading-states', categoryLabel: '로딩과 화면 상태', title: '프로그레스 바 (Progress Bar)', sidebarLabel: '프로그레스 바', english: 'Progress Bar', slug: 'progress', guide: '진행 바 값이 갱신되는지 확인합니다. 업로드 흐름의 프로그레스 바는 파일 카테고리도 봅니다.', mock: true},
  {id: 'empty-first', categoryDir: '09-loading-states', categoryLabel: '로딩과 화면 상태', title: '빈 상태 (Empty State)', sidebarLabel: '빈 상태', english: 'Empty State', slug: 'empty-first', guide: '첫 방문 빈 상태 안내와 시작 동작을 확인합니다.', pattern: true},
  {id: 'empty-search', categoryDir: '09-loading-states', categoryLabel: '로딩과 화면 상태', title: '검색 결과 없음 (No Results)', sidebarLabel: '검색 결과 없음', english: 'No Results', slug: 'empty-search', guide: '결과 없음 안내를 확인합니다.', pattern: true, elements: ['검색 필드 (Search Field)', '빈 상태 (Empty State)']},
  {id: 'partial-state', categoryDir: '09-loading-states', categoryLabel: '로딩과 화면 상태', title: '부분 로딩·실패 (Partial State)', sidebarLabel: '부분 로딩·실패', english: 'Partial Loading / Failure', slug: 'partial-state', guide: '구역마다 다른 상태를 확인합니다.', mock: true, pattern: true, elements: ['스켈레톤 (Skeleton)', '인라인 메시지 (Inline Message)', '버튼 (Button)']},
  {id: 'error-retry', categoryDir: '09-loading-states', categoryLabel: '로딩과 화면 상태', title: '오류·재시도 (Error & Retry)', sidebarLabel: '오류·재시도', english: 'Error & Retry', slug: 'error-retry', guide: '실패 후 재시도로 복구합니다.', mock: true, pattern: true, elements: ['인라인 메시지 (Inline Message)', '버튼 (Button)']},
  {id: 'offline', categoryDir: '09-loading-states', categoryLabel: '로딩과 화면 상태', title: '오프라인 배너 (Offline Banner)', sidebarLabel: '오프라인', english: 'Offline Banner', slug: 'offline', guide: '오프라인/재연결 안내를 전환합니다.', mock: true, pattern: true, elements: ['배너 (Banner)', '버튼 (Button)']},
  {id: 'forbidden', categoryDir: '09-loading-states', categoryLabel: '로딩과 화면 상태', title: '권한 없음 (Forbidden)', english: 'Forbidden / 403', slug: 'forbidden', guide: '권한 없음 안내를 확인합니다.', pattern: true},

  // 10 interaction
  {id: 'press-feedback', categoryDir: '10-interaction-motion', categoryLabel: '인터랙션과 모션', title: '프레스 피드백 (Press Feedback)', sidebarLabel: '프레스 피드백', english: 'Press Feedback', slug: 'press-feedback', guide: '누르고 뗄 때 시각 피드백을 확인합니다.'},
  {id: 'hover-focus', categoryDir: '10-interaction-motion', categoryLabel: '인터랙션과 모션', title: '호버·포커스 (Hover & Focus)', sidebarLabel: '호버·포커스', english: 'Hover & Focus', slug: 'hover-focus', guide: '마우스 호버와 키보드 포커스를 비교합니다.'},
  {id: 'collapse', categoryDir: '10-interaction-motion', categoryLabel: '인터랙션과 모션', title: '콜랩스 (Collapse)', english: 'Collapse', slug: 'collapse', guide: '패널을 접고 펴며 높이 변화를 확인합니다.'},
  {id: 'list-enter', categoryDir: '10-interaction-motion', categoryLabel: '인터랙션과 모션', title: '리스트 등장 (List Enter)', sidebarLabel: '리스트 등장', english: 'List Enter Animation', slug: 'list-enter', guide: '목록 등장 연출을 재생합니다. prefers-reduced-motion을 존중합니다.'},
  {id: 'view-transition', categoryDir: '10-interaction-motion', categoryLabel: '인터랙션과 모션', title: '뷰 전환 (View Transition)', english: 'View Transition', slug: 'view-transition', guide: '화면 A/B 전환을 확인합니다.'},
  {id: 'drag-sort', categoryDir: '10-interaction-motion', categoryLabel: '인터랙션과 모션', title: '드래그 정렬 (Drag Sort)', english: 'Drag Sort', slug: 'drag-sort', guide: '드래그 또는 키보드 위/아래로 순서를 바꿉니다.'},
  {id: 'swipe-action', categoryDir: '10-interaction-motion', categoryLabel: '인터랙션과 모션', title: '스와이프 액션 (Swipe Action)', sidebarLabel: '스와이프 액션', english: 'Swipe Action', slug: 'swipe-action', guide: '행을 밀어 삭제 동작을 드러냅니다.'},
  {id: 'long-press', categoryDir: '10-interaction-motion', categoryLabel: '인터랙션과 모션', title: '롱프레스 (Long Press)', english: 'Long Press', slug: 'long-press', guide: '길게 눌러 메뉴를 켭니다.'},
  {id: 'pull-refresh', categoryDir: '10-interaction-motion', categoryLabel: '인터랙션과 모션', title: '당겨서 새로고침 (Pull to Refresh)', sidebarLabel: '당겨서 새로고침', english: 'Pull to Refresh', slug: 'pull-refresh', guide: '버튼으로 새로고침 흐름을 재현합니다.', mock: true},
  {id: 'reduced-motion', categoryDir: '10-interaction-motion', categoryLabel: '인터랙션과 모션', title: '모션 줄이기 (Reduced Motion)', sidebarLabel: '모션 줄이기', english: 'Reduced Motion', slug: 'reduced-motion', guide: '모션 줄이기 옵션을 켜 애니메이션이 약해지는지 확인합니다.'},

  // 11 files
  {id: 'file-drop', categoryDir: '11-files-media', categoryLabel: '파일과 미디어', title: '파일 피커·드롭존 (File Picker & Drop Zone)', sidebarLabel: '파일 피커·드롭존', english: 'File Picker & Drop Zone', slug: 'file-drop', guide: '파일 선택과 드래그 앤 드롭으로 파일을 고릅니다. 업로드 진행은 프로그레스 바 데모를 봅니다.', mock: true, elements: ['파일 선택 (File Picker)', '드롭존 (Drop Zone)']},
  {id: 'file-validation', categoryDir: '11-files-media', categoryLabel: '파일과 미디어', title: '파일 검증 (File Validation)', english: 'File Validation', slug: 'file-validation', guide: '허용되지 않은 형식·용량에서 오류를 확인합니다.', mock: true, pattern: true, elements: ['파일 선택 (File Picker)', '인라인 메시지 (Inline Message)']},
  {id: 'upload-progress', categoryDir: '11-files-media', categoryLabel: '파일과 미디어', title: '업로드 프로그레스 (Upload Progress)', sidebarLabel: '업로드 프로그레스', english: 'Upload Progress', slug: 'upload-progress', guide: '프로그레스 바가 갱신되며 취소·실패·재시도를 재현합니다. 단독 프로그레스 바는 로딩 카테고리도 봅니다.', mock: true, pattern: true, elements: ['프로그레스 바 (Progress Bar)', '버튼 (Button)']},
  {id: 'attachment-list', categoryDir: '11-files-media', categoryLabel: '파일과 미디어', title: '첨부 목록 (Attachment List)', english: 'Attachment List', slug: 'attachment-list', guide: '첨부 다운로드를 실행합니다.', mock: true, pattern: true, elements: ['리스트 (List)', '버튼 (Button)']},
  {id: 'image-zoom', categoryDir: '11-files-media', categoryLabel: '파일과 미디어', title: '이미지 줌 (Image Zoom)', english: 'Image Zoom', slug: 'image-zoom', guide: '미리보기를 열고 확대합니다.', elements: ['이미지 (Image)', '라이트박스 (Lightbox)']},
  {id: 'gallery', categoryDir: '11-files-media', categoryLabel: '파일과 미디어', title: '갤러리 (Gallery)', english: 'Gallery', slug: 'gallery', guide: '썸네일 그리드에서 이미지를 고릅니다.'},
  {id: 'carousel', categoryDir: '11-files-media', categoryLabel: '파일과 미디어', title: '캐러셀 (Carousel)', english: 'Carousel', slug: 'carousel', guide: '좌우로 이미지를 넘깁니다.'},

  // 12 a11y
  {id: 'keyboard-nav', categoryDir: '12-accessibility', categoryLabel: '접근성과 화면 설정', title: '키보드 탐색 (Keyboard Navigation)', sidebarLabel: '키보드 탐색', english: 'Keyboard Navigation', slug: 'keyboard-nav', guide: 'Tab만으로 주요 동작을 수행합니다.'},
  {id: 'focus-order', categoryDir: '12-accessibility', categoryLabel: '접근성과 화면 설정', title: '포커스 링 (Focus Ring)', sidebarLabel: '포커스 링', english: 'Focus Ring & Order', slug: 'focus-order', guide: '포커스 링과 Tab 순서를 확인합니다.'},
  {id: 'modal-focus-trap', categoryDir: '12-accessibility', categoryLabel: '접근성과 화면 설정', title: '포커스 트랩 (Focus Trap)', sidebarLabel: '포커스 트랩', english: 'Focus Trap', slug: 'modal-focus-trap', guide: '모달 포커스 트랩과 닫은 뒤 복귀를 확인합니다.', elements: ['모달 (Modal)', '포커스 트랩 (Focus Trap)']},
  {id: 'sr-announcement', categoryDir: '12-accessibility', categoryLabel: '접근성과 화면 설정', title: '라이브 리전 (Live Region)', sidebarLabel: '라이브 리전', english: 'ARIA Live Region', slug: 'sr-announcement', guide: 'aria-label과 aria-live로 상태 안내가 나가는지 확인합니다.'},
  {id: 'contrast-status', categoryDir: '12-accessibility', categoryLabel: '접근성과 화면 설정', title: '상태 표시 (Non-color Status)', sidebarLabel: '상태 표시', english: 'Non-color Status', slug: 'contrast-status', guide: '색만으로 구분하지 않고 아이콘+문구로 상태를 표시합니다.'},
  {id: 'text-zoom', categoryDir: '12-accessibility', categoryLabel: '접근성과 화면 설정', title: '텍스트 확대 (Text Zoom)', english: 'Text Zoom', slug: 'text-zoom', guide: '글자 크기 옵션으로 레이아웃을 확인합니다.'},
  {id: 'color-mode', categoryDir: '12-accessibility', categoryLabel: '접근성과 화면 설정', title: '컬러 모드 (Color Mode)', english: 'Color Mode / Dark Mode', slug: 'color-mode', guide: '데모 영역만 라이트/다크를 전환합니다. 사이트 전역 테마와 별개입니다.'},
  {id: 'touch-target', categoryDir: '12-accessibility', categoryLabel: '접근성과 화면 설정', title: '터치 타깃 (Touch Target)', english: 'Touch Target', slug: 'touch-target', guide: '권장 최소 터치 영역(약 44px)을 확인합니다.'},
  {id: 'landscape', categoryDir: '12-accessibility', categoryLabel: '접근성과 화면 설정', title: '가로 모드 (Landscape)', english: 'Landscape Layout', slug: 'landscape', guide: '가로형 프레임에서 배치를 확인합니다.'},
  {id: 'long-i18n', categoryDir: '12-accessibility', categoryLabel: '접근성과 화면 설정', title: '긴 문구 (Long Copy)', english: 'Long Translation / Copy', slug: 'long-i18n', guide: '긴 문구에서 줄바꿈/잘림을 확인합니다.'},
];

export function demosByCategory(categoryDir: string): DemoMeta[] {
  return UI_DEMOS.filter((d) => d.categoryDir === categoryDir);
}

export function getDemo(id: string): DemoMeta | undefined {
  return UI_DEMOS.find((d) => d.id === id);
}

export function demoShellProps(id: string): {
  title: string;
  guide: string;
  mock?: boolean;
  elements?: string[];
} {
  const meta = getDemo(id);
  if (!meta) {
    return {title: id, guide: ''};
  }
  return {
    title: meta.title,
    guide: meta.guide,
    mock: meta.mock,
    elements: meta.elements,
  };
}
