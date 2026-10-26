/**
 * contentManagementView.js - 교육콘텐츠 관리 페이지
 */

import { t } from '../i18n.js';

export function renderContentManagementView() {
  return `
    <div class="flex flex-col w-full gap-4 sm:gap-6 p-3 sm:p-6 overflow-x-hidden">
      <!-- 헤더 -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div class="min-w-0">
          <h1 class="font-headline-md text-headline-md text-on-surface font-bold text-base sm:text-lg">교육 콘텐츠 관리</h1>
          <p class="font-body-sm text-body-sm text-on-surface-variant mt-1 text-xs sm:text-sm">강의와 차시를 등록하고 관리하세요</p>
        </div>
        <button id="btn-new-course" class="w-full sm:w-auto px-3 sm:px-5 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold flex items-center justify-center sm:justify-start gap-2 hover:bg-secondary/90 cursor-pointer transition-colors text-sm">
          <span class="material-symbols-outlined text-[18px]">add</span>
          <span>새 강의</span>
        </button>
      </div>

      <!-- 탭 -->
      <div class="flex gap-2 border-b border-surface-container overflow-x-auto -mx-3 sm:-mx-6 px-3 sm:px-6">
        <button class="content-tab px-3 sm:px-4 py-2 sm:py-3 font-label-md text-label-md border-b-2 border-secondary text-secondary cursor-pointer text-sm whitespace-nowrap" data-tab="courses">
          강의 목록
        </button>
        <button class="content-tab px-3 sm:px-4 py-2 sm:py-3 font-label-md text-label-md border-b-2 border-transparent text-on-surface-variant cursor-pointer hover:text-on-surface text-sm whitespace-nowrap" data-tab="lessons">
          차시 관리
        </button>
      </div>

      <!-- 강의 목록 탭 -->
      <div id="courses-tab" class="content-tab-panel">
        <div id="courses-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 overflow-x-hidden">
          <div class="flex items-center justify-center h-40 rounded-2xl bg-surface-container-low text-on-surface-variant">
            <span class="material-symbols-outlined text-[40px] text-on-surface-variant/50 mr-2">hourglass_empty</span>
            <span>강의 목록 로드 중...</span>
          </div>
        </div>
      </div>

      <!-- 차시 관리 탭 -->
      <div id="lessons-tab" class="content-tab-panel hidden">
        <div class="flex flex-col gap-3 sm:gap-4 overflow-x-hidden">
          <!-- 강의 선택 -->
          <div class="flex flex-col sm:flex-row gap-2 w-full">
            <select id="select-course-for-lessons" class="flex-1 h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md outline-none focus:border-secondary transition-colors text-sm">
              <option value="">강의를 선택하세요</option>
            </select>
            <button id="btn-new-lesson" class="w-full sm:w-auto px-3 sm:px-5 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold flex items-center justify-center sm:justify-start gap-2 hover:bg-secondary/90 cursor-pointer transition-colors text-sm flex-shrink-0">
              <span class="material-symbols-outlined text-[18px]">add</span>
              <span>새 차시</span>
            </button>
          </div>

          <!-- 차시 목록 -->
          <div id="lessons-list-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-x-hidden">
            <div class="flex items-center justify-center h-32 rounded-2xl bg-surface-container-low text-on-surface-variant">
              <span class="material-symbols-outlined text-[24px] mr-2">hourglass_empty</span>
              <span>강의를 먼저 선택해주세요</span>
            </div>
          </div>

          <!-- 파트 관리 폼 (차시 선택 후) -->
          <div id="parts-management-section" class="hidden mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-surface-container">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold text-sm sm:text-base">파트 관리 (차시: <span id="selected-lesson-title" class="line-clamp-1">미선택</span>)</h3>
              <button id="btn-new-part" class="w-full sm:w-auto px-3 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center justify-center sm:justify-start gap-1 hover:bg-primary/90 cursor-pointer transition-colors text-sm flex-shrink-0">
                <span class="material-symbols-outlined text-[16px]">add</span>
                <span>파트 추가</span>
              </button>
            </div>

            <!-- 파트 목록 -->
            <div id="parts-list" class="grid grid-cols-1 gap-2 mb-4 sm:mb-6 overflow-x-hidden">
              <div class="text-center py-8 text-on-surface-variant text-sm">파트가 없습니다</div>
            </div>

            <!-- 파트 폼 (추가/수정) -->
            <form id="form-part" class="hidden bg-surface-container-low rounded-2xl p-3 sm:p-4 gap-3 sm:gap-4 flex flex-col mt-4">
              <div>
                <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">파트 유형 *</label>
                <select id="input-part-type" class="w-full h-10 px-3 rounded-lg border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md outline-none focus:border-primary transition-colors text-sm" required>
                  <option value="">선택하세요</option>
                  <option value="opening">열기 (Opening)</option>
                  <option value="listening">듣고 따라하기 (Listening)</option>
                  <option value="shape">모양 외우기 (Shape)</option>
                  <option value="writing">쓰고 만들기 (Writing)</option>
                  <option value="quiz">단어 게임 + 퀴즈 (Quiz)</option>
                  <option value="homework">숙제 (Homework)</option>
                </select>
              </div>

              <div>
                <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">파트 이름 *</label>
                <input type="text" id="input-part-name" placeholder="예: 한글 발음 연습" class="w-full h-10 px-3 rounded-lg border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant/60 outline-none focus:border-primary transition-colors text-sm" required>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">YouTube URL 또는 ID *</label>
                  <input type="text" id="input-part-youtube-id" placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ 또는 dQw4w9WgXcQ" class="w-full h-10 px-3 rounded-lg border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant/60 outline-none focus:border-primary transition-colors text-sm" required>
                </div>
                <div>
                  <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">소요 시간 (분) *</label>
                  <input type="number" id="input-part-duration" placeholder="5" min="1" max="120" class="w-full h-10 px-3 rounded-lg border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant/60 outline-none focus:border-primary transition-colors text-sm" required>
                </div>
              </div>

              <div>
                <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">설명</label>
                <textarea id="input-part-description" placeholder="이 파트에 대한 설명" class="w-full h-16 px-3 py-2 rounded-lg border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant/60 outline-none focus:border-primary transition-colors resize-none text-sm"></textarea>
              </div>

              <div class="flex gap-2 justify-end">
                <button type="button" id="btn-cancel-part" class="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-bold cursor-pointer hover:bg-surface-container-high transition-colors text-sm">
                  취소
                </button>
                <button type="submit" class="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold cursor-pointer hover:bg-primary/90 transition-colors text-sm">
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- 강의 생성/수정 모달 -->
    <div id="modal-course-form" class="fixed inset-0 z-[100] hidden flex items-center justify-center p-2 sm:p-4">
      <div class="absolute inset-0 bg-primary/40 backdrop-blur-sm" id="modal-course-overlay"></div>
      <div class="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl sm:rounded-3xl shadow-xl border border-surface-container p-3 sm:p-6 flex flex-col gap-3 sm:gap-4 max-h-[85vh] overflow-y-auto overflow-x-hidden">
        <div class="flex items-center justify-between gap-2">
          <h2 class="font-headline-md text-headline-md text-on-surface font-bold text-base sm:text-lg" id="modal-course-title">새 강의 만들기</h2>
          <button class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-surface-container-high flex-shrink-0" id="btn-close-course-modal">
            <span class="material-symbols-outlined text-[18px] sm:text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>

        <form id="form-course" class="flex flex-col gap-3 sm:gap-4">
          <!-- 강의명 -->
          <div>
            <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">강의명 *</label>
            <input type="text" id="input-course-title" placeholder="예: 한글 자음과 모음" class="w-full h-12 px-4 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant/60 outline-none focus:border-secondary transition-colors" required>
          </div>

          <!-- 강의 설명 -->
          <div>
            <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">강의 설명 *</label>
            <textarea id="input-course-description" placeholder="강의에 대한 설명을 입력하세요" class="w-full h-24 px-4 py-3 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant/60 outline-none focus:border-secondary transition-colors resize-none" required></textarea>
          </div>

          <!-- 대상 수준 -->
          <div>
            <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">대상 수준 *</label>
            <select id="input-course-level" class="w-full h-12 px-4 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md outline-none focus:border-secondary transition-colors" required>
              <option value="">선택하세요</option>
              <option value="초급">초급</option>
              <option value="중급">중급</option>
              <option value="고급">고급</option>
            </select>
          </div>

          <!-- 총 차시 -->
          <div>
            <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">총 차시 *</label>
            <input type="number" id="input-course-lessons" placeholder="10" min="1" max="50" class="w-full h-12 px-4 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant/60 outline-none focus:border-secondary transition-colors" required>
          </div>

          <!-- 강사명 -->
          <div>
            <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">강사명</label>
            <input type="text" id="input-course-instructor" placeholder="강사명을 입력하세요" class="w-full h-12 px-4 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant/60 outline-none focus:border-secondary transition-colors">
          </div>

          <!-- 버튼 -->
          <div class="flex gap-3 mt-4">
            <button type="button" class="flex-1 h-12 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-bold cursor-pointer hover:bg-surface-container-high transition-colors" id="btn-cancel-course">
              취소
            </button>
            <button type="submit" class="flex-1 h-12 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold cursor-pointer hover:bg-secondary/90 transition-colors">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 차시 생성/수정 모달 -->
    <div id="modal-lesson-form" class="fixed inset-0 z-[100] hidden flex items-center justify-center p-2 sm:p-4">
      <div class="absolute inset-0 bg-primary/40 backdrop-blur-sm" id="modal-lesson-overlay"></div>
      <div class="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl sm:rounded-3xl shadow-xl border border-surface-container p-3 sm:p-6 flex flex-col gap-3 sm:gap-4 max-h-[85vh] overflow-y-auto overflow-x-hidden">
        <div class="flex items-center justify-between gap-2">
          <h2 class="font-headline-md text-headline-md text-on-surface font-bold text-base sm:text-lg" id="modal-lesson-title">새 차시 만들기</h2>
          <button class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-surface-container-high flex-shrink-0" id="btn-close-lesson-modal">
            <span class="material-symbols-outlined text-[18px] sm:text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>

        <form id="form-lesson" class="flex flex-col gap-3 sm:gap-4">
          <!-- 차시 번호 -->
          <div>
            <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">차시 번호 *</label>
            <input type="number" id="input-lesson-number" placeholder="1" min="1" max="100" class="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant/60 outline-none focus:border-secondary transition-colors text-sm" required>
          </div>

          <!-- 차시 제목 -->
          <div>
            <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">차시 제목 *</label>
            <input type="text" id="input-lesson-title" placeholder="예: 한글의 기초: 모음" class="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant/60 outline-none focus:border-secondary transition-colors text-sm" required>
          </div>

          <!-- 수업 목표 -->
          <div>
            <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">수업 목표 *</label>
            <textarea id="input-lesson-goal" placeholder="모음 6개를 듣고, 말하고, 쓸 수 있어요. / I can hear, say, and write 6 vowels." class="w-full h-20 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant/60 outline-none focus:border-secondary transition-colors resize-none text-sm" required></textarea>
          </div>

          <!-- 배울 글자 -->
          <div>
            <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">배울 글자 *</label>
            <input type="text" id="input-lesson-letters" placeholder="ㅏ ㅓ ㅗ ㅜ ㅡ ㅣ (+ 소리 없는 ㅇ)" class="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant/60 outline-none focus:border-secondary transition-colors text-sm" required>
          </div>

          <!-- 버튼 -->
          <div class="flex gap-2 sm:gap-3 mt-2 sm:mt-4">
            <button type="button" class="flex-1 h-10 sm:h-12 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-bold cursor-pointer hover:bg-surface-container-high transition-colors text-sm" id="btn-cancel-lesson">
              취소
            </button>
            <button type="submit" class="flex-1 h-10 sm:h-12 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold cursor-pointer hover:bg-secondary/90 transition-colors text-sm">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
