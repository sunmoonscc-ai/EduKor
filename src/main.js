/**
 * main.js — 한누리 한국어학당 앱 진입점 & 라우터
 */
import { renderLandingView } from './views/landingView.js';
import { renderLearnerView } from './views/learnerView.js';
import { renderEducatorView } from './views/educatorView.js';
import { renderAdminView } from './views/adminView.js';
import {
  getCourses,
  getReviews,
  submitConsultation,
  submitLevelTest
} from './services/courseService.js';
import { LEVEL_TEST_QUESTIONS, SEED_COURSES } from './services/seedData.js';

// ── State ──────────────────────────────────────────────────────────────────────
let currentView = 'landing';
let currentCategory = 'all';
let levelTestAnswers = [];
let levelTestStep = 0;

// ── DOM refs ───────────────────────────────────────────────────────────────────
const viewRoot = document.getElementById('view-root');
const navBtns = document.querySelectorAll('.nav-btn');

// ── Router ─────────────────────────────────────────────────────────────────────
async function navigateTo(view) {
  currentView = view;
  updateNavActive(view);

  // Animate out
  viewRoot.style.opacity = '0';
  viewRoot.style.transform = 'translateY(6px)';

  await new Promise(r => setTimeout(r, 120));

  // Render view
  switch (view) {
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
function initAdminView() {
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

// ── Boot ───────────────────────────────────────────────────────────────────────
navBtns.forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.view));
});

// Init on landing view
navigateTo('landing');
