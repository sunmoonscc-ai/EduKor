/**
 * main.js — 한누리 한국어학당 앱 진입점 & 라우터
 */
import { renderLandingView } from './views/landingView.js';
import { renderLearnerView } from './views/learnerView.js';
import { renderEducatorView } from './views/educatorView.js';
import { renderAdminView } from './views/adminView.js';
import { renderUserManagementView, renderUserCard } from './views/userManagementView.js';
import { renderLoginView } from './views/loginView.js';
import {
  getCourses,
  getReviews,
  submitConsultation,
  submitLevelTest
} from './services/courseService.js';
import { LEVEL_TEST_QUESTIONS, SEED_COURSES } from './services/seedData.js';
import {
  loginWithGoogle,
  logout,
  onAuthChange
} from './services/authService.js';
import {
  db,
  collection,
  getDocs,
  query,
  orderBy
} from './firebase.js';

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
  if (view !== 'login') {
    updateNavActive(view);
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
  navBtns.forEach(btn => {
    const isActive = btn.dataset.view === view;
    const icon = btn.querySelector('.nav-icon');
    const label = btn.querySelector('.nav-label');
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
      showToast(`환영합니다, ${result.user.name}!`, 'secondary');
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
function initLearnerView() {
  // Nothing async needed for now — data is static
  console.log('✅ Learner view initialized');
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
      subContent.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 gap-3">
          <span class="material-symbols-outlined text-[48px] text-on-surface-variant">library_books</span>
          <p class="font-headline-md text-headline-md text-on-surface font-bold">교육 콘텐츠 관리</p>
          <p class="font-body-md text-on-surface-variant">준비 중입니다.</p>
        </div>
      `;
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
    if (!db) {
      console.warn('⚠️ Firestore 데이터베이스를 사용할 수 없습니다');
      allUsers = [];
      renderUsersList([]);
      showToast('데이터베이스를 사용할 수 없어 데모 모드로 실행 중입니다.', 'secondary');
      return;
    }

    console.log('👥 사용자 목록 로드 시작...');
    const q = query(collection(db, 'users'));
    const snapshot = await getDocs(q);
    console.log(`✅ Firestore에서 ${snapshot.size}명의 사용자를 가져왔습니다`);

    allUsers = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        uid: doc.id,
        createdAt: data.createdAt || new Date()
      };
    });

    // createdAt으로 내림차순 정렬 (클라이언트 측)
    allUsers.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    });

    renderUsersList(allUsers);
  } catch (error) {
    console.error('❌ 사용자 목록 로드 오류:', error);
    console.error('에러 상세:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    allUsers = [];
    renderUsersList([]);
    showToast('사용자 목록을 불러올 수 없습니다.', 'error');
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

    if (!container) {
      console.warn('⚠️ users-list-container를 찾을 수 없습니다');
      return;
    }

    if (users.length === 0) {
      console.log('📭 사용자 없음 상태 표시');
      container?.classList.add('hidden');
      emptyState?.classList.remove('hidden');
      return;
    }

    console.log(`✅ ${users.length}명의 사용자 렌더링`);
    container.classList.remove('hidden');
    emptyState?.classList.add('hidden');

    const cardsHTML = users.map(user => {
      try {
        return renderUserCard(user);
      } catch (err) {
        console.error(`❌ 사용자 카드 렌더링 실패 (${user.email}):`, err);
        return '';
      }
    }).join('');

    container.innerHTML = cardsHTML;
    console.log(`🎯 DOM 업데이트 완료`);

    // 사용자 카드 이벤트
    const cards = container.querySelectorAll('.user-card');
    console.log(`🔗 ${cards.length}개의 사용자 카드 이벤트 등록`);

    cards.forEach(card => {
      const userId = card.dataset.userId;
      const user = users.find(u => u.uid === userId);

      card.querySelector('.btn-view-user')?.addEventListener('click', () => {
        showUserDetailModal(user);
      });

      card.querySelector('.btn-edit-user')?.addEventListener('click', () => {
        showUserEditModal(user);
      });
    });
  } catch (error) {
    console.error('❌ renderUsersList 오류:', error);
    showToast('사용자 목록 렌더링 중 오류 발생', 'error');
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
      .map(word => word[0])
      .toUpperCase()
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
    showToast('로그아웃되었습니다.', 'secondary');
    await navigateTo('login');
  }
}

// ── Boot ───────────────────────────────────────────────────────────────────────
async function initApp() {
  // 프로필 버튼 클릭 이벤트 초기화 (한 번만)
  initProfileButton();

  // 인증 상태 감지
  onAuthChange((user) => {
    currentUser = user;
    if (user) {
      console.log('👤 로그인됨:', user.email);
      // 프로필 버튼 UI 업데이트
      updateProfileButtonUI();
      // admin 탭 표시/숨김
      const adminBtn = document.getElementById('nav-admin');
      if (adminBtn) {
        if (user.role === 'admin') {
          adminBtn.classList.remove('hidden');
        } else {
          adminBtn.classList.add('hidden');
        }
      }
    } else {
      console.log('🚪 로그아웃됨');
      // 프로필 버튼 UI 업데이트
      updateProfileButtonUI();
    }
  });

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.view));
  });

  // 로그인되지 않은 경우 로그인 페이지로 이동
  if (!currentUser) {
    await navigateTo('login');
  } else {
    await navigateTo('landing');
  }
}

initApp();
