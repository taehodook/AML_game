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

  DIFFICULTY_SETTINGS: {
    low:  { customerCount: 3, fieldCount: 13 },
    mid:  { customerCount: 5, fieldCount: 13 },
    high: { customerCount: 8, fieldCount: 15 }
  },

  KYC_FIELDS: [
    { key: 'name',            label: '이름/상호명' },
    { key: 'type',            label: '고객유형' },
    { key: 'rep_info',        label: '대표자 정보' },
    { key: 'birth_or_open',   label: '생년월일/개업일' },
    { key: 'nationality',     label: '국적' },
    { key: 'residence',       label: '거주여부' },
    { key: 'address',         label: '주소/사업장소재지' },
    { key: 'beneficial_owner',label: '실소유자 정보' },
    { key: 'risk',            label: '위험평가' },
    { key: 'asset',           label: '자산규모/자본금' },
    { key: 'job_or_business', label: '직업/업종' },
    { key: 'purpose',         label: '거래목적' },
    { key: 'fund_source',     label: '자금의 원천 및 출처' },
    { key: 'join_date',       label: '가입일' },
    { key: 'kyc_date',        label: 'KYC 완료일' }
  ],

  INDUSTRY_LABELS: {
    bank:       '🏦 은행업',
    securities: '📈 증권업',
    epayment:   '💳 전자금융업',
    crypto:     '₿ 가상자산거래소',
    casino:     '🎰 카지노업'
  },

  DIFFICULTY_LABELS: {
    low:  '하 (쉬움)',
    mid:  '중 (보통)',
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

  // =================== 로컬 저장소 ===================
  getLocalGames() {
    // LOCAL_GAMES(sample-data.js) + localStorage 추가 게임 합산
    const base = (typeof LOCAL_GAMES !== 'undefined') ? LOCAL_GAMES : [];
    try {
      const stored = JSON.parse(localStorage.getItem('aml_local_games') || '[]');
      return [...base, ...stored];
    } catch(e) { return base; }
  },

  saveLocalGame(gameData) {
    try {
      const stored = JSON.parse(localStorage.getItem('aml_local_games') || '[]');
      stored.push({ ...gameData, id: 'local_' + Date.now() });
      localStorage.setItem('aml_local_games', JSON.stringify(stored));
      return true;
    } catch(e) { return false; }
  },

  // =================== Firebase 초기화 (있을 때만) ===================
  async initSampleData() {
    if (!FIREBASE_READY || !db) return; // Firebase 없으면 스킵
    try {
      const snap = await db.ref('games').once('value');
      if (!snap.exists()) {
        const updates = {};
        const games = typeof LOCAL_GAMES !== 'undefined' ? LOCAL_GAMES : [];
        games.forEach(game => {
          const ref = db.ref('games').push();
          updates[`games/${ref.key}`] = { ...game, createdAt: Date.now(), isActive: true };
        });
        if (Object.keys(updates).length) await db.ref().update(updates);
        console.log('Firebase 샘플 데이터 초기화 완료');
      }
    } catch(e) {
      console.warn('Firebase 초기화 실패 - 로컬 모드 사용:', e.message);
    }
  },

  // =================== 인증 ===================
  async register(name, nickname, email, phone, company, password) {
    if (!FIREBASE_READY) return { success: false, error: 'Firebase가 설정되지 않았습니다.' };
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      await db.ref(`users/${cred.user.uid}`).set({ name, nickname, email, phone, company, createdAt: Date.now(), uid: cred.user.uid });
      return { success: true, user: cred.user };
    } catch(e) { return { success: false, error: e.message }; }
  },

  async login(email, password) {
    if (!FIREBASE_READY) return { success: false, error: 'Firebase가 설정되지 않았습니다.' };
    try {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      const snap = await db.ref(`users/${cred.user.uid}`).once('value');
      this.currentUser = { ...snap.val(), uid: cred.user.uid };
      return { success: true };
    } catch(e) { return { success: false, error: e.message }; }
  },

  async logout() {
    if (FIREBASE_READY) await auth.signOut();
    this.currentUser = null;
  },

  // =================== 게임 로드 (Firebase 우선, 없으면 로컬) ===================
  async loadGames() {
    if (FIREBASE_READY && db) {
      try {
        const snap = await db.ref('games').orderByChild('isActive').equalTo(true).once('value');
        const games = [];
        snap.forEach(child => games.push({ id: child.key, ...child.val() }));
        if (games.length > 0) return games;
      } catch(e) {
        console.warn('Firebase 게임 로드 실패 - 로컬로 전환:', e.message);
      }
    }
    // 로컬 fallback
    return this.getLocalGames().filter(g => g.isActive !== false);
  },

  async loadGame(gameId) {
    // 로컬 게임 먼저 확인
    const local = this.getLocalGames().find(g => g.id === gameId);
    if (local) return { ...local };

    if (FIREBASE_READY && db) {
      try {
        const snap = await db.ref(`games/${gameId}`).once('value');
        return snap.exists() ? { id: gameId, ...snap.val() } : null;
      } catch(e) { return null; }
    }
    return null;
  },

  // =================== 게임 저장 (Firebase or 로컬) ===================
  async saveGame(gameData) {
    if (FIREBASE_READY && db) {
      try {
        await db.ref('games').push(gameData);
        return { success: true, mode: 'firebase' };
      } catch(e) {
        console.warn('Firebase 저장 실패 - 로컬 저장:', e.message);
      }
    }
    const ok = this.saveLocalGame(gameData);
    return { success: ok, mode: 'local' };
  },

  // =================== KYC 뷰 생성 ===================
  buildKycView(kycList, difficulty) {
    const settings = this.DIFFICULTY_SETTINGS[difficulty];
    const customers = kycList.slice(0, settings.customerCount);
    const fieldCount = settings.fieldCount;
    const fields = this.KYC_FIELDS.slice(0, fieldCount);

    return customers.map((c, ci) => {
      const repInfo = (c.rep_name || c.rep_birth || c.rep_nationality)
        ? `${c.rep_name || '-'} / ${c.rep_birth || '-'} / ${c.rep_nationality || '-'}`
        : '-';
      const boVal = c.beneficial_owner
        ? `${c.beneficial_owner.name || '-'} (${c.beneficial_owner.nationality || '-'}, ${c.beneficial_owner.birth || '-'}, 지분 ${c.beneficial_owner.share || '-'})`
        : '-';

      const fieldValues = {
        name:             c.name || '-',
        type:             c.type || '-',
        rep_info:         repInfo,
        birth_or_open:    c.birth_or_open || '-',
        nationality:      c.nationality || '-',
        residence:        c.residence || '-',
        address:          c.address || '-',
        beneficial_owner: boVal,
        risk:             c.risk || '-',
        asset:            c.asset || '-',
        job_or_business:  c.job_or_business || '-',
        purpose:          c.purpose || '-',
        fund_source:      c.fund_source || '-',
        join_date:        c.join_date || '-',
        kyc_date:         c.kyc_date || '-'
      };

      const riskClass = c.risk === '고' ? 'risk-high' : c.risk === '중' ? 'risk-mid' : 'risk-low';
      const rows = fields.map(f => `
        <tr>
          <td class="kyc-field-label">${f.label}</td>
          <td class="kyc-field-value ${f.key === 'risk' ? riskClass : ''}">${fieldValues[f.key]}</td>
        </tr>`).join('');

      return `
        <div class="kyc-card">
          <div class="kyc-card-header">
            <span class="kyc-customer-num">고객 #${ci + 1}</span>
            <span class="kyc-customer-name">${c.name || '알 수 없음'}</span>
            <span class="badge ${c.risk === '고' ? 'badge-danger' : c.risk === '중' ? 'badge-warning' : 'badge-success'}">${c.risk || '-'}위험</span>
          </div>
          <table class="kyc-table"><tbody>${rows}</tbody></table>
        </div>`;
    }).join('');
  },

  // =================== 거래내역 테이블 ===================
  buildTxTable(transactions) {
    if (!transactions || !transactions.length) return '<p style="color:var(--text2);">거래내역이 없습니다.</p>';
    const rows = transactions.map(tx => {
      const payStr    = tx.pay      ? this.formatNumber(tx.pay)     : (tx.amount ? this.formatNumber(tx.amount) : '-');
      const recvStr   = tx.receive  ? this.formatNumber(tx.receive) : '-';
      const balStr    = tx.balance  ? this.formatNumber(tx.balance) : '-';
      const qtyStr    = tx.stock_qty ? tx.stock_qty.toLocaleString() + '주' : (tx.qty ? tx.qty + (tx.coin ? ' ' + tx.coin : '') : '-');
      return `<tr>
        <td>${tx.date || '-'}</td>
        <td>${tx.time || '-'}</td>
        <td>${tx.content || '-'}</td>
        <td>${tx.trader || '-'}</td>
        <td style="color:var(--danger);font-family:var(--mono);">${payStr !== '-' && !tx.receive ? payStr : '-'}</td>
        <td style="color:var(--success);font-family:var(--mono);">${recvStr !== '-' ? recvStr : (tx.receive ? this.formatNumber(tx.receive) : '-')}</td>
        <td style="font-family:var(--mono);">${tx.stock_name || qtyStr}</td>
        <td style="color:var(--text2);font-size:12px;">${tx.note || ''}</td>
      </tr>`;
    }).join('');

    return `
      <div class="table-wrapper">
        <table>
          <thead><tr>
            <th>날짜</th><th>시간</th><th>거래유형</th><th>거래자</th>
            <th>출금/지출</th><th>입금/수취</th><th>종목/수량</th><th>비고</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  },

  // =================== 정답 검증 ===================
  validateAnswer(userInput, gameData) {
    if (!gameData?.answer) return { correct: false, score: 0 };
    const ans = gameData.answer;
    const input = userInput.toLowerCase().replace(/\s/g, '');
    const criminal = (ans.criminal || '').toLowerCase().replace(/\s/g, '');

    // 범인 이름 매칭 (쉼표 분리 다중 범인 처리)
    const criminals = criminal.split(/[,]+/);
    const nameMatch = criminals.some(c => input.includes(c.trim()) || c.trim().includes(input));

    // 키워드 매칭
    const keywords = ans.keywords || [];
    const matchedKeywords = keywords.filter(kw =>
      input.includes(kw.toLowerCase().replace(/\s/g, ''))
    );

    if (nameMatch || matchedKeywords.length >= 3) {
      return { correct: true, matchedKeywords, score: 100 + matchedKeywords.length * 10 };
    }
    return { correct: false, matchedKeywords, score: 0 };
  },

  // =================== 랭킹 ===================
  async saveRanking(data) {
    if (FIREBASE_READY && db) {
      try {
        await db.ref('rankings').push({ ...data, createdAt: Date.now() });
        return;
      } catch(e) { console.warn('Firebase 랭킹 저장 실패'); }
    }
    try {
      const list = JSON.parse(localStorage.getItem('aml_rankings') || '[]');
      list.push({ ...data, createdAt: Date.now() });
      list.sort((a, b) => a.time - b.time);
      localStorage.setItem('aml_rankings', JSON.stringify(list.slice(0, 100)));
    } catch(e) {}
  },

  async loadRankings(month) {
    if (FIREBASE_READY && db) {
      try {
        const snap = await db.ref('rankings').orderByChild('month').equalTo(month).once('value');
        const list = [];
        snap.forEach(c => list.push({ id: c.key, ...c.val() }));
        list.sort((a, b) => a.time - b.time);
        return list;
      } catch(e) { console.warn('Firebase 랭킹 로드 실패'); }
    }
    try {
      const list = JSON.parse(localStorage.getItem('aml_rankings') || '[]');
      return list.filter(r => r.month === month);
    } catch(e) { return []; }
  }
};
