import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import {
  INTRO_MODULE_ID,
  SECOND_MODULE_ID,
  getModule,
  markAllLessonsOnPage,
  fillQuizFromCurriculum,
  correctAnswersForModule,
} from './browser-helpers.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');
const publicDir = join(root, 'public');
const indexPath = join(publicDir, 'index.html');
const scratch = process.env.SCRATCH || join(root, '.verify-scratch');

mkdirSync(scratch, { recursive: true });

const fileUrl = pathToFileURL(indexPath).href;
const introMod = getModule(INTRO_MODULE_ID);
const expectedQuestions = introMod.knowledgeCheck.questions.length;
const log = [
  'browser-e2e: wildlife-acoustics-training',
  `file:// entry: ${fileUrl}`,
  `curriculum-driven: ${expectedQuestions} questions`,
  '',
];

async function verifyMissingWatCore(page) {
  await page.route('**/wat-core.js', (route) => route.abort());
  await page.goto(fileUrl, { waitUntil: 'load' });

  const bannerVisible = await page.locator('#file-protocol-banner:not(.view-hidden)').count();
  if (bannerVisible < 1) {
    throw new Error('missing-wat-core: file-protocol banner not visible');
  }
  const bannerText = await page.locator('#file-protocol-banner').innerText();
  if (!bannerText.match(/wat-core/i)) {
    throw new Error(`missing-wat-core: banner missing wat-core mention: ${bannerText.slice(0, 80)}`);
  }

  const headerText = await page.locator('header.site-header h1').textContent();
  if (!headerText.includes('Wildlife Acoustics')) {
    throw new Error('missing-wat-core: header was wiped');
  }

  const mainError = await page.locator('#app-main').innerText();
  if (!mainError.match(/failed to load/i)) {
    throw new Error('missing-wat-core: app-main error message missing');
  }

  log.push('missing-wat-core (Playwright file://): banner + header preserved, error in #app-main');
}

async function verifyHappyPath(page, label) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.waitForSelector('.track-card', { timeout: 15000 });

  const branding = await page.locator('header.site-header h1').textContent();
  if (!branding.includes('Wildlife Acoustics')) {
    throw new Error(`${label}: missing branding`);
  }

  const catalogLen = (await page.locator('#view-catalog').innerText()).length;
  if (catalogLen < 500) throw new Error(`${label}: catalog too short`);

  const headerBg = await page.evaluate(() => {
    const h = document.querySelector('header.site-header');
    return h ? getComputedStyle(h).backgroundImage : 'none';
  });
  if (!headerBg || headerBg === 'none') {
    throw new Error(`${label}: inlined styles not applied`);
  }

  await page.locator(`[data-module="${INTRO_MODULE_ID}"]`).click();
  await page.waitForSelector('#quiz-form');

  const lessonsMarked = await markAllLessonsOnPage(page);
  if (lessonsMarked !== introMod.lessons.length) {
    throw new Error(`${label}: marked ${lessonsMarked}/${introMod.lessons.length} lessons`);
  }
  log.push(`${label}: marked ${lessonsMarked} lessons`);

  const filled = await fillQuizFromCurriculum(page, INTRO_MODULE_ID);
  if (filled !== expectedQuestions) {
    throw new Error(`${label}: filled ${filled}/${expectedQuestions} answers`);
  }
  await page.locator('#quiz-form button[type="submit"]').click();
  await page.waitForSelector('#quiz-feedback.visible');

  const feedback = await page.locator('#quiz-feedback').innerText();
  if (!feedback.includes('Passed')) {
    throw new Error(`${label}: quiz did not pass: ${feedback.slice(0, 100)}`);
  }
  log.push(`${label}: quiz passed (${correctAnswersForModule(INTRO_MODULE_ID).length} q, curriculum-driven)`);

  await page.locator('[data-nav="progress"]').click();
  await page.waitForSelector('#progress-detail');
  const progressText = await page.locator('#progress-detail').innerText();
  if (!progressText.includes(introMod.title)) {
    throw new Error(`${label}: progress missing intro module`);
  }
  log.push(`${label}: progress dashboard updated`);

  await page.locator('nav.top-nav [data-nav="catalog"]').click();
  await page.locator(`[data-module="${SECOND_MODULE_ID}"]`).click();
  await page.waitForSelector('[data-complete-lesson]');
  const secondMarked = await markAllLessonsOnPage(page);
  const secondMod = getModule(SECOND_MODULE_ID);
  if (secondMarked < 1) throw new Error(`${label}: cross-module lesson mark failed`);
  log.push(`${label}: cross-module ${SECOND_MODULE_ID} — ${secondMarked}/${secondMod.lessons.length} lessons`);

  if (errors.length) throw new Error(`${label}: page errors: ${errors.join('; ')}`);
  log.push(`${label}: PASSED`);
}

let exitCode = 0;

try {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const errPage = await context.newPage();
  await verifyMissingWatCore(errPage);

  const page1 = await context.newPage();
  await page1.goto(fileUrl, { waitUntil: 'load' });
  await page1.waitForSelector('.track-card');
  await page1.screenshot({ path: join(scratch, 'home.png'), fullPage: true });
  await verifyHappyPath(page1, 'file-run-1');

  const page2 = await context.newPage();
  await verifyHappyPath(page2, 'file-run-2');
  await page2.locator('nav.top-nav [data-nav="catalog"]').click();
  await page2.locator(`[data-module="${INTRO_MODULE_ID}"]`).click();
  await page2.waitForSelector('#quiz-form');
  await fillQuizFromCurriculum(page2, INTRO_MODULE_ID);
  await page2.locator('#quiz-form button[type="submit"]').click();
  await page2.waitForSelector('#quiz-feedback.visible');
  await page2.screenshot({ path: join(scratch, 'quiz-feedback.png'), fullPage: true });

  await browser.close();
  log.push('', 'browser-e2e: PASSED (missing-wat-core + 2 file:// runs)');
} catch (err) {
  log.push(`FAILED: ${err.message}`);
  exitCode = 1;
}

console.log(log.join('\n'));
process.exit(exitCode);