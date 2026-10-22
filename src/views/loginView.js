export function renderLoginView() {
  return `
    <div class="min-h-screen bg-gradient-to-b from-primary/10 to-secondary/5 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- 헤더 -->
        <div class="text-center mb-10">
          <div class="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-[56px] text-primary">school</span>
          </div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface font-bold mb-2">한누리 한국어학당</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">로그인하여 시작하세요</p>
        </div>

        <!-- 로그인 카드 -->
        <div class="bg-surface-container-lowest rounded-3xl shadow-lg p-8 border border-surface-container">
          <!-- 소개 -->
          <div class="mb-8 p-4 rounded-2xl bg-secondary/5 border border-secondary/20">
            <p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              <strong>관리자 계정으로 로그인하면</strong> 교육 콘텐츠 관리, 사용자 관리 등 모든 기능을 이용할 수 있습니다.
            </p>
          </div>

          <!-- Google 로그인 버튼 -->
          <button id="btn-google-login" class="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-3 shadow-md shadow-primary/20 hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer group">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Google로 로그인</span>
            <span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>

          <!-- 로딩 상태 -->
          <div id="login-loading" class="hidden w-full h-14 rounded-xl bg-surface-container flex items-center justify-center gap-3">
            <span class="material-symbols-outlined text-[20px] text-primary animate-spin">refresh</span>
            <span class="font-body-md text-body-md text-on-surface-variant">로그인 중...</span>
          </div>

          <!-- 에러 메시지 -->
          <div id="login-error" class="hidden mt-4 p-3 rounded-xl bg-error/10 border border-error/30">
            <p id="error-message" class="font-body-sm text-body-sm text-error"></p>
          </div>
        </div>

      </div>
    </div>
  `;
}
