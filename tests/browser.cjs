// Run with Playwright available through NODE_PATH. Edge is used on Windows.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
  const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
  const browser = await chromium.launch({ headless: true, ...(fs.existsSync(edge) ? { executablePath: edge } : {}) });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read','clipboard-write'] });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    const base = process.env.TEST_URL || 'http://localhost:4173';
    await page.goto(base); await page.getByRole('heading', { name: /Engelsk grammatik/ }).waitFor();
    assert(await page.locator('.logo-crop img').evaluate(el => el.complete && el.naturalWidth > 0));
    fs.mkdirSync('.sites-local', { recursive: true });
    await page.screenshot({ path: '.sites-local/home-desktop.png', fullPage: true });
    const answers = ['is','are','is','are','is','are','is','are','is','are'];
    await page.getByRole('link', { name: /Testa is/ }).click();
    // Exploratory learning must not affect scores or saved attempts.
    await page.getByRole('button', { name: /Men du då/ }).click();
    assert.match(await page.locator('#lesson-scene').innerText(), /You har ändå are/);
    await page.locator('[data-check="is"]').click();
    assert.match(await page.locator('#check-feedback').innerText(), /You betyder du/);
    await page.locator('[data-check="are"]').click();
    assert.match(await page.locator('#check-feedback').innerText(), /Ja! Du hittade/);
    assert.equal(await page.evaluate(() => session.answers.length), 0);
    assert.equal(await page.evaluate(() => attempts.length), 0);
    await page.screenshot({ path: '.sites-local/aha-desktop.png', fullPage: true });
    await page.getByRole('button', { name: /Nu testar jag själv/ }).click();
    assert.equal(await page.locator('#lesson-body').isVisible(), false);
    for (let i = 0; i < 10; i++) {
      if (i === 1) await page.getByRole('button', { name: 'Jag vill ha en ledtråd' }).click();
      await page.locator('.quiz-panel').getByRole('button', { name: i === 0 ? 'are' : answers[i], exact: true }).click();
      assert.equal(await page.locator('.answer:disabled').count(), 2);
      await page.getByRole('button', { name: i === 9 ? /Visa mitt resultat/ : /Nästa fråga/ }).click();
      if (i < 9) assert.equal(await page.locator('#lesson-body').isVisible(), false);
    }
    await page.getByRole('heading', { name: 'Det börjar sitta!' }).waitFor();
    assert.equal(await page.locator('.result-aha svg').count(), 1);
    assert.equal(await page.locator('.review-item .reasoning-route').count(), 2);
    assert.match(await page.locator('.result-score').innerText(), /9/);
    await page.getByLabel('Namn eller elevkod (valfritt)').fill('Elev 12');
    await page.getByLabel('Min reflektion (valfritt)').fill('Jag vill öva på she.');
    const report = await page.locator('#report').textContent();
    assert.match(report, /Elev: Elev 12/); assert.match(report, /Rätt på första svaret: 9\/10/);
    assert.match(report, /Frågor med ledtråd: 1\/10/); assert.match(report, /Varav rätt utan ledtråd: 8\/10/);
    assert.match(report, /Jag vill öva på she/); assert.match(report, /Elevens svar: are. Facit: is. Behöver övas/);
    await page.getByRole('button', { name: /Kopiera bild/ }).click();
    await page.locator('#report-copy-status').filter({ hasText: 'Bilden är kopierad' }).waitFor();
    const clipboardTypes = await page.evaluate(async () => (await navigator.clipboard.read()).flatMap(item => item.types));
    assert(clipboardTypes.includes('image/png'));
    assert(!clipboardTypes.includes('text/plain'));
    const imageInfo = await page.evaluate(async () => {
      const item = (await navigator.clipboard.read()).find(item => item.types.includes('image/png'));
      const blob = await item.getType('image/png');
      const bitmap = await createImageBitmap(blob);
      return { width: bitmap.width, height: bitmap.height, size: blob.size };
    });
    assert.equal(imageInfo.width, 2000); assert(imageInfo.height > 1000); assert(imageInfo.size > 10000);
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Ladda ner bild (PNG)' }).click();
    const download = await downloadEvent; assert.match(download.suggestedFilename(), /larolabbet-grund.*\.png$/);
    await download.saveAs('.sites-local/report-export.png');
    assert.equal(fs.readFileSync('.sites-local/report-export.png').subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    await page.locator('#report-image').evaluate(img => img.decode());
    assert.equal(await page.locator('textarea.report').count(), 0);
    await page.screenshot({ path: '.sites-local/result-desktop.png', fullPage: true });
    await page.reload(); await page.locator('#report').waitFor();
    assert.equal(await page.locator('#student-name').inputValue(), '');
    await page.getByRole('link', { name: 'Mina framsteg', exact: true }).click();
    await page.getByText('90 poäng', { exact: true }).waitFor();
    assert.equal(await page.locator('.history-row').count(), 1);
    // Complete both other levels with all answers correct, verifying their content keys.
    for (const level of ['vidare','utmaning']) {
      await page.goto(`${base}/#ova/${level}`);
      if (level === 'vidare') {
        assert.equal(await page.locator('#lesson-body').isVisible(), false);
        assert.equal(await page.locator('.pocket-rule').count(), 0);
        await page.locator('.lesson-toggle').click();
        const scenes = page.locator('[data-scene]');
        for (let i = 0; i < await scenes.count(); i++) {
          await scenes.nth(i).click();
          assert.equal(await scenes.nth(i).getAttribute('aria-pressed'), 'true');
          assert.equal(await page.locator('#lesson-scene svg[role="img"]').count(), 1);
        }
        await page.getByRole('button', { name: /Nu testar jag själv/ }).click();
      } else {
        assert.equal(await page.locator('.aha-lab, .pocket-rule, #hint, .translation, [data-check]').count(), 0);
        assert.equal(await page.locator('.independent-notice').count(), 1);
        await page.screenshot({ path: '.sites-local/independent-desktop.png', fullPage: true });
      }
      const keys = await page.evaluate(id => LEVELS.find(l => l.id === id).questions.map(q => q[1]), level);
      for (let i = 0; i < 10; i++) {
        await page.locator('.quiz-panel').getByRole('button', { name: level === 'utmaning' && i === 0 ? 'is' : keys[i], exact: true }).click();
        if (level === 'utmaning') {
          assert.equal(await page.locator('.feedback, .correct, .wrong, .reasoning-route, .translation, #hint').count(), 0);
          assert(!((await page.locator('.quiz-top').innerText()).includes('rätt')));
          assert.equal(await page.locator('.answer.recorded').count(), 1);
          if (i === 0) {
            assert.match(await page.locator('.question h2').innerText(), /^Is your friends ready/);
            assert.match(await page.locator('.answer-receipt').innerText(), /registrerat/);
          }
        }
        await page.getByRole('button', { name: i === 9 ? /Visa mitt resultat/ : /Nästa fråga/ }).click();
      }
      await page.locator('#report').waitFor();
      const levelReport = await page.locator('#report').textContent();
      assert.match(levelReport, level === 'utmaning' ? /9\/10 \(90 %\)/ : /10\/10 \(100 %\)/);
      assert.match(levelReport, level === 'utmaning' ? /Utan inbyggt stöd/ : /Bildförklaring öppnad/);
      if (level === 'utmaning') {
        assert.equal(await page.locator('.review-item').count(), 10);
        assert.equal(await page.locator('.review-item .reasoning-route').count(), 10);
        assert.match(levelReport, /Facit och förklaringar visades först efter sista frågan/);
        await page.reload(); await page.locator('#report').waitFor();
        assert.match(await page.locator('#report').textContent(), /Utan inbyggt stöd/);
      }
    }
    await page.goto(`${base}/#framsteg`); await page.getByText('280 poäng', { exact: true }).waitFor();
    assert.equal(await page.locator('.badge.earned').count(), 3);
    assert.equal(await page.locator('.history-row').count(), 3);
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of ['hem','ovningar','ova/utmaning','framsteg','larare']) {
      await page.goto(`${base}/#${route}`); await page.waitForTimeout(100);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Horizontal overflow on ${route}`);
      if (route === 'hem' || route === 'ova/utmaning') await page.screenshot({ path: `.sites-local/${route === 'hem' ? 'home' : 'quiz'}-mobile.png`, fullPage: true });
    }
    for (const width of [320, 768]) {
      await page.setViewportSize({ width, height: 900 });
      for (const level of ['grund','vidare','utmaning']) {
        await page.goto(`${base}/#ova/${level}`);
        if (level === 'utmaning') {
          assert.equal(await page.locator('.aha-lab, .pocket-rule, #hint, .translation').count(), 0);
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          continue;
        }
        if (level === 'vidare') await page.locator('.lesson-toggle').click();
        const scenes = page.locator('[data-scene]');
        for (let i = 0; i < await scenes.count(); i++) {
          await scenes.nth(i).click();
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Lesson overflow: ${level}, scene ${i}, width ${width}`);
        }
        const key = await page.evaluate(id => LESSONS[id].check.answer, level);
        await page.locator(`[data-check="${key}"]`).click();
        await page.locator('.check-message.right').waitFor();
        assert.equal(await page.evaluate(() => session.answers.length), 0);
      }
    }
    // Older level-3 attempts retain their original support status.
    const legacyId = await page.evaluate(() => {
      const old = { ...attempts.find(a => a.level === 'utmaning'), id: 'legacy-level-three' };
      delete old.supportMode; delete old.lessonViewed;
      attempts.push(old); save(); return old.id;
    });
    await page.goto(`${base}/#resultat/${legacyId}`);
    assert.match(await page.locator('#report').textContent(), /Tidigare version: regelstöd och rättning var tillgängliga/);
    assert(!((await page.locator('#report').textContent()).includes('Utan inbyggt stöd')));
    // A level-2 attempt that never opens the explanation is reported accurately.
    const optionalPage = await context.newPage();
    await optionalPage.goto(`${base}/#ova/vidare`);
    assert.equal(await optionalPage.locator('#lesson-body').isVisible(), false);
    const optionalKeys = await optionalPage.evaluate(() => LEVELS[1].questions.map(q => q[1]));
    for (let i = 0; i < 10; i++) {
      if (i === 0) await optionalPage.locator('#hint').click();
      await optionalPage.locator(`[data-answer="${optionalKeys[i]}"]`).click();
      assert.equal(await optionalPage.locator('#lesson-body').isVisible(), false);
      await optionalPage.locator('#next').click();
    }
    await optionalPage.locator('#report').waitFor();
    assert.match(await optionalPage.locator('#report').textContent(), /Bildförklaring inte öppnad/);
    assert.match(await optionalPage.locator('#report').textContent(), /Frågor med ledtråd: 1\/10/);
    await optionalPage.close();
    await page.goto(`${base}/#framsteg`);
    page.once('dialog', d => d.accept()); await page.getByRole('button', { name: 'Rensa alla mina sparade resultat' }).click();
    assert.equal(await page.locator('.history-row').count(), 0); await page.reload();
    await page.getByRole('heading', { name: 'Ditt första steg väntar.' }).waitFor();
    // The app remains usable if localStorage is blocked.
    const blocked = await browser.newContext();
    await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }));
    const blockedPage = await blocked.newPage(); await blockedPage.goto(base);
    await blockedPage.getByText(/Webbläsaren kan inte spara framstegen/).waitFor();
    await blocked.close();
    assert.deepEqual(errors, []);
    console.log('PASS: progressive support, hidden feedback in level 3, 30 questions, optional support tracking, legacy PNG image copy/download, reports, persistence and layouts at 320/390/768/1440px.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
