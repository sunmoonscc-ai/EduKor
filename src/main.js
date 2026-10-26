/**
 * main.js — 한누리 한국어학당 앱 진입점 & 라우터
 */
import { renderLandingView } from './views/landingView.js';
import { renderLearnerView, renderLessonDetailModal, renderPartDetailModal } from './views/learnerView.js';
import { renderEducatorView } from './views/educatorView.js';
import { renderAdminView } from './views/adminView.js';
import { renderUserManagementView, renderUserCard } from './views/userManagementView.js';
import { renderLoginView } from './views/loginView.js';
import { renderContentManagementView } from './views/contentManagementView.js';
import {
  getCourses,
  getReviews,
  submitConsultation,
  submitLevelTest,
  getAllTeachingCourses,
  createTeachingCourse,
  updateTeachingCourse,
  deleteTeachingCourse,
  getTeachingLessonsByCourseId,
  createTeachingLesson,
  updateTeachingLesson,
  deleteTeachingLesson,
  createLessonPart,
  getLessonParts,
  updateLessonPart,
  deleteLessonPart
} from './services/courseService.js';
import { createInvitation, copyToClipboard } from './services/invitationService.js';
import { LEVEL_TEST_QUESTIONS, SEED_COURSES } from './services/seedData.js';
import {
  loginWithGoogle,
  logout,
  onAuthChange
} from './services/authService.js';
import {
  db,
  auth,
  collection,
  getDocs,
  query,
  orderBy
} from './firebase.js';
import {
  setLanguage,
  getLanguage,
  t,
  getAvailableLanguages
} from './i18n.js';

// ── State ──────────────────────────────────────────────────────────────────────
let currentView = 'landing';
let currentCategory = 'all';
let levelTestAnswers = [];
let levelTestStep = 0;
let currentUser = null;

// ── DOM refs ───────────────────────────────────────────────────────────────────
const viewRoot = document.getElementById('view-root');
const navBtns = document.querySelectorAll('.nav-btn');

// ── Router ─────────────────────────────────────────────────────────────────────
async function navigateTo(view) {
  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!currentUser && view !== 'login') {
    view = 'login';
  }

  // admin 권한이 없으면 admin 페이지 접근 불가
  if (view === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
    showToast('관리자만 접근 가능합니다.', 'error');
    view = 'landing';
  }

  currentView = view;
  // 현재 페이지 저장 (새로고침 후 복원용)
  if (view !== 'login') {
    localStorage.setItem('koredu_lastView', view);
    updateNavActive(view);
  } else {
    localStorage.removeItem('koredu_lastView');
  }

  // Animate out
  viewRoot.style.opacity = '0';
  viewRoot.style.transform = 'translateY(6px)';

  await new Promise(r => setTimeout(r, 120));

  // Render view
  switch (view) {
    case 'login':
      viewRoot.innerHTML = renderLoginView();
      initLoginView();
      break;
    case 'landing':
      viewRoot.innerHTML = renderLandingView();
      await initLandingView();
      break;
    case 'learner':
      viewRoot.innerHTML = renderLearnerView();
      initLearnerView();
      break;
    case 'educator':
      viewRoot.innerHTML = renderEducatorView();
      initEducatorView();
      break;
    case 'admin':
      viewRoot.innerHTML = renderAdminView();
      initAdminView();
      break;
    default:
      viewRoot.innerHTML = renderLandingView();
      await initLandingView();
  }

  // Animate in
  viewRoot.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  viewRoot.style.opacity = '1';
  viewRoot.style.transform = 'translateY(0)';

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavActive(view) {
  const navLabels = {
    landing: t('nav.explore'),
    learner: t('nav.learning'),
    educator: t('nav.classroom'),
    admin: t('nav.admin')
  };

  navBtns.forEach(btn => {
    const isActive = btn.dataset.view === view;
    const icon = btn.querySelector('.nav-icon');
    const label = btn.querySelector('.nav-label');

    // 메뉴 텍스트 업데이트
    if (navLabels[btn.dataset.view]) {
      label.textContent = navLabels[btn.dataset.view];
    }

    if (isActive) {
      icon.classList.replace('text-on-surface-variant', 'text-secondary');
      icon.style.fontVariationSettings = "'FILL' 1";
      label.classList.replace('text-on-surface-variant', 'text-secondary');
      btn.classList.add('bg-secondary-fixed/30');
    } else {
      icon.style.fontVariationSettings = "'FILL' 0";
      icon.classList.remove('text-secondary');
      icon.classList.add('text-on-surface-variant');
      label.classList.remove('text-secondary');
      label.classList.add('text-on-surface-variant');
      btn.classList.remove('bg-secondary-fixed/30');
    }
  });
}

function updateNavLabels() {
  const navLabels = {
    landing: t('nav.explore'),
    learner: t('nav.learning'),
    educator: t('nav.classroom'),
    admin: t('nav.admin')
  };

  navBtns.forEach(btn => {
    const label = btn.querySelector('.nav-label');
    if (navLabels[btn.dataset.view]) {
      label.textContent = navLabels[btn.dataset.view];
    }
  });
}

// ── Login View Init ────────────────────────────────────────────────────────────
async function initLoginView() {
  const loginBtn = document.getElementById('btn-google-login');
  const loadingDiv = document.getElementById('login-loading');
  const errorDiv = document.getElementById('login-error');
  const errorMsg = document.getElementById('error-message');

  loginBtn.addEventListener('click', async () => {
    loginBtn.classList.add('hidden');
    loadingDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');

    const result = await loginWithGoogle();

    if (result.success) {
      currentUser = result.user;

      // 하단 네비게이션 표시
      const bottomNav = document.getElementById('bottom-nav');
      if (bottomNav) {
        bottomNav.classList.remove('hidden');
      }

      // 알림과 프로필 버튼 표시
      const notificationsBtn = document.getElementById('btn-notifications');
      const profileBtn = document.getElementById('profile-btn');
      if (notificationsBtn) notificationsBtn.classList.remove('hidden');
      if (profileBtn) profileBtn.classList.remove('hidden');

      // 운영관리 메뉴 업데이트
      const adminBtn = document.getElementById('nav-admin');
      if (adminBtn) {
        if (result.user.role === 'admin') {
          adminBtn.classList.remove('hidden');
        } else {
          adminBtn.classList.add('hidden');
        }
      }

      if (result.isNewUser) {
        showToast(t('message.newUser', { name: result.user.name }), 'secondary');
      } else {
        showToast(t('message.welcome', { name: result.user.name }), 'secondary');
      }

      await navigateTo('landing');
    } else {
      loginBtn.classList.remove('hidden');
      loadingDiv.classList.add('hidden');
      errorDiv.classList.remove('hidden');
      errorMsg.textContent = result.error || '로그인에 실패했습니다.';
    }
  });
}

// ── Landing View Init ──────────────────────────────────────────────────────────
async function initLandingView() {
  // Load courses
  const courses = await getCourses(currentCategory);
  renderCourseCards(courses);

  // Load reviews
  const reviews = await getReviews();
  renderReviews(reviews);

  // Category filter pills
  const catChips = document.querySelectorAll('.cat-pill');
  catChips.forEach(chip => {
    chip.addEventListener('click', async () => {
      catChips.forEach(c => {
        c.classList.remove('active', 'bg-primary', 'text-on-primary', 'shadow-sm');
        c.classList.add('bg-surface-container', 'text-on-surface');
      });
      chip.classList.add('active', 'bg-primary', 'text-on-primary', 'shadow-sm');
      chip.classList.remove('bg-surface-container', 'text-on-surface');
      currentCategory = chip.dataset.cat;
      const filtered = await getCourses(currentCategory);
      renderCourseCards(filtered);
    });
  });

  // CTA buttons
  document.getElementById('btn-open-level-test')?.addEventListener('click', openLevelTestModal);
  document.getElementById('btn-open-consultation')?.addEventListener('click', openConsultationModal);
  document.getElementById('btn-bottom-consultation')?.addEventListener('click', openConsultationModal);
}

function renderCourseCards(courses) {
  const container = document.getElementById('courses-list-container');
  const countLabel = document.getElementById('courses-count-label');
  if (!container) return;

  if (countLabel) {
    countLabel.textContent = `전체 ${courses.length}개 개설`;
  }

  if (courses.length === 0) {
    container.innerHTML = `
      <div class="p-10 text-center flex flex-col items-center gap-2">
        <span class="material-symbols-outlined text-[36px] text-on-surface-variant">search_off</span>
        <span class="font-body-md text-on-surface-variant">해당 카테고리 강좌가 없습니다.</span>
      </div>`;
    return;
  }

  container.innerHTML = courses.map(course => `
    <article class="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-container hover:shadow-md transition-shadow cursor-pointer" data-course-id="${course.id}">
      <!-- Thumbnail -->
      <div class="relative h-40 w-full overflow-hidden">
        <img
          src="${course.thumbnailUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80'}"
          alt="${course.title}"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
        <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold ${course.badgeColor || 'bg-secondary text-on-secondary'}">
          ${course.tag || ''}
        </span>
        <span class="absolute bottom-3 right-3 flex items-center gap-1 font-label-sm text-label-sm text-on-primary font-bold">
          <span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1">star</span>
          ${course.rating}
          <span class="font-normal opacity-80">(${course.reviewsCount?.toLocaleString()})</span>
        </span>
      </div>

      <!-- Content -->
      <div class="p-space-md flex flex-col gap-2.5">
        <div class="flex items-start justify-between gap-2">
          <div class="flex flex-col gap-0.5 flex-1 min-w-0">
            <h3 class="font-headline-md text-headline-md text-on-surface font-bold leading-snug line-clamp-2">${course.title}</h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">${course.subtitle}</p>
          </div>
        </div>

        <!-- Instructor row -->
        <div class="flex items-center gap-2">
          <img
            src="${course.instructor?.avatarUrl || ''}"
            alt="${course.instructor?.name}"
            class="w-7 h-7 rounded-full object-cover flex-shrink-0"
          />
          <div class="flex flex-col min-w-0">
            <span class="font-label-md text-label-md text-on-surface font-bold truncate">${course.instructor?.name}</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant truncate">${course.instructor?.title}</span>
          </div>
        </div>

        <!-- Meta info -->
        <div class="flex items-center gap-3 text-on-surface-variant font-label-sm text-label-sm">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">schedule</span>
            ${course.duration}
          </span>
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">play_circle</span>
            ${course.lessonsCount}강
          </span>
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">people</span>
            ${course.enrolledCount?.toLocaleString()}명
          </span>
        </div>

        <!-- Features -->
        <ul class="flex flex-col gap-1">
          ${(course.features || []).slice(0, 2).map(f => `
            <li class="flex items-start gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[13px] text-secondary mt-0.5 flex-shrink-0">check_circle</span>
              <span class="line-clamp-1">${f}</span>
            </li>`).join('')}
        </ul>

        <!-- Price & CTA -->
        <div class="flex items-center justify-between pt-1 border-t border-surface-container mt-1">
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant line-through">₩${course.price?.toLocaleString()}</span>
            <span class="font-headline-md text-headline-md text-secondary font-bold">₩${course.discountPrice?.toLocaleString()}</span>
          </div>
          <button class="btn-enroll h-10 px-5 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold flex items-center gap-1.5 shadow-md shadow-secondary/20 active:scale-[0.98] transition-transform cursor-pointer hover:bg-secondary/90"
            data-course-id="${course.id}">
            <span>수강 신청</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  // Course card click → enroll handler
  container.querySelectorAll('.btn-enroll').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openConsultationModal();
    });
  });
}

function renderReviews(reviews) {
  const container = document.getElementById('reviews-container');
  if (!container) return;

  container.innerHTML = reviews.map(review => `
    <div class="shrink-0 w-72 bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container flex flex-col gap-3">
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-2">
          <img src="${review.avatar}" alt="${review.author}" class="w-9 h-9 rounded-full object-cover flex-shrink-0" />
          <div class="flex flex-col">
            <span class="font-label-md text-label-md text-on-surface font-bold">${review.author}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed mt-0.5 w-fit">${review.badge}</span>
          </div>
        </div>
        <div class="flex items-center gap-0.5 text-on-tertiary-container flex-shrink-0">
          ${'<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: \'FILL\' 1">star</span>'.repeat(review.rating)}
        </div>
      </div>
      <p class="font-body-sm text-body-sm text-on-surface leading-relaxed line-clamp-4">"${review.comment}"</p>
      <span class="font-label-sm text-label-sm text-on-surface-variant">${review.courseTitle}</span>
    </div>
  `).join('');
}

// ── Learner View Init ──────────────────────────────────────────────────────────
async function initLearnerView() {
  console.log('✅ Learner view initialized');

  // 강좌 목록 로드
  await loadAndRenderCourses();
}

async function loadAndRenderCourses() {
  try {
    const courses = await getAllTeachingCourses();
    const coursesList = document.getElementById('courses-list');
    const coursesCount = document.getElementById('courses-count');

    if (!coursesList) return;

    if (courses.length === 0) {
      coursesList.innerHTML = `
        <div class="flex flex-col items-center justify-center py-16 gap-3">
          <span class="material-symbols-outlined text-[40px] text-on-surface-variant">library_books</span>
          <p class="font-body-md text-on-surface-variant">준비된 강좌가 없습니다</p>
        </div>
      `;
      coursesCount.textContent = '0개';
      return;
    }

    // 강좌 카드 렌더링
    const { renderCourseCard } = await import('./views/learnerView.js');
    coursesList.innerHTML = courses.map(course => renderCourseCard(course)).join('');
    coursesCount.textContent = `${courses.length}개`;

    // 강좌 카드 클릭 이벤트
    coursesList.querySelectorAll('.course-card').forEach(card => {
      card.addEventListener('click', () => {
        const courseId = card.dataset.courseId;
        const course = courses.find(c => c.id === courseId);
        showCourseDetailModal(course);
      });
    });
  } catch (error) {
    console.error('❌ 강좌 로드 실패:', error);
    showToast('강좌를 불러올 수 없습니다.', 'error');
  }
}

function showCourseDetailModal(course) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="absolute inset-0 bg-primary/40 backdrop-blur-sm" id="modal-overlay"></div>
    <div class="relative w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-xl border border-surface-container p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
      <div class="flex items-center justify-between">
        <h2 class="font-headline-md text-headline-md text-on-surface font-bold">${course.title}</h2>
        <button class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-surface-container-high" id="btn-close-modal">
          <span class="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
        </button>
      </div>

      <!-- 강좌 정보 -->
      <div class="flex flex-col gap-3">
        <div class="p-4 rounded-xl bg-surface-container-low">
          <p class="font-label-sm text-label-sm text-on-surface-variant mb-1">강좌 설명</p>
          <p class="font-body-md text-body-md text-on-surface">${course.description}</p>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div class="p-3 rounded-xl bg-surface-container-low">
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-1">대상 수준</p>
            <p class="font-headline-md text-headline-md text-on-surface font-bold">${course.level || '미정'}</p>
          </div>

          <div class="p-3 rounded-xl bg-surface-container-low">
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-1">총 차시</p>
            <p class="font-headline-md text-headline-md text-on-surface font-bold">${course.totalLessons || 0}</p>
          </div>

          <div class="p-3 rounded-xl bg-surface-container-low">
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-1">강사</p>
            <p class="font-headline-md text-headline-md text-on-surface font-bold truncate">${course.instructor || '미정'}</p>
          </div>
        </div>
      </div>

      <!-- 차시 목록 -->
      <div id="lessons-container" class="flex flex-col gap-3 mt-4">
        <h3 class="font-label-md text-label-md text-on-surface font-bold">차시 목록</h3>
        <div id="lessons-list" class="flex flex-col gap-2 overflow-y-auto max-h-[40vh]">
          <div class="flex items-center justify-center py-8 text-on-surface-variant">
            <span class="material-symbols-outlined text-[24px] mr-2">hourglass_empty</span>
            <span>차시 목록 로드 중...</span>
          </div>
        </div>
      </div>

      <!-- 버튼 -->
      <button class="w-full h-12 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold cursor-pointer hover:bg-secondary/90 transition-colors mt-4" id="btn-start-course">
        강의 시작
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  // 모달 닫기
  const closeModal = () => modal.remove();
  document.getElementById('modal-overlay').addEventListener('click', closeModal);
  document.getElementById('btn-close-modal').addEventListener('click', closeModal);

  // 차시 목록 로드
  loadLessons(course.id);

  // 강의 시작 버튼
  document.getElementById('btn-start-course').addEventListener('click', () => {
    showToast('강의 플레이어가 준비 중입니다.', 'secondary');
    closeModal();
  });
}

async function loadLessons(courseId) {
  try {
    const lessons = await getTeachingLessonsByCourseId(courseId);
    const lessonsList = document.getElementById('lessons-list');

    if (!lessonsList) return;

    if (lessons.length === 0) {
      lessonsList.innerHTML = `
        <div class="text-center py-4">
          <p class="font-body-md text-on-surface-variant">등록된 차시가 없습니다</p>
        </div>
      `;
      return;
    }

    lessonsList.innerHTML = lessons.map(lesson => `
      <div class="p-3 rounded-xl bg-surface-container-low border border-surface-container cursor-pointer hover:bg-surface-container transition-colors" data-lesson-id="${lesson.id}">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="font-label-md text-label-md text-secondary font-bold">${lesson.lessonNumber}차시</p>
            <p class="font-body-md text-body-md text-on-surface mt-1">${lesson.title}</p>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">학습 글자: ${lesson.learnLetters || '미정'}</p>
            ${lesson.goal ? `<p class="font-label-sm text-label-sm text-on-surface-variant mt-2">목표: ${lesson.goal}</p>` : ''}
          </div>
          <span class="material-symbols-outlined text-[20px] text-on-surface-variant flex-shrink-0">arrow_forward</span>
        </div>
      </div>
    `).join('');

    // 차시 클릭 이벤트
    lessonsList.querySelectorAll('[data-lesson-id]').forEach(el => {
      el.addEventListener('click', () => {
        showLessonDetail(lessons.find(l => l.id === el.dataset.lessonId));
      });
    });
  } catch (error) {
    console.error('❌ 차시 로드 실패:', error);
  }
}

async function showLessonDetail(lesson) {
  try {
    // 레슨 파트 로드
    const parts = await getLessonParts(lesson.id);

    // 모달 HTML 생성
    const modalHTML = renderLessonDetailModal(lesson, parts);

    // 파트 정보 저장 (아코디언 클릭 시 사용)
    window.currentLessonPartsForModal = parts;

    // 뷰에 모달 추가
    viewRoot.insertAdjacentHTML('afterend', modalHTML);

    // 모달 표시
    const modal = document.getElementById('modal-lesson-detail');
    if (modal) {
      modal.classList.remove('hidden');

      // 닫기 버튼 이벤트
      document.getElementById('btn-close-lesson-modal')?.addEventListener('click', () => {
        modal.remove();
      });

      document.getElementById('modal-lesson-overlay')?.addEventListener('click', () => {
        modal.remove();
      });

      // 파트 아코디언 이벤트 - 클릭 시 전체화면 모달 띄우기
      document.querySelectorAll('.lesson-part-accordion-header').forEach(header => {
        header.addEventListener('click', (e) => {
          e.preventDefault();
          const partId = header.getAttribute('data-part-id');
          const parts = window.currentLessonPartsForModal || [];
          const part = parts.find(p => p.id === partId);
          if (part) {
            showPartDetailModal(part);
          }
        });
      });
    }
  } catch (error) {
    console.error('❌ 레슨 상세 로드 실패:', error);
    showToast('강의를 불러올 수 없습니다.', 'error');
  }
}

// ── Educator View Init ─────────────────────────────────────────────────────────
function initEducatorView() {
  // Live room button
  document.getElementById('open-live-btn')?.addEventListener('click', () => {
    showToast('🎥 화상 강의실 연결 중...', 'secondary');
  });

  // Attendance buttons
  document.querySelectorAll('.attendance-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.innerHTML = `<span class="material-symbols-outlined text-[15px]">done_all</span><span>출석 완료</span>`;
      btn.classList.add('bg-secondary', 'text-on-secondary');
      showToast('출석이 확인되었습니다.', 'secondary');
    });
  });
}

// ── Admin View Init ────────────────────────────────────────────────────────────
let currentAdminSubTab = 'dashboard';
let allUsers = [];

function initAdminView() {
  // 서브탭 버튼 이벤트
  document.querySelectorAll('.admin-sub-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const subTab = btn.dataset.subTab;
      switchAdminSubTab(subTab);
    });
  });

  // 초기 대시보드 탭 활성화
  switchAdminSubTab('dashboard');
}

// ── 교육콘텐츠 관리 초기화 ─────────────────────────────────────────────────────
let allTeachingCourses = [];
let selectedCourseForLessons = null;
let selectedLessonForParts = null;
let selectedPartForEdit = null;
let allLessonsForSelectedCourse = [];
let allPartsForSelectedLesson = [];

async function initContentManagementView() {
  // 강의 목록 로드
  await loadTeachingCourses();

  // 탭 버튼 이벤트
  document.querySelectorAll('.content-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      switchContentTab(btn.dataset.tab);
    });
  });

  // 새 강의 버튼
  document.getElementById('btn-new-course')?.addEventListener('click', () => {
    showCourseModal();
  });

  // 모달 닫기 버튼
  document.getElementById('btn-close-course-modal')?.addEventListener('click', closeCourseModal);
  document.getElementById('modal-course-overlay')?.addEventListener('click', closeCourseModal);
  document.getElementById('btn-cancel-course')?.addEventListener('click', closeCourseModal);

  // 강의 폼 제출
  document.getElementById('form-course')?.addEventListener('submit', handleCourseSubmit);

  // 차시 관리 탭 이벤트
  const coursesSelectForLessons = document.getElementById('select-course-for-lessons');
  console.log('📌 차시 관리 초기화:', {
    selectExists: !!coursesSelectForLessons,
    coursesCount: allTeachingCourses.length,
    courses: allTeachingCourses.map(c => ({ id: c.id, title: c.title }))
  });

  if (coursesSelectForLessons) {
    const optionHtml = '<option value="">강의를 선택하세요</option>' +
      allTeachingCourses.map(course => `<option value="${course.id}">${course.title}</option>`).join('');
    console.log('✏️ 드롭다운 HTML 설정:', optionHtml);
    coursesSelectForLessons.innerHTML = optionHtml;

    coursesSelectForLessons.addEventListener('change', async (e) => {
      console.log('🔄 드롭다운 change 이벤트 발생:', e.target.value);
      selectedCourseForLessons = e.target.value;
      await loadLessonsForSelectedCourse();
    });
  }

  // 새 차시 버튼
  document.getElementById('btn-new-lesson')?.addEventListener('click', () => {
    if (!selectedCourseForLessons) {
      showToast('먼저 강의를 선택해주세요.', 'info');
      return;
    }
    showLessonModal();
  });

  // 차시 모달 닫기 버튼
  document.getElementById('btn-close-lesson-modal')?.addEventListener('click', closeLessonModal);
  document.getElementById('modal-lesson-overlay')?.addEventListener('click', closeLessonModal);
  document.getElementById('btn-cancel-lesson')?.addEventListener('click', closeLessonModal);

  // 차시 폼 제출
  document.getElementById('form-lesson')?.addEventListener('submit', handleLessonSubmit);

  // 파트 추가 버튼
  document.getElementById('btn-new-part')?.addEventListener('click', () => {
    showPartForm();
  });

  // 파트 모달 닫기 버튼
  document.getElementById('btn-close-part-modal')?.addEventListener('click', hidePartForm);
  document.getElementById('modal-part-overlay')?.addEventListener('click', hidePartForm);
  document.getElementById('btn-cancel-part')?.addEventListener('click', hidePartForm);

  // 파트 폼 제출
  document.getElementById('form-part')?.addEventListener('submit', handlePartSubmit);
}

async function loadLessonsForSelectedCourse() {
  if (!selectedCourseForLessons) {
    console.warn('⚠️ selectedCourseForLessons가 설정되지 않음');
    return;
  }

  try {
    console.log('📚 차시 목록 로드 시작:', selectedCourseForLessons);
    allLessonsForSelectedCourse = await getTeachingLessonsByCourseId(selectedCourseForLessons);
    console.log('✅ 차시 데이터 조회 완료:', allLessonsForSelectedCourse);
    renderLessonsList(allLessonsForSelectedCourse);
  } catch (error) {
    console.error('❌ 차시 목록 로드 실패:', error);
    showToast('차시 목록을 불러올 수 없습니다.', 'error');
  }
}

function renderLessonsList(lessons) {
  const container = document.getElementById('lessons-list-container');
  console.log('🎬 renderLessonsList 호출:', {
    lessonsCount: lessons.length,
    containerExists: !!container,
    lessons: lessons.map(l => ({ id: l.id, number: l.lessonNumber, title: l.title }))
  });

  if (!container) {
    console.error('❌ lessons-list-container를 찾을 수 없습니다!');
    console.log('📍 현재 DOM:', document.body.innerHTML.substring(0, 500));
    return;
  }

  console.log('✅ container 찾음. 렌더링 시작...');

  if (lessons.length === 0) {
    container.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-20 gap-3">
        <span class="material-symbols-outlined text-[48px] text-on-surface-variant">library_books</span>
        <p class="font-headline-md text-headline-md text-on-surface font-bold">차시가 없습니다</p>
        <p class="font-body-md text-on-surface-variant">새 차시 버튼을 클릭해서 차시를 추가하세요</p>
      </div>
    `;
    return;
  }

  container.innerHTML = lessons.map(lesson => `
    <div class="flex flex-col gap-0">
      <!-- 차시 카드 -->
      <div class="bg-surface-container-lowest rounded-t-2xl border border-surface-container border-b-0 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer lesson-card" data-lesson-id="${lesson.id}">
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1">
            <h3 class="font-headline-md text-headline-md text-on-surface font-bold">차시 ${lesson.lessonNumber}</h3>
            <h4 class="font-label-md text-label-md text-on-surface-variant mt-1">${lesson.title}</h4>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button class="px-2 py-1 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm cursor-pointer hover:bg-surface-container-high btn-edit-lesson" data-lesson-id="${lesson.id}">
              편집
            </button>
            <button class="px-2 py-1 rounded-lg bg-error/10 text-error font-label-sm text-label-sm cursor-pointer hover:bg-error/20 btn-delete-lesson" data-lesson-id="${lesson.id}">
              삭제
            </button>
          </div>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${lesson.goal}</p>
        <p class="font-label-sm text-on-surface-variant">배울 글자: ${lesson.learnLetters}</p>
      </div>

      <!-- 파트 관리 섹션 (숨김) -->
      <div class="lesson-parts-section hidden bg-primary/5 border border-surface-container border-t-0 rounded-b-2xl p-4 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <h4 class="font-headline-sm text-headline-sm text-on-surface font-bold">파트 관리</h4>
          <button class="px-3 py-1 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-bold cursor-pointer hover:bg-primary/90 transition-colors btn-add-part" data-lesson-id="${lesson.id}">
            + 파트 추가
          </button>
        </div>
        <div class="lesson-parts-list text-sm text-on-surface-variant">파트가 없습니다</div>
      </div>
    </div>
  `).join('');

  console.log('🎨 HTML 렌더링 완료, 이벤트 바인드 시작...');

  // 차시 카드 클릭 이벤트 - 파트 관리 섹션 토글
  const lessonCards = container.querySelectorAll('.lesson-card');
  console.log('📌 차시 카드 개수:', lessonCards.length);
  lessonCards.forEach(card => {
    card.addEventListener('click', async (e) => {
      // 편집/삭제 버튼 클릭은 무시
      if (e.target.closest('button')) return;

      const lessonId = card.dataset.lessonId;
      const lesson = allLessonsForSelectedCourse.find(l => l.id === lessonId);
      const partsSection = card.parentElement.querySelector('.lesson-parts-section');
      const isOpen = !partsSection.classList.contains('hidden');

      if (isOpen) {
        // 닫기
        partsSection.classList.add('hidden');
      } else {
        // 열기
        if (lesson) {
          selectedLessonForParts = lessonId;
          await loadPartsForSelectedLesson(lesson, partsSection);
          partsSection.classList.remove('hidden');
        }
      }
    });
  });

  // 편집 버튼
  container.querySelectorAll('.btn-edit-lesson').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const lessonId = btn.dataset.lessonId;
      const lesson = allLessonsForSelectedCourse.find(l => l.id === lessonId);
      if (lesson) {
        showLessonModal(lesson);
      }
    });
  });

  // 삭제 버튼
  container.querySelectorAll('.btn-delete-lesson').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const lessonId = btn.dataset.lessonId;
      const lesson = allLessonsForSelectedCourse.find(l => l.id === lessonId);
      if (lesson && confirm(`"${lesson.title}" 차시를 삭제하시겠습니까?`)) {
        try {
          const result = await deleteTeachingLesson(lessonId);
          if (result.success) {
            showToast('차시가 삭제되었습니다.', 'success');
            await loadLessonsForSelectedCourse();
          } else {
            showToast('차시 삭제에 실패했습니다.', 'error');
          }
        } catch (error) {
          console.error('❌ 차시 삭제 실패:', error);
          showToast('차시 삭제 중 오류가 발생했습니다.', 'error');
        }
      }
    });
  });
}

async function loadPartsForSelectedLesson(lesson, partsSection) {
  try {
    allPartsForSelectedLesson = await getLessonParts(lesson.id);
    if (partsSection) {
      // 각 차시별 파트 섹션에 렌더링
      const partsList = partsSection.querySelector('.lesson-parts-list');
      if (allPartsForSelectedLesson.length === 0) {
        partsList.innerHTML = '<div class="text-sm text-on-surface-variant">파트가 없습니다</div>';
      } else {
        partsList.innerHTML = allPartsForSelectedLesson.map(part => `
          <div class="flex items-center justify-between text-sm bg-surface-container-low rounded p-2">
            <span class="flex-1">${part.partName} (${part.duration}분)</span>
            <div class="flex gap-1">
              <button class="px-2 py-1 text-xs bg-primary/10 text-primary rounded cursor-pointer hover:bg-primary/20 btn-edit-part-inline" data-part-id="${part.id}">
                편집
              </button>
              <button class="px-2 py-1 text-xs bg-error/10 text-error rounded cursor-pointer hover:bg-error/20 btn-delete-part-inline" data-part-id="${part.id}">
                삭제
              </button>
            </div>
          </div>
        `).join('');
      }

      // 인라인 편집 버튼 이벤트 바인딩
      partsList.querySelectorAll('.btn-edit-part-inline').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const partId = btn.dataset.partId;
          const part = allPartsForSelectedLesson.find(p => p.id === partId);
          console.log('📝 파트 편집 클릭:', { partId, part, 폼찾기: !!document.getElementById('form-part') });
          if (part) {
            selectedLessonForParts = lesson.id;
            showPartForm(part);
          }
        });
      });

      // 인라인 삭제 버튼 이벤트 바인딩
      partsList.querySelectorAll('.btn-delete-part-inline').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const partId = btn.dataset.partId;
          if (confirm('이 파트를 삭제하시겠습니까?')) {
            try {
              const result = await deleteLessonPart(partId);
              if (result.success) {
                showToast('파트가 삭제되었습니다.', 'success');
                await loadPartsForSelectedLesson(lesson, partsSection);
              } else {
                showToast('파트 삭제에 실패했습니다.', 'error');
              }
            } catch (error) {
              console.error('❌ 파트 삭제 실패:', error);
              showToast('파트 삭제 중 오류가 발생했습니다.', 'error');
            }
          }
        });
      });

      // 파트 추가 버튼 이벤트 바인딩
      const addPartBtn = partsSection.querySelector('.btn-add-part');
      console.log('🔍 파트 추가 버튼 찾기:', { 버튼찾음: !!addPartBtn, 버튼요소: addPartBtn });
      if (addPartBtn) {
        addPartBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          console.log('➕ 파트 추가 클릭:', { selectedLessonForParts: lesson.id });
          selectedLessonForParts = lesson.id;
          showPartForm();
        });
      }
    } else {
      renderPartsList(allPartsForSelectedLesson);
    }
  } catch (error) {
    console.error('❌ 파트 목록 로드 실패:', error);
    showToast('파트 목록을 불러올 수 없습니다.', 'error');
  }
}

function renderPartsList(parts) {
  const container = document.getElementById('parts-list');
  if (!container) return;

  if (parts.length === 0) {
    container.innerHTML = '<div class="text-center py-8 text-on-surface-variant">파트가 없습니다</div>';
    return;
  }

  container.innerHTML = parts.map(part => `
    <div class="bg-surface-container-low rounded-xl p-3 flex items-center justify-between gap-3">
      <div class="flex-1">
        <h4 class="font-label-md text-label-md text-on-surface font-bold">${part.partName}</h4>
        <p class="font-body-sm text-body-sm text-on-surface-variant">⏱️ ${part.duration}분 • ${part.partType}</p>
      </div>
      <div class="flex gap-1">
        <button class="px-2 py-1 rounded-lg bg-primary text-on-primary font-label-sm cursor-pointer hover:bg-primary/90 btn-edit-part" data-part-id="${part.id}">
          수정
        </button>
        <button class="px-2 py-1 rounded-lg bg-error/10 text-error font-label-sm cursor-pointer hover:bg-error/20 btn-delete-part" data-part-id="${part.id}">
          삭제
        </button>
      </div>
    </div>
  `).join('');

  // 수정 버튼
  container.querySelectorAll('.btn-edit-part').forEach(btn => {
    btn.addEventListener('click', () => {
      const partId = btn.dataset.partId;
      const part = allPartsForSelectedLesson.find(p => p.id === partId);
      if (part) {
        showPartForm(part);
      }
    });
  });

  // 삭제 버튼
  container.querySelectorAll('.btn-delete-part').forEach(btn => {
    btn.addEventListener('click', async () => {
      const partId = btn.dataset.partId;
      if (confirm('이 파트를 삭제하시겠습니까?')) {
        await handleDeletePart(partId);
      }
    });
  });
}

function showPartForm(part = null) {
  const modal = document.getElementById('modal-part-form');
  if (!modal) return;

  const titleEl = document.getElementById('modal-part-title');
  const form = document.getElementById('form-part');

  if (part) {
    titleEl.textContent = '파트 편집';
    selectedPartForEdit = part.id;
    document.getElementById('input-part-type').value = part.partType;
    document.getElementById('input-part-name').value = part.partName;
    document.getElementById('input-part-youtube-id').value = part.youtubeId;
    document.getElementById('input-part-duration').value = part.duration;
    document.getElementById('input-part-description').value = part.description || '';
  } else {
    titleEl.textContent = '파트 추가';
    selectedPartForEdit = null;
    form.reset();
  }

  window.scrollTo(0, 0);
  modal.classList.remove('hidden');
}

function hidePartForm() {
  const modal = document.getElementById('modal-part-form');
  modal?.classList.add('hidden');
  selectedPartForEdit = null;
}

function extractYoutubeId(input) {
  if (!input) return '';

  // 이미 ID 형식인 경우 (11자 길이, alphanumeric, -, _만 포함)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
    return input.trim();
  }

  // URL에서 ID 추출
  let id = '';

  // https://youtube.com/watch?v=VIDEO_ID 또는 youtube.com/shorts/VIDEO_ID 등 다양한 형식 지원
  const match1 = input.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (match1?.[1]) {
    id = match1[1];
  }

  return id;
}

async function handlePartSubmit(e) {
  e.preventDefault();

  const partType = document.getElementById('input-part-type').value;
  const partName = document.getElementById('input-part-name').value;
  const youtubeInput = document.getElementById('input-part-youtube-id').value;
  const youtubeId = extractYoutubeId(youtubeInput);
  const duration = parseInt(document.getElementById('input-part-duration').value);
  const description = document.getElementById('input-part-description').value;
  const isShorts = youtubeInput.includes('/shorts/');

  if (!selectedLessonForParts) {
    showToast('차시가 선택되지 않았습니다.', 'error');
    return;
  }

  if (!youtubeId) {
    showToast('유효한 YouTube URL 또는 ID를 입력하세요.', 'error');
    return;
  }

  try {
    if (selectedPartForEdit) {
      // 파트 수정
      const result = await updateLessonPart(selectedPartForEdit, {
        partType,
        partName,
        youtubeId,
        duration,
        description,
        isShorts
      });

      if (result.success) {
        showToast('파트가 수정되었습니다.', 'success');
        hidePartForm();
        // 해당 차시의 파트만 다시 로드
        await refreshPartsSectionForLesson(selectedLessonForParts);
      } else {
        showToast(`파트 수정 실패: ${result.error}`, 'error');
      }
    } else {
      // 파트 생성
      const result = await createLessonPart({
        lessonId: selectedLessonForParts,
        courseId: selectedCourseForLessons,
        partType,
        partName,
        youtubeId,
        duration,
        description,
        isShorts,
        order: allPartsForSelectedLesson.length + 1
      });

      if (result.success) {
        showToast('파트가 추가되었습니다.', 'success');
        hidePartForm();
        // 해당 차시의 파트만 다시 로드
        await refreshPartsSectionForLesson(selectedLessonForParts);
      } else {
        showToast(`파트 추가 실패: ${result.error}`, 'error');
      }
    }
  } catch (error) {
    console.error('❌ 파트 제출 중 오류:', error);
    showToast('파트 처리 중 오류가 발생했습니다.', 'error');
  }
}

async function refreshPartsSectionForLesson(lessonId) {
  const lesson = allLessonsForSelectedCourse.find(l => l.id === lessonId);
  if (!lesson) return;

  const lessonCard = document.querySelector(`[data-lesson-id="${lessonId}"]`);
  if (!lessonCard) return;

  const partsSection = lessonCard.parentElement?.querySelector('.lesson-parts-section');
  if (!partsSection) return;

  await loadPartsForSelectedLesson(lesson, partsSection);
}

async function handleDeletePart(partId) {
  const result = await deleteLessonPart(partId);

  if (result.success) {
    showToast('파트가 삭제되었습니다.', 'success');
    await loadPartsForSelectedLesson({ id: selectedLessonForParts });
  } else {
    showToast(`파트 삭제 실패: ${result.error}`, 'error');
  }
}

function showLessonModal(lesson = null) {
  const modal = document.getElementById('modal-lesson-form');
  if (!modal) return;

  const titleEl = document.getElementById('modal-lesson-title');
  const form = document.getElementById('form-lesson');

  if (lesson) {
    // 차시 편집
    titleEl.textContent = '차시 편집';
    document.getElementById('input-lesson-number').value = lesson.lessonNumber;
    document.getElementById('input-lesson-title').value = lesson.title;
    document.getElementById('input-lesson-goal').value = lesson.goal;
    document.getElementById('input-lesson-letters').value = lesson.learnLetters;
    form.dataset.lessonId = lesson.id;
  } else {
    // 차시 추가
    titleEl.textContent = '새 차시 만들기';
    form.reset();
    delete form.dataset.lessonId;
  }

  // 스크롤을 맨 위로 올린 후 모달 표시
  window.scrollTo(0, 0);
  modal.classList.remove('hidden');
}

function closeLessonModal() {
  const modal = document.getElementById('modal-lesson-form');
  modal?.classList.add('hidden');
}

function showPartDetailModal(part) {
  const modalHTML = renderPartDetailModal(part);

  // 차시 상세 모달 숨기기 (제거하지 않음)
  const lessonModal = document.getElementById('modal-lesson-detail');
  if (lessonModal) {
    lessonModal.classList.add('hidden');
  }

  // 기존 파트 모달 제거
  let modal = document.getElementById('modal-part-detail');
  if (modal) {
    modal.remove();
  }

  // body에 직접 추가 (전체 화면 확보)
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  modal = document.getElementById('modal-part-detail');
  modal?.classList.remove('hidden');

  // 닫기 버튼 이벤트
  document.getElementById('btn-close-part-detail-modal')?.addEventListener('click', () => {
    closePartDetailModal(lessonModal);
  });

  // 배경(검은색) 클릭 시 닫기
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePartDetailModal(lessonModal);
    }
  });

  // YouTube IFrame Player API 초기화
  setTimeout(() => {
    initYouTubePlayer();
  }, 100);

  // 전체화면 버튼 이벤트
  setTimeout(() => {
    setupFullscreenButton();
  }, 200);
}

function initYouTubePlayer() {
  const playerDiv = document.getElementById('ytPlayer');
  const playerWrap = document.getElementById('playerWrap');

  if (!playerDiv || !playerWrap) {
    console.error('Player elements not found');
    return;
  }

  const videoId = playerWrap.getAttribute('data-video-id');
  const isShorts = playerWrap.getAttribute('data-is-shorts') === 'true';

  if (!videoId) {
    console.error('Video ID not found');
    return;
  }

  console.log('Initializing YouTube player with videoId:', videoId);

  // YouTube API 스크립트 로드
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }

  // API 준비 대기
  const checkAPI = setInterval(() => {
    if (window.YT && window.YT.Player) {
      clearInterval(checkAPI);
      createYouTubePlayer(playerDiv, videoId, isShorts);
    }
  }, 100);

  // 타임아웃 (5초)
  setTimeout(() => clearInterval(checkAPI), 5000);
}

function createYouTubePlayer(playerDiv, videoId, isShorts) {
  console.log('Creating YouTube player:', { videoId, isShorts });

  // 자막 끄기 함수
  function disableCaptions() {
    try { window.ytPlayer.unloadModule('captions'); } catch (e) {}
    try { window.ytPlayer.unloadModule('cc'); } catch (e) {}
    try { window.ytPlayer.setOption('captions', 'track', {}); } catch (e) {}
  }

  window.ytPlayer = new YT.Player(playerDiv, {
    videoId: videoId,
    width: '100%',
    height: '100%',
    playerVars: {
      playsinline: 1,
      rel: 0,
      cc_load_policy: 0,
      iv_load_policy: 3,
      fs: 1,
      origin: window.location.origin,
      autoplay: 0,
    },
    events: {
      onReady: (e) => {
        console.log('Player ready');
        disableCaptions();
      },
      onStateChange: (e) => {
        // PLAYING 상태에서 자막 재확인 (나중에 로드되는 경우 대비)
        if (e.data === YT.PlayerState.PLAYING) {
          disableCaptions();
        }
        // ENDED 상태에서 반복 재생
        if (e.data === YT.PlayerState.ENDED) {
          e.target.seekTo(0);
          e.target.playVideo();
        }
      },
    },
  });
}

function setupFullscreenButton() {
  const fsBtn = document.getElementById('fsBtn');
  const playerWrap = document.getElementById('playerWrap');

  if (!fsBtn || !playerWrap) return;

  fsBtn.addEventListener('click', async (e) => {
    e.stopPropagation();

    // 이미 전체화면이거나 CSS 대체 모드면 해제
    if (document.fullscreenElement || playerWrap.classList.contains('pseudo-fs')) {
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      } catch (err) {
        console.warn('Fullscreen exit failed:', err);
      }
      playerWrap.classList.remove('pseudo-fs');
      document.body.classList.remove('focus-shorts');
      return;
    }

    // 진짜 전체화면 시도 (webkit 접두사 포함)
    try {
      const requestFullscreenMethod =
        playerWrap.requestFullscreen ||
        playerWrap.webkitRequestFullscreen ||
        playerWrap.mozRequestFullScreen ||
        playerWrap.msRequestFullscreen;

      if (requestFullscreenMethod) {
        await requestFullscreenMethod.call(playerWrap);
        return;
      }
    } catch (err) {
      console.warn('Fullscreen API not supported or denied:', err);
    }

    // 지원 안 되면 CSS 대체 모드 (iOS Safari 등)
    playerWrap.classList.add('pseudo-fs');
    document.body.classList.add('focus-shorts');
  });

  // fullscreen 변화 감시 (상단·하단 메뉴 상태 동기화)
  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      playerWrap.classList.remove('pseudo-fs');
      document.body.classList.remove('focus-shorts');
    }
  };

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('msfullscreenchange', handleFullscreenChange);

  // 모바일 자동 전체화면 (가로 방향)
  const handleOrientationChange = async () => {
    const isLandscape = window.innerWidth > window.innerHeight;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile && isLandscape) {
      // 가로 방향이고 전체화면이 아니면 진입
      if (!document.fullscreenElement && !playerWrap.classList.contains('pseudo-fs')) {
        try {
          const requestFullscreenMethod =
            playerWrap.requestFullscreen ||
            playerWrap.webkitRequestFullscreen ||
            playerWrap.mozRequestFullScreen ||
            playerWrap.msRequestFullscreen;

          if (requestFullscreenMethod) {
            await requestFullscreenMethod.call(playerWrap);
            return;
          }
        } catch (err) {
          console.warn('Fullscreen API not supported:', err);
        }

        // 실패하면 CSS 대체 모드
        playerWrap.classList.add('pseudo-fs');
        document.body.classList.add('focus-shorts');
      }
    } else if (!isLandscape) {
      // 세로 방향이면 전체화면 해제
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      } catch (err) {
        console.warn('Fullscreen exit failed:', err);
      }
      playerWrap.classList.remove('pseudo-fs');
      document.body.classList.remove('focus-shorts');
    }
  };

  // 화면 회전 감시
  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('resize', handleOrientationChange);
}

function closePartDetailModal(lessonModal) {
  const modal = document.getElementById('modal-part-detail');
  if (modal) {
    modal.classList.add('hidden');
    setTimeout(() => modal.remove(), 300);
  }

  // 차시 상세 모달 다시 표시
  if (lessonModal) {
    lessonModal.classList.remove('hidden');
  }
}

async function handleLessonSubmit(e) {
  e.preventDefault();

  const lessonNumber = parseInt(document.getElementById('input-lesson-number').value);
  const title = document.getElementById('input-lesson-title').value;
  const goal = document.getElementById('input-lesson-goal').value;
  const learnLetters = document.getElementById('input-lesson-letters').value;

  if (!selectedCourseForLessons) {
    showToast('강의가 선택되지 않았습니다.', 'error');
    return;
  }

  const form = document.getElementById('form-lesson');
  const lessonId = form.dataset.lessonId;

  if (lessonId) {
    // 차시 수정
    const result = await updateTeachingLesson(lessonId, {
      lessonNumber,
      title,
      goal,
      learnLetters
    });

    if (result.success) {
      showToast('차시가 수정되었습니다.', 'success');
      closeLessonModal();
      await loadLessonsForSelectedCourse();
    } else {
      showToast(`차시 수정 실패: ${result.error}`, 'error');
    }
  } else {
    // 차시 생성
    const result = await createTeachingLesson({
      courseId: selectedCourseForLessons,
      lessonNumber,
      title,
      goal,
      learnLetters
    });

    if (result.success) {
      showToast('차시가 추가되었습니다.', 'success');
      closeLessonModal();
      await loadLessonsForSelectedCourse();
    } else {
      showToast(`차시 추가 실패: ${result.error}`, 'error');
    }
  }
}

function switchContentTab(tab) {
  // 탭 버튼 스타일 업데이트
  document.querySelectorAll('.content-tab').forEach(btn => {
    if (btn.dataset.tab === tab) {
      btn.classList.add('border-secondary', 'text-secondary');
      btn.classList.remove('border-transparent', 'text-on-surface-variant');
    } else {
      btn.classList.remove('border-secondary', 'text-secondary');
      btn.classList.add('border-transparent', 'text-on-surface-variant');
    }
  });

  // 탭 콘텐츠 표시/숨김
  document.querySelectorAll('.content-tab-panel').forEach(panel => {
    panel.classList.add('hidden');
  });

  if (tab === 'courses') {
    document.getElementById('courses-tab')?.classList.remove('hidden');
  } else if (tab === 'lessons') {
    document.getElementById('lessons-tab')?.classList.remove('hidden');
  }
}

async function loadTeachingCourses() {
  try {
    allTeachingCourses = await getAllTeachingCourses();
    renderCoursesList(allTeachingCourses);
  } catch (error) {
    console.error('❌ 강의 목록 로드 실패:', error);
    showToast('강의 목록을 불러올 수 없습니다.', 'error');
  }
}

function renderCoursesList(courses) {
  const container = document.getElementById('courses-list');
  if (!container) return;

  if (courses.length === 0) {
    container.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-20 gap-3">
        <span class="material-symbols-outlined text-[48px] text-on-surface-variant">library_books</span>
        <p class="font-headline-md text-headline-md text-on-surface font-bold">강의가 없습니다</p>
        <p class="font-body-md text-on-surface-variant">새 강의 버튼을 클릭해서 강의를 추가하세요</p>
      </div>
    `;
    return;
  }

  container.innerHTML = courses.map(course => `
    <div class="bg-surface-container-lowest rounded-2xl border border-surface-container p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1">
          <h3 class="font-headline-md text-headline-md text-on-surface font-bold line-clamp-2">${course.title}</h3>
          <p class="font-label-sm text-label-sm text-on-surface-variant mt-1">${course.level || '미정'} • ${course.totalLessons || 0}차시</p>
        </div>
        <span class="px-2 py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-bold">
          ${course.instructor || '미정'}
        </span>
      </div>

      <p class="font-body-sm text-body-sm text-on-surface-variant whitespace-pre-line break-words">${course.description}</p>

      <div class="flex gap-2 mt-2">
        <button class="flex-1 h-10 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold cursor-pointer hover:bg-primary/90 transition-colors btn-edit-course" data-course-id="${course.id}">
          편집
        </button>
        <button class="flex-1 h-10 rounded-xl bg-error/10 text-error font-label-md text-label-md font-bold cursor-pointer hover:bg-error/20 transition-colors btn-delete-course" data-course-id="${course.id}">
          삭제
        </button>
      </div>
    </div>
  `).join('');

  // 편집/삭제 버튼 이벤트
  container.querySelectorAll('.btn-edit-course').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseId = btn.dataset.courseId;
      const course = allTeachingCourses.find(c => c.id === courseId);
      showCourseModal(course);
    });
  });

  container.querySelectorAll('.btn-delete-course').forEach(btn => {
    btn.addEventListener('click', async () => {
      const courseId = btn.dataset.courseId;
      if (confirm('이 강의를 삭제하시겠습니까? (관련 차시도 함께 삭제됩니다)')) {
        await handleDeleteCourse(courseId);
      }
    });
  });
}

function showCourseModal(course = null) {
  const modal = document.getElementById('modal-course-form');
  if (!modal) return;

  const titleEl = document.getElementById('modal-course-title');
  const form = document.getElementById('form-course');

  if (course) {
    titleEl.textContent = '강의 편집';
    document.getElementById('input-course-title').value = course.title;
    document.getElementById('input-course-description').value = course.description;
    document.getElementById('input-course-level').value = course.level;
    document.getElementById('input-course-lessons').value = course.totalLessons;
    document.getElementById('input-course-instructor').value = course.instructor || '';
    form.dataset.courseId = course.id;
  } else {
    titleEl.textContent = '새 강의 만들기';
    form.reset();
    delete form.dataset.courseId;
  }

  window.scrollTo(0, 0);
  modal.classList.remove('hidden');
}

function closeCourseModal() {
  const modal = document.getElementById('modal-course-form');
  modal?.classList.add('hidden');
}

async function handleCourseSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('input-course-title').value.trim();
  const description = document.getElementById('input-course-description').value.trim();
  const level = document.getElementById('input-course-level').value;
  const totalLessons = parseInt(document.getElementById('input-course-lessons').value);
  const instructor = document.getElementById('input-course-instructor').value.trim();

  if (!title || !description || !level || !totalLessons) {
    showToast('필수 항목을 모두 입력해주세요.', 'error');
    return;
  }

  const courseData = { title, description, level, totalLessons, instructor };
  const courseId = e.target.dataset.courseId;

  let result;
  if (courseId) {
    result = await updateTeachingCourse(courseId, courseData);
  } else {
    result = await createTeachingCourse(courseData);
  }

  if (result.success) {
    showToast(courseId ? '강의가 수정되었습니다.' : '강의가 생성되었습니다.', 'secondary');
    closeCourseModal();
    await loadTeachingCourses();
  } else {
    showToast('오류: ' + (result.error || '작업 실패'), 'error');
  }
}

async function handleDeleteCourse(courseId) {
  const result = await deleteTeachingCourse(courseId);
  if (result.success) {
    showToast('강의가 삭제되었습니다.', 'secondary');
    await loadTeachingCourses();
  } else {
    showToast('오류: ' + (result.error || '삭제 실패'), 'error');
  }
}

async function switchAdminSubTab(subTab) {
  currentAdminSubTab = subTab;
  const subContent = document.getElementById('admin-sub-content');
  if (!subContent) return;

  // 서브탭 버튼 스타일 업데이트
  document.querySelectorAll('.admin-sub-tab').forEach(btn => {
    if (btn.dataset.subTab === subTab) {
      btn.classList.add('border-secondary', 'text-secondary');
      btn.classList.remove('border-transparent', 'text-on-surface-variant');
    } else {
      btn.classList.remove('border-secondary', 'text-secondary');
      btn.classList.add('border-transparent', 'text-on-surface-variant');
    }
  });

  // 콘텐츠 변경
  switch (subTab) {
    case 'dashboard':
      initDashboardView();
      break;
    case 'users':
      await initUserManagementView();
      break;
    case 'content':
      subContent.innerHTML = renderContentManagementView();
      await initContentManagementView();
      break;
    case 'analytics':
      subContent.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 gap-3">
          <span class="material-symbols-outlined text-[48px] text-on-surface-variant">analytics</span>
          <p class="font-headline-md text-headline-md text-on-surface font-bold">분석</p>
          <p class="font-body-md text-on-surface-variant">준비 중입니다.</p>
        </div>
      `;
      break;
  }
}

function initDashboardView() {
  // 대시보드 원래 콘텐츠 표시
  const subContent = document.getElementById('admin-sub-content');
  const dashboardContent = document.getElementById('dashboard-content');
  if (dashboardContent) {
    subContent.innerHTML = dashboardContent.outerHTML;
  }

  // 대시보드 이벤트 등록
  document.getElementById('btn-approve-visa')?.addEventListener('click', () => {
    showToast('✅ 비자 행정 승인 완료', 'secondary');
  });

  // Filter tabs
  document.querySelectorAll('.admin-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-filter-btn').forEach(b => {
        b.classList.remove('bg-secondary', 'text-on-secondary');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.add('bg-secondary', 'text-on-secondary');
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
    });
  });
}

async function initUserManagementView() {
  const subContent = document.getElementById('admin-sub-content');
  subContent.innerHTML = renderUserManagementView();

  // 사용자 목록 로드
  await loadUsers();

  // 필터 탭 숫자 업데이트
  const adminCount = allUsers.filter(u => u.role === 'admin').length;
  const userCount = allUsers.filter(u => u.role !== 'admin').length;
  const totalCount = allUsers.length;

  document.querySelectorAll('.user-filter-btn').forEach(btn => {
    const filter = btn.dataset.filter;
    if (filter === 'all') {
      btn.textContent = `전체 (${totalCount})`;
    } else if (filter === 'admin') {
      btn.textContent = `관리자 (${adminCount})`;
    } else if (filter === 'user') {
      btn.textContent = `일반 사용자 (${userCount})`;
    }
  });

  console.log(`📊 필터 탭 업데이트: 전체=${totalCount}, 관리자=${adminCount}, 일반사용자=${userCount}`);

  // 사용자 초대 버튼
  const inviteBtn = document.getElementById('btn-invite-user');
  inviteBtn?.addEventListener('click', async () => {
    try {
      inviteBtn.disabled = true;
      inviteBtn.style.opacity = '0.6';

      // 초대 코드 생성
      const invitation = await createInvitation();

      // 메시지를 클립보드에 복사
      const copied = await copyToClipboard(invitation.message);

      if (copied) {
        showToast('✅ 초대 링크가 클립보드에 복사되었습니다!', 'secondary');
        console.log('📋 복사된 메시지:', invitation.message);
      } else {
        showToast('⚠️ 클립보드 복사에 실패했습니다. 초대 링크를 수동으로 복사해주세요.', 'warning');
        showInvitationModal(invitation);
      }
    } catch (error) {
      console.error('❌ 초대 코드 생성 오류:', error);
      showToast('초대 코드 생성에 실패했습니다.', 'error');
    } finally {
      inviteBtn.disabled = false;
      inviteBtn.style.opacity = '1';
    }
  });

  // 검색 기능
  const searchInput = document.getElementById('user-search-input');
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filterUsers(query, currentAdminSubTab === 'users' ? 'all' : currentAdminSubTab);
  });

  // 필터 탭
  const filterBtns = document.querySelectorAll('.user-filter-btn');
  console.log(`🔘 필터 탭 ${filterBtns.length}개 찾음`);
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      console.log(`📊 필터 클릭: ${filter}`);
      document.querySelectorAll('.user-filter-btn').forEach(b => {
        b.classList.remove('bg-secondary', 'text-on-secondary');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.add('bg-secondary', 'text-on-secondary');
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
      console.log(`📋 filterUsers 호출: 검색='', 필터='${filter}', allUsers=${allUsers.length}명`);
      filterUsers('', filter);
    });
  });
}

async function loadUsers() {
  try {
    console.log('🔍 loadUsers 시작. db:', db ? '있음' : '없음');

    if (!db) {
      console.warn('⚠️ Firestore 데이터베이스를 사용할 수 없습니다');
      allUsers = [];
      renderUsersList([]);
      showToast('데이터베이스를 사용할 수 없어 데모 모드로 실행 중입니다.', 'secondary');
      return;
    }

    console.log('👥 사용자 목록 로드 시작... auth:', auth ? '있음' : '없음');
    const q = query(collection(db, 'users'));
    console.log('📝 쿼리 객체 생성 완료, getDocs 호출 시작...');

    const snapshot = await getDocs(q);
    console.log(`✅ Firestore에서 ${snapshot.size}명의 사용자를 가져왔습니다`);
    showToast(`✅ 사용자 ${snapshot.size}명 로드 완료`, 'secondary');

    allUsers = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`📌 사용자 로드: ${data.email} (${data.role})`);
      return {
        ...data,
        uid: doc.id,
        createdAt: data.createdAt || new Date()
      };
    });

    console.log(`📊 총 ${allUsers.length}명 처리 완료`);

    // createdAt으로 내림차순 정렬 (클라이언트 측)
    allUsers.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    });

    console.log(`🎨 renderUsersList 호출: ${allUsers.length}명`);
    renderUsersList(allUsers);
  } catch (error) {
    console.error('❌ 사용자 목록 로드 오류:', error);
    console.error('에러 상세:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    allUsers = [];
    renderUsersList([]);
    showToast(`❌ 오류: ${error.message}`, 'error');
  }
}

function filterUsers(searchQuery, roleFilter = 'all') {
  let filtered = allUsers;

  // 검색 필터
  if (searchQuery) {
    filtered = filtered.filter(user =>
      (user.name?.toLowerCase().includes(searchQuery)) ||
      (user.email?.toLowerCase().includes(searchQuery))
    );
  }

  // 역할 필터
  if (roleFilter === 'admin') {
    filtered = filtered.filter(user => user.role === 'admin');
  } else if (roleFilter === 'user') {
    filtered = filtered.filter(user => user.role !== 'admin');
  }

  renderUsersList(filtered);
}

function renderUsersList(users) {
  try {
    const container = document.getElementById('users-list-container');
    const emptyState = document.getElementById('users-empty-state');

    console.log(`📍 renderUsersList 호출: ${users.length}명의 사용자`);
    console.log('🔍 DOM 요소 확인:', {
      containerFound: !!container,
      containerHTML: container ? container.innerHTML.substring(0, 100) : 'N/A',
      emptyStateFound: !!emptyState
    });

    if (!container) {
      console.error('❌ users-list-container를 찾을 수 없습니다!');
      showToast('❌ 사용자 목록 컨테이너를 찾을 수 없습니다.', 'error');
      return;
    }

    if (users.length === 0) {
      console.log('📭 사용자 없음 상태 표시');
      container.classList.add('hidden');
      emptyState?.classList.remove('hidden');
      showToast('⚠️ 사용자가 없습니다.', 'secondary');
      return;
    }

    console.log(`✅ ${users.length}명의 사용자 렌더링 시작`);
    container.classList.remove('hidden');
    emptyState?.classList.add('hidden');
    console.log('🔧 hidden 클래스 제거 완료');

    const cardsHTML = users.map((user, idx) => {
      try {
        console.log(`📌 카드 생성 준비 ${idx + 1}: uid=${user.uid}, email=${user.email}, name=${user.name}`);
        const card = renderUserCard(user);
        console.log(`✅ 카드 생성 성공: ${user.email}, 길이: ${card.length}`);
        return card;
      } catch (err) {
        console.error(`❌ 사용자 카드 렌더링 실패 (${user.email}):`, err);
        console.error(`   에러 스택:`, err.stack);
        return '';
      }
    }).join('');

    console.log(`📝 HTML 생성 완료, 길이: ${cardsHTML.length}자`);
    console.log(`📝 생성된 HTML 미리보기:`, cardsHTML.substring(0, 200));

    // 컨테이너 초기화 후 업데이트
    container.innerHTML = '';
    console.log(`🗑️ 컨테이너 초기화 완료`);

    container.innerHTML = cardsHTML;
    console.log(`🎯 DOM 업데이트 완료`);
    console.log(`🔍 업데이트 후 상태:`, {
      childCount: container.children.length,
      containerClass: container.className,
      firstChild: container.children[0]?.className || 'none'
    });

    showToast(`✅ ${users.length}명의 사용자 표시 완료`, 'secondary');

    // 사용자 카드 이벤트
    const cards = container.querySelectorAll('.user-card');
    console.log(`🔗 ${cards.length}개의 사용자 카드 발견`);

    cards.forEach((card, index) => {
      const userId = card.dataset.userId;
      const user = users.find(u => u.uid === userId);
      console.log(`📌 카드 ${index + 1}: ${user?.email || 'unknown'}`);

      card.querySelector('.btn-view-user')?.addEventListener('click', () => {
        console.log('👁️ 상세 정보 버튼 클릭:', user?.email);
        showUserDetailModal(user);
      });

      card.querySelector('.btn-edit-user')?.addEventListener('click', () => {
        console.log('✏️ 편집 버튼 클릭:', user?.email);
        showUserEditModal(user);
      });
    });

    console.log(`✨ renderUsersList 완료`);
  } catch (error) {
    console.error('❌ renderUsersList 오류:', error);
    console.error('오류 상세:', {
      message: error.message,
      stack: error.stack
    });
    showToast(`❌ 렌더링 오류: ${error.message}`, 'error');
  }
}

function showUserDetailModal(user) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="absolute inset-0 bg-primary/40 backdrop-blur-sm"></div>
    <div class="relative w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-xl border border-surface-container p-6 flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="font-headline-md text-headline-md text-on-surface font-bold">사용자 정보</h2>
        <button class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-surface-container-high">
          <span class="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
        </button>
      </div>

      <div class="space-y-3">
        <div class="p-3 rounded-xl bg-surface-container-low">
          <p class="font-label-sm text-label-sm text-on-surface-variant mb-1">이름</p>
          <p class="font-body-md text-body-md text-on-surface font-bold">${user.name || '미설정'}</p>
        </div>

        <div class="p-3 rounded-xl bg-surface-container-low">
          <p class="font-label-sm text-label-sm text-on-surface-variant mb-1">이메일</p>
          <p class="font-body-md text-body-md text-on-surface font-bold break-all">${user.email}</p>
        </div>

        <div class="p-3 rounded-xl bg-surface-container-low">
          <p class="font-label-sm text-label-sm text-on-surface-variant mb-1">역할</p>
          <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${user.role === 'admin' ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface'}">
            ${user.role === 'admin' ? '👑 관리자' : '👤 일반 사용자'}
          </span>
        </div>

        <div class="p-3 rounded-xl bg-surface-container-low">
          <p class="font-label-sm text-label-sm text-on-surface-variant mb-1">가입 일자</p>
          <p class="font-body-md text-body-md text-on-surface font-bold">
            ${user.createdAt ? new Date(user.createdAt.toDate?.() || user.createdAt).toLocaleDateString('ko-KR') : '미정'}
          </p>
        </div>
      </div>

      <button class="w-full h-12 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-bold cursor-pointer hover:bg-surface-container-high transition-colors">
        닫기
      </button>
    </div>
  `;

  document.body.appendChild(modal);
  const closeBtn = modal.querySelector('button:nth-of-type(1)');
  const closeMainBtn = modal.querySelector('button:last-child');
  const overlay = modal.querySelector('div:first-child');

  const closeModal = () => modal.remove();
  closeBtn.addEventListener('click', closeModal);
  closeMainBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
}

function showUserEditModal(user) {
  showToast('사용자 편집 기능은 준비 중입니다.', 'secondary');
}

function showInvitationModal(invitation) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="absolute inset-0 bg-primary/40 backdrop-blur-sm"></div>
    <div class="relative w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-xl border border-surface-container p-6 flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="font-headline-md text-headline-md text-on-surface font-bold">사용자 초대</h2>
        <button class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-surface-container-high">
          <span class="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
        </button>
      </div>

      <div class="space-y-3">
        <div class="p-3 rounded-xl bg-surface-container-low">
          <p class="font-label-sm text-label-sm text-on-surface-variant mb-2">초대 메시지</p>
          <p class="font-body-sm text-body-sm text-on-surface font-semibold break-words">${invitation.message}</p>
        </div>

        <div class="p-3 rounded-xl bg-surface-container-low">
          <p class="font-label-sm text-label-sm text-on-surface-variant mb-2">초대 링크</p>
          <p class="font-body-xs text-body-xs text-on-surface break-all font-mono">${invitation.url}</p>
        </div>
      </div>

      <div class="flex gap-2">
        <button class="flex-1 h-12 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold cursor-pointer hover:bg-secondary/90 transition-colors" id="btn-copy-message">
          메시지 복사
        </button>
        <button class="flex-1 h-12 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold cursor-pointer hover:bg-secondary/90 transition-colors" id="btn-copy-link">
          링크 복사
        </button>
      </div>

      <button class="w-full h-12 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-bold cursor-pointer hover:bg-surface-container-high transition-colors" id="btn-close-modal">
        닫기
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('button:nth-of-type(1)');
  const copyMessageBtn = modal.querySelector('#btn-copy-message');
  const copyLinkBtn = modal.querySelector('#btn-copy-link');
  const closeMainBtn = modal.querySelector('#btn-close-modal');
  const overlay = modal.querySelector('div:first-child');

  const closeModal = () => modal.remove();

  closeBtn.addEventListener('click', closeModal);
  closeMainBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  copyMessageBtn.addEventListener('click', async () => {
    const copied = await copyToClipboard(invitation.message);
    if (copied) {
      showToast('✅ 메시지가 복사되었습니다!', 'secondary');
      copyMessageBtn.textContent = '✓ 복사됨';
      setTimeout(() => {
        copyMessageBtn.textContent = '메시지 복사';
      }, 2000);
    } else {
      showToast('복사에 실패했습니다.', 'error');
    }
  });

  copyLinkBtn.addEventListener('click', async () => {
    const copied = await copyToClipboard(invitation.url);
    if (copied) {
      showToast('✅ 링크가 복사되었습니다!', 'secondary');
      copyLinkBtn.textContent = '✓ 복사됨';
      setTimeout(() => {
        copyLinkBtn.textContent = '링크 복사';
      }, 2000);
    } else {
      showToast('복사에 실패했습니다.', 'error');
    }
  });
}

// ── Level Test Modal ───────────────────────────────────────────────────────────
function openLevelTestModal() {
  levelTestAnswers = [];
  levelTestStep = 0;
  const modal = document.getElementById('modal-level-test');
  modal.classList.remove('hidden');
  renderLevelTestStep();

  document.getElementById('btn-close-level-test')?.addEventListener('click', closeLevelTestModal);
  document.getElementById('modal-level-test-overlay')?.addEventListener('click', closeLevelTestModal);
}

function closeLevelTestModal() {
  document.getElementById('modal-level-test').classList.add('hidden');
}

function renderLevelTestStep() {
  const content = document.getElementById('level-test-content');
  if (!content) return;

  if (levelTestStep >= LEVEL_TEST_QUESTIONS.length) {
    // Show result
    const score = levelTestAnswers.filter((a, i) => !LEVEL_TEST_QUESTIONS[i].isGoal && a === LEVEL_TEST_QUESTIONS[i].answer).length;
    const goal = levelTestAnswers[LEVEL_TEST_QUESTIONS.findIndex(q => q.isGoal)];
    const goalLabels = ['TOPIK / 대학 진학', '비즈니스 한국어', '생활 회화', '기초 한글'];
    const recommended = SEED_COURSES[Math.min(score, SEED_COURSES.length - 1)];
    content.innerHTML = `
      <div class="flex flex-col items-center gap-4 py-4">
        <div class="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
          <span class="material-symbols-outlined text-[32px] text-secondary">workspace_premium</span>
        </div>
        <div class="text-center">
          <h3 class="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">레벨 진단 완료!</h3>
          <p class="font-body-md text-on-surface-variant mt-1">목표: ${goalLabels[goal] ?? '미정'}</p>
        </div>
        <div class="w-full p-4 rounded-xl bg-secondary/5 border border-secondary/20">
          <p class="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider mb-2">🎯 AI 추천 강좌</p>
          <p class="font-headline-md text-headline-md text-on-surface font-bold">${recommended?.title}</p>
          <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">${recommended?.subtitle}</p>
        </div>
        <div class="flex flex-col gap-2 w-full">
          <button id="btn-test-consult" class="w-full h-12 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-secondary/90 active:scale-[0.98] transition-all shadow-md">
            <span class="material-symbols-outlined text-[18px]">support_agent</span>
            무료 1:1 상담으로 확정하기
          </button>
          <button id="btn-test-close" class="w-full h-10 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md cursor-pointer hover:bg-surface-container-high">
            닫기
          </button>
        </div>
      </div>`;
    document.getElementById('btn-test-consult')?.addEventListener('click', () => {
      closeLevelTestModal();
      openConsultationModal();
    });
    document.getElementById('btn-test-close')?.addEventListener('click', closeLevelTestModal);
    return;
  }

  const q = LEVEL_TEST_QUESTIONS[levelTestStep];
  const progress = Math.round((levelTestStep / LEVEL_TEST_QUESTIONS.length) * 100);

  content.innerHTML = `
    <!-- Progress -->
    <div class="flex flex-col gap-1.5">
      <div class="flex justify-between items-center">
        <span class="font-label-sm text-label-sm text-on-surface-variant">${levelTestStep + 1} / ${LEVEL_TEST_QUESTIONS.length}</span>
        <span class="font-label-sm text-label-sm text-secondary font-bold">${progress}%</span>
      </div>
      <div class="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
        <div class="h-full rounded-full bg-secondary transition-all duration-500" style="width: ${progress}%"></div>
      </div>
    </div>

    <!-- Question -->
    <div class="p-4 rounded-xl bg-surface-container-low">
      <p class="font-body-md text-on-surface leading-relaxed whitespace-pre-line">${q.question}</p>
    </div>

    <!-- Options -->
    <div class="flex flex-col gap-2">
      ${q.options.map((opt, idx) => `
        <button class="level-test-option w-full min-h-[48px] px-4 py-3 rounded-xl border border-surface-container-high bg-surface-container-lowest text-left font-body-md text-on-surface hover:bg-secondary/5 hover:border-secondary/30 transition-all cursor-pointer active:scale-[0.98]" data-idx="${idx}">
          ${opt}
        </button>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('.level-test-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      levelTestAnswers[levelTestStep] = idx;

      // Highlight
      content.querySelectorAll('.level-test-option').forEach(b => {
        b.classList.remove('bg-secondary', 'text-on-secondary', 'border-secondary');
        b.disabled = true;
      });
      btn.classList.add('bg-secondary', 'text-on-secondary', 'border-secondary');

      setTimeout(() => {
        levelTestStep++;
        renderLevelTestStep();
      }, 400);
    });
  });
}

// ── Consultation Modal ─────────────────────────────────────────────────────────
function openConsultationModal() {
  const modal = document.getElementById('modal-consultation');
  modal.classList.remove('hidden');
  document.getElementById('btn-close-consultation')?.addEventListener('click', closeConsultationModal);
  document.getElementById('modal-consultation-overlay')?.addEventListener('click', closeConsultationModal);
  document.getElementById('btn-submit-consultation')?.addEventListener('click', handleConsultationSubmit);
}

function closeConsultationModal() {
  document.getElementById('modal-consultation').classList.add('hidden');
}

async function handleConsultationSubmit() {
  const name = document.getElementById('consultation-name')?.value.trim();
  const email = document.getElementById('consultation-email')?.value.trim();
  const goal = document.getElementById('consultation-goal')?.value;

  if (!name || !email) {
    showToast('성함과 이메일을 입력해 주세요.', 'error');
    return;
  }

  const btn = document.getElementById('btn-submit-consultation');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span><span>처리 중...</span>`;
  }

  const result = await submitConsultation({ name, email, goal });

  closeConsultationModal();
  showToast(`✅ ${result.message}`, 'secondary');
}

// ── Toast ──────────────────────────────────────────────────────────────────────
function showToast(message, type = 'secondary') {
  const existing = document.getElementById('app-toast');
  if (existing) existing.remove();

  const colorMap = {
    secondary: 'bg-primary text-on-primary',
    error: 'bg-error text-on-error',
    success: 'bg-secondary text-on-secondary',
  };

  const toast = document.createElement('div');
  toast.id = 'app-toast';
  toast.className = `fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-2xl shadow-xl font-label-md text-label-md font-semibold ${colorMap[type] || colorMap.secondary} flex items-center gap-2 transition-all duration-300 opacity-0 -translate-y-2`;
  toast.innerHTML = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.replace('opacity-0', 'opacity-100');
    toast.classList.replace('-translate-y-2', 'translate-y-0');
  });

  setTimeout(() => {
    toast.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── User Profile Menu ──────────────────────────────────────────────────────────
function initProfileButton() {
  const profileBtn = document.getElementById('profile-btn');
  if (!profileBtn) return;

  // 프로필 버튼 클릭 이벤트 - 한 번만 등록
  profileBtn.addEventListener('click', () => {
    if (currentUser) {
      showUserMenu();
    } else {
      navigateTo('login');
    }
  });
}

function updateProfileButtonUI() {
  const profileBtn = document.getElementById('profile-btn');
  if (!profileBtn) return;

  if (currentUser) {
    // 로그인된 경우 - 이니셜 표시
    const initials = (currentUser.name || 'User')
      .split(' ')
      .map(word => word[0].toUpperCase())
      .join('')
      .slice(0, 2);

    profileBtn.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-[0_1px_4px_rgba(15,23,42,0.12)]">
        <span class="text-xs font-bold text-on-primary">${initials}</span>
      </div>
    `;
  } else {
    // 로그인 안 된 경우 - 기본 person 아이콘
    profileBtn.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shadow-[0_1px_4px_rgba(15,23,42,0.12)]">
        <span class="material-symbols-outlined text-[18px] text-on-primary-container">person</span>
      </div>
    `;
  }
}

function showUserMenu() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[200] flex items-start justify-end';
  modal.id = 'user-menu-modal';
  modal.innerHTML = `
    <div class="absolute inset-0" id="menu-overlay"></div>
    <div class="relative w-72 mt-20 mr-4 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container flex flex-col gap-3 p-4">
      <!-- 사용자 정보 -->
      <div class="flex items-center gap-3 pb-3 border-b border-surface-container">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
          <span class="text-sm font-bold text-on-primary">
            ${(currentUser?.name || 'User')
              .split(' ')
              .map(word => word[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-label-md text-label-md text-on-surface font-bold truncate">${currentUser?.name || '사용자'}</p>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${currentUser?.email}</p>
          <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-on-secondary">
            ${currentUser?.role === 'admin' ? '관리자' : '일반 사용자'}
          </span>
        </div>
      </div>

      <!-- 메뉴 버튼들 -->
      <button id="btn-edit-profile" class="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-bold flex items-center gap-2 hover:bg-surface-container-high transition-colors cursor-pointer">
        <span class="material-symbols-outlined text-[18px]">person</span>
        <span>프로필 정보</span>
      </button>

      <button id="btn-logout" class="w-full px-4 py-2.5 rounded-xl bg-error/10 text-error font-label-md text-label-md font-bold flex items-center gap-2 hover:bg-error/20 transition-colors cursor-pointer">
        <span class="material-symbols-outlined text-[18px]">logout</span>
        <span>로그아웃</span>
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  // 오버레이 클릭 → 메뉴 닫기
  const overlay = document.getElementById('menu-overlay');
  overlay.addEventListener('click', () => {
    modal.remove();
  });

  // 프로필 정보 버튼
  const editBtn = document.getElementById('btn-edit-profile');
  editBtn.addEventListener('click', () => {
    modal.remove();
    showProfileModal();
  });

  // 로그아웃 버튼
  const logoutBtn = document.getElementById('btn-logout');
  logoutBtn.addEventListener('click', async () => {
    modal.remove();
    await handleLogout();
  });
}

function showProfileModal() {
  // 로그인하지 않은 경우 프로필 모달을 열지 않음
  if (!currentUser) {
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4';
  modal.id = 'profile-modal';
  modal.innerHTML = `
    <div class="absolute inset-0 bg-primary/40 backdrop-blur-sm" id="profile-overlay"></div>
    <div class="relative w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-xl border border-surface-container p-6 flex flex-col gap-4">
      <!-- 헤더 -->
      <div class="flex items-center justify-between">
        <h2 class="font-headline-md text-headline-md text-on-surface font-bold">프로필 정보</h2>
        <button id="btn-close-profile-x" class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-surface-container-high">
          <span class="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
        </button>
      </div>

      <!-- 사용자 정보 표시 -->
      <div class="space-y-4">
        <!-- 아바타 -->
        <div class="flex justify-center">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <span class="text-2xl font-bold text-on-primary">
              ${(currentUser?.name || 'User')
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
        </div>

        <!-- 정보 -->
        <div class="space-y-3">
          <div class="p-3 rounded-xl bg-surface-container-low">
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-1">이름</p>
            <p class="font-body-md text-body-md text-on-surface font-bold">${currentUser?.name || '미설정'}</p>
          </div>

          <div class="p-3 rounded-xl bg-surface-container-low">
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-1">이메일</p>
            <p class="font-body-md text-body-md text-on-surface font-bold break-all">${currentUser?.email}</p>
          </div>

          <div class="p-3 rounded-xl bg-surface-container-low">
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-1">역할</p>
            <div class="flex items-center gap-2">
              <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-secondary text-on-secondary">
                ${currentUser?.role === 'admin' ? '👑 관리자' : '👤 일반 사용자'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 닫기 버튼 -->
      <button id="btn-close-profile-bottom" class="w-full h-12 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-bold cursor-pointer hover:bg-surface-container-high transition-colors">
        닫기
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  // 닫기 이벤트
  const closeModal = () => modal.remove();

  // 모든 닫기 방법에 이벤트 리스너 등록
  document.getElementById('profile-overlay').addEventListener('click', closeModal);
  document.getElementById('btn-close-profile-x').addEventListener('click', closeModal);
  document.getElementById('btn-close-profile-bottom').addEventListener('click', closeModal);
}

async function handleLogout() {
  const result = await logout();
  if (result.success) {
    currentUser = null;

    // 하단 네비게이션 숨김
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
      bottomNav.classList.add('hidden');
    }

    showToast('로그아웃되었습니다.', 'secondary');
    await navigateTo('login');
  }
}

// ── Language Selector ─────────────────────────────────────────────────────────
function initLanguageSelector() {
  const langBtn = document.getElementById('btn-lang');
  if (!langBtn) return;

  // 언어 버튼 클릭
  langBtn.addEventListener('click', () => {
    showLanguageMenu();
  });

  // 초기 언어 표시 업데이트
  updateLanguageButtonUI();
}

function updateLanguageButtonUI() {
  const langBtn = document.getElementById('btn-lang');
  if (!langBtn) return;

  const currentLang = getLanguage();
  const languages = getAvailableLanguages();
  const currentLangName = languages.find(l => l.code === currentLang)?.name || '한국어';

  const langLabel = langBtn.querySelector('span:nth-of-type(2)');
  if (langLabel) {
    langLabel.textContent = currentLangName;
  }
}

function showLanguageMenu() {
  const existing = document.getElementById('language-menu-modal');
  if (existing) existing.remove();

  const languages = getAvailableLanguages();
  const currentLang = getLanguage();

  const modal = document.createElement('div');
  modal.id = 'language-menu-modal';
  modal.className = 'fixed inset-0 z-[200] flex items-start justify-end';
  modal.innerHTML = `
    <div class="absolute inset-0" id="lang-menu-overlay"></div>
    <div class="relative w-48 mt-20 mr-4 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container flex flex-col gap-2 p-3">
      ${languages.map(lang => `
        <button class="language-option w-full px-4 py-2.5 rounded-xl text-left font-body-md transition-colors cursor-pointer ${
          lang.code === currentLang
            ? 'bg-secondary text-on-secondary'
            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
        }" data-lang="${lang.code}">
          ${lang.name}
        </button>
      `).join('')}
    </div>
  `;

  document.body.appendChild(modal);

  // 오버레이 클릭 → 메뉴 닫기
  document.getElementById('lang-menu-overlay').addEventListener('click', () => {
    modal.remove();
  });

  // 언어 선택
  modal.querySelectorAll('.language-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
      updateLanguageButtonUI();
      modal.remove();

      // 현재 화면 재렌더링
      updateNavLabels();
      navigateTo(currentView === undefined ? 'login' : currentView);

      const langChangedMsg = getLanguage() === 'ko'
        ? `언어가 ${btn.textContent.trim()}로 변경되었습니다.`
        : `Language changed to ${btn.textContent.trim()}.`;
      showToast(langChangedMsg, 'secondary');
    });
  });
}

// ── Boot ───────────────────────────────────────────────────────────────────────
async function initApp() {
  // 언어 선택 버튼 초기화
  initLanguageSelector();

  // 프로필 버튼 클릭 이벤트 초기화 (한 번만)
  initProfileButton();

  // 초기에 하단 네비게이션 숨김 (로그인 전)
  const bottomNav = document.getElementById('bottom-nav');
  if (bottomNav) {
    bottomNav.classList.add('hidden');
  }

  // 초기에 알림과 프로필 버튼 숨김 (로그인 전)
  const notificationsBtn = document.getElementById('btn-notifications');
  const profileBtn = document.getElementById('profile-btn');
  if (notificationsBtn) notificationsBtn.classList.add('hidden');
  if (profileBtn) profileBtn.classList.add('hidden');

  // 초기에 admin 탭 숨김
  const adminBtn = document.getElementById('nav-admin');
  if (adminBtn) {
    adminBtn.classList.add('hidden');
  }

  // 인증 상태 감지 (처음 호출될 때까지 기다리기)
  await new Promise((resolve) => {
    let isFirstCall = true;
    onAuthChange((user) => {
      currentUser = user;
      console.log(isFirstCall ? '🔑 초기 인증 상태 확인' : '👤 인증 상태 변경', user ? `(${user.email})` : '(로그아웃)');

      if (user) {
        // 하단 네비게이션 표시
        if (bottomNav) {
          bottomNav.classList.remove('hidden');
        }
        // 알림과 프로필 버튼 표시
        if (notificationsBtn) notificationsBtn.classList.remove('hidden');
        if (profileBtn) profileBtn.classList.remove('hidden');
        // 프로필 버튼 UI 업데이트
        updateProfileButtonUI();
        // admin 탭 표시/숨김
        if (adminBtn) {
          if (user.role === 'admin') {
            adminBtn.classList.remove('hidden');
          } else {
            adminBtn.classList.add('hidden');
          }
        }
      } else {
        // 하단 네비게이션 숨김
        if (bottomNav) {
          bottomNav.classList.add('hidden');
        }
        // 알림과 프로필 버튼 숨김
        if (notificationsBtn) notificationsBtn.classList.add('hidden');
        if (profileBtn) profileBtn.classList.add('hidden');
        // 프로필 버튼 UI 업데이트
        updateProfileButtonUI();
        // 로그아웃 시 admin 탭 숨김
        if (adminBtn) {
          adminBtn.classList.add('hidden');
        }
      }

      // 첫 번째 호출만 처리 (페이지 네비게이션)
      if (isFirstCall) {
        isFirstCall = false;
        if (!user) {
          navigateTo('login');
        } else {
          const lastView = localStorage.getItem('koredu_lastView');
          navigateTo(lastView || 'landing');
        }
        resolve(); // Promise 완료
      } else {
        // 이후 호출 (로그아웃 등)에서 페이지 변경
        if (!user && currentView !== 'login') {
          navigateTo('login');
        } else if (user && currentView === 'login') {
          const lastView = localStorage.getItem('koredu_lastView');
          navigateTo(lastView || 'landing');
        }
      }
    });
  });

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.view));
  });
}

initApp();
