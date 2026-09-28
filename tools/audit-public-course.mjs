import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const baseUrl = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '');
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, ...(fs.existsSync(chromePath) ? { executablePath: chromePath } : {}) });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'zh-CN' });
const page = await context.newPage();
const failures = [];
const errors = [];
page.on('pageerror', error => errors.push(error.message));

async function open(path) {
  const response = await page.goto(`${baseUrl}/${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(80);
  if (!response?.ok()) failures.push(`${path}: HTTP ${response?.status() || 'no response'}`);
  const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
  if (overflow > 5) failures.push(`${path}: horizontal overflow ${overflow}px`);
}

await open('06.html');
const listText = await page.locator('body').innerText();
for (const text of ['课程列表', '学校简介', '教师简介', '课程回放']) {
  if (!listText.includes(text)) failures.push(`06.html: missing journey label ${text}`);
}
if (await page.locator('[data-course-search]').count() !== 3) failures.push('06.html: expected 3 course rows');
if (/合作学校|名师团队/.test(listText)) failures.push('06.html: global school or teacher section still present');
await page.evaluate(() => { window.v3Go = () => {}; v3SelectPublicCourse('family', 'C04'); });
if (await page.evaluate(() => localStorage.getItem('ep-public-course-selection')) !== 'family') failures.push('06.html: course selection was not saved');

await open('stitch/C04.html');
const schoolText = await page.locator('body').innerText();
if (!schoolText.includes('贵州省家庭教育指导中心') || !schoolText.includes('如何陪伴青春期孩子成长')) failures.push('C04: selected course school information not loaded');
if (await page.locator('.v3-course-step.active').innerText() !== '2\n学校简介') failures.push('C04: school step not active');

await open('stitch/C05.html');
const teacherText = await page.locator('body').innerText();
if (!teacherText.includes('周晓岚老师') || !teacherText.includes('家庭教育指导教师')) failures.push('C05: selected course teacher information not loaded');
if (await page.locator('.v3-course-step.active').innerText() !== '3\n教师简介') failures.push('C05: teacher step not active');

await open('stitch/C03.html');
const replayText = await page.locator('body').innerText();
if (!replayText.includes('青春期家庭沟通公益课') || !replayText.includes('周晓岚老师')) failures.push('C03: selected course replay information not loaded');
if (await page.locator('.v3-course-video button').count() !== 1) failures.push('C03: replay control missing');

await open('stitch/C04.html');
await page.evaluate(() => { localStorage.setItem('ep-public-course-selection', 'physics'); v3LoadPublicCourseJourney(); });
if (!(await page.locator('body').innerText()).includes('贵阳市实验中学')) failures.push('C04: second course did not resolve its own school');

if (errors.length) failures.push(`page errors: ${errors.join(' | ')}`);
await browser.close();

if (failures.length) {
  console.error(`FAIL ${failures.length}`);
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}
console.log('PASS public-course per-course journey');
