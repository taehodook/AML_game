// ====================================================
// Firebase 설정
// Firebase Console > 프로젝트 설정 > 일반 > 내 앱에서 확인
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
// ✅ 핵심 수정: 플레이스홀더 여부로만 판단
//    → 실제 키값이 있으면 무조건 Firebase 초기화 시도
// ====================================================
const isPlaceholder =
  !FIREBASE_CONFIG.apiKey ||
  FIREBASE_CONFIG.apiKey === "YOUR_API_KEY" ||
  FIREBASE_CONFIG.apiKey.startsWith("YOUR_");

if (!isPlaceholder) {
  // ── Firebase 초기화 ──
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
          if (snap.exists()) {
            APP.currentUser = { ...snap.val(), uid: user.uid };
          } else {
            APP.currentUser = { uid: user.uid, email: user.email };
          }
        } catch(e) {
          console.warn("유저 정보 로드 실패:", e.message);
          APP.currentUser = null;
        }
      } else {
        APP.currentUser = null;
      }
      if (window.onAuthStateReady) window.onAuthStateReady(APP.currentUser);
    });

  } catch(e) {
    console.error("Firebase 초기화 오류:", e.message);
    _fallbackLocalMode(e.message);
  }

} else {
  // ── 로컬(데모) 모드 ──
  console.warn("⚠️ Firebase 미설정 → 로컬 모드로 동작합니다.");
  _fallbackLocalMode("미설정");
}

// ── 로컬 모드 공통 처리 ──
function _fallbackLocalMode(reason) {
  FIREBASE_READY = false;
  auth = {
    onAuthStateChanged:              (cb) => { setTimeout(() => cb(null), 50); return () => {}; },
    createUserWithEmailAndPassword:  ()   => Promise.reject(new Error("Firebase 설정 후 이용 가능합니다. (" + reason + ")")),
    signInWithEmailAndPassword:      ()   => Promise.reject(new Error("Firebase 설정 후 이용 가능합니다. (" + reason + ")")),
    signOut:                         ()   => Promise.resolve()
  };
  setTimeout(() => { if (window.onAuthStateReady) window.onAuthStateReady(null); }, 100);
}
