# 개발자 포트폴리오

정적 HTML/CSS/JS로 만든 1페이지 포트폴리오입니다.

## 구조

- 상단: 프로필 사진, 학력, 자격증
- 하단: 연도별 프로젝트 타임라인 (연도당 1개, 클릭 시 상세 모달)

## 내용 수정하기

`js/data.js` 파일의 값만 수정하면 사이트에 그대로 반영됩니다.

- `PROFILE`: 이름, 직무, 소개, 연락처, 학력, 자격증
- `PROJECTS`: 연도별 프로젝트 목록. 각 항목은 `year`, `title`, `thumbnail`,
  `summary`(카드 요약), `mainContent`(클릭 시 보여줄 주요 내용), `scale`(규모)로 구성됩니다.

사진은 `assets/` 폴더에 넣고 `data.js`에서 경로를 해당 파일로 바꿔주세요
(기본값은 자리표시용 SVG입니다).

## 실행

빌드 과정이 없습니다. `index.html`을 브라우저로 열거나, 로컬 서버로 띄워서 확인하세요.

```bash
python3 -m http.server 8000
```

## 배포

GitHub Pages, Netlify, Vercel 등 정적 호스팅에 그대로 올리면 됩니다.
