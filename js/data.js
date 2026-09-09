// 사이트 전역 콘텐츠(프로필/학력/자격증/기술 스택/수상·대외활동)입니다.
// 프로젝트 상세 내용은 content/projects.js의 PROJECT_DETAILS를 사용합니다.

const PROFILE = {
  name: "김명헌",
  title: "App Mobile Developer",
  heroGreeting: "안녕하세요,",
  heroDescription: "사용자의 가치를 우선적으로 생각하는 개발자입니다.",
  photo: "assets/profile-placeholder.svg", // assets 폴더에 사진을 넣고 경로를 바꾸세요
  bio: "사용자의 가치를 우선적으로 생각하는 개발자입니다.",
  contactDescription: "새로운 프로젝트나 협업 제안은 언제든 환영합니다.",
  contact: [
    { label: "Email", value: "rlaaudgjs2@naver.com", href: "mailto:rlaaudgjs2@naver.com" },
    { label: "GitHub", value: "github.com/rlaaudgjs2", href: "https://github.com/rlaaudgjs2" },
    { label: "Blog", value: "rlaaudgjs2.tistory.com", href: "http://rlaaudgjs2.tistory.com" },
  ],
  education: [
    { period: "2018.03 - 2025.02", school: "전북대학교", detail: "소프트웨어공학과" },
    { period: "2015.03 - 2018.02", school: "한빛고등학교", detail: "" },
  ],
  certifications: [
    { name: "정보처리기사", date: "2024.06.18", regNo: "24201130972A", issuer: "한국산업인력공단" },
    { name: "한국사능력검정시험 2급", date: "2023.12.15", regNo: "68-21259", issuer: "국사편찬위원회" },
    { name: "데이터 분석 준전문가(ADsP)", date: "2026.06.05", regNo: "ADsP-0490252", issuer: "한국데이터산업진흥원" },
  ],
};

// Tech 섹션 탭에 사용하는 카테고리별 기술 스택입니다.
const TECH_STACK = {
  categories: [
    { id: "language", label: "Language", items: ["Kotlin", "Java", "JavaScript"] },
    { id: "framework", label: "Framework", items: ["Android Studio", "Visual Studio", "IntelliJ", "Eclipse"] },
    { id: "collab", label: "Collaboration Tool", items: ["Notion", "GitHub", "Slack"] },
  ],
};

// 수상 / 대외활동
const AWARDS = [
  {
    date: "2018.11.08",
    title: "2018 스마트 디바이스 아이디어 발굴캠프",
    org: "정보통신산업진흥원",
    description: "압력매트와 모바일을 결합한 자세교정 서비스 고안, 건강 주제로 입선",
  },
  {
    date: "2018.11.18",
    title: "AM:PM 해커톤대회",
    org: "전북대학교 소프트웨어공학과",
    description: "아두이노와 레이저를 결합한 비상구 위치 알림 프로토타입 개발, 금상 수상",
  },
  {
    date: "2023.06.02",
    title: "한국정보기술학회 대학생 논문경진대회",
    org: "한국정보기술학회",
    description: "검색엔진과 자연어 생성 모델을 결합한 문서 내 정보 처리 챗봇 서비스 고안, 금상 수상",
  },
  {
    date: "2023.02",
    title: "삼정 KPMG 데이터활용 경진대회 본선진출",
    org: "삼정 KPMG",
    description: "",
  },
];

// 교육 이수 및 대외활동
const ACTIVITIES = [
  {
    period: "2025.03 - 2025.09",
    title: "멋쟁이사자처럼 Android 부트캠프 4기",
    org: "멋쟁이사자처럼",
    description: "Kotlin, Coroutine, Compose, Flutter, Provider, BLoC 등 Android 학습 및 실무 프로젝트 진행",
  },
  {
    period: "2019.03.11 - 2022.12.01",
    title: "AM:PM 동아리",
    org: "전북대학교 소프트웨어공학과",
    description: "스터디 및 학업 활동, 해커톤 대회 수상",
  },
  {
    period: "2018.11",
    title: "전북 아이디어 창업 캠프",
    org: "전북대학교",
    description: "입선",
  },
  {
    period: "2020",
    title: "국방 스타트업 챌린지",
    org: "국방부",
    description: "참가",
  },
  {
    period: "2021.07 - 2022.08",
    title: "수영 강사 (숨고)",
    org: "개인",
    description: "개인 수영 강습, 약 30명 고객 관리, 숨고 카테고리 1위 달성",
  },
  {
    period: "2021.12 - 2022.12",
    title: "소프트웨어공학과 학생회장",
    org: "전북대학교",
    description: "학과 행사 총괄 기획, 멘토·멘티 활동, 학술부 신설, SE-DAY 기획·진행, 학과 인원 60% 참여율 달성",
  },
  {
    period: "2022.03.15 - 2022.06.15",
    title: "LINC+ 다빈치 창업캠프",
    org: "전북대학교 LINC+",
    description: "킥보드 주차 문제 해결을 위한 아이디어로 창업 활동 진행",
  },
  {
    period: "2023.02",
    title: "삼정 KPMG 데이터활용 경진대회",
    org: "삼정 KPMG",
    description: "Boarding Pass — NLP 기반 사내 문서 챗봇으로 본선 Top 11 진출",
  },
  {
    period: "2024.03.15 - 2024.06.10",
    title: "전북대학교 LINC+",
    org: "전북대학교",
    description: "킥보드 주차 문제 해결을 위한 창업 활동",
  },
  {
    period: "2025.01.06 - 2026.01",
    title: "onz — 칵테일 추천 플랫폼",
    org: "사이드 프로젝트",
    description:
      "팀장 / iOS·Android 동시 런칭, 현재까지 운영 중. 칵테일 문화 발전을 위해 1·2차는 온라인 위주로 기획했고, 현재 오프라인 칵테일바와 연계해 확장 진행 중",
  },
];
