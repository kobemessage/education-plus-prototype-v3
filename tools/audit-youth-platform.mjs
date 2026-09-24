import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const baseUrl=(process.argv[2]||'http://127.0.0.1:4173').replace(/\/$/,'');
const failures=[];
const chromePath='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser=await chromium.launch({headless:true,...(fs.existsSync(chromePath)?{executablePath:chromePath}:{})});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,locale:'zh-CN'});
const page=await context.newPage();
page.on('pageerror',error=>failures.push(`页面脚本错误: ${error.message}`));

for(const route of ['05.html','stitch/Y01.html','stitch/Y02.html','stitch/Y03.html','stitch/Y04.html','stitch/Y05.html','stitch/Y06.html','stitch/Y07.html','stitch/Y08.html','stitch/Y09.html','stitch/Y10.html','stitch/Y11.html']){
  const response=await page.goto(`${baseUrl}/${route}?auth=1`,{waitUntil:'load',timeout:20000});
  if(!response?.ok())failures.push(`${route}: HTTP ${response?.status()||'no response'}`);
  const metrics=await page.evaluate(()=>({overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,unnamed:[...document.querySelectorAll('button,a,[role="button"]')].filter(element=>![element.getAttribute('aria-label'),element.getAttribute('title'),element.textContent].filter(Boolean).join(' ').trim()).length}));
  if(metrics.overflow>5)failures.push(`${route}: 水平溢出 ${metrics.overflow}px`);
  if(metrics.unnamed)failures.push(`${route}: ${metrics.unnamed} 个控件缺少可访问名称`);
}

await page.goto(`${baseUrl}/stitch/Y01.html?auth=1`,{waitUntil:'load'});
if(await page.locator('.university-card').count()!==3)failures.push('Y01: 校园创作测试数据不是3条');
await page.locator('#universitySchool').selectOption({label:'贵州师范大学'});
if(await page.locator('.university-card:not([hidden])').count()!==1)failures.push('Y01: 学校筛选结果异常');
await page.getByRole('button',{name:'本校'}).click();
if(await page.locator('.university-card:not([hidden])').count()!==1)failures.push('Y01: 本校内容范围异常');

await page.goto(`${baseUrl}/stitch/Y04.html?auth=1`,{waitUntil:'load'});
await page.getByRole('button',{name:'仅本校可见'}).click();
if(await page.locator('#youthVisibility').inputValue()!=='仅本校可见')failures.push('Y04: 可见范围未写入表单状态');

await page.goto(`${baseUrl}/stitch/Y02.html?auth=1`,{waitUntil:'load'});
if(await page.locator('.club-card').count()!==3)failures.push('Y02: 认证社团测试数据不是3个');
await page.locator('#clubSearch').fill('山野');
if(await page.locator('.club-card:not([hidden])').count()!==1)failures.push('Y02: 社团关键词搜索异常');
await page.locator('#clubSearch').fill('');
await page.locator('#clubCategoryFilter').selectOption({label:'志愿公益'});
if(await page.locator('.club-card:not([hidden])').count()!==1)failures.push('Y02: 社团类别筛选异常');
await page.locator('#clubCategoryFilter').selectOption('all');
await page.locator('[data-follow-club="creative"]').click();
if(await page.locator('[data-follow-club="creative"]').getAttribute('aria-pressed')!=='true')failures.push('Y02: 关注状态未切换');

await page.goto(`${baseUrl}/stitch/Y11.html?auth=1`,{waitUntil:'load'});
if(await page.locator('.following-card').count()!==1)failures.push('Y11: 关注动态未读取已关注社团');
if(!(await page.locator('#followingFeed').innerText()).includes('黔青创意社'))failures.push('Y11: 关注动态缺少社团名称');

await page.goto(`${baseUrl}/stitch/Y10.html?auth=1`,{waitUntil:'load'});
await page.getByRole('button',{name:'活动动态'}).click();
await page.locator('#clubPostTitle').fill('校园影像周开放报名');
await page.getByRole('button',{name:'提交平台审核'}).click();
await page.waitForURL(/index\.html#Y09$/,{timeout:3000}).catch(()=>{});

await page.goto(`${baseUrl}/stitch/Y09.html?auth=1`,{waitUntil:'load'});
if(await page.locator('#clubNewPostCard:not([hidden])').count()!==1)failures.push('Y09: 新提交社团内容未进入审核列表');
if(!(await page.locator('#clubNewPostTitle').innerText()).includes('校园影像周'))failures.push('Y09: 新提交标题未回读');

await context.clearCookies();
await page.evaluate(()=>localStorage.clear());
await page.goto(`${baseUrl}/stitch/Y02.html?guest=1`,{waitUntil:'load'});
await page.locator('[data-follow-club="creative"]').click();
if(await page.locator('#ep-login-dialog:not([hidden])').count()!==1)failures.push('Y02: 游客关注未触发登录提示');
await page.goto(`${baseUrl}/stitch/Y07.html?guest=1`,{waitUntil:'load'});
if(await page.locator('#ep-access-gate').count()!==1)failures.push('Y07: 社团认证申请未设置登录边界');

await browser.close();
if(failures.length){console.error(`FAIL ${failures.length}`);for(const failure of failures)console.error(`- ${failure}`);process.exit(1)}
console.log('PASS 致青春平台闭环：多彩大学筛选、可见范围、社团搜索、关注动态、管理员发布与登录边界');
