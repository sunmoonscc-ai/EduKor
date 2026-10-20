import { 
  db, 
  isFirebaseConfigured, 
  collection, 
  getDocs, 
  addDoc, 
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
