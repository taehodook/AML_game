# AML 의심거래 트레이닝 게임

> AML(자금세탁방지) 의심거래 탐지 훈련을 위한 실전형 웹 게임

## 🚀 설치 및 배포 가이드

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com) 접속
2. 새 프로젝트 생성
3. **Authentication** → 이메일/비밀번호 로그인 활성화
4. **Realtime Database** → 데이터베이스 생성 (아시아 서버 권장)
5. **Realtime Database 규칙** 설정:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "games": {
      ".read": true,
      ".write": "auth !== null"
    },
    "rankings": {
      ".read": true,
      ".write": "auth !== null"
    },
    "challenges": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "userStats": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### 2. Firebase 설정 입력

`js/firebase-config.js` 파일을 열고 Firebase 설정값을 입력하세요:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "여기에 입력",
  authDomain: "여기에 입력",
  databaseURL: "여기에 입력",
  projectId: "여기에 입력",
  storageBucket: "여기에 입력",
  messagingSenderId: "여기에 입력",
  appId: "여기에 입력"
};
```

> Firebase Console → 프로젝트 설정 → 일반 → 내 앱 → 웹 앱 추가에서 확인 가능

### 3. GitHub Pages 배포

```bash
# 1. GitHub 저장소 생성 후 파일 업로드
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aml-game.git
git push -u origin main

# 2. GitHub → Settings → Pages → Source: main branch 선택 → Save
```

### 4. Firebase 도메인 허용

Firebase Console → Authentication → Sign-in method → 승인된 도메인에 GitHub Pages 도메인 추가

---

## 📁 파일 구조

```
aml-game/
├── index.html          # 메인 게임 페이지 (전체 UI)
├── css/
│   └── style.css       # 스타일시트
├── js/
│   ├── firebase-config.js  # ⚠️ Firebase 설정 (여기만 수정)
│   ├── sample-data.js      # 샘플 게임 데이터 (5개 업종)
│   ├── app.js              # 게임 로직
│   └── ui.js               # UI 컨트롤러
└── README.md
```

---

## 🎮 게임 방법

1. **회원가입** 후 로그인
2. **업종 선택**: 은행업 / 증권업 / 전자금융업 / 가상자산거래소 / 카지노업
3. **게임 선택**: 도전할 케이스 선택
4. **난이도 선택**: 하(고객 3명) / 중(5명) / 고(8명, 전체정보)
5. **KYC 열람**: 30초간 고객 정보 암기
6. **거래내역 분석**: 거래 패턴 파악
7. **범인 신고**: 범인 이름 + 사유 3가지 제출
8. **힌트**: 필요시 30초 패널티로 단서 확인

---

## ⚙️ 관리자 기능

메인화면 → 로그인 → **관리자 로그인** 클릭

- **비밀번호**: `kicc1234`
- 게임 생성/관리 (KYC·거래내역 JSON 또는 엑셀 업로드)
- 회원 목록 조회
- 랭킹 초기화

---

## 🔧 샘플 데이터

초기 실행 시 자동으로 5개 샘플 게임이 생성됩니다:
- 🏦 은행업 - 해외 자금세탁 (TBML)
- 📈 증권업 - 주가조작 (Pump & Dump)
- 💳 전자금융업 - 불법도박 결제
- ₿ 가상자산거래소 - 프라이버시코인 자금세탁
- 🎰 카지노업 - 스머핑 및 외화세탁
