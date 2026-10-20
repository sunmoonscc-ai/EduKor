import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { SEED_COURSES, SEED_REVIEWS } from './seedData.js';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

async function seed() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('❌ Error: VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID must be set in .env');
    process.exit(1);
  }

  console.log(`🔥 Initializing Firebase for project: ${firebaseConfig.projectId}...`);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log(`📦 Seeding ${SEED_COURSES.length} courses into Firestore...`);
  for (const course of SEED_COURSES) {
    const courseRef = doc(collection(db, 'courses'), course.id);
    await setDoc(courseRef, course, { merge: true });
    console.log(`  ✓ Seeded course: ${course.title}`);
  }

  console.log(`💬 Seeding ${SEED_REVIEWS.length} reviews into Firestore...`);
  for (const review of SEED_REVIEWS) {
    const reviewRef = doc(collection(db, 'reviews'), review.id);
    await setDoc(reviewRef, review, { merge: true });
    console.log(`  ✓ Seeded review from: ${review.author}`);
  }

  console.log('\n🎉 Successfully seeded Firestore database!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Fatal seeding error:', err);
  process.exit(1);
});
