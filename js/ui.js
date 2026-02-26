// ====================================================
// UI 컨트롤러 - 페이지 전환 및 이벤트 처리
// ====================================================

let selectedIndustry = null;
let selectedDifficulty = 'high';
let selectedGameId = null;
let allGames = [];
let pendingHintIndex = null;
let hintUsedCount = 0;
let kycReviewInterval = null;
let isAdminLoggedIn = false;

// =================== 초기화 ===================
window.onAuthStateReady = function(user) {
  updateHeaderAuth(user);
  loadMainData();
};

document.addEventListener('DOMContentLoaded', async () => {
  await APP.initSampleData();
  buildIndustryGrid();
  loadRankingDisplay();
});

function buildIndustryGrid() {
  const grid = document.getElementById('industry-select-grid');
  const industries = [
    { id: 'bank', icon: '🏦', name: '은행업', desc: '예금·대출·해외송금' },
    { id: 'securities', icon: '📈', name: '증권업', desc: '주식·채권·펀드' },
    { id: 'epayment', icon: '💳', name: '전자금융업', desc: '카드·간편결제' },
    { id: 'crypto', icon: '₿', name: '가상자산거래소', desc: '코인·토큰 거래' },
    { id: 'casino', icon: '🎰', name: '카지노업', desc: '칩·환전·게임' }
  ];
  grid.innerHTML = industries.map(i => `
    <div class="industry-card" id="ind-${i.id}" onclick="selectIndustry('${i.id}')">
      <div class="industry-icon">${i.icon}</div>
      <div class="industry-name">${i.name}</div>
      <div class="industry-desc">${i.desc}</div>
    </div>
  `).join('');
}

function selectIndustry(id) {
  selectedIndustry = id;
  document.querySelectorAll('.industry-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('ind-' + id)?.classList.add('selected');
  renderGameList();
}

function selectDifficulty(d) {
  selectedDifficulty = d;
  document.querySelectorAll('.diff-card').forEach(c => c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
}

async function loadMainData() {
  try {
    allGames = await APP.loadGames();
    renderGameList();
  } catch (e) {
    document.getElementById('game-select-list').innerHTML = '<p style="color:var(--text2);padding:16px;">게임 목록을 불러오는 중 오류가 발생했습니다.</p>';
  }
}

function renderGameList() {
  const el = document.getElementById('game-select-list');
  let filtered = allGames;
  if (selectedIndustry) {
    filtered = allGames.filter(g => g.industry === selectedIndustry);
  }
  if (!filtered.length) {
    el.innerHTML = '<p style="color:var(--text2);padding:16px;">해당 업종의 게임이 없습니다. 업종을 먼저 선택하거나 관리자에게 문의하세요.</p>';
    return;
  }
  el.innerHTML = filtered.map(g => `
    <div class="game-list-item" id="gsel-${g.id}" onclick="selectGame('${g.id}')" style="cursor:pointer;">
      <div class="game-item-info">
        <div class="game-item-title">${g.title || '무제 게임'}</div>
        <div class="game-item-meta">
          ${APP.INDUSTRY_LABELS[g.industry] || g.industry}
        </div>
      </div>
      <div>
        ${selectedGameId === g.id ? '<span class="badge badge-info">선택됨</span>' : '<span class="badge badge-neutral">선택</span>'}
      </div>
    </div>
  `).join('');
}

function selectGame(id) {
  selectedGameId = id;
  renderGameList();
}

// =================== 게임 시작 ===================
async function startGame() {
  if (!APP.currentUser) {
    showToast('로그인 후 게임을 시작할 수 있습니다.', 'warning');
    showModal('modal-login');
    return;
  }
  if (!selectedGameId) {
    showToast('게임을 먼저 선택해주세요.', 'warning');
    return;
  }
  const gameData = await APP.loadGame(selectedGameId);
  if (!gameData) { showToast('게임 데이터를 불러오지 못했습니다.', 'error'); return; }

  APP.currentGameData = gameData;
  APP.difficulty = selectedDifficulty;
  APP.submitCount = 0;
  APP.penaltySeconds = 0;
  hintUsedCount = 0;

  // KYC 셔플 (게임마다 랜덤)
  if (gameData.kyc_list) {
    gameData.kyc_list = APP.shuffleArray(gameData.kyc_list);
  }
  if (gameData.transactions) {
    gameData.transactions = APP.shuffleArray(gameData.transactions);
  }

  showKycPage(gameData);
}

// =================== KYC 페이지 ===================
function showKycPage(gameData) {
  showPage('page-kyc');
  document.getElementById('kyc-game-title').textContent = gameData.title || '게임';
  document.getElementById('kyc-diff-badge').textContent = APP.DIFFICULTY_LABELS[APP.difficulty] || APP.difficulty;

  const kycViews = APP.buildKycView(gameData.kyc_list, APP.difficulty);
  renderKycGrid(document.getElementById('kyc-grid'), kycViews);

  let timeLeft = 30;
  const timerEl = document.getElementById('kyc-timer');
  timerEl.textContent = timeLeft;
  timerEl.className = 'kyc-timer';

  clearInterval(APP.kycViewTimer);
  APP.kycViewTimer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 10) timerEl.className = 'kyc-timer warning';
    if (timeLeft <= 5) timerEl.className = 'kyc-timer danger';
    if (timeLeft <= 0) {
      clearInterval(APP.kycViewTimer);
      showGamePage(gameData);
    }
  }, 1000);
}

function renderKycGrid(container, kycViews) {
  container.innerHTML = kycViews.map(c => `
    <div class="kyc-card">
      <div class="kyc-card-header">
        <span class="kyc-card-id">${c.id}</span>
        <span class="kyc-card-name">${c.name}</span>
        <span class="badge ${c.type.includes('법인') ? 'badge-info' : c.type.includes('사업자') ? 'badge-warning' : 'badge-neutral'}">${c.type}</span>
      </div>
      <div class="kyc-card-body">
        ${c.fields.map(f => {
          const val = c.rows[f.key];
          let valHtml = val;
          if (f.key === 'risk') {
            if (val === '고') valHtml = '<span class="risk-high">고위험</span>';
            else if (val === '중') valHtml = '<span class="risk-mid">중위험</span>';
            else if (val === '저') valHtml = '<span class="risk-low">저위험</span>';
          }
          return `<div class="kyc-row">
            <div class="kyc-key">${f.label}</div>
            <div class="kyc-val">${valHtml || '-'}</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

// =================== 게임 페이지 ===================
function showGamePage(gameData) {
  showPage('page-game');
  APP.currentGameData = gameData;

  // 헤더
  document.getElementById('game-title-header').textContent = gameData.title || '게임';
  document.getElementById('game-badges').innerHTML = `
    <span class="badge badge-info">${APP.INDUSTRY_LABELS[gameData.industry] || gameData.industry}</span>
    <span class="badge ${APP.difficulty === 'high' ? 'badge-danger' : APP.difficulty === 'mid' ? 'badge-warning' : 'badge-success'}">${APP.DIFFICULTY_LABELS[APP.difficulty]}</span>
  `;
  document.getElementById('tx-count-badge').textContent = `총 ${(gameData.transactions || []).length}건`;

  // 거래내역 테이블
  buildTransactionTable(gameData);

  // 타이머 시작
  APP.elapsedSeconds = 0;
  APP.gameStartTime = Date.now();
  clearInterval(APP.timerInterval);
  APP.timerInterval = setInterval(() => {
    APP.elapsedSeconds++;
    document.getElementById('game-elapsed').textContent = APP.formatTime(APP.elapsedSeconds);
  }, 1000);

  // 제출 횟수 초기화
  APP.submitCount = 0;
  document.getElementById('submit-count-display').textContent = 0;
  document.getElementById('answer-criminal').value = '';
  document.getElementById('answer-trait').value = '';
  document.getElementById('answer-type').value = '';
  document.getElementById('answer-reason').value = '';
  document.getElementById('answer-feedback').style.display = 'none';
  document.getElementById('penalty-banner').style.display = 'none';
}

function buildTransactionTable(gameData) {
  const headers = APP.getTransactionHeaders(gameData.industry);
  const head = document.getElementById('tx-head');
  const body = document.getElementById('tx-body');

  head.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
  body.innerHTML = (gameData.transactions || []).map(tx => {
    const row = APP.buildTransactionRow(tx, gameData.industry);
    return `<tr>${row.map((cell, i) => `<td class="${i >= 4 ? 'td-num' : ''} ${i === 3 ? 'td-name' : ''}">${cell}</td>`).join('')}</tr>`;
  }).join('');
}

// =================== 힌트 ===================
function requestHint(index) {
  pendingHintIndex = index;
  showModal('modal-hint-confirm');
}

async function confirmHint() {
  closeModal('modal-hint-confirm');
  const gameData = APP.currentGameData;
  if (!gameData?.hints?.[pendingHintIndex]) return;

  const hint = gameData.hints[pendingHintIndex];
  hintUsedCount++;
  APP.penaltySeconds += 30;
  APP.elapsedSeconds += 30;

  // 패널티 표시
  const penBanner = document.getElementById('penalty-banner');
  penBanner.style.display = 'flex';
  document.getElementById('penalty-time').textContent = APP.penaltySeconds;

  if (hint.type === 'kyc_review') {
    showKycReview(gameData);
  } else {
    const area = document.getElementById('hint-content-area');
    area.innerHTML = `
      <div class="hint-content">
        <div class="hint-content-title">📰 ${hint.title || '단서 힌트'}</div>
        <div class="hint-content-body">${hint.content || ''}</div>
      </div>
    `;
    showModal('modal-hint-content');
  }
}

function showKycReview(gameData) {
  const kycViews = APP.buildKycView(gameData.kyc_list, APP.difficulty);
  renderKycGrid(document.getElementById('kyc-review-grid'), kycViews);

  let timeLeft = 30;
  const timerEl = document.getElementById('kyc-review-timer');
  timerEl.textContent = timeLeft;

  clearInterval(kycReviewInterval);
  showModal('modal-kyc-review');

  kycReviewInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(kycReviewInterval);
      closeModal('modal-kyc-review');
    }
  }, 1000);
}

// =================== 답안 제출 ===================
function submitAnswer() {
  const criminal = document.getElementById('answer-criminal').value.trim();
  const trait = document.getElementById('answer-trait').value.trim();
  const type = document.getElementById('answer-type').value.trim();
  const reason = document.getElementById('answer-reason').value.trim();

  if (!criminal) { showToast('범인 이름/상호명을 입력해주세요.', 'warning'); return; }

  APP.submitCount++;
  document.getElementById('submit-count-display').textContent = APP.submitCount;

  const result = APP.checkAnswer(APP.currentGameData, criminal, { trait, type, reason });
  const feedback = document.getElementById('answer-feedback');
  feedback.style.display = 'block';

  if (result.criminalMatch && result.keywordMatch) {
    clearInterval(APP.timerInterval);
    const finalTime = APP.elapsedSeconds;

    feedback.innerHTML = `
      <div style="background:rgba(46,213,115,0.15);border:1px solid var(--success);border-radius:8px;padding:16px;color:var(--success);">
        ✅ 정답입니다! 키워드 ${result.matchedCount}개 일치: ${result.matchedKeywords.join(', ')}
      </div>`;

    showResultPage(true, finalTime, APP.submitCount, hintUsedCount);
  } else {
    let msg = '';
    if (!result.criminalMatch) msg += '❌ 범인 이름이 일치하지 않습니다. ';
    if (result.criminalMatch && !result.keywordMatch) {
      msg += `⚠️ 범인은 맞으나 키워드가 부족합니다. (${result.matchedCount}/3개 일치: ${result.matchedKeywords.join(', ') || '없음'})`;
    }
    feedback.innerHTML = `
      <div style="background:rgba(255,71,87,0.1);border:1px solid rgba(255,71,87,0.4);border-radius:8px;padding:16px;color:var(--danger);">
        ${msg} 다시 도전해보세요!
      </div>`;
  }
}

// =================== 포기 / 정답보기 ===================
function confirmGiveUp() { showModal('modal-giveup'); }

async function doGiveUp() {
  closeModal('modal-giveup');
  clearInterval(APP.timerInterval);
  await APP.saveChallengeRecord(selectedGameId, 'giveup', {
    elapsed: APP.elapsedSeconds, submitCount: APP.submitCount, difficulty: APP.difficulty
  });
  showToast('포기 기록이 저장되었습니다.', 'info');
  goHome();
}

function showAnswerReveal() { showModal('modal-answer-reveal'); }

async function doShowAnswer() {
  closeModal('modal-answer-reveal');
  clearInterval(APP.timerInterval);
  await APP.saveChallengeRecord(selectedGameId, 'answer_revealed', {
    elapsed: APP.elapsedSeconds, submitCount: APP.submitCount, difficulty: APP.difficulty
  });
  showResultPage(false, APP.elapsedSeconds, APP.submitCount, hintUsedCount, true);
}

// =================== 결과 페이지 ===================
async function showResultPage(isSuccess, time, submitCount, hintCount, isRevealed = false) {
  showPage('page-result');

  document.getElementById('result-icon').textContent = isSuccess ? '🎉' : isRevealed ? '📋' : '💀';
  const titleEl = document.getElementById('result-title');
  titleEl.className = 'result-title ' + (isSuccess ? 'success' : 'fail');
  titleEl.textContent = isSuccess ? '정답! 범인을 잡았습니다!' : isRevealed ? '정답을 확인했습니다' : '게임 종료';

  document.getElementById('result-subtitle').textContent = isRevealed
    ? '정답보기를 선택해 랭킹에 기록되지 않습니다.'
    : isSuccess ? '수고하셨습니다! 뛰어난 탐지 능력입니다.' : '';

  document.getElementById('result-time').textContent = APP.formatTime(time);
  document.getElementById('result-submit-count').textContent = submitCount + '회';
  document.getElementById('result-hint-count').textContent = hintCount + '회';
  document.getElementById('result-difficulty').textContent = APP.DIFFICULTY_LABELS[APP.difficulty];

  // 정답 공개
  const ans = APP.currentGameData?.answer;
  document.getElementById('result-answer-reveal').innerHTML = ans ? `
    <div class="answer-reveal-title">✅ 정답 및 해설</div>
    <div class="answer-item">
      <label>🎯 정답 범인</label>
      <p>${ans.criminal}</p>
    </div>
    <div class="answer-item">
      <label>👤 고객 특성</label>
      <p>${ans.customer_trait}</p>
    </div>
    <div class="answer-item">
      <label>⚠️ 의심거래 유형</label>
      <p>${ans.suspicious_type}</p>
    </div>
    <div class="answer-item">
      <label>🔑 결정적 사유</label>
      <p>${ans.key_reason}</p>
    </div>
    <div class="answer-item">
      <label>📚 핵심 키워드</label>
      <p>${(ans.keywords || []).join(' · ')}</p>
    </div>
    <div class="answer-item">
      <label>🎓 출제 의도</label>
      <p>${ans.intent || '-'}</p>
    </div>
  ` : '';

  // 랭킹 등재
  if (isSuccess && APP.currentUser) {
    const month = APP.getCurrentMonth();
    await APP.saveRanking(selectedGameId, time, submitCount, APP.difficulty,
      APP.currentUser.nickname, APP.currentUser.name);
    document.getElementById('result-ranking-info').innerHTML = `
      <div class="badge badge-success" style="font-size:13px;padding:8px 20px;">🏆 랭킹에 등재되었습니다!</div>
    `;
    loadRankingDisplay();
  }
}

// =================== 랭킹 표시 ===================
async function loadRankingDisplay() {
  const tbody = document.getElementById('ranking-tbody');
  if (!tbody) return;

  const month = APP.getCurrentMonth();
  try {
    const list = await APP.loadRankings(month);
    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:24px;">아직 기록이 없습니다. 첫 번째 도전자가 되세요!</td></tr>';
      return;
    }
    tbody.innerHTML = list.slice(0, 20).map((r, i) => {
      const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : '';
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1;
      const date = new Date(r.createdAt).toLocaleDateString('ko-KR');
      return `<tr>
        <td class="${rankClass}" style="text-align:center;">${medal}</td>
        <td style="font-weight:700;">${r.nickname || '-'}</td>
        <td>${r.maskedName || '-'}</td>
        <td><span class="badge ${r.difficulty === 'high' ? 'badge-danger' : r.difficulty === 'mid' ? 'badge-warning' : 'badge-success'}">${APP.DIFFICULTY_LABELS[r.difficulty] || r.difficulty}</span></td>
        <td style="font-family:var(--mono);font-weight:700;color:var(--accent);">${APP.formatTime(r.time)}</td>
        <td>${r.submitCount}회</td>
        <td style="color:var(--text2);font-size:12px;">${date}</td>
      </tr>`;
    }).join('');
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:24px;">랭킹 로드 실패</td></tr>';
  }
}

// =================== 재시작 / 홈 ===================
function restartGame() {
  if (APP.currentGameData) {
    clearInterval(APP.timerInterval);
    APP.currentGameData.kyc_list = APP.shuffleArray(APP.currentGameData.kyc_list);
    APP.currentGameData.transactions = APP.shuffleArray(APP.currentGameData.transactions);
    showKycPage(APP.currentGameData);
  } else {
    goHome();
  }
}

function goHome() {
  clearInterval(APP.timerInterval);
  clearInterval(APP.kycViewTimer);
  showPage('page-main');
  loadRankingDisplay();
  loadMainData();
}

// =================== 인증 ===================
function updateHeaderAuth(user) {
  const area = document.getElementById('header-auth-area');
  if (user) {
    area.innerHTML = `
      <span style="font-size:13px;color:var(--text2);">👤 ${user.nickname || user.name}</span>
      <button class="btn btn-secondary btn-sm" onclick="doLogout()">로그아웃</button>
    `;
  } else {
    area.innerHTML = `
      <button class="btn btn-secondary btn-sm" onclick="showModal('modal-login')">로그인</button>
      <button class="btn btn-primary btn-sm" onclick="showModal('modal-register')">회원가입</button>
    `;
  }
}

async function doLogin() {
  const email = document.getElementById('login-email').value;
  const pw = document.getElementById('login-pw').value;
  if (!email || !pw) { showToast('이메일과 비밀번호를 입력해주세요.', 'warning'); return; }

  const result = await APP.login(email, pw);
  if (result.success) {
    closeModal('modal-login');
    updateHeaderAuth(APP.currentUser);
    showToast(`환영합니다, ${APP.currentUser.nickname || APP.currentUser.name}님!`, 'success');
  } else {
    showToast('로그인 실패: ' + (result.error || '이메일/비밀번호를 확인하세요.'), 'error');
  }
}

async function doRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const nickname = document.getElementById('reg-nickname').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const company = document.getElementById('reg-company').value.trim();
  const pw = document.getElementById('reg-pw').value;

  if (!document.getElementById('agree-privacy').checked) { showToast('개인정보 수집 동의가 필요합니다.', 'warning'); return; }
  if (!document.getElementById('agree-terms').checked) { showToast('이용약관 동의가 필요합니다.', 'warning'); return; }
  if (!name || !nickname || !email || !pw) { showToast('필수 항목을 모두 입력해주세요.', 'warning'); return; }
  if (pw.length < 8) { showToast('비밀번호는 8자리 이상이어야 합니다.', 'warning'); return; }

  const result = await APP.register(name, nickname, email, phone, company, pw);
  if (result.success) {
    await APP.login(email, pw);
    closeModal('modal-register');
    updateHeaderAuth(APP.currentUser);
    showToast('회원가입이 완료되었습니다!', 'success');
  } else {
    showToast('회원가입 실패: ' + result.error, 'error');
  }
}

async function doLogout() {
  await APP.logout();
  updateHeaderAuth(null);
  showToast('로그아웃 되었습니다.', 'info');
}

// =================== 관리자 ===================
function doAdminLogin() {
  const pw = document.getElementById('admin-pw').value;
  if (verifyAdminPassword(pw)) {
    isAdminLoggedIn = true;
    closeModal('modal-admin-login');
    showPage('page-admin');
    loadAdminData();
  } else {
    showToast('비밀번호가 올바르지 않습니다.', 'error');
  }
}

function switchAdminTab(tabId) {
  document.querySelectorAll('.admin-tab').forEach((t, i) => {
    const tabs = ['tab-games', 'tab-create', 'tab-users', 'tab-ranking-admin'];
    t.classList.toggle('active', tabs[i] === tabId);
  });
  document.querySelectorAll('.admin-pane').forEach(p => {
    p.classList.toggle('active', p.id === tabId);
  });
  if (tabId === 'tab-users') loadAdminUsers();
  if (tabId === 'tab-ranking-admin') loadAdminRanking();
}

async function loadAdminData() {
  // 게임 목록
  const games = await APP.loadGames();
  const el = document.getElementById('admin-game-list');
  if (!games.length) {
    el.innerHTML = '<p style="color:var(--text2);">등록된 게임이 없습니다.</p>';
    return;
  }
  el.innerHTML = games.map(g => `
    <div class="game-list-item">
      <div class="game-item-info">
        <div class="game-item-title">${g.title || '무제'}</div>
        <div class="game-item-meta">${APP.INDUSTRY_LABELS[g.industry] || g.industry} · ${g.isActive ? '활성' : '비활성'}</div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-warning btn-sm" onclick="toggleGameActive('${g.id}', ${!g.isActive})">${g.isActive ? '비활성화' : '활성화'}</button>
        <button class="btn btn-danger btn-sm" onclick="deleteGame('${g.id}')">삭제</button>
      </div>
    </div>
  `).join('');
}

async function toggleGameActive(id, active) {
  await db.ref(`games/${id}`).update({ isActive: active });
  showToast('게임 상태가 변경되었습니다.', 'success');
  loadAdminData();
}

async function deleteGame(id) {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  await db.ref(`games/${id}`).remove();
  showToast('게임이 삭제되었습니다.', 'success');
  loadAdminData();
}

async function saveGame() {
  const title = document.getElementById('admin-game-title').value.trim();
  const industry = document.getElementById('admin-game-industry').value;
  const isActive = document.getElementById('admin-game-active').value === 'true';

  let kycList = [], txList = [];
  try {
    const kycJson = document.getElementById('admin-kyc-json').value.trim();
    if (kycJson) kycList = JSON.parse(kycJson);
    const txJson = document.getElementById('admin-tx-json').value.trim();
    if (txJson) txList = JSON.parse(txJson);
  } catch (e) {
    showToast('JSON 형식이 올바르지 않습니다.', 'error'); return;
  }

  const keywords = document.getElementById('admin-answer-keywords').value.split(',').map(k => k.trim()).filter(Boolean);
  const gameData = {
    title, industry, isActive,
    kyc_list: kycList,
    transactions: txList,
    hints: [
      { type: 'news', title: document.getElementById('admin-hint1-title').value, content: document.getElementById('admin-hint1-content').value },
      { type: 'kyc_review', content: 'KYC 정보 30초 재열람' }
    ],
    answer: {
      criminal: document.getElementById('admin-answer-criminal').value,
      keywords,
      customer_trait: document.getElementById('admin-answer-trait').value,
      suspicious_type: document.getElementById('admin-answer-type').value,
      key_reason: document.getElementById('admin-answer-reason').value,
      intent: document.getElementById('admin-intent').value
    },
    createdAt: Date.now()
  };

  await db.ref('games').push(gameData);
  showToast('게임이 저장되었습니다!', 'success');
  loadAdminData();
}

async function loadAdminUsers() {
  const snap = await db.ref('users').once('value');
  const el = document.getElementById('admin-user-list');
  const users = [];
  snap.forEach(c => users.push({ id: c.key, ...c.val() }));
  if (!users.length) { el.innerHTML = '<p style="color:var(--text2);">회원이 없습니다.</p>'; return; }

  el.innerHTML = `
    <div class="table-wrapper">
      <table>
        <thead><tr>
          <th>이름</th><th>닉네임</th><th>이메일</th><th>전화번호</th><th>회사명</th><th>가입일</th>
        </tr></thead>
        <tbody>
          ${users.map(u => `<tr>
            <td>${u.name || '-'}</td>
            <td>${u.nickname || '-'}</td>
            <td>${u.email || '-'}</td>
            <td>${u.phone || '-'}</td>
            <td>${u.company || '-'}</td>
            <td style="font-size:12px;color:var(--text2);">${u.createdAt ? new Date(u.createdAt).toLocaleDateString('ko-KR') : '-'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function loadAdminRanking() {
  const month = APP.getCurrentMonth();
  const list = await APP.loadRankings(month);
  const el = document.getElementById('admin-ranking-list');
  if (!list.length) { el.innerHTML = '<p style="color:var(--text2);">이번 달 랭킹이 없습니다.</p>'; return; }
  el.innerHTML = `<p style="margin-bottom:12px;color:var(--text2);">이번 달 (${month}) 총 ${list.length}개 기록</p>
    <div class="table-wrapper">
      <table>
        <thead><tr><th>순위</th><th>닉네임</th><th>이름</th><th>난이도</th><th>기록</th><th>제출횟수</th></tr></thead>
        <tbody>${list.slice(0, 50).map((r, i) => `<tr>
          <td>${i+1}</td>
          <td>${r.nickname || '-'}</td>
          <td>${r.maskedName || '-'}</td>
          <td>${APP.DIFFICULTY_LABELS[r.difficulty] || r.difficulty}</td>
          <td style="font-family:var(--mono);">${APP.formatTime(r.time)}</td>
          <td>${r.submitCount}회</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>`;
}

async function confirmResetRanking() {
  const month = document.getElementById('admin-reset-month').value.trim();
  if (!month || !/^\d{4}-\d{2}$/.test(month)) { showToast('올바른 월 형식을 입력하세요 (예: 2024-03)', 'warning'); return; }
  if (!confirm(`${month} 랭킹을 초기화하시겠습니까? 복구 불가합니다.`)) return;

  const snap = await db.ref('rankings').orderByChild('month').equalTo(month).once('value');
  const updates = {};
  snap.forEach(c => { updates[c.key] = null; });
  await db.ref('rankings').update(updates);
  showToast(`${month} 랭킹이 초기화되었습니다.`, 'success');
  loadAdminRanking();
}

function previewGame() {
  showToast('미리보기 기능은 저장 후 게임 목록에서 테스트하세요.', 'info');
}

// =================== 공통 유틸 UI ===================
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  window.scrollTo(0, 0);
}

function showModal(id) {
  document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
}

function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// 모달 외부 클릭 닫기
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
});
