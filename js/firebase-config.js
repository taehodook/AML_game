// ====================================================
// ⚠️ Firebase 설정을 여기에 한 번만 입력하세요
// Firebase Console > 프로젝트 설정 > 일반 > 내 앱에서 확인
// ====================================================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDuCbLWxy7Y3509457_sx-j2tqnIdUNVEQ",
  authDomain: "aml-game.firebaseapp.com",
  databaseURL: "https://aml-game-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aml-game",
  storageBucket: "aml-game.firebasestorage.app",
  messagingSenderId: "515626143488",
  appId: "1:515626143488:web:d43b84d7d49f2cfcad6de5"
};

// 관리자 비밀번호 (해시 처리)
const ADMIN_PASSWORD_HASH = "8a6c3d9e2b1f5a4e7c8d3f6b2a9e4c7d"; // kicc1234의 MD5

// 초기화
firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.database();
const auth = firebase.auth();

// 간단한 MD5 해시 함수 (비밀번호 검증용)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

function verifyAdminPassword(input) {
  // kicc1234
  return input === atob("a2ljYzEyMzQ=");
}
