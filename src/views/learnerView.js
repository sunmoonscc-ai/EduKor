export function renderLearnerView() {
  return `
    <div class="flex flex-col w-full pb-20 overflow-x-hidden">
      <!-- Top Greeting & Motivation Banner -->
      <section class="px-3 sm:px-gutter pt-space-md pb-space-xs">
        <div class="flex items-center justify-between">
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <h1 class="font-hangul-title text-hangul-title text-on-surface font-bold text-base sm:text-lg truncate">안녕하세요! 👋</h1>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-xs sm:text-sm">
              준비된 강좌를 선택해서 학습을 시작하세요.
            </p>
          </div>
        </div>

      </section>

      <!-- 강좌 목록 -->
      <section class="px-3 sm:px-gutter pt-space-lg pb-space-lg">
        <div class="flex items-center justify-between mb-space-md gap-2">
          <h3 class="font-headline-md text-headline-md text-on-surface font-bold text-sm sm:text-base">준비된 강좌</h3>
          <span class="font-label-sm text-label-sm text-on-surface-variant text-xs sm:text-sm flex-shrink-0" id="courses-count">0개</span>
        </div>
        <div id="courses-list" class="flex flex-col gap-3 w-full overflow-x-hidden">
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
    <div class="bg-surface-container-lowest rounded-xl sm:rounded-2xl border border-surface-container overflow-hidden hover:shadow-md transition-all cursor-pointer course-card w-full" data-course-id="${course.id}">
      <!-- 헤더 배경 -->
      <div class="h-20 sm:h-24 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
        <span class="material-symbols-outlined text-[32px] sm:text-[40px] text-primary">school</span>
      </div>

      <!-- 컨텐츠 -->
      <div class="p-3 sm:p-space-md flex flex-col gap-2 sm:gap-3">
        <!-- 제목과 레벨 -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <h4 class="font-headline-md text-headline-md text-on-surface font-bold line-clamp-2 text-sm sm:text-base">${course.title}</h4>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-1 whitespace-pre-line break-words text-xs sm:text-sm">${course.description}</p>
          </div>
          <span class="px-2 py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-bold whitespace-nowrap text-xs flex-shrink-0">
            ${course.level || '미정'}
          </span>
        </div>

        <!-- 정보 -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-on-surface-variant font-label-sm text-label-sm text-xs sm:text-sm overflow-x-hidden">
          <div class="flex items-center gap-1 whitespace-nowrap">
            <span class="material-symbols-outlined text-[16px] flex-shrink-0">play_circle</span>
            <span>${course.totalLessons || 0}차시</span>
          </div>
          <div class="flex items-center gap-1 whitespace-nowrap">
            <span class="material-symbols-outlined text-[16px] flex-shrink-0">person</span>
            <span class="truncate">${course.instructor || '강사 미정'}</span>
          </div>
        </div>

        <!-- 버튼 -->
        <button class="w-full h-10 rounded-lg sm:rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 active:scale-[0.98] transition-all cursor-pointer mt-2 text-sm">
          <span>강의 보기</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  `;
}

/**
 * 레슨 상세 모달 (파트별 영상 - 아코디언 형식)
 */
export function renderLessonDetailModal(lesson, parts = []) {
  const partAccordion = parts.length > 0
    ? parts.map((part, idx) => `
        <div class="lesson-part-accordion-item border border-surface-container rounded-xl overflow-hidden">
          <!-- 아코디언 헤더 -->
          <button class="lesson-part-accordion-header w-full px-4 py-3 sm:py-4 flex items-center justify-between gap-3 bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer" data-part-id="${part.id}">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <span class="material-symbols-outlined text-[20px] sm:text-[24px] text-primary flex-shrink-0">play_circle</span>
              <div class="text-left min-w-0">
                <p class="font-headline-sm text-headline-sm text-on-surface font-bold text-sm sm:text-base truncate">${part.partName}</p>
                <p class="font-label-sm text-label-sm text-on-surface-variant text-xs sm:text-sm">⏱️ ${part.duration}분</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-[20px] text-on-surface-variant flex-shrink-0 transition-transform accordion-icon">expand_more</span>
          </button>

          <!-- 아코디언 바디 -->
          <div class="lesson-part-accordion-body hidden border-t border-surface-container">
            <div class="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6">
              <!-- 영상 -->
              ${part.youtubeId ? `
                <div class="bg-primary/10 rounded-xl sm:rounded-2xl overflow-hidden w-full">
                  ${part.isShorts === true ? `
                    <!-- YouTube Shorts: 9:16 비율 (아코디언에서는 제한된 크기) -->
                    <div style="position: relative; width: 100%; aspect-ratio: 9/16; max-width: 300px; margin: 0 auto; background: #000;">
                      <iframe
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                        src="https://www.youtube.com/embed/${part.youtubeId}?playsinline=1&rel=0&modestbranding=1&fs=0&cc_load_policy=0&loop=0"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
                        allowfullscreen
                        class="rounded-xl sm:rounded-2xl">
                      </iframe>
                    </div>
                  ` : `
                    <!-- 일반 YouTube: 16:9 비율 -->
                    <div style="position: relative; width: 100%; padding-bottom: 56.25%;">
                      <iframe
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                        src="https://www.youtube.com/embed/${part.youtubeId}?fs=1&rel=0&modestbranding=1&cc_load_policy=0&loop=0"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
                        allowfullscreen
                        class="rounded-xl sm:rounded-2xl">
                      </iframe>
                    </div>
                  `}
                </div>
              ` : `
                <div class="bg-surface-container rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                  <span class="material-symbols-outlined text-[40px] text-on-surface-variant">video_library</span>
                  <p class="font-body-sm text-on-surface-variant mt-2">영상이 준비되지 않았습니다</p>
                </div>
              `}

              <!-- 설명 -->
              ${part.description ? `<p class="font-body-sm text-body-sm text-on-surface-variant text-xs sm:text-sm whitespace-pre-line">${part.description}</p>` : ''}
            </div>
          </div>
        </div>
      `).join('')
    : '<div class="flex items-center justify-center py-12 text-on-surface-variant">아직 준비 중인 강의입니다</div>';

  return `
    <div id="modal-lesson-detail" class="fixed inset-0 z-[200] hidden flex items-center justify-center p-2 sm:p-4">
      <div class="absolute inset-0 bg-primary/40 backdrop-blur-sm" id="modal-lesson-overlay"></div>
      <div class="relative w-full max-w-4xl bg-surface-container-lowest rounded-2xl sm:rounded-3xl shadow-xl border border-surface-container p-3 sm:p-6 flex flex-col gap-3 sm:gap-4 max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <!-- 헤더 -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <h2 class="font-headline-md text-headline-md text-on-surface font-bold text-base sm:text-lg line-clamp-2">차시 ${lesson.lessonNumber} - ${lesson.title}</h2>
            <p class="font-body-sm text-on-surface-variant mt-1 text-xs sm:text-sm line-clamp-2">${lesson.goal}</p>
          </div>
          <button class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-surface-container-high flex-shrink-0" id="btn-close-lesson-modal">
            <span class="material-symbols-outlined text-[18px] sm:text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>

        <!-- 수업 정보 -->
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 text-on-surface-variant font-label-sm text-label-sm text-xs sm:text-sm overflow-x-hidden">
          <div class="flex items-center gap-1 whitespace-nowrap">
            <span class="material-symbols-outlined text-[16px] flex-shrink-0">school</span>
            <span class="truncate">배울 글자: ${lesson.learnLetters}</span>
          </div>
          <div class="flex items-center gap-1 whitespace-nowrap">
            <span class="material-symbols-outlined text-[16px] flex-shrink-0">timer</span>
            <span>총 ${parts.reduce((sum, p) => sum + (p.duration || 0), 0)}분</span>
          </div>
        </div>

        <!-- 파트 아코디언 -->
        <div class="flex flex-col gap-2 sm:gap-3 w-full overflow-x-hidden">
          ${partAccordion}
        </div>
      </div>
    </div>
  `;
}

/**
 * 파트 상세 전체화면 모달
 */
export function renderPartDetailModal(part) {
  return `
    <div id="modal-part-detail" class="fixed inset-0 z-[9999] hidden bg-black flex flex-col">
      <!-- 헤더 -->
      <div class="flex items-center justify-between gap-2 bg-black/90 backdrop-blur-sm p-2 sm:p-4 z-10">
        <h2 class="font-headline-md text-headline-md text-on-surface font-bold text-base sm:text-lg flex-1 line-clamp-2">${part.partName}</h2>
        <button class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-surface-container-high flex-shrink-0" id="btn-close-part-detail-modal">
          <span class="material-symbols-outlined text-[18px] sm:text-[20px] text-on-surface-variant">close</span>
        </button>
      </div>

      <!-- 영상 컨테이너 -->
      <div class="flex-1 w-full h-full flex items-center justify-center bg-black overflow-hidden">
        ${part.youtubeId ? `
          <div id="playerWrap" data-video-id="${part.youtubeId}" data-is-shorts="${part.isShorts === true}">
            <div id="ytPlayer"></div>
            <button id="fsBtn" class="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 text-white rounded-lg p-2 transition-all cursor-pointer block md:hidden" title="전체화면">
              <span class="material-symbols-outlined text-[24px]">fullscreen</span>
            </button>
          </div>
        ` : `
          <div class="text-center text-on-surface-variant">
            <span class="material-symbols-outlined text-[48px]">video_library</span>
            <p class="mt-4">영상이 준비되지 않았습니다</p>
          </div>
        `}
      </div>

      <style>
        #playerWrap {
          width: 100%;
          height: 100%;
          aspect-ratio: 9/16;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #000;
          overflow: hidden;
          position: relative;
          max-width: 100%;
          max-height: 100%;
        }

        #playerWrap #ytPlayer,
        #playerWrap iframe {
          width: 100%;
          height: 100%;
          aspect-ratio: 9/16;
          border: none;
          display: block;
        }

        /* 전체화면 모드 */
        #playerWrap:fullscreen,
        #playerWrap.pseudo-fs {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          aspect-ratio: auto;
          z-index: 99999;
          background-color: #000;
        }

        #playerWrap:fullscreen #ytPlayer,
        #playerWrap.pseudo-fs #ytPlayer,
        #playerWrap:fullscreen iframe,
        #playerWrap.pseudo-fs iframe {
          width: auto;
          height: 100dvh;
          aspect-ratio: 9/16;
          max-width: 100vw;
        }

        #playerWrap #fsBtn {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 20;
        }

        #playerWrap:fullscreen #fsBtn,
        #playerWrap.pseudo-fs #fsBtn {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 100000;
        }

        body.focus-shorts {
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
          top: 0 !important;
          left: 0 !important;
        }

        body.focus-shorts header,
        body.focus-shorts nav,
        body.focus-shorts footer,
        body.focus-shorts #bottom-nav {
          display: none !important;
        }
      </style>
    </div>
  `;
}
