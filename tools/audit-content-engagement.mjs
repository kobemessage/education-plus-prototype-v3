import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const toolDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(toolDir, '..');
const baseUrl = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '');
const routes = [
  ...fs.readdirSync(root).filter(name => /^\d{2}\.html$/.test(name)),
  ...fs.readdirSync(path.join(root, 'stitch')).filter(name => /^[A-Z]\d{2}\.html$/.test(name)).map(name => `stitch/${name}`)
].sort();
const engagementPages = new Set([
  '12', 'R04', 'R06', 'R12', 'R13', 'S01', 'S03', 'S05',
  'J01', 'J05', 'Y01', 'Y03', 'C01', 'C03', 'K01', 'K05', 'N01', 'G07'
]);

const failures = [];
const sourceMissing = routes.filter(route => !fs.readFileSync(path.join(root, route), 'utf8').includes('access-control.js'));
if (sourceMissing.length) failures.push(`未接入共享内容层: ${sourceMissing.join(', ')}`);

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, ...(fs.existsSync(chromePath) ? { executablePath: chromePath } : {}) });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  locale: 'zh-CN'
});
const page = await context.newPage();

for (const route of routes) {
  const id = path.basename(route, '.html').replace(/^0+(?=\d)/, '');
  const errors = [];
  const onPageError = error => errors.push(error.message);
  page.on('pageerror', onPageError);
  const response = await page.goto(`${baseUrl}/${route}?auth=1`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(80);
  if (!response?.ok()) failures.push(`${route}: HTTP ${response?.status() || 'no response'}`);
  if (id !== '11') {
    await page.waitForFunction(() => {
      const images = [...document.querySelectorAll('.ep-discovery-media')];
      return images.length >= 2 && images.every(image => image.complete && image.naturalWidth >= 320);
    }, null, { timeout: 15000 }).catch(() => {});
  }
  const result = await page.evaluate(({ needsEngagement }) => {
    const buttons = [...document.querySelectorAll('button,a,[role="button"]')];
    const labels = buttons.map(control => [control.getAttribute('aria-label'), control.textContent].filter(Boolean).join(' '));
    return {
      discovery: document.querySelectorAll('.ep-discovery').length,
      discoveryCards: document.querySelectorAll('.ep-discovery-card').length,
      serviceItems: document.querySelectorAll('[data-service-item]').length,
      discoveryImages: [...document.querySelectorAll('.ep-discovery-media')].map(image => ({
        alt: image.alt,
        complete: image.complete,
        width: image.naturalWidth
      })),
      orderedImages: document.querySelectorAll('.ep-discovery-copy + .ep-discovery-media').length,
      like: !needsEngagement || labels.some(label => /点赞|赞同/.test(label)),
      favorite: !needsEngagement || labels.some(label => /收藏|关注/.test(label)),
      share: !needsEngagement || labels.some(label => /分享|转发|海报/.test(label)),
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
    };
  }, { needsEngagement: engagementPages.has(id) });
  if (id !== '11' && (result.discovery !== 1 || result.discoveryCards < 2)) {
    failures.push(`${route}: 继续探索内容未完整 ${JSON.stringify(result)}`);
  }
  if (id === '11' && result.serviceItems !== 7) failures.push(`${route}: 办事大厅结构异常 ${JSON.stringify(result)}`);
  if (id !== '11' && (result.discoveryImages.length !== result.discoveryCards || result.orderedImages !== result.discoveryCards || result.discoveryImages.some(image => !image.alt || !image.complete || image.width < 320))) {
    failures.push(`${route}: 栏目图片未完整 ${JSON.stringify(result.discoveryImages)}`);
  }
  if (!result.like || !result.favorite || !result.share) failures.push(`${route}: 互动不完整 ${JSON.stringify(result)}`);
  if (result.overflow > 5) failures.push(`${route}: 水平溢出 ${result.overflow}px`);
  if (errors.length) failures.push(`${route}: ${errors.join(' | ')}`);
  page.off('pageerror', onPageError);
}

await page.goto(`${baseUrl}/12.html?auth=1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(80);
const inlineCards = await page.locator('[data-category][data-status] .ep-inline-engagement').count();
if (inlineCards !== 4) failures.push(`12.html: 活动卡互动覆盖 ${inlineCards}/4`);
const activityLike = page.locator('[data-ep-scope="12:activity:0"][data-ep-action="like"]');
await activityLike.click();
if (await activityLike.getAttribute('aria-pressed') !== 'true') failures.push('12.html: 点赞后未切换为已点赞');
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(80);
if (await page.locator('[data-ep-scope="12:activity:0"][data-ep-action="like"]').getAttribute('aria-pressed') !== 'true') {
  failures.push('12.html: 点赞状态刷新后未保留');
}

await context.clearCookies();
await page.evaluate(() => localStorage.clear());
await page.goto(`${baseUrl}/11.html?guest=1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(80);
const serviceNames = await page.locator('[data-service-item]').allTextContents();
for (const duplicatedModule of ['读书会', '少年派', '小记者', '致青春', '公益课', '科学港', '填志愿', '订报刊']) {
  if (serviceNames.some(name => name.trim() === duplicatedModule)) failures.push(`11.html: 仍复制首页栏目“${duplicatedModule}”`);
}
await page.getByRole('button', { name: /我要投稿/ }).click();
if (await page.locator('#serviceSubmissionSheet:not([hidden])').count() !== 1) failures.push('11.html: 投稿类型选择未打开');
if (await page.locator('#serviceSubmissionSheet [data-ep-requires-login="true"]').count() !== 5) failures.push('11.html: 投稿类型不是 5 项');
await page.screenshot({ path: path.join(root, 'qa', 'service-hall-submission-sheet.png'), fullPage: false });
await page.locator('#serviceSubmissionSheet [data-ep-requires-login="true"]').first().click();
if (await page.locator('#ep-login-dialog:not([hidden])').count() !== 1) failures.push('11.html: 游客进入投稿未触发登录提示');
await page.locator('#ep-login-dialog [data-close="true"]').click();
await page.locator('[data-service-sheet-close]').last().click();
await page.getByRole('button', { name: /小记者入驻/ }).click();
if (await page.locator('#ep-login-dialog:not([hidden])').count() !== 1) failures.push('11.html: 游客办理入驻未触发登录提示');
await page.locator('#ep-login-dialog [data-close="true"]').click();
await page.locator('#serviceSearch').fill('政策');
if (await page.locator('[data-service-item]:not([hidden])').count() !== 1) failures.push('11.html: 服务搜索“政策”结果不准确');
await page.locator('#serviceSearch').fill('不存在的服务');
if (await page.locator('#serviceSearchEmpty:not([hidden])').count() !== 1) failures.push('11.html: 服务搜索空状态未显示');
await page.getByRole('button', { name: '查看全部服务' }).click();
await page.screenshot({ path: path.join(root, 'qa', 'service-hall-v3-redesign.png'), fullPage: true });

await page.goto(`${baseUrl}/stitch/S01.html?guest=1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(80);
const guestLike = page.getByRole('button', { name: /点赞/ }).first();
await guestLike.click();
if (await page.locator('#ep-login-dialog:not([hidden])').count() !== 1) failures.push('S01.html: 游客点赞未触发登录提示');
await page.locator('#ep-login-dialog [data-close="true"]').click();
await page.getByRole('button', { name: /分享/ }).first().click();
if (await page.locator('.ep-access-toast.show').count() !== 1) failures.push('S01.html: 游客分享未给出成功反馈');

await page.goto(`${baseUrl}/stitch/G03.html?guest=1`, { waitUntil: 'domcontentloaded' });
if (await page.locator('#ep-access-gate').count() !== 1) failures.push('G03.html: 私有页面未拦截游客');

for (const [route, file] of [
  ['01.html?auth=1', 'content-richness-home.png'],
  ['12.html?auth=1', 'content-richness-activities.png'],
  ['stitch/S01.html?auth=1', 'content-richness-work.png']
]) {
  await page.goto(`${baseUrl}/${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(root, 'qa', file), fullPage: true });
}

await browser.close();

if (failures.length) {
  console.error(`FAIL ${failures.length}`);
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log(`PASS ${routes.length}/${routes.length} 业务页面`);
console.log('PASS 作品/活动点赞、收藏、分享与登录边界');
console.log('PASS 办事大厅 7 项服务、5 类投稿、搜索与登录边界');
console.log('PASS 390px 移动端无水平溢出');
