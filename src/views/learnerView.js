export function renderLearnerView() {
  return `
    <div class="flex flex-col w-full pb-20">
      <!-- Top Greeting & Motivation Banner -->
      <section class="px-gutter pt-space-md pb-space-xs">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-1.5">
              <h1 class="font-hangul-title text-hangul-title text-on-surface font-bold">안녕하세요! 👋</h1>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              준비된 강좌를 선택해서 학습을 시작하세요.
            </p>
          </div>
        </div>

      </section>

      <!-- 강좌 목록 -->
      <section class="px-gutter pt-space-lg pb-space-lg">
        <div class="flex items-center justify-between mb-space-md">
          <h3 class="font-headline-md text-headline-md text-on-surface font-bold">준비된 강좌</h3>
          <span class="font-label-sm text-label-sm text-on-surface-variant" id="courses-count">0개</span>
        </div>
        <div id="courses-list" class="flex flex-col gap-3">
          <!-- 로딩 상태 -->
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <span class="material-symbols-outlined text-[40px] text-on-surface-variant animate-pulse">hourglass_empty</span>
            <span class="font-body-md text-on-surface-variant">강좌 목록 로드 중...</span>
          </div>
        </div>
      </section>
    </div>
  `;
}

/**
 * 강좌 카드를 HTML로 렌더링
 */
export function renderCourseCard(course) {
  return `
    <div class="bg-surface-container-lowest rounded-2xl border border-surface-container overflow-hidden hover:shadow-md transition-all cursor-pointer course-card" data-course-id="${course.id}">
      <!-- 헤더 배경 -->
      <div class="h-24 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
        <span class="material-symbols-outlined text-[40px] text-primary">school</span>
      </div>

      <!-- 컨텐츠 -->
      <div class="p-space-md flex flex-col gap-3">
        <!-- 제목과 레벨 -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1">
            <h4 class="font-headline-md text-headline-md text-on-surface font-bold line-clamp-2">${course.title}</h4>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">${course.description}</p>
          </div>
          <span class="px-2 py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-bold whitespace-nowrap">
            ${course.level || '미정'}
          </span>
        </div>

        <!-- 정보 -->
        <div class="flex items-center gap-4 text-on-surface-variant font-label-sm text-label-sm">
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">play_circle</span>
            <span>${course.totalLessons || 0}차시</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">person</span>
            <span>${course.instructor || '강사 미정'}</span>
          </div>
        </div>

        <!-- 버튼 -->
        <button class="w-full h-10 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 active:scale-[0.98] transition-all cursor-pointer mt-2">
          <span>강의 보기</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  `;
}
