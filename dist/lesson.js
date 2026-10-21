// Bild, språk och interaktion beskriver samma regel. All text finns även som HTML.
const LESSONS = {
  grund: {
    title: 'Is eller are? Titta på vem.',
    intro: 'På svenska säger vi är. På engelska väljer vi ord efter vem eller vad meningen handlar om.',
    scenes: [
      { label: 'En person', art: 'solo', artLabel: 'En person: hon', subject: 'She', verb: 'is', end: 'happy.', translation: 'Hon är glad.', bridge: 'hon → she', group: 'HE · SHE · IT', title: 'Med she använder du is.', why: 'He, she och it hör ihop med is. Titta på ordet före verbet: She is happy.', clue: 'he / she / it → is' },
      { label: 'Flera personer', art: 'group', artLabel: 'Tre personer: de', subject: 'They', verb: 'are', end: 'happy.', translation: 'De är glada.', bridge: 'de → they', group: 'YOU · WE · THEY', title: 'Byt she mot they. Då byts verbet också.', why: 'They betyder de. They hör ihop med are, precis som we och you. Happy behöver inte ändras på engelska.', clue: 'you / we / they → are' },
      { label: 'Men du då?', art: 'you', artLabel: 'En person som du talar direkt till: du', subject: 'You', verb: 'are', end: 'happy.', translation: 'Du är glad. / Ni är glada.', bridge: 'du eller ni → you', group: 'YOU · WE · THEY', title: 'En enda person? You har ändå are!', why: 'Att bara räkna personer räcker inte. You hör alltid ihop med are, både när det betyder du och när det betyder ni.', clue: 'you → alltid are' }
    ],
    check: { sentence: 'You ___ my friend.', answer: 'are', explanation: 'You betyder du här. Med you använder du alltid are, både när det betyder du och när det betyder ni.', translation: 'Du är min vän.' }
  },
  vidare: {
    title: 'Byt till ett litet ord. Hitta rätt verb.',
    intro: 'Långa namn och substantiv blir enklare om du tänker: kan jag säga he, she, it eller they i stället?',
    scenes: [
      { label: 'En katt', art: 'cat', artLabel: 'En orange katt', subject: 'The cat', verb: 'is', end: 'here.', translation: 'Katten är här.', bridge: 'the cat → it', group: 'IT → IS', title: 'En katt kan bli it.', why: 'The cat är en katt. Byt i tanken: It is here. Samma verb passar i The cat is here.', clue: 'the cat → it → is' },
      { label: 'Flera katter', art: 'cats', artLabel: 'Tre katter tillsammans', subject: 'The cats', verb: 'are', end: 'here.', translation: 'Katterna är här.', bridge: 'the cats → they', group: 'THEY → ARE', title: 'Flera katter kan bli they.', why: 'The cats betyder flera katter. Byt i tanken: They are here. Då blir det The cats are here.', clue: 'the cats → they → are' },
      { label: 'Två namn', art: 'duo', artLabel: 'Två personer: Tom och Ali', subject: 'Tom and Ali', verb: 'are', end: 'here.', translation: 'Tom och Ali är här.', bridge: 'Tom and Ali → they', group: 'THEY → ARE', title: 'Två namn. Ett they.', why: 'And binder ihop Tom och Ali. Tillsammans är de flera: they. Därför väljer vi are.', clue: 'Tom + Ali → they → are' },
      { label: 'Ett klurigt plural', art: 'group', artLabel: 'Tre barn: children', subject: 'The children', verb: 'are', end: 'here.', translation: 'Barnen är här.', bridge: 'the children → they', group: 'THEY → ARE', title: 'Alla plural slutar inte på s.', why: 'Ett barn heter a child. Flera barn heter children. Children kan bli they, så verbet blir are.', clue: 'children → they → are' }
    ],
    check: { sentence: 'The dogs ___ hungry.', answer: 'are', explanation: 'The dogs är flera hundar. Byt till they: They are hungry. Alltså The dogs are hungry.', translation: 'Hundarna är hungriga.' }
  },
  utmaning: {
    title: 'Låt rätt ord bestämma.',
    intro: 'Det närmaste ordet är inte alltid det viktigaste. Hitta vem eller vad meningen faktiskt handlar om.',
    scenes: [
      { label: 'Lådan eller pennorna?', art: 'box', artLabel: 'En låda som innehåller flera pennor. En ring markerar själva lådan.', subject: 'The box', extra: 'of pencils', verb: 'is', end: 'blue.', translation: 'Lådan med pennor är blå.', bridge: 'the box → it', group: 'EN LÅDA → IT → IS', title: 'Pennorna försöker lura dig. Följ lådan!', why: 'Meningen handlar om en box. Of pencils berättar bara vad som finns i den. Tänk bort den delen: The box is blue.', clue: 'the box (of pencils) → it → is' },
      { label: 'Gör en fråga', art: 'duo', artLabel: 'Två vänner. En pil visar att are flyttas framför subjektet i en fråga.', subject: 'Your friends', verb: 'are', end: 'ready.', translation: 'Dina vänner är redo. → Är dina vänner redo?', bridge: 'your friends → they', group: 'THEY → ARE', title: 'Samma verb. Ny plats.', why: 'Börja med Your friends are ready. I frågan flyttar are framför your friends. Antalet ändras inte, så verbet är fortfarande are.', clue: 'Are your friends ready?', question: true },
      { label: 'Lägg till inte', art: 'solo', artLabel: 'En person: hon', subject: 'She', verb: 'is', end: 'not tired.', translation: 'Hon är inte trött.', bridge: 'hon → she', group: 'SHE → IS', title: 'Not säger nej. She bestämmer verbet.', why: 'Not betyder inte. Det ändrar meningens betydelse, men she hör fortfarande ihop med is: She is not tired.', clue: 'she → is, även med not' },
      { label: 'Det finns …', art: 'cats', artLabel: 'Två katter som finns i en trädgård', subject: 'two cats', verb: 'are', end: 'in the garden.', translation: 'Det finns två katter i trädgården.', bridge: 'two cats → flera', group: 'THERE ARE + FLERA', title: 'Efter there: titta på vad som finns.', why: 'Det finns heter här there is eller there are. En katt: There is a cat. Två katter: There are two cats.', clue: 'There is a cat. / There are two cats.', there: true }
    ],
    check: { sentence: 'The bag of books ___ heavy.', answer: 'is', explanation: 'Det är en väska som är tung. Of books beskriver innehållet. Tänk: The bag → it → is.', translation: 'Väskan med böcker är tung.' }
  }
};

function lessonArt(scene) {
  const person = (x, y, shirt, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cx="0" cy="104" rx="36" ry="7" fill="#173e3910"/><path d="M-22 74l-5 29M22 74l5 29" stroke="#254d49" stroke-width="12" stroke-linecap="round"/><path d="M-27 48l-14 23M27 48l14 23" stroke="#dfaa85" stroke-width="11" stroke-linecap="round"/><path d="M-30 46Q0 22 30 46L25 82H-25Z" fill="${shirt}"/><circle cy="12" r="26" fill="#ebbb95"/><path d="M-25 10Q-34-24 0-20Q30-23 26 8L13-2Q-5 12-25 10" fill="#294947"/><circle cx="-8" cy="12" r="2.2" fill="#294947"/><circle cx="9" cy="12" r="2.2" fill="#294947"/><path d="M-6 23Q1 29 8 23" fill="none" stroke="#824d42" stroke-width="2.5" stroke-linecap="round"/></g>`;
  const cat = (x, y, color, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cy="59" rx="42" ry="7" fill="#173e3910"/><path d="M27 40q51 3 27-28" stroke="${color}" stroke-width="12" fill="none" stroke-linecap="round"/><ellipse cy="26" rx="30" ry="33" fill="${color}"/><path d="M-29-13l2-29L-6-25M29-13l-2-29L6-25" fill="${color}"/><ellipse cy="-9" rx="32" ry="26" fill="${color}"/><path d="M-22-22l2-9 8 8M22-22l-2-9-8 8" fill="#e8b8a2"/><circle cx="-12" cy="-9" r="3" fill="#244b47"/><circle cx="12" cy="-9" r="3" fill="#244b47"/><path d="M-4 1h8L0 6z" fill="#704840"/><path d="M0 6q-5 8-10 2M0 6q5 8 10 2" fill="none" stroke="#704840" stroke-width="2"/><path d="M-21 1l-18-3M-21 6l-18 4M21 1l18-3M21 6l18 4" stroke="#704840" stroke-width="1.5"/></g>`;
  let art = '';
  if (scene.art === 'solo' || scene.art === 'you') art = person(160, 105, '#8d9cde', 1.15);
  if (scene.art === 'duo') art = person(104, 112, '#8d9cde') + person(211, 112, '#e3a264');
  if (scene.art === 'group') art = person(70, 123, '#8d9cde', .85) + person(160, 106, '#80b6a2', 1) + person(252, 123, '#e3a264', .85);
  if (scene.art === 'cat') art = cat(153, 155, '#e9ac70', 1.35);
  if (scene.art === 'cats') art = cat(80, 165, '#e9ac70', .85) + cat(165, 145, '#a4b8ad', 1.1) + (scene.there ? '' : cat(250, 168, '#a8a2cd', .8));
  if (scene.art === 'box') art = `<g transform="translate(78 44)"><path d="M20 13l8-13 8 13v94H20Z" fill="#edb65f" stroke="#294947" stroke-width="2"/><path d="M71 13l8-13 8 13v94H71Z" fill="#beafd9" stroke="#294947" stroke-width="2"/><path d="M121 13l8-13 8 13v94h-16Z" fill="#83b5a2" stroke="#294947" stroke-width="2"/><path d="M0 87l131-13 38 27-133 17Z" fill="#b6d5df"/><path d="M0 87l36 31v75L0 161Z" fill="#6e9eb6"/><path d="M36 118l133-17v75L36 193Z" fill="#8db7cb"/><path d="M69 142l65-8v23l-65 8Z" fill="#f5edcd"/><text x="102" y="153" font-size="13" text-anchor="middle" fill="#294947" font-family="sans-serif">ONE BOX</text></g><ellipse cx="163" cy="192" rx="116" ry="58" fill="none" stroke="#a16c2f" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  if (scene.art === 'you') art += '<path d="M234 74q-2-30-33-26" fill="none" stroke="#9c6638" stroke-width="3" stroke-linecap="round"/><path d="M210 42l-12 6 11 6" fill="none" stroke="#9c6638" stroke-width="3" stroke-linecap="round"/><text x="246" y="89" text-anchor="middle" font-size="17" fill="#80582e" font-family="sans-serif">du!</text>';
  return `<svg viewBox="0 0 320 265" class="lesson-illustration" role="img" aria-label="${scene.artLabel}"><ellipse cx="160" cy="141" rx="148" ry="111" fill="${scene.verb === 'is' ? '#e2e8fa' : '#dfeeda'}"/><path d="M32 52v14m-7-7h14M281 212v12m-6-6h12" stroke="#91a17b" stroke-width="2"/>${art}<text x="160" y="253" text-anchor="middle" fill="#35534c" font-size="14" font-weight="600" font-family="sans-serif">${scene.bridge}</text></svg>`;
}

function lessonShell(level) {
  const lesson = LESSONS[level.id];
  return `<section class="aha-lab" aria-labelledby="aha-title"><div class="aha-heading"><div><span class="eyebrow"><span aria-hidden="true">✦</span> AHA-LABBET · SE, BYT, FÖRSTÅ</span><h2 id="aha-title">${lesson.title}</h2></div><button type="button" class="lesson-toggle" aria-expanded="${session.lessonOpen}" aria-controls="lesson-body">${session.lessonOpen ? 'Fäll ihop förklaringen −' : 'Visa bildförklaringen +'}</button></div><div id="lesson-body" ${session.lessonOpen ? '' : 'hidden'}><p class="lesson-intro">${lesson.intro}</p><div class="scene-picker" role="group" aria-label="Välj ett exempel">${lesson.scenes.map((scene, i) => `<button type="button" data-scene="${i}" aria-pressed="${session.scene === i}"><span class="scene-index">${i + 1}</span>${scene.label}</button>`).join('')}</div><div id="lesson-scene" aria-live="polite">${lessonScene(level)}</div><div class="lesson-check"><div><span class="eyebrow">TESTA DIN TANKE</span><p lang="en">${lesson.check.sentence.replace('___','<span class="check-gap">…</span>')}</p><span class="tiny">${lesson.check.translation} · Prova fritt, utan poäng.</span></div><div class="check-answers" role="group" aria-label="Testa din tanke, välj is eller are">${['is','are'].map(v => `<button type="button" data-check="${v}" aria-pressed="${session.lessonChoice === v}" lang="en">${v}</button>`).join('')}</div><div id="check-feedback" class="check-feedback" role="status">${lessonCheckFeedback(level)}</div></div><div class="lesson-foot"><p><strong>Kom ihåg:</strong> He, she, it → <b>is</b>. You, we, they → <b>are</b>. <span>I → am.</span></p><button type="button" class="button" id="lesson-to-quiz">Nu testar jag själv <span aria-hidden="true">↓</span></button></div></div></section>`;
}
function lessonScene(level) {
  const scene = LESSONS[level.id].scenes[session.scene];
  const subject = `<span class="sentence-subject">${scene.subject}</span>`;
  const verb = `<span class="sentence-verb ${scene.verb}">${scene.verb}</span>`;
  let sentence = `${subject} ${scene.extra ? `<span class="sentence-extra">${scene.extra}</span> ` : ''}${verb} ${scene.end}`;
  if (scene.there) sentence = `There ${verb} ${subject} ${scene.end}`;
  return `<div class="lesson-stage"><div class="lesson-picture">${lessonArt(scene)}<span class="picture-badge ${scene.verb}">${scene.group}</span></div><div class="lesson-explainer"><span class="eyebrow">${session.scene + 1} / ${LESSONS[level.id].scenes.length} · TITTA VAD SOM HÄNDER</span><h3>${scene.title}</h3><div class="lab-sentence" lang="en">${sentence}</div>${scene.question ? '<div class="question-transform"><span aria-hidden="true">↓</span><span lang="en"><span class="sentence-verb are">Are</span> <span class="sentence-subject">your friends</span> ready?</span></div>' : ''}<p class="sentence-translation">${scene.translation}</p><p class="scene-why">${scene.why}</p><div class="rule-trail"><span aria-hidden="true">↳</span> <strong>${scene.clue}</strong></div></div></div>`;
}
function lessonCheckFeedback(level) {
  if (!session.lessonChoice) return '';
  const check = LESSONS[level.id].check, correct = session.lessonChoice === check.answer;
  return `<div class="check-message ${correct ? 'right' : 'retry'}"><strong>${correct ? 'Ja! Du hittade kopplingen.' : 'Bra att du provar. Följ kopplingen en gång till.'}</strong><p>${check.explanation}</p></div>`;
}
function bindLesson(level) {
  const toggle = main.querySelector('.lesson-toggle');
  function setOpen(open) {
    session.lessonOpen = open;
    if (open) session.lessonViewed = true;
    main.querySelector('#lesson-body').hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Fäll ihop förklaringen −' : 'Visa bildförklaringen +';
  }
  toggle.addEventListener('click', () => setOpen(!session.lessonOpen));
  main.querySelectorAll('[data-scene]').forEach(button => button.addEventListener('click', () => {
    session.scene = Number(button.dataset.scene);
    main.querySelectorAll('[data-scene]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    main.querySelector('#lesson-scene').innerHTML = lessonScene(level);
  }));
  main.querySelectorAll('[data-check]').forEach(button => button.addEventListener('click', () => {
    session.lessonChoice = button.dataset.check;
    main.querySelectorAll('[data-check]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    main.querySelector('#check-feedback').innerHTML = lessonCheckFeedback(level);
  }));
  main.querySelector('#lesson-to-quiz').addEventListener('click', () => {
    setOpen(false);
    const quiz = main.querySelector('.quiz-panel');
    quiz.scrollIntoView({ behavior: 'instant', block: 'start' });
    quiz.querySelector('[data-answer]:not(:disabled)')?.focus({ preventScroll: true });
  });
}

function pocketRule(level) {
  return `<aside class="panel pocket-rule" aria-label="Snabbregel"><div class="eyebrow">DIN KOMPASS</div><h2>Vem styr ordet?</h2><div class="pocket-match"><span lang="en">he · she · it</span><strong class="is">is</strong></div><div class="pocket-match"><span lang="en">you · we · they</span><strong class="are">are</strong></div><p class="pocket-warning"><b>You → alltid are.</b><br>Även när you betyder du.</p>${level.id !== 'grund' ? `<p class="pocket-strategy">${level.id === 'vidare' ? 'Byt i tanken:<br><b lang="en">the cats → they → are</b>' : 'Hitta huvudordet:<br><b lang="en">the box (of pencils) → it → is</b>'}</p>` : ''}<p class="tiny">Med I använder du am: <span lang="en">I am happy.</span></p><p class="rule-note">Ditt mål: ${level.goal}</p></aside>`;
}

function reasoningRoute(level, index) {
  const subjects = {
    grund: [['She','she'],['They','they'],['He','he'],['We','we'],['It','it'],['You','you'],['She','she'],['They','they'],['He','he'],['We','we']],
    vidare: [['The dog','it'],['The books','they'],['Emma','she'],['Tom and Ali','they'],['My shoes','they'],['The bus','it'],['My parents','they'],['This apple','it'],['The children','they'],['The teacher','he / she / singular they']],
    utmaning: [['your friends','they'],['The box','it'],['She','she'],['two cats','flera'],['this','it'],['The keys','they'],['You','you'],['a problem','en'],['My brother and I','we'],['The girl','she']]
  };
  const [subject, pronoun] = subjects[level.id][index];
  const verb = level.questions[index][1];
  // För en lärare utan angivet kön används här antalet, inte ett antaget pronomen.
  const middle = level.id === 'vidare' && index === 9 ? 'en lärare' : pronoun;
  return `<div class="reasoning-route" aria-label="Så hänger det ihop"><span class="reason-subject" lang="en">${subject}</span><span aria-hidden="true">→</span><span class="reason-pronoun">${middle}</span><span aria-hidden="true">→</span><strong class="reason-verb ${verb}" lang="en">${verb}</strong></div>`;
}

function resultAha(level) {
  const scene = LESSONS[level.id].scenes[0];
  return `<aside class="result-aha"><div>${lessonArt(scene)}</div><div><span class="eyebrow">TA MED DIG EN KOPPLING</span><h2>${level.id === 'grund' ? 'Is eller are? Titta på vem.' : level.id === 'vidare' ? 'Byt i tanken. Då hittar du verbet.' : 'Huvudordet bestämmer.'}</h2><p>${level.id === 'grund' ? '<span lang="en">She <b>is</b> happy. They <b>are</b> happy.</span><br>Och kom ihåg: you har alltid are, även när du pratar med en person.' : level.id === 'vidare' ? '<span lang="en">The cat → it → is.<br>The cats → they → are.</span>' : '<span lang="en">The box (of pencils) → it → is.</span><br>Pennorna beskriver innehållet. Det är lådan som styr verbet.'}</p><a class="text-link" href="#ova/${level.id}">${level.id === 'utmaning' ? 'Öva nivån igen utan stöd' : 'Utforska bildförklaringen och öva igen'} ↗</a></div></aside>`;
}
