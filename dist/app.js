'use strict';
const STORAGE_KEY = 'larolabbet-grammar-v1';
let storageAvailable = true;
let attempts = [];
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (Array.isArray(saved)) attempts = saved.filter(a => a && LEVELS.some(l => l.id === a.level) && typeof a.id === 'string' && Number.isFinite(a.score) && Array.isArray(a.answers) && a.answers.length === 10 && a.answers.every(q => q && typeof q.choice === 'string' && typeof q.hint === 'boolean') && !isNaN(Date.parse(a.date)));
} catch { storageAvailable = false; }
let session = null;
let reportName = '';
let reportReflection = '';
let toastTimer;
const main = document.getElementById('main');
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const getLevel = id => LEVELS.find(l => l.id === id);
const getTopic = level => TOPICS[level.topic];
const SUPPORT_MODES = { grund: 'guided-v1', vidare: 'optional-v1', utmaning: 'independent-v1' };
const SUPPORT_LABELS = { grund: 'Med synligt stöd', vidare: 'Stöd vid behov', utmaning: 'Utan stöd under övningen' };
function supportDescription(a) {
  if (a.supportMode === 'independent-v1') return 'Utan inbyggt stöd. Ingen översättning, ledtråd eller rättning visades under övningen.';
  if (a.supportMode === 'optional-v1') return `Stöd vid behov. Bildförklaring ${a.lessonViewed ? 'öppnad' : 'inte öppnad'}. Svensk översättning och ledtrådar var tillgängliga.`;
  if (a.supportMode === 'guided-v1') return 'Med synligt regelstöd. Bildförklaring, svensk översättning och ledtrådar var tillgängliga.';
  return 'Tidigare version: regelstöd och rättning var tillgängliga under övningen.';
}
function filledSentence(question, answer) {
  return question.replace('___', question.startsWith('___') ? answer[0].toUpperCase() + answer.slice(1) : answer);
}
const xp = () => attempts.reduce((total, a) => total + a.score * 10, 0);
const dateLabel = value => new Date(value).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' });
const warning = () => storageAvailable ? '' : '<p class="storage-warning" role="status">Webbläsaren kan inte spara framstegen. Kopiera din rapport innan du lämnar sidan.</p>';
function toast(message) {
  const el = document.getElementById('toast'); el.textContent = message; el.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 4500);
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts)); }
  catch { storageAvailable = false; }
}
function cards(topic = 'be') {
  return `<div class="cards">${LEVELS.filter(l => l.topic === topic).map((l, i) => {
    const done = attempts.filter(a => a.level === l.id);
    const best = done.length ? Math.max(...done.map(a => a.score)) : null;
    return `<a class="level-card" href="#ova/${l.id}"><div class="card-art ${l.color}"><span class="level-number">${l.icon}</span><span class="grammar-doodle" aria-hidden="true">${getTopic(l).doodles[i]}</span><span class="pill">${best === null ? 'Öppen för alla' : `Bäst: ${best}/10`}</span></div><div class="card-body"><span class="eyebrow">${l.tag} · ${getTopic(l).short.toUpperCase()}</span><h3>${l.name}</h3><p>${l.description}</p><span class="card-support">${SUPPORT_LABELS[l.stage]}</span><div class="card-meta"><span>10 frågor</span><span>◷ ${l.time}</span></div><div class="card-link"><span>${done.length ? 'Öva igen' : 'Börja öva'}</span><span aria-hidden="true">↗</span></div></div></a>`;
  }).join('')}</div>`;
}
function topicNavigation() {
  return `<nav class="topic-navigation" aria-label="Grammatikområden">${Object.values(TOPICS).map(t=>`<a href="#amne/${t.id}">${t.short} <span aria-hidden="true">↗</span></a>`).join('')}</nav>`;
}
function topicSections(topic) {
  return (topic ? [topic] : Object.values(TOPICS)).map(t=>`<section class="topic-section" aria-labelledby="choose-${t.id}"><div class="section-head"><div><div class="eyebrow">${t.label} · TRE NIVÅER</div><h2 id="choose-${t.id}">${t.title}</h2></div><p>${t.intro}</p></div>${cards(t.id)}</section>`).join('');
}
function home() {
  main.innerHTML = `<section class="hero"><div><div class="eyebrow"><span class="dot"></span> EN LITEN STUND. ETT NYTT AHA.</div><h1>Engelsk grammatik.<br><em>Nu faller det på plats.</em></h1><p>Svenska förklaringar. Engelska exempel. Små övningar som gör det lättare att förstå – och roligare att fortsätta.</p><div class="hero-actions"><a class="button" href="#ova/grund">Testa is & are <span aria-hidden="true">→</span></a><span class="tiny">Inget konto. Börja där du är.</span></div></div><div class="hero-art" aria-hidden="true"><div class="art-orbit"></div><span class="art-star">✳</span><div class="word-card one"><small>EN PERSON</small>She <b>is</b> curious.</div><div class="mascot"><span class="leaf"></span></div><div class="word-card two"><small>FLERA PERSONER</small>They <b>are</b> ready.</div><span class="art-caption">En regel. Många möjligheter. ↗</span></div></section><section class="stat-strip" aria-label="Så fungerar det"><div><span class="stat-symbol" aria-hidden="true">↗</span><div><strong>3 nivåer, din takt</strong><small>Från första steget till en utmaning</small></div></div><div><span class="stat-symbol" aria-hidden="true">✦</span><div><strong>Lär av varje svar</strong><small>Förklaringar som hjälper dig vidare</small></div></div><div><span class="stat-symbol" aria-hidden="true">✓</span><div><strong>Se vad du kan</strong><small>Samla poäng och följ dina framsteg</small></div></div></section>${topicNavigation()}${topicSections()}<aside class="bottom-note"><div><h3>Det du lär dig ska synas.</h3><p>Kopiera din resultatbild och dela den med din lärare.</p></div><a class="text-link" href="#larare">Så fungerar återkopplingen ↗</a></aside>${warning()}`;
}
function exerciseList(topic = null) {
  main.innerHTML = `<div class="page-intro"><div class="eyebrow">UTFORSKA & ÖVA</div><h1>${topic ? topic.title : 'Hitta ditt nästa aha.'}</h1><p>${topic ? topic.intro : 'Välj mellan is/are, have/has och a/an.'} Välj en nivå som känns lagom. På nivå 1 syns stödet direkt. På nivå 2 öppnar du det vid behov. På nivå 3 svarar du själv och får förklaringar när hela övningen är klar.</p></div>${topicNavigation()}${topicSections(topic)}<aside class="bottom-note"><div><h3>Osäker på var du ska börja?</h3><p>Testa Kom igång. Känns det lätt kan du gå direkt till nästa nivå.</p></div><a class="text-link" href="#ova/grund">Till nivå 1 →</a></aside>`;
}
function start(level) {
  session = { level: level.id, index: 0, answers: [], choice: null, hint: false, started: Date.now(), completed: false, lessonOpen: level.stage === 'grund', lessonViewed: level.stage === 'grund', scene: 0, lessonChoice: null };
  quiz();
}
function quiz() {
  const l = getLevel(session.level), q = l.questions[session.index], answered = session.choice !== null;
  const independent = l.stage === 'utmaning';
  const isCorrect = answered && session.choice === q[1];
  const displayAnswer = independent ? session.choice : q[1];
  const word = answered ? (q[0].startsWith('___') ? displayAnswer[0].toUpperCase() + displayAnswer.slice(1) : displayAnswer) : '___';
  const support = independent
    ? '<aside class="independent-notice"><span class="eyebrow">NU PÅ EGEN HAND</span><p>10 frågor utan förklaring, översättning eller ledtrådar. Du svarar en gång per fråga. Du får resultat och förklaringar efter sista frågan.</p></aside>'
    : lessonShell(l);
  main.innerHTML = `<a class="back" href="#ovningar">← Alla övningar</a><div class="page-intro" style="padding-bottom:0"><div class="eyebrow">${l.tag} · ${l.name.toUpperCase()}</div><h1>${getTopic(l).title}</h1><span class="support-label">${SUPPORT_LABELS[l.stage]}</span></div>${support}<div class="exercise-layout ${l.stage !== 'grund' ? 'without-pocket' : ''}">${l.stage === 'grund' ? pocketRule(l) : ''}<section class="panel quiz-panel" aria-label="Övningsfråga"><div class="quiz-top"><span>Fråga ${session.index + 1} av ${l.questions.length}</span><span>${independent ? `${session.answers.length} svar registrerade` : `${session.answers.filter(a => a.correct).length} rätt hittills`}</span></div><div class="progress-track" role="progressbar" aria-label="Besvarade frågor" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${session.index + (answered ? 1 : 0)}"><span style="width:${(session.index + (answered ? 1 : 0)) * 10}%"></span></div><div class="question">${l.stage === 'grund' && q[5] ? `<div class="question-picture">${lessonArt({art:q[5],artLabel:q[3],verb:'',bridge:''})}</div>` : ''}<p class="eyebrow">VÄLJ ORDET SOM PASSAR</p><h2 lang="en">${q[0].replace('___', `<span class="blank">${word}</span>`)}</h2>${!independent ? `<p class="translation">${q[3]}</p>` : ''}</div><div class="answers">${getTopic(l).options.map(option => `<button class="answer ${answered ? (independent ? (option === session.choice ? 'recorded' : '') : (option === q[1] ? 'correct' : option === session.choice ? 'wrong' : '')) : ''}" data-answer="${option}" ${answered ? 'disabled' : ''} lang="en">${option}${answered && !independent ? (option === q[1] ? ' ✓' : option === session.choice ? ' ×' : '') : ''}</button>`).join('')}</div>${answered ? (independent ? '<div class="answer-receipt" role="status">Ditt svar är registrerat. Rättning och förklaring kommer när du är klar med alla frågor.</div>' : `<div class="feedback ${isCorrect ? '' : 'wrong'}" role="status"><strong>${isCorrect ? 'Precis så!' : `Här blir det ${q[1]}.`}</strong><p>${q[2]}</p>${reasoningRoute(l, session.index)}</div>`) : ''}${!independent && session.hint ? `<div class="hint">Tips: ${getTopic(l).memory}</div>` : ''}<div class="quiz-bottom">${!independent ? `<button class="hint-btn" id="hint" ${answered || session.hint ? 'disabled' : ''}>${session.hint ? 'Ledtråd visad' : 'Jag vill ha en ledtråd'}</button>` : '<span class="tiny">Rättning efter sista frågan.</span>'}${answered ? `<button class="button" id="next">${session.index === 9 ? 'Visa mitt resultat' : 'Nästa fråga'} <span aria-hidden="true">→</span></button>` : `<span class="tiny">Välj ${getTopic(l).options.join(' eller ')} ovan.</span>`}</div></section></div>`;
  if (!independent) bindLesson(l);
  main.querySelectorAll('[data-answer]').forEach(b => b.addEventListener('click', () => {
    if (session.choice !== null) return;
    session.choice = b.dataset.answer;
    session.answers.push({ choice: session.choice, correct: session.choice === q[1], hint: session.hint });
    quiz(); document.getElementById('next').focus();
  }));
  document.getElementById('hint')?.addEventListener('click', () => { session.hint = true; quiz(); main.querySelector('[data-answer]').focus(); });
  document.getElementById('next')?.addEventListener('click', () => {
    if (session.index < 9) { session.index++; session.choice = null; session.hint = false; quiz(); main.querySelector('[data-answer]').focus(); }
    else complete();
  });
}
function complete() {
  if (session.completed) return;
  session.completed = true;
  const a = { id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `a-${Date.now()}-${Math.random().toString(36).slice(2)}`, level: session.level, supportMode: SUPPORT_MODES[getLevel(session.level).stage], lessonViewed: session.lessonViewed, date: new Date().toISOString(), score: session.answers.filter(a => a.correct).length, answers: session.answers, seconds: Math.round((Date.now() - session.started) / 1000) };
  attempts.push(a); save(); location.hash = `resultat/${a.id}`;
}
function reportText(a) {
  const l = getLevel(a.level), assisted = a.answers.filter(x => x.hint).length;
  return `LÄROLABBET – GRAMMATIK\nElev: ${reportName.trim() || '(fyll i namn eller elevkod)'}\nDatum: ${dateLabel(a.date)}\nÖvning: ${getTopic(l).title} · ${l.tag} – ${l.name}\nMål: ${l.goal}\nStöd: ${supportDescription(a)}\nRätt på första svaret: ${a.score}/10 (${a.score * 10} %)\nVarav rätt utan ledtråd: ${a.answers.filter(x => x.correct && !x.hint).length}/10\nFrågor med ledtråd: ${assisted}/10\n\nSVAR PER FRÅGA\n${l.questions.map((q, i) => `${i + 1}. ${q[0]}\n   Elevens svar: ${a.answers[i].choice}. Facit: ${q[1]}. ${a.answers[i].correct ? 'Rätt' : 'Behöver övas'}.${a.answers[i].hint ? ' Ledtråd använd.' : ''}`).join('\n')}\n\nMIN REFLEKTION\n${reportReflection.trim() || '(Vad förstår du bättre? Vad vill du öva mer på?)'}\n\nElevrapporterat övningsresultat. ${a.supportMode === 'independent-v1' ? 'Facit och förklaringar visades först efter sista frågan.' : 'Se stödstatus ovan.'} Rapporten är ett samtalsunderlag, inte ett övervakat prov.`;
}
function result(a) {
  const l = getLevel(a.level), hints = a.answers.filter(x => x.hint).length;
  const independent = a.supportMode === 'independent-v1';
  const needsPractice = l.questions.map((q, i) => ({q, a: a.answers[i], index: i})).filter(x => independent || !x.a.correct || x.a.hint);
  main.innerHTML = `<a class="back" href="#framsteg">← Mina framsteg</a><section class="result-hero"><div class="eyebrow" style="justify-content:center">ÖVNING KLAR · ${getTopic(l).short.toUpperCase()} · ${l.name.toUpperCase()}</div><h1>${a.score >= 8 ? 'Det börjar sitta!' : 'Ett steg närmare ditt aha.'}</h1><div class="result-score">${a.score}<small> / 10 rätt</small></div><p>Rätt på första svaret · ${hints} ledtråd${hints === 1 ? '' : 'ar'} använd${hints === 1 ? '' : 'a'}</p><span class="tag">+${a.score * 10} övningspoäng</span><span class="tag">${a.score === 10 && hints === 0 ? 'Utan ledtrådar ✦' : 'Varje försök räknas'}</span></section><p class="result-support">${supportDescription(a)}</p>${resultAha(l)}<div class="result-grid report-layout"><section class="panel"><h2>${independent ? 'Nu går vi igenom dina svar' : 'Det här tar du med dig'}</h2><p class="tiny">${independent ? 'Här får du facit och förklaring till alla tio frågor. Jämför med dina egna svar.' : needsPractice.length ? 'Titta en gång till på frågorna där du svarade fel eller använde en ledtråd.' : 'Du klarade alla frågor utan ledtrådar. Prova nästa nivå eller repetera en annan dag.'}</p>${needsPractice.map(({q, a: ans, index}) => `<div class="review-item"><strong lang="en">${filledSentence(q[0], q[1])}</strong><p>Ditt svar: <span lang="en">${ans.choice}</span>${ans.hint ? ' · Ledtråd använd' : ''}${independent ? (ans.correct ? ' · Rätt' : ' · Behöver övas') : ''}</p><p>${q[2]}</p>${reasoningRoute(l, index)}</div>`).join('')}<div class="actions"><a href="#ova/${l.id}" class="button secondary">Öva samma nivå igen</a>${l.stage !== 'utmaning' ? `<a href="#ova/${LEVELS.find(n => n.topic === l.topic && n.stage === STAGES[STAGES.indexOf(l.stage) + 1]).id}" class="button">Prova nästa nivå →</a>` : '<a href="#ovningar" class="button">Alla nivåer →</a>'}</div></section>${reportPanel(a)}</div>${warning()}`;
  bindReport(a);
}
function progress() {
  const perfect = attempts.some(a => a.score === 10 && !a.answers.some(x => x.hint));
  const allLevels = STAGES.every(stage => attempts.some(a => getLevel(a.level).stage === stage));
  main.innerHTML = `<div class="page-intro"><div class="eyebrow">DITT EGET LÄRANDE</div><h1>Små steg blir framsteg.</h1><p>Här finns övningarna du har slutfört i den här webbläsaren. Du får 10 poäng per rätt svar och kan samla märken längs vägen.</p></div><div class="stat-strip"><div><span class="stat-symbol">✦</span><div><strong>${xp()} poäng</strong><small>Från alla dina försök</small></div></div><div><span class="stat-symbol">✓</span><div><strong>${attempts.length} klara övningar</strong><small>Varje försök är ett steg</small></div></div><div><span class="stat-symbol">↗</span><div><strong>${new Set(attempts.map(a => getLevel(a.level).stage)).size} av 3 nivåer</strong><small>Utforskade av dig</small></div></div></div><h2 style="font-size:25px">Dina märken</h2><div class="badge-grid">${[['✧','Första steget','Slutför en övning',attempts.length > 0],['✦','Full pott','10 rätt utan ledtråd',perfect],['⚑','Utforskaren','Slutför alla tre nivåer',allLevels]].map(([symbol,title,desc,earned]) => `<div class="badge ${earned ? 'earned' : ''}"><span aria-hidden="true">${symbol}</span><strong>${title}</strong><small>${earned ? 'Upplåst · ' : ''}${desc}</small></div>`).join('')}</div><section class="panel"><h2 style="font-size:24px">Dina försök</h2>${attempts.length ? [...attempts].reverse().map(a => `<a class="history-row" href="#resultat/${a.id}"><div><strong>${getTopic(getLevel(a.level)).short} · ${getLevel(a.level).name}</strong><p>${dateLabel(a.date)} · ${a.supportMode === 'independent-v1' ? 'Utan inbyggt stöd' : a.supportMode === 'optional-v1' ? (a.lessonViewed ? 'Bildförklaring öppnad' : 'Bildförklaring inte öppnad') : a.supportMode === 'guided-v1' ? 'Med synligt stöd' : 'Tidigare version med stöd'}</p></div><div><strong>${a.score}/10</strong><p>Visa rapport ↗</p></div></a>`).join('') : '<div class="empty"><h3>Ditt första steg väntar.</h3><p>Gör en övning så hittar du resultat och lärarrapporter här.</p><a class="button" href="#ova/grund">Börja med is & are →</a></div>'}</section><p class="notice">Framsteg sparas på den här enheten och i den här webbläsaren. De följer inte med till en annan enhet och kan försvinna om webbläsardata rensas. På en delad dator: spara din rapport och rensa sedan dina resultat.</p>${attempts.length ? '<button class="hint-btn" id="clear">Rensa alla mina sparade resultat</button>' : ''}${warning()}`;
  document.getElementById('clear')?.addEventListener('click', () => {
    if (!confirm('Rensa alla sparade resultat i den här webbläsaren? Spara dina rapporter först.')) return;
    attempts = []; save(); progress(); toast('Dina resultat är rensade.');
  });
}
function teacher() {
  main.innerHTML = `<div class="page-intro"><div class="eyebrow">FÖR LÄRAREN</div><h1>Från övning till samtal.</h1><p>En enkel återkoppling utan elevkonton: eleven kopierar en tydlig resultatbild, du får ett underlag för nästa steg i undervisningen.</p></div><div class="teacher-grid"><section class="panel"><h2>Copy. Paste. Återkoppla.</h2><ol><li>Eleven väljer en nivå och slutför de tio frågorna.</li><li>På resultatsidan fyller eleven i namn eller elevkod och en kort reflektion.</li><li>Eleven väljer <strong>Kopiera bild</strong> och klistrar in rapporten i den kanal ni redan använder, till exempel Teams eller Classroom. Bilden kan också laddas ner som PNG och bifogas i en inlämning.</li><li>Du tittar på första svar, ledtrådar och mönster i felen. Bestäm tillsammans vad eleven ska öva på härnäst.</li></ol><a class="button" href="#ova/grund">Testa elevens flöde →</a></section><section class="panel"><h2>Mer än en poängsumma</h2><p>Rapporten visar nivå, övningens mål, datum, rätt på första svaret, användning av ledtrådar och varje svar med facit. Elevens egen reflektion ger ytterligare sammanhang.</p><p><strong>Förslag på återkoppling:</strong><br>”Du väljer säkert is med he och she. Nästa steg är att upptäcka plural, till exempel children. Testa Bygg vidare och förklara två av dina svar för mig.”</p><p>Stödet minskar mellan nivåerna: synligt på nivå 1, valfritt på nivå 2 och dolt under hela nivå 3. På nivå 3 visas rättning och förklaringar först efter sista frågan. Rapporten visar vilket stöd som fanns och om bildförklaringen öppnades på nivå 2. Övningen är inte ett övervakat prov. Resultatbilden innehåller poäng, alla svar och stödstatus. Den kan fortfarande bildredigeras och är inte verifierad mot en server. Använd den som underlag för formativ återkoppling, tillsammans med samtal och annat elevarbete.</p></section><section class="panel"><h2>Tre områden. Tre nivåer.</h2><p><strong>Is/are:</strong> former av be.<br><strong>Have/has:</strong> att ha i enkla påståenden.<br><strong>A/an:</strong> obestämd artikel, med ljudet som vägledning.</p><p><strong>Kom igång:</strong> enkla exempel med synligt bildstöd och svenska förklaringar.<br><strong>Bygg vidare:</strong> meningar, namn och beskrivningar. Öppna förklaringen vid behov.<br><strong>Utmana dig:</strong> längre subjekt, kluriga ljud och meningar utan stöd under övningen.</p><p>Nivåerna beskriver både svårighet och hur självständigt eleven arbetar. De är inte CEFR-nivåer eller betyg. Eleven kan välja fritt och repetera utan tidsgräns.</p></section><section class="panel"><h2>Enkel start. Plats att växa.</h2><p><strong>Nu:</strong> kopierbar resultatbild och nedladdning som PNG. Inga konton och ingen automatisk insamling av elevuppgifter.</p><p><strong>Ett möjligt nästa steg:</strong> en gemensam inlämningsmall i skolans befintliga lärplattform där eleven klistrar in resultatbilden och svarar på ”Vad behöver jag öva på?”.</p><p><strong>Senare:</strong> automatisk resultatinsamling och en lärarvy. Det kräver en separat tjänst med inloggning, behörigheter och genomtänkt hantering av elevuppgifter. Sidan behöver då byggas ut.</p></section></div><aside class="bottom-note"><div><h3>En del av Lärolabbet.</h3><p>Utforska också undervisningsmaterialet i SO.</p></div><a class="text-link" href="https://carraway96.github.io/larolabbet/" target="_blank" rel="noopener">Till Lärolabbet SO ↗</a></aside>`;
}
function route() {
  disposeReport(); disposeReport = () => {};
  const [page = 'hem', id] = location.hash.slice(1).split('/');
  document.querySelectorAll('[data-nav]').forEach(a => { const active = a.dataset.nav === page || (a.dataset.nav === 'ovningar' && ['ova','amne'].includes(page)); a.classList.toggle('active', active); if (active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  if (page === 'ova' && getLevel(id)) start(getLevel(id));
  else if (page === 'resultat' && attempts.some(a => a.id === id)) result(attempts.find(a => a.id === id));
  else if (page === 'framsteg') progress();
  else if (page === 'larare') teacher();
  else if (page === 'ovningar') exerciseList();
  else if (page === 'amne' && TOPICS[id]) exerciseList(TOPICS[id]);
  else home();
  document.title = `${page === 'ova' && getLevel(id) ? getTopic(getLevel(id)).title : page === 'framsteg' ? 'Mina framsteg' : page === 'larare' ? 'Till läraren' : page === 'resultat' ? 'Ditt resultat' : 'Engelsk grammatik'} · Lärolabbet`;
  window.scrollTo(0, 0); main.focus({ preventScroll: true });
}
window.addEventListener('hashchange', route);
route();
