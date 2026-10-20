export function renderLandingView() {
  return `
    <div class="flex flex-col w-full pb-20">
      <!-- Dynamic Hero & Value Proposition -->
      <section class="relative px-gutter pt-space-md pb-space-lg overflow-hidden">
        <div class="absolute -top-16 -right-12 w-64 h-64 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
        <div class="absolute top-48 -left-16 w-52 h-52 rounded-full bg-on-tertiary-container/10 blur-2xl pointer-events-none"></div>
        
        <!-- Live Accreditations Pill -->
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-secondary mb-space-sm shadow-sm">
          <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span class="font-label-sm text-label-sm uppercase tracking-wide">2025 K-Education Global Standard</span>
        </div>

        <!-- Main Copy Block -->
        <h1 class="font-hangul-display text-hangul-display text-primary tracking-tight mb-2">
          전 세계를 잇는 K-에듀의 시작,<br/>
          <span class="text-secondary">한누리 한국어학당</span>
        </h1>
        <p class="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
          글로벌 공인 TOPIK 만점 대비부터 현지 취업 비즈니스 회화까지, 검증된 국어국문 전문 강사진과 함께하세요.
        </p>

        <!-- Hero Image Banner with Overlaid Badges -->
        <div class="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg mb-space-md bg-surface-container">
          <img class="w-full h-full object-cover" alt="한국어 학당 강의 전경" src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" />
          <div class="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent"></div>
          
          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-surface-container-lowest/20 backdrop-blur-md flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px] text-on-primary">verified</span>
              </div>
              <div>
                <p class="font-label-sm text-[11px] text-surface-container-highest">국립국어원 규격 준수 커리큘럼</p>
                <p class="font-headline-md text-label-md text-on-primary leading-tight font-bold">100% 한국어 교원 1급 직강</p>
              </div>
            </div>
            <div class="px-2.5 py-1 rounded-full bg-on-tertiary-container text-on-tertiary font-label-sm text-label-sm flex items-center gap-1 font-bold">
              <span class="material-symbols-outlined text-[14px]">local_fire_department</span>
              <span>개강 임박</span>
            </div>
          </div>
        </div>

        <!-- Primary Quick Actions -->
        <div class="flex flex-col gap-2.5 mb-space-md">
          <button id="btn-open-level-test" class="relative w-full h-[52px] rounded-xl bg-secondary text-on-secondary font-headline-md text-body-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-secondary/25 active:scale-[0.98] transition-transform overflow-hidden cursor-pointer hover:bg-secondary-container">
            <span class="material-symbols-outlined text-[20px] text-surface-bright animate-bounce">auto_awesome</span>
            <span>3분 무료 한국어 레벨 진단받기</span>
            <span class="absolute top-1 right-2 px-1.5 py-0.5 rounded-full bg-on-tertiary-container text-on-tertiary font-label-sm text-[10px] uppercase font-bold tracking-wider">Free Pass</span>
          </button>
          <button id="btn-open-consultation" class="w-full h-[50px] rounded-xl bg-surface-container text-on-surface font-label-md text-body-md font-medium flex items-center justify-center gap-2 active:bg-surface-container-high transition-colors cursor-pointer hover:bg-surface-container-high">
            <span class="material-symbols-outlined text-[19px] text-secondary">support_agent</span>
            <span>무료 1:1 학습 컨설팅 신청</span>
          </button>
        </div>

        <!-- Trust Stats Ticker (Horizontal Ribbon) -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-gutter px-gutter">
          <div class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-container-low shadow-sm shrink-0 border border-surface-container">
            <span class="material-symbols-outlined text-[20px] text-secondary">groups</span>
            <div class="flex flex-col">
              <span class="font-label-sm text-[10px] text-on-surface-variant font-medium">누적 수강생</span>
              <span class="font-label-md text-label-md text-primary font-bold">42,000+ 명</span>
            </div>
          </div>
          <div class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-container-low shadow-sm shrink-0 border border-surface-container">
            <span class="material-symbols-outlined text-[20px] text-on-tertiary-container">workspace_premium</span>
            <div class="flex flex-col">
              <span class="font-label-sm text-[10px] text-on-surface-variant font-medium">TOPIK II 합격률</span>
              <span class="font-label-md text-label-md text-on-tertiary-container font-bold">94.8%</span>
            </div>
          </div>
          <div class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-container-low shadow-sm shrink-0 border border-surface-container">
            <span class="material-symbols-outlined text-[20px] text-secondary">rate_review</span>
            <div class="flex flex-col">
              <span class="font-label-sm text-[10px] text-on-surface-variant font-medium">1:1 첨삭 만족도</span>
              <span class="font-label-md text-label-md text-primary font-bold">4.9 / 5.0</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Category Filter Pills -->
      <section class="px-gutter pt-space-xs pb-space-sm">
        <div class="flex items-center justify-between mb-space-xs">
          <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">목표별 맞춤 코스</h2>
          <span id="courses-count-label" class="font-label-sm text-label-sm text-secondary font-medium">전체 4개 개설</span>
        </div>
        
        <!-- Category Filter Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-gutter px-gutter py-1.5" id="category-chips">
          <button class="cat-pill active px-4 py-2 rounded-full font-label-md text-label-md transition-all shrink-0 bg-primary text-on-primary shadow-sm cursor-pointer" data-cat="all">
            전체
          </button>
          <button class="cat-pill px-4 py-2 rounded-full font-label-md text-label-md transition-all shrink-0 bg-surface-container text-on-surface hover:bg-surface-container-high cursor-pointer" data-cat="topik">
            TOPIK 집중반
          </button>
          <button class="cat-pill px-4 py-2 rounded-full font-label-md text-label-md transition-all shrink-0 bg-surface-container text-on-surface hover:bg-surface-container-high cursor-pointer" data-cat="business">
            실무 비즈니스
          </button>
          <button class="cat-pill px-4 py-2 rounded-full font-label-md text-label-md transition-all shrink-0 bg-surface-container text-on-surface hover:bg-surface-container-high cursor-pointer" data-cat="conversation">
            실전 생활회화
          </button>
          <button class="cat-pill px-4 py-2 rounded-full font-label-md text-label-md transition-all shrink-0 bg-surface-container text-on-surface hover:bg-surface-container-high cursor-pointer" data-cat="academic">
            대학·대학원 진학
          </button>
        </div>
      </section>

      <!-- Dynamic Course Cards Stack Container -->
      <section class="px-gutter flex flex-col gap-space-md pb-space-lg" id="courses-list-container">
        <!-- Rendered dynamically by main.js -->
        <div class="p-8 text-center text-on-surface-variant">강좌 데이터를 불러오는 중...</div>
      </section>

      <!-- Educational Features (Bento Grid Style) -->
      <section class="px-gutter pt-space-xs pb-space-lg">
        <div class="mb-space-sm">
          <span class="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Why Hannuri?</span>
          <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-primary mt-0.5 font-bold">
            한누리만의 독보적 학습 시스템
          </h2>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between h-36 border border-surface-container">
            <div class="w-10 h-10 rounded-xl bg-surface-container-high text-secondary flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">graphic_eq</span>
            </div>
            <div>
              <h4 class="font-label-md text-label-md text-primary font-bold">AI 실시간 음성 &amp; 억양</h4>
              <p class="font-body-sm text-[12px] text-on-surface-variant mt-0.5 leading-snug">모음 정밀도와 고저 악센트 0.1초 즉시 교정</p>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between h-36 border border-surface-container">
            <div class="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">school</span>
            </div>
            <div>
              <h4 class="font-label-md text-label-md text-primary font-bold">정규 1급 교원 강사</h4>
              <p class="font-body-sm text-[12px] text-on-surface-variant mt-0.5 leading-snug">국어국문학 및 어학교육 석박사급 전담 배정</p>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between h-36 border border-surface-container">
            <div class="w-10 h-10 rounded-xl bg-surface-container-high text-secondary flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">assured_workload</span>
            </div>
            <div>
              <h4 class="font-label-md text-label-md text-primary font-bold">비자·학사 원스톱 케어</h4>
              <p class="font-body-sm text-[12px] text-on-surface-variant mt-0.5 leading-snug">D-4, E-7 비자 서류 및 대학원 입학 행정 연계</p>
            </div>
          </div>
          <div class="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between h-36 border border-surface-container">
            <div class="w-10 h-10 rounded-xl bg-tertiary-fixed text-tertiary-container flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">public</span>
            </div>
            <div>
              <h4 class="font-label-md text-label-md text-primary font-bold">글로벌 언어 교환</h4>
              <p class="font-body-sm text-[12px] text-on-surface-variant mt-0.5 leading-snug">한국인 대학생 버디 매칭 및 주간 온/오프 살롱</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Student Reviews / Testimonials -->
      <section class="px-gutter pb-space-xl">
        <div class="flex items-center justify-between mb-space-sm">
          <div>
            <span class="font-label-sm text-label-sm text-on-tertiary-container font-bold uppercase tracking-wider">Real Voice</span>
            <h2 class="font-headline-lg-mobile text-headline-lg-mobile text-primary mt-0.5 font-bold">세계 각국 수강생의 생생 후기</h2>
          </div>
        </div>
        <div class="flex gap-3 overflow-x-auto no-scrollbar -mx-gutter px-gutter py-1" id="reviews-container">
          <!-- Rendered dynamically -->
        </div>
      </section>

      <!-- Sticky Quick Consultation Bar -->
      <aside class="sticky bottom-0 z-40 w-full px-gutter py-2.5 bg-surface-bright/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(15,23,42,0.08)] flex items-center justify-between gap-3 border-t border-surface-container">
        <div class="flex flex-col">
          <span class="font-label-sm text-[11px] text-on-tertiary-container font-bold flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px]">alarm</span> 오늘 마감 수강 혜택
          </span>
          <span class="font-label-md text-label-md text-primary font-bold">1:1 맞춤 진단 패키지 무료</span>
        </div>
        <button id="btn-bottom-consultation" class="h-11 px-5 rounded-xl bg-secondary text-on-secondary font-headline-md text-label-md font-semibold flex items-center gap-1.5 shadow-md shadow-secondary/25 active:scale-95 transition-transform shrink-0 cursor-pointer hover:bg-secondary-container">
          <span class="material-symbols-outlined text-[18px]">chat_bubble</span>
          <span>상담 신청</span>
        </button>
      </aside>
    </div>
  `;
}
