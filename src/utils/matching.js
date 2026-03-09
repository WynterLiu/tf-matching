// ─── 命理匹配算法 matching.js ───────────────────────────────

// 星座元素兼容矩阵（满分25）
const ZODIAC_MATRIX = {
  '火-火': 18, '火-土': 10, '火-风': 25, '火-水': 6,
  '土-火': 10, '土-土': 18, '土-风': 6,  '土-水': 25,
  '风-火': 25, '风-土': 6,  '风-风': 18, '风-水': 10,
  '水-火': 6,  '水-土': 25, '水-风': 10, '水-水': 18,
};

// 生肖三合局
const SAN_HE = [
  ['猴','鼠','龙'],
  ['虎','马','狗'],
  ['蛇','鸡','牛'],
  ['猪','兔','羊'],
];

// 生肖六合
const LIU_HE = [
  ['鼠','牛'], ['虎','猪'], ['兔','狗'],
  ['龙','鸡'], ['蛇','猴'], ['马','羊'],
];

// 生肖六冲
const LIU_CHONG = [
  ['鼠','马'], ['牛','羊'], ['虎','猴'],
  ['兔','鸡'], ['龙','狗'], ['蛇','猪'],
];

// 生肖三刑（相害）
const SAN_XING = [
  ['寅','巳','申'], // 虎蛇猴
  ['丑','戌','未'], // 牛狗羊
];

// 五行相生
const SHENG = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};

// 五行相克
const KE = {
  '木': '土', '土': '水', '水': '火', '火': '金', '金': '木',
};

const ZODIAC_ELEMENT_BY_NAME = {
  '白羊座': '火', '狮子座': '火', '射手座': '火',
  '金牛座': '土', '处女座': '土', '摩羯座': '土',
  '双子座': '风', '天秤座': '风', '水瓶座': '风',
  '巨蟹座': '水', '天蝎座': '水', '双鱼座': '水',
};

// 每题4选项 -> 4维人格向量 [exploration, logic, stability, creativity]
const ANSWER_VECTOR_TABLE = [
  [ // Q1
    [3, 1, 1, 2],
    [1, 3, 3, 1],
    [1, 2, 4, 1],
    [2, 1, 2, 4],
  ],
  [ // Q2
    [1, 1, 3, 3],
    [4, 2, 1, 2],
    [1, 3, 4, 1],
    [3, 1, 1, 4],
  ],
  [ // Q3
    [1, 2, 3, 2],
    [2, 4, 1, 2],
    [3, 2, 2, 2],
    [2, 2, 1, 4],
  ],
  [ // Q4
    [3, 1, 2, 3],
    [1, 3, 3, 2],
    [1, 2, 3, 4],
    [2, 2, 2, 3],
  ],
  [ // Q5
    [3, 2, 2, 2],
    [1, 2, 4, 2],
    [1, 4, 3, 1],
    [2, 1, 1, 4],
  ],
];

const SESSION_SALT = Math.random().toString(36).slice(2);

// ── 星座得分 ─────────────────────────────────────────────────
export function getZodiacScore(userElement, memberElement, userZodiac, memberZodiac) {
  let score = ZODIAC_MATRIX[`${userElement}-${memberElement}`] || 10;
  if (userZodiac === memberZodiac) score = Math.min(score + 2, 25);
  return score;
}

// ── 生肖得分 ─────────────────────────────────────────────────
export function getAnimalScore(userAnimal, memberAnimal) {
  // 相同
  if (userAnimal === memberAnimal) return 20;
  // 三合
  for (const g of SAN_HE) {
    if (g.includes(userAnimal) && g.includes(memberAnimal)) return 30;
  }
  // 六合
  for (const p of LIU_HE) {
    if (p.includes(userAnimal) && p.includes(memberAnimal)) return 24;
  }
  // 六冲
  for (const p of LIU_CHONG) {
    if (p.includes(userAnimal) && p.includes(memberAnimal)) return 3;
  }
  // 中性
  return 15;
}

// ── 生命数字得分 ──────────────────────────────────────────────
const LIFE_NUM_MATRIX = {
  '1-1':25,'1-2':20,'1-3':18,'1-4':20,'1-5':15,'1-6':15,'1-7':18,'1-8':10,'1-9':22,
  '2-1':20,'2-2':25,'2-3':25,'2-4':22,'2-5':18,'2-6':25,'2-7':22,'2-8':25,'2-9':20,
  '3-1':18,'3-2':25,'3-3':25,'3-4':15,'3-5':20,'3-6':22,'3-7':22,'3-8':15,'3-9':22,
  '4-1':20,'4-2':22,'4-3':15,'4-4':25,'4-5':22,'4-6':25,'4-7':20,'4-8':20,'4-9':15,
  '5-1':15,'5-2':18,'5-3':20,'5-4':22,'5-5':25,'5-6':22,'5-7':18,'5-8':18,'5-9':18,
  '6-1':15,'6-2':25,'6-3':22,'6-4':25,'6-5':22,'6-6':25,'6-7':20,'6-8':20,'6-9':20,
  '7-1':18,'7-2':22,'7-3':22,'7-4':20,'7-5':18,'7-6':20,'7-7':25,'7-8':22,'7-9':25,
  '8-1':10,'8-2':25,'8-3':15,'8-4':20,'8-5':18,'8-6':20,'8-7':22,'8-8':25,'8-9':20,
  '9-1':22,'9-2':20,'9-3':22,'9-4':15,'9-5':18,'9-6':20,'9-7':25,'9-8':20,'9-9':25,
  // 大师数映射到最近数
  '11-1':22,'11-2':25,'11-3':22,'11-4':18,'11-5':20,'11-6':22,'11-7':25,'11-8':20,'11-9':25,
  '22-1':18,'22-2':22,'22-3':18,'22-4':25,'22-5':20,'22-6':25,'22-7':20,'22-8':22,'22-9':20,
};

export function getLifeNumScore(userNum, memberNum) {
  const key = `${userNum}-${memberNum}`;
  const keyRev = `${memberNum}-${userNum}`;
  return LIFE_NUM_MATRIX[key] || LIFE_NUM_MATRIX[keyRev] || 15;
}

// ── 日主五行修正 ───────────────────────────────────────────────
export function getDayElementBonus(userDayElement, memberDayElement) {
  if (userDayElement === memberDayElement) return 4; // 相同 各+2
  if (SHENG[userDayElement] === memberDayElement) return 2; // 相生 各+1
  if (SHENG[memberDayElement] === userDayElement) return 2;
  return 0;
}

// ── Part2 人格得分 ─────────────────────────────────────────────
// 每题对每个成员：高匹配4分，中匹配3分，低2分，不匹配1分
// answers: [q1选项index, q2, q3, q4, q5]

// Q1 五行行动风格 → 与成员日主五行匹配
const Q1_ELEMENT = ['火','水','土','木']; // 选项A/B/C/D对应五行

// Q2 情感需求 → 与成员星座匹配
const Q2_ZODIAC_GROUPS = [
  ['天蝎座','处女座'],        // A 深情型
  ['射手座','双子座'],        // B 自由型
  ['处女座','摩羯座','水瓶座'],// C 稳定型
  ['狮子座','金牛座','白羊座'],// D 探索型
];

// Q3 外在气质 → 与成员生命数字匹配
const Q3_LIFENUM_GROUPS = [
  [5,6,2],    // A 月亮型
  [9,7,4],    // B 水星型
  [1,8],      // C 太阳型
  [3,5,11],   // D 冥王型
];

// Q4 能量来源 → 与成员大类匹配
const Q4_MEMBER_TYPES = {
  A: ['mjq','yhx','dcx','lyw','syx','zzx','djx','yyh','zyy','ylh'], // 阳·外向
  B: ['wjk','hjl','sxh','gjc','wlj','rxz'],                         // 阴·内向
  C: ['wy','yyx','tyk','mzc','zjh'],                                 // 阳·创造
  D: ['syx','lyw','zh','zj','zzy2','ctr'],                          // 中性平衡
};

// Q5 命运观 → 与成员生命数字匹配
const Q5_LIFENUM_GROUPS = [
  [1,8],      // A 命主型
  [2,9,4],    // B 缘分型
  [4,7],      // C 理性型
  [3,5,11],   // D 直觉型
];

export function getPart2Score(answers, member) {
  let score = 0;

  // Q1: 五行行动 vs 日主五行
  const q1Element = Q1_ELEMENT[answers[0]];
  if (q1Element === member.dayElement) score += 4;
  else if (SHENG[q1Element] === member.dayElement || SHENG[member.dayElement] === q1Element) score += 3;
  else score += 2;

  // Q2: 情感需求 vs 星座
  const q2Group = Q2_ZODIAC_GROUPS[answers[1]] || [];
  if (q2Group.includes(member.zodiac)) score += 4;
  else score += 2;

  // Q3: 气质 vs 生命数字
  const q3Group = Q3_LIFENUM_GROUPS[answers[2]] || [];
  const memberNum = member.lifeNum > 9 ? member.lifeNum : member.lifeNum;
  if (q3Group.includes(memberNum)) score += 4;
  else score += 2;

  // Q4: 能量 vs 成员类型
  const q4Key = ['A','B','C','D'][answers[3]];
  if ((Q4_MEMBER_TYPES[q4Key] || []).includes(member.id)) score += 4;
  else score += 2;

  // Q5: 命运观 vs 生命数字
  const q5Group = Q5_LIFENUM_GROUPS[answers[4]] || [];
  if (q5Group.includes(memberNum)) score += 4;
  else score += 2;

  return score; // 最高20分
}

function normalizeZodiacName(zodiac) {
  if (!zodiac) return '';
  if (typeof zodiac === 'string') return zodiac;
  return zodiac.name || '';
}

function normalizeZodiacElement(zodiac, fallbackElement) {
  const raw = (typeof zodiac === 'object' ? zodiac?.element : zodiac) || fallbackElement;
  if (!raw) return '土';
  const m = {
    fire: '火', earth: '土', air: '风', wind: '风', water: '水',
    火: '火', 土: '土', 风: '风', 水: '水', 木: '木', 金: '金',
  };
  const k = String(raw).toLowerCase();
  return m[k] || m[raw] || ZODIAC_ELEMENT_BY_NAME[normalizeZodiacName(zodiac)] || '土';
}

function hasPair(list, a, b) {
  return list.some(g => g.includes(a) && g.includes(b));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeRange(value, min, max) {
  if (max <= min) return 0;
  const pct = ((value - min) / (max - min)) * 100;
  return clamp(pct, 0, 100);
}

function scoreFiveElements(userDayElement, memberDayElement) {
  if (!userDayElement || !memberDayElement) return 0;
  if (SHENG[userDayElement] === memberDayElement || SHENG[memberDayElement] === userDayElement) return 20;
  if (userDayElement === memberDayElement) return 8;
  if (KE[userDayElement] === memberDayElement || KE[memberDayElement] === userDayElement) return -20;
  return 0;
}

function scoreZodiacElements(userZodiacElement, memberZodiacElement) {
  const u = normalizeZodiacElement(userZodiacElement);
  const m = normalizeZodiacElement(memberZodiacElement);
  if ((u === '火' && m === '风') || (u === '风' && m === '火')) return 14;
  if ((u === '土' && m === '水') || (u === '水' && m === '土')) return 14;
  if (u === m) return 8;
  return -12;
}

function scoreChineseZodiac(userAnimal, memberAnimal) {
  if (!userAnimal || !memberAnimal) return 0;
  if (hasPair(LIU_HE, userAnimal, memberAnimal)) return 22;
  if (hasPair(SAN_HE, userAnimal, memberAnimal)) return 14;
  if (hasPair(LIU_CHONG, userAnimal, memberAnimal)) return -18;
  return 0;
}

function scoreLifeNumbers(userNum, memberNum) {
  const u = Number(userNum);
  const m = Number(memberNum);
  if (!Number.isFinite(u) || !Number.isFinite(m)) return 0;
  const diff = Math.abs(u - m);
  if (diff === 0) return 24;
  if (diff <= 1) return 12;
  if (diff <= 2) return 6;
  if (diff >= 8) return -8;
  return -2;
}

function toUserPersonalityVector(answers = []) {
  const base = [0, 0, 0, 0];
  for (let i = 0; i < 5; i += 1) {
    const option = Math.max(0, Math.min(3, Number(answers[i] ?? 0)));
    const delta = ANSWER_VECTOR_TABLE[i][option];
    for (let d = 0; d < 4; d += 1) base[d] += delta[d];
  }
  return base;
}

function toMemberPersonalityVector(member) {
  if (Array.isArray(member?.personalityVector) && member.personalityVector.length === 4) {
    return member.personalityVector.map(v => Number(v) || 0);
  }

  const zodiacElement = normalizeZodiacElement(member?.zodiac, member?.element);
  const dayElement = member?.dayElement;
  const lifeNum = Number(member?.lifeNum) || 0;
  const animal = member?.animal;

  const byZodiacElement = {
    火: [3, 1, 1, 3],
    风: [3, 3, 1, 2],
    土: [1, 3, 4, 1],
    水: [2, 2, 3, 3],
  };

  const byDayElement = {
    木: [2, 2, 2, 3],
    火: [3, 1, 1, 3],
    土: [1, 3, 4, 1],
    金: [1, 4, 3, 1],
    水: [2, 2, 3, 3],
  };

  const byAnimalGroup = hasPair(SAN_HE, animal, '猴') || hasPair(SAN_HE, animal, '鼠') || hasPair(SAN_HE, animal, '龙')
    ? [2, 2, 1, 2]
    : hasPair(SAN_HE, animal, '虎') || hasPair(SAN_HE, animal, '马') || hasPair(SAN_HE, animal, '狗')
      ? [3, 1, 2, 2]
      : hasPair(SAN_HE, animal, '蛇') || hasPair(SAN_HE, animal, '鸡') || hasPair(SAN_HE, animal, '牛')
        ? [1, 3, 3, 1]
        : [1, 2, 3, 2];

  const lifeBoost = [0, 0, 0, 0];
  lifeBoost[lifeNum % 4] = 2;

  const z = byZodiacElement[zodiacElement] || [2, 2, 2, 2];
  const d = byDayElement[dayElement] || [2, 2, 2, 2];
  return [
    1 + z[0] + d[0] + byAnimalGroup[0] + lifeBoost[0],
    1 + z[1] + d[1] + byAnimalGroup[1] + lifeBoost[1],
    1 + z[2] + d[2] + byAnimalGroup[2] + lifeBoost[2],
    1 + z[3] + d[3] + byAnimalGroup[3] + lifeBoost[3],
  ];
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function scorePersonality(answers, member) {
  const userVec = toUserPersonalityVector(answers);
  const memberVec = toMemberPersonalityVector(member);
  const sim = Math.max(0, Math.min(1, cosineSimilarity(userVec, memberVec)));

  // 非线性拉开区分度：中等匹配不再偏高，高匹配才明显高分
  const emphasized = Math.pow(sim, 3); // 0~1

  // 额外加入向量距离惩罚，让不匹配更明显
  let distance = 0;
  for (let i = 0; i < userVec.length; i += 1) {
    distance += Math.abs(userVec[i] - memberVec[i]);
  }
  const distancePenalty = Math.min(14, distance * 0.7);

  // personality raw 目标范围约 [-14, 40]
  return emphasized * 48 - 8 - distancePenalty;
}

function scoreFateBonus(userData, member) {
  let bonus = 0;
  const userZodiacName = normalizeZodiacName(userData?.zodiac);
  const memberZodiacName = normalizeZodiacName(member?.zodiac);
  const userZodiacElement = normalizeZodiacElement(userData?.zodiac, userData?.element);
  const memberZodiacElement = normalizeZodiacElement(member?.zodiac, member?.element);

  if (userZodiacName && userZodiacName === memberZodiacName) bonus += 5;
  if (userZodiacElement === memberZodiacElement) bonus += 3;
  if (userData?.animal && userData.animal === member?.animal) bonus += 4;
  if (userData?.dayElement && userData.dayElement === member?.dayElement) bonus += 3;
  if (SHENG[userData?.dayElement] === member?.dayElement || SHENG[member?.dayElement] === userData?.dayElement) bonus += 2;
  if (hasPair(LIU_HE, userData?.animal, member?.animal)) bonus += 2;
  if (hasPair(SAN_HE, userData?.animal, member?.animal)) bonus += 1;

  // 负向象征惩罚，平衡整体偏高问题
  if (KE[userData?.dayElement] === member?.dayElement || KE[member?.dayElement] === userData?.dayElement) bonus -= 4;
  if (hasPair(LIU_CHONG, userData?.animal, member?.animal)) bonus -= 6;
  if (scoreZodiacElements(userData?.zodiac, member?.zodiac) < 0) bonus -= 3;

  return bonus;
}

function hashToUnit(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000000) / 1000000;
}

function softVariation(userData, member, answers) {
  const key = [
    SESSION_SALT,
    member?.id || '',
    normalizeZodiacName(userData?.zodiac),
    userData?.animal || '',
    userData?.lifeNum || '',
    (answers || []).join(','),
  ].join('|');
  const r = hashToUnit(key); // [0,1)
  return Math.round((r * 4) - 2); // 整数 [-2,2]
}

function calcResonanceAdjustment({
  fiveElementScore,
  zodiacScore,
  animalScore,
  lifeScore,
  personalityScoreRaw,
  fateScoreRaw,
}) {
  let harmony = 0;
  let conflict = 0;

  [fiveElementScore, zodiacScore, animalScore, lifeScore].forEach(v => {
    if (v > 0) harmony += 1;
    if (v < 0) conflict += 1;
  });

  if (personalityScoreRaw >= 22) harmony += 1;
  else if (personalityScoreRaw <= 4) conflict += 1;

  if (fateScoreRaw >= 8) harmony += 1;
  else if (fateScoreRaw <= -6) conflict += 1;

  const harmonyBonus = harmony >= 6 ? 12 : harmony === 5 ? 9 : harmony === 4 ? 6 : harmony === 3 ? 3 : 0;
  const conflictPenalty = conflict >= 5 ? 14 : conflict === 4 ? 10 : conflict === 3 ? 7 : conflict === 2 ? 4 : 0;

  return {
    adjustment: harmonyBonus - conflictPenalty,
    harmony,
    conflict,
  };
}

// ── 综合计算 ───────────────────────────────────────────────────
export function calculateScore(userData, member, answers) {
  const fiveElementScore = scoreFiveElements(userData?.dayElement, member?.dayElement);

  const userZodiacElement = normalizeZodiacElement(userData?.zodiac, userData?.element);
  const memberZodiacElement = normalizeZodiacElement(member?.zodiac, member?.element);
  const zodiacScore = scoreZodiacElements(userZodiacElement, memberZodiacElement);

  const animalScore = scoreChineseZodiac(userData?.animal, member?.animal);
  const lifeScore = scoreLifeNumbers(userData?.lifeNum, member?.lifeNum);
  const personalityScoreRaw = Math.round(scorePersonality(answers, member));

  const destinyScoreRaw = fiveElementScore + zodiacScore + animalScore + lifeScore;
  const fateBonus = scoreFateBonus(userData, member);
  const variation = softVariation(userData, member, answers);
  const fateScoreRaw = fateBonus + variation;

  // 统一归一化到 0~100
  const destinyScoreNormalized = normalizeRange(destinyScoreRaw, -55, 70);
  const personalityScoreNormalized = normalizeRange(personalityScoreRaw, -18, 40);
  const fateScoreNormalized = normalizeRange(fateScoreRaw, -18, 22);

  // 加权总分（0~100）
  const weighted =
    destinyScoreNormalized * 0.45 +
    personalityScoreNormalized * 0.35 +
    fateScoreNormalized * 0.20;

  // 命理共振校准：提高优质匹配上限，同时对多重冲突组合做惩罚
  const resonance = calcResonanceAdjustment({
    fiveElementScore,
    zodiacScore,
    animalScore,
    lifeScore,
    personalityScoreRaw,
    fateScoreRaw,
  });

  // 降低“整体抬高”效应，增强高分段区分度
  const preContrast = clamp(weighted + resonance.adjustment * 1.1 - resonance.conflict * 1.2, 0, 100);
  // 非线性对比拉伸：让 90+ 分之间也有可见差距
  const calibrated = Math.pow(preContrast / 100, 1.8) * 100;

  const total = clamp(Math.round(calibrated), 0, 100);

  return {
    memberId: member.id,
    name: member.name,
    gen: member.gen,
    group: member.group,
    total,
    fateScore: Math.round(fateScoreNormalized),
    personalityScore: Math.round(personalityScoreNormalized),
    destinyScore: Math.round(destinyScoreNormalized),
    breakdown: {
      destinyRaw: {
        fiveElement: fiveElementScore,
        zodiacElement: zodiacScore,
        animal: animalScore,
        life: lifeScore,
        total: destinyScoreRaw,
      },
      personalityRaw: personalityScoreRaw,
      fateRaw: {
        bonus: fateBonus,
        variation,
        total: fateScoreRaw,
      },
      normalized: {
        destiny: Math.round(destinyScoreNormalized),
        personality: Math.round(personalityScoreNormalized),
        fate: Math.round(fateScoreNormalized),
      },
      calibration: {
        weightedBase: Math.round(weighted),
        preContrast: Math.round(preContrast),
        resonanceAdjustment: resonance.adjustment,
        harmonySignals: resonance.harmony,
        conflictSignals: resonance.conflict,
      },
    },
  };
}

// ── 等级标签 ────────────────────────────────────────────────────
export function getLevel(score) {
  if (score >= 90) return { stars: 5, label: '天作之合', desc: '命中注定' };
  if (score >= 78) return { stars: 4, label: '缘分深厚', desc: '相辅相成' };
  if (score >= 65) return { stars: 3, label: '互补有益', desc: '值得珍惜' };
  if (score >= 50) return { stars: 2, label: '各有千秋', desc: '需要磨合' };
  return { stars: 1, label: '缘分尚浅', desc: '成长空间大' };
}

// ── 生命数字计算 ────────────────────────────────────────────────
export function calcLifeNumber(year, month, day) {
  const digits = `${year}${month}${day}`.split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

// ── 结果洞察文案 ────────────────────────────────────────────────
export function getInsight(member, breakdown) {
  const insights = {
    'wjk': '你们如月与影，一个沉静，一个细腻，彼此的存在让对方更完整。',
    'wy':  '深水静流，两人都有深不见底的灵魂，相遇便是一场无声的震动。',
    'yyx': '你是他世界里的一道光，他是你旅途中最意外的惊喜。',
    'mjq': '他的热烈遇上你，是火焰找到了方向，燃烧得更有意义。',
    'dcx': '如水流入海，你们的相处自然而然，不费力气却深入彼此。',
    'zzy': '两个白羊式的灵魂相遇，会碰撞出令整个宇宙都侧目的火花。',
    'syx': '他温柔如水，你们在一起，世界会变得格外轻盈。',
    'hjl': '他是人间的小太阳，而你，恰好是让他发光的那片云。',
    'yhx': '狮子与你，一动一静，一张一弛，是天生的互补。',
    'lyw': '风遇见你，终于找到了停留的理由。',
    'zzx': '天蝎的深邃与你相遇，是命运精心安排的一场默契。',
    'zh':  '他的自由里有你的影子，你的稳定里有他的归处。',
    'sxh': '山与水的相遇，沉稳与灵动，让彼此都找到平衡。',
    'zj':  '水瓶的灵魂超前于时代，而你，恰好能读懂他的频率。',
    'zzy2':'金牛的踏实遇上你，是大地托住了流星。',
  };
  return insights[member.id] || `${member.name}与你的命理交汇在${breakdown.animal >= 24 ? '生肖合局' : '星座元素'}之中，是值得细细品味的缘分。`;
}
