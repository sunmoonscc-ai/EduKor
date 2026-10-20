export function renderEducatorView() {
  return `
    <div class="flex flex-col w-full px-gutter pb-10 gap-space-lg pt-space-md">

      <!-- Instructor Greeting & Quick Pulse Metrics -->
      <section class="flex flex-col gap-space-sm">
        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5">
              <span class="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span class="font-label-sm text-label-sm uppercase tracking-wide text-secondary">Instructor Workspace</span>
            </div>
            <h1 class="font-hangul-title text-hangul-title text-on-surface mt-0.5 font-bold">김서연 강사님</h1>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-semibold">
            오늘 일정 3건
          </span>
        </div>
        <p class="font-body-md text-body-md text-on-surface-variant">
          오늘 예정된 실시간 코칭과 첨삭 과제를 확인하고 원활한 수업을 시작해 보세요.
        </p>

        <!-- Stat Badges Bento Bar -->
        <div class="grid grid-cols-3 gap-space-xs mt-1">
          <div class="flex flex-col p-2.5 rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container">
            <div class="flex items-center gap-1 text-secondary">
              <span class="material-symbols-outlined text-[16px]">how_to_reg</span>
              <span class="font-label-sm text-label-sm font-semibold">출석률</span>
            </div>
            <span class="font-headline-md text-headline-md text-on-surface font-bold mt-1">98%</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant">전체 세션 기준</span>
          </div>
          <div class="flex flex-col p-2.5 rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container">
            <div class="flex items-center gap-1 text-on-tertiary-container">
              <span class="material-symbols-outlined text-[16px]">edit_note</span>
              <span class="font-label-sm text-label-sm font-semibold">대기 첨삭</span>
            </div>
            <span class="font-headline-md text-headline-md text-on-surface font-bold mt-1">7건</span>
            <span class="font-label-sm text-label-sm text-on-tertiary-container font-medium">당일 마감 3건</span>
          </div>
          <div class="flex flex-col p-2.5 rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container">
            <div class="flex items-center gap-1 text-secondary-container">
              <span class="material-symbols-outlined text-[16px]">meeting_room</span>
              <span class="font-label-sm text-label-sm font-semibold">대기실</span>
            </div>
            <span class="font-headline-md text-headline-md text-on-surface font-bold mt-1">활성</span>
            <span class="font-label-sm text-label-sm text-secondary font-medium">7명 입장 중</span>
          </div>
        </div>
      </section>

      <!-- Urgent Class Alert Card -->
      <section class="relative overflow-hidden rounded-2xl bg-primary text-on-primary p-space-md shadow-xl flex flex-col gap-space-md">
        <div class="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-secondary-container/15 blur-3xl pointer-events-none"></div>
        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-2">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary-container opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-on-tertiary-container"></span>
            </span>
            <span class="font-label-sm text-label-sm font-bold text-tertiary-fixed-dim uppercase tracking-wider">
              🚨 10분 후 라이브 시작
            </span>
          </div>
          <span class="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-primary-container text-primary-fixed font-medium">
            오후 4:00 - 5:00
          </span>
        </div>
        <div class="flex flex-col gap-1 relative z-10">
          <h2 class="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-primary leading-tight">
            중급 실전회화 라이브 B반
          </h2>
          <p class="font-body-sm text-body-sm text-on-primary-container">
            토픽 주제: '한국의 주거 형태와 부동산 계약 표현' (소그룹 토론 8인)
          </p>
        </div>
        <div class="flex flex-col gap-2 pt-1 relative z-10">
          <button id="open-live-btn" class="w-full h-[52px] py-3.5 px-space-md bg-secondary text-on-secondary rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md cursor-pointer hover:bg-secondary/90">
            <span class="material-symbols-outlined text-[20px]">video_call</span>
            <span>라이브 화상 강의실 즉시 열기</span>
          </button>
          <div class="grid grid-cols-2 gap-2 mt-0.5">
            <button class="h-10 px-3 rounded-lg bg-primary-container text-primary-fixed flex items-center justify-center gap-1.5 font-label-sm text-label-sm hover:bg-surface-tint/30 transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">groups</span>
              <span>입장 7 / 8 명</span>
            </button>
            <button class="h-10 px-3 rounded-lg bg-primary-container text-primary-fixed flex items-center justify-center gap-1.5 font-label-sm text-label-sm hover:bg-surface-tint/30 transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[16px] text-secondary-fixed">description</span>
              <span>교안 PDF 뷰어</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Live Attendance & Student Quick Tracker -->
      <section class="flex flex-col gap-space-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-secondary text-[20px]">checklist_rtl</span>
            <h2 class="font-hangul-title text-hangul-title text-on-surface font-bold">실시간 출결 체크</h2>
          </div>
          <button class="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-0.5 cursor-pointer hover:underline">
            <span>일괄 출석</span>
            <span class="material-symbols-outlined text-[14px]">done_all</span>
          </button>
        </div>
        <div class="flex flex-col gap-space-xs">
          <!-- Student rows -->
          ${[
            { name: 'Nguyen Van A', info: '베트남 · 출석률 100%', status: 'present', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
            { name: 'John Smith', info: '미국 · 중급 발표 우수', status: 'present', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
            { name: 'Sakura K.', info: '대기실 접속 (5분 지각 예정)', status: 'late', src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80' },
            { name: 'Carlos M.', info: '스페인 · 공결 사유서 승인됨', status: 'absent', src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80' },
          ].map(s => `
            <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container ${s.status === 'absent' ? 'opacity-70' : ''}">
              <div class="flex items-center gap-3">
                <img class="w-10 h-10 rounded-full object-cover" src="${s.src}" alt="${s.name}" />
                <div class="flex flex-col">
                  <span class="font-label-md text-label-md text-on-surface font-bold">${s.name}</span>
                  <span class="font-body-sm text-body-sm ${s.status === 'late' ? 'text-on-tertiary-container font-medium' : 'text-on-surface-variant'}">${s.info}</span>
                </div>
              </div>
              <div class="flex items-center gap-1">
                ${s.status === 'present' ? `
                  <button class="attendance-btn px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1 hover:bg-secondary hover:text-on-secondary transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-[15px]">check_circle</span>
                    <span>출석 완료</span>
                  </button>` : s.status === 'late' ? `
                  <span class="px-2.5 py-1 rounded-lg bg-surface-container text-on-tertiary-container font-label-sm text-label-sm font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">schedule</span>
                    <span>지각</span>
                  </span>` : `
                  <button class="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium flex items-center gap-1 cursor-pointer">
                    <span class="material-symbols-outlined text-[14px]">drafts</span>
                    <span>사유서</span>
                  </button>`}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Writing & Pronunciation Feedback Queue -->
      <section class="flex flex-col gap-space-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-on-tertiary-container text-[20px]">rate_review</span>
            <h2 class="font-hangul-title text-hangul-title text-on-surface font-bold">작문 및 음성 첨삭 대기</h2>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-surface-container text-on-tertiary-container font-label-sm text-label-sm font-bold">
            7건 대기중
          </span>
        </div>
        <div class="flex flex-col gap-space-xs">
          <!-- Queue items -->
          <div class="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm border border-surface-container">
            <div class="flex items-start justify-between gap-2">
              <div class="flex flex-col">
                <div class="flex items-center gap-1.5">
                  <span class="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-secondary font-bold">TOPIK II 쓰기</span>
                  <span class="font-body-sm text-body-sm text-on-surface-variant">2시간 전 제출</span>
                </div>
                <h3 class="font-headline-md text-headline-md text-on-surface font-bold mt-1">
                  마이클 첸 — 한국의 배달 문화와 일상
                </h3>
              </div>
              <span class="px-2 py-0.5 rounded-full bg-on-tertiary-container text-on-tertiary font-label-sm text-label-sm font-bold shrink-0">
                마감 임박
              </span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              "한국에서 배달 문화는 단순한 편의가 아닌 생활의 일부로 자리잡았습니다. 특히 야식 문화와 결합하여..."
            </p>
            <div class="flex gap-2">
              <button class="flex-1 h-9 rounded-lg bg-secondary text-on-secondary font-label-sm text-label-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-secondary/90 active:scale-[0.98] transition-all shadow-sm">
                <span class="material-symbols-outlined text-[15px]">edit</span>
                <span>첨삭 시작</span>
              </button>
              <button class="h-9 px-3 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center justify-center gap-1 cursor-pointer hover:bg-surface-container-high transition-colors">
                <span class="material-symbols-outlined text-[15px]">visibility</span>
                <span>미리보기</span>
              </button>
            </div>
          </div>

          <div class="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm border border-surface-container">
            <div class="flex items-start justify-between gap-2">
              <div class="flex flex-col">
                <div class="flex items-center gap-1.5">
                  <span class="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">AI 발음 교정</span>
                  <span class="font-body-sm text-body-sm text-on-surface-variant">1시간 전 제출</span>
                </div>
                <h3 class="font-headline-md text-headline-md text-on-surface font-bold mt-1">
                  Nguyen Van A — '받침 연음화' 집중 훈련
                </h3>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="flex-1 h-9 rounded-lg bg-surface-container text-secondary font-label-sm text-label-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-surface-container-high transition-colors">
                <span class="material-symbols-outlined text-[15px]">mic</span>
                <span>음성 피드백</span>
              </button>
              <button class="h-9 px-3 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center justify-center gap-1 cursor-pointer hover:bg-surface-container-high transition-colors">
                <span class="material-symbols-outlined text-[15px]">play_circle</span>
                <span>재생</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Schedule & Upcoming Sessions -->
      <section class="flex flex-col gap-space-sm">
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-secondary text-[20px]">calendar_today</span>
          <h2 class="font-hangul-title text-hangul-title text-on-surface font-bold">오늘 일정</h2>
        </div>
        <div class="flex flex-col gap-2">
          ${[
            { time: '오후 4:00', title: '중급 실전회화 B반', type: '라이브', color: 'secondary', count: '8인' },
            { time: '오후 6:30', title: 'TOPIK II 쓰기 특강', type: '녹화', color: 'on-tertiary-container', count: '12인' },
            { time: '오후 8:00', title: '1:1 개인 코칭 (Sakura K.)', type: 'Zoom', color: 'primary', count: '1인' },
          ].map(s => `
            <div class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container">
              <div class="flex flex-col items-center w-14 shrink-0">
                <span class="font-label-sm text-label-sm text-on-surface-variant">${s.time}</span>
              </div>
              <div class="w-px h-10 bg-surface-container"></div>
              <div class="flex flex-col flex-1 min-w-0">
                <span class="font-label-md text-label-md text-on-surface font-bold truncate">${s.title}</span>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-surface-container text-${s.color}">${s.type}</span>
                  <span class="font-label-sm text-label-sm text-on-surface-variant">${s.count}</span>
                </div>
              </div>
              <button class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors">
                <span class="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_forward_ios</span>
              </button>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;
}
