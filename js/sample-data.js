// ====================================================
// AML 게임 샘플 데이터 - 업권별 × 난이도별 1개씩 (15개)
// Firebase 없이 로컬에서 즉시 동작
// ====================================================
const LOCAL_GAMES = [

// ══════════ 🏦 은행업 ══════════

// 은행 - 하(쉬움): KYC 3명, 거래 간단
{
  id:"bank_low", title:"🏦 은행업 - 보이스피싱 대포통장 (하)",
  industry:"bank", difficulty:"low", isActive:true, createdAt:1700001001,
  kyc_list:[
    {id:"BL01",name:"오세훈",type:"개인",rep_name:null,rep_birth:null,rep_nationality:null,birth_or_open:"2001-04-15",nationality:"대한민국",residence:"거주자",address:"서울 중랑구 묵동 100",beneficial_owner:{name:"오세훈",nationality:"대한민국",birth:"2001-04-15",share:"100%"},risk:"고",asset:"약 100만원",job_or_business:"무직",purpose:"생활비",fund_source:"불명확",join_date:"2024-01-05",kyc_date:"2024-01-05"},
    {id:"BL02",name:"류미영",type:"개인",rep_name:null,rep_birth:null,rep_nationality:null,birth_or_open:"1975-12-01",nationality:"대한민국",residence:"거주자",address:"인천 부평구 부평동 200",beneficial_owner:{name:"류미영",nationality:"대한민국",birth:"1975-12-01",share:"100%"},risk:"저",asset:"약 5천만원",job_or_business:"주부",purpose:"생활비",fund_source:"배우자 근로소득",join_date:"2019-03-01",kyc_date:"2023-12-01"},
    {id:"BL03",name:"신재호",type:"개인",rep_name:null,rep_birth:null,rep_nationality:null,birth_or_open:"2000-07-20",nationality:"대한민국",residence:"거주자",address:"경기 의정부시 신곡동 55",beneficial_owner:{name:"신재호",nationality:"대한민국",birth:"2000-07-20",share:"100%"},risk:"고",asset:"약 50만원",job_or_business:"무직",purpose:"생활비",fund_source:"불명확",join_date:"2024-01-10",kyc_date:"2024-01-10"}
  ],
  transactions:[
    {date:"2024-03-04",time:"10:30",content:"전자금융",trader:"류미영",pay:null,receive:30000000,balance:55000000,note:"금감원 사칭 이체 (피해자)"},
    {date:"2024-03-04",time:"10:35",content:"전자금융",trader:"오세훈",pay:null,receive:30000000,balance:30200000,note:"타행이체수취"},
    {date:"2024-03-04",time:"10:40",content:"ATM기이용",trader:"오세훈",pay:2000000,receive:null,balance:28200000,note:"현금인출"},
    {date:"2024-03-04",time:"10:45",content:"ATM기이용",trader:"오세훈",pay:2000000,receive:null,balance:26200000,note:"현금인출"},
    {date:"2024-03-04",time:"11:00",content:"전자금융",trader:"오세훈",pay:25000000,receive:null,balance:1200000,note:"신재호 계좌이체"},
    {date:"2024-03-04",time:"11:10",content:"전자금융",trader:"신재호",pay:null,receive:25000000,balance:25300000,note:"타행이체수취"},
    {date:"2024-03-04",time:"11:20",content:"전자금융",trader:"신재호",pay:24500000,receive:null,balance:800000,note:"해외송금(중국)"}
  ],
  hints:[
    {type:"news",title:"경찰청 보이스피싱 대포통장 특징",content:"보이스피싱 대포통장 특징:\n① 피해자→대포통장 즉시 이체 (수분 내)\n② 수취 즉시 ATM 현금인출 또는 타계좌 재이체\n③ 신규 개설 계좌 활용\n④ 최종 해외(중국·동남아) 계좌로 이체"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"오세훈, 신재호",
    keywords:["보이스피싱","대포통장","즉시인출","계좌릴레이","해외송금"],
    customer_trait:"20대 초반 신규개설 고위험, 자금출처 불명, 전액 즉시 이체",
    suspicious_type:"보이스피싱 대포통장 이용, 릴레이 이체",
    key_reason:"피해자 이체 직후 5분 내 ATM 인출+릴레이, 최종 중국 해외송금",
    intent:"보이스피싱 자금 흐름 탐지 훈련"
  }
},

// 은행 - 중(보통): KYC 5명
{
  id:"bank_mid", title:"🏦 은행업 - 스머핑(현금 분산입금) (중)",
  industry:"bank", difficulty:"mid", isActive:true, createdAt:1700001002,
  kyc_list:[
    {id:"BM01",name:"장미나",type:"개인",rep_name:null,rep_birth:null,rep_nationality:null,birth_or_open:"1980-08-15",nationality:"대한민국",residence:"거주자",address:"서울 관악구 봉천동 500",beneficial_owner:{name:"장미나",nationality:"대한민국",birth:"1980-08-15",share:"100%"},risk:"고",asset:"약 2억원",job_or_business:"무직",purpose:"생활자금",fund_source:"불명확",join_date:"2022-02-01",kyc_date:"2024-01-10"},
    {id:"BM02",name:"윤석준",type:"개인",rep_name:null,rep_birth:null,rep_nationality:null,birth_or_open:"1984-03-25",nationality:"대한민국",residence:"거주자",address:"서울 관악구 신림동 300",beneficial_owner:{name:"윤석준",nationality:"대한민국",birth:"1984-03-25",share:"100%"},risk:"고",asset:"약 5천만원",job_or_business:"무직",purpose:"생활자금",fund_source:"불명확",join_date:"2022-02-05",kyc_date:"2024-01-10"},
    {id:"BM03",name:"김보라",type:"개인",rep_name:null,rep_birth:null,rep_nationality:null,birth_or_open:"1987-11-11",nationality:"대한민국",residence:"거주자",address:"경기 수원시 팔달구 55",beneficial_owner:{name:"김보라",nationality:"대한민국",birth:"1987-11-11",share:"100%"},risk:"고",asset:"약 3천만원",job_or_business:"무직",purpose:"생활자금",fund_source:"불명확",join_date:"2022-02-08",kyc_date:"2024-01-10"},
    {id:"BM04",name:"조현태",type:"개인",rep_name:null,rep_birth:null,rep_nationality:null,birth_or_open:"1975-05-05",nationality:"대한민국",residence:"거주자",address:"경기 성남시 분당구 200",beneficial_owner:{name:"조현태",nationality:"대한민국",birth:"1975-05-05",share:"100%"},risk:"저",asset:"약 5억원",job_or_business:"IT기업 임원",purpose:"투자저축",fund_source:"근로소득",join_date:"2018-01-01",kyc_date:"2023-10-01"},
    {id:"BM05",name:"박지현",type:"개인",rep_name:null,rep_birth:null,rep_nationality:null,birth_or_open:"1991-09-09",nationality:"대한민국",residence:"거주자",address:"서울 강남구 압구정동 100",beneficial_owner:{name:"박지현",nationality:"대한민국",birth:"1991-09-09",share:"100%"},risk:"저",asset:"약 8천만원",job_or_business:"회사원",purpose:"급여저축",fund_source:"근로소득",join_date:"2019-05-01",kyc_date:"2023-11-01"}
  ],
  transactions:[
    {date:"2024-03-01",time:"10:00",content:"ATM기이용",trader:"장미나",pay:null,receive:9800000,balance:15000000,note:"현금입금"},
    {date:"2024-03-01",time:"10:15",content:"ATM기이용",trader:"윤석준",pay:null,receive:9700000,balance:12000000,note:"현금입금"},
    {date:"2024-03-01",time:"10:30",content:"ATM기이용",trader:"김보라",pay:null,receive:9900000,balance:11000000,note:"현금입금"},
    {date:"2024-03-01",time:"11:00",content:"전자금융",trader:"장미나",pay:9500000,receive:null,balance:5500000,note:"조현태 계좌이체"},
    {date:"2024-03-01",time:"11:05",content:"전자금융",trader:"윤석준",pay:9500000,receive:null,balance:2500000,note:"조현태 계좌이체"},
    {date:"2024-03-01",time:"11:10",content:"전자금융",trader:"김보라",pay:9500000,receive:null,balance:1500000,note:"조현태 계좌이체"},
    {date:"2024-03-02",time:"10:00",content:"ATM기이용",trader:"장미나",pay:null,receive:9600000,balance:15100000,note:"현금입금"},
    {date:"2024-03-02",time:"10:20",content:"ATM기이용",trader:"윤석준",pay:null,receive:9800000,balance:12300000,note:"현금입금"},
    {date:"2024-03-02",time:"11:10",content:"전자금융",trader:"장미나",pay:9400000,receive:null,balance:5700000,note:"조현태 계좌이체"},
    {date:"2024-03-02",time:"11:15",content:"전자금융",trader:"윤석준",pay:9400000,receive:null,balance:2900000,note:"조현태 계좌이체"},
    {date:"2024-03-03",time:"14:00",content:"전자금융",trader:"박지현",pay:null,receive:3800000,balance:7600000,note:"급여"}
  ],
  hints:[
    {type:"news",title:"KOFIU 현금거래보고(CTR) 회피 스머핑 사례",content:"CTR(1천만원 현금거래보고) 기준 회피 스머핑 특징:\n① 여러 명이 동시에 980~990만원대 현금 입금\n② 입금 직후 동일 계좌로 집결 이체\n③ 무직자 다수 동시 관여\n④ 2~3일 연속 동일 패턴 반복"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"장미나, 윤석준, 김보라",
    keywords:["스머핑","CTR회피","분산현금입금","동일계좌집중","무직자공모"],
    customer_trait:"무직자 3인, 모두 고위험, 동일 시기 계좌 개설, 동일 계좌로 이체",
    suspicious_type:"스머핑(현금 분산입금), CTR 보고 기준 회피",
    key_reason:"3인 동시 980~990만원 현금입금→동일 조현태 계좌 즉시이체 2일 반복",
    intent:"현금 CTR 기준 회피 스머핑 탐지 훈련"
  }
},

// 은행 - 고(어려움): KYC 8명, TBML
{
  id:"bank_high", title:"🏦 은행업 - TBML 무역금융 자금세탁 (고)",
  industry:"bank", difficulty:"high", isActive:true, createdAt:1700001003,
  kyc_list:[
    {id:"BH01",name:"김재원",type:"개인",rep_name:null,rep_birth:null,rep_nationality:null,birth_or_open:"1982-03-15",nationality:"대한민국",residence:"거주자",address:"서울 강남구 테헤란로 123",beneficial_owner:{name:"김재원",nationality:"대한민국",birth:"1982-03-15",share:"100%"},risk:"고",asset:"약 5억원",job_or_business:"무직",purpose:"생활자금",fund_source:"부동산 매각 대금",join_date:"2019-06-01",kyc_date:"2024-01-10"},
    {id:"BH02",name:"박서연",type:"개인",rep_name:null,rep_birth:null,rep_nationality:null,birth_or_open:"1990-07-22",nationality:"대한민국",residence:"거주자",address:"부산 해운대구 마린시티 45",beneficial_owner:{name:"박서연",nationality:"대한민국",birth:"1990-07-22",share:"100%"},risk:"저",asset:"약 1억원",job_or_business:"간호사",purpose:"급여수령",fund_source:"근로소득",join_date:"2020-03-15",kyc_date:"2024-02-01"},
    {id:"BH03",name:"글로벌트레이딩(주)",type:"법인사업자",rep_name:"이민호",rep_birth:"1975-11-08",rep_nationality:"대한민국",birth_or_open:"2018-04-01",nationality:"대한민국",residence:null,address:"서울 중구 을지로 200",beneficial_owner:{name:"오우량",nationality:"중국",birth:"1973-05-20",share:"65%"},risk:"고",asset:"자본금 5천만원",job_or_business:"도소매업/수출입",purpose:"수출입 결제",fund_source:"매출대금",join_date:"2021-09-10",kyc_date:"2024-01-15"},
    {id:"BH04",name:"이정우",type:"개인",rep_name:null,rep_birth:null,rep_nationality:null,birth_or_open:"1968-12-30",nationality:"대한민국",residence:"거주자",address:"인천 남동구 구월로 88",beneficial_owner:{name:"이정우",nationality:"대한민국",birth:"1968-12-30",share:"100%"},risk:"중",asset:"약 3억원",job_or_business:"자영업(식당)",purpose:"사업운영자금",fund_source:"사업소득",join_date:"2017-02-20",kyc_date:"2023-12-05"},
    {id:"BH05",name:"스타테크 개인사업자",type:"개인사업자",rep_name:"최은지",rep_birth:"1988-04-17",rep_nationality:"대한민국",birth_or_open:"2020-01-10",nationality:"대한민국",residence:null,address:"경기 성남시 판교로 333",beneficial_owner:{name:"최은지",nationality:"대한민국",birth:"1988-04-17",share:"100%"},risk:"중",asset:"자본금 1천만원",job_or_business:"IT서비스업",purpose:"사업운영",fund_source:"용역대금",join_date:"2020-02-01",kyc_date:"2024-01-20"},
    {id:"BH06",name:"황민수",type:"개인",rep_name:null,rep_birth:null,rep_nationality:null,birth_or_open:"1995-08-03",nationality:"대한민국",residence:"거주자",address:"서울 마포구 합정동 77",beneficial_owner:{name:"황민수",nationality:"대한민국",birth:"1995-08-03",share:"100%"},risk:"저",asset:"약 5천만원",job_or_business:"직장인(제조업)",purpose:"급여저축",fund_source:"근로소득",join_date:"2021-05-11",kyc_date:"2024-03-01"},
    {id:"BH07",name:"드림파이낸스 대부(주)",type:"법인사업자",rep_name:"강동원",rep_birth:"1970-09-25",rep_nationality:"대한민국",birth_or_open:"2015-07-01",nationality:"대한민국",residence:null,address:"서울 강서구 마곡대로 100",beneficial_owner:{name:"우르겐 바트",nationality:"몽골",birth:"1968-03-11",share:"51%"},risk:"고",asset:"자본금 3억원",job_or_business:"금융업/대부업",purpose:"대출채권 회수",fund_source:"대출이자 수입",join_date:"2019-11-01",kyc_date:"2024-02-10"},
    {id:"BH08",name:"손미래",type:"개인",rep_name:null,rep_birth:null,rep_nationality:null,birth_or_open:"1978-02-14",nationality:"미국",residence:"비거주자",address:"캘리포니아 로스앤젤레스 1234",beneficial_owner:{name:"손미래",nationality:"미국",birth:"1978-02-14",share:"100%"},risk:"고",asset:"약 20억원",job_or_business:"투자자",purpose:"부동산 투자",fund_source:"투자수익",join_date:"2022-08-05",kyc_date:"2024-01-25"}
  ],
  transactions:[
    {date:"2024-03-01",time:"09:15",content:"전자금융",trader:"김재원",pay:null,receive:48000000,balance:52000000,note:"해외송금수취(홍콩)"},
    {date:"2024-03-01",time:"09:47",content:"전자금융",trader:"김재원",pay:45000000,receive:null,balance:7000000,note:"타은행이체"},
    {date:"2024-03-02",time:"14:22",content:"기업금융",trader:"글로벌트레이딩(주)",pay:null,receive:120000000,balance:150000000,note:"해외송금수취(중국)"},
    {date:"2024-03-02",time:"15:10",content:"기업금융",trader:"글로벌트레이딩(주)",pay:118000000,receive:null,balance:32000000,note:"해외송금(두바이)"},
    {date:"2024-03-03",time:"11:30",content:"전자금융",trader:"박서연",pay:null,receive:2800000,balance:3500000,note:"급여"},
    {date:"2024-03-03",time:"16:00",content:"ATM기이용",trader:"김재원",pay:null,receive:47000000,balance:54000000,note:"해외송금수취(홍콩)"},
    {date:"2024-03-03",time:"16:35",content:"전자금융",trader:"김재원",pay:46000000,receive:null,balance:8000000,note:"타은행이체"},
    {date:"2024-03-04",time:"10:00",content:"기업금융",trader:"글로벌트레이딩(주)",pay:null,receive:95000000,balance:127000000,note:"해외송금수취(말레이시아)"},
    {date:"2024-03-04",time:"10:50",content:"기업금융",trader:"글로벌트레이딩(주)",pay:93000000,receive:null,balance:34000000,note:"해외송금(두바이)"},
    {date:"2024-03-05",time:"09:22",content:"전자금융",trader:"손미래",pay:null,receive:300000000,balance:320000000,note:"해외송금수취(미국)"},
    {date:"2024-03-05",time:"10:00",content:"전자금융",trader:"손미래",pay:295000000,receive:null,balance:25000000,note:"타은행이체"},
    {date:"2024-03-06",time:"09:00",content:"전자금융",trader:"황민수",pay:null,receive:3200000,balance:5100000,note:"급여"},
    {date:"2024-03-06",time:"14:30",content:"기업금융",trader:"드림파이낸스 대부(주)",pay:null,receive:80000000,balance:95000000,note:"해외송금수취(몽골)"},
    {date:"2024-03-06",time:"15:20",content:"기업금융",trader:"드림파이낸스 대부(주)",pay:78000000,receive:null,balance:17000000,note:"해외송금(케이맨)"}
  ],
  hints:[
    {type:"news",title:"KOFIU 2024 무역금융(TBML) 자금세탁 유형",content:"무역금융(TBML) 자금세탁 핵심 특징:\n① 단기간 대규모 해외자금 수취 후 즉시 재송금\n② 실소유자와 대표자 국적 불일치 (중국·몽골 국적)\n③ 자본금 대비 과도한 거래규모\n④ 두바이·케이맨 등 조세피난처 활용\n⑤ 반복적 입금→2시간 이내 재송금 패턴"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"글로벌트레이딩(주)",
    keywords:["무역금융(TBML)","중국국적실소유자","해외즉시재송금","두바이환치기","자본금대비과다거래"],
    customer_trait:"법인, 실소유자 중국 국적(65%), 고위험, 자본금 5천만원 vs 억대 거래",
    suspicious_type:"무역기반 자금세탁(TBML), 제3국 경유 환치기",
    key_reason:"수취 후 2시간 이내 90% 이상 두바이 재송금, 3일 반복 패턴",
    intent:"무역서류 위장 다국적 자금세탁 탐지 훈련"
  }
},

// ══════════ 📈 증권업 ══════════

{
  id:"sec_low", title:"📈 증권업 - 내부자거래 기초 (하)",
  industry:"securities", difficulty:"low", isActive:true, createdAt:1700001010,
  kyc_list:[
    {id:"SL01",name:"강태수",type:"개인",birth_or_open:"1975-08-22",nationality:"대한민국",residence:"거주자",address:"서울 강남구 도곡동 300",beneficial_owner:{name:"강태수",nationality:"대한민국",birth:"1975-08-22",share:"100%"},risk:"고",asset:"약 20억원",job_or_business:"바이오팜(주) CFO",purpose:"투자",fund_source:"근로소득+투자수익",join_date:"2016-05-01",kyc_date:"2024-01-05"},
    {id:"SL02",name:"한수연",type:"개인",birth_or_open:"1978-12-10",nationality:"대한민국",residence:"거주자",address:"서울 강남구 도곡동 305",beneficial_owner:{name:"강태수",nationality:"대한민국",birth:"1975-08-22",share:"100%"},risk:"중",asset:"약 5억원",job_or_business:"주부(강태수 배우자)",purpose:"투자",fund_source:"배우자 소득",join_date:"2020-03-01",kyc_date:"2024-01-10"},
    {id:"SL03",name:"이유진",type:"개인",birth_or_open:"1982-06-30",nationality:"대한민국",residence:"거주자",address:"경기 성남시 분당구 판교동 200",beneficial_owner:{name:"이유진",nationality:"대한민국",birth:"1982-06-30",share:"100%"},risk:"저",asset:"약 5천만원",job_or_business:"IT직장인",purpose:"장기투자",fund_source:"근로소득",join_date:"2021-05-01",kyc_date:"2023-11-01"}
  ],
  transactions:[
    {date:"2024-02-28",time:"14:00",content:"매수",trader:"한수연",amount:200000000,balance:450000000,stock_qty:500000,stock_name:"바이오팜(주)",note:"공시 전일 대량매수"},
    {date:"2024-03-01",time:"09:00",content:"공시발표",trader:"-",amount:null,balance:null,stock_qty:null,stock_name:"바이오팜(주)",note:"임상3상 성공 호재 발표"},
    {date:"2024-03-01",time:"10:00",content:"매도",trader:"한수연",amount:300000000,balance:600000000,stock_qty:500000,stock_name:"바이오팜(주)",note:"공시 당일 즉시 매도(차익 1억)"},
    {date:"2024-03-04",time:"14:00",content:"입금",trader:"이유진",amount:1000000,balance:3500000,stock_qty:null,stock_name:null,note:""}
  ],
  hints:[
    {type:"news",title:"금감원 내부자거래 적발 - 공시 전 배우자 계좌 매수",content:"내부자거래(가족계좌) 특징:\n① 임원이 직접 거래하지 않고 배우자·자녀 계좌 이용\n② 호재 공시 직전 대량 매수\n③ 공시 직후 즉시 매도 차익 실현\n④ KYC 실소유자가 동일인"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"한수연 (강태수 CFO 배우자 이용 내부자거래)",
    keywords:["내부자거래","배우자계좌이용","공시전매수","공시후즉시매도","실소유자동일"],
    customer_trait:"바이오팜 CFO 배우자, KYC 실소유자=강태수, 공시 전일 2억 매수",
    suspicious_type:"내부자거래, 가족 계좌 우회",
    key_reason:"CFO 배우자가 임상성공 공시 전일 매수→공시 당일 매도 1억 차익",
    intent:"내부자 정보 이용 거래 탐지 훈련"
  }
},

{
  id:"sec_mid", title:"📈 증권업 - 주가조작 Pump & Dump (중)",
  industry:"securities", difficulty:"mid", isActive:true, createdAt:1700001011,
  kyc_list:[
    {id:"SM01",name:"윤상혁",type:"개인",birth_or_open:"1979-05-20",nationality:"대한민국",residence:"거주자",address:"서울 서초구 반포대로 55",beneficial_owner:{name:"윤상혁",nationality:"대한민국",birth:"1979-05-20",share:"100%"},risk:"고",asset:"약 30억원",job_or_business:"전업투자자",purpose:"주식투자",fund_source:"투자수익",join_date:"2018-01-10",kyc_date:"2024-01-05"},
    {id:"SM02",name:"퍼스트에셋(주)",type:"법인사업자",rep_name:"조현준",rep_birth:"1965-07-30",rep_nationality:"대한민국",birth_or_open:"2010-03-15",nationality:"대한민국",address:"서울 영등포구 여의대로 108",beneficial_owner:{name:"조현준",nationality:"대한민국",birth:"1965-07-30",share:"100%"},risk:"고",asset:"자본금 50억원",job_or_business:"금융업/투자자문",purpose:"투자 및 자산운용",fund_source:"투자수익",join_date:"2015-06-01",kyc_date:"2024-01-10"},
    {id:"SM03",name:"미래인베스트(주)",type:"법인사업자",rep_name:"박찬일",rep_birth:"1969-12-01",rep_nationality:"대한민국",birth_or_open:"2019-01-20",nationality:"대한민국",address:"서울 강남구 역삼동 222",beneficial_owner:{name:"박찬일",nationality:"대한민국",birth:"1969-12-01",share:"100%"},risk:"고",asset:"자본금 3억원",job_or_business:"금융업/투자중개",purpose:"주식투자",fund_source:"투자수익",join_date:"2020-03-01",kyc_date:"2024-01-30"},
    {id:"SM04",name:"이수민",type:"개인",birth_or_open:"1994-06-12",nationality:"대한민국",residence:"거주자",address:"서울 마포구 연남동 55",beneficial_owner:{name:"이수민",nationality:"대한민국",birth:"1994-06-12",share:"100%"},risk:"저",asset:"약 2천만원",job_or_business:"회사원",purpose:"소액투자",fund_source:"근로소득",join_date:"2022-05-01",kyc_date:"2024-02-01"},
    {id:"SM05",name:"홍길준",type:"개인",birth_or_open:"1985-09-12",nationality:"대한민국",residence:"거주자",address:"경기 수원시 광교로 200",beneficial_owner:{name:"홍길준",nationality:"대한민국",birth:"1985-09-12",share:"100%"},risk:"중",asset:"약 1억원",job_or_business:"공무원",purpose:"노후대비 투자",fund_source:"근로소득",join_date:"2020-07-01",kyc_date:"2023-11-20"}
  ],
  transactions:[
    {date:"2024-03-04",time:"09:02",content:"매수",trader:"윤상혁",amount:500000000,balance:800000000,stock_qty:100000,stock_name:"바이오텍A",note:"시간외거래"},
    {date:"2024-03-04",time:"09:05",content:"매수",trader:"퍼스트에셋(주)",amount:300000000,balance:1200000000,stock_qty:60000,stock_name:"바이오텍A",note:"시간외거래"},
    {date:"2024-03-04",time:"09:10",content:"매수",trader:"미래인베스트(주)",amount:200000000,balance:700000000,stock_qty:40000,stock_name:"바이오텍A",note:"시간외거래"},
    {date:"2024-03-04",time:"10:30",content:"매도",trader:"윤상혁",amount:650000000,balance:1350000000,stock_qty:100000,stock_name:"바이오텍A",note:"고점 동시매도"},
    {date:"2024-03-04",time:"10:35",content:"매도",trader:"퍼스트에셋(주)",amount:390000000,balance:1550000000,stock_qty:60000,stock_name:"바이오텍A",note:"고점 동시매도"},
    {date:"2024-03-04",time:"10:40",content:"매도",trader:"미래인베스트(주)",amount:260000000,balance:910000000,stock_qty:40000,stock_name:"바이오텍A",note:"고점 동시매도"},
    {date:"2024-03-05",time:"09:01",content:"매수",trader:"윤상혁",amount:480000000,balance:870000000,stock_qty:95000,stock_name:"바이오텍A",note:"시간외거래"},
    {date:"2024-03-05",time:"09:04",content:"매수",trader:"퍼스트에셋(주)",amount:290000000,balance:1260000000,stock_qty:57000,stock_name:"바이오텍A",note:"시간외거래"},
    {date:"2024-03-05",time:"11:00",content:"매도",trader:"윤상혁",amount:600000000,balance:1350000000,stock_qty:95000,stock_name:"바이오텍A",note:""},
    {date:"2024-03-05",time:"11:05",content:"매도",trader:"퍼스트에셋(주)",amount:365000000,balance:1565000000,stock_qty:57000,stock_name:"바이오텍A",note:""},
    {date:"2024-03-06",time:"14:00",content:"입금",trader:"이수민",amount:200000,balance:500000,stock_qty:null,stock_name:null,note:""}
  ],
  hints:[
    {type:"news",title:"금감원 시간외거래 주가조작 적발 사례",content:"주가조작(Pump & Dump) 특징:\n① 개장 전 시간외거래로 대량 매수 후 주가 상승 유도\n② 2~3개 계좌 협력 매수로 인위적 호가 형성\n③ 장중 고점 동시 매도로 차익 실현\n④ 3일 연속 동일 패턴 반복"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"윤상혁, 퍼스트에셋(주), 미래인베스트(주)",
    keywords:["주가조작","시간외대량매수","고점동시매도","3일반복패턴","세력공모"],
    customer_trait:"전업투자자+투자자문법인+투자중개법인, 3자 모두 고위험",
    suspicious_type:"주가조작(Pump & Dump), 공모매매",
    key_reason:"3일 연속 시간외거래 대량매수→장중 동시매도, 반복 패턴",
    intent:"조직적 주가조작 패턴 탐지 훈련"
  }
},

{
  id:"sec_high", title:"📈 증권업 - 통정매매+차명계좌 복합 (고)",
  industry:"securities", difficulty:"high", isActive:true, createdAt:1700001012,
  kyc_list:[
    {id:"SH01",name:"권성훈",type:"개인",birth_or_open:"1976-11-30",nationality:"대한민국",residence:"거주자",address:"서울 강남구 신사동 100",beneficial_owner:{name:"권성훈",nationality:"대한민국",birth:"1976-11-30",share:"100%"},risk:"고",asset:"약 20억원",job_or_business:"전업투자자",purpose:"투자",fund_source:"투자수익",join_date:"2016-03-01",kyc_date:"2024-01-05"},
    {id:"SH02",name:"박준서",type:"개인",birth_or_open:"1978-08-18",nationality:"대한민국",residence:"거주자",address:"서울 강남구 논현동 200",beneficial_owner:{name:"권성훈",nationality:"대한민국",birth:"1976-11-30",share:"100%"},risk:"고",asset:"약 15억원",job_or_business:"전업투자자",purpose:"투자",fund_source:"투자수익",join_date:"2016-03-01",kyc_date:"2024-01-05"},
    {id:"SH03",name:"알파전략(주)",type:"법인사업자",rep_name:"권성훈",rep_birth:"1976-11-30",rep_nationality:"대한민국",birth_or_open:"2021-05-01",nationality:"대한민국",address:"서울 강남구 신사동 101",beneficial_owner:{name:"권성훈",nationality:"대한민국",birth:"1976-11-30",share:"100%"},risk:"고",asset:"자본금 10억원",job_or_business:"금융업/투자일임",purpose:"투자운용",fund_source:"운용수익",join_date:"2021-06-01",kyc_date:"2024-01-10"},
    {id:"SH04",name:"이상미",type:"개인",birth_or_open:"1980-04-10",nationality:"대한민국",residence:"거주자",address:"서울 서초구 잠원동 300",beneficial_owner:{name:"권성훈",nationality:"대한민국",birth:"1976-11-30",share:"100%"},risk:"고",asset:"약 10억원",job_or_business:"주부(권성훈 배우자)",purpose:"투자",fund_source:"배우자 소득",join_date:"2019-09-01",kyc_date:"2024-01-12"},
    {id:"SH05",name:"정민채",type:"개인",birth_or_open:"1995-07-20",nationality:"대한민국",residence:"거주자",address:"서울 강남구 역삼동 100",beneficial_owner:{name:"정민채",nationality:"대한민국",birth:"1995-07-20",share:"100%"},risk:"저",asset:"약 3천만원",job_or_business:"회사원(마케팅)",purpose:"소액투자",fund_source:"근로소득",join_date:"2022-08-01",kyc_date:"2024-02-01"},
    {id:"SH06",name:"오세호",type:"개인",birth_or_open:"1988-02-14",nationality:"대한민국",residence:"거주자",address:"경기 고양시 일산동구 200",beneficial_owner:{name:"오세호",nationality:"대한민국",birth:"1988-02-14",share:"100%"},risk:"저",asset:"약 5천만원",job_or_business:"IT직장인",purpose:"장기투자",fund_source:"근로소득",join_date:"2020-03-01",kyc_date:"2023-11-01"},
    {id:"SH07",name:"김하은",type:"개인",birth_or_open:"1993-10-10",nationality:"대한민국",residence:"거주자",address:"서울 마포구 공덕동 100",beneficial_owner:{name:"김하은",nationality:"대한민국",birth:"1993-10-10",share:"100%"},risk:"저",asset:"약 2천만원",job_or_business:"교사",purpose:"노후투자",fund_source:"근로소득",join_date:"2021-06-01",kyc_date:"2023-10-01"},
    {id:"SH08",name:"최용재",type:"개인",birth_or_open:"1970-12-25",nationality:"대한민국",residence:"거주자",address:"서울 송파구 잠실동 500",beneficial_owner:{name:"최용재",nationality:"대한민국",birth:"1970-12-25",share:"100%"},risk:"저",asset:"약 3억원",job_or_business:"사업가(요식업)",purpose:"투자",fund_source:"사업소득",join_date:"2017-04-01",kyc_date:"2023-09-01"}
  ],
  transactions:[
    {date:"2024-03-04",time:"09:30",content:"매수",trader:"권성훈",amount:200000000,balance:600000000,stock_qty:1000000,stock_name:"코스닥소형주",note:"통정매매"},
    {date:"2024-03-04",time:"09:30",content:"매도",trader:"박준서",amount:200000000,balance:800000000,stock_qty:1000000,stock_name:"코스닥소형주",note:"동시체결(통정매매)"},
    {date:"2024-03-04",time:"14:50",content:"매수주문(취소)",trader:"알파전략(주)",amount:150000000,balance:900000000,stock_qty:750000,stock_name:"코스닥소형주",note:"허수주문→취소"},
    {date:"2024-03-04",time:"14:58",content:"매도",trader:"이상미",amount:120000000,balance:700000000,stock_qty:600000,stock_name:"코스닥소형주",note:"허수주문 직후 매도"},
    {date:"2024-03-05",time:"09:30",content:"매수",trader:"박준서",amount:210000000,balance:790000000,stock_qty:1000000,stock_name:"코스닥소형주",note:"통정매매"},
    {date:"2024-03-05",time:"09:30",content:"매도",trader:"권성훈",amount:210000000,balance:610000000,stock_qty:1000000,stock_name:"코스닥소형주",note:"동시체결"},
    {date:"2024-03-06",time:"11:00",content:"출금",trader:"알파전략(주)",amount:200000000,balance:700000000,stock_qty:null,stock_name:null,note:"권성훈 개인계좌 이체(수익환원)"},
    {date:"2024-03-06",time:"14:00",content:"입금",trader:"정민채",amount:300000,balance:800000,stock_qty:null,stock_name:null,note:"일반거래"},
    {date:"2024-03-06",time:"11:00",content:"입금",trader:"오세호",amount:500000,balance:1500000,stock_qty:null,stock_name:null,note:"일반거래"}
  ],
  hints:[
    {type:"news",title:"금감원 복합 시세조종 적발 - 통정매매+허수주문+차명계좌",content:"복합 시세조종 특징:\n① 통정매매: 동일 실소유자 계좌 간 사전 약정 동시 체결\n② 허수주문: 장마감 직전 대량주문 후 즉시 취소\n③ 차명계좌: 배우자 계좌가 실소유자와 동일인\n④ 법인 수익을 개인계좌로 우회 환원"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"권성훈, 박준서, 알파전략(주), 이상미",
    keywords:["통정매매","허수주문","차명계좌","복합시세조종","실소유자동일"],
    customer_trait:"권성훈 실소유: 본인+박준서(차명)+법인+배우자 4개 계좌 연계",
    suspicious_type:"통정매매+허수주문+차명계좌 복합 시세조종",
    key_reason:"4개 계좌 동일 실소유자, 통정매매+허수주문 동시 구사, 수익 법인→개인 환원",
    intent:"복합 시세조종 패턴 탐지 훈련"
  }
},

// ══════════ 💳 전자금융업 ══════════

{
  id:"ep_low", title:"💳 전자금융업 - 불법도박 심야결제 (하)",
  industry:"epayment", difficulty:"low", isActive:true, createdAt:1700001020,
  kyc_list:[
    {id:"EL01",name:"류민준",type:"개인",birth_or_open:"1994-02-14",nationality:"대한민국",residence:"거주자",address:"서울 동대문구 전농로 55",beneficial_owner:{name:"류민준",nationality:"대한민국",birth:"1994-02-14",share:"100%"},risk:"고",asset:"약 2천만원",job_or_business:"무직",purpose:"온라인쇼핑",fund_source:"기타",join_date:"2023-01-15",kyc_date:"2024-01-05"},
    {id:"EL02",name:"최강현",type:"개인",birth_or_open:"1989-10-30",nationality:"대한민국",residence:"거주자",address:"경기 고양시 일산동구 50",beneficial_owner:{name:"최강현",nationality:"대한민국",birth:"1989-10-30",share:"100%"},risk:"고",asset:"약 5천만원",job_or_business:"프리랜서",purpose:"온라인구매",fund_source:"근로소득",join_date:"2022-11-01",kyc_date:"2024-02-01"},
    {id:"EL03",name:"김미현",type:"개인",birth_or_open:"2000-03-07",nationality:"대한민국",residence:"거주자",address:"대전 유성구 대학로 100",beneficial_owner:{name:"김미현",nationality:"대한민국",birth:"2000-03-07",share:"100%"},risk:"저",asset:"약 1백만원",job_or_business:"대학생",purpose:"소액결제",fund_source:"용돈",join_date:"2023-05-10",kyc_date:"2024-03-01"}
  ],
  transactions:[
    {date:"2024-03-01",time:"02:15",content:"신용카드",trader:"류민준",amount:980000,type:"신용",installment:"일시불",note:"해외 OO사이트"},
    {date:"2024-03-01",time:"02:47",content:"신용카드",trader:"류민준",amount:950000,type:"신용",installment:"일시불",note:"해외 OO사이트"},
    {date:"2024-03-01",time:"03:20",content:"신용카드",trader:"류민준",amount:1000000,type:"신용",installment:"일시불",note:"해외 OO사이트"},
    {date:"2024-03-02",time:"01:30",content:"신용카드",trader:"최강현",amount:990000,type:"신용",installment:"일시불",note:"해외 OO사이트"},
    {date:"2024-03-02",time:"01:55",content:"신용카드",trader:"최강현",amount:970000,type:"신용",installment:"일시불",note:"해외 OO사이트"},
    {date:"2024-03-04",time:"11:00",content:"체크카드",trader:"김미현",amount:15000,type:"체크",installment:null,note:"카페결제"}
  ],
  hints:[
    {type:"news",title:"금감원 불법도박 결제 탐지 가이드",content:"불법 온라인 도박 결제 특징:\n① 심야 새벽(00~04시) 100만원 미만 반복 결제\n② 해외 가맹점 위장 결제\n③ 99만원대 집중(100만원 보고 기준 회피)\n④ 동일 가맹점 단기 3회 이상 반복"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"류민준, 최강현",
    keywords:["불법도박결제","새벽반복결제","100만원미만","해외가맹점위장","고위험고객"],
    customer_trait:"무직/고위험+프리랜서/고위험, 자금출처 불명확, 새벽 반복결제",
    suspicious_type:"불법도박 결제, 100만원 기준 회피 분산결제",
    key_reason:"새벽 01~03시 100만원 미만 반복결제 3회, 해외 동일 가맹점",
    intent:"불법도박 결제 패턴 탐지 훈련"
  }
},

{
  id:"ep_mid", title:"💳 전자금융업 - 선불카드 세탁 (중)",
  industry:"epayment", difficulty:"mid", isActive:true, createdAt:1700001021,
  kyc_list:[
    {id:"EM01",name:"김우재",type:"개인",birth_or_open:"1996-12-01",nationality:"대한민국",residence:"거주자",address:"서울 중랑구 면목동 100",beneficial_owner:{name:"김우재",nationality:"대한민국",birth:"1996-12-01",share:"100%"},risk:"고",asset:"약 1천만원",job_or_business:"무직",purpose:"생활비",fund_source:"불명확",join_date:"2023-09-01",kyc_date:"2024-01-05"},
    {id:"EM02",name:"이재호",type:"개인",birth_or_open:"1998-05-20",nationality:"대한민국",residence:"거주자",address:"서울 중랑구 면목동 101",beneficial_owner:{name:"이재호",nationality:"대한민국",birth:"1998-05-20",share:"100%"},risk:"고",asset:"약 500만원",job_or_business:"무직",purpose:"생활비",fund_source:"불명확",join_date:"2023-09-05",kyc_date:"2024-01-05"},
    {id:"EM03",name:"박수현",type:"개인",birth_or_open:"1993-04-18",nationality:"대한민국",residence:"거주자",address:"서울 중랑구 면목동 102",beneficial_owner:{name:"박수현",nationality:"대한민국",birth:"1993-04-18",share:"100%"},risk:"고",asset:"약 800만원",job_or_business:"무직",purpose:"생활비",fund_source:"불명확",join_date:"2023-09-10",kyc_date:"2024-01-05"},
    {id:"EM04",name:"최미래",type:"개인",birth_or_open:"1990-07-07",nationality:"대한민국",residence:"거주자",address:"경기 구리시 갈매동 50",beneficial_owner:{name:"최미래",nationality:"대한민국",birth:"1990-07-07",share:"100%"},risk:"저",asset:"약 4천만원",job_or_business:"직장인",purpose:"급여저축",fund_source:"근로소득",join_date:"2020-04-01",kyc_date:"2023-11-01"},
    {id:"EM05",name:"이명진",type:"개인",birth_or_open:"1987-02-14",nationality:"대한민국",residence:"거주자",address:"서울 성북구 길음동 300",beneficial_owner:{name:"이명진",nationality:"대한민국",birth:"1987-02-14",share:"100%"},risk:"저",asset:"약 3천만원",job_or_business:"회사원",purpose:"소비",fund_source:"근로소득",join_date:"2021-07-01",kyc_date:"2023-10-01"}
  ],
  transactions:[
    {date:"2024-03-01",time:"10:00",content:"선불카드충전",trader:"김우재",amount:490000,type:"선불",installment:null,note:"편의점 선불카드"},
    {date:"2024-03-01",time:"10:05",content:"선불카드충전",trader:"김우재",amount:490000,type:"선불",installment:null,note:"편의점 선불카드"},
    {date:"2024-03-01",time:"10:10",content:"선불카드충전",trader:"이재호",amount:490000,type:"선불",installment:null,note:"편의점 선불카드"},
    {date:"2024-03-01",time:"10:15",content:"선불카드충전",trader:"이재호",amount:490000,type:"선불",installment:null,note:"편의점 선불카드"},
    {date:"2024-03-01",time:"10:20",content:"선불카드충전",trader:"박수현",amount:490000,type:"선불",installment:null,note:"편의점 선불카드"},
    {date:"2024-03-01",time:"11:00",content:"선불카드사용",trader:"김우재",amount:980000,type:"선불",installment:null,note:"해외 온라인 결제"},
    {date:"2024-03-01",time:"11:05",content:"선불카드사용",trader:"이재호",amount:980000,type:"선불",installment:null,note:"해외 온라인 결제"},
    {date:"2024-03-01",time:"11:10",content:"선불카드사용",trader:"박수현",amount:490000,type:"선불",installment:null,note:"해외 온라인 결제"},
    {date:"2024-03-02",time:"10:00",content:"선불카드충전",trader:"김우재",amount:490000,type:"선불",installment:null,note:"반복"},
    {date:"2024-03-03",time:"14:00",content:"체크카드",trader:"최미래",amount:30000,type:"체크",installment:null,note:"편의점결제"}
  ],
  hints:[
    {type:"news",title:"금감원 선불카드 익명성 악용 자금세탁",content:"선불카드 세탁 특징:\n① 50만원 미만 선불카드 다수 구매 (한도 회피)\n② 즉시 해외 온라인 결제로 현금화\n③ 추적 어려운 익명성 악용\n④ 동일 지역 무직자 동시 행동"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"김우재, 이재호, 박수현",
    keywords:["선불카드세탁","50만원한도회피","해외즉시결제","익명성악용","무직자공모"],
    customer_trait:"동일 지역 무직자 3인, 동시기 가입, 동시 행동",
    suspicious_type:"선불카드 익명성 악용 세탁",
    key_reason:"49만원 선불카드 반복구매→즉시 해외 결제, 3인 동시",
    intent:"선불카드 세탁 탐지 훈련"
  }
},

{
  id:"ep_high", title:"💳 전자금융업 - 환불세탁+OTC 복합 (고)",
  industry:"epayment", difficulty:"high", isActive:true, createdAt:1700001022,
  kyc_list:[
    {id:"EH01",name:"환불왕 개인사업자",type:"개인사업자",rep_name:"정환불",rep_birth:"1985-05-05",rep_nationality:"대한민국",birth_or_open:"2022-01-01",nationality:"대한민국",residence:null,address:"서울 강동구 명일동 100",beneficial_owner:{name:"정환불",nationality:"대한민국",birth:"1985-05-05",share:"100%"},risk:"고",asset:"자본금 1천만원",job_or_business:"전자상거래",purpose:"매출관리",fund_source:"매출대금",join_date:"2022-02-01",kyc_date:"2024-01-05"},
    {id:"EH02",name:"알바팀(주)",type:"법인사업자",rep_name:"정환불",rep_birth:"1985-05-05",rep_nationality:"대한민국",birth_or_open:"2023-06-01",nationality:"대한민국",residence:null,address:"서울 강동구 명일동 101",beneficial_owner:{name:"정환불",nationality:"대한민국",birth:"1985-05-05",share:"100%"},risk:"고",asset:"자본금 1억원",job_or_business:"IT서비스업",purpose:"서비스운영",fund_source:"서비스수수료",join_date:"2023-07-01",kyc_date:"2024-01-10"},
    {id:"EH03",name:"고진동",type:"개인",birth_or_open:"1993-06-15",nationality:"대한민국",residence:"거주자",address:"서울 강동구 명일동 50",beneficial_owner:{name:"정환불",nationality:"대한민국",birth:"1985-05-05",share:"100%"},risk:"고",asset:"약 5천만원",job_or_business:"무직",purpose:"생활비",fund_source:"불명확",join_date:"2023-07-05",kyc_date:"2024-01-10"},
    {id:"EH04",name:"왕다차이",type:"개인",birth_or_open:"1979-06-18",nationality:"중국",residence:"비거주자",address:"중국 상하이 OO로 100",beneficial_owner:{name:"왕다차이",nationality:"중국",birth:"1979-06-18",share:"100%"},risk:"고",asset:"약 50억원",job_or_business:"사업가(무면허환전)",purpose:"OTC환전",fund_source:"불명확",join_date:"2022-04-05",kyc_date:"2024-01-10"},
    {id:"EH05",name:"김정수",type:"개인",birth_or_open:"1990-12-12",nationality:"대한민국",residence:"거주자",address:"경기 안양시 동안구 200",beneficial_owner:{name:"김정수",nationality:"대한민국",birth:"1990-12-12",share:"100%"},risk:"저",asset:"약 3천만원",job_or_business:"회사원",purpose:"온라인쇼핑",fund_source:"근로소득",join_date:"2021-05-01",kyc_date:"2023-12-01"},
    {id:"EH06",name:"박나래",type:"개인",birth_or_open:"1992-09-15",nationality:"대한민국",residence:"거주자",address:"경기 성남시 분당구 100",beneficial_owner:{name:"박나래",nationality:"대한민국",birth:"1992-09-15",share:"100%"},risk:"저",asset:"약 2천만원",job_or_business:"직장인",purpose:"소비",fund_source:"근로소득",join_date:"2021-03-01",kyc_date:"2023-10-01"},
    {id:"EH07",name:"이소율",type:"개인",birth_or_open:"1988-03-22",nationality:"대한민국",residence:"거주자",address:"서울 광진구 자양동 300",beneficial_owner:{name:"이소율",nationality:"대한민국",birth:"1988-03-22",share:"100%"},risk:"저",asset:"약 4천만원",job_or_business:"간호사",purpose:"소비",fund_source:"근로소득",join_date:"2020-09-01",kyc_date:"2023-11-01"},
    {id:"EH08",name:"최준혁",type:"개인",birth_or_open:"1995-07-10",nationality:"대한민국",residence:"거주자",address:"서울 노원구 공릉동 100",beneficial_owner:{name:"최준혁",nationality:"대한민국",birth:"1995-07-10",share:"100%"},risk:"저",asset:"약 1천만원",job_or_business:"대학원생",purpose:"소액소비",fund_source:"알바",join_date:"2023-03-01",kyc_date:"2024-01-01"}
  ],
  transactions:[
    {date:"2024-03-01",time:"09:00",content:"가상계좌",trader:"고진동",amount:5000000,type:"가상계좌",installment:null,note:"환불왕 쇼핑몰 결제(허위)"},
    {date:"2024-03-01",time:"09:30",content:"환불",trader:"환불왕 개인사업자",amount:4900000,type:"환불",installment:null,note:"환불→알바팀(주) 계좌"},
    {date:"2024-03-02",time:"09:00",content:"가상계좌",trader:"고진동",amount:8000000,type:"가상계좌",installment:null,note:"허위 결제"},
    {date:"2024-03-02",time:"09:30",content:"환불",trader:"환불왕 개인사업자",amount:7900000,type:"환불",installment:null,note:"환불→알바팀(주) 계좌"},
    {date:"2024-03-03",time:"10:00",content:"가상계좌",trader:"왕다차이",amount:4900000,type:"가상계좌",installment:null,note:"위안화→KRW OTC"},
    {date:"2024-03-03",time:"10:05",content:"가상계좌",trader:"왕다차이",amount:4800000,type:"가상계좌",installment:null,note:"위안화→KRW OTC"},
    {date:"2024-03-03",time:"10:30",content:"가상계좌",trader:"환불왕 개인사업자",amount:9500000,type:"가상계좌",installment:null,note:"OTC 처리→중국계좌"},
    {date:"2024-03-04",time:"14:00",content:"신용카드",trader:"김정수",amount:50000,type:"신용",installment:"일시불",note:"정상구매"},
    {date:"2024-03-04",time:"11:00",content:"체크카드",trader:"박나래",amount:30000,type:"체크",installment:null,note:"카페결제"}
  ],
  hints:[
    {type:"news",title:"금감원 전자상거래 환불세탁+OTC 복합 사례",content:"환불세탁+불법OTC 복합 특징:\n① 허위 결제→동일 실소유자 계좌 환불 반복\n② 동일 개인사업자가 무면허 OTC 중개 병행\n③ 중국 비거주자 위안화→KRW 무등록 환전\n④ 개인사업자+법인 동일 실소유자"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"환불왕 개인사업자, 알바팀(주), 고진동, 왕다차이 (정환불 연루)",
    keywords:["환불세탁","불법OTC","동일실소유자","위안화무면허환전","복합자금세탁"],
    customer_trait:"정환불 실소유: 개인사업자+법인+무직공범 연계, 중국비거주자 OTC",
    suspicious_type:"전자상거래 환불세탁+불법 OTC 환전 복합",
    key_reason:"허위결제→환불 3일 반복+중국 위안화 무면허 OTC 동시 운영",
    intent:"복합 전자금융 세탁 탐지 훈련"
  }
},

// ══════════ ₿ 가상자산 ══════════

{
  id:"cr_low", title:"₿ 가상자산 #1 - 다단계 사기 기초 (하)",
  industry:"crypto", difficulty:"low", isActive:true, createdAt:1700001030,
  kyc_list:[
    {id:"CL01",name:"코인트리 개인사업자",type:"개인사업자",rep_name:"수익왕",rep_birth:"1985-12-12",rep_nationality:"대한민국",birth_or_open:"2023-04-01",nationality:"대한민국",residence:null,address:"서울 강남구 논현동 500",beneficial_owner:{name:"수익왕",nationality:"대한민국",birth:"1985-12-12",share:"100%"},risk:"고",asset:"자본금 5천만원",job_or_business:"가상자산 투자정보업",purpose:"수수료수취",fund_source:"수수료",join_date:"2023-05-01",kyc_date:"2024-01-05"},
    {id:"CL02",name:"최피해자",type:"개인",birth_or_open:"1975-03-20",nationality:"대한민국",residence:"거주자",address:"서울 강북구 미아동 200",beneficial_owner:{name:"최피해자",nationality:"대한민국",birth:"1975-03-20",share:"100%"},risk:"저",asset:"약 5천만원",job_or_business:"주부",purpose:"투자(다단계유도)",fund_source:"저축",join_date:"2023-06-01",kyc_date:"2024-01-10"},
    {id:"CL03",name:"이피해자",type:"개인",birth_or_open:"1968-09-09",nationality:"대한민국",residence:"거주자",address:"경기 부천시 원미구 100",beneficial_owner:{name:"이피해자",nationality:"대한민국",birth:"1968-09-09",share:"100%"},risk:"저",asset:"약 3천만원",job_or_business:"퇴직자",purpose:"투자(다단계유도)",fund_source:"퇴직금",join_date:"2023-06-05",kyc_date:"2024-01-10"}
  ],
  transactions:[
    {date:"2024-03-01",time:"10:00",content:"입금",trader:"최피해자",amount:30000000,balance:31000000,qty:null,coin:null,note:"다단계 투자금(피해자)"},
    {date:"2024-03-01",time:"10:30",content:"입금",trader:"이피해자",amount:20000000,balance:21000000,qty:null,coin:null,note:"다단계 투자금(피해자)"},
    {date:"2024-03-01",time:"11:00",content:"출금",trader:"코인트리 개인사업자",amount:49000000,balance:1000000,qty:null,coin:null,note:"운영자 계좌 이체(편취)"},
    {date:"2024-03-02",time:"09:00",content:"입금",trader:"최피해자",amount:15000000,balance:16000000,qty:null,coin:null,note:"추가 투자금"},
    {date:"2024-03-02",time:"09:30",content:"출금",trader:"코인트리 개인사업자",amount:14500000,balance:1500000,qty:null,coin:null,note:"운영자 계좌 이체"}
  ],
  hints:[
    {type:"news",title:"금융위 가상자산 다단계 사기 주의보",content:"가상자산 다단계 사기 특징:\n① 고수익 보장 SNS 홍보\n② 투자금 수취 즉시 운영자 계좌 이전\n③ 투자자에게 실제 코인 지급 없음\n④ 신설 투자정보업체 활용"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"코인트리 개인사업자 (수익왕)",
    keywords:["가상자산다단계","투자금편취","즉시이체","고수익사기","신설업체"],
    customer_trait:"투자정보업 신설, 피해자 투자금 즉시 자기계좌 이전",
    suspicious_type:"가상자산 다단계 사기, 투자금 편취",
    key_reason:"피해자 투자금 수취 즉시 운영자 계좌로 전액 이전 2일 반복",
    intent:"가상자산 다단계 사기 탐지 훈련"
  }
},

{
  id:"cr_mid", title:"₿ 가상자산 #2 - 프라이버시코인 세탁 (중)",
  industry:"crypto", difficulty:"mid", isActive:true, createdAt:1700001031,
  kyc_list:[
    {id:"CM01",name:"변하늘",type:"개인",birth_or_open:"1991-06-25",nationality:"대한민국",residence:"거주자",address:"서울 송파구 올림픽로 200",beneficial_owner:{name:"변하늘",nationality:"대한민국",birth:"1991-06-25",share:"100%"},risk:"고",asset:"약 1억원",job_or_business:"무직",purpose:"투자",fund_source:"기타",join_date:"2022-07-01",kyc_date:"2024-01-10"},
    {id:"CM02",name:"다크체인 유한회사",type:"법인사업자",rep_name:"알렉세이 볼코프",rep_birth:"1975-11-01",rep_nationality:"러시아",birth_or_open:"2023-01-10",nationality:"대한민국",residence:null,address:"서울 강남구 역삼동 500",beneficial_owner:{name:"알렉세이 볼코프",nationality:"러시아",birth:"1975-11-01",share:"100%"},risk:"고",asset:"자본금 5천만원",job_or_business:"정보통신업/블록체인",purpose:"블록체인 개발",fund_source:"투자유치",join_date:"2023-02-01",kyc_date:"2024-01-20"},
    {id:"CM03",name:"이주호",type:"개인",birth_or_open:"1987-09-11",nationality:"대한민국",residence:"거주자",address:"경기 용인시 기흥구 333",beneficial_owner:{name:"이주호",nationality:"대한민국",birth:"1987-09-11",share:"100%"},risk:"중",asset:"약 5천만원",job_or_business:"직장인(금융권)",purpose:"투자",fund_source:"근로소득",join_date:"2021-01-01",kyc_date:"2023-12-01"},
    {id:"CM04",name:"김채린",type:"개인",birth_or_open:"1998-12-25",nationality:"대한민국",residence:"거주자",address:"서울 은평구 연서로 70",beneficial_owner:{name:"김채린",nationality:"대한민국",birth:"1998-12-25",share:"100%"},risk:"저",asset:"약 500만원",job_or_business:"대학생",purpose:"소액투자",fund_source:"용돈",join_date:"2023-09-01",kyc_date:"2024-02-01"},
    {id:"CM05",name:"장윤호",type:"개인",birth_or_open:"1990-04-20",nationality:"대한민국",residence:"거주자",address:"서울 강남구 개포동 100",beneficial_owner:{name:"장윤호",nationality:"대한민국",birth:"1990-04-20",share:"100%"},risk:"저",asset:"약 3천만원",job_or_business:"IT직장인",purpose:"투자",fund_source:"근로소득",join_date:"2021-06-01",kyc_date:"2023-10-01"}
  ],
  transactions:[
    {date:"2024-03-01",time:"11:00",content:"입금",trader:"변하늘",amount:50000000,balance:55000000,qty:null,coin:null,note:"은행이체"},
    {date:"2024-03-01",time:"11:30",content:"매수",trader:"변하늘",amount:48000000,balance:7000000,qty:240,coin:"XMR(모네로)",note:""},
    {date:"2024-03-01",time:"12:00",content:"출금",trader:"변하늘",amount:48000000,balance:7000000,qty:240,coin:"XMR(모네로)",note:"타거래소 즉시 출금"},
    {date:"2024-03-02",time:"10:00",content:"입금",trader:"다크체인 유한회사",amount:200000000,balance:220000000,qty:null,coin:null,note:"법인계좌 이체"},
    {date:"2024-03-02",time:"10:30",content:"매수",trader:"다크체인 유한회사",amount:195000000,balance:25000000,qty:980,coin:"XMR(모네로)",note:""},
    {date:"2024-03-02",time:"11:00",content:"출금",trader:"다크체인 유한회사",amount:195000000,balance:25000000,qty:980,coin:"XMR(모네로)",note:"타거래소 즉시 출금"},
    {date:"2024-03-03",time:"09:00",content:"입금",trader:"변하늘",amount:60000000,balance:67000000,qty:null,coin:null,note:"은행이체"},
    {date:"2024-03-03",time:"09:30",content:"매수",trader:"변하늘",amount:58000000,balance:9000000,qty:290,coin:"XMR(모네로)",note:""},
    {date:"2024-03-03",time:"10:00",content:"출금",trader:"변하늘",amount:58000000,balance:9000000,qty:290,coin:"XMR(모네로)",note:"타거래소 즉시 출금"},
    {date:"2024-03-04",time:"14:00",content:"입금",trader:"이주호",amount:1000000,balance:3000000,qty:null,coin:null,note:""}
  ],
  hints:[
    {type:"news",title:"FATF 2024 프라이버시코인 자금세탁 경보",content:"프라이버시코인 세탁 특징:\n① 입금 즉시 XMR(모네로) 매수→타거래소 출금\n② 러시아 국적 실소유 법인 활용\n③ 반복적 입금→30분 이내 즉시 출금\n④ 믹싱 효과로 자금추적 불가"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"변하늘, 다크체인 유한회사",
    keywords:["프라이버시코인","모네로XMR","입금즉시출금","믹싱","러시아국적실소유"],
    customer_trait:"무직 고위험+러시아 국적 실소유자 신규법인",
    suspicious_type:"프라이버시코인 이용 자금세탁, 믹싱",
    key_reason:"입금 30분 내 XMR 매수→타거래소 즉시 출금 3회 반복",
    intent:"프라이버시코인 자금세탁 탐지 훈련"
  }
},

{
  id:"cr_high", title:"₿ 가상자산 #3 - 북한연계+ICO사기 복합 (고)",
  industry:"crypto", difficulty:"high", isActive:true, createdAt:1700001032,
  kyc_list:[
    {id:"CH01",name:"익명코인 유한회사",type:"법인사업자",rep_name:"박사이버",rep_birth:"1988-03-03",rep_nationality:"대한민국",birth_or_open:"2023-08-01",nationality:"대한민국",residence:null,address:"서울 강남구 삼성동 100",beneficial_owner:{name:"박사이버",nationality:"대한민국",birth:"1988-03-03",share:"100%"},risk:"고",asset:"자본금 1천만원",job_or_business:"IT서비스업",purpose:"IT서비스수수료",fund_source:"용역대금",join_date:"2023-09-01",kyc_date:"2024-01-05"},
    {id:"CH02",name:"해외벌이",type:"개인",birth_or_open:"1985-04-10",nationality:"조선민주주의인민공화국",residence:"비거주자",address:"불명확",beneficial_owner:{name:"해외벌이",nationality:"조선민주주의인민공화국",birth:"1985-04-10",share:"100%"},risk:"고",asset:"불명확",job_or_business:"IT개발자(북한IT요원의심)",purpose:"IT용역대금수취",fund_source:"불명확",join_date:"2023-09-05",kyc_date:"2024-01-08"},
    {id:"CH03",name:"미래코인(주)",type:"법인사업자",rep_name:"황금왕",rep_birth:"1984-01-01",rep_nationality:"대한민국",birth_or_open:"2023-02-01",nationality:"대한민국",residence:null,address:"서울 강남구 역삼동 800",beneficial_owner:{name:"황금왕",nationality:"대한민국",birth:"1984-01-01",share:"100%"},risk:"고",asset:"자본금 5억원",job_or_business:"블록체인/가상자산",purpose:"ICO운영",fund_source:"투자자금",join_date:"2023-03-01",kyc_date:"2024-01-05"},
    {id:"CH04",name:"ICO피해자A",type:"개인",birth_or_open:"1980-06-10",nationality:"대한민국",residence:"거주자",address:"서울 강북구 수유동 100",beneficial_owner:{name:"ICO피해자A",nationality:"대한민국",birth:"1980-06-10",share:"100%"},risk:"저",asset:"약 5천만원",job_or_business:"자영업",purpose:"ICO투자",fund_source:"사업소득",join_date:"2023-04-01",kyc_date:"2024-01-10"},
    {id:"CH05",name:"ICO피해자B",type:"개인",birth_or_open:"1975-11-20",nationality:"대한민국",residence:"거주자",address:"경기 수원시 장안구 200",beneficial_owner:{name:"ICO피해자B",nationality:"대한민국",birth:"1975-11-20",share:"100%"},risk:"저",asset:"약 3천만원",job_or_business:"회사원",purpose:"ICO투자",fund_source:"근로소득",join_date:"2023-04-05",kyc_date:"2024-01-10"},
    {id:"CH06",name:"심정직",type:"개인",birth_or_open:"1992-09-15",nationality:"대한민국",residence:"거주자",address:"서울 강서구 화곡동 200",beneficial_owner:{name:"심정직",nationality:"대한민국",birth:"1992-09-15",share:"100%"},risk:"저",asset:"약 2천만원",job_or_business:"회사원",purpose:"장기투자",fund_source:"근로소득",join_date:"2022-03-01",kyc_date:"2023-11-01"},
    {id:"CH07",name:"홍일반",type:"개인",birth_or_open:"1994-12-20",nationality:"대한민국",residence:"거주자",address:"경기 고양시 덕양구 200",beneficial_owner:{name:"홍일반",nationality:"대한민국",birth:"1994-12-20",share:"100%"},risk:"저",asset:"약 2천만원",job_or_business:"회사원",purpose:"소액투자",fund_source:"근로소득",join_date:"2022-01-01",kyc_date:"2023-10-01"},
    {id:"CH08",name:"오보람",type:"개인",birth_or_open:"1997-07-07",nationality:"대한민국",residence:"거주자",address:"서울 종로구 평창동 100",beneficial_owner:{name:"오보람",nationality:"대한민국",birth:"1997-07-07",share:"100%"},risk:"저",asset:"약 1천만원",job_or_business:"대학원생",purpose:"소액투자",fund_source:"알바",join_date:"2023-06-01",kyc_date:"2024-01-01"}
  ],
  transactions:[
    {date:"2024-03-01",time:"09:00",content:"입금",trader:"익명코인 유한회사",amount:500000000,balance:510000000,qty:null,coin:null,note:"해외 BTC(해킹수익추정)"},
    {date:"2024-03-01",time:"09:30",content:"매수",trader:"익명코인 유한회사",amount:480000000,balance:30000000,qty:9.6,coin:"BTC",note:""},
    {date:"2024-03-01",time:"10:00",content:"출금",trader:"익명코인 유한회사",amount:480000000,balance:30000000,qty:9.6,coin:"BTC",note:"해외지갑출금(믹서의심)"},
    {date:"2024-03-02",time:"11:00",content:"입금",trader:"해외벌이",amount:10000000,balance:12000000,qty:null,coin:null,note:"IT용역대금(북한요원의심)"},
    {date:"2024-03-02",time:"11:30",content:"출금",trader:"해외벌이",amount:9800000,balance:2200000,qty:null,coin:null,note:"해외이체"},
    {date:"2024-03-03",time:"09:00",content:"입금",trader:"ICO피해자A",amount:50000000,balance:55000000,qty:null,coin:null,note:"ICO 투자금"},
    {date:"2024-03-03",time:"09:30",content:"입금",trader:"ICO피해자B",amount:30000000,balance:85000000,qty:null,coin:null,note:"ICO 투자금"},
    {date:"2024-03-03",time:"10:00",content:"출금",trader:"미래코인(주)",amount:78000000,balance:7000000,qty:null,coin:null,note:"운영자 횡령"},
    {date:"2024-03-03",time:"11:00",content:"매수",trader:"미래코인(주)",amount:70000000,balance:7000000,qty:7,coin:"BTC",note:""},
    {date:"2024-03-03",time:"12:00",content:"출금",trader:"미래코인(주)",amount:70000000,balance:7000000,qty:7,coin:"BTC",note:"해외지갑 도주"},
    {date:"2024-03-04",time:"14:00",content:"입금",trader:"심정직",amount:200000,balance:700000,qty:null,coin:null,note:""}
  ],
  hints:[
    {type:"news",title:"OFAC+경찰청 - 북한 연계+ICO사기 복합 자금세탁 경보",content:"복합 자금세탁 특징:\n① 북한 라자루스그룹 해킹수익 국내 거래소 유입+믹서 세탁\n② 북한 IT 요원 직접 거래소 용역대금 수취\n③ ICO 사기: 투자금 수취 즉시 횡령→BTC→해외 도주\n④ 제재국 국적자 직접 계좌 개설"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"익명코인 유한회사, 해외벌이, 미래코인(주) (황금왕)",
    keywords:["북한연계","해킹수익믹싱","ICO사기횡령","북한IT요원","제재위반"],
    customer_trait:"신설IT법인+북한국적비거주자+ICO사기법인, 복합 고위험",
    suspicious_type:"북한연계 자금세탁+ICO사기 복합",
    key_reason:"해외BTC 5억 믹싱+북한IT요원 용역수취+ICO 8억 횡령BTC 도주",
    intent:"북한연계+ICO사기 복합 자금세탁 탐지 훈련"
  }
},

// ══════════ 🎰 카지노업 ══════════

{
  id:"casino_low", title:"🎰 카지노업 - 외화 스머핑 기초 (하)",
  industry:"casino", difficulty:"low", isActive:true, createdAt:1700001040,
  kyc_list:[
    {id:"CAL01",name:"린 펭",type:"개인",birth_or_open:"1982-04-10",nationality:"중국",residence:"비거주자",address:"중국 상하이 XX로 888",beneficial_owner:{name:"린 펭",nationality:"중국",birth:"1982-04-10",share:"100%"},risk:"고",asset:"약 50억원",job_or_business:"사업가",purpose:"관광 및 레저",fund_source:"사업소득",join_date:"2023-10-01",kyc_date:"2024-01-05"},
    {id:"CAL02",name:"왕 웨이",type:"개인",birth_or_open:"1979-08-15",nationality:"중국",residence:"비거주자",address:"중국 베이징 OO로 100",beneficial_owner:{name:"왕 웨이",nationality:"중국",birth:"1979-08-15",share:"100%"},risk:"고",asset:"약 20억원",job_or_business:"무직",purpose:"관광",fund_source:"기타",join_date:"2023-11-01",kyc_date:"2024-01-10"},
    {id:"CAL03",name:"박민우",type:"개인",birth_or_open:"1975-01-20",nationality:"대한민국",residence:"거주자",address:"강원 강릉시 교동 100",beneficial_owner:{name:"박민우",nationality:"대한민국",birth:"1975-01-20",share:"100%"},risk:"중",asset:"약 3억원",job_or_business:"자영업",purpose:"레저",fund_source:"사업소득",join_date:"2022-05-01",kyc_date:"2023-11-01"}
  ],
  transactions:[
    {date:"2024-03-01",time:"14:00",content:"환전",trader:"린 펭",amount_krw:9500000,qty:95,chip:"100달러칩",note:"달러현금 환전"},
    {date:"2024-03-01",time:"14:30",content:"환전",trader:"왕 웨이",amount_krw:9200000,qty:92,chip:"100달러칩",note:"달러현금 환전"},
    {date:"2024-03-01",time:"17:00",content:"칩매도",trader:"린 펭",amount_krw:10200000,qty:102,chip:"100달러칩",note:"원화 지급"},
    {date:"2024-03-01",time:"17:10",content:"칩매도",trader:"왕 웨이",amount_krw:9900000,qty:99,chip:"100달러칩",note:"원화 지급"},
    {date:"2024-03-02",time:"13:00",content:"환전",trader:"린 펭",amount_krw:9400000,qty:94,chip:"100달러칩",note:"달러현금 환전"},
    {date:"2024-03-02",time:"13:15",content:"환전",trader:"왕 웨이",amount_krw:9600000,qty:96,chip:"100달러칩",note:"달러현금 환전"},
    {date:"2024-03-02",time:"18:00",content:"칩매도",trader:"린 펭",amount_krw:10000000,qty:100,chip:"100달러칩",note:"원화 지급"},
    {date:"2024-03-02",time:"18:10",content:"칩매도",trader:"왕 웨이",amount_krw:10100000,qty:101,chip:"100달러칩",note:"원화 지급"},
    {date:"2024-03-03",time:"15:00",content:"입금",trader:"박민우",amount_krw:500000,qty:null,chip:null,note:"원화"}
  ],
  hints:[
    {type:"news",title:"KOFIU 카지노 외화 스머핑 위험 평가",content:"카지노 외화 스머핑 특징:\n① 1천만원 미만 달러 반복 환전 (CTR 회피)\n② 게임 참여 최소화 후 즉시 칩 재환전\n③ 중국·동남아 국적 비거주자 다수\n④ 2일 이상 동일 패턴 반복"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"린 펭, 왕 웨이",
    keywords:["외화스머핑","CTR회피","칩즉시환전","중국국적비거주자","반복패턴"],
    customer_trait:"중국국적 비거주자 2인, 모두 고위험, 게임 최소화",
    suspicious_type:"외화 스머핑, CTR 회피 분산 환전",
    key_reason:"950만원대 달러 반복환전→게임 최소화→즉시 칩매도 2일 반복",
    intent:"카지노 외화 스머핑 탐지 훈련"
  }
},

{
  id:"casino_mid", title:"🎰 카지노업 - 칩 매입·양도 세탁 (중)",
  industry:"casino", difficulty:"mid", isActive:true, createdAt:1700001041,
  kyc_list:[
    {id:"CAM01",name:"황대박",type:"개인",birth_or_open:"1970-03-15",nationality:"대한민국",residence:"거주자",address:"서울 강남구 청담동 100",beneficial_owner:{name:"황대박",nationality:"대한민국",birth:"1970-03-15",share:"100%"},risk:"고",asset:"약 100억원",job_or_business:"사업가",purpose:"레저",fund_source:"사업소득",join_date:"2021-01-01",kyc_date:"2024-01-05"},
    {id:"CAM02",name:"심부름A",type:"개인",birth_or_open:"1995-07-20",nationality:"대한민국",residence:"거주자",address:"서울 관악구 봉천동 200",beneficial_owner:{name:"황대박",nationality:"대한민국",birth:"1970-03-15",share:"100%"},risk:"고",asset:"약 1천만원",job_or_business:"무직",purpose:"대리인",fund_source:"불명확",join_date:"2023-12-01",kyc_date:"2024-01-10"},
    {id:"CAM03",name:"심부름B",type:"개인",birth_or_open:"1997-11-05",nationality:"대한민국",residence:"거주자",address:"서울 관악구 봉천동 201",beneficial_owner:{name:"황대박",nationality:"대한민국",birth:"1970-03-15",share:"100%"},risk:"고",asset:"약 500만원",job_or_business:"무직",purpose:"대리인",fund_source:"불명확",join_date:"2023-12-05",kyc_date:"2024-01-10"},
    {id:"CAM04",name:"이방문",type:"개인",birth_or_open:"1983-06-15",nationality:"대한민국",residence:"거주자",address:"강원 속초시 금호동 100",beneficial_owner:{name:"이방문",nationality:"대한민국",birth:"1983-06-15",share:"100%"},risk:"저",asset:"약 3천만원",job_or_business:"자영업",purpose:"레저",fund_source:"사업소득",join_date:"2022-08-01",kyc_date:"2023-11-01"},
    {id:"CAM05",name:"김관광",type:"개인",birth_or_open:"1988-04-22",nationality:"대한민국",residence:"거주자",address:"서울 마포구 합정동 100",beneficial_owner:{name:"김관광",nationality:"대한민국",birth:"1988-04-22",share:"100%"},risk:"저",asset:"약 5천만원",job_or_business:"직장인",purpose:"레저",fund_source:"근로소득",join_date:"2021-03-01",kyc_date:"2023-10-01"}
  ],
  transactions:[
    {date:"2024-03-01",time:"13:00",content:"칩매입",trader:"심부름A",amount_krw:9800000,qty:98,chip:"100달러칩",note:"현금 칩 구매"},
    {date:"2024-03-01",time:"13:10",content:"칩매입",trader:"심부름B",amount_krw:9700000,qty:97,chip:"100달러칩",note:"현금 칩 구매"},
    {date:"2024-03-01",time:"13:30",content:"칩양도",trader:"심부름A",amount_krw:9800000,qty:98,chip:"100달러칩",note:"황대박에게 칩 양도"},
    {date:"2024-03-01",time:"13:35",content:"칩양도",trader:"심부름B",amount_krw:9700000,qty:97,chip:"100달러칩",note:"황대박에게 칩 양도"},
    {date:"2024-03-01",time:"18:00",content:"칩매도",trader:"황대박",amount_krw:19800000,qty:198,chip:"100달러칩",note:"전량 원화 환전"},
    {date:"2024-03-02",time:"13:00",content:"칩매입",trader:"심부름A",amount_krw:9900000,qty:99,chip:"100달러칩",note:"현금 칩 구매"},
    {date:"2024-03-02",time:"13:10",content:"칩매입",trader:"심부름B",amount_krw:9500000,qty:95,chip:"100달러칩",note:"현금 칩 구매"},
    {date:"2024-03-02",time:"13:30",content:"칩양도",trader:"심부름A",amount_krw:9900000,qty:99,chip:"100달러칩",note:"황대박에게 양도"},
    {date:"2024-03-02",time:"13:35",content:"칩양도",trader:"심부름B",amount_krw:9500000,qty:95,chip:"100달러칩",note:"황대박에게 양도"},
    {date:"2024-03-02",time:"18:30",content:"칩매도",trader:"황대박",amount_krw:19700000,qty:197,chip:"100달러칩",note:"전량 원화 환전"},
    {date:"2024-03-03",time:"14:00",content:"입금",trader:"이방문",amount_krw:500000,qty:null,chip:null,note:""}
  ],
  hints:[
    {type:"news",title:"카지노 칩 양도 통한 스머핑 세탁 사례",content:"칩 매입·양도 세탁 특징:\n① 심부름꾼(대리인)이 1천만원 미만 칩 구매\n② 구매 직후 실소유자에게 칩 양도\n③ 실소유자가 합산하여 원화 환전\n④ CTR 기준 분산 후 집결"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"황대박, 심부름A, 심부름B",
    keywords:["칩양도세탁","대리인이용","CTR분산집결","실소유자동일","무직공모"],
    customer_trait:"황대박 KYC 실소유자로 심부름 2명 등재, 무직 고위험",
    suspicious_type:"칩 매입·양도 이용 스머핑 세탁",
    key_reason:"심부름 2명 각 980~990만원 칩 구매→즉시 황대박 양도→원화 집결 2일 반복",
    intent:"칩 양도 스머핑 세탁 탐지 훈련"
  }
},

{
  id:"casino_high", title:"🎰 카지노업 - PEP+외화환치기+TPML 복합 (고)",
  industry:"casino", difficulty:"high", isActive:true, createdAt:1700001042,
  kyc_list:[
    {id:"CAH01",name:"응우옌 반 민",type:"개인",birth_or_open:"1960-12-01",nationality:"베트남",residence:"비거주자",address:"베트남 하노이 XX구",beneficial_owner:{name:"응우옌 반 민",nationality:"베트남",birth:"1960-12-01",share:"100%"},risk:"고",asset:"약 100억원",job_or_business:"전직 정부관료(장관급)",purpose:"관광 및 레저",fund_source:"불명확",join_date:"2023-05-01",kyc_date:"2024-01-05"},
    {id:"CAH02",name:"베트남스타(주)",type:"법인사업자",rep_name:"이준혁",rep_birth:"1985-07-15",rep_nationality:"대한민국",birth_or_open:"2023-04-01",nationality:"대한민국",residence:null,address:"서울 강남구 봉은사로 200",beneficial_owner:{name:"응우옌 반 민",nationality:"베트남",birth:"1960-12-01",share:"90%"},risk:"고",asset:"자본금 5억원",job_or_business:"투자업/부동산",purpose:"국내 투자",fund_source:"해외 투자수익",join_date:"2023-05-15",kyc_date:"2024-01-10"},
    {id:"CAH03",name:"린 셍 콴",type:"개인",birth_or_open:"1975-06-30",nationality:"캄보디아",residence:"비거주자",address:"캄보디아 프놈펜 OO로 100",beneficial_owner:{name:"린 셍 콴",nationality:"캄보디아",birth:"1975-06-30",share:"100%"},risk:"고",asset:"약 30억원",job_or_business:"카지노 VIP브로커",purpose:"VIP 유치",fund_source:"중개수수료",join_date:"2023-06-01",kyc_date:"2024-01-12"},
    {id:"CAH04",name:"심부름팀A",type:"개인",birth_or_open:"1996-03-15",nationality:"중국",residence:"비거주자",address:"중국 광저우 OO가 55",beneficial_owner:{name:"응우옌 반 민",nationality:"베트남",birth:"1960-12-01",share:"100%"},risk:"고",asset:"약 500만원",job_or_business:"무직",purpose:"대리인",fund_source:"불명확",join_date:"2024-01-03",kyc_date:"2024-01-03"},
    {id:"CAH05",name:"심부름팀B",type:"개인",birth_or_open:"1998-08-20",nationality:"중국",residence:"비거주자",address:"중국 광저우 OO가 56",beneficial_owner:{name:"응우옌 반 민",nationality:"베트남",birth:"1960-12-01",share:"100%"},risk:"고",asset:"약 500만원",job_or_business:"무직",purpose:"대리인",fund_source:"불명확",join_date:"2024-01-05",kyc_date:"2024-01-05"},
    {id:"CAH06",name:"정명호",type:"개인",birth_or_open:"1972-09-25",nationality:"대한민국",residence:"거주자",address:"강원 강릉시 교1동 200",beneficial_owner:{name:"정명호",nationality:"대한민국",birth:"1972-09-25",share:"100%"},risk:"저",asset:"약 2억원",job_or_business:"자영업",purpose:"레저",fund_source:"사업소득",join_date:"2021-04-01",kyc_date:"2023-10-01"},
    {id:"CAH07",name:"박순례",type:"개인",birth_or_open:"1980-11-15",nationality:"대한민국",residence:"거주자",address:"서울 강남구 역삼동 100",beneficial_owner:{name:"박순례",nationality:"대한민국",birth:"1980-11-15",share:"100%"},risk:"저",asset:"약 5천만원",job_or_business:"직장인",purpose:"레저",fund_source:"근로소득",join_date:"2022-07-01",kyc_date:"2023-11-01"},
    {id:"CAH08",name:"이관광",type:"개인",birth_or_open:"1990-05-10",nationality:"대한민국",residence:"거주자",address:"경기 성남시 분당구 100",beneficial_owner:{name:"이관광",nationality:"대한민국",birth:"1990-05-10",share:"100%"},risk:"저",asset:"약 3천만원",job_or_business:"회사원",purpose:"레저",fund_source:"근로소득",join_date:"2021-09-01",kyc_date:"2023-10-01"}
  ],
  transactions:[
    {date:"2024-03-01",time:"10:00",content:"칩매입",trader:"심부름팀A",amount_krw:9800000,qty:98,chip:"100달러칩",note:"현금(중국 위안화) 달러 환전"},
    {date:"2024-03-01",time:"10:10",content:"칩매입",trader:"심부름팀B",amount_krw:9700000,qty:97,chip:"100달러칩",note:"현금(중국 위안화) 달러 환전"},
    {date:"2024-03-01",time:"10:30",content:"칩양도",trader:"심부름팀A",amount_krw:9800000,qty:98,chip:"100달러칩",note:"응우옌 반 민 대리인에게 양도"},
    {date:"2024-03-01",time:"10:35",content:"칩양도",trader:"심부름팀B",amount_krw:9700000,qty:97,chip:"100달러칩",note:"응우옌 반 민 대리인에게 양도"},
    {date:"2024-03-01",time:"14:00",content:"칩매도",trader:"응우옌 반 민",amount_krw:19800000,qty:198,chip:"100달러칩",note:"VIP룸 원화 환전"},
    {date:"2024-03-01",time:"14:30",content:"환전",trader:"응우옌 반 민",amount_krw:19500000,qty:null,chip:null,note:"원화→달러 재환전(환치기)"},
    {date:"2024-03-02",time:"10:00",content:"칩매입",trader:"심부름팀A",amount_krw:9900000,qty:99,chip:"100달러칩",note:"현금 반복"},
    {date:"2024-03-02",time:"10:10",content:"칩매입",trader:"심부름팀B",amount_krw:9600000,qty:96,chip:"100달러칩",note:"현금 반복"},
    {date:"2024-03-02",time:"10:30",content:"칩양도",trader:"심부름팀A",amount_krw:9900000,qty:99,chip:"100달러칩",note:"양도"},
    {date:"2024-03-02",time:"10:35",content:"칩양도",trader:"심부름팀B",amount_krw:9600000,qty:96,chip:"100달러칩",note:"양도"},
    {date:"2024-03-02",time:"14:00",content:"칩매도",trader:"응우옌 반 민",amount_krw:19800000,qty:198,chip:"100달러칩",note:"원화 환전"},
    {date:"2024-03-03",time:"10:00",content:"부동산취득",trader:"베트남스타(주)",amount_krw:3000000000,qty:null,chip:null,note:"서울 강남 부동산 취득(자금출처불명)"},
    {date:"2024-03-04",time:"14:00",content:"입금",trader:"정명호",amount_krw:500000,qty:null,chip:null,note:""}
  ],
  hints:[
    {type:"news",title:"FATF PEP+카지노+부동산 복합 자금세탁 경보",content:"PEP+카지노+부동산 복합 세탁 특징:\n① 베트남 전직 장관급 PEP의 국내 법인 90% 실소유\n② 중국 국적 심부름팀이 CTR 회피 칩 분산 구매\n③ VIP룸에서 집결 후 원화→달러 재환전(환치기)\n④ 법인 명의 국내 부동산 즉시 취득으로 자산 고착화"},
    {type:"kyc_review",content:"KYC 정보 30초 재열람"}
  ],
  answer:{
    criminal:"응우옌 반 민, 베트남스타(주), 심부름팀A, 심부름팀B",
    keywords:["PEP자산세탁","칩양도스머핑","원화달러환치기","부동산고착화","중국심부름팀"],
    customer_trait:"베트남 전직 장관 PEP, 법인 90% 실소유, 중국 심부름팀 CTR 회피",
    suspicious_type:"PEP+카지노 스머핑+환치기+부동산 취득 복합 세탁",
    key_reason:"심부름팀 CTR회피 칩구매→PEP양도→원화환전→달러재환전→부동산취득",
    intent:"PEP 복합 자금세탁 탐지 훈련"
  }
}

]; // LOCAL_GAMES 끝
