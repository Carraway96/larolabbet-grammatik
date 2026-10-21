const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
  const browser = await chromium.launch({ headless: true, ...(fs.existsSync(edge) ? { executablePath: edge } : {}) });
  try {
    const context = await browser.newContext({ permissions: ['clipboard-read','clipboard-write'], viewport: {width:390, height:844} });
    const page = await context.newPage();
    await page.goto(process.env.TEST_URL || 'http://localhost:4173');
    await page.evaluate(() => {
      attempts.push({id:'image-test',level:'utmaning',supportMode:'independent-v1',date:'2026-10-21T07:00:00Z',score:9,answers:LEVELS[2].questions.map((q,i)=>({choice:i===0?'is':q[1],correct:i!==0,hint:false}))});
      save(); location.hash = 'resultat/image-test';
    });
    await page.locator('#report-image').waitFor();
    await page.locator('#report-image').evaluate(img => img.decode());
    assert.equal(await page.locator('#report-image').evaluate(img => img.naturalWidth), 2000);
    await page.locator('#report-image-open').click();
    await page.getByRole('dialog').waitFor();
    const zoom = page.locator('.report-zoom-view img');
    assert.equal(await zoom.evaluate(img => img.getBoundingClientRect().width), 1000);
    await page.getByRole('button', { name: 'Zooma in', exact: true }).click();
    assert.equal(await zoom.evaluate(img => img.getBoundingClientRect().width), 1250);
    await page.getByRole('button', { name: 'Anpassa bredd', exact: true }).click();
    assert(await zoom.evaluate(img => img.getBoundingClientRect().width <= img.parentElement.clientWidth + 1));
    await page.getByRole('button', { name: 'Lässtorlek', exact: true }).click();
    assert.equal(await zoom.evaluate(img => img.getBoundingClientRect().width), 1000);
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').isVisible(), false);
    const initialHeight = await page.locator('#report-image').evaluate(img => img.naturalHeight);
    // No debounce wait: copying must use the latest fields, not the previous preview.
    await page.locator('#student-name').fill('Åsa Ängström – elev 12 '.repeat(4));
    await page.locator('#reflection').fill('ÅÄÖ lång reflektion med radbrytning.\n' + 'x'.repeat(1900));
    await page.locator('#copy').click();
    await page.locator('#report-copy-status').filter({hasText:'Bilden är kopierad'}).waitFor();
    const copied = await page.evaluate(async () => {
      const item = (await navigator.clipboard.read()).find(i => i.types.includes('image/png'));
      const actual = await item.getType('image/png');
      const expected = await createReportImage(attempts[0], reportName, reportReflection);
      async function pixels(blob) {
        const bitmap = await createImageBitmap(blob), canvas = document.createElement('canvas');
        canvas.width=bitmap.width; canvas.height=bitmap.height;
        const ctx=canvas.getContext('2d'); ctx.drawImage(bitmap,0,0);
        const digest=await crypto.subtle.digest('SHA-256',ctx.getImageData(0,0,canvas.width,canvas.height).data);
        return {width:canvas.width,height:canvas.height,hash:Array.from(new Uint8Array(digest)).join(',')};
      }
      return {actual:await pixels(actual), expected:await pixels(expected)};
    });
    assert.deepEqual(copied.actual,copied.expected);
    assert.equal(copied.actual.width,2000);
    assert(copied.actual.height > initialHeight + 300);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    const downloadEvent=page.waitForEvent('download'); await page.locator('#download').click();
    const download=await downloadEvent; await download.saveAs('.sites-local/report-long.png');
    assert.match(download.suggestedFilename(),/\.png$/);
    assert.equal(fs.readFileSync('.sites-local/report-long.png').subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    // Clipboard refusal gives a useful download path instead of silently copying text.
    await page.evaluate(()=>Object.defineProperty(navigator.clipboard,'write',{configurable:true,value:()=>Promise.reject(new DOMException('Denied','NotAllowedError'))}));
    await page.locator('#copy').click();
    await page.locator('#report-copy-status').filter({hasText:'Ladda ner bild (PNG)'}).waitFor();
    assert.equal(await page.locator('#download').evaluate(el=>el===document.activeElement),true);
    await page.screenshot({path:'.sites-local/report-mobile.png',fullPage:true});
    await page.locator('a[data-nav="framsteg"]').click();
    await page.locator('.history-row').click();
    await page.locator('#report-image').waitFor();
    await page.locator('#report-image').evaluate(img=>img.decode());
    assert.match(await page.locator('#report').textContent(),/Utan inbyggt stöd/);
    await page.setViewportSize({width:1440,height:1000});
    await page.screenshot({path:'.sites-local/sharp-report-desktop.png',fullPage:true});
    assert((await page.locator('#report-image').boundingBox()).width >= 900);
    console.log('PASS: 2000px PNG, readable full-width preview, zoom/fit/Escape, matching clipboard pixels, long reflection, clipboard fallback and mobile layout.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
