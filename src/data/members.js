// TF家族命理数据库 v5.0
// 55人 · 一至五代 · 2026.03

// 生肖判断用春节日期表（不能用年份%12，会出错）
export const SPRING_FESTIVAL = {
  1999:[2,16], 2000:[2,5],  2001:[1,24], 2002:[2,12],
  2003:[2,1],  2004:[1,22], 2005:[2,9],  2006:[1,29],
  2007:[2,18], 2008:[2,7],  2009:[1,26], 2010:[2,14],
  2011:[2,3],  2012:[1,23], 2013:[2,10], 2014:[1,31],
  2015:[2,19], 2016:[2,8],
};

export const ANIMALS = ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];

export function getAnimal(year, month, day) {
  const sf = SPRING_FESTIVAL[year];
  let lunarYear = year;
  if (sf) {
    const [sfM, sfD] = sf;
    if (month < sfM || (month === sfM && day < sfD)) {
      lunarYear = year - 1;
    }
  }
  return ANIMALS[(lunarYear - 4 + 1200) % 12];
}

export const TF_MEMBERS = [
  // ── 一代 TFBOYS ──────────────────────────────────────────
  { id:"wjk",  name:"王俊凯", en:"Karry",        gen:"一代", group:"TFBOYS",      birthday:"1999-09-21", zodiac:"处女座", element:"土", animal:"兔", lifeNum:4,  dayStem:"丙", dayElement:"火" },
  { id:"wy",   name:"王源",   en:"Roy Wang",     gen:"一代", group:"TFBOYS",      birthday:"2000-11-08", zodiac:"天蝎座", element:"水", animal:"龙", lifeNum:3,  dayStem:"庚", dayElement:"金" },
  { id:"yyx",  name:"易烊千玺",en:"Jackson Yee",  gen:"一代", group:"TFBOYS",      birthday:"2000-11-28", zodiac:"射手座", element:"火", animal:"龙", lifeNum:5,  dayStem:"庚", dayElement:"金" },

  // ── 二代 时代少年团 TNT ───────────────────────────────────
  { id:"mjq",  name:"马嘉祺", en:"",             gen:"二代", group:"时代少年团",   birthday:"2002-12-12", zodiac:"射手座", element:"火", animal:"马", lifeNum:1,  dayStem:"甲", dayElement:"木" },
  { id:"dcx",  name:"丁程鑫", en:"Vincent",      gen:"二代", group:"时代少年团",   birthday:"2002-02-24", zodiac:"双鱼座", element:"水", animal:"马", lifeNum:3,  dayStem:"癸", dayElement:"水" },
  { id:"zzy",  name:"张真源", en:"Alex",         gen:"二代", group:"时代少年团",   birthday:"2003-04-16", zodiac:"白羊座", element:"火", animal:"羊", lifeNum:7,  dayStem:"己", dayElement:"土" },
  { id:"syx",  name:"宋亚轩", en:"Alex",         gen:"二代", group:"时代少年团",   birthday:"2004-03-04", zodiac:"双鱼座", element:"水", animal:"猴", lifeNum:4,  dayStem:"壬", dayElement:"水" },
  { id:"hjl",  name:"贺峻霖", en:"Twenty-two X", gen:"二代", group:"时代少年团",   birthday:"2004-06-15", zodiac:"双子座", element:"风", animal:"猴", lifeNum:9,  dayStem:"乙", dayElement:"木" },
  { id:"yhx",  name:"严浩翔", en:"Oliver",       gen:"二代", group:"时代少年团",   birthday:"2004-08-16", zodiac:"狮子座", element:"火", animal:"猴", lifeNum:3,  dayStem:"丁", dayElement:"火" },
  { id:"lyw",  name:"刘耀文", en:"",             gen:"二代", group:"时代少年团",   birthday:"2005-09-23", zodiac:"天秤座", element:"风", animal:"鸡", lifeNum:3,  dayStem:"庚", dayElement:"金" },

  // ── 三代 TOP登陆少年 ──────────────────────────────────────
  { id:"zzx",  name:"朱志鑫", en:"",             gen:"三代", group:"TOP登陆少年",  birthday:"2005-11-19", zodiac:"天蝎座", element:"水", animal:"鸡", lifeNum:1,  dayStem:"丁", dayElement:"火" },
  { id:"zh",   name:"左航",   en:"LEFT",         gen:"三代", group:"TOP登陆少年",  birthday:"2006-05-22", zodiac:"双子座", element:"风", animal:"狗", lifeNum:8,  dayStem:"辛", dayElement:"金" },
  { id:"sxh",  name:"苏新皓", en:"SU",           gen:"三代", group:"TOP登陆少年",  birthday:"2007-01-12", zodiac:"摩羯座", element:"土", animal:"狗", lifeNum:4,  dayStem:"丙", dayElement:"火" },
  { id:"zj",   name:"张极",   en:"Jeremy",       gen:"三代", group:"TOP登陆少年",  birthday:"2007-02-03", zodiac:"水瓶座", element:"风", animal:"狗", lifeNum:5,  dayStem:"戊", dayElement:"土" },
  { id:"zzy2", name:"张泽禹", en:"ZACK",         gen:"三代", group:"TOP登陆少年",  birthday:"2007-04-30", zodiac:"金牛座", element:"土", animal:"猪", lifeNum:7,  dayStem:"甲", dayElement:"木" },

  // ── 三代 TF_ING ───────────────────────────────────────────
  { id:"tyk",  name:"童禹坤", en:"Yukun",        gen:"三代", group:"TF_ING",      birthday:"2006-07-07", zodiac:"巨蟹座", element:"水", animal:"狗", lifeNum:22, dayStem:"丁", dayElement:"火" },
  { id:"djx",  name:"邓佳鑫", en:"Alan",         gen:"三代", group:"TF_ING",      birthday:"2006-07-23", zodiac:"狮子座", element:"火", animal:"狗", lifeNum:2,  dayStem:"癸", dayElement:"水" },
  { id:"zzm",  name:"张子墨", en:"",             gen:"三代", group:"TF_ING",      birthday:"2008-02-20", zodiac:"双鱼座", element:"水", animal:"鼠", lifeNum:5,  dayStem:"辛", dayElement:"金" },
  { id:"mzc",  name:"穆祉丞", en:"Mu",           gen:"三代", group:"TF_ING",      birthday:"2007-11-16", zodiac:"天蝎座", element:"水", animal:"猪", lifeNum:9,  dayStem:"甲", dayElement:"木" },
  { id:"hs",   name:"黄朔",   en:"LUCAS",        gen:"三代", group:"TF_ING",      birthday:"2008-08-24", zodiac:"处女座", element:"土", animal:"鼠", lifeNum:6,  dayStem:"丙", dayElement:"火" },

  // ── 三代 Solo ─────────────────────────────────────────────
  { id:"yyh",  name:"余宇涵", en:"YU Yuhan",     gen:"三代", group:"Solo",        birthday:"2006-11-24", zodiac:"射手座", element:"火", animal:"狗", lifeNum:7,  dayStem:"丁", dayElement:"火" },
  { id:"zjh",  name:"张峻豪", en:"Simons",       gen:"三代", group:"Solo",        birthday:"2007-07-20", zodiac:"巨蟹座", element:"水", animal:"猪", lifeNum:9,  dayStem:"乙", dayElement:"木" },

  // ── 四代 核心13人 ─────────────────────────────────────────
  { id:"gjc",  name:"官俊臣", en:"Gerald",       gen:"四代", group:"核心13人",    birthday:"2007-07-04", zodiac:"巨蟹座", element:"水", animal:"猪", lifeNum:2,  dayStem:"己", dayElement:"土" },
  { id:"zgy",  name:"张桂源", en:"Gwen",         gen:"四代", group:"核心13人",    birthday:"2009-05-11", zodiac:"金牛座", element:"土", animal:"牛", lifeNum:9,  dayStem:"丙", dayElement:"火" },
  { id:"zhr",  name:"张函瑞", en:"Henry",        gen:"四代", group:"核心13人",    birthday:"2009-10-18", zodiac:"天秤座", element:"风", animal:"牛", lifeNum:3,  dayStem:"丙", dayElement:"火" },
  { id:"wlj",  name:"王橹杰", en:"Wayne/Foris",  gen:"四代", group:"核心13人",    birthday:"2010-01-08", zodiac:"摩羯座", element:"土", animal:"牛", lifeNum:3,  dayStem:"戊", dayElement:"土" },
  { id:"wsr",  name:"王烁然", en:"Vincent",      gen:"四代", group:"核心13人",    birthday:"2010-03-15", zodiac:"双鱼座", element:"水", animal:"虎", lifeNum:3,  dayStem:"甲", dayElement:"木" },
  { id:"zqh",  name:"左奇函", en:"Kiyo",         gen:"四代", group:"核心13人",    birthday:"2010-03-19", zodiac:"双鱼座", element:"水", animal:"虎", lifeNum:7,  dayStem:"戊", dayElement:"土" },
  { id:"cyh",  name:"陈奕恒", en:"Jonathan",     gen:"四代", group:"核心13人",    birthday:"2010-05-09", zodiac:"金牛座", element:"土", animal:"虎", lifeNum:8,  dayStem:"己", dayElement:"土" },
  { id:"ybw",  name:"杨博文", en:"Rambo",        gen:"四代", group:"核心13人",    birthday:"2010-06-01", zodiac:"双子座", element:"风", animal:"虎", lifeNum:1,  dayStem:"壬", dayElement:"水" },
  { id:"yhb",  name:"杨涵博", en:"Hambur",       gen:"四代", group:"核心13人",    birthday:"2010-06-08", zodiac:"双子座", element:"风", animal:"虎", lifeNum:8,  dayStem:"己", dayElement:"土" },
  { id:"zyr",  name:"张奕然", en:"Domi",         gen:"四代", group:"核心13人",    birthday:"2010-09-15", zodiac:"处女座", element:"土", animal:"虎", lifeNum:9,  dayStem:"戊", dayElement:"土" },
  { id:"nwc",  name:"聂玮辰", en:"Chris",        gen:"四代", group:"核心13人",    birthday:"2011-02-18", zodiac:"水瓶座", element:"风", animal:"兔", lifeNum:6,  dayStem:"甲", dayElement:"木" },
  { id:"wzc",  name:"魏子宸", en:"",             gen:"四代", group:"核心13人",    birthday:"2011-12-19", zodiac:"射手座", element:"火", animal:"兔", lifeNum:8,  dayStem:"戊", dayElement:"土" },
  { id:"csh",  name:"陈思罕", en:"",             gen:"四代", group:"核心13人",    birthday:"2011-11-08", zodiac:"天蝎座", element:"水", animal:"兔", lifeNum:5,  dayStem:"甲", dayElement:"木" },
  { id:"lyd2", name:"李煜东", en:"",             gen:"四代", group:"核心13人",    birthday:"2012-03-15", zodiac:"双鱼座", element:"水", animal:"龙", lifeNum:5,  dayStem:"庚", dayElement:"金" },
  { id:"cjm",  name:"陈浚铭", en:"Jack",         gen:"四代", group:"核心13人",    birthday:"2012-05-17", zodiac:"金牛座", element:"土", animal:"龙", lifeNum:9,  dayStem:"戊", dayElement:"土" },

  // ── 五代 ─────────────────────────────────────────────────
];
