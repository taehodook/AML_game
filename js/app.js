// ====================================================
// AML 의심거래 트레이닝 게임 - 메인 게임 로직
// ====================================================

const APP = {
  currentUser: null,
  currentGame: null,
  currentGameData: null,
  timerInterval: null,
  elapsedSeconds: 0,
  kycViewTimer: null,
  kycTimeLeft: 30,
  submitCount: 0,
  penaltySeconds: 0,
  gameStartTime: null,
  difficulty: null,
  industry: null,

  // 난이도별 표시 KYC 필드 수
  DIFFICULTY_SETTINGS: {
    low: { customerCount: 3, fieldCount: 13 },
    mid: { customerCount: 5, fieldCount: 13 },
    high: { customerCount: 8, fieldCount: 15 }
  },

  KYC_FIELDS: [
    { key: 'name', label: '이름/상호명' },
    { key: 'type', label: '고객유형' },
    { key: 'rep_info', label: '대표자 정보' },
    { key: 'birth_or_open', label: '생년월일/개업일' },
    { key: 'nationality', label: '국적' },
    { key: 'residence', label: '거주여부' },
    { key: 'address', label: '주소/사업장소재지' },
    { key: 'beneficial_owner', label: '실소유자 정보' },
    { key: 'risk', label: '위험평가' },
    { key: 'asset', label: '자산규모/자본금' },
    { key: 'job_or_business', label: '직업/업종' },
    { key: 'purpose', label: '거래목적' },
    { key: 'fund_source', label: '자금의 원천 및 출처' },
    { key: 'join_date', label: '가입일' },
    { key: 'kyc_date', label: 'KYC 완료일' }
  ],

  INDUSTRY_LABELS: {
    bank: '🏦 은행업',
    securities: '📈 증권업',
    epayment: '💳 전자금융업',
    crypto: '₿ 가상자산거래소',
    casino: '🎰 카지노업'
  },

  DIFFICULTY_LABELS: {
    low: '하 (쉬움)',
    mid: '중 (보통)',
    high: '고 (어려움)'
  },

  // =================== 유틸리티 ===================
  formatNumber(num) {
    if (!num && num !== 0) return '-';
    return Number(num).toLocaleString('ko-KR') + '원';
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  },

  maskName(name) {
    if (!name) return '';
    if (name.length <= 2) return name[0] + '*';
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  },

  shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  },

  // =================== Firebase 데이터 초기화 ===================
  async initSampleData() {
    try {
      const snap = await db.ref('games').once('value');
      if (!snap.exists()) {
        const updates = {};
        for (const [key, game] of Object.entries(SAMPLE_GAMES)) {
          const gameRef = db.ref('games').push();
          updates[`games/${gameRef.key}`] = { ...game, createdAt: Date.now(), isActive: true };
        }
        await db.ref().update(updates);
        console.log('샘플 데이터 초기화 완료');
      }
    } catch (e) {
      console.error('샘플 데이터 초기화 실패:', e);
    }
  },

  // =================== 인증 ===================
  async register(name, nickname, email, phone, company, password) {
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      await db.ref(`users/${cred.user.uid}`).set({
        name, nickname, email, phone, company,
        createdAt: Date.now(),
        uid: cred.user.uid
      });
      return { success: true, user: cred.user };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async login(email, password) {
    try {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      const snap = await db.ref(`users/${cred.user.uid}`).once('value');
      this.currentUser = { ...snap.val(), uid: cred.user.uid };
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async logout() {
    await auth.signOut();
    this.currentUser = null;
  },

  // =================== 게임 로드 ===================
  async loadGames() {
    const snap = await db.ref('games').orderByChild('isActive').equalTo(true).once('value');
    const games = [];
    snap.forEach(child => {
      games.push({ id: child.key, ...child.val() });
    });
    return games;
  },

  async loadGame(gameId) {
    const snap = await db.ref(`games/${gameId}`).once('value');
    return snap.exists() ? { id: gameId, ...snap.val() } : null;
  },

  // =================== KYC 뷰 생성 ===================
  buildKycView(kycList, difficulty) {
    const settings = this.DIFFICULTY_SETTINGS[difficulty];
    const customers = kycList.slice(0, settings.customerCount);
    const fieldCount = settings.fieldCount;
    const fields = this.KYC_FIELDS.slice(0, fieldCount);

    return customers.map(c => {
      const rows = {};
      fields.forEach(f => {
        if (f.key === 'rep_info') {
          if (c.rep_name) {
            rows[f.key] = `${c.rep_name} / ${c.rep_birth || '-'} / ${c.rep_nationality || '-'}`;
          } else {
            rows[f.key] = '-';
          }
        } else if (f.key === 'beneficial_owner') {
          const bo = c.beneficial_owner;
          if (bo) {
            rows[f.key] = `${bo.name} / ${bo.nationality} / ${bo.birth} / 지분율: ${bo.share}`;
          } else {
            rows[f.key] = '-';
          }
        } else {
          rows[f.key] = c[f.key] || '-';
        }
      });
      return { id: c.id, name: c.name, type: c.type, rows, fields };
    });
  },

  // =================== 거래내역 테이블 헤더 ===================
  getTransactionHeaders(industry) {
    const headers = {
      bank: ['거래일시', '거래시간', '거래내용', '거래자명', '지급금액', '입금금액', '잔액', '적요'],
      securities: ['거래일시', '거래시간', '거래내용', '거래자명', '거래금액', '잔액', '주식수', '주식명', '적요'],
      epayment: ['거래일시', '거래시간', '거래내용', '거래자명', '결제금액', '거래구분', '카드할부', '비고'],
      crypto: ['거래일시', '거래시간', '거래내용', '거래자명', '거래금액', '잔액', '거래수', '코인명', '적요'],
      casino: ['거래일시', '거래시간', '거래내용', '거래자명', '거래금액', '거래수', '칩단위', '적요']
    };
    return headers[industry] || headers.bank;
  },

  buildTransactionRow(tx, industry) {
    const base = [tx.date, tx.time, tx.content, tx.trader];
    if (industry === 'bank') {
      return [...base,
        tx.pay ? this.formatNumber(tx.pay) : '-',
        tx.receive ? this.formatNumber(tx.receive) : '-',
        tx.balance ? this.formatNumber(tx.balance) : '-',
        tx.note || '-'
      ];
    } else if (industry === 'securities') {
      return [...base,
        this.formatNumber(tx.amount),
        this.formatNumber(tx.balance),
        tx.stock_qty ? tx.stock_qty.toLocaleString() + '주' : '-',
        tx.stock_name || '-',
        tx.note || '-'
      ];
    } else if (industry === 'epayment') {
      return [...base,
        this.formatNumber(tx.amount),
        tx.type || '-',
        tx.installment || '-',
        tx.note || '-'
      ];
    } else if (industry === 'crypto') {
      return [...base,
        this.formatNumber(tx.amount),
        tx.balance ? this.formatNumber(tx.balance) : '-',
        tx.qty ? tx.qty.toLocaleString() : '-',
        tx.coin || '-',
        tx.note || '-'
      ];
    } else if (industry === 'casino') {
      return [...base,
        this.formatNumber(tx.amount),
        tx.qty ? tx.qty.toLocaleString() : '-',
        tx.chip || '-',
        tx.note || '-'
      ];
    }
    return base;
  },

  // =================== 랭킹 ===================
  async saveRanking(gameId, time, submitCount, difficulty, nickname, name) {
    const month = this.getCurrentMonth();
    const entry = {
      gameId, time, submitCount, difficulty,
      nickname,
      maskedName: this.maskName(name),
      month,
      createdAt: Date.now(),
      uid: this.currentUser?.uid || 'anonymous'
    };
    await db.ref('rankings').push(entry);
    await db.ref(`userStats/${this.currentUser?.uid}/history`).push({
      gameId, time, submitCount, difficulty, month, createdAt: Date.now()
    });
  },

  async loadRankings(month) {
    const snap = await db.ref('rankings').orderByChild('month').equalTo(month).once('value');
    const list = [];
    snap.forEach(c => list.push({ id: c.key, ...c.val() }));
    // 정렬: 시간 asc → 제출횟수 asc → createdAt asc
    list.sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time;
      if (a.submitCount !== b.submitCount) return a.submitCount - b.submitCount;
      return a.createdAt - b.createdAt;
    });
    return list;
  },

  // =================== 답안 검증 ===================
  checkAnswer(gameData, criminal, reasons) {
    const answerCriminal = gameData.answer.criminal.toLowerCase();
    const inputCriminal = criminal.trim().toLowerCase();
    const criminalMatch = answerCriminal.includes(inputCriminal) || inputCriminal.includes(answerCriminal.split(',')[0].trim());

    const keywords = gameData.answer.keywords;
    const allReasonText = Object.values(reasons).join(' ');
    let matchedKeywords = keywords.filter(kw =>
      allReasonText.includes(kw) || kw.split(/[,\s]+/).some(part => allReasonText.includes(part))
    );

    return {
      criminalMatch,
      keywordMatch: matchedKeywords.length >= 3,
      matchedCount: matchedKeywords.length,
      matchedKeywords
    };
  },

  // =================== 도전 기록 저장 ===================
  async saveChallengeRecord(gameId, type, data) {
    if (!this.currentUser) return;
    await db.ref(`challenges/${this.currentUser.uid}`).push({
      gameId, type, ...data, createdAt: Date.now()
    });
  }
};

// Auth 상태 감지
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const snap = await db.ref(`users/${user.uid}`).once('value');
    if (snap.exists()) {
      APP.currentUser = { ...snap.val(), uid: user.uid };
    }
  } else {
    APP.currentUser = null;
  }
  if (window.onAuthStateReady) window.onAuthStateReady(APP.currentUser);
});
