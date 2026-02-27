// ====================================================
// Firebase 설정 - 미설정 시 로컬 모드로 자동 동작
// ====================================================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDuCbLWxy7Y3509457_sx-j2tqnIdUNVEQ",
  authDomain: "aml-game.firebaseapp.com",
  databaseURL: "https://aml-game-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "Yaml-game",
  storageBucket: "aml-game.firebasestorage.app",
  messagingSenderId: "515626143488",
  appId: "1:515626143488:web:d43b84d7d49f2cfcad6de5"
};

let FIREBASE_READY = false;
let db = null;
let auth = null;

function verifyAdminPassword(input) { return input === atob("a2ljYzEyMzQ="); }

// Firebase 초기화 시도
try {
  if (FIREBASE_CONFIG.apiKey !== "AIzaSyDuCbLWxy7Y3509457_sx-j2tqnIdUNVEQ") {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.database();
    auth = firebase.auth();
    FIREBASE_READY = true;
    console.log("✅ Firebase 연결");
    auth.onAuthStateChanged(async (user) => {
      if (user && db) {
        try {
          const snap = await db.ref('users/' + user.uid).once('value');
          if (snap.exists()) APP.currentUser = { ...snap.val(), uid: user.uid };
        } catch(e) { APP.currentUser = null; }
      } else { APP.currentUser = null; }
      if (window.onAuthStateReady) window.onAuthStateReady(APP.currentUser);
    });
  } else {
    throw new Error("미설정");
  }
} catch(e) {
  console.warn("⚠️ Firebase 미설정 - 로컬 모드로 동작합니다.");
  auth = {
    onAuthStateChanged: (cb) => { setTimeout(() => cb(null), 50); return () => {}; },
    createUserWithEmailAndPassword: () => Promise.reject(new Error("Firebase 설정 후 이용 가능합니다.")),
    signInWithEmailAndPassword: () => Promise.reject(new Error("Firebase 설정 후 이용 가능합니다.")),
    signOut: () => Promise.resolve()
  };
  setTimeout(() => { if (window.onAuthStateReady) window.onAuthStateReady(null); }, 100);
}
