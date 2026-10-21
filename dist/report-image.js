// Local canvas rendering: the exported report is a PNG, with no HTML or text payload.
let reportLogoPromise;
function loadReportLogo() {
  if (!reportLogoPromise) reportLogoPromise = new Promise(resolve => {
    const logo = new Image();
    logo.onload = () => resolve(logo);
    logo.onerror = () => resolve(null);
    logo.src = new URL('./assets/larolabbet-logo.png', document.baseURI).href;
  });
  return reportLogoPromise;
}

async function createReportImage(attempt, name, reflection) {
  const logo = await loadReportLogo();
  const level = getLevel(attempt.level);
  const canvas = document.createElement('canvas');
  canvas.width = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  const rows = [];
  let y = 0;
  const ink = '#19352f', muted = '#3f5148', green = '#174f43';
  function text(value, x, top, width, size = 26, color = ink, weight = 400) {
    ctx.font = `${weight} ${size}px Arial, sans-serif`;
    const lineHeight = Math.ceil(size * 1.45);
    const lines = [];
    for (const paragraph of String(value).replace(/\r\n/g, '\n').split('\n')) {
      let line = '';
      for (const word of paragraph.split(/\s+/).filter(Boolean)) {
        const candidate = line ? `${line} ${word}` : word;
        if (ctx.measureText(candidate).width <= width) { line = candidate; continue; }
        if (line) { lines.push(line); line = ''; }
        for (const character of Array.from(word)) {
          if (line && ctx.measureText(line + character).width > width) { lines.push(line); line = ''; }
          line += character;
        }
      }
      lines.push(line);
    }
    rows.push(() => {
      ctx.font = `${weight} ${size}px Arial, sans-serif`;
      ctx.fillStyle = color; ctx.textBaseline = 'top';
      lines.forEach((line, i) => ctx.fillText(line, x, top + i * lineHeight));
    });
    return lines.length * lineHeight;
  }
  function rect(x, top, w, h, color) { rows.push(() => { ctx.fillStyle = color; ctx.fillRect(x, top, w, h); }); }
  rect(0, 0, 1000, 155, green);
  if (logo) rows.push(() => ctx.drawImage(logo, 125, 118, 370, 370, 47, 36, 83, 83));
  text('Lärolabbet – Grammatik', logo ? 155 : 54, 43, 790, 36, '#ffffff', 700);
  text(`RESULTATRAPPORT · ${getTopic(level).title.toUpperCase()}`, logo ? 155 : 54, 91, 790, 22, '#d9ed9b', 700);
  y = 193;
  y += text(name.trim() ? `Elev: ${name.trim()}` : 'Elev: ej angivet', 54, y, 892, 34, ink, 700) + 9;
  y += text(`${dateLabel(attempt.date)}  ·  ${level.tag} – ${level.name}`, 54, y, 892, 24, muted) + 24;
  y += text(`Mål: ${level.goal}`, 54, y, 892, 26, ink) + 18;
  const supportY = y;
  // Reserve the background before laying out its variable-length text.
  const supportRows = rows.length;
  const supportHeight = text(supportDescription(attempt), 74, y + 17, 852, 24, green, 600) + 34;
  rows.splice(supportRows, 0, () => { ctx.fillStyle = '#e9efdf'; ctx.fillRect(54, supportY, 892, supportHeight); });
  y += supportHeight + 26;
  const hintCount = attempt.answers.filter(a => a.hint).length;
  const independentRight = attempt.answers.filter(a => a.correct && !a.hint).length;
  const stats = [[`${attempt.score} / 10`, 'Rätt på första svaret'], [`${independentRight} / 10`, 'Rätt utan ledtråd'], [`${hintCount} / 10`, 'Frågor med ledtråd']];
  stats.forEach(([value, label], i) => {
    const x = 54 + i * 302;
    rect(x, y, 288, 104, '#f0f2ed');
    text(value, x + 17, y + 12, 254, 40, green, 700);
    text(label, x + 17, y + 66, 254, 22, muted);
  });
  y += 137;
  y += text('SVAR PER FRÅGA', 54, y, 892, 22, green, 700) + 15;
  level.questions.forEach((q, i) => {
    const answer = attempt.answers[i], rowTop = y, insertion = rows.length;
    const questionHeight = text(`${i + 1}. ${q[0]}`, 74, y + 16, 852, 28, ink, 700);
    const status = `${answer.correct ? 'Rätt' : 'Behöver övas'}${answer.hint ? ' · Ledtråd använd' : ''}`;
    const detailHeight = text(`Elevens svar: ${answer.choice}   ·   Facit: ${q[1]}   ·   ${status}`, 74, y + 22 + questionHeight, 852, 24, answer.correct ? green : '#854a2c');
    const height = questionHeight + detailHeight + 39;
    rows.splice(insertion, 0, () => { ctx.fillStyle = i % 2 ? '#f5f6f1' : '#eef2eb'; ctx.fillRect(54, rowTop, 892, height); });
    y += height + 6;
  });
  y += 25;
  y += text('ELEVENS REFLEKTION', 54, y, 892, 22, green, 700) + 11;
  y += text(reflection.trim() || 'Ingen reflektion angiven.', 54, y, 892, 26, reflection.trim() ? ink : muted) + 28;
  rect(54, y, 892, 1, '#d7dfd2'); y += 22;
  y += text('Elevrapporterat övningsresultat. Bilden kan redigeras och är inte ett verifierat provresultat.', 54, y, 892, 22, muted) + 9;
  if (attempt.supportMode === 'independent-v1') y += text('Facit och förklaringar visades först efter sista frågan.', 54, y, 892, 22, muted) + 9;
  y += text(`Försök: ${attempt.id}`, 54, y, 892, 20, muted) + 37;
  const exportScale = 2;
  canvas.width = 1000 * exportScale;
  canvas.height = Math.ceil(y) * exportScale;
  ctx.scale(exportScale, exportScale);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  rows.forEach(draw => draw());
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG export failed')), 'image/png'));
}

let disposeReport = () => {};
let reportNeedsExport = false;
function warnBeforeLeavingReport(event) {
  event.preventDefault();
  event.returnValue = '';
}
function setReportNeedsExport(pending) {
  reportNeedsExport = pending;
  if (pending) window.addEventListener('beforeunload', warnBeforeLeavingReport);
  else window.removeEventListener('beforeunload', warnBeforeLeavingReport);
}
function reportPanel(a) {
  return `<section class="panel image-report-panel"><div class="submission-heading"><div class="eyebrow">SISTA STEGET · TILL DIN LÄRARE</div><h2>Klart med övningen? Lämna in ditt resultat!</h2><p>Din lärare får inte resultatet automatiskt. Följ de här tre stegen.</p></div><ol class="submission-steps"><li><strong>Gör bilden till din</strong><span>Fyll i namn eller elevkod om läraren vill det. Lägg gärna till en reflektion.</span></li><li><strong>Kopiera resultatbilden</strong><span>Tryck på <b>Kopiera bild</b> nedan. Du kan också ladda ner bilden som PNG.</span></li><li><strong>Klistra in och lämna in</strong><span>Öppna lärarens inlämning eller meddelande. Klistra in med <b>Ctrl + V</b> (Mac: <b>⌘ + V</b>) eller bifoga PNG-filen. Tryck sedan på <b>Lämna in</b> eller <b>Skicka</b>.</span></li></ol><p id="submission-state" class="submission-state" role="status">Kvar att göra: kopiera bilden och lämna in till läraren.</p><label class="field">Namn eller elevkod (valfritt)<input id="student-name" maxlength="100" autocomplete="off" value="${escapeHTML(reportName)}" placeholder="Till exempel elev 12"></label><label class="field">Min reflektion (valfritt)<textarea id="reflection" rows="2" maxlength="2000" placeholder="Nu förstår jag … Jag vill öva mer på …">${escapeHTML(reportReflection)}</textarea></label><div class="actions"><button class="button" id="copy">Kopiera bild <span aria-hidden="true">↗</span></button><button class="button secondary" id="download">Ladda ner bild (PNG)</button></div><p class="report-copy-status" id="report-copy-status" role="status"></p><figure class="report-figure"><figcaption>Din resultatbild <span>Större text och högupplöst PNG. Tryck på bilden för att läsa och zooma.</span></figcaption><div class="report-preview"><a id="report-image-open" target="_blank" rel="noopener" aria-label="Öppna resultatbilden i full storlek"><img id="report-image" alt="Resultatrapport med elev, nivå, datum, stöd, poäng, tio svar och reflektion." aria-describedby="report" hidden></a><p id="report-image-status" role="status">Skapar din resultatbild …</p></div></figure><dialog class="report-zoom" aria-labelledby="report-zoom-title"><div class="report-zoom-heading"><h3 id="report-zoom-title">Läs resultatrapporten</h3><button type="button" class="button secondary" id="close-report-zoom">Stäng</button></div><div class="report-zoom-tools" role="group" aria-label="Bildens storlek"><button type="button" class="button secondary" data-report-zoom="out" aria-label="Zooma ut">−</button><button type="button" class="button secondary" data-report-zoom="in" aria-label="Zooma in">+</button><button type="button" class="button secondary" data-report-zoom="readable">Lässtorlek</button><button type="button" class="button secondary" data-report-zoom="fit">Anpassa bredd</button></div><p class="tiny">Bläddra nedåt och i sidled för att läsa hela bilden.</p><div class="report-zoom-view" tabindex="0" aria-label="Resultatbild, kan rullas i sidled och nedåt"><img alt="Resultatrapport i förstorad visning."></div></dialog><p class="sr-only" id="report">${escapeHTML(reportText(a))}</p><p class="notice">Bilden skapas på din enhet. Inget skickas automatiskt. Namn och reflektion sparas inte när du laddar om sidan.</p></section>`;
}
function bindReport(a) {
  const panel = main.querySelector('.image-report-panel');
  const dialog = panel.querySelector('.report-zoom');
  const zoomView = panel.querySelector('.report-zoom-view');
  const zoomImage = zoomView.querySelector('img');
  let zoomWidth = 1000;
  let cached = null, currentURL = null, timer, revision = 0, disposed = false;
  setReportNeedsExport(true);
  disposeReport = () => { disposed = true; setReportNeedsExport(false); clearTimeout(timer); if (dialog.open) dialog.close(); if (currentURL) URL.revokeObjectURL(currentURL); };
  const fieldKey = () => JSON.stringify([reportName, reportReflection]);
  function exported(key, method) {
    if (disposed || key !== fieldKey()) return;
    setReportNeedsExport(false);
    panel.querySelector('#submission-state').textContent = method === 'copy' ? 'Bilden är kopierad. Nästa steg: klistra in och lämna in!' : 'Nedladdningen har startat. Nästa steg: bifoga bilden och lämna in!';
    panel.querySelector('#submission-state').classList.add('exported');
    panel.querySelector('#report-copy-status').textContent = method === 'copy' ? 'Öppna lärarens inlämning, klistra in bilden med Ctrl + V (Mac: ⌘ + V) och tryck på Lämna in eller Skicka.' : 'Öppna lärarens inlämning, bifoga PNG-filen från dina nedladdningar och tryck på Lämna in eller Skicka.';
  }
  function imageBlob() {
    const key = JSON.stringify([reportName, reportReflection]);
    if (!cached || cached.key !== key) {
      const promise = createReportImage(a, reportName, reportReflection);
      cached = { key, promise };
      promise.catch(() => { if (cached?.promise === promise) cached = null; });
    }
    return cached.promise;
  }
  async function updatePreview() {
    const turn = ++revision;
    try {
      const blob = await imageBlob();
      if (disposed || turn !== revision) return;
      const url = URL.createObjectURL(blob);
      if (currentURL) URL.revokeObjectURL(currentURL);
      currentURL = url;
      const img = panel.querySelector('#report-image'); img.src = url; img.hidden = false;
      panel.querySelector('#report-image-open').href = url;
      zoomImage.src = url;
      panel.querySelector('#report-image-status').textContent = '';
    } catch {
      if (!disposed && turn === revision) panel.querySelector('#report-image-status').textContent = 'Bilden kunde inte skapas. Försök igen genom att ändra ett fält eller ladda om sidan.';
    }
  }
  function updateFields() {
    reportName = panel.querySelector('#student-name').value;
    reportReflection = panel.querySelector('#reflection').value;
    panel.querySelector('#report').textContent = reportText(a);
    panel.querySelector('#report-copy-status').textContent = '';
    setReportNeedsExport(true);
    panel.querySelector('#submission-state').textContent = 'Bilden har ändrats – kopiera eller ladda ner den igen.';
    panel.querySelector('#submission-state').classList.remove('exported');
    revision++; clearTimeout(timer); timer = setTimeout(updatePreview, 150);
  }
  panel.querySelector('#student-name').addEventListener('input', updateFields);
  panel.querySelector('#reflection').addEventListener('input', updateFields);
  panel.querySelector('#copy').addEventListener('click', async () => {
    const status = panel.querySelector('#report-copy-status');
    const key = fieldKey();
    try {
      if (!navigator.clipboard?.write || !window.ClipboardItem) throw new Error('Image clipboard unavailable');
      // Start clipboard.write in the click event; Safari requires user activation.
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': imageBlob() })]);
      exported(key, 'copy');
      if (!disposed && key === fieldKey()) toast('Resultatbilden är kopierad. Kom ihåg att lämna in!');
    } catch {
      if (!disposed) { status.textContent = 'Webbläsaren tillåter inte bildkopiering här. Välj Ladda ner bild (PNG) och bifoga filen till din lärare.'; panel.querySelector('#download').focus(); }
    }
  });
  panel.querySelector('#download').addEventListener('click', async () => {
    const key = fieldKey();
    try {
      const blob = await imageBlob();
      if (disposed) return;
      const url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = `larolabbet-${a.level}-${a.date.slice(0, 10)}.png`;
      document.body.append(link); link.click(); link.remove();
      exported(key, 'download');
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch { if (!disposed) panel.querySelector('#report-copy-status').textContent = 'Bilden kunde inte skapas. Försök igen.'; }
  });
  panel.querySelector('#report-image-open').addEventListener('click', event => {
    if (!currentURL || typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    zoomWidth = 1000; zoomImage.style.width = `${zoomWidth}px`;
    dialog.showModal(); zoomView.scrollTo(0, 0);
  });
  panel.querySelector('#close-report-zoom').addEventListener('click', () => dialog.close());
  panel.querySelectorAll('[data-report-zoom]').forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.reportZoom;
    zoomWidth = action === 'fit' ? zoomView.clientWidth : action === 'readable' ? 1000 : Math.min(2000, Math.max(250, zoomWidth * (action === 'in' ? 1.25 : .8)));
    zoomImage.style.width = `${Math.round(zoomWidth)}px`;
  }));
  updatePreview();
}
