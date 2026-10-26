/**
 * i18n.js - 국제화(다국어) 지원 시스템
 */

const translations = {
  ko: {
    // 공통
    'common.language': '한국어',
    'common.notifications': '알림',
    'common.profile': '프로필',

    // 로그인 페이지
    'login.title': '한누리 한국어학당',
    'login.subtitle': '로그인하여 시작하세요',
    'login.desc1': '본 프로그램은 구글 계정으로 로그인 후 사용할 수 있습니다.',
    'login.desc2': '처음 접속하신 분은 구글 계정으로 로그인 시 자동 회원가입 후 사용할 수 있습니다.',
    'login.googleBtn': 'Google로 로그인',
    'login.loading': '로그인 중...',

    // 프로필 메뉴
    'profile.info': '프로필 정보',
    'profile.logout': '로그아웃',
    'profile.name': '이름',
    'profile.email': '이메일',
    'profile.role': '역할',
    'profile.admin': '👑 관리자',
    'profile.user': '👤 일반 사용자',
    'profile.joinDate': '가입 일자',
    'profile.close': '닫기',

    // 네비게이션
    'nav.explore': '강좌 탐색',
    'nav.learning': '학습실',
    'nav.classroom': '강의실',
    'nav.admin': '운영관리',

    // 랜딩 페이지
    'landing.coursesCount': '전체 {count}개 개설',
    'landing.noCoursesFound': '해당 카테고리 강좌가 없습니다.',
    'landing.levelTest': '3분 한국어 레벨 진단',
    'landing.consultation': '무료 1:1 학습 컨설팅',
    'landing.consultationDesc': '학습 목표와 현재 수준을 알려주시면, 전담 컨설턴트가 맞춤 커리큘럼을 제안해 드립니다.',

    // 레벨 테스트
    'levelTest.title': '레벨 진단 완료!',
    'levelTest.goal': '목표',
    'levelTest.recommended': '🎯 AI 추천 강좌',
    'levelTest.consult': '무료 1:1 상담으로 확정하기',

    // 메시지
    'message.welcome': '환영합니다, {name}!',
    'message.newUser': '{name}님, 회원가입을 환영합니다! 🎉',
    'message.adminOnly': '관리자만 접근 가능합니다.',
    'message.logout': '로그아웃되었습니다.',
    'message.error': '오류가 발생했습니다.',
  },
  en: {
    // Common
    'common.language': 'English',
    'common.notifications': 'Notifications',
    'common.profile': 'Profile',

    // Login Page
    'login.title': 'HanuriKorean Academy',
    'login.subtitle': 'Start with a Google sign-in',
    'login.desc1': 'This program is available after signing in with a Google account.',
    'login.desc2': 'First-time visitors can automatically sign up and start using the platform by signing in with a Google account.',
    'login.googleBtn': 'Sign in with Google',
    'login.loading': 'Signing in...',

    // Profile Menu
    'profile.info': 'Profile Information',
    'profile.logout': 'Sign Out',
    'profile.name': 'Name',
    'profile.email': 'Email',
    'profile.role': 'Role',
    'profile.admin': '👑 Administrator',
    'profile.user': '👤 User',
    'profile.joinDate': 'Join Date',
    'profile.close': 'Close',

    // Navigation
    'nav.explore': 'Explore Courses',
    'nav.learning': 'Learning Room',
    'nav.classroom': 'Classroom',
    'nav.admin': 'Admin Panel',

    // Landing Page
    'landing.coursesCount': '{count} courses available',
    'landing.noCoursesFound': 'No courses found in this category.',
    'landing.levelTest': '3-Minute Korean Level Test',
    'landing.consultation': 'Free 1:1 Learning Consultation',
    'landing.consultationDesc': 'Tell us your learning goals and current level, and our consultants will suggest a customized curriculum.',

    // Level Test
    'levelTest.title': 'Level Assessment Complete!',
    'levelTest.goal': 'Goal',
    'levelTest.recommended': '🎯 AI Recommended Course',
    'levelTest.consult': 'Confirm with Free 1:1 Consultation',

    // Messages
    'message.welcome': 'Welcome, {name}!',
    'message.newUser': 'Welcome, {name}! Congratulations on signing up! 🎉',
    'message.adminOnly': 'Only administrators can access this.',
    'message.logout': 'You have been signed out.',
    'message.error': 'An error occurred.',
  }
};

let currentLanguage = localStorage.getItem('app-language') || 'ko';

/**
 * 현재 언어 설정
 */
export function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('app-language', lang);
    return true;
  }
  return false;
}

/**
 * 현재 언어 조회
 */
export function getLanguage() {
  return currentLanguage;
}

/**
 * 번역 텍스트 조회
 * @param {string} key - 번역 키 (예: 'login.title')
 * @param {object} variables - 변수 치환 (예: {name: 'John'})
 * @returns {string} 번역된 텍스트
 */
export function t(key, variables = {}) {
  let text = translations[currentLanguage]?.[key] || translations.ko[key] || key;

  // 변수 치환
  Object.entries(variables).forEach(([varKey, varValue]) => {
    text = text.replace(new RegExp(`{${varKey}}`, 'g'), varValue);
  });

  return text;
}

/**
 * 사용 가능한 언어 목록
 */
export function getAvailableLanguages() {
  return [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: 'English' }
  ];
}
