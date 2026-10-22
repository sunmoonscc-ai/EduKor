export function renderAdminView() {
  return `
    <div class="flex flex-col w-full pb-10">

      <!-- Admin Sub Navigation Tabs -->
      <div class="sticky top-16 z-40 bg-surface/95 backdrop-blur-md border-b border-surface-container px-gutter py-0">
        <div class="flex items-center gap-1 overflow-x-auto pb-0 no-scrollbar">
          <button class="admin-sub-tab px-4 py-3 rounded-t-xl border-b-2 border-transparent text-on-surface-variant font-label-md text-label-md font-semibold cursor-pointer transition-all hover:text-on-surface active:scale-[0.98]" data-sub-tab="dashboard">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px]">dashboard</span>
              <span>대시보드</span>
            </span>
          </button>
          <button class="admin-sub-tab px-4 py-3 rounded-t-xl border-b-2 border-transparent text-on-surface-variant font-label-md text-label-md font-semibold cursor-pointer transition-all hover:text-on-surface active:scale-[0.98]" data-sub-tab="users">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px]">people</span>
              <span>사용자 관리</span>
            </span>
          </button>
          <button class="admin-sub-tab px-4 py-3 rounded-t-xl border-b-2 border-transparent text-on-surface-variant font-label-md text-label-md font-semibold cursor-pointer transition-all hover:text-on-surface active:scale-[0.98]" data-sub-tab="content">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px]">library_books</span>
              <span>교육 콘텐츠</span>
            </span>
          </button>
          <button class="admin-sub-tab px-4 py-3 rounded-t-xl border-b-2 border-transparent text-on-surface-variant font-label-md text-label-md font-semibold cursor-pointer transition-all hover:text-on-surface active:scale-[0.98]" data-sub-tab="analytics">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px]">analytics</span>
              <span>분석</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Sub Tab Content -->
      <div id="admin-sub-content" class="flex flex-col w-full">

      <!-- Dashboard Content (Sub Tab) -->
      <div id="dashboard-content" class="flex flex-col w-full pb-10">

      <!-- Admin Hero Dashboard Banner -->
      <div class="px-gutter pt-3 pb-6 flex flex-col gap-space-lg">
        <div class="bg-primary-container text-on-primary rounded-2xl p-space-lg shadow-md relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none"></div>
          <div class="flex flex-col gap-2 relative z-10">
            <div class="flex items-center justify-between">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-highest/20 text-surface-variant font-label-sm text-label-sm">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>본원 통합 운영망 가동 중</span>
              </div>
              <span class="font-label-sm text-label-sm text-on-primary-container">2025년 2학기 정규 모집</span>
            </div>
            <h1 class="font-headline-lg-mobile text-headline-lg-mobile tracking-tight text-white mt-1 font-bold">
              어학원 본원 운영 현황
            </h1>
            <p class="font-body-sm text-body-sm text-on-primary-container">
              실시간 학사 지표, 비자 및 수강 행정, 교수진 배정 현황 모니터링
            </p>
          </div>
          <!-- KPI Cards -->
          <div class="grid grid-cols-2 gap-space-sm mt-space-md pt-space-sm border-t border-slate-700/50">
            <div class="bg-primary/50 backdrop-blur-md rounded-xl p-3 flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="font-label-sm text-label-sm text-slate-300">총 재적 수강생</span>
                <span class="material-symbols-outlined text-[18px] text-secondary-fixed">group</span>
              </div>
              <div class="mt-2">
                <div class="font-display-lg text-2xl font-bold text-white tracking-tight">1,428<span class="font-body-sm text-body-sm font-normal text-slate-300 ml-0.5">명</span></div>
                <div class="flex items-center gap-1 mt-1">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    <span class="material-symbols-outlined text-[12px] leading-none">trending_up</span>+12.4%
                  </span>
                  <span class="font-label-sm text-[10px] text-slate-400">전월비</span>
                </div>
              </div>
            </div>
            <div class="bg-primary/50 backdrop-blur-md rounded-xl p-3 flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="font-label-sm text-label-sm text-slate-300">당월 등록 매출</span>
                <span class="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">payments</span>
              </div>
              <div class="mt-2">
                <div class="font-display-lg text-2xl font-bold text-white tracking-tight">₩142.8<span class="font-body-sm text-body-sm font-normal text-slate-300 ml-0.5">M</span></div>
                <div class="flex items-center gap-1 mt-1">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">목표 104%</span>
                  <span class="font-label-sm text-[10px] text-slate-400">초과달성</span>
                </div>
              </div>
            </div>
            <div class="bg-primary/50 backdrop-blur-md rounded-xl p-3 flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="font-label-sm text-label-sm text-slate-300">평균 코스 완강률</span>
                <span class="material-symbols-outlined text-[18px] text-secondary-fixed-dim">school</span>
              </div>
              <div class="mt-2">
                <div class="font-display-lg text-2xl font-bold text-white tracking-tight">88.6<span class="font-body-sm text-body-sm font-normal text-slate-300 ml-0.5">%</span></div>
                <div class="flex items-center gap-1 mt-1">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">+3.2%p</span>
                  <span class="font-label-sm text-[10px] text-slate-400">안정 지표</span>
                </div>
              </div>
            </div>
            <div class="bg-primary/50 backdrop-blur-md rounded-xl p-3 flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="font-label-sm text-label-sm text-slate-300">신규 레벨테스트</span>
                <span class="material-symbols-outlined text-[18px] text-orange-300">assignment_turned_in</span>
              </div>
              <div class="mt-2">
                <div class="font-display-lg text-2xl font-bold text-white tracking-tight">43<span class="font-body-sm text-body-sm font-normal text-slate-300 ml-0.5">건</span></div>
                <div class="flex items-center gap-1 mt-1">
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/25 text-amber-300">미배정 12건</span>
                  <span class="font-label-sm text-[10px] text-slate-400">즉시 조치</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Urgent Approvals -->
        <div class="flex flex-col gap-space-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-error"></span>
              <h2 class="font-headline-md text-headline-md text-on-surface font-bold">즉시 처리 필요 결재</h2>
            </div>
            <span class="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-semibold">5건 대기</span>
          </div>
          <div class="flex flex-col gap-2.5">
            <!-- Visa -->
            <div class="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-3 border border-surface-container">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-on-tertiary-container flex-shrink-0">
                    <span class="material-symbols-outlined text-[20px]">badge</span>
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="font-label-sm text-label-sm text-secondary font-semibold uppercase">비자 행정 심사</span>
                    <span class="font-body-md font-semibold text-on-surface truncate">D-4 표준입학허가서 발급 검토</span>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex-shrink-0">3건</span>
              </div>
              <div class="bg-surface-container-low rounded-xl p-2.5 flex items-center justify-between">
                <span class="font-body-sm text-body-sm text-on-surface-variant truncate">Nguyen Thi Lan 외 2명 서류 일치 확인 완료</span>
                <button id="btn-approve-visa" class="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md active:scale-95 transition-transform flex-shrink-0 shadow-sm cursor-pointer hover:bg-secondary/90">
                  승인하기
                </button>
              </div>
            </div>

            <!-- Faculty Matching -->
            <div class="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-3 border border-surface-container">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-secondary flex-shrink-0">
                    <span class="material-symbols-outlined text-[20px]">person_add</span>
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="font-label-sm text-label-sm text-secondary font-semibold uppercase">교수진 매칭</span>
                    <span class="font-body-md font-semibold text-on-surface truncate">2025 가을학기 TOPIK II 특강 강사 배정</span>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex-shrink-0">2건</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-body-sm text-body-sm text-on-surface-variant">김서연 수석강사 / 박현우 전임강사 후보</span>
                <button class="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md active:scale-95 transition-transform cursor-pointer hover:bg-surface-container-high">
                  매칭 검토
                </button>
              </div>
            </div>

            <!-- Payroll -->
            <div class="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex items-center justify-between border border-surface-container">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <span class="material-symbols-outlined text-[20px]">receipt_long</span>
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="font-body-md font-semibold text-on-surface truncate">전월 외부 강사료 정산 지급안</span>
                  <span class="font-body-sm text-body-sm text-on-surface-variant">총 18개 강좌 정산액 합계 ₩24.5M</span>
                </div>
              </div>
              <button class="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md active:scale-95 transition-transform flex-shrink-0 cursor-pointer hover:bg-surface-container-high">
                결재
              </button>
            </div>
          </div>
        </div>

        <!-- Course & Instructor Operations -->
        <div class="flex flex-col gap-space-sm">
          <div class="flex items-center justify-between">
            <h2 class="font-headline-md text-headline-md text-on-surface font-bold">강좌 및 강사진 운영 현황</h2>
            <span class="font-label-sm text-label-sm text-on-surface-variant">실시간 관제</span>
          </div>
          <div class="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-md border border-surface-container">
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-surface-container-low rounded-xl p-3 flex items-center gap-2.5">
                <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
                <div class="flex flex-col min-w-0">
                  <span class="font-label-sm text-label-sm text-on-surface-variant">실시간 라이브 클래스</span>
                  <span class="font-hangul-title text-hangul-title text-on-surface font-bold">6개 진행 중</span>
                </div>
              </div>
              <div class="bg-surface-container-low rounded-xl p-3 flex items-center gap-2.5">
                <span class="material-symbols-outlined text-secondary text-[22px] flex-shrink-0">verified_user</span>
                <div class="flex flex-col min-w-0">
                  <span class="font-label-sm text-label-sm text-on-surface-variant">출결 및 근태 이상</span>
                  <span class="font-hangul-title text-hangul-title text-on-surface font-bold">0건 (안정)</span>
                </div>
              </div>
            </div>

            <!-- Filter tabs -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar" id="admin-filter-tabs">
              <button class="admin-filter-btn px-3 py-1.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold flex-shrink-0 active:scale-95 transition-transform cursor-pointer" data-filter="all">전체 강좌 34개</button>
              <button class="admin-filter-btn px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium flex-shrink-0 active:scale-95 transition-transform cursor-pointer" data-filter="new">신설 대기 4개</button>
              <button class="admin-filter-btn px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium flex-shrink-0 active:scale-95 transition-transform cursor-pointer" data-filter="closing">마감 임박 2개</button>
            </div>

            <!-- Course list -->
            <div class="flex flex-col gap-2">
              ${[
                { status: '정상 수업', statusColor: 'text-emerald-600 bg-emerald-50', tag: '정규', title: '중급 비즈니스 한국어 회화 B', detail: '담당: 이진아 강사 · 본원 402호 (정원 18/20명)' },
                { status: '개강 예정', statusColor: 'text-secondary bg-secondary-fixed', tag: '신설', title: 'TOPIK II 심화 특강 A', detail: '담당: 미정 · 온라인 Zoom (정원 0/15명)' },
                { status: '마감 임박', statusColor: 'text-on-tertiary-container bg-tertiary-fixed', tag: '정규', title: '초급 생활한국어 D반', detail: '담당: 박현우 강사 · 본원 201호 (정원 19/20명)' },
              ].map(c => `
                <div class="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                  <div class="flex flex-col min-w-0">
                    <div class="flex items-center gap-1.5">
                      <span class="px-1.5 py-0.5 rounded text-[10px] bg-secondary-fixed text-on-secondary-fixed font-bold">${c.tag}</span>
                      <span class="font-body-md font-semibold text-on-surface truncate">${c.title}</span>
                    </div>
                    <span class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">${c.detail}</span>
                  </div>
                  <span class="font-label-sm text-label-sm font-bold px-2 py-1 rounded ${c.statusColor} flex-shrink-0 ml-2">${c.status}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Recent Level Test Submissions -->
        <div class="flex flex-col gap-space-sm">
          <div class="flex items-center justify-between">
            <h2 class="font-headline-md text-headline-md text-on-surface font-bold">신규 레벨테스트 결과</h2>
            <button class="font-label-sm text-label-sm text-secondary font-semibold cursor-pointer hover:underline">전체 보기</button>
          </div>
          <div class="flex flex-col gap-2">
            ${[
              { name: 'Ahmad Reza (이란)', level: '중급 추정 → TOPIK 3급 반 추천', time: '15분 전' },
              { name: 'Sofia Martínez (멕시코)', level: '초급 → 입문 생활한국어 반 추천', time: '1시간 전' },
              { name: 'Park Ji-woo (한국계 미국)', level: '고급 추정 → TOPIK II 특강 추천', time: '3시간 전' },
            ].map(t => `
              <div class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container">
                <div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-[18px] text-secondary">assignment_turned_in</span>
                </div>
                <div class="flex flex-col flex-1 min-w-0">
                  <span class="font-label-md text-label-md text-on-surface font-bold">${t.name}</span>
                  <span class="font-body-sm text-body-sm text-on-surface-variant truncate">${t.level}</span>
                </div>
                <span class="font-label-sm text-label-sm text-on-surface-variant flex-shrink-0">${t.time}</span>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
      </div>

      </div>
    </div>
  `;
}
