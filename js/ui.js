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

// 힌트 파일 첨부 저장소 (base64)
let hintAttachments = { h1: null, h2: null }; // {name, type, data(base64)}

// =================== 초기화 ===================
window.onAuthStateReady = function(user) {
  updateHeaderAuth(user);
  loadMainData();
};

document.addEventListener('DOMContentLoaded', async () => {
  buildIndustryGrid();
  setupExcelUpload();
  setupHintFileUpload();

  // 게임 목록 즉시 로드 (LOCAL_GAMES → 화면에 바로 표시)
  await loadMainData();

  // 랭킹 로드
  loadRankingDisplay();

  // Firebase 연결된 경우: DB에 게임 없으면 샘플 업로드 후 다시 로드
  if (typeof APP.initSampleData === 'function') {
    await APP.initSampleData();
    // 샘플 업로드 후 목록 갱신 (Firebase에 올라갔을 수 있으므로)
    await loadMainData();
  }
});

// =================== 업종 그리드 ===================
function buildIndustryGrid() {
  const grid = document.getElementById('industry-select-grid');
  const industries = [
    { id: 'bank',       icon: '🏦', name: '은행업',        desc: '예금·대출·해외송금' },
    { id: 'securities', icon: '📈', name: '증권업',        desc: '주식·채권·펀드' },
    { id: 'epayment',   icon: '💳', name: '전자금융업',    desc: '카드·간편결제' },
    { id: 'crypto',     icon: '₿',  name: '가상자산거래소', desc: '코인·토큰 거래' },
    { id: 'casino',     icon: '🎰', name: '카지노업',      desc: '칩·환전·게임' }
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

// =================== 게임 목록 로드 ===================
async function loadMainData() {
  const el = document.getElementById('game-select-list');
  if (el) el.innerHTML = '<div class="loading"><div class="spinner"></div><p style="margin-top:8px;color:var(--text2);">게임 목록 불러오는 중...</p></div>';
  try {
    allGames = await APP.loadGames();
    renderGameList();
  } catch(e) {
    console.error('게임 목록 로드 오류:', e);
    if (el) el.innerHTML = '<p style="color:var(--danger);padding:16px;">⚠️ 게임 목록 로드 실패. 새로고침해 주세요.</p>';
  }
}

function renderGameList() {
  const el = document.getElementById('game-select-list');
  if (!el) return;
  let filtered = allGames;
  if (selectedIndustry) filtered = allGames.filter(g => g.industry === selectedIndustry);

  if (!filtered.length) {
    el.innerHTML = `<div style="padding:24px;text-align:center;color:var(--text2);">
      <div style="font-size:40px;margin-bottom:12px;">🎮</div>
      <p style="font-size:15px;margin-bottom:8px;">${selectedIndustry ? '해당 업종의 게임이 없습니다.' : '게임이 없습니다.'}</p>
      <p style="font-size:13px;">업종을 선택하거나 전체 보기(업종 미선택)로 확인하세요.</p>
    </div>`;
    return;
  }

  const diffBadge = { low:'badge-success', mid:'badge-warning', high:'badge-danger' };
  const diffLabel = { low:'하', mid:'중', high:'고' };

  el.innerHTML = filtered.map(g => `
    <div class="game-list-item ${selectedGameId === g.id ? 'selected-game' : ''}"
         id="gsel-${g.id}" onclick="selectGame('${g.id}')" style="cursor:pointer;">
      <div class="game-item-info">
        <div class="game-item-title">${g.title || '무제 게임'}</div>
        <div class="game-item-meta" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">
          <span>${APP.INDUSTRY_LABELS[g.industry] || g.industry}</span>
          ${g.difficulty ? `<span class="badge ${diffBadge[g.difficulty]||'badge-neutral'}">난이도 ${diffLabel[g.difficulty]||g.difficulty}</span>` : ''}
        </div>
      </div>
      <div>
        ${selectedGameId === g.id
          ? '<span class="badge badge-info">✓ 선택됨</span>'
          : '<span class="badge badge-neutral">선택</span>'}
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
  if (!selectedGameId) { showToast('게임을 먼저 선택해주세요.', 'warning'); return; }

  const gameData = await APP.loadGame(selectedGameId);
  if (!gameData) { showToast('게임 데이터를 불러오지 못했습니다.', 'error'); return; }

  APP.currentGameData = gameData;
  APP.submitCount = 0;
  APP.penaltySeconds = 0;
  APP.difficulty = selectedDifficulty;
  APP.industry = gameData.industry;

  // KYC와 거래내역 셔플
  if (gameData.kyc_list) gameData.kyc_list = APP.shuffleArray(gameData.kyc_list);
  if (gameData.transactions) gameData.transactions = APP.shuffleArray(gameData.transactions);

  showKycPage(gameData);
}

// =================== KYC 페이지 ===================
function showKycPage(gameData) {
  hintUsedCount = 0;
  clearInterval(APP.timerInterval);
  clearInterval(APP.kycViewTimer);

  APP.kycTimeLeft = 30;
  document.getElementById('kyc-timer').textContent = APP.kycTimeLeft;

  const kycHtml = APP.buildKycView(gameData.kyc_list || [], APP.difficulty || 'high');
  document.getElementById('kyc-grid').innerHTML = kycHtml;

  document.getElementById('kyc-game-title').textContent = gameData.title || '게임';
  document.getElementById('kyc-diff-badge').textContent = APP.DIFFICULTY_LABELS[APP.difficulty] || APP.difficulty;

  showPage('page-kyc');

  APP.kycViewTimer = setInterval(() => {
    APP.kycTimeLeft--;
    document.getElementById('kyc-timer').textContent = APP.kycTimeLeft;
    if (APP.kycTimeLeft <= 0) {
      clearInterval(APP.kycViewTimer);
      showGamePage(gameData);
    }
  }, 1000);
}

function skipKycTimer() {
  clearInterval(APP.kycViewTimer);
  showGamePage(APP.currentGameData);
}

// =================== 게임 페이지 ===================
function showGamePage(gameData) {
  document.getElementById('game-title-header').textContent = gameData.title || '게임';
  document.getElementById('game-badges').innerHTML =
    `<span class="badge badge-info">${APP.INDUSTRY_LABELS[gameData.industry] || gameData.industry}</span>` +
    `<span class="badge ${APP.difficulty === 'high' ? 'badge-danger' : APP.difficulty === 'mid' ? 'badge-warning' : 'badge-success'}" style="margin-left:6px;">${APP.DIFFICULTY_LABELS[APP.difficulty] || ''}</span>`;

  // 거래내역 - HTML 구조(tx-head/tx-body)에 맞게 삽입
  const txs = gameData.transactions || [];
  document.getElementById('tx-count-badge').textContent = txs.length + '건';
  document.getElementById('tx-head').innerHTML = `<tr>
    <th>날짜</th><th>시간</th><th>거래유형</th><th>거래자</th>
    <th>출금/지출</th><th>입금/수취</th><th>종목/수량</th><th>비고</th>
  </tr>`;
  document.getElementById('tx-body').innerHTML = txs.map(tx => {
    const pay  = tx.pay    ? APP.formatNumber(tx.pay)    : (tx.amount && !tx.receive ? APP.formatNumber(tx.amount) : '-');
    const recv = tx.receive? APP.formatNumber(tx.receive): '-';
    const qty  = tx.stock_qty ? tx.stock_qty.toLocaleString()+'주'
               : tx.qty ? tx.qty + (tx.coin?' '+tx.coin:'')
               : '-';
    const qty2 = tx.stock_name || qty;
    return `<tr>
      <td>${tx.date||'-'}</td>
      <td>${tx.time||'-'}</td>
      <td>${tx.content||'-'}</td>
      <td>${tx.trader||'-'}</td>
      <td style="color:var(--danger);font-family:var(--mono);">${pay!=='-'&&!tx.receive?pay:'-'}</td>
      <td style="color:var(--success);font-family:var(--mono);">${recv}</td>
      <td style="font-family:var(--mono);">${qty2}</td>
      <td style="color:var(--text2);font-size:12px;">${tx.note||''}</td>
    </tr>`;
  }).join('');

  // 힌트: HTML에 requestHint(0), requestHint(1) 하드코딩돼 있어 동적 생성 불필요
  // hint-btn-0 / hint-btn-1 클래스 초기화만 수행
  document.querySelectorAll('.hint-btn').forEach(btn => btn.classList.remove('hint-used'));

  // 답안 입력란 초기화
  ['answer-criminal','answer-trait','answer-type','answer-reason'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const fb = document.getElementById('answer-feedback');
  if (fb) { fb.style.display = 'none'; fb.innerHTML = ''; }
  const sc = document.getElementById('submit-count-display');
  if (sc) sc.textContent = '0';

  // 패널티 배너 초기화
  const pb = document.getElementById('penalty-banner');
  if (pb) pb.style.display = 'none';

  showPage('page-game');
  startTimer();
}

// =================== 타이머 ===================
function startTimer() {
  APP.elapsedSeconds = 0;
  APP.gameStartTime = Date.now();
  clearInterval(APP.timerInterval);
  updateTimerDisplay();
  APP.timerInterval = setInterval(() => {
    APP.elapsedSeconds = Math.floor((Date.now() - APP.gameStartTime) / 1000) + APP.penaltySeconds;
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('game-elapsed');
  if (el) el.textContent = APP.formatTime(APP.elapsedSeconds);
  // 패널티 배너 갱신
  const pb = document.getElementById('penalty-banner');
  const pt = document.getElementById('penalty-time');
  if (pb && pt && APP.penaltySeconds > 0) {
    pb.style.display = 'block';
    pt.textContent = APP.penaltySeconds;
  }
}

// =================== 힌트 ===================
function requestHint(index) {
  const hints = APP.currentGameData?.hints;
  if (!hints || !hints[index]) return;
  pendingHintIndex = index;
  const h = hints[index];
  document.getElementById('hint-confirm-title').textContent = h.title || `힌트 ${index + 1}`;
  document.getElementById('hint-confirm-desc').textContent =
    h.type === 'kyc_review'
      ? 'KYC 정보를 30초간 다시 열람합니다. (패널티 없음)'
      : '이 힌트를 사용하면 +60초 패널티가 추가됩니다.';
  showModal('modal-hint-confirm');
}

function confirmUseHint() {
  closeModal('modal-hint-confirm');
  if (pendingHintIndex === null) return;

  const hints = APP.currentGameData?.hints;
  const h = hints?.[pendingHintIndex];
  if (!h) return;

  document.getElementById(`hint-btn-${pendingHintIndex}`)?.classList.add('hint-used');

  if (h.type === 'kyc_review') {
    // KYC 재열람 (패널티 없음)
    const kycHtml = APP.buildKycView(APP.currentGameData.kyc_list || [], APP.difficulty || 'high');
    document.getElementById('hint-kyc-content').innerHTML = kycHtml;
    document.getElementById('hint-kyc-timer-val').textContent = 30;
    showModal('modal-hint-kyc');
    let t = 30;
    kycReviewInterval = setInterval(() => {
      t--;
      document.getElementById('hint-kyc-timer-val').textContent = t;
      if (t <= 0) { clearInterval(kycReviewInterval); closeModal('modal-hint-kyc'); }
    }, 1000);
  } else {
    // 뉴스/자료 힌트 (+60초 패널티)
    APP.penaltySeconds += 60;
    hintUsedCount++;
    document.getElementById('hint-view-title').textContent = h.title || `힌트 ${pendingHintIndex + 1}`;
    document.getElementById('hint-view-content').textContent = h.content || '';

    // 첨부 파일(이미지/PDF) 표시 - 참가자가 열람 가능
    renderHintAttachment(document.getElementById('hint-view-attachment'), h.attachment);

    showModal('modal-hint-view');
  }
  pendingHintIndex = null;
}

function closeKycReview() {
  clearInterval(kycReviewInterval);
  closeModal('modal-hint-kyc');
}

// =================== 힌트 첨부파일 렌더링 (참가자 열람용) ===================
function renderHintAttachment(container, attachment) {
  if (!container) return;
  if (!attachment || !attachment.data) { container.innerHTML = ''; return; }

  const { name, type, data } = attachment;
  const safeName = (name || '첨부파일').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  if (type && type.startsWith('image/')) {
    // 이미지: 클릭 시 전체화면 팝업
    container.innerHTML = `
      <div style="margin-top:16px;border:2px solid var(--border);border-radius:10px;overflow:hidden;">
        <div style="padding:8px 14px;background:var(--surface2);display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:13px;color:var(--text2);">📎 첨부 이미지: <strong>${safeName}</strong></span>
          <div style="display:flex;gap:8px;">
            <button onclick="openImageFullscreen('${data}','${safeName}')"
              style="font-size:12px;background:var(--accent);color:#fff;border:none;border-radius:5px;padding:4px 10px;cursor:pointer;">🔍 크게 보기</button>
            <a href="${data}" download="${safeName}"
              style="font-size:12px;background:var(--surface3,#2a2a3a);color:var(--text1);border-radius:5px;padding:4px 10px;text-decoration:none;border:1px solid var(--border);">⬇ 저장</a>
          </div>
        </div>
        <img src="${data}" alt="${safeName}"
          style="max-width:100%;display:block;cursor:zoom-in;max-height:420px;object-fit:contain;background:#000;"
          onclick="openImageFullscreen('${data}','${safeName}')">
      </div>`;

  } else if (type === 'application/pdf') {
    // PDF: 내장 뷰어 + 다운로드 버튼
    container.innerHTML = `
      <div style="margin-top:16px;border:2px solid var(--border);border-radius:10px;overflow:hidden;">
        <div style="padding:8px 14px;background:var(--surface2);display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:13px;color:var(--text2);">📄 첨부 PDF: <strong>${safeName}</strong></span>
          <div style="display:flex;gap:8px;">
            <button onclick="openPdfFullscreen('${data}','${safeName}')"
              style="font-size:12px;background:var(--accent);color:#fff;border:none;border-radius:5px;padding:4px 10px;cursor:pointer;">🔍 크게 보기</button>
            <a href="${data}" download="${safeName}"
              style="font-size:12px;background:var(--surface3,#2a2a3a);color:var(--text1);border-radius:5px;padding:4px 10px;text-decoration:none;border:1px solid var(--border);">⬇ 저장</a>
          </div>
        </div>
        <div style="background:#f5f5f5;padding:0;">
          <embed src="${data}" type="application/pdf"
            width="100%" height="480px"
            style="display:block;border:none;">
          </embed>
        </div>
        <div style="padding:8px 14px;background:var(--surface2);font-size:12px;color:var(--text3);">
          ⚠️ PDF가 표시되지 않으면 '크게 보기' 또는 '저장' 버튼을 이용하세요.
        </div>
      </div>`;

  } else {
    container.innerHTML = `
      <div style="margin-top:12px;padding:10px 14px;border:1px solid var(--border);border-radius:8px;background:var(--surface2);font-size:13px;color:var(--text2);">
        📎 첨부파일: ${safeName}
        <a href="${data}" download="${safeName}" style="margin-left:12px;color:var(--accent);">⬇ 다운로드</a>
      </div>`;
  }
}

// 이미지 전체화면 팝업
function openImageFullscreen(src, name) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;';
  overlay.innerHTML = `
    <div style="position:absolute;top:16px;right:16px;display:flex;gap:8px;">
      <a href="${src}" download="${name}" style="background:#1a3a5c;color:#fff;border-radius:6px;padding:8px 16px;text-decoration:none;font-size:13px;">⬇ 저장</a>
      <button onclick="this.closest('[style]').remove()"
        style="background:#c0392b;color:#fff;border:none;border-radius:6px;padding:8px 16px;cursor:pointer;font-size:13px;">✕ 닫기</button>
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:8px;max-width:90%;">${name}</div>
    <img src="${src}" alt="${name}" style="max-width:92vw;max-height:84vh;object-fit:contain;border-radius:6px;box-shadow:0 0 40px rgba(0,0,0,0.5);">
  `;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// PDF 전체화면 팝업
function openPdfFullscreen(src, name) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;flex-direction:column;';
  overlay.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:#1a1a2e;">
      <span style="color:#fff;font-size:14px;">📄 ${name}</span>
      <div style="display:flex;gap:8px;">
        <a href="${src}" download="${name}" style="background:#1a3a5c;color:#fff;border-radius:6px;padding:7px 14px;text-decoration:none;font-size:13px;">⬇ 저장</a>
        <button onclick="this.closest('[style]').remove()"
          style="background:#c0392b;color:#fff;border:none;border-radius:6px;padding:7px 14px;cursor:pointer;font-size:13px;">✕ 닫기</button>
      </div>
    </div>
    <embed src="${src}" type="application/pdf" style="flex:1;width:100%;border:none;">
    <div style="padding:8px;background:#111;color:#666;font-size:12px;text-align:center;">PDF가 표시되지 않으면 저장 후 열어보세요.</div>
  `;
  document.body.appendChild(overlay);
}

// =================== 정답 제출 ===================
async function submitAnswer() {
  // HTML은 answer-criminal, answer-trait, answer-type, answer-reason 4개 필드 구조
  const criminal = (document.getElementById('answer-criminal')?.value || '').trim();
  const trait    = (document.getElementById('answer-trait')?.value    || '').trim();
  const type     = (document.getElementById('answer-type')?.value     || '').trim();
  const reason   = (document.getElementById('answer-reason')?.value   || '').trim();

  if (!criminal) { showToast('범인 이름 또는 상호명을 입력해주세요.', 'warning'); return; }

  // 검증용 통합 입력 (범인명 + 키워드 힌트로 활용될 수 있는 텍스트 합산)
  const input = [criminal, trait, type, reason].join(' ');

  APP.submitCount++;
  // 제출 횟수 업데이트
  const sc = document.getElementById('submit-count-display');
  if (sc) sc.textContent = APP.submitCount;

  const result = APP.validateAnswer(input, APP.currentGameData);

  if (result.correct) {
    clearInterval(APP.timerInterval);
    const finalTime = APP.elapsedSeconds;

    // 결과 페이지 구성
    const ans = APP.currentGameData.answer;
    document.getElementById('result-time').textContent = APP.formatTime(finalTime);
    document.getElementById('result-submit-count').textContent = APP.submitCount + '회';
    document.getElementById('result-hint-count').textContent = hintUsedCount + '회';
    document.getElementById('result-difficulty').textContent = APP.DIFFICULTY_LABELS[APP.difficulty] || APP.difficulty;

    // 정답 공개 (result-answer-reveal)
    document.getElementById('result-answer-reveal').innerHTML = `
      <div style="text-align:left;margin-top:16px;">
        <div style="margin-bottom:8px;"><strong>✅ 정답 범인:</strong> ${ans.criminal || '-'}</div>
        <div style="margin-bottom:8px;"><strong>🔍 의심거래 유형:</strong> ${ans.suspicious_type || '-'}</div>
        <div style="margin-bottom:8px;"><strong>💡 결정적 사유:</strong> ${ans.key_reason || '-'}</div>
        <div style="margin-bottom:8px;"><strong>👤 고객 특성:</strong> ${ans.customer_trait || '-'}</div>
      </div>`;

    // result-icon / result-title / result-subtitle
    const icons = document.getElementById('result-icon');
    const rtitle = document.getElementById('result-title');
    const rsub = document.getElementById('result-subtitle');
    if (icons) icons.textContent = '🎉';
    if (rtitle) rtitle.textContent = '수사 성공!';
    if (rsub) rsub.textContent = `${APP.submitCount}번 만에 범인을 잡았습니다.`;

    // 랭킹 저장
    const month = APP.getCurrentMonth();
    await APP.saveRanking({
      gameId: APP.currentGameData.id,
      gameTitle: APP.currentGameData.title || '-',
      industry: APP.currentGameData.industry,
      difficulty: APP.difficulty,
      time: finalTime,
      submitCount: APP.submitCount,
      hintCount: hintUsedCount,
      month,
      nickname: APP.currentUser?.nickname || '익명',
      maskedName: APP.maskName(APP.currentUser?.name || '익명')
    });

    document.getElementById('result-ranking-info').innerHTML =
      '<div class="badge badge-success" style="font-size:13px;padding:8px 20px;">🏆 랭킹에 등재되었습니다!</div>';
    loadRankingDisplay();
    showPage('page-result');

  } else {
    APP.penaltySeconds += 30;

    // answer-feedback (HTML 요소) 사용
    const fb = document.getElementById('answer-feedback');
    if (fb) {
      fb.style.display = 'block';
      fb.innerHTML = `<div class="toast toast-error" style="position:relative;display:block;margin:8px 0;">
        ❌ 오답입니다. (+30초 패널티) — 매칭된 키워드: ${result.matchedKeywords.length > 0 ? result.matchedKeywords.join(', ') : '없음'}
      </div>`;
      setTimeout(() => { fb.style.display = 'none'; fb.innerHTML = ''; }, 3000);
    }

    // wrong-feedback-area도 있으면 업데이트
    const wf = document.getElementById('wrong-feedback-area');
    if (wf) {
      wf.innerHTML = `<div class="toast toast-error" style="position:relative;display:block;margin:8px 0;">
        ❌ 오답 (${APP.submitCount}회 제출)
      </div>`;
      setTimeout(() => { wf.innerHTML = ''; }, 3000);
    }

    showToast(`오답입니다. 다시 시도하세요. (${APP.submitCount}회 제출)`, 'error');
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
  } catch(e) {
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
  } else { goHome(); }
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
      <button class="btn btn-secondary btn-sm" onclick="doLogout()">로그아웃</button>`;
  } else {
    area.innerHTML = `
      <button class="btn btn-secondary btn-sm" onclick="showModal('modal-login')">로그인</button>
      <button class="btn btn-primary btn-sm" onclick="showModal('modal-register')">회원가입</button>`;
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
  const name     = document.getElementById('reg-name').value.trim();
  const nickname = document.getElementById('reg-nickname').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const phone    = document.getElementById('reg-phone').value.trim();
  const company  = document.getElementById('reg-company').value.trim();
  const pw       = document.getElementById('reg-pw').value;

  if (!document.getElementById('agree-privacy').checked) { showToast('개인정보 수집 동의가 필요합니다.', 'warning'); return; }
  if (!document.getElementById('agree-terms').checked)   { showToast('이용약관 동의가 필요합니다.', 'warning'); return; }
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
  const games = await APP.loadGames();
  const el = document.getElementById('admin-game-list');
  if (!games.length) { el.innerHTML = '<p style="color:var(--text2);">등록된 게임이 없습니다.</p>'; return; }
  const diffLabel = { low:'하', mid:'중', high:'고' };
  el.innerHTML = games.map(g => `
    <div class="game-list-item">
      <div class="game-item-info">
        <div class="game-item-title">${g.title || '무제'}</div>
        <div class="game-item-meta">${APP.INDUSTRY_LABELS[g.industry] || g.industry} · 난이도 ${diffLabel[g.difficulty]||g.difficulty||'-'} · ${g.isActive ? '활성' : '비활성'}</div>
      </div>
      <div style="display:flex;gap:8px;">
        ${!g.id?.startsWith('local_') && !['bank_low','bank_mid','bank_high','sec_low','sec_mid','sec_high','ep_low','ep_mid','ep_high','cr_low','cr_mid','cr_high','casino_low','casino_mid','casino_high'].includes(g.id)
          ? `<button class="btn btn-warning btn-sm" onclick="toggleGameActive('${g.id}', ${!g.isActive})">${g.isActive ? '비활성화' : '활성화'}</button>
             <button class="btn btn-danger btn-sm" onclick="deleteGame('${g.id}')">삭제</button>`
          : `<span class="badge badge-neutral" style="font-size:11px;">기본 샘플</span>`
        }
      </div>
    </div>
  `).join('');
}

async function toggleGameActive(id, active) {
  if (!FIREBASE_READY) { showToast('Firebase 연결 시 사용 가능합니다.', 'warning'); return; }
  await db.ref(`games/${id}`).update({ isActive: active });
  showToast('게임 상태가 변경되었습니다.', 'success');
  loadAdminData();
}

async function deleteGame(id) {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  if (!FIREBASE_READY) { showToast('Firebase 연결 시 사용 가능합니다.', 'warning'); return; }
  await db.ref(`games/${id}`).remove();
  showToast('게임이 삭제되었습니다.', 'success');
  loadAdminData();
}

// =================== 엑셀 업로드 설정 ===================
function setupExcelUpload() {
  // KYC 엑셀
  const kycFile = document.getElementById('admin-kyc-file');
  if (kycFile) {
    kycFile.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const json = await readExcelFile(file, 'kyc');
        document.getElementById('admin-kyc-json').value = JSON.stringify(json, null, 2);
        showToast(`✅ KYC 엑셀 파싱 완료 (${json.length}건)`, 'success');
      } catch(err) {
        showToast('❌ 엑셀 파싱 오류: ' + err.message, 'error');
        e.target.value = '';
      }
    });
  }

  // 거래내역 엑셀
  const txFile = document.getElementById('admin-tx-file');
  if (txFile) {
    txFile.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const json = await readExcelFile(file, 'tx');
        document.getElementById('admin-tx-json').value = JSON.stringify(json, null, 2);
        showToast(`✅ 거래내역 엑셀 파싱 완료 (${json.length}건)`, 'success');
      } catch(err) {
        showToast('❌ 엑셀 파싱 오류: ' + err.message, 'error');
        e.target.value = '';
      }
    });
  }
}

// 엑셀 파싱 (SheetJS CDN 사용)
async function readExcelFile(file, mode) {
  // SheetJS 동적 로드
  if (typeof XLSX === 'undefined') {
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
    } catch(e) {
      await loadScript('https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js');
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        // cellDates:false → 날짜를 숫자로 읽어서 직접 포맷 (Date 객체 파싱 오류 방지)
        const wb = XLSX.read(data, { type: 'array', cellDates: false });
        const ws = wb.Sheets[wb.SheetNames[0]];

        // raw:false → 모든 값을 문자열로 통일 (타입 오류 방지)
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });

        if (!rows.length) throw new Error('데이터가 없습니다. 샘플 파일 형식을 확인하세요.');

        // 빈 행 제거 (모든 값이 비어있는 행 스킵)
        const filtered = rows.filter(row =>
          Object.values(row).some(v => v !== '' && v !== null && v !== undefined)
        );

        if (!filtered.length) throw new Error('유효한 데이터 행이 없습니다.');

        const result = filtered.map((row, idx) => {
          if (mode === 'kyc') return mapKycRow(row, idx);
          if (mode === 'tx')  return mapTxRow(row, idx);
          return row;
        });

        resolve(result);
      } catch(err) {
        reject(new Error('엑셀 파싱 오류: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('파일 읽기 실패. 파일이 손상되지 않았는지 확인하세요.'));
    reader.readAsArrayBuffer(file);
  });
}

// KYC 엑셀 행 → 객체 매핑
function mapKycRow(row, idx) {
  const str = (v) => (v === undefined || v === null || v === '') ? null : String(v).trim();
  return {
    id:               str(row['고객ID'] || row['id']) || `C${String(idx+1).padStart(3,'0')}`,
    name:             str(row['이름/상호명'] || row['name']) || '',
    type:             str(row['고객유형'] || row['type']) || '개인',
    rep_name:         str(row['대표자명'] || row['rep_name']),
    rep_birth:        str(row['대표자생년월일'] || row['rep_birth']),
    rep_nationality:  str(row['대표자국적'] || row['rep_nationality']),
    birth_or_open:    str(row['생년월일/개업일'] || row['birth_or_open']),
    nationality:      str(row['국적'] || row['nationality']),
    residence:        str(row['거주여부'] || row['residence']),
    address:          str(row['주소'] || row['address']),
    beneficial_owner: {
      name:         str(row['실소유자명'] || row['bo_name']) || '-',
      nationality:  str(row['실소유자국적'] || row['bo_nationality']) || '-',
      birth:        str(row['실소유자생년월일'] || row['bo_birth']) || '-',
      share:        str(row['실소유자지분'] || row['bo_share']) || '-'
    },
    risk:             str(row['위험평가'] || row['risk']) || '저',
    asset:            str(row['자산규모'] || row['asset']),
    job_or_business:  str(row['직업/업종'] || row['job_or_business']),
    purpose:          str(row['거래목적'] || row['purpose']),
    fund_source:      str(row['자금출처'] || row['fund_source']),
    join_date:        str(row['가입일'] || row['join_date']),
    kyc_date:         str(row['KYC완료일'] || row['kyc_date'])
  };
}

// 거래내역 엑셀 행 → 객체 매핑
function mapTxRow(row) {
  const str = (v) => (v === undefined || v === null || v === '') ? null : String(v).trim();
  const num = (v) => {
    if (v === undefined || v === null || v === '') return null;
    const n = Number(String(v).replace(/,/g, ''));
    return isNaN(n) ? null : n;
  };
  return {
    date:      str(row['날짜'] || row['date']),
    time:      str(row['시간'] || row['time']),
    content:   str(row['거래유형'] || row['content']),
    trader:    str(row['거래자'] || row['trader']),
    pay:       num(row['출금'] || row['pay']),
    receive:   num(row['입금'] || row['receive']),
    balance:   num(row['잔액'] || row['balance']),
    amount:    num(row['금액'] || row['amount']),
    stock_name:str(row['종목명'] || row['stock_name']),
    stock_qty: num(row['수량'] || row['stock_qty']),
    note:      str(row['비고'] || row['note'])
  };
}

// 동적 스크립트 로드
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('라이브러리 로드 실패: ' + src));
    document.head.appendChild(s);
  });
}

// 샘플 엑셀 다운로드 (스타일 없이 순수 데이터만 - 오류 없음)
async function downloadSampleExcel(type) {
  const btn = event?.currentTarget;
  const origText = btn?.textContent;
  if (btn) { btn.disabled = true; btn.textContent = '생성 중...'; }

  try {
    // XLSX 라이브러리 로드 (CDN 실패 시 재시도)
    if (typeof XLSX === 'undefined') {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
      } catch(e) {
        // 백업 CDN
        await loadScript('https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js');
      }
    }

    let headers, sampleRows, filename, sheetName, notes;

    if (type === 'kyc') {
      headers = [
        '고객ID','이름/상호명','고객유형','대표자명','대표자생년월일','대표자국적',
        '생년월일/개업일','국적','거주여부','주소',
        '실소유자명','실소유자국적','실소유자생년월일','실소유자지분',
        '위험평가','자산규모','직업/업종','거래목적','자금출처','가입일','KYC완료일'
      ];
      // 샘플 행 3개 (개인, 법인, 개인사업자)
      sampleRows = [
        ['C001','홍길동','개인','','','',
         '1985-03-15','대한민국','거주자','서울 강남구 테헤란로 100',
         '홍길동','대한민국','1985-03-15','100%',
         '저','약 1억원','회사원','급여저축','근로소득','2020-01-01','2024-01-10'],
        ['C002','(주)테스트코리아','법인사업자','김대표','1975-07-20','대한민국',
         '2018-05-01','대한민국','','서울 중구 을지로 200',
         '이실소유','중국','1970-01-01','60%',
         '고','자본금 5천만원','도소매업/수출입','수출입결제','매출대금','2021-03-01','2024-01-15'],
        ['C003','박개인사업','개인사업자','박개인사업','1980-09-10','대한민국',
         '2019-03-01','대한민국','','경기 성남시 분당구 판교로 300',
         '박개인사업','대한민국','1980-09-10','100%',
         '중','자본금 2천만원','IT서비스업','사업운영','용역대금','2022-06-01','2024-02-01']
      ];
      // 입력 안내 행
      notes = [
        ['※ 입력 안내'],
        ['고객유형: 개인 / 법인사업자 / 개인사업자 중 선택'],
        ['위험평가: 고 / 중 / 저 중 선택'],
        ['거주여부: 거주자 / 비거주자 (개인만 해당, 법인은 빈칸)'],
        ['대표자명/생년월일/국적: 법인·개인사업자만 입력, 개인은 빈칸'],
        ['날짜형식: YYYY-MM-DD (예: 2024-03-15)'],
        ['실소유자지분: 100% 형식으로 입력']
      ];
      filename = 'KYC_샘플양식.xlsx';
      sheetName = 'KYC정보';
    } else {
      headers = ['날짜','시간','거래유형','거래자','출금','입금','잔액','금액','종목명','수량','비고'];
      sampleRows = [
        ['2024-03-01','09:15','전자금융','홍길동','','48000000','52000000','','','','해외송금수취(홍콩)'],
        ['2024-03-01','09:47','전자금융','홍길동','45000000','','7000000','','','','타은행이체'],
        ['2024-03-02','10:00','ATM기이용','홍길동','2000000','','5000000','','','','현금인출'],
        ['2024-03-03','14:00','기업금융','(주)테스트','','120000000','150000000','','','','해외송금수취(중국)'],
        ['2024-03-04','09:00','매수','홍길동','','','','500000000','바이오텍A','100000','시간외거래'],
        ['2024-03-04','10:30','매도','홍길동','','','','650000000','바이오텍A','100000','고점매도']
      ];
      notes = [
        ['※ 입력 안내'],
        ['날짜형식: YYYY-MM-DD (예: 2024-03-01)'],
        ['시간형식: HH:MM (예: 09:15)'],
        ['거래유형: 전자금융 / ATM기이용 / 기업금융 / 현금 / 매수 / 매도 / 환전 / 입금 / 출금 등'],
        ['출금/입금/잔액: 은행·전자금융 거래에 사용 (원화, 숫자만)'],
        ['금액/종목명/수량: 증권 거래에 사용'],
        ['모든 금액은 쉼표 없이 숫자만 입력 (예: 48000000)'],
        ['비어있는 칸은 빈칸으로 두면 됩니다']
      ];
      filename = '거래내역_샘플양식.xlsx';
      sheetName = '거래내역';
    }

    // 워크북 생성 (스타일 없이 → 오류 없음)
    const wb = XLSX.utils.book_new();

    // 데이터 시트
    const wsData = [headers, ...sampleRows, [], ...notes];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    // 컬럼 너비만 설정 (스타일 미사용, 오류 없음)
    ws['!cols'] = headers.map((h) => ({ wch: Math.max(h.length * 2, 14) }));
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // 필드 설명 시트 (KYC만)
    if (type === 'kyc') {
      const descData = [
        ['필드명','설명','예시값','필수여부'],
        ['고객ID','고객 고유번호 (자동생성 가능)','C001','선택'],
        ['이름/상호명','개인명 또는 법인/사업체 상호명','홍길동 / (주)테스트','필수'],
        ['고객유형','개인 / 법인사업자 / 개인사업자','개인','필수'],
        ['대표자명','법인·개인사업자만 입력','김대표','법인시필수'],
        ['대표자생년월일','YYYY-MM-DD 형식','1975-07-20','법인시필수'],
        ['대표자국적','국가명','대한민국','법인시필수'],
        ['생년월일/개업일','개인=생년월일, 법인=개업일 (YYYY-MM-DD)','1985-03-15','필수'],
        ['국적','국가명','대한민국','필수'],
        ['거주여부','개인: 거주자/비거주자, 법인: 빈칸','거주자','개인필수'],
        ['주소','자택 또는 사업장 주소','서울 강남구 테헤란로 100','필수'],
        ['실소유자명','실질적 소유자 이름','홍길동','필수'],
        ['실소유자국적','실소유자 국적','대한민국','필수'],
        ['실소유자생년월일','YYYY-MM-DD','1985-03-15','필수'],
        ['실소유자지분','% 포함 입력','100%','필수'],
        ['위험평가','고 / 중 / 저','저','필수'],
        ['자산규모','자산 규모 서술','약 1억원','선택'],
        ['직업/업종','직업 또는 업종명','회사원 / 도소매업','필수'],
        ['거래목적','거래 목적','급여저축','필수'],
        ['자금출처','자금의 출처','근로소득','필수'],
        ['가입일','YYYY-MM-DD','2020-01-01','필수'],
        ['KYC완료일','YYYY-MM-DD','2024-01-10','필수']
      ];
      const wsDesc = XLSX.utils.aoa_to_sheet(descData);
      wsDesc['!cols'] = [{ wch: 20 }, { wch: 35 }, { wch: 25 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(wb, wsDesc, '필드설명');
    }

    XLSX.writeFile(wb, filename);
    showToast(`✅ ${filename} 다운로드 완료! (필드설명 시트 포함)`, 'success');

  } catch(err) {
    console.error('샘플 엑셀 생성 오류:', err);
    showToast('❌ 샘플 파일 생성 실패: ' + err.message + '\n네트워크를 확인하거나 잠시 후 다시 시도하세요.', 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = origText; }
  }
}

// =================== 힌트 파일 첨부 설정 ===================
function setupHintFileUpload() {
  ['h1','h2'].forEach(key => {
    const input = document.getElementById(`hint-file-${key}`);
    if (!input) return;
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) { hintAttachments[key] = null; updateHintFilePreview(key, null); return; }

      // 파일 크기 제한 (2MB)
      if (file.size > 2 * 1024 * 1024) {
        showToast('파일 크기는 2MB 이하여야 합니다.', 'warning');
        e.target.value = '';
        return;
      }

      const allowed = ['image/jpeg','image/png','image/gif','image/webp','application/pdf'];
      if (!allowed.includes(file.type)) {
        showToast('JPG, PNG, GIF, WEBP, PDF 파일만 첨부 가능합니다.', 'warning');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        hintAttachments[key] = { name: file.name, type: file.type, data: ev.target.result };
        updateHintFilePreview(key, hintAttachments[key]);
        showToast(`✅ ${file.name} 첨부됨`, 'success');
      };
      reader.readAsDataURL(file);
    });
  });
}

function updateHintFilePreview(key, attachment) {
  const preview = document.getElementById(`hint-file-preview-${key}`);
  if (!preview) return;
  if (!attachment) { preview.innerHTML = ''; return; }
  if (attachment.type.startsWith('image/')) {
    preview.innerHTML = `
      <div style="margin-top:8px;border:1px solid var(--border);border-radius:6px;overflow:hidden;">
        <img src="${attachment.data}" alt="preview" style="max-height:120px;max-width:100%;display:block;margin:0 auto;">
        <div style="padding:4px 8px;font-size:11px;color:var(--text2);background:var(--surface2);">📎 ${attachment.name} <button onclick="clearHintFile('${key}')" style="color:var(--danger);border:none;background:none;cursor:pointer;font-size:11px;">✕ 제거</button></div>
      </div>`;
  } else {
    preview.innerHTML = `
      <div style="margin-top:8px;padding:8px 12px;border:1px solid var(--border);border-radius:6px;background:var(--surface2);font-size:12px;color:var(--text2);">
        📄 ${attachment.name} <button onclick="clearHintFile('${key}')" style="color:var(--danger);border:none;background:none;cursor:pointer;font-size:12px;margin-left:8px;">✕ 제거</button>
      </div>`;
  }
}

function clearHintFile(key) {
  hintAttachments[key] = null;
  const input = document.getElementById(`hint-file-${key}`);
  if (input) input.value = '';
  updateHintFilePreview(key, null);
}

// =================== 게임 저장 ===================
async function saveGame() {
  const title    = document.getElementById('admin-game-title').value.trim();
  const industry = document.getElementById('admin-game-industry').value;
  const difficulty = document.getElementById('admin-game-difficulty').value;
  const isActive = document.getElementById('admin-game-active').value === 'true';

  if (!title) { showToast('게임 제목을 입력하세요.', 'warning'); return; }

  let kycList = [], txList = [];
  try {
    const kycJson = document.getElementById('admin-kyc-json').value.trim();
    if (kycJson) kycList = JSON.parse(kycJson);
  } catch(e) { showToast('KYC JSON 형식이 올바르지 않습니다.', 'error'); return; }
  try {
    const txJson = document.getElementById('admin-tx-json').value.trim();
    if (txJson) txList = JSON.parse(txJson);
  } catch(e) { showToast('거래내역 JSON 형식이 올바르지 않습니다.', 'error'); return; }

  if (!kycList.length) { showToast('KYC 정보를 입력하세요.', 'warning'); return; }
  if (!txList.length)  { showToast('거래내역을 입력하세요.', 'warning'); return; }

  const keywords = document.getElementById('admin-answer-keywords').value.split(',').map(k => k.trim()).filter(Boolean);

  // 힌트 구성 (파일 첨부 포함)
  const hint1 = {
    type: 'news',
    title: document.getElementById('admin-hint1-title').value,
    content: document.getElementById('admin-hint1-content').value
  };
  if (hintAttachments.h1) hint1.attachment = hintAttachments.h1;

  const hint2 = {
    type: 'news',
    title: document.getElementById('admin-hint2-title').value,
    content: document.getElementById('admin-hint2-content').value
  };
  if (hintAttachments.h2) hint2.attachment = hintAttachments.h2;

  const hints = [hint1];
  if (hint2.title || hint2.content || hintAttachments.h2) hints.push(hint2);
  hints.push({ type: 'kyc_review', content: 'KYC 정보 30초 재열람' });

  const gameData = {
    title, industry, difficulty, isActive,
    kyc_list: kycList,
    transactions: txList,
    hints,
    answer: {
      criminal:         document.getElementById('admin-answer-criminal').value,
      keywords,
      customer_trait:   document.getElementById('admin-answer-trait').value,
      suspicious_type:  document.getElementById('admin-answer-type').value,
      key_reason:       document.getElementById('admin-answer-reason').value,
      intent:           document.getElementById('admin-intent').value
    },
    createdAt: Date.now()
  };

  const saveBtn = document.querySelector('[onclick="saveGame()"]');
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '저장 중...'; }

  const result = await APP.saveGame(gameData);

  if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '💾 게임 저장'; }

  if (result.success) {
    const modeMsg = result.mode === 'firebase' ? '' : ' (로컬 저장)';
    showToast(`✅ 게임이 저장되었습니다${modeMsg}!`, 'success');
    // 폼 초기화
    ['admin-game-title','admin-kyc-json','admin-tx-json','admin-answer-criminal',
     'admin-answer-keywords','admin-answer-trait','admin-answer-type','admin-answer-reason',
     'admin-intent','admin-hint1-title','admin-hint1-content','admin-hint2-title','admin-hint2-content'
    ].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    hintAttachments = { h1: null, h2: null };
    ['h1','h2'].forEach(k => { updateHintFilePreview(k, null); const f = document.getElementById(`hint-file-${k}`); if(f) f.value=''; });
    loadAdminData();
    allGames = await APP.loadGames(); // 게임 목록 새로고침
  } else {
    showToast('게임 저장 실패', 'error');
  }
}

async function loadAdminUsers() {
  if (!FIREBASE_READY) {
    document.getElementById('admin-user-list').innerHTML = '<p style="color:var(--text2);">Firebase 연결 후 회원 관리 가능합니다.</p>';
    return;
  }
  const snap = await db.ref('users').once('value');
  const el = document.getElementById('admin-user-list');
  const users = [];
  snap.forEach(c => users.push({ id: c.key, ...c.val() }));
  if (!users.length) { el.innerHTML = '<p style="color:var(--text2);">회원이 없습니다.</p>'; return; }
  el.innerHTML = `
    <div class="table-wrapper">
      <table>
        <thead><tr><th>이름</th><th>닉네임</th><th>이메일</th><th>전화번호</th><th>회사명</th><th>가입일</th></tr></thead>
        <tbody>${users.map(u => `<tr>
          <td>${u.name||'-'}</td><td>${u.nickname||'-'}</td><td>${u.email||'-'}</td>
          <td>${u.phone||'-'}</td><td>${u.company||'-'}</td>
          <td style="font-size:12px;color:var(--text2);">${u.createdAt?new Date(u.createdAt).toLocaleDateString('ko-KR'):'-'}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>`;
}

async function loadAdminRanking() {
  const month = APP.getCurrentMonth();
  const list = await APP.loadRankings(month);
  const el = document.getElementById('admin-ranking-list');
  if (!list.length) { el.innerHTML = '<p style="color:var(--text2);">이번 달 랭킹이 없습니다.</p>'; return; }
  el.innerHTML = `<p style="margin-bottom:12px;color:var(--text2);">이번 달 (${month}) 총 ${list.length}개 기록</p>
    <div class="table-wrapper"><table>
      <thead><tr><th>순위</th><th>닉네임</th><th>이름</th><th>난이도</th><th>기록</th><th>제출횟수</th></tr></thead>
      <tbody>${list.slice(0,50).map((r,i) => `<tr>
        <td>${i+1}</td><td>${r.nickname||'-'}</td><td>${r.maskedName||'-'}</td>
        <td>${APP.DIFFICULTY_LABELS[r.difficulty]||r.difficulty}</td>
        <td style="font-family:var(--mono);">${APP.formatTime(r.time)}</td>
        <td>${r.submitCount}회</td>
      </tr>`).join('')}</tbody>
    </table></div>`;
}

async function confirmResetRanking() {
  const month = document.getElementById('admin-reset-month').value.trim();
  if (!month || !/^\d{4}-\d{2}$/.test(month)) { showToast('올바른 월 형식 (예: 2024-03)', 'warning'); return; }
  if (!confirm(`${month} 랭킹을 초기화하시겠습니까? 복구 불가합니다.`)) return;

  if (FIREBASE_READY && db) {
    const snap = await db.ref('rankings').orderByChild('month').equalTo(month).once('value');
    const updates = {};
    snap.forEach(c => { updates[c.key] = null; });
    await db.ref('rankings').update(updates);
  } else {
    try {
      const list = JSON.parse(localStorage.getItem('aml_rankings') || '[]');
      localStorage.setItem('aml_rankings', JSON.stringify(list.filter(r => r.month !== month)));
    } catch(e) {}
  }
  showToast(`${month} 랭킹이 초기화되었습니다.`, 'success');
  loadAdminRanking();
}

function previewGame() {
  showToast('미리보기: 저장 후 게임 목록에서 테스트하세요.', 'info');
}

// =================== 공통 유틸 UI ===================
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  window.scrollTo(0, 0);
}
function showModal(id) { document.getElementById(id)?.classList.add('active'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
});

// =================== 포기 / 정답보기 / 재시작 ===================
function confirmGiveUp() {
  showModal('modal-giveup');
}

async function doGiveUp() {
  closeModal('modal-giveup');
  clearInterval(APP.timerInterval);
  const ans = APP.currentGameData?.answer;
  document.getElementById('result-icon').textContent = '🏳️';
  document.getElementById('result-title').textContent = '게임 포기';
  document.getElementById('result-subtitle').textContent = '다음에 다시 도전해보세요!';
  document.getElementById('result-time').textContent = APP.formatTime(APP.elapsedSeconds);
  document.getElementById('result-submit-count').textContent = APP.submitCount + '회';
  document.getElementById('result-hint-count').textContent = hintUsedCount + '회';
  document.getElementById('result-difficulty').textContent = APP.DIFFICULTY_LABELS[APP.difficulty] || APP.difficulty;
  if (ans) {
    document.getElementById('result-answer-reveal').innerHTML = `
      <div style="text-align:left;margin-top:16px;">
        <div style="margin-bottom:8px;"><strong>✅ 정답 범인:</strong> ${ans.criminal || '-'}</div>
        <div style="margin-bottom:8px;"><strong>🔍 의심거래 유형:</strong> ${ans.suspicious_type || '-'}</div>
        <div style="margin-bottom:8px;"><strong>💡 결정적 사유:</strong> ${ans.key_reason || '-'}</div>
        <div style="margin-bottom:8px;"><strong>👤 고객 특성:</strong> ${ans.customer_trait || '-'}</div>
      </div>`;
  }
  document.getElementById('result-ranking-info').innerHTML =
    '<div class="badge badge-danger" style="font-size:13px;padding:8px 20px;">❌ 랭킹 미등재</div>';
  showPage('page-result');
}

function showAnswerReveal() {
  showModal('modal-answer-reveal');
}

async function doShowAnswer() {
  closeModal('modal-answer-reveal');
  clearInterval(APP.timerInterval);
  const ans = APP.currentGameData?.answer;
  document.getElementById('result-icon').textContent = '📋';
  document.getElementById('result-title').textContent = '정답 확인';
  document.getElementById('result-subtitle').textContent = '랭킹에 등재되지 않습니다.';
  document.getElementById('result-time').textContent = APP.formatTime(APP.elapsedSeconds);
  document.getElementById('result-submit-count').textContent = APP.submitCount + '회';
  document.getElementById('result-hint-count').textContent = hintUsedCount + '회';
  document.getElementById('result-difficulty').textContent = APP.DIFFICULTY_LABELS[APP.difficulty] || APP.difficulty;
  if (ans) {
    document.getElementById('result-answer-reveal').innerHTML = `
      <div style="text-align:left;margin-top:16px;">
        <div style="margin-bottom:8px;"><strong>✅ 정답 범인:</strong> ${ans.criminal || '-'}</div>
        <div style="margin-bottom:8px;"><strong>🔍 의심거래 유형:</strong> ${ans.suspicious_type || '-'}</div>
        <div style="margin-bottom:8px;"><strong>💡 결정적 사유:</strong> ${ans.key_reason || '-'}</div>
        <div style="margin-bottom:8px;"><strong>👤 고객 특성:</strong> ${ans.customer_trait || '-'}</div>
      </div>`;
  }
  document.getElementById('result-ranking-info').innerHTML =
    '<div class="badge badge-danger" style="font-size:13px;padding:8px 20px;">❌ 랭킹 미등재</div>';
  showPage('page-result');
}
