// ====================================================
// Firebase 설정
// ====================================================
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyDuCbLWxy7Y3509457_sx-j2tqnIdUNVEQ",
  authDomain:        "aml-game.firebaseapp.com",
  databaseURL:       "https://aml-game-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "Yaml-game",
  storageBucket:     "aml-game.firebasestorage.app",
  messagingSenderId: "515626143488",
  appId:             "1:515626143488:web:d43b84d7d49f2cfcad6de5"
};

let FIREBASE_READY = false;
let db   = null;
let auth = null;

function verifyAdminPassword(input) { return input === atob("a2ljYzEyMzQ="); }

// ====================================================
// ✅ 수정 핵심: "YOUR_API_KEY" 플레이스홀더인지만 체크
//    실제 키값이 들어있으면 무조건 Firebase 연결 시도
// ====================================================
const _isPlaceholder =
  !FIREBASE_CONFIG.apiKey ||
  FIREBASE_CONFIG.apiKey.startsWith("YOUR_");

if (!_isPlaceholder) {
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    db   = firebase.database();
    auth = firebase.auth();
    FIREBASE_READY = true;
    console.log("✅ Firebase 연결 성공");

    auth.onAuthStateChanged(async (user) => {
      if (user && db) {
        try {
          const snap = await db.ref('users/' + user.uid).once('value');
          APP.currentUser = snap.exists()
            ? { ...snap.val(), uid: user.uid }
            : { uid: user.uid, email: user.email };
        } catch(e) {
          APP.currentUser = { uid: user.uid, email: user.email };
        }
      } else {
        APP.currentUser = null;
      }
      if (window.onAuthStateReady) window.onAuthStateReady(APP.currentUser);
    });

  } catch(e) {
    console.error("Firebase 초기화 오류:", e.message);
    _setLocalMode("초기화 오류: " + e.message);
  }
} else {
  console.warn("⚠️ Firebase 미설정 → 로컬 모드");
  _setLocalMode("미설정");
}

function _setLocalMode(reason) {
  FIREBASE_READY = false;
  auth = {
    onAuthStateChanged:             (cb) => { setTimeout(() => cb(null), 50); return () => {}; },
    createUserWithEmailAndPassword: ()   => Promise.reject(new Error("Firebase 설정 후 이용 가능합니다.")),
    signInWithEmailAndPassword:     ()   => Promise.reject(new Error("Firebase 설정 후 이용 가능합니다.")),
    signOut:                        ()   => Promise.resolve()
  };
  setTimeout(() => { if (window.onAuthStateReady) window.onAuthStateReady(null); }, 100);
}
