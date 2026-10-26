import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'koredu-ae7a8',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || ''
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkData() {
  try {
    const coursesSnap = await getDocs(collection(db, 'teaching_courses'));
    console.log(`\n✅ teaching_courses 컬렉션에 ${coursesSnap.size}개의 강의가 있습니다:\n`);
    
    coursesSnap.forEach(doc => {
      console.log(`📖 강의 ID: ${doc.id}`);
      console.log(`   제목: ${doc.data().title}`);
      console.log(`   설명: ${doc.data().description}`);
      console.log(`   대상: ${doc.data().level}`);
      console.log(`   차시: ${doc.data().totalLessons}`);
      console.log(`   강사: ${doc.data().instructor}`);
      console.log('---');
    });
  } catch (error) {
    console.error('❌ 데이터 조회 실패:', error.message);
  }
  process.exit(0);
}

checkData();
