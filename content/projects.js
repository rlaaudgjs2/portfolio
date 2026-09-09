// 사용자가 제공한 원본 프로젝트 노트를 그대로 옮기지 않고 구조화한 데이터입니다.
// 아직 사이트(js/main.js)에는 연결되어 있지 않습니다 — 디자인이 정해지면
// 이 스키마를 기준으로 화면에 매핑해주세요.
//
// 공통 스키마
// - id, title, subtitle: 식별자와 제목
// - period, type, role, scale: 언제/어떤 프로젝트/무슨 역할/규모
// - stack: 기술 스택 태그
// - overview: 프로젝트 한 단락 요약
// - highlights[]: 핵심 구현 { title, why, what, how, code? }
// - troubleshooting[]: 문제 해결 { title, problem, cause, solution, code? }
// - decisions[]: 기술적 의사결정 { title, decision, reason, tradeoff? }
// - learnings[]: 배운 점 (문자열 배열)
// - links[]: 실제 배포/문서 링크 { label, href }
// - needsInput[]: 리포지토리/노트만으로 알 수 없어 본인이 채워야 하는 항목

const PROJECT_DETAILS = [
  {
    id: "aspa",
    title: "ASPA",
    subtitle: "AI 기반 개인 맞춤 학습 도우미 Android 애플리케이션",
    period: "2025.07 - 2025.09",
    type: "팀 프로젝트 (LIKELION Android Bootcamp 4기)",
    role:
      "Android 프론트엔드 개발자로서 Presentation/Domain/Data 레이어를 분리하는 Clean Architecture 설계와 Hilt 기반 의존성 주입, Firebase Authentication/Firestore/Functions 연동을 주도. 핵심 기능인 학습 콘텐츠(Study) 및 오답노트(MistakeNoteBook) AI 분석 시스템의 클라이언트 UI와 Firebase Cloud Functions(TypeScript) 서버리스 파이프라인을 전담.",
    scale: "LIKELION Android Bootcamp 4기 팀 프로젝트 · 2025.07 ~ 2025.09 (약 3개월)",
    links: [
      { label: "Notion · 상세", href: "https://app.notion.com/p/ASPA-AI-328cb41e605e80cd9ff6d1b25fff5c09?pvs=21" },
      { label: "GitHub", href: "https://github.com/LIKELION-Android-Bootcamp-4th/MansBath" },
      { label: "Notion · 프로젝트", href: "https://app.notion.com/p/Aspa-278ee015c80280398c64f98a06e1b546?pvs=21" },
      { label: "Play Store", href: "https://play.google.com/store/apps/details?id=com.aspa2025.aspa2025" },
    ],
    stack: [
      "Kotlin",
      "Jetpack Compose",
      "Hilt",
      "Firebase Auth",
      "Firestore",
      "Firebase Cloud Functions",
      "TypeScript",
      "Gemini API",
    ],
    overview:
      "사용자의 질문과 학습 기록을 Google Gemini API가 분석해 맞춤형 학습 로드맵, Section별 학습 콘텐츠, 퀴즈, 오답노트를 자동 생성해주는 모바일 학습 플랫폼입니다.",
    highlights: [
      {
        title: "Cloud Functions & Gemini API 연동 풀스택 AI 학습 콘텐츠 파이프라인",
        why: "동일한 로드맵 섹션마다 Gemini AI를 매번 새로 호출하면 지연 시간과 API 비용이 커지므로, Firestore 캐시 레이어와 AI 서버리스 함수를 결합한 분기 구조가 필요했습니다.",
        what: "학습 콘텐츠 생성 요청 시 Firestore 캐시 존재 여부를 먼저 확인하고, 없을 때만 Cloud Functions에서 Gemini API(gemini-2.5-flash)를 호출해 학습 자료를 생성·파싱하는 풀스택 흐름을 구축했습니다.",
        how:
          "서버리스 파이프라인(study.ts)에서 사용자 질의와 로드맵 스테이지 정보로 프롬프트(prompt.ts)를 동적으로 구성해 Gemini API를 호출하고, 응답의 마크다운 코드블록을 정규식으로 정제해 JSON으로 파싱 후 Firestore에 저장. 클라이언트(StudyFireStoreDataSource)는 Firestore studies 컬렉션을 whereEqualTo로 선조회해 있으면 즉시 반환, 없으면 Cloud Functions의 study 콜러블 함수를 호출해 생성을 트리거. StudyScreen/StudyDetailScreen은 UiState<Study> 기반으로 처리하고 아코디언(LazyColumn + mutableStateOf<Pair<Int,Int>?>) UI로 구성.",
        code: {
          lang: "kotlin",
          snippet:
            "override suspend fun getStudy(roadmapId: String, sectionId: String, questionId: String): Study {\n" +
            "    val snapshot = firestore.collection(\"users\").document(userId).collection(\"studies\")\n" +
            "        .whereEqualTo(\"roadmapId\", roadmapId)\n" +
            "        .whereEqualTo(\"sectionId\", sectionId)\n" +
            "        .get().await()\n\n" +
            "    if (!snapshot.isEmpty) {\n" +
            "        return snapshot.documents.first().toObject(Study::class.java)!! // 캐시 즉시 반환\n" +
            "    }\n\n" +
            "    val data = mapOf(\"roadmapId\" to roadmapId, \"sectionId\" to sectionId, \"questionId\" to questionId)\n" +
            "    functions.getHttpsCallable(\"study\").call(data).await() // 캐시 미존재 시 Cloud Functions 트리거\n\n" +
            "    return fetchFromFirestore(roadmapId, sectionId) // 생성 결과 재조회\n" +
            "}",
        },
      },
      {
        title: "Hilt 기반 의존성 주입 & 초기 인증 구조 구축",
        why: "프로젝트 초기, 여러 팀원이 동일한 구조로 Firebase 및 Repository에 접근할 수 있는 DI 가이드라인과 로그인 아키텍처가 시급했습니다.",
        what:
          "Hilt로 FirebaseAuth·FirebaseFirestore·FirebaseFunctions(asia-northeast3 서울 리전) 인스턴스를 앱 전역 싱글톤 모듈(FirebaseModule)로 설계하고, Repository 계층에서 Result<T>를 반환하는 표준화된 원격 데이터 아키텍처를 도입했습니다.",
      },
      {
        title: "Clean Architecture 레이어 분리",
        why: "팀 프로젝트 초기에 화면(UI), 비즈니스 로직, 데이터 접근이 뒤섞이면 기능이 늘어날수록 유지보수와 테스트가 어려워질 위험이 있었습니다.",
        what: "Presentation / Domain / Data 3개 레이어로 분리하고, UiState Interface + StateFlow 기반 단방향 상태 관리로 화면별 분기 처리를 표준화했습니다.",
      },
    ],
    troubleshooting: [
      {
        title: "Gemini AI 응답 파싱 오류",
        problem: "AI 응답이 항상 동일한 JSON 구조를 보장하지 않아 파싱이 종종 실패했습니다.",
        cause: "프롬프트만으로 JSON 형식을 유도했는데, 자유 형식 텍스트 응답의 구조가 요청마다 미묘하게 달라졌습니다.",
        solution:
          "Gemini 호출 시 responseSchema와 responseMimeType: \"application/json\"으로 응답 구조를 강제하고, DTO 기본값 설정과 프롬프트 강제를 함께 적용해 파싱 안전성을 확보했습니다.",
      },
      {
        title: "퀴즈 저장과 오답노트 생성 데이터 불일치",
        problem: "퀴즈 결과 저장과 오답노트 생성이 별개 요청으로 처리되어, 중간에 하나가 실패하면 데이터가 불일치했습니다.",
        cause: "관련된 두 쓰기 작업이 원자적으로 묶여 있지 않아 부분 실패 시나리오가 그대로 노출됐습니다.",
        solution: "Firestore Batch Write로 관련 AI 작업을 원자적으로 처리해, 부분 실패로 인한 데이터 불일치를 방지했습니다.",
      },
      {
        title: "오답노트 AI 분석 결과의 Cloud Functions ↔ Firestore 스키마 불일치로 인한 파싱 실패",
        problem:
          "오답노트 상세 화면에서 AI 분석을 처음 요청하면, 분석 결과는 정상 반환되었음에도 문제 목록(items)·퀴즈 제목(quizTitle) 등 화면 필수 데이터가 파싱되지 않아 UI가 정상 노출되지 않았습니다.",
        cause:
          "클라이언트가 Cloud Functions mistakeNotebook 호출 결과(result.getData())를 Gson으로 화면 전용 클래스 MistakeDto에 직접 역직렬화했는데, 서버(mistake_notebook.ts)는 `{ mistake: analysis }` 형태(root_cause/evidence/action_plan만 포함)로만 응답해 items·quizTitle 같은 원본 문서 필드가 유실됐습니다.",
        solution:
          "Cloud Functions 호출을 'AI 분석 실행 + Firestore 문서 갱신 트리거'로만 한정하고, 데이터 수신은 호출 완료 후 Firestore 문서를 Source.SERVER로 직접 재조회하는 방식으로 흐름을 단일화. 신규 요청과 기존 문서 조회가 동일한 MistakeDto 파싱 경로를 공유하게 되어 파싱 안정성을 확보했습니다.",
        code: {
          lang: "kotlin",
          snippet:
            "// Before: Cloud Functions 응답을 그대로 역직렬화 (스키마 불일치로 파싱 실패)\n" +
            "val result = functions.getHttpsCallable(\"mistakeNotebook\").call(data).await()\n" +
            "val dto = gson.fromJson(gson.toJson(result.getData()), MistakeDto::class.java)\n\n" +
            "// After: Functions는 트리거로만 사용, 최신 문서는 Firestore 서버 재조회로 통일\n" +
            "functions.getHttpsCallable(\"mistakeNotebook\").call(data).await()\n" +
            "val response = colRef.get(Source.SERVER).await()\n" +
            "val dto = gson.fromJson(gson.toJson(response.data), MistakeDto::class.java)",
        },
      },
      {
        title: "Navigation Graph Scope ViewModel 인스턴스 재사용으로 인한 화면 데이터 미갱신 버그",
        problem:
          "학습 콘텐츠 화면에서 A 섹션을 학습한 뒤 B 섹션으로 이동해도, 새 B 섹션이 아닌 이전 A 섹션 콘텐츠가 그대로 고정 출력되었습니다.",
        cause:
          "StudyScreen과 StudyDetailScreen이 네비게이션 그래프 전체에 스코프된 동일 ViewModel(hiltViewModel(parentEntry))을 공유했고, 데이터 조회(fetchStudy())가 ViewModel의 init 블록에서 호출되고 있었습니다. Graph Scoped ViewModel은 그래프 진입 시 1회만 생성되므로 인자가 바뀌어도 init이 재실행되지 않았습니다.",
        solution:
          "데이터 fetch 트리거 기준을 '화면 컴포지션 진입 시점'이 아닌 '네비게이션 인자의 변화 시점'으로 전환. Compose LaunchedEffect(roadmapId, questionId, sectionId)에 네비게이션 인자를 명시적으로 바인딩해 인자가 바뀔 때마다 데이터가 재동기화되도록 개선했습니다.",
        code: {
          lang: "kotlin",
          snippet:
            "// Before: ViewModel 생성 시 1회만 실행\n" +
            "init { viewModelScope.launch { fetchStudy() } }\n\n" +
            "// After: 네비게이션 인자 변화를 감지해 fetch 트리거\n" +
            "@Composable\n" +
            "fun StudyNavGraph(roadmapId: String?, questionId: String?, sectionId: String?, vm: StudyViewModel) {\n" +
            "    LaunchedEffect(roadmapId, questionId, sectionId) {\n" +
            "        if (roadmapId != null && questionId != null && sectionId != null) {\n" +
            "            vm.fetchStudy(roadmapId, sectionId, questionId)\n" +
            "        }\n" +
            "    }\n" +
            "}",
        },
      },
    ],
    decisions: [
      {
        title: "AI 응답 수신 구조: Direct Gemini API SDK vs Firebase Cloud Functions",
        decision: "앱 내부에서 Gemini SDK를 직접 호출하지 않고, Firebase Cloud Functions(TypeScript)를 중계 서버리스 레이어로 채택.",
        reason:
          "클라이언트에 API Key를 두면 디컴파일로 유출될 위험이 있고, 프롬프트/파싱 로직을 바꿀 때마다 앱을 재배포하지 않고 서버리스 코드만 배포해 즉시 반영하고 싶었습니다.",
        tradeoff: "Cold Start 지연과 호출 타임아웃(480초로 확장) 관리 비용이 추가됐지만, 보안성과 운용 유연성을 확보했습니다.",
      },
    ],
    learnings: [
      "분산 서버리스 환경에서는 함수 응답값이 아니라 Firestore를 단일 진실 공급원(SSOT)으로 삼아 화면 모델을 구성해야 스키마 불일치 버그를 막을 수 있다는 것을 체득했습니다.",
      "Graph Scoped ViewModel의 생명주기와 Compose LaunchedEffect 키 바인딩의 관계를 실무 버그로 정밀하게 파악했습니다 — 데이터 갱신 기준은 화면 생성 시점이 아니라 '도메인 식별자의 변화'여야 합니다.",
    ],
  },

  {
    id: "cats-chatbot",
    title: "Chatbot (cats_project)",
    subtitle: "GPT 기반 문서 AI 챗봇",
    period: "2023.03 - 2023.08",
    type: "팀 프로젝트",
    role:
      "팀이 업로드한 내부 문서를 그룹 저장소에 인덱싱하고 GPT-3.5 Turbo가 해당 문서를 참조해 답변하는 협업형 Android 챗봇의 아키텍처 설계와 클라이언트 구현을 담당.",
    scale: "팀 프로젝트 · 2023.03 ~ 2023.08",
    stack: ["Java", "Android Studio", "OkHttp3", "Retrofit2", "Firestore", "GPT-3.5 Turbo"],
    overview:
      "팀이 업로드한 내부 문서(HWP, PDF 등)를 그룹 저장소에 인덱싱하고, GPT-3.5 Turbo가 해당 문서를 참조하여 팀원 질문에 답변하는 협업형 Android 챗봇입니다.",
    links: [
      {
        label: "Notion",
        href: "https://app.notion.com/p/Chatbot-cats_project-GPT-AI-328cb41e605e80468317d1cfa92c4b1b?pvs=21",
      },
    ],
    highlights: [
      {
        title: "MVC + Fragment 기반 아키텍처",
        why: "화면 단위로 관심사를 분리해 여러 팀원이 동시에 각자의 화면을 개발할 수 있어야 했습니다.",
        what: "Fragment 단위로 화면을 나누고 MVC 패턴으로 화면·로직·데이터 접근 책임을 분리했습니다.",
      },
      {
        title: "OkHttp3 비동기 GPT API 호출",
        why: "GPT API 응답을 기다리는 동안 UI가 멈추지 않아야 했습니다.",
        what: "OkHttp3의 비동기 enqueue로 GPT API를 호출하고, 응답을 runOnUiThread로 받아 UI를 갱신했습니다.",
      },
      {
        title: "Thread-safe Singleton 공유 상태 관리",
        why: "UID, 그룹 ID, 폴더명처럼 여러 화면에서 함께 참조하는 상태를 안전하게 공유해야 했습니다.",
        what: "Thread-safe Singleton 패턴으로 화면 간 공유 상태를 관리했습니다.",
      },
      {
        title: "Retrofit2 + OkHttp3 이원화",
        why: "GPT API의 동적인 JSON 응답과 자체 백엔드의 선언적 API를 하나의 방식으로 처리하기 어려웠습니다.",
        what: "GPT(동적 JSON)는 OkHttp3로, 백엔드(선언형 API)는 Retrofit2로 분리해 각각에 맞는 방식으로 처리했습니다.",
      },
      {
        title: "그룹 관리",
        why: "여러 팀이 같은 앱을 쓰면서 그룹이 중복되거나 데이터가 섞이지 않아야 했습니다.",
        what: "UUID 기반 팀별 입장 코드로 그룹 중복을 방지하고, Firestore에 그룹 가입 시 users와 group 컬렉션을 함께 갱신했습니다.",
      },
    ],
    troubleshooting: [],
    decisions: [],
    learnings: [],
    needsInput: ["개발 과정에서의 트러블슈팅 및 회고 (문서 인덱싱/검색 정확도, GPT 응답 품질 등)"],
  },

  {
    id: "looktalk",
    title: "LookTalk",
    subtitle: "옷 쇼핑몰 & 코디 커뮤니티 결합 모바일 앱",
    period: "2025.06.25 - 2025.07.17",
    type: "팀 프로젝트 (LIKELION Android Bootcamp 4기, 약 3주)",
    role:
      "프론트엔드 개발자로서 초기 프로젝트 세팅 및 Android 형상관리, Dio 기반 공통 네트워크 클라이언트(토큰 자동 주입/Refresh 인터셉터) 구축, go_router 기반 인증 상태 제어 라우팅(Auth Guard) 설계, 메인 홈 화면 UI/상태 연동, 구매자 마이페이지 주문/취소/반품 상태 관리 및 프로필 수정 기능 전담.",
    scale: "LIKELION Android Bootcamp 4기 팀 프로젝트 · 약 3주 (2025.06.25 ~ 2025.07.17)",
    stack: ["Flutter", "Dart", "Provider", "go_router", "Dio"],
    overview: "옷 쇼핑몰과 코디 커뮤니티 기능이 결합된 Flutter 기반 모바일 애플리케이션입니다.",
    links: [
      { label: "Notion · 상세", href: "https://app.notion.com/p/lookTalk-328cb41e605e80949111c8df4fe58095?pvs=21" },
      { label: "GitHub", href: "https://github.com/LIKELION-Android-Bootcamp-4th/lookTalk" },
      { label: "서버", href: "http://git.hansul.kr" },
      { label: "Notion · 프로젝트", href: "https://app.notion.com/p/LookTalk-278ee015c8028075a732df1454b999c2?pvs=21" },
    ],
    highlights: [
      {
        title: "go_router 및 Provider 기반 인증 상태 가드 (Auth Guard)",
        why: "비로그인 사용자의 마이페이지 등 접근을 제한하고, 로그인/로그아웃 상태 변화에 UI·라우팅이 즉시 선언적으로 반응해야 했습니다.",
        what: "Provider 기반 AuthViewModel의 인증 상태 변화를 go_router에 실시간 전파해 전역 접근 제어(Redirect)가 자동 재평가되는 라우팅 보호 시스템을 구축했습니다.",
        how: "AuthViewModel을 ChangeNotifier로 구현하고 GoRouter의 refreshListenable에 연결. 로그인/로그아웃 시 notifyListeners()가 redirect 콜백을 재실행시켜 비인증 유저를 로그인 페이지로 자동 리다이렉션.",
        code: {
          lang: "dart",
          snippet:
            "final GoRouter router = GoRouter(\n" +
            "  initialLocation: '/home',\n" +
            "  refreshListenable: authViewModel,\n" +
            "  redirect: (context, state) {\n" +
            "    final isLoggedIn = context.read<AuthViewModel>().isLoggedIn;\n" +
            "    final isGoingToMyPage = state.matchedLocation.startsWith('/mypage');\n" +
            "    final isGoingToLogin = state.matchedLocation == '/login';\n\n" +
            "    if (!isLoggedIn && isGoingToMyPage) return '/login';\n" +
            "    if (isLoggedIn && isGoingToLogin) return '/home';\n" +
            "    return null;\n" +
            "  },\n" +
            "  routes: [...],\n" +
            ");",
        },
      },
      {
        title: "Dio Interceptor 기반 토큰 자동 갱신 및 보안 네트워크 레이어",
        why: "모든 API 요청마다 JWT를 수동으로 헤더에 넣는 번거로움을 없애고, Access Token 만료(401) 시 사용자 개입 없이 Refresh Token으로 재발급 후 원 요청을 재시도하는 경험이 필요했습니다.",
        what: "Dio를 정적 싱글턴으로 구성하고 InterceptorsWrapper로 토큰 자동 주입 및 401 발생 시 재발급 → 재시도를 전구간 자동화했습니다.",
        how: "onRequest에서 flutter_secure_storage의 AccessToken을 Authorization 헤더에 자동 주입. onError에서 401 감지 시 RefreshToken으로 /api/auth/refresh를 호출하고 새 토큰 저장 후 실패했던 원본 요청을 재전송.",
        code: {
          lang: "dart",
          snippet:
            "onError: (DioException error, handler) async {\n" +
            "  if (error.response?.statusCode == 401) {\n" +
            "    final refreshToken = await _tokenStorage.getRefreshToken();\n" +
            "    if (refreshToken != null) {\n" +
            "      final refreshResponse = await _dio.post('/api/auth/refresh', data: {'refreshToken': refreshToken});\n" +
            "      final newAccessToken = refreshResponse.data['accessToken'];\n" +
            "      await _tokenStorage.saveTokens(newAccessToken, ...);\n\n" +
            "      final opts = error.requestOptions;\n" +
            "      opts.headers['Authorization'] = 'Bearer $newAccessToken';\n" +
            "      return handler.resolve(await _dio.fetch(opts));\n" +
            "    }\n" +
            "  }\n" +
            "  return handler.next(error);\n" +
            "}",
        },
      },
      {
        title: "주문 상태 기반 액션 제어 단일 소스 마이페이지 UI",
        why: "주문 상태(주문완료/배송중/반품신청/환불완료 등)에 따라 라벨·색상·액션 버튼 노출이 다르게 제어되는 일관된 상태 매핑이 필요했습니다.",
        what: "SearchMyProductListViewmodel에서 서버 상태값을 매핑하고, 하위 ManageWidget에서 하나의 status로 라벨·배경색·버튼 노출을 동시 제어했습니다.",
      },
    ],
    troubleshooting: [
      {
        title: "반품(환불) 접수 상태와 완료 상태가 다르게 표시되는 상태 동기화 오류",
        problem:
          "반품(환불)을 신청한 직후, 판매자 승인이 진행되지 않았음에도 주문 라벨이 즉시 '환불완료'로 표시되어 고객이 처리 완료로 오인했고, '취소/반품/리뷰' 버튼이 전면 비활성화됐습니다.",
        cause:
          "백엔드가 order.status(문자열)와 반품 신청 여부인 boolean order.refundInfo를 개별로 내려주는데, 초기 구현이 refundInfo가 true이면 서버 status와 무관하게 무조건 'refunded'로 취급하는 합성 조건을 사용해 신청 시점과 완료 시점을 구분하지 못했습니다.",
        solution:
          "반품 신청 접수 상태(refunding)와 실제 환불 완료 상태(refunded)를 분리하는 논리식을 정립. refundInfo가 true이면서 서버 status도 'refunded'인 경우에만 최종 'refunded'로 평가하도록 뷰 매핑을 수정했습니다.",
        code: {
          lang: "dart",
          snippet:
            "// Before: refundInfo만 보고 무조건 'refunded' 처리\n" +
            "final checkRefund = order.refundInfo ? \"refunded\" : order.status;\n\n" +
            "// After: 신청 상태와 완료 상태를 분리\n" +
            "final checkRefund = order.refundInfo ? \"refunding\" : order.status;\n" +
            "final displayStatus = (order.refundInfo && order.status == 'refunded')\n" +
            "    ? 'refunded'\n" +
            "    : checkRefund;",
        },
      },
      {
        title: "검색 커뮤니티 탭이 항상 빈 리스트로 표시되는 문제",
        problem: "SearchCommunityScreen에 진입하면 검색어를 입력해도 커뮤니티 탭 결과가 항상 빈 리스트로 표시됐습니다.",
        cause:
          "SearchCommunityScreen이 부모 화면의 SearchViewModel과는 다른 새 ViewModel 인스턴스를 참조하게 되어, 부모에서 실행한 검색 결과가 자식 화면에 반영되지 않았습니다.",
        solution: "go_router의 extra로 기존 ViewModel 인스턴스를 전달한 뒤, ChangeNotifierProvider.value로 동일 인스턴스를 공유하도록 수정했습니다.",
      },
    ],
    decisions: [
      {
        title: "네트워크 헤더 관리: 함수별 수동 헤더 전달 vs Dio Interceptor 분리",
        decision: "JWT 토큰 헤더 관리를 개별 Repository/ViewModel 레벨의 수동 처리 대신 Dio Interceptor 기반 공통 네트워크 레이어로 격리·자동화.",
        reason: "개발 초기 하드코딩된 토큰 주입 방식은 관리가 불가능했고, 401 감지 및 Refresh 로직을 화면마다 구현하면 중복 코드와 에러 처리 누락 위험이 컸습니다.",
        tradeoff: "인터셉터 내부 비동기 재발급·무한 루프 방지 로직에 초기 설계 비용이 들었지만, 전체 API 통신이 일관된 보안 규칙을 따르게 되어 비즈니스 로직 집중도가 향상됐습니다.",
      },
    ],
    learnings: [
      "refundInfo와 status라는 두 독립 백엔드 상태값을 뷰 레이어에서 섣불리 결합하면 접수/완료 단계가 유실될 수 있음을 배웠습니다. 백엔드 도메인 필드의 의미를 정확히 정의하는 것이 중요합니다.",
      "displayStatus 판단 논리식이 배경색·라벨·하위 위젯 전달부 세 곳에 중복 작성된 점을 회고하며, 향후에는 ViewModel의 계산된 프로퍼티(Getter)로 캡슐화해 뷰 단 중복을 줄여야 함을 확인했습니다.",
    ],
    needsInput: [
      "3주간 LIKELION 팀 프로젝트에서 초기 프레임워크/라우팅/네트워크 인프라를 담당하며 느낀 개인적 경험이나 협업 회고",
    ],
  },

  {
    id: "onz",
    title: "onz",
    subtitle: "지도 기반 칵테일 바 탐색 앱 (1차 프로젝트)",
    period: "2025.01 - 2025.06",
    type: "팀 프로젝트 (1차 프로젝트 — 이후 2차 프로젝트로 재작성)",
    role:
      "프론트엔드 개발자로서 지도 메인 화면 바텀시트-플로팅 버튼 애니메이션 연동, 지역 검색·필터링, 바 상세 화면의 자정 초과 영업시간 계산 로직, 바텀시트 내 제스처 충돌 해결, 리스트 저장(북마크) 화면 구현. 이후 지도 화면 복잡도를 낮추기 위해 MapsViewModel 도입 리팩터링을 주도.",
    scale: "팀 프로젝트 (1차 프로젝트) · 2025.01 ~ 2025.06",
    stack: ["TypeScript", "React Native", "react-native-reanimated", "@gorhom/bottom-sheet", "Google Maps"],
    overview:
      "서울 내 칵테일 바를 지도 기반으로 탐색하고 나만의 리스트에 저장할 수 있는 앱입니다. Google Maps 위에 커스텀 마커와 바텀시트를 통합해 현재 위치 기반 주변 바 탐색과 지역/키워드 필터링을 제공합니다.",
    links: [
      { label: "Notion", href: "https://app.notion.com/p/onz-1-328cb41e605e801e9f48f58fa1e8cf05?pvs=21" },
    ],
    highlights: [
      {
        title: "바텀시트 위치 기반 플로팅 버튼 인터랙티브 애니메이션",
        why: "바텀시트 높이가 드래그 제스처에 따라 유동적으로 변함에 따라, 지도 위 플로팅 버튼(내 위치, 재검색 등)이 바텀시트에 가려지지 않고 자연스럽게 위치를 이동해야 했습니다.",
        what: "react-native-reanimated와 @gorhom/bottom-sheet로 바텀시트의 실시간 위치를 추적해 플로팅 버튼의 translateY가 제스처 속도에 맞춰 보정되는 UI를 구현했습니다.",
        how: "useSharedValue로 바텀시트 위치(animatedPosition)를 추적하고 interpolate로 스냅 포인트 변화량을 translateY로 매핑. JS 스레드 병목 없이 UI 스레드에서 60fps로 구동.",
      },
      {
        title: "서울시 23개 구 지역 코드 매핑 및 지역 필터링",
        why: "지역별로 칵테일 바를 빠르게 탐색하고, 선택된 지역을 상단 태그로 직관적으로 관리할 UI가 필요했습니다.",
        what: "서울 23개 구 지역명을 영문 코드로 변환하는 매핑 테이블(REGION_CODE_MAP)과 가로 스크롤 선택 태그 UI를 구현했습니다.",
        how: "REGION_CODE_MAP으로 한글 지역명을 API의 areaCodes 파라미터로 변환, GET /api/location/filter?areaCodes= 요청으로 목록 수신. 태그 개별 삭제 시 지역 코드를 배열에서 제외하고 목록을 재조회.",
      },
    ],
    troubleshooting: [
      {
        title: "네이버 로그인 라이브러리 React Native 버전 호환 오류",
        problem: "네이버 로그인 연동 시 라이브러리에서 원인을 알기 어려운 에러가 발생했습니다.",
        cause: "네이버 로그인 라이브러리 내장 코드에 당시 사용 중인 React Native 버전과 호환되지 않는 에러 클래스가 존재했습니다.",
        solution: "라이브러리 내부 코드의 에러 클래스를 직접 수정해 해결하고, 재현 방법과 해결 방법을 네이버 개발자 포럼에 공유했습니다.",
      },
      {
        title: "마커 깜빡임 이슈 (Android)",
        problem: "Android에서 지도 마커가 렌더링될 때마다 눈에 띄게 깜빡이는 현상이 있었습니다.",
        cause: "react-native-maps의 Marker가 이미지 로드 전까지 매 렌더마다 뷰를 재계산해 깜빡임이 발생했습니다.",
        solution: "이미지 onLoad 완료 후 tracksViewChanges를 false로 전환해 불필요한 재렌더를 차단했습니다.",
      },
      {
        title: "자정을 넘기는 바(Bar) 영업시간의 판단 오류",
        problem: "영업시간이 '18:30~01:30'처럼 자정을 넘는 바는 실제 영업 중임에도 '영업 종료'/'영업 전'으로 잘못 표시됐습니다.",
        cause:
          "오픈/마감 시각을 단순 분(minute) 단위로 변환해 '오픈시각 <= 현재시각 <= 마감시각' 단일 범위 비교만 수행해, 마감 시각이 자정을 지나며 숫자가 리셋되는 자정 초과(Overnight) 케이스를 고려하지 않았습니다.",
        solution: "마감 시각이 오픈 시각보다 작거나 같은 자정 초과 케이스를 별도 조건으로 분기 처리했습니다.",
        code: {
          lang: "typescript",
          snippet:
            "const isOvernight = closeTime <= openTime;\n\n" +
            "if (isOvernight) {\n" +
            "  isOpen = currentMinutes >= openTime || currentMinutes < closeTime;\n" +
            "} else {\n" +
            "  isOpen = currentMinutes >= openTime && currentMinutes < closeTime;\n" +
            "}",
        },
      },
      {
        title: "바텀시트 제스처와 내부 스크롤 뷰 간의 제스처 충돌",
        problem:
          "바텀시트 내부에서 이미지 목록을 가로 스크롤할 때 세로 드래그(바텀시트 높이 조절) 제스처와 간섭이 발생해 스크롤이 매끄럽지 않거나 바텀시트가 의도치 않게 닫혔습니다.",
        cause: "바텀시트 컴포넌트와 내부 일반 ScrollView가 제스처 이벤트 컨텍스트를 공유하지 않아 터치 이벤트 캡처 순서가 꼬였습니다.",
        solution:
          "바텀시트 최상위 스크롤 컨테이너를 BottomSheetScrollView로, 내부 가로 스크롤은 react-native-gesture-handler의 ScrollView로 교체해 동일한 제스처 이벤트 시스템에서 우선순위를 결정하도록 구조를 맞췄습니다.",
      },
      {
        title: "주변 검색 결과와 지역 필터 결과 간 상태 덮어쓰기 문제",
        problem: "'내 주변 바 검색' 후 '지역별 필터'를 적용하면 이전 검색 마커와 새 필터 마커가 뒤섞이거나 의도치 않게 사라졌습니다.",
        cause:
          "주변 검색용 상태(barData, markerList)와 지역 필터용 상태(barList)가 별도로 존재했는데, 여러 비동기 API 호출이 서로의 상태 초기화 타이밍을 제어하지 않고 지도 렌더링 상태를 직접 변경했습니다.",
        solution:
          "검색/필터 데이터 흐름의 전용 상태를 엄격히 분리하고, 재검색·재필터 시 이전 마커를 명시적으로 초기화한 뒤 신규 데이터로 교체. 이후 상태 관리와 API 통신 로직을 MapsViewModel로 분리 추출해 단일 방향으로 제어하도록 리팩터링했습니다.",
      },
    ],
    decisions: [
      {
        title: "바텀시트 높이와 연동된 플로팅 UI 처리: Reanimated SharedValue vs React State",
        decision: "useState 대신 react-native-reanimated의 useSharedValue/interpolate 기반 UI 스레드 연동 방식을 선택.",
        reason: "바텀시트 제스처는 초당 60회 이상 좌표 변경 이벤트를 발생시켜, JS Bridge를 거치는 useState 갱신은 Re-render/Bridge 병목으로 프레임 드랍 위험이 컸습니다.",
        tradeoff: "Reanimated의 Worklet 개념 학습 비용이 있었지만, 렌더링 성능과 드래그 반응성을 확보했습니다.",
      },
    ],
    learnings: [
      "시간·날짜·좌표 같은 범위 데이터를 다룰 때는 24시간 도메인 특성상 존재하는 예외 경계값(자정 초과 등)을 사전에 정의하고 로직을 설계해야 함을 체감했습니다.",
      "바텀시트·맵 뷰·스크롤 뷰가 중첩될 때의 터치 이벤트 경쟁을 경험하며, 프레임워크의 제스처 응답자 체계(Gesture Responder System)를 이해하는 것이 문제 해결의 핵심임을 배웠습니다.",
    ],
    needsInput: [
      "onz 1차 버전을 진행하며 느낀 기술적 아쉬움, 이후 2차 재작성 아키텍처 도입에 준 영향에 대한 회고",
    ],
  },

  {
    id: "cocktail-front",
    title: "onz",
    subtitle: "칵테일 정보 제공 앱 (2차 프로젝트)",
    period: "2025.10 - 2026.01",
    type: "팀 프로젝트",
    role:
      "프론트엔드 주 개발자로서 전체 커밋의 88%(146/166개) 담당. 데이터 페칭 계층의 TanStack Query 전환 및 MMKV 캐싱 구축, JWT 토큰 자동 갱신 인터셉터, 로컬 SQLite 기반 검색 자동완성 설계, Android 16KB 페이지 크기 대응(네이티브/프레임워크 업그레이드), GitHub Actions 기반 CI/CD 파이프라인 구축 전담.",
    scale: "팀 프로젝트 · 2025.10 ~ 2026.01 · 전체 커밋 166개 중 146개(88%) 담당",
    stack: ["TypeScript", "React Native", "TanStack Query", "MMKV", "SQLite", "Zod", "Axios", "GitHub Actions"],
    overview: "칵테일 정보 전달을 중점으로 만든 칵테일 애플리케이션입니다. onz 1차 프로젝트의 재작성 버전입니다.",
    links: [
      { label: "Notion", href: "https://app.notion.com/p/onz-2-328cb41e605e8068b139f29412e58a41?pvs=21" },
      { label: "GitHub", href: "https://github.com/MobileOnz/Cocktail_Front" },
      { label: "Play Store", href: "https://play.google.com/store/apps/details?id=com.cocktail_front&hl=ko" },
      { label: "App Store", href: "https://apps.apple.com/kr/app/onz/id6744957084" },
    ],
    highlights: [
      {
        title: "MVVM 패턴 설계",
        why: "비즈니스 로직이 화면 컴포넌트에 뒤섞이면 재사용과 테스트가 어려워질 위험이 있었습니다.",
        what: "Custom Hook을 ViewModel처럼 사용해 비즈니스 로직을 캡슐화하고, React.memo·useCallback·FlatList 배치 튜닝으로 렌더링을 최적화했습니다.",
      },
      {
        title: "정적 참조 데이터 기반 로컬 SQLite 검색 자동완성",
        why: "칵테일명처럼 변경 빈도가 낮은 참조 데이터를 입력마다 서버 API로 호출하는 구조는 불필요한 트래픽과 입력 반응성 저하를 유발했습니다.",
        what: "앱 시작 시 칵테일명 목록을 최초 1회 동기화해 로컬 SQLite에 저장하고, 입력마다 로컬 DB에서 직접 자동완성 목록을 조회하도록 구현했습니다.",
        how: "SQLite 마이그레이션으로 참조 테이블 정의, 앱 진입 시 동기화 여부 확인 후 최신 데이터 저장(Synchronization Layer), 입력 시 로컬 SQLite에 LIKE 쿼리로 즉시 결과 반환. UI는 Repository-DataSource로 추상화해 DB 엔진에 직접 의존하지 않도록 계층화.",
      },
      {
        title: "Zod 스키마 검증 및 Repository 계층을 통한 API 안정성 확보",
        why: "외부 API 응답이 기대 타입과 다르거나 필드가 누락되면 런타임에 Undefined 참조 에러로 앱이 비정상 종료될 위험이 있었습니다.",
        what: "API 응답을 도메인 모델로 변환하기 전 Zod 스키마로 검증하고, 검증을 통과한 데이터만 도메인 Entity로 매핑했습니다.",
        how: "DataSource 계층에서 응답 수신 후 Zod parse 수행, Repository 계층에서 검증된 데이터를 도메인 Entity로 변환해 UI(ViewModel/Screen)에 전달.",
      },
      {
        title: "소셜 로그인 토큰 자동 재발급 및 에러 타입 통일",
        why: "카카오/네이버/애플/구글 4개 소셜 로그인 라이브러리가 각기 다른 예외를 발생시켜 일관된 사용자 안내가 어려웠고, 토큰 만료 시 세션이 끊기는 문제도 있었습니다.",
        what: "4개 소셜 로그인 예외를 도메인 표준 에러 타입으로 변환하는 통합 핸들러를 구축하고, Axios Interceptor로 401 발생 시 토큰을 자동 재발급했습니다.",
        how: "AuthError 클래스와 AuthErrorType(TOKEN_EXPIRED, SOCIAL_LOGIN_FAILED, SERVER_ERROR, CANCELLED) enum 정의. 4개 소셜 로그인 DataSource의 모든 예외를 표준 AuthError로 래핑. Axios response interceptor가 401 감지 시 리프레시 토큰 요청 후 실패 요청을 재시도.",
      },
    ],
    troubleshooting: [
      {
        title: "JWT 동시 401 경쟁 조건",
        problem: "여러 API 요청이 동시에 만료된 토큰으로 실패하면서 토큰 갱신이 중복 실행되어, Refresh Token 요청이 겹쳐 인증이 반복 실패했습니다.",
        cause: "401 응답을 받은 각 요청이 서로의 갱신 상태를 모른 채 각자 리프레시를 시도했습니다.",
        solution: "isRefreshing 플래그와 Promise 캐싱으로 첫 번째 갱신 요청을 모든 대기 요청이 공유하도록 구현했습니다.",
      },
      {
        title: "협업 진행 중 패키지 버전 충돌로 인한 지연",
        problem: "개발자별로 라이브러리 버전이 달라 병합 시 충돌이 발생해 개발 시간이 지연됐습니다.",
        cause: "팀원마다 로컬에 설치된 패키지 버전이 lock 파일과 어긋난 상태로 개발이 진행됐습니다.",
        solution: "GitHub Actions CI 파이프라인에서 npm ci를 실행해 lock 파일 기준으로 팀 전체의 패키지 버전을 통일했습니다.",
      },
      {
        title: "Android 터치 이벤트 가로채기",
        problem: "겹쳐진 카드 중 비활성 카드가 활성 카드로 가야 할 터치 이벤트를 가로챘습니다.",
        cause: "absolute 레이어로 겹친 카드 구조에서 Android는 투명 View도 터치를 가로채는 특성이 있었습니다.",
        solution: "비활성 카드에 pointerEvents=\"none\"을 적용하고 zIndex/elevation을 명시적으로 설정했습니다.",
      },
      {
        title: "CI 설계 중 브랜치명 슬래시 오류 & SSH URL 충돌",
        problem: "CI 파이프라인 구축 중 아티팩트 업로드가 실패하고, package-lock에 SSH 형식 URL이 남아 설치가 실패했습니다.",
        cause: "브랜치명의 슬래시가 artifact 이름 규칙에 허용되지 않았고, yarn에서 npm으로 전환한 뒤 package-lock에 SSH URL이 잔존했습니다.",
        solution: "bash 문자열 치환으로 브랜치명의 슬래시를 하이픈으로 변환하고, sed 명령으로 SSH URL을 HTTPS로 일괄 변환했습니다.",
      },
      {
        title: "수동 상태 관리 무한스크롤의 캐싱 부재 및 북마크 동기화 한계",
        problem:
          "검색 결과 무한 스크롤을 useState와 3개의 useRef(pageRef, isLastRef, loadingRef)로 수동 제어해, 화면 재진입마다 동일 데이터를 재요청했고 북마크 상태 변경 시 리스트 전체를 다시 불러와야 했습니다.",
        cause: "상태 관리와 페칭 로직이 컴포넌트 단에 묶여 있어 데이터를 캐싱·영속화할 수 없는 구조적 한계가 있었습니다.",
        solution:
          "데이터 페칭을 TanStack Query의 useInfiniteQuery로 전면 교체. react-native-mmkv 기반 persister를 queryClient에 연결해 디바이스에 캐시를 영속화하고, 북마크 토글 시 setQueryData로 낙관적 업데이트를 적용해 실패 시에만 invalidateQueries로 무효화했습니다.",
      },
      {
        title: "Android 16KB 메모리 페이지 크기 대응 시 네이티브 빌드 실패",
        problem: "Google Play의 Android 16KB 메모리 페이지 크기 지원 정책 대응 빌드 작업 중 네이티브 빌드 오류가 지속 발생했습니다.",
        cause:
          "당시 사용 중이던 React Native 프레임워크 버전 자체가 16KB 정렬 바이너리를 내장 지원하지 않아, 커스텀 NDK 설정만으로 우회하려던 것이 근본 원인이었습니다.",
        solution:
          "수동 링커 플래그 주입 방식을 폐기하고, 16KB 정렬 바이너리를 공식 지원하는 React Native 0.78.3으로 프레임워크를 업그레이드(React 19, react-native-mmkv 3.x 동반 업그레이드). GitHub Actions CI에 NDK 28 라이선스 설치·승인 단계를 도입했습니다.",
      },
      {
        title: "CI/CD 환경변수 누락으로 인한 TestFlight 릴리즈 빌드 로그인 실패",
        problem: "로컬에서는 소셜 로그인이 정상 동작했지만, TestFlight로 배포된 빌드에서만 모든 소셜 로그인이 전면 실패했습니다.",
        cause: "CD 워크플로우(cd-prod, cd-qa)에 .env 파일 생성 스텝이 누락되어 릴리즈 번들의 API_BASE_URL이 undefined로 평가되었습니다.",
        solution:
          "GitHub Actions CD 워크플로우에 .env 파일 자동 생성 스텝을 추가하고, 환경변수 누락 시 앱이 멈추지 않도록 기본 fallback URL 로직을 코드에 보완했습니다.",
      },
    ],
    decisions: [
      {
        title: "로컬 SQLite 기반 참조 데이터 보관 vs 매 요청 서버 API 호출",
        decision: "정적 참조 데이터(칵테일 목록)를 앱 시작 시 로컬 SQLite에 동기화하고, 검색·자동완성을 로컬 LIKE 쿼리로 처리.",
        reason: "칵테일 정보는 변경 주기가 매우 길어 매번 서버 접근이 불필요했고, 키 입력 시 네트워크 지연을 없애 반응 속도를 극대화하고자 했습니다.",
        tradeoff:
          "최초 1회 동기화 시간과 로컬 저장 공간이 필요하고, LIKE '%keyword%' 방식은 데이터가 극단적으로 커지면 인덱스 활용에 한계가 있지만 현재 규모에서는 충분했습니다.",
      },
    ],
    learnings: [
      "Android 16KB 문제를 CMake 링커 옵션 우회로 접근했다가 지속 실패한 뒤, 프레임워크 자체의 미지원이 원인임을 파악하고 버전 업그레이드로 근본 해결한 경험 — 임시 봉합보다 근본 원인을 식별하는 분석 프로세스의 중요성을 배웠습니다.",
      "로컬에서는 되는데 TestFlight에서만 실패하는 경험을 통해, 빌드 환경과 자동화 파이프라인의 격리가 시스템에 미치는 영향을 체감했습니다. 환경변수 주입과 SDK 라이선스 상태를 배포 파이프라인에서 명시적으로 관리해야 함을 확인했습니다.",
    ],
    needsInput: ["추가적인 인적/기술적 회고"],
  },

  {
    id: "health-note",
    title: "Health Note",
    subtitle: "날짜별 운동·세트·몸무게·사진 기록 및 루틴 관리 앱",
    period: "2026.01 - 2026.03",
    type: "개인 프로젝트 (1인)",
    role: "기획 · 설계 · 클라이언트(Flutter) 전 영역 구현 — 도메인 모델, SQLite 스키마/마이그레이션, Repository, 화면별 Cubit 상태 관리, UI 전체를 단독 구현.",
    scale: "1인 개인 프로젝트 · 2026.01 ~ 2026.03 (실제 개발 2026.03.06 ~ 2026.03.23, 커밋 19개)",
    stack: ["Dart", "Flutter", "flutter_bloc (Cubit)", "SQLite (sqflite)", "table_calendar", "cached_network_image"],
    overview:
      "날짜별로 운동·세트·몸무게·사진을 기록하고, 루틴과 즐겨찾기로 효율적으로 관리하는 개인 운동 기록 앱입니다. 서버 통신 없이 로컬로만 동작하는 오프라인 애플리케이션으로, 운동 종목 카탈로그(약 90여 개) 매칭·상태 관리·DB 스키마 마이그레이션을 모두 클라이언트에서 책임집니다.",
    links: [
      { label: "Notion", href: "https://app.notion.com/p/Health-Note-328cb41e605e8067b098c01b7bed5908?pvs=21" },
    ],
    highlights: [
      {
        title: "홈 화면 — 캘린더 기반 운동 기록 조회",
        why: "날짜를 선택하면 해당 날짜의 운동·세트·몸무게·사진·메모를 한 화면에서 조회·수정할 수 있어야 했습니다.",
        what: "table_calendar 기반 월별 캘린더에서 날짜 선택 시 해당 날짜 기록을 한 화면에 표시.",
        how: "HomeCubit이 DailyRecordRepository로 날짜별 레코드를 조회하고, 운동(daily_workouts)과 세트(workout_sets)를 조인해 화면 전용 복합 모델(WorkoutEntry)로 변환 후 HomeState로 emit. View는 BlocBuilder로 상태만 구독하며 DB에 직접 접근하지 않음. 캘린더 마커 표시는 recordedDates(Set<String>)를 Set 연산(difference/union)으로 갱신해 전체 재계산을 피함. 운동을 접었을 때는 세트 요약만, 펼쳤을 때만 세트별 상세를 그려 정보 밀도를 조절.",
        code: {
          lang: "dart",
          snippet:
            "Future<void> _loadWorkouts(DateTime date) async {\n" +
            "  final record = await _repo.getRecordByDate(dateStr);\n" +
            "  final rows = await _repo.getRawWorkoutsWithSports(record.id!);\n" +
            "  for (final row in rows) {\n" +
            "    final sets = await _repo.getSetsForWorkout(workout.id!);\n" +
            "    final prevVolume = await _repo.getPrevVolume(sports.id!, dateStr);\n" +
            "    entries.add(WorkoutEntry(workout: workout, sports: sports, sets: sets, prevVolume: prevVolume));\n" +
            "  }\n" +
            "  emit(state.copyWith(workouts: entries, weight: record.weight, ...));\n" +
            "}",
        },
      },
      {
        title: "이전 볼륨 조회 — 운동별 진행 상황 비교",
        why: "같은 운동을 반복할 때 무게·횟수 증감을 바로 비교할 수 있어야 했습니다.",
        what: "운동 카드에 '이전 기록 대비 볼륨'을 표시.",
        how: "DailyRecordRepository.getPrevVolume()이 특정 종목의 가장 최근 이전 날짜 기록에서 SUM(kg * reps)를 SQL 레벨에서 직접 계산(raw query, 상관 서브쿼리). 세트 목록을 별도로 불러올 필요 없이 값 하나만 조회하고, COALESCE와 Dart 쪽 null 체크로 '기록 없음'과 '볼륨 0'을 구분.",
      },
      {
        title: "루틴 · 즐겨찾기 통합 관리",
        why: "자주 하는 운동 조합을 저장해두고 다른 날짜에 한 번에 불러와 적용할 수 있어야 했습니다.",
        what: "루틴 저장/불러오기와 즐겨찾기 필터링을 통합 제공.",
        how: "AddRoutineCubit.filtered getter에서 카테고리·부위·장비·검색어·즐겨찾기 필터를 순차 적용 후, 즐겨찾기 여부로 안정 정렬(stable sort)해 원래 순서를 유지하며 즐겨찾기만 상단에 고정. HomeCubit.saveAsRoutine()이 현재 홈 화면의 운동 목록을 routine_exercises에 일괄 insert. 루틴 적용 시 오늘 이미 추가된 운동(alreadyAddedIds)과 중복 선택을 필터링.",
      },
      {
        title: "운동 세션 타이머",
        why: "운동/휴식 구간을 번갈아 카운트다운하는 인터벌 타이머가 필요했고, 설정값은 다음 실행에도 유지되어야 했습니다.",
        what: "운동/휴식 인터벌 타이머, 지속 시간은 shared_preferences에 저장.",
        how: "TimerCubit이 Timer.periodic(Duration(seconds: 1))으로 매초 상태를 emit하고 remaining이 0이 되면 TimerPhase(workout ↔ rest)를 전환. Cubit close() 시 Timer.cancel()로 화면 이탈 후에도 타이머가 백그라운드에 남지 않도록 정리. 설정값 변경 시 실행 중이던 타이머를 강제 정지해 이전 duration 기준으로 카운트가 꼬이지 않도록 처리.",
      },
      {
        title: "운동 기록 캡처 공유",
        why: "하루 운동 요약(총 볼륨·세트·최고 무게·운동별 세트·메모)을 외부 앱으로 쉽게 공유할 수 있어야 했습니다.",
        what: "요약 화면을 이미지로 캡처해 카카오톡 등으로 공유.",
        how: "RepaintBoundary + GlobalKey로 요약 화면 전체를 감싸고 boundary.toImage() → PNG 바이트 변환 → 임시 디렉터리 저장 → Share.shareXFiles()로 공유 후 임시 파일 삭제. 원래는 텍스트 조합 공유였다가 이미지 캡처 공유로 교체.",
      },
    ],
    minorFeatures: [
      "검색 화면 — 운동명으로 과거 기록을 조회하는 단순 조회 기능",
      "스플래시 화면 — DB 초기화 + 카탈로그 시딩 후 홈으로 이동",
      "사진 뷰어 — 썸네일 탭 시 PageView + InteractiveViewer로 핀치줌 전체화면 뷰",
      "몸무게/메모 입력 — 포커스 아웃 시 자동 저장되는 단순 폼",
    ],
    troubleshooting: [
      {
        title: "루틴 적용 시 홈 화면에 반영되지 않는 버그",
        problem: "루틴을 선택해 '오늘 운동에 추가'를 실행하고 홈으로 돌아오면, 방금 추가한 운동이 화면에 보이지 않는 경우가 있었습니다.",
        cause:
          "onApplyRoutine이 동기 콜백(void Function)으로 선언되어, 내부에서 비동기 DB insert(cubit.addExercisesToDay)를 await 없이 호출하고 곧바로 Navigator.pop()이 실행되어 DB 저장 전에 화면이 닫혔습니다.",
        solution:
          "콜백 타입을 Future<void> Function으로 바꾸고, 호출부에서 await onApplyRoutine!(sports) 이후에만 Navigator.pop()이 실행되도록 수정. 비동기 콜백 이후 context를 사용하므로 context.mounted 체크도 추가.",
        code: {
          lang: "dart",
          snippet:
            "// home_view.dart\n" +
            "onApplyRoutine: (sports) async {\n" +
            "  await cubit.addExercisesToDay(cubit.state.selectedDay, sports);\n" +
            "},\n\n" +
            "// routine_list_view.dart\n" +
            "onApplyRoutine: onApplyRoutine != null\n" +
            "    ? () async {\n" +
            "        final sports = item.exercises.toList();\n" +
            "        await onApplyRoutine!(sports);\n" +
            "        if (context.mounted) Navigator.of(context).pop();\n" +
            "      }\n" +
            "    : null,",
        },
      },
      {
        title: "SQLite ON DELETE CASCADE가 동작하지 않는 문제",
        problem: "운동을 삭제해도 연관된 세트(workout_sets)가 DB에 그대로 남아있었습니다.",
        cause: "SQLite는 커넥션 단위로 PRAGMA foreign_keys를 켜지 않으면, 스키마에 CASCADE를 선언해도 무시됩니다.",
        solution: "DB 오픈 시 PRAGMA foreign_keys = ON을 커넥션이 열릴 때마다 실행하도록 추가.",
        code: {
          lang: "dart",
          snippet:
            "return await openDatabase(\n" +
            "  path,\n" +
            "  version: 7,\n" +
            "  onCreate: _onCreate,\n" +
            "  onUpgrade: _onUpgrade,\n" +
            "  onOpen: (db) => db.execute('PRAGMA foreign_keys = ON'),\n" +
            ");",
        },
      },
      {
        title: "운동 종목 이미지 소스(free-exercise-db) 슬러그 불일치",
        problem: "카탈로그 이미지를 cached_network_image로 GitHub free-exercise-db에서 불러왔는데, 상당수 항목에서 이미지가 뜨지 않았습니다.",
        cause: "자체 시딩 데이터의 slug가 실제 데이터셋 명명 규칙과 달라 214개 항목 중 161개가 불일치했습니다.",
        solution:
          "214개 항목의 slug를 free-exercise-db 실제 경로 기준으로 전수 교정해 213/214개를 매칭(1개는 원본에 이미지 자체가 없음). 이미지 로딩 실패 시 errorWidget으로 플레이스홀더를 렌더링하도록 방어 처리.",
      },
      {
        title: "nullable 상태 필드의 copyWith(null) 문제 — 날짜 전환 시 이전 몸무게가 남아있는 버그",
        problem:
          "HomeState.copyWith(weight: null)처럼 값을 의도적으로 null로 바꾸려 해도 기존 값이 유지됐고, 실제로 날짜를 바꾸면 화면에 이전 날짜의 몸무게가 잠깐 남아있었습니다.",
        cause:
          "일반적인 copyWith 구현은 매개변수가 null이면 '전달되지 않음'으로 취급해 '명시적 null 설정'과 '값 유지'를 구분하지 못했습니다. 게다가 selectDay()와 _loadWorkouts() 사이에 비동기 공백이 있어 그 사이 UI는 이전 값을 그대로 보여줬고, 비동기가 끝나 weight: null이 내려와도 TextEditingController는 initState에서 한 번만 세팅되고 이후 갱신되지 않았습니다.",
        solution:
          "센티널 객체(_kUndefined)를 기본값으로 사용해 '명시적 null'과 '값 유지'를 구분. selectDay()에서 값을 즉시 null로 초기화한 뒤 상태 변경 시 바로 rebuild하여 동기화되도록 같은 패턴을 적용.",
        code: {
          lang: "dart",
          snippet:
            "static const _kUndefined = Object();\n\n" +
            "HomeState copyWith({ Object? weight = _kUndefined, ... }) => HomeState(\n" +
            "  weight: weight == _kUndefined ? this.weight : weight as double?,\n" +
            "  ...\n" +
            ");",
        },
      },
    ],
    minorTroubleshooting: [
      { problem: "Column 안 Expanded 사용 시 위젯이 사라짐", cause: "Column이 무한 세로 공간을 제공하는데 Expanded가 유한 기준을 요구", solution: "Expanded 제거 + mainAxisSize: MainAxisSize.min" },
      { problem: "share_plus 설치 후 MissingPluginException", cause: "네이티브 플러그인은 엔진 최초 기동 시 등록되는데 Hot Reload는 네이티브 레이어를 재시작하지 않음", solution: "Full Restart 필요" },
      { problem: "share_plus v10 API 변경으로 컴파일 에러", cause: "인스턴스 방식 API(SharePlus.instance.share)가 제거됨", solution: "정적 메서드(Share.share)로 변경" },
      { problem: "DB 마이그레이션 누락 시 크래시", cause: "_onCreate는 신규 설치에만 실행되어 기존 설치 유저는 스키마가 갱신되지 않음", solution: "_onUpgrade에 버전별 증분 마이그레이션 추가, 중간 버전 스킵도 커버" },
      { problem: "COALESCE(SUM(...), 0)인데도 null 반환", cause: "서브쿼리 자체가 결과를 못 찾으면 SUM 대상이 없어 COALESCE 적용 전에 null", solution: "Dart 쪽에서 null/0 여부를 추가로 체크 후 반환" },
      { problem: "텍스트 공유 → 이미지 캡처 공유 전환", cause: "텍스트만으로는 기록을 한눈에 공유하기 어려움", solution: "RepaintBoundary로 요약 화면 전체를 캡처해 PNG로 공유" },
    ],
    decisions: [],
    learnings: [],
    needsInput: [
      "프로젝트를 시작한 이유",
      "개발하면서 가장 어려웠던 부분과 그 이유",
      "문제 해결 과정에서 생각이 바뀐 지점 (예: 라이브러리 문제인 줄 알았는데 알고 보니 내 코드 문제였던 경험)",
      "아키텍처/설계를 다시 한다면 다르게 할 부분",
      "이 프로젝트를 통해 바뀐 개발자로서의 관점",
    ],
  },
];
