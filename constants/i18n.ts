export const KR = {
  // Navigation
  nav: {
    home: '홈',
    search: '검색',
    subscriptions: '구독',
    settings: '설정',
  },

  // Search
  search: {
    title: '플레이어 검색',
    placeholder: 'Riot ID (예: Hide#KR1)',
    recentSearches: '최근 검색',
    noResults: '검색 결과가 없습니다',
    invalidFormat: '올바른 Riot ID 형식이 아닙니다 (예: Name#TAG)',
    searching: '검색 중...',
  },

  // Player Profile
  profile: {
    level: '레벨',
    soloRank: '솔로 랭크',
    flexRank: '자유 랭크',
    unranked: '언랭크',
    wins: '승',
    losses: '패',
    lp: 'LP',
    winRate: '승률',
  },

  // Subscriptions
  subscriptions: {
    title: '구독 목록',
    count: '명의 플레이어',
    empty: '구독 중인 플레이어가 없습니다',
    emptyDescription: '플레이어를 검색하고 구독하면\n게임 시작 시 알림을 받을 수 있습니다',
    searchPrompt: '플레이어 검색하기',
    subscribe: '구독하기',
    subscribed: '구독 중',
    unsubscribe: '구독 취소',
    unsubscribeConfirm: '구독을 취소하시겠습니까?',
  },

  // Auth
  auth: {
    login: '로그인',
    logout: '로그아웃',
    googleSignIn: 'Google로 계속하기',
    loginRequired: '로그인이 필요합니다',
    loginDescription: '구독 기능을 사용하려면\nGoogle 계정으로 로그인해주세요',
  },

  // Settings
  settings: {
    title: '설정',
    account: '계정',
    notifications: '알림 설정',
    pushNotifications: '푸시 알림',
    notificationPermission: '알림 권한 설정',
    terms: '이용약관',
    privacy: '개인정보처리방침',
    tutorial: '튜토리얼 다시보기',
    version: '버전',
    notLoggedIn: '로그인하여 구독 기능을 사용하세요',
  },

  // Tutorial
  tutorial: {
    skip: '건너뛰기',
    next: '다음',
    start: '시작하기',
    slides: [
      {
        title: '플레이어 검색',
        description: 'Riot ID를 입력하여\n리그 오브 레전드 플레이어를 검색하세요',
      },
      {
        title: '프로필 확인',
        description: '플레이어의 랭크, 레벨,\n프로필 아이콘을 확인할 수 있습니다',
      },
      {
        title: '구독하기',
        description: '관심 있는 플레이어를 구독하면\n게임 시작 시 알림을 받을 수 있습니다',
      },
      {
        title: '게임 시작 알림',
        description: '구독한 플레이어가 게임을 시작하면\n즉시 푸시 알림으로 알려드립니다',
      },
    ],
  },

  // Errors
  errors: {
    network: '네트워크 오류가 발생했습니다',
    playerNotFound: '플레이어를 찾을 수 없습니다',
    loginFailed: '로그인에 실패했습니다',
    subscriptionFailed: '구독에 실패했습니다',
    generic: '오류가 발생했습니다',
  },

  // Common
  common: {
    cancel: '취소',
    confirm: '확인',
    retry: '다시 시도',
    loading: '로딩 중...',
  },
} as const;
