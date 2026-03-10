import { useState, useEffect } from 'react'
import { TF_MEMBERS } from './data/members.js'
import { calculateScore, getLevel, calcLifeNumber } from './utils/matching.js'
import './App.css'

const ZODIACS = [
  { name:'白羊座', element:'火', emoji:'♈' },
  { name:'金牛座', element:'土', emoji:'♉' },
  { name:'双子座', element:'风', emoji:'♊' },
  { name:'巨蟹座', element:'水', emoji:'♋' },
  { name:'狮子座', element:'火', emoji:'♌' },
  { name:'处女座', element:'土', emoji:'♍' },
  { name:'天秤座', element:'风', emoji:'♎' },
  { name:'天蝎座', element:'水', emoji:'♏' },
  { name:'射手座', element:'火', emoji:'♐' },
  { name:'摩羯座', element:'土', emoji:'♑' },
  { name:'水瓶座', element:'风', emoji:'♒' },
  { name:'双鱼座', element:'水', emoji:'♓' },
]
const ANIMALS = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']
const ANIMAL_EMOJI = {'鼠':'🐭','牛':'🐂','虎':'🐯','兔':'🐰','龙':'🐉','蛇':'🐍','马':'🐴','羊':'🐑','猴':'🐒','鸡':'🐓','狗':'🐶','猪':'🐷'}
const DAY_ELEMENTS = [
  { name:'木', desc:'甲乙日生·生机勃勃', emoji:'🌿' },
  { name:'火', desc:'丙丁日生·热情奔放', emoji:'🔥' },
  { name:'土', desc:'戊己日生·稳重踏实', emoji:'🌍' },
  { name:'金', desc:'庚辛日生·果断坚毅', emoji:'⚙️' },
  { name:'水', desc:'壬癸日生·智慧灵动', emoji:'💧' },
]

const QUESTIONS = [
  {
    q: 'TF家族发了一条新动态，你第一反应是？',
    sub: '选最符合你真实习惯的那个',
    options: ['立刻冲去评论转发，第一时间参与热度','反复看好几遍，慢慢感受，自己消化','截图存好，整理进追星记录，认真归档','马上做成二创内容，把灵感变成作品'],
    icons: ['⚡','🌊','🏔️','🍃'],
  },
  {
    q: '在TF相关的日常互动里，你最重视哪种连接方式？',
    sub: '没有标准答案，选你最有共鸣的',
    options: ['深度交流型：想法和情绪都能被接住','松弛陪伴型：彼此有空间但一直在','长期守护型：稳定、持续、说到做到','新鲜共创型：每次互动都能碰出新火花'],
    icons: ['🌊','🕊️','🏡','✨'],
  },
  {
    q: '如果你是TF家族的练习生，评价你的人最可能说哪句话？',
    sub: '选那个最让你认同的',
    options: ['「ta很温柔，跟ta相处很舒服」','「ta脑子转得很快，很有想法」','「ta一进来就有存在感，很难忽视」','「ta很神秘，让人摸不透但想了解」'],
    icons: ['🌙','💫','☀️','🌌'],
  },
  {
    q: 'TF家族开演唱会，你最享受哪个瞬间？',
    sub: '凭直觉选你最期待的那个',
    options: ['全场大合唱，跟着一起嗨到忘我','安静听他唱歌，只想沉浸在那个氛围里','认真拍下每一个精彩画面留作纪念','跟着感觉走，哪个瞬间都值得珍惜'],
    icons: ['🎉','🌙','📸','☯️'],
  },
  {
    q: '你觉得自己和TF家族的缘分是怎么来的？',
    sub: '这道题没有标准答案',
    options: ['我主动追，一定能成为真正的粉丝朋友','缘分到了自然就深了，不强求','分析过他们所有资料才决定支持谁','第一眼看到就觉得「就是他了」'],
    icons: ['🚀','🍃','📊','🔮'],
  },
]

const GEN_COLORS = {'一代':'#c4964a','二代':'#e879a0','三代':'#9b6fce','四代':'#06b6d4'}

function getPhoto(id) {
  return new URL(`./images/members/${id}.jpg`, import.meta.url).href
}

function displayGroup(group) {
  if (group === '核心13人') return '四代练习生'
  return group
}

function Stars({ count }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= count ? 'star filled' : 'star'}>★</span>
      ))}
    </div>
  )
}

// ─── 首页 ────────────────────────────────────────────────────────
function LandingPage({ onStart }) {
  return (
    <div className="page landing-page">
      <div className="landing-bg">
        <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>
      </div>
      <div className="landing-content">
        <div className="landing-circle">
          <div className="circle-ring ring1"/>
          <div className="circle-ring ring2"/>
          <div className="circle-ring ring3"/>
          <div className="circle-center">🔮</div>
        </div>
        <div className="landing-badge">✦ 命理测算 ✦</div>
        <h1 className="landing-title">
          <span className="title-sub">TF FAMILY</span>
          <span className="title-main">TF家族中<br/>谁是你的真命天子？</span>
        </h1>
        <p className="landing-desc">包含1到4代成员</p>
        <button className="btn-start" onClick={onStart}>
          <span>开始测算</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  )
}

// ─── Part 1 ──────────────────────────────────────────────────────
function Part1Page({ onNext }) {
  const [zodiac, setZodiac]     = useState(null)
  const [animal, setAnimal]     = useState(null)
  const [lifeNum, setLifeNum]   = useState(null)
  const [dayElem, setDayElem]   = useState(null)
  const [showCalc, setShowCalc] = useState(false)
  const [calcYear, setCalcYear] = useState('')
  const [calcMonth, setCalcMonth] = useState('')
  const [calcDay, setCalcDay]   = useState('')
  const [calcResult, setCalcResult] = useState(null)
  const canNext = zodiac && animal && lifeNum && dayElem

  function handleCalc() {
    const y = parseInt(calcYear), m = parseInt(calcMonth), d = parseInt(calcDay)
    if (!y || !m || !d) return
    const result = calcLifeNumber(y, m, d)
    setCalcResult(result)
    setLifeNum(result)
  }

  return (
    <div className="page part1-page">
      <div className="page-header">
        <div className="step-badge">第一步</div>
        <h2>你的命理信息</h2>
        <p>以下信息不会被储存，仅用于本次测算</p>
      </div>

      <section className="input-section">
        <h3><span className="section-icon">✦</span> 你的星座</h3>
        <div className="zodiac-grid">
          {ZODIACS.map(z => (
            <button key={z.name} className={`zodiac-btn ${zodiac?.name===z.name?'selected':''}`} onClick={() => setZodiac(z)}>
              <span className="zodiac-emoji">{z.emoji}</span>
              <span className="zodiac-name">{z.name}</span>
              <span className="zodiac-element">{z.element}象</span>
            </button>
          ))}
        </div>
      </section>

      <section className="input-section">
        <h3><span className="section-icon">✦</span> 你的生肖</h3>
        <p className="section-tip">⚠️ 请用农历生肖，正月前出生请选上一年属相</p>
        <div className="animal-grid">
          {ANIMALS.map(a => (
            <button key={a} className={`animal-btn ${animal===a?'selected':''}`} onClick={() => setAnimal(a)}>
              <span className="animal-emoji">{ANIMAL_EMOJI[a]}</span>
              <span>{a}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="input-section">
        <h3><span className="section-icon">✦</span> 你的生命数字</h3>
        <p className="section-tip">
          把生日所有数字相加，不断缩减到个位数。<br/>
          例：1995.08.15 → 1+9+9+5+8+1+5 = 38 → 3+8 = <strong>11</strong><br/>
          （11和22是大师数，保留不缩减）
        </p>
        <div className="lifenum-grid">
          {[1,2,3,4,5,6,7,8,9,11,22].map(n => (
            <button key={n} className={`lifenum-btn ${lifeNum===n?'selected':''}`} onClick={() => setLifeNum(n)}>{n}</button>
          ))}
        </div>
        <button className="btn-calc" onClick={() => setShowCalc(!showCalc)}>
          {showCalc ? '收起' : '帮我算 →'}
        </button>
        {showCalc && (
          <div className="calc-box">
            <div className="calc-inputs">
              <input placeholder="年" value={calcYear} onChange={e => setCalcYear(e.target.value)} maxLength={4}/>
              <input placeholder="月" value={calcMonth} onChange={e => setCalcMonth(e.target.value)} maxLength={2}/>
              <input placeholder="日" value={calcDay} onChange={e => setCalcDay(e.target.value)} maxLength={2}/>
            </div>
            <button className="btn-do-calc" onClick={handleCalc}>计算</button>
            {calcResult && (
              <div className="calc-result">
                你的生命数字是 <strong>{calcResult}</strong>
                <span>（已自动选中）</span>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="input-section">
        <h3><span className="section-icon">✦</span> 你的日主五行</h3>
        <p className="section-tip">出生日天干对应的五行，不确定可查万年历或八字APP</p>
        <div className="element-grid">
          {DAY_ELEMENTS.map(e => (
            <button key={e.name} className={`element-btn ${dayElem===e.name?'selected':''}`} onClick={() => setDayElem(e.name)}>
              <span className="elem-emoji">{e.emoji}</span>
              <span className="elem-name">{e.name}</span>
              <span className="elem-desc">{e.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <button className={`btn-next ${canNext?'active':'disabled'}`} onClick={() => canNext && onNext({zodiac, animal, lifeNum, dayElement: dayElem})}>
        {canNext ? '下一步 →' : '请完成以上所有选项'}
      </button>
    </div>
  )
}

// ─── Part 2 ──────────────────────────────────────────────────────
function Part2Page({ onNext }) {
  const [answers, setAnswers] = useState([null,null,null,null,null])
  const [current, setCurrent] = useState(0)
  const answered = answers.filter(a => a !== null).length
  const canNext = answered === 5

  function handleAnswer(idx) {
    const next = [...answers]
    next[current] = idx
    setAnswers(next)
    if (current < 4) setTimeout(() => setCurrent(current + 1), 300)
  }

  const q = QUESTIONS[current]
  const progress = ((current + (answers[current] !== null ? 1 : 0)) / 5) * 100

  return (
    <div className="page part2-page">
      <div className="page-header">
        <div className="step-badge">第二步</div>
        <h2>人格共鸣测试</h2>
        <p>5道题，看看你和谁最有缘</p>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{width:`${progress}%`}}/>
      </div>
      <div className="progress-text">{answered} / 5 已完成</div>
      <div className="question-tabs">
        {QUESTIONS.map((_,i) => (
          <button key={i} className={`q-tab ${i===current?'active':''} ${answers[i]!==null?'done':''}`} onClick={() => setCurrent(i)}>
            {answers[i]!==null ? '✓' : i+1}
          </button>
        ))}
      </div>
      <div className="question-card">
        <div className="q-number">Q{current+1}</div>
        <h3 className="q-text">{q.q}</h3>
        <p className="q-sub">{q.sub}</p>
        <div className="options-grid">
          {q.options.map((opt,i) => (
            <button key={i} className={`option-btn ${answers[current]===i?'selected':''}`} onClick={() => handleAnswer(i)}>
              <span className="opt-icon">{q.icons[i]}</span>
              <span className="opt-text">{opt}</span>
            </button>
          ))}
        </div>
      </div>
      <button className={`btn-next ${canNext?'active':'disabled'}`} onClick={() => canNext && onNext(answers)}>
        {canNext ? '查看结果 ✦' : `还差 ${5-answered} 题`}
      </button>
    </div>
  )
}

// ─── 加载动画 ─────────────────────────────────────────────────────
function LoadingPage({ onDone }) {
  const [dots, setDots] = useState('.')
  useEffect(() => {
    const dotTimer = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 500)
    const doneTimer = setTimeout(onDone, 2500)
    return () => { clearInterval(dotTimer); clearTimeout(doneTimer) }
  }, [])

  return (
    <div className="page loading-page">
      <div className="landing-bg">
        <div className="orb orb1"/><div className="orb orb2"/>
      </div>
      <div className="loading-content">
        <div className="landing-circle">
          <div className="circle-ring ring1"/>
          <div className="circle-ring ring2"/>
          <div className="circle-ring ring3"/>
          <div className="circle-center">✦</div>
        </div>
        <p className="loading-text">命理推算中{dots}</p>
        <p className="loading-sub">正在寻找你的命中有缘人</p>
      </div>
    </div>
  )
}

// ─── 结果页 ───────────────────────────────────────────────────────
function ResultPage({ results, onRestart }) {
  const top5      = results.slice(0, 5)
  const first     = top5[0]
  const rest      = top5.slice(1)
  const rankEmoji = ['🥈','🥉','4️⃣','5️⃣']
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="page result-page">
      <div className="page-header">
        <div className="step-badge">✦ 测算结果 ✦</div>
        <h2>你的命理有缘人</h2>
      </div>

      {/* 第一名 */}
      <div className="result-card-top1">
        <div className="top1-crown">👑 命中有缘人</div>
        <div className="top1-photo-wrap">
          <img
            src={getPhoto(first.memberId)}
            alt={first.name}
            className="top1-photo"
            onError={e => { e.target.style.display='none' }}
          />
        </div>
        <div className="top1-info">
          <div className="top1-name">{first.name}</div>
          <div className="top1-meta">
            <span style={{color: GEN_COLORS[first.gen]||'#9b6fce'}}>{first.gen}</span>
            <span className="top1-group">{displayGroup(first.group)}</span>
          </div>
          <div className="top1-score">{first.total}<span> 分</span></div>
          <Stars count={getLevel(first.total).stars}/>
        </div>
      </div>

      {/* 第2-5名 */}
      <div className="result-rest">
        <p className="rest-title">也与你有缘</p>
        <div className="rest-list">
          {rest.map((r, i) => {
            const member   = TF_MEMBERS.find(m => m.id === r.memberId)
            const isOpen   = expanded === i
            const level    = getLevel(r.total)
            return (
              <div key={r.memberId} className={`result-card-small ${isOpen ? 'open' : ''}`}>
                {/* 标题行，点击展开/收起 */}
                <div className="small-header" onClick={() => setExpanded(isOpen ? null : i)}>
                  <span className="small-rank">{rankEmoji[i]}</span>
                  <span className="small-name">{r.name}</span>
                  <span className="small-gen" style={{color: GEN_COLORS[r.gen]||'#9b6fce'}}>{r.gen}</span>
                  <span className="small-group">{displayGroup(r.group)}</span>
                  <span className="small-toggle">{isOpen ? '▲' : '▼'}</span>
                </div>

                {/* 展开详情 */}
                {isOpen && (
                  <div className="small-detail">
                    {/* 照片 */}
                    <div className="small-photo-wrap">
                      <img
                        src={getPhoto(r.memberId)}
                        alt={r.name}
                        className="small-photo"
                        onError={e => { e.target.style.display='none' }}
                      />
                    </div>
                    {/* 分数 + 星级 */}
                    <div className="small-score-row">
                      <span className="small-score">{r.total}</span>
                      <span className="small-score-label"> 分</span>
                      <Stars count={level.stars}/>
                    </div>
                    {/* 命理标签 */}
                    {member && (
                      <div className="small-tags">
                        <span className="tag">{member.zodiac}</span>
                        <span className="tag">属{member.animal}</span>
                        <span className="tag">生命数字 {member.lifeNum}</span>
                        <span className="tag">日主{member.dayStem}·{member.dayElement}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <button className="btn-restart" onClick={onRestart}>再测一次 ↺</button>
    </div>
  )
}

// ─── 主 App ───────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]         = useState('landing')
  const [userData, setUserData] = useState(null)
  const [results, setResults]   = useState([])

  function handlePart1Done(data) { setUserData(data); setPage('part2') }

  function handlePart2Done(answers) {
    const scored = TF_MEMBERS.map(m => calculateScore(userData, m, answers)).sort((a,b) => b.total - a.total)
    setResults(scored)
    setPage('loading')
  }

  function handleRestart() { setUserData(null); setResults([]); setPage('landing') }

  return (
    <div className="app">
      {page==='landing' && <LandingPage onStart={() => setPage('part1')}/>}
      {page==='part1'   && <Part1Page   onNext={handlePart1Done}/>}
      {page==='part2'   && <Part2Page   onNext={handlePart2Done}/>}
      {page==='loading' && <LoadingPage onDone={() => setPage('result')}/>}
      {page==='result'  && <ResultPage  results={results} onRestart={handleRestart}/>}
    </div>
  )
}
