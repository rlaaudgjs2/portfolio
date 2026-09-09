// 이 파일의 값만 채워 넣으면 사이트 내용이 자동으로 반영됩니다.

const PROFILE = {
  name: "홍길동",
  title: "Backend Developer",
  photo: "assets/profile-placeholder.svg", // assets 폴더에 사진을 넣고 경로를 바꾸세요
  bio: "한 줄 소개를 여기에 작성하세요.",
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

// 연도별 프로젝트: year는 하나의 프로젝트만 대응됩니다.
const PROJECTS = [
  {
    year: 2024,
    title: "프로젝트 제목",
    thumbnail: "assets/project-placeholder.svg",
    summary: "카드에 보여줄 한 줄 요약",
    mainContent: "클릭 시 보여줄 주요 내용을 자세히 작성하세요.",
    scale: "예: 팀 4명 / 3개월 / 사용자 1만명",
  },
  {
    year: 2023,
    title: "프로젝트 제목",
    thumbnail: "assets/project-placeholder.svg",
    summary: "카드에 보여줄 한 줄 요약",
    mainContent: "클릭 시 보여줄 주요 내용을 자세히 작성하세요.",
    scale: "예: 개인 프로젝트 / 2개월",
  },
];
