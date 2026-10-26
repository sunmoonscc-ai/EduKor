import {
  db,
  isFirebaseConfigured,
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp
} from '../firebase.js';
import { SEED_COURSES, SEED_REVIEWS } from './seedData.js';

const COURSES_COLLECTION = 'courses';
const CONSULTATIONS_COLLECTION = 'consultations';
const LEVEL_TESTS_COLLECTION = 'level_tests';

/**
 * Fetch all available courses, optionally filtered by category
 */
export async function getCourses(category = 'all') {
  if (isFirebaseConfigured && db) {
    try {
      const coursesCol = collection(db, COURSES_COLLECTION);
      const snapshot = await getDocs(coursesCol);
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (category === 'all') return list;
        return list.filter(c => c.category === category);
      }
    } catch (err) {
      console.warn('Firestore fetch failed, falling back to seed data:', err);
    }
  }

  // Fallback to rich seed data
  if (category === 'all') {
    return SEED_COURSES;
  }
  return SEED_COURSES.filter(c => c.category === category);
}

/**
 * Fetch reviews
 */
export async function getReviews() {
  return SEED_REVIEWS;
}

/**
 * Submit a 1:1 Consultation request
 */
export async function submitConsultation(data) {
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  if (isFirebaseConfigured && db) {
    try {
      const col = collection(db, CONSULTATIONS_COLLECTION);
      const docRef = await addDoc(col, {
        ...payload,
        timestamp: serverTimestamp()
      });
      return { success: true, id: docRef.id, message: '상담 신청이 정상 접수되었습니다.' };
    } catch (err) {
      console.error('Failed to submit consultation to Firestore:', err);
    }
  }

  // Local fallback persistence
  const saved = JSON.parse(localStorage.getItem('koredu_consultations') || '[]');
  saved.push(payload);
  localStorage.setItem('koredu_consultations', JSON.stringify(saved));

  return { success: true, id: `local-${Date.now()}`, message: '상담 신청이 완료되었습니다 (로컬 저장됨).' };
}

/**
 * Submit Level Test Result
 */
export async function submitLevelTest(resultData) {
  const payload = {
    ...resultData,
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const col = collection(db, LEVEL_TESTS_COLLECTION);
      const docRef = await addDoc(col, {
        ...payload,
        timestamp: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Failed to submit level test to Firestore:', err);
    }
  }

  const saved = JSON.parse(localStorage.getItem('koredu_level_tests') || '[]');
  saved.push(payload);
  localStorage.setItem('koredu_level_tests', JSON.stringify(saved));

  return { success: true, id: `local-${Date.now()}` };
}

// ── 교육콘텐츠 관리 (Teaching Content Management) ────────────────────────────────

const TEACHING_COURSES_COLLECTION = 'teaching_courses';
const TEACHING_LESSONS_COLLECTION = 'teaching_lessons';

/**
 * 교육 강의 생성
 */
export async function createTeachingCourse(courseData) {
  if (!isFirebaseConfigured || !db) {
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    const docRef = await addDoc(collection(db, TEACHING_COURSES_COLLECTION), {
      ...courseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ 교육 강의 생성됨:', docRef.id);
    return { success: true, courseId: docRef.id };
  } catch (error) {
    console.error('❌ 교육 강의 생성 실패:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 모든 교육 강의 조회
 */
export async function getAllTeachingCourses() {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const q = query(
      collection(db, TEACHING_COURSES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ 교육 강의 조회 실패:', error);
    return [];
  }
}

/**
 * 특정 교육 강의 조회
 */
export async function getTeachingCourseById(courseId) {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  try {
    const docRef = doc(db, TEACHING_COURSES_COLLECTION, courseId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('❌ 교육 강의 조회 실패:', error);
    return null;
  }
}

/**
 * 교육 강의 수정
 */
export async function updateTeachingCourse(courseId, updateData) {
  if (!isFirebaseConfigured || !db) {
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    const docRef = doc(db, TEACHING_COURSES_COLLECTION, courseId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    console.log('✅ 교육 강의 수정됨:', courseId);
    return { success: true };
  } catch (error) {
    console.error('❌ 교육 강의 수정 실패:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 교육 강의 삭제
 */
export async function deleteTeachingCourse(courseId) {
  if (!isFirebaseConfigured || !db) {
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    // 관련 차시 삭제
    const lessonsQuery = query(
      collection(db, TEACHING_LESSONS_COLLECTION),
      where('courseId', '==', courseId)
    );
    const lessonsSnapshot = await getDocs(lessonsQuery);
    for (const lessonDoc of lessonsSnapshot.docs) {
      await deleteDoc(lessonDoc.ref);
    }

    // 강의 삭제
    const docRef = doc(db, TEACHING_COURSES_COLLECTION, courseId);
    await deleteDoc(docRef);
    console.log('✅ 교육 강의 삭제됨:', courseId);
    return { success: true };
  } catch (error) {
    console.error('❌ 교육 강의 삭제 실패:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 교육 차시 생성
 */
export async function createTeachingLesson(lessonData) {
  if (!isFirebaseConfigured || !db) {
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    const docRef = await addDoc(collection(db, TEACHING_LESSONS_COLLECTION), {
      ...lessonData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ 교육 차시 생성됨:', docRef.id);
    return { success: true, lessonId: docRef.id };
  } catch (error) {
    console.error('❌ 교육 차시 생성 실패:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 강의의 모든 교육 차시 조회
 */
export async function getTeachingLessonsByCourseId(courseId) {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const q = query(
      collection(db, TEACHING_LESSONS_COLLECTION),
      where('courseId', '==', courseId),
      orderBy('lessonNumber', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ 교육 차시 조회 실패:', error);
    return [];
  }
}

/**
 * 특정 교육 차시 조회
 */
export async function getTeachingLessonById(lessonId) {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  try {
    const docRef = doc(db, TEACHING_LESSONS_COLLECTION, lessonId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('❌ 교육 차시 조회 실패:', error);
    return null;
  }
}

/**
 * 교육 차시 수정
 */
export async function updateTeachingLesson(lessonId, updateData) {
  if (!isFirebaseConfigured || !db) {
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    const docRef = doc(db, TEACHING_LESSONS_COLLECTION, lessonId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    console.log('✅ 교육 차시 수정됨:', lessonId);
    return { success: true };
  } catch (error) {
    console.error('❌ 교육 차시 수정 실패:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 교육 차시 삭제
 */
export async function deleteTeachingLesson(lessonId) {
  if (!isFirebaseConfigured || !db) {
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    // 관련 파트 삭제
    const partsQuery = query(
      collection(db, TEACHING_LESSON_PARTS_COLLECTION),
      where('lessonId', '==', lessonId)
    );
    const partsSnapshot = await getDocs(partsQuery);
    for (const partDoc of partsSnapshot.docs) {
      await deleteDoc(partDoc.ref);
    }

    // 차시 삭제
    const docRef = doc(db, TEACHING_LESSONS_COLLECTION, lessonId);
    await deleteDoc(docRef);
    console.log('✅ 교육 차시 삭제됨:', lessonId);
    return { success: true };
  } catch (error) {
    console.error('❌ 교육 차시 삭제 실패:', error);
    return { success: false, error: error.message };
  }
}

// ── 차시별 파트 관리 (Lesson Parts Management) ────────────────────────────────

const TEACHING_LESSON_PARTS_COLLECTION = 'teaching_lesson_parts';

/**
 * 차시 파트 생성 (열기, 듣고따라, 모양, 쓰기, 퀴즈, 숙제 등)
 */
export async function createLessonPart(partData) {
  if (!isFirebaseConfigured || !db) {
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    const docRef = await addDoc(collection(db, TEACHING_LESSON_PARTS_COLLECTION), {
      ...partData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('✅ 차시 파트 생성됨:', docRef.id);
    return { success: true, partId: docRef.id };
  } catch (error) {
    console.error('❌ 차시 파트 생성 실패:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 특정 차시의 모든 파트 조회
 */
export async function getLessonParts(lessonId) {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const q = query(
      collection(db, TEACHING_LESSON_PARTS_COLLECTION),
      where('lessonId', '==', lessonId),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ 차시 파트 조회 실패:', error);
    return [];
  }
}

/**
 * 특정 파트 조회
 */
export async function getLessonPartById(partId) {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  try {
    const docRef = doc(db, TEACHING_LESSON_PARTS_COLLECTION, partId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('❌ 차시 파트 조회 실패:', error);
    return null;
  }
}

/**
 * 차시 파트 수정
 */
export async function updateLessonPart(partId, updateData) {
  if (!isFirebaseConfigured || !db) {
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    const docRef = doc(db, TEACHING_LESSON_PARTS_COLLECTION, partId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    console.log('✅ 차시 파트 수정됨:', partId);
    return { success: true };
  } catch (error) {
    console.error('❌ 차시 파트 수정 실패:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 차시 파트 삭제
 */
export async function deleteLessonPart(partId) {
  if (!isFirebaseConfigured || !db) {
    return { success: false, error: 'Firebase not configured' };
  }

  try {
    const docRef = doc(db, TEACHING_LESSON_PARTS_COLLECTION, partId);
    await deleteDoc(docRef);
    console.log('✅ 차시 파트 삭제됨:', partId);
    return { success: true };
  } catch (error) {
    console.error('❌ 차시 파트 삭제 실패:', error);
    return { success: false, error: error.message };
  }
}
