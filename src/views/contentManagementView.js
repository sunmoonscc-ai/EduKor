/**
 * contentManagementView.js - 교육콘텐츠 관리 페이지
 */

import { t } from '../i18n.js';

export function renderContentManagementView() {
  return `
    <div class="flex flex-col w-full gap-6 p-6">
      <!-- 헤더 -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-headline-md text-headline-md text-on-surface font-bold">교육 콘텐츠 관리</h1>
          <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">강의와 차시를 등록하고 관리하세요</p>
        </div>
        <button id="btn-new-course" class="px-5 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md font-bold flex items-center gap-2 hover:bg-secondary/90 cursor-pointer transition-colors">
          <span class="material-symbols-outlined text-[18px]">add</span>
          <span>새 강의</span>
        </button>
      </div>

      <!-- 탭 -->
      <div class="flex gap-2 border-b border-surface-container">
        <button class="content-tab px-4 py-3 font-label-md text-label-md border-b-2 border-secondary text-secondary cursor-pointer" data-tab="courses">
          강의 목록
        </button>
        <button class="content-tab px-4 py-3 font-label-md text-label-md border-b-2 border-transparent text-on-surface-variant cursor-pointer hover:text-on-surface" data-tab="lessons">
          차시 관리
        </button>
      </div>

      <!-- 강의 목록 탭 -->
      <div id="courses-tab" class="content-tab-panel">
        <div id="courses-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center justify-center h-40 rounded-2xl bg-surface-container-low text-on-surface-variant">
            <span class="material-symbols-outlined text-[40px] text-on-surface-variant/50 mr-2">hourglass_empty</span>
            <span>강의 목록 로드 중...</span>
          </div>
        </div>
      </div>

      <!-- 차시 관리 탭 -->
      <div id="lessons-tab" class="content-tab-panel hidden">
        <div id="lessons-content" class="flex flex-col items-center justify-center py-20 gap-3">
          <span class="material-symbols-outlined text-[48px] text-on-surface-variant">library_books</span>
          <p class="font-headline-md text-headline-md text-on-surface font-bold">강의를 선택해주세요</p>
          <p class="font-body-md text-on-surface-variant">왼쪽의 강의를 클릭하면 차시를 관리할 수 있습니다</p>
        </div>
      </div>
    </div>

    <!-- 강의 생성/수정 모달 -->
    <div id="modal-course-form" class="fixed inset-0 z-[100] hidden flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-primary/40 backdrop-blur-sm" id="modal-course-overlay"></div>
      <div class="relative w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-xl border border-surface-container p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between">
          <h2 class="font-headline-md text-headline-md text-on-surface font-bold" id="modal-course-title">새 강의 만들기</h2>
          <button class="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-surface-container-high" id="btn-close-course-modal">
            <span class="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>

        <form id="form-course" class="flex flex-col gap-4">
          <!-- 강의명 -->
          <div>
            <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">강의명 *</label>
            <input type="text" id="input-course-title" placeholder="예: 한글 자음과 모음" class="w-full h-12 px-4 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant outline-none focus:border-secondary transition-colors" required>
          </div>

          <!-- 강의 설명 -->
          <div>
            <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">강의 설명 *</label>
            <textarea id="input-course-description" placeholder="강의에 대한 설명을 입력하세요" class="w-full h-24 px-4 py-3 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant outline-none focus:border-secondary transition-colors resize-none" required></textarea>
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
            <input type="number" id="input-course-lessons" placeholder="10" min="1" max="50" class="w-full h-12 px-4 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant outline-none focus:border-secondary transition-colors" required>
          </div>

          <!-- 강사명 -->
          <div>
            <label class="font-label-md text-label-md text-on-surface font-bold mb-2 block">강사명</label>
            <input type="text" id="input-course-instructor" placeholder="강사명을 입력하세요" class="w-full h-12 px-4 rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md placeholder:text-on-surface-variant outline-none focus:border-secondary transition-colors">
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
  `;
}
