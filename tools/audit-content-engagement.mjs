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
  '12', 'R04', 'R06', 'R13', 'S01', 'S03', 'S05',
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
  const response = await page.goto(`${baseUrl}/${route}?auth=1`, { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(80);
  if (!response?.ok()) failures.push(`${route}: HTTP ${response?.status() || 'no response'}`);
  const result = await page.evaluate(({ needsEngagement }) => {
    const buttons = [...document.querySelectorAll('button,a,[role="button"]')];
    const labels = buttons.map(control => [control.getAttribute('aria-label'), control.textContent].filter(Boolean).join(' '));
    const bottomFloatingPanels = [...document.querySelectorAll('body *')].filter(element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const visible = style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
      if (!visible || !['fixed', 'sticky'].includes(style.position)) return false;
      if (element.matches('.toast,.v3-toast,.ep-access-toast,.article-toast') || element.closest('[role="dialog"]')) return false;
      return rect.bottom >= innerHeight - 140 && rect.height >= 44 && rect.width >= 120;
    }).map(element => `${element.tagName.toLowerCase()}.${String(element.className).replace(/\s+/g, '.')}`);
    return {
      discovery: document.querySelectorAll('.ep-discovery').length,
      bottomFloatingPanels,
      serviceItems: document.querySelectorAll('[data-service-item]').length,
      missingAlt: [...document.images].filter(image => !image.hasAttribute('alt')).length,
      unnamedControls: buttons.filter(control => {
        const name = [control.getAttribute('aria-label'), control.getAttribute('title'), control.textContent]
          .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
        return !name;
      }).length,
      like: !needsEngagement || labels.some(label => /点赞|赞同/.test(label)),
      favorite: !needsEngagement || labels.some(label => /收藏|关注/.test(label)),
      share: !needsEngagement || labels.some(label => /分享|转发|海报/.test(label)),
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
    };
  }, { needsEngagement: engagementPages.has(id) });
  if (result.discovery !== 0) failures.push(`${route}: 仍残留校园自选单/延伸浏览框`);
  if (result.bottomFloatingPanels.length) failures.push(`${route}: 仍残留可见底部悬浮框 ${result.bottomFloatingPanels.join(', ')}`);
  if (id === '11' && result.serviceItems !== 7) failures.push(`${route}: 办事大厅结构异常 ${JSON.stringify(result)}`);
  if (!result.like || !result.favorite || !result.share) failures.push(`${route}: 互动不完整 ${JSON.stringify(result)}`);
  if (result.missingAlt) failures.push(`${route}: ${result.missingAlt} 张图片缺少 alt 属性`);
  if (result.unnamedControls) failures.push(`${route}: ${result.unnamedControls} 个控件缺少可访问名称`);
  if (result.overflow > 5) failures.push(`${route}: 水平溢出 ${result.overflow}px`);
  if (errors.length) failures.push(`${route}: ${errors.join(' | ')}`);
  page.off('pageerror', onPageError);
}

await page.goto(`${baseUrl}/02.html?auth=1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(80);
const readingNav = await page.locator('.v3-module-nav .v3-card strong').allTextContents();
if (JSON.stringify(readingNav) !== JSON.stringify(['来做领读员', '大家一起读', '名家谈阅读'])) {
  failures.push(`02.html: 三个同级入口顺序异常 ${JSON.stringify(readingNav)}`);
}
if (!(await page.locator('.v3-hero').innerText()).includes('热门活动')) failures.push('02.html: 头图未展示读书会热门活动');
await page.locator('#reading-global-search').fill('林清华');
if (await page.locator('#reading-search-results [data-search]:not([hidden])').count() !== 1) failures.push('02.html: 全局搜索“林清华”结果异常');

await page.goto(`${baseUrl}/stitch/R12.html?auth=1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(80);
const communityText = await page.locator('#community-feed').innerText();
for (const contentType of ['新闻动态', '读后感', '推荐书单']) {
  if (!communityText.includes(contentType)) failures.push(`R12.html: 缺少${contentType}内容`);
}
if (!(await page.locator('body').innerText()).includes('后续开放学校自助提交入驻资料')) failures.push('R12.html: 缺少分阶段入驻与审核说明');
await page.locator('#community-search').fill('平凡的世界');
if (await page.locator('[data-community-item]:not([hidden])').count() !== 1) failures.push('R12.html: 共读内容搜索结果异常');

await page.goto(`${baseUrl}/stitch/R03.html?auth=1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(80);
await page.locator('#expert-search-input').fill('陈明礼');
if (await page.locator('.article-card:not([hidden])').count() !== 1) failures.push('R03.html: 名家图文搜索结果异常');
await page.getByRole('button', { name: '待接入' }).click();
if (!(await page.locator('#expert-tts-status').innerText()).includes('待接入')) failures.push('R03.html: TTS 预留反馈异常');

await page.goto(`${baseUrl}/stitch/R01.html?auth=1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(80);
const leaderBody = await page.locator('body').innerText();
if (/2025年春季学期|1,420|纯公益乡村及城镇领读教研计划/.test(leaderBody)) failures.push('R01.html: 仍残留已要求删除的研训数据块');
if (await page.locator('#leader-activity img').count() !== 1) failures.push('R01.html: 缺少领读活动首图');
if (await page.locator('#leader-activity button[data-ep-route="12"]').count() !== 1) failures.push('R01.html: 领读活动缺少活动详情入口');
if (await page.locator('.leader-path-grid > div').count() !== 3) failures.push('R01.html: 领读成长路径不是 3 步');
if (await page.locator('[data-course-section]').count() !== 3) failures.push('R01.html: 课程未按推荐、图文、视频分区');
if (await page.locator('[data-tool]').count() !== 4) failures.push('R01.html: 领读工具包不是 4 项');
if (await page.locator('[data-course-id]').count() !== 6) failures.push('R01.html: 课程测试数据不是 6 门');
if (await page.locator('[data-search*="图文"]').count() !== 3) failures.push('R01.html: 图文课程不是 3 门');
if (await page.locator('[data-search*="视频"]').count() !== 3) failures.push('R01.html: 视频课程不是 3 门');
await page.locator('#course-search-input').fill('图文');
if (await page.locator('[data-course-id]:not([hidden])').count() !== 3) failures.push('R01.html: 图文课程搜索结果异常');
await page.locator('[data-tool]').first().click();
if (!(await page.locator('#leader-tool-status').innerText()).includes('演示')) failures.push('R01.html: 领读工具缺少操作反馈');
await page.locator('[data-course-id="t1"]').click();
await page.waitForURL(/index\.html#R02$/);
if (!page.url().endsWith('index.html#R02')) failures.push('R01.html: 图文课程未进入完整阅读页');

await page.goto(`${baseUrl}/stitch/R02.html?auth=1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(80);
if (!(await page.locator('#article-title').innerText()).includes('整本书导读课')) failures.push('R02.html: 未保留选中的图文课程');
if (await page.locator('.article-goal').count() !== 3) failures.push('R02.html: 图文课程收获不是 3 项');
if (await page.locator('[data-article-step]').count() !== 3) failures.push('R02.html: 图文课程正文不是 3 个步骤');
if (await page.locator('.article-check').count() !== 4) failures.push('R02.html: 课前任务单不是 4 项');
await page.locator('.article-check').first().click();
if (!(await page.locator('#article-sheet-status').innerText()).includes('1/4')) failures.push('R02.html: 课前任务单缺少操作反馈');
await page.locator('[data-course-target]').first().click();
if (!(await page.locator('#article-title').innerText()).includes('共读讨论怎么问')) failures.push('R02.html: 图文课程间无法继续学习');

await page.goto(`${baseUrl}/stitch/R01.html?auth=1`, { waitUntil: 'domcontentloaded' });
await page.locator('[data-course-id="v1"]').click();
if (await page.locator('#course-sheet:not([hidden])').count() !== 1) failures.push('R01.html: 视频课程详情未打开');
if (await page.locator('#course-sheet-points li').count() !== 3) failures.push('R01.html: 视频课程详情缺少测试内容');
await page.locator('.course-sheet-close').click();

await page.goto(`${baseUrl}/stitch/R07.html?auth=1`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(80);
if (await page.locator('.cat-chip').count()) failures.push('R07.html: 仍残留复杂分类标签');
await page.locator('#book-search-input').fill('平凡的世界');
if (await page.locator('.book-card:not(.hidden)').count() !== 1) failures.push('R07.html: 书目搜索结果异常');

for (const route of ['02.html', 'stitch/R01.html', 'stitch/R03.html', 'stitch/R07.html', 'stitch/R12.html', 'stitch/R13.html']) {
  await page.goto(`${baseUrl}/${route}?auth=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(40);
  const bodyText = await page.locator('body').innerText();
  if (/积分|打卡|排行榜|校园排名/.test(bodyText)) failures.push(`${route}: 仍出现积分、打卡或排行表达`);
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

await page.goto(`${baseUrl}/stitch/R05.html?guest=1`, { waitUntil: 'domcontentloaded' });
await page.getByRole('button', { name: /提交读后感/ }).click();
if (await page.locator('#ep-login-dialog:not([hidden])').count() !== 1) failures.push('R05.html: 游客投稿未触发登录提示');

await page.goto(`${baseUrl}/stitch/R05.html?auth=1`, { waitUntil: 'domcontentloaded' });
await page.getByRole('button', { name: /提交读后感/ }).click();
if (await page.locator('#readingSubmissionSheet:not([hidden])').count() !== 1) failures.push('R05.html: 登录后未打开读后感投稿表单');
await page.locator('#readingBook').fill('《平凡的世界》');
await page.locator('#readingTitle').fill('平凡生活里的选择');
await page.locator('#readingBody').fill('这是一段用于验证投稿流程的演示正文，包含阅读体会、人物理解与个人成长感受。');
await page.getByRole('button', { name: '提交审核' }).click();
await page.locator('.v3-toast.show').waitFor({ state: 'visible', timeout: 3000 })
  .catch(() => failures.push('R05.html: 投稿完成后未给出成功反馈'));

await page.goto(`${baseUrl}/stitch/G02.html?auth=1`, { waitUntil: 'domcontentloaded' });
await page.locator('[data-path="S04"]').dispatchEvent('click');
await page.waitForURL(/index\.html#S04$/);
if (!page.url().endsWith('index.html#S04')) failures.push('G02.html: 消息详情按钮未进入对应投稿记录');

await page.route('**/stitch/J02.html*', async route => {
  await new Promise(resolve => setTimeout(resolve, 350));
  await route.continue();
});
await page.goto(`${baseUrl}/index.html?audit=loading#J02`, { waitUntil: 'domcontentloaded' });
if (await page.locator('#phone-loading:not([hidden])').count() !== 1) failures.push('index.html: 新页面加载时未显示状态');
await page.locator('#phone-loading').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => failures.push('index.html: 页面载入后加载状态未关闭'));
await page.unroute('**/stitch/J02.html*');

await page.evaluate(() => {
  localStorage.setItem('ep-v3-authenticated', '1');
  localStorage.setItem('ep-v3-engagement', '{}');
  localStorage.setItem('ep-reading-submission', '{}');
});
const resetNavigation = page.waitForNavigation({ waitUntil: 'domcontentloaded' });
await page.evaluate(() => resetDemo()).catch(() => {});
await resetNavigation;
const remainingDemoKeys = await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('ep-')));
if (remainingDemoKeys.length) failures.push(`index.html: 重置后仍保留状态 ${remainingDemoKeys.join(', ')}`);

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
console.log('PASS 所有页面无校园自选单、延伸浏览框或可见底部悬浮菜单');
console.log('PASS 作品/活动点赞、收藏、分享与登录边界');
console.log('PASS 办事大厅 7 项服务、5 类投稿、搜索与登录边界');
console.log('PASS 读书会三入口、热门活动、内容搜索、图文与入驻规则');
console.log('PASS 领读员页面无研训数据块，图文/视频课程与课程详情完整');
console.log('PASS 读后感投稿、消息详情、页面加载与演示重置');
console.log('PASS 图片 alt、交互控件可访问名称');
console.log('PASS 390px 移动端无水平溢出');
