/**
 * invitationService.js — 사용자 초대 기능
 */
import { db, collection, addDoc, serverTimestamp } from '../firebase.js';

// 초대 코드 생성 (16자리 무작위 문자열)
function generateInvitationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 16; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 초대 URL 생성
function generateInvitationUrl(invitationCode) {
  // Firebase 배포 URL 사용 (로컬 개발 시에는 배포된 URL로 지정)
  const baseUrl = 'https://koredu-ae7a8.web.app';
  return `${baseUrl}?invitationCode=${invitationCode}`;
}

// 초대 메시지 생성 (복사할 형식)
function generateInvitationMessage(invitationUrl) {
  return `한국어교육 프로그램 한누리에 초대합니다.\n다음 주소를 클릭하세요.\n\n${invitationUrl}`;
}

// 초대 코드를 Firestore에 저장
export async function createInvitation() {
  try {
    const invitationCode = generateInvitationCode();
    const invitationUrl = generateInvitationUrl(invitationCode);
    const invitationMessage = generateInvitationMessage(invitationUrl);

    // Firestore에 초대 코드 저장
    if (db) {
      await addDoc(collection(db, 'invitations'), {
        code: invitationCode,
        createdAt: serverTimestamp(),
        used: false,
        usedBy: null,
        usedAt: null
      });
      console.log('✅ 초대 코드가 생성되었습니다:', invitationCode);
    }

    return {
      code: invitationCode,
      url: invitationUrl,
      message: invitationMessage
    };
  } catch (error) {
    console.error('❌ 초대 코드 생성 오류:', error);
    throw error;
  }
}

// 클립보드에 텍스트 복사
export async function copyToClipboard(text) {
  try {
    // 최신 Clipboard API 사용
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      console.log('✅ 클립보드에 복사됨');
      return true;
    } else {
      // 폴백: textarea를 사용한 복사
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (result) {
        console.log('✅ 클립보드에 복사됨 (폴백)');
      }
      return result;
    }
  } catch (error) {
    console.error('❌ 클립보드 복사 오류:', error);
    return false;
  }
}
