/**
 * Seed data for Korean LMS Platform (한누리 한국어학당)
 */
export const SEED_COURSES = [
  {
    id: 'course-topik-2',
    title: 'TOPIK II 전략 완성반 (5~6급 고득점)',
    subtitle: '기출 분석 및 쓰기 53, 54번 1:1 집중 첨삭',
    category: 'topik',
    categoryName: 'TOPIK',
    level: '중·고급 (3~6급)',
    duration: '8주 완성 (주 3회)',
    lessonsCount: 24,
    rating: 4.9,
    reviewsCount: 382,
    enrolledCount: 2450,
    price: 320000,
    discountPrice: 249000,
    tag: '베스트셀러',
    badgeColor: 'bg-on-tertiary-container text-on-tertiary',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=600&q=80',
    instructor: {
      name: '이수진 대표강사',
      title: '국립국어원 한국어교원 1급 / 서울대 국어교육학 석사',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    features: [
      'TOPIK II 최신 5개년 기출 경향 완벽 반영',
      '작문(쓰기) 1:1 대면/서면 첨삭 총 8회 제공',
      '실전 모의고사 4회분 및 해설 강의'
    ]
  },
  {
    id: 'course-business-1',
    title: '실무 비즈니스 한국어 (이메일 & 회의 커뮤니케이션)',
    subtitle: '한국계 대기업 및 스타트업 실무 비즈니스 매너',
    category: 'business',
    categoryName: '비즈니스',
    level: '중급 이상',
    duration: '6주 완성',
    lessonsCount: 18,
    rating: 4.95,
    reviewsCount: 215,
    enrolledCount: 1280,
    price: 280000,
    discountPrice: 219000,
    tag: '취업 직결',
    badgeColor: 'bg-secondary text-on-secondary',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    instructor: {
      name: '박진우 전문위원',
      title: '전 대기업 해외사업부 인사담당 / 비즈니스 한국어 전문',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    features: [
      '업종별 공식 보고서 및 비즈니스 메일 템플릿 50종 제공',
      '회의 발언, PT 발표 실전 롤플레잉 피드백',
      '한국 직장 문화 및 경어법 마스터'
    ]
  },
  {
    id: 'course-conversation-1',
    title: 'K-Culture 드라마로 배우는 일상 실전 회화',
    subtitle: '현지인들이 진짜 쓰는 자연스러운 뉘앙스와 신조어',
    category: 'conversation',
    categoryName: '회화',
    level: '초·중급',
    duration: '4주 완성',
    lessonsCount: 16,
    rating: 4.88,
    reviewsCount: 520,
    enrolledCount: 3890,
    price: 180000,
    discountPrice: 139000,
    tag: '인기 폭발',
    badgeColor: 'bg-primary text-on-primary',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    instructor: {
      name: '정유나 강사',
      title: '유튜브 K-한국어 크리에이터 / 한국어교육학 전공',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
    },
    features: [
      '인기 K-드라마 명장면으로 배우는 실생활 표현',
      '원어민 음성 쉐도잉 훈련 프로그램',
      '카카오톡 1:1 발음 교정 보이스 피드백'
    ]
  },
  {
    id: 'course-academic-1',
    title: '한국 명문대 입학·대학원 학술 한국어 집중반',
    subtitle: '학업계획서(자기소개서) 작성 및 면접 심층 코칭',
    category: 'academic',
    categoryName: '대학진학',
    level: '고급 (TOPIK 4급 이상)',
    duration: '8주 완성',
    lessonsCount: 20,
    rating: 4.96,
    reviewsCount: 142,
    enrolledCount: 780,
    price: 360000,
    discountPrice: 289000,
    tag: '합격 보장',
    badgeColor: 'bg-on-tertiary-container text-on-tertiary',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    instructor: {
      name: '김태형 교수',
      title: '국내 주요 대학 외국인 전형 면접관 역임',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    features: [
      'SKY 및 주요 명문대 학업계획서 1:1 대면 첨삭',
      '전공별 빈출 면접 질문 분석 및 모의 면접',
      '학술 논문 및 레포트 작성법 특강'
    ]
  }
];

export const SEED_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Nguyen Thi Mai (베트남)',
    badge: 'TOPIK 6급 합격',
    courseTitle: 'TOPIK II 전략 완성반',
    rating: 5,
    comment: '이수진 선생님의 쓰기 54번 템플릿 덕분에 항상 40점대에 머물던 쓰기 점수가 82점까지 올랐어요! 연세대 경영학과 합격했습니다.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'rev-2',
    author: 'Alexandre Dubois (프랑스)',
    badge: '국내 IT 대기업 취업',
    courseTitle: '실무 비즈니스 한국어',
    rating: 5,
    comment: '한국 기업 특유의 이메일 어투와 회의 발언 매너를 정확하게 배울 수 있었습니다. 최종 면접에서도 한국어로 질문에 유창하게 답해 합격했습니다.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'rev-3',
    author: 'Chen Wei (대만)',
    badge: 'TOPIK 5급 3개월 완성',
    courseTitle: '한국어 레벨 진단 & 맞춤 코스',
    rating: 5,
    comment: '처음엔 한국어 말하기가 너무 두려웠는데, 맞춤형 진단과 실시간 피드백으로 3개월 만에 자신감이 붙었습니다. 최고의 LMS 플랫폼입니다!',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
  }
];

export const LEVEL_TEST_QUESTIONS = [
  {
    id: 'q1',
    question: '다음 밑줄 친 부분과 의미가 가장 비슷한 것을 고르십시오.\n"내일 중요한 회의가 있어서 준비를 [철저히] 해야 한다."',
    options: [
      '1) 대충대충',
      '2) 꼼꼼하게',
      '3) 적당히',
      '4) 급하게'
    ],
    answer: 1, // 2)
    levelWeight: 'intermediate'
  },
  {
    id: 'q2',
    question: '다음 빈칸에 들어갈 알맞은 말을 고르십시오.\n"비가 오는 (      ) 날씨가 많이 쌀쌀해졌어요."',
    options: [
      '1) 바람에',
      '2) 탓으로',
      '3) 덕분에',
      '4) 대신에'
    ],
    answer: 0, // 1)
    levelWeight: 'intermediate'
  },
  {
    id: 'q3',
    question: '당신의 주된 한국어 학습 목표는 무엇인가요?',
    options: [
      '1) 한국 유학 및 대학·대학원 진학 (TOPIK)',
      '2) 한국 취업 및 비즈니스 업무',
      '3) 드라마, K-POP, 여행 및 일상 회화',
      '4) 기초 한글부터 탄탄하게 배우기'
    ],
    isGoal: true
  }
];
