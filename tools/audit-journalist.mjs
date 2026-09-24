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
  const response = await page.goto(`${baseUrl}/${path}`, { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(80);
  if (!response?.ok()) failures.push(`${path}: HTTP ${response?.status() || 'no response'}`);
  const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
  if (overflow > 5) failures.push(`${path}: horizontal overflow ${overflow}px`);
}

await open('04.html?guest=1');
const homeText = await page.locator('body').innerText();
for (const label of ['注册小记者', '在线投稿', '作品档案', '优秀小记者', '投稿进度', '电子证书', '投稿指南与温馨提醒']) {
  if (!homeText.includes(label)) failures.push(`04.html: missing ${label}`);
}
await page.getByRole('button', { name: '载入测试数据并体验全部功能' }).click();
await page.waitForTimeout(650);
const demoState = await page.evaluate(() => ({
  auth: localStorage.getItem('ep-v3-authenticated'),
  reporter: localStorage.getItem('ep-v3-reporter-status'),
  profile: JSON.parse(localStorage.getItem('ep-journalist-onboarding') || 'null')
}));
if (demoState.auth !== '1' || demoState.reporter !== 'approved' || demoState.profile?.studentName !== '林奕辰') failures.push('04.html: demo journalist data did not load');
await open('stitch/J02.html');
if (await page.locator('#journalistAuthor').inputValue() !== '林奕辰') failures.push('J02: demo profile did not prefill submission form');

for (const route of ['J01', 'J05']) {
  await open(`stitch/${route}.html?guest=1`);
  if (await page.locator('#ep-access-gate').count()) failures.push(`${route}: published content should be public`);
}

await open('stitch/J02.html?guest=1');
if (await page.locator('#ep-access-gate').count() !== 1) failures.push('J02: guest should see login gate');

await open('stitch/J02.html?auth=1&reporter=pending');
if (!(await page.locator('#ep-access-gate').innerText()).includes('请先注册成为小记者')) failures.push('J02: pending user should see reporter gate');

await open('stitch/J07.html?auth=1');
await page.evaluate(() => localStorage.setItem('ep-v3-authenticated', '1'));
for (const field of ['journalistStudentName', 'journalistSchool', 'journalistGrade', 'journalistGuardian', 'journalistPhone']) {
  if (await page.locator(`#${field}`).count() !== 1) failures.push(`J07: missing field ${field}`);
}
if (!(await page.locator('#journalistProofLabel').innerText()).includes('选填')) failures.push('J07: school recommendation should be optional');
await page.locator('#journalistStudentName').fill('林小明');
await page.locator('#journalistSchool').fill('贵阳某小学');
await page.locator('#journalistGrade').selectOption({ label: '小学五年级' });
await page.locator('#journalistGuardian').fill('林家长');
await page.locator('#journalistPhone').fill('13800000000');
await page.locator('input[type="checkbox"]').check();
await page.getByRole('button', { name: '提交注册申请' }).click();
await page.waitForTimeout(50);
if (await page.evaluate(() => localStorage.getItem('ep-v3-reporter-status')) !== 'pending') failures.push('J07: submit did not set pending reporter status');

await open('stitch/J08.html?auth=1');
if (!(await page.locator('body').innerText()).includes('注册审核中')) failures.push('J08: pending status not shown');
await page.getByRole('button', { name: '演示审核通过' }).click();
if (!(await page.locator('body').innerText()).includes('注册已通过')) failures.push('J08: approved status not shown');

await open('stitch/J02.html');
if (await page.locator('#ep-access-gate').count()) failures.push('J02: approved reporter should access submission form');
if (await page.locator('#journalistSubmissionForm').count() !== 1) failures.push('J02: submission form missing');

await open('stitch/J03.html');
const progressText = await page.locator('body').innerText();
for (const status of ['待审核', '已录用', '已刊发', '未录用']) {
  if (!progressText.includes(status)) failures.push(`J03: missing status ${status}`);
}
if (/专家已批注|编辑部审改意见|倒计时|分辨率略低/.test(progressText)) failures.push('J03: detailed rejection feedback still present');

await open('stitch/J05.html?guest=1');
const showcaseText = await page.locator('body').innerText();
if (/十佳|A\+|100%好评|综合评级/.test(showcaseText)) failures.push('J05: ranking language still present');

await open('stitch/J06.html');
const certificateText = await page.locator('body').innerText();
if (/官方认证|权威发证|纸质邮寄申请/.test(certificateText)) failures.push('J06: overclaim language still present');

if (errors.length) failures.push(`page errors: ${errors.join(' | ')}`);
await browser.close();

if (failures.length) {
  console.error(`FAIL ${failures.length}`);
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}
console.log('PASS journalist pages and access flow');
