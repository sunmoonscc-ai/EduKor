export function renderUserManagementView() {
  return `
    <div class="flex flex-col w-full gap-space-lg px-gutter py-space-md">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex flex-col gap-1">
          <h2 class="font-headline-md text-headline-md text-on-surface font-bold">사용자 관리</h2>
          <p class="font-body-sm text-body-sm text-on-surface-variant">플랫폼 사용자 관리 및 권한 설정</p>
        </div>
        <button id="btn-invite-user" class="px-4 py-2.5 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold flex items-center gap-2 shadow-md cursor-pointer hover:bg-secondary/90 active:scale-[0.98] transition-all">
          <span class="material-symbols-outlined text-[18px]">person_add</span>
          <span>사용자 초대</span>
        </button>
      </div>

      <!-- Search & Filter -->
      <div class="flex flex-col gap-3">
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px]">search</span>
          <input
            id="user-search-input"
            type="text"
            placeholder="사용자 이름, 이메일로 검색..."
            class="w-full h-12 pl-12 pr-4 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant outline-none focus:border-secondary transition-colors"
          />
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button class="user-filter-btn px-4 py-2 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold flex-shrink-0 cursor-pointer" data-filter="all">
            전체
          </button>
          <button class="user-filter-btn px-4 py-2 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium flex-shrink-0 cursor-pointer hover:bg-surface-container-high transition-colors" data-filter="admin">
            관리자 (2)
          </button>
          <button class="user-filter-btn px-4 py-2 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium flex-shrink-0 cursor-pointer hover:bg-surface-container-high transition-colors" data-filter="user">
            일반 사용자
          </button>
        </div>
      </div>

      <!-- Users List -->
      <div id="users-list-container" class="flex flex-col gap-3">
        <!-- 로딩 상태 -->
        <div class="flex flex-col items-center justify-center py-12 gap-3">
          <span class="material-symbols-outlined text-[40px] text-on-surface-variant animate-pulse">hourglass_empty</span>
          <span class="font-body-md text-on-surface-variant">사용자 목록을 불러오는 중...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div id="users-empty-state" class="hidden flex flex-col items-center justify-center py-12 gap-3">
        <span class="material-symbols-outlined text-[40px] text-on-surface-variant">people_alt</span>
        <span class="font-body-md text-on-surface-variant">사용자가 없습니다.</span>
      </div>

    </div>
  `;
}

/**
 * 사용자 카드 렌더링
 */
export function renderUserCard(user) {
  const initials = (user.name || 'User')
    .split(' ')
    .map(word => word[0])
    .toUpperCase()
    .join('')
    .slice(0, 2);

  const roleLabel = user.role === 'admin' ? '👑 관리자' : '👤 일반 사용자';
  const roleBgColor = user.role === 'admin' ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface';

  return `
    <div class="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-4 flex items-center justify-between user-card" data-user-id="${user.uid}">
      <!-- 좌측: 사용자 정보 -->
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
          <span class="text-sm font-bold text-on-primary">${initials}</span>
        </div>
        <div class="flex flex-col min-w-0 flex-1">
          <p class="font-label-md text-label-md text-on-surface font-bold truncate">${user.name || '미설정'}</p>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${user.email}</p>
          <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${roleBgColor} w-fit">
            ${roleLabel}
          </span>
        </div>
      </div>

      <!-- 우측: 액션 버튼 -->
      <div class="flex items-center gap-2 flex-shrink-0 ml-2">
        <button class="btn-view-user w-10 h-10 rounded-lg bg-surface-container text-on-surface flex items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors" title="상세 정보">
          <span class="material-symbols-outlined text-[20px]">info</span>
        </button>
        <button class="btn-edit-user w-10 h-10 rounded-lg bg-surface-container text-on-surface flex items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors" title="편집">
          <span class="material-symbols-outlined text-[20px]">edit</span>
        </button>
      </div>
    </div>
  `;
}
