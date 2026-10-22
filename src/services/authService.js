import {
  auth,
  db,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from '../firebase.js';

// 관리자 이메일 목록
const ADMIN_EMAILS = [
  'hdcc6th@gmail.com',
  'sunmoon.scc@gmail.com'
];

// Google Provider 설정
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Google 로그인
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const isAdmin = ADMIN_EMAILS.includes(user.email);
    let isNewUser = false;

    console.log('🔐 Firebase Auth 성공:', {
      uid: user.uid,
      email: user.email,
      name: user.displayName
    });

    // Firestore에 사용자 정보 저장/업데이트 (Firestore가 사용 가능한 경우)
    if (db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // 새로운 사용자
          isNewUser = true;
          const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || '',
            photoUrl: user.photoURL || '',
            role: isAdmin ? 'admin' : 'user',
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp()
          };

          await setDoc(userRef, userData);
          console.log('✅ 새 회원 가입 완료:', {
            email: user.email,
            role: isAdmin ? '관리자' : '일반 사용자',
            uid: user.uid
          });
        } else {
          // 기존 사용자 - 마지막 로그인 시간 업데이트
          isNewUser = false;
          await setDoc(userRef, {
            lastLoginAt: serverTimestamp()
          }, { merge: true });
          console.log('✅ 기존 사용자 로그인:', {
            email: user.email,
            role: isAdmin ? '관리자' : '일반 사용자'
          });
        }
      } catch (firestoreError) {
        console.error('❌ Firestore 저장 오류:', {
          code: firestoreError.code,
          message: firestoreError.message,
          email: user.email
        });
        // Firestore 오류는 무시하고 계속 진행 - isNewUser는 그대로 유지
      }
    } else {
      console.warn('⚠️ Firestore DB 미초기화 - 로컬 모드 실행');
    }

    return {
      success: true,
      isNewUser: isNewUser,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoUrl: user.photoURL,
        role: isAdmin ? 'admin' : 'user'
      }
    };
  } catch (error) {
    console.error('❌ 로그인 오류:', {
      code: error.code,
      message: error.message
    });
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 로그아웃
 */
export async function logout() {
  try {
    await signOut(auth);
    console.log('✅ 로그아웃 완료');
    return { success: true };
  } catch (error) {
    console.error('❌ 로그아웃 오류:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 현재 사용자 정보 가져오기
 */
export async function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          let role = 'user';

          // Firestore에서 역할 정보 가져오기 시도
          if (db) {
            try {
              const userRef = doc(db, 'users', user.uid);
              const userSnap = await getDoc(userRef);
              const userData = userSnap.data();
              role = userData?.role || (ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user');
            } catch (firestoreError) {
              // Firestore 오류 시 이메일 기반으로 역할 판단
              role = ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user';
            }
          } else {
            // DB가 없으면 이메일 기반으로 역할 판단
            role = ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user';
          }

          resolve({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photoUrl: user.photoURL,
            role: role
          });
        } catch (error) {
          console.error('사용자 정보 조회 오류:', error);
          resolve(null);
        }
      } else {
        resolve(null);
      }
      unsubscribe();
    });
  });
}

/**
 * 관리자인지 확인
 */
export function isAdminEmail(email) {
  return ADMIN_EMAILS.includes(email);
}

/**
 * 인증 상태 변화 감지
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        let role = 'user';

        // Firestore에서 역할 정보 가져오기 시도
        if (db) {
          try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            role = userData?.role || (ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user');
          } catch (firestoreError) {
            // Firestore 오류 시 이메일 기반으로 역할 판단
            role = ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user';
          }
        } else {
          // DB가 없으면 이메일 기반으로 역할 판단
          role = ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user';
        }

        callback({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoUrl: user.photoURL,
          role: role
        });
      } catch (error) {
        console.error('사용자 정보 조회 오류:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}

