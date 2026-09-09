// 사이트 전역 콘텐츠(프로필/학력/자격증/기술 스택)입니다.
// 프로젝트 상세 내용은 content/projects.js의 PROJECT_DETAILS를 사용합니다.

const PROFILE = {
  name: "홍길동",
  title: "Backend Developer",
  heroGreeting: "안녕하세요,",
  heroDescription: "문제를 발견하고 기술로 해결합니다.",
  photo: "assets/profile-placeholder.svg", // assets 폴더에 사진을 넣고 경로를 바꾸세요
  bio: "한 줄 소개를 여기에 작성하세요.",
  contactDescription: "새로운 프로젝트나 협업 제안은 언제든 환영합니다.",
  contact: [
    { label: "Email", value: "you@example.com", href: "mailto:you@example.com" },
    { label: "GitHub", value: "github.com/username", href: "https://github.com/username" },
  ],
  education: [
    { period: "2018 - 2022", school: "OO대학교", detail: "컴퓨터공학과 학사" },
  ],
  certifications: [
    { name: "정보처리기사", date: "2022.05" },
  ],
};

// Tech 섹션 탭에 사용하는 카테고리별 기술 스택입니다.
const TECH_STACK = {
  categories: [
    { id: "language", label: "Language", items: ["Kotlin", "Dart", "TypeScript", "Python"] },
    {
      id: "framework",
      label: "Framework",
      items: ["Jetpack Compose", "Flutter", "React Native", "Django", "TensorFlow / Keras"],
    },
    {
      id: "backend",
      label: "Backend & Infra",
      items: ["Firebase Auth", "Firestore", "Firebase Cloud Functions", "SQLite", "MMKV", "GitHub Actions"],
    },
    {
      id: "tools",
      label: "Tools & Libraries",
      items: ["Hilt", "TanStack Query", "Zod", "Dio", "go_router", "Provider", "table_calendar"],
    },
  ],
};
