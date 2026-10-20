export function renderLearnerView() {
  return `
    <div class="flex flex-col w-full pb-20">
      <!-- Top Greeting & Motivation Banner -->
      <section class="px-gutter pt-space-md pb-space-xs">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-1.5">
              <h1 class="font-hangul-title text-hangul-title text-on-surface font-bold">안녕하세요, 마이클 님!</h1>
              <span class="text-[20px] animate-bounce">👋</span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              오늘의 목표 달성까지 <span class="font-semibold text-secondary">15분</span> 남았습니다.
            </p>
          </div>
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed shadow-sm">
            <span class="material-symbols-outlined text-[18px] text-on-tertiary-container" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
            <span class="font-label-sm text-label-sm font-bold">14일 연속</span>
          </div>
        </div>

        <!-- Weekly Streak & Goal Tracker Card -->
        <div class="mt-space-md p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-3 border border-surface-container">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-container">
                <span class="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <div>
                <div class="font-label-md text-label-md text-on-surface font-bold">이번 주 완주율 85%</div>
                <div class="font-body-sm text-body-sm text-on-surface-variant text-[12px]">매일 30분 집중 학습 챌린지</div>
              </div>
            </div>
            <span class="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-high text-secondary font-bold">Lv. 3 도전자</span>
          </div>
          
          <!-- 7-Day Dot Progress Indicator -->
          <div class="grid grid-cols-7 gap-1.5 pt-1">
            <div class="flex flex-col items-center gap-1">
              <span class="font-label-sm text-label-sm text-on-surface-variant text-[11px]">월</span>
              <div class="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-xs">
                <span class="material-symbols-outlined text-[16px]">check</span>
              </div>
            </div>
            <div class="flex flex-col items-center gap-1">
              <span class="font-label-sm text-label-sm text-on-surface-variant text-[11px]">화</span>
              <div class="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-xs">
                <span class="material-symbols-outlined text-[16px]">check</span>
              </div>
            </div>
            <div class="flex flex-col items-center gap-1">
              <span class="font-label-sm text-label-sm text-on-surface-variant text-[11px]">수</span>
              <div class="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-xs">
                <span class="material-symbols-outlined text-[16px]">check</span>
              </div>
            </div>
            <div class="flex flex-col items-center gap-1">
              <span class="font-label-sm text-label-sm text-on-surface-variant text-[11px]">목</span>
              <div class="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-xs">
                <span class="material-symbols-outlined text-[16px]">check</span>
              </div>
            </div>
            <div class="flex flex-col items-center gap-1">
              <span class="font-label-sm text-label-sm text-on-surface-variant text-[11px]">금</span>
              <div class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center ring-2 ring-secondary-container/40">
                <span class="material-symbols-outlined text-[16px]">check</span>
              </div>
            </div>
            <div class="flex flex-col items-center gap-1">
              <span class="font-label-sm text-label-sm text-secondary font-bold text-[11px]">오늘</span>
              <div class="w-8 h-8 rounded-full bg-surface-container-high text-secondary flex items-center justify-center font-bold font-label-md text-label-md shadow-inner">
                토
              </div>
            </div>
            <div class="flex flex-col items-center gap-1">
              <span class="font-label-sm text-label-sm text-outline-variant text-[11px]">일</span>
              <div class="w-8 h-8 rounded-full bg-surface-container-low text-outline-variant flex items-center justify-center text-[12px]">
                7
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Resume Learning Hero Card (Current Course) -->
      <section class="px-gutter pt-space-md">
        <div class="relative overflow-hidden rounded-2xl bg-primary-container text-on-primary p-space-md shadow-md flex flex-col justify-between">
          <div class="relative z-10">
            <div class="flex items-center justify-between gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider font-bold">
                중급 회화 · 이어듣기
              </span>
              <div class="flex items-center gap-1 text-on-primary-container font-label-sm text-label-sm">
                <span class="material-symbols-outlined text-[16px]">schedule</span>
                <span>13분 남음</span>
              </div>
            </div>
            <h2 class="font-headline-lg-mobile text-headline-lg-mobile mt-3 text-on-primary font-bold leading-tight">
              Ep 14. 한국 식당에서의 자연스러운 주문과 요청
            </h2>
            <!-- Grammar Highlight Pill -->
            <div class="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/40 backdrop-blur-sm text-primary-fixed">
              <span class="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">lightbulb</span>
              <span class="font-body-sm text-body-sm text-[12px]">오늘의 핵심 문법: <strong class="text-on-primary font-medium">-아/어 주시겠어요?</strong></span>
            </div>
            <!-- Progress Bar -->
            <div class="mt-4 flex flex-col gap-1.5">
              <div class="flex justify-between items-center text-on-primary-container font-label-sm text-label-sm">
                <span>강의 진행률</span>
                <span class="font-bold text-on-primary">65% 완료</span>
              </div>
              <div class="w-full h-2 rounded-full bg-primary overflow-hidden">
                <div class="h-full rounded-full bg-secondary-container w-[65%] transition-all duration-500"></div>
              </div>
            </div>
          </div>
          <!-- Action Button -->
          <div class="relative z-10 mt-5 pt-1">
            <button class="w-full h-[52px] rounded-xl bg-secondary hover:bg-secondary/95 active:scale-[0.98] transition-transform text-on-secondary font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer">
              <span>이어서 학습하기</span>
              <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
            </button>
          </div>
          <div class="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
          <div class="absolute right-0 bottom-0 w-32 h-32 rounded-full bg-on-tertiary-container/10 blur-2xl pointer-events-none"></div>
        </div>
      </section>

      <!-- Interactive Daily Training Hub -->
      <section class="px-gutter pt-space-lg">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-secondary">fitness_center</span>
            <h3 class="font-headline-md text-headline-md text-on-surface font-bold">일일 트레이닝 허브</h3>
          </div>
          <span class="font-label-sm text-label-sm text-on-surface-variant font-medium">3/4 완료</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <!-- 1. AI 발음 클리닉 -->
          <div class="p-3.5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors cursor-pointer group border border-surface-container">
            <div>
              <div class="flex items-center justify-between">
                <span class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-[18px]">🎙️</span>
                <span class="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-bold">92점</span>
              </div>
              <div class="font-headline-md text-headline-md text-[15px] font-bold text-on-surface mt-2.5">
                AI 발음 클리닉
              </div>
              <p class="font-body-sm text-body-sm text-on-surface-variant text-[12px] mt-1 line-clamp-1">
                ‘받침 연음화’ 교정 리포트
              </p>
            </div>
            <div class="mt-3 pt-2 flex items-center justify-between text-secondary font-label-sm text-label-sm font-semibold">
              <span>피드백 보기</span>
              <span class="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </div>
          </div>
          <!-- 2. 필수 단어 20개 -->
          <div class="p-3.5 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors cursor-pointer group border border-surface-container">
            <div>
              <div class="flex items-center justify-between">
                <span class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-[18px]">🃏</span>
                <span class="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">SRS</span>
              </div>
              <div class="font-headline-md text-headline-md text-[15px] font-bold text-on-surface mt-2.5">
                필수 단어 20개
              </div>
              <p class="font-body-sm text-body-sm text-on-surface-variant text-[12px] mt-1 line-clamp-1">
                식당 &amp; 마트 실전 어휘
              </p>
            </div>
            <div class="mt-3 pt-2 flex items-center justify-between text-secondary font-label-sm text-label-sm font-semibold">
              <span>플래시카드</span>
              <span class="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}
