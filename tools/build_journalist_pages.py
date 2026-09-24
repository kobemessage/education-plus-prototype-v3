from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VERSION = "20260924-journalist-v1"
POLISHED_VERSION = "20260924-journalist-pages-v2"


def page(page_id: str, title: str, subtitle: str, body: str, version: str = VERSION) -> str:
    return f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}｜教育Plus V3.0</title><link rel="stylesheet" href="../v3.css?v={version}"></head>
<body><script>window.EP_PAGE={page_id!r}</script>
<header class="v3-top"><button class="v3-back" aria-label="返回小记者" onclick="v3Go('4')"><span class="material-symbols-outlined">arrow_back_ios_new</span></button><div class="v3-top-copy"><h1>{title}</h1><p>{subtitle}</p></div><span class="v3-badge">演示数据</span></header>
<main class="v3-shell">{body}</main>
<script src="../v3-ui.js?v={version}"></script><script src="../access-control.js?v={version}"></script><script src="../routes.js?v={version}"></script></body></html>'''


pages = {
    "J01": page("J01", "小记者作品详情", "作品正文 · 作者信息 · 刊发记录", '''
<section class="v3-hero has-image"><img src="../assets/v3/campus-reporter-v2.jpg" alt="校园小记者采访场景演示图"><div><small>已刊发作品 · [演示数据]</small><h2>一张报纸的<br>铅字印记</h2><p>林奕辰 · 贵阳某小学 · 校园专访</p></div></section>
<section class="v3-panel"><div class="v3-inline between"><div><span class="v3-state">精选作品</span><h3 style="margin:9px 0 3px">探访贵州教育报社新闻编辑部</h3><p class="v3-body-copy">刊登于《贵州教育报》校园小记者专版 [演示数据]</p></div><span class="v3-state outline">1,150字</span></div></section>
<section class="v3-panel"><div class="v3-section-head"><h3>作者信息</h3><span>[演示数据]</span></div><div class="v3-profile"><div class="v3-avatar"><span class="material-symbols-outlined">badge</span></div><div><strong>林奕辰</strong><p>贵阳某小学 · 五年级<br>指导老师：林老师</p></div></div></section>
<article class="v3-panel v3-article" data-content-actions-anchor><div class="v3-section-head"><h3>作品正文</h3><span>校园专访</span></div><p>初夏清晨，我们走进贵州教育报社。历史陈列厅里的旧报纸和排版工具，让我们看到一张报纸从采访、编辑到刊发的过程。</p><p>在采编中心，我认真记下编辑老师的讲解。每一个事实都需要核对，每一个名字都不能写错，这让我第一次真正理解“记录真实”的分量。</p><blockquote>用清澈的眼睛观察校园，用诚实的文字记录成长。</blockquote><p>这次探访让我明白，小记者不仅要会写，更要尊重事实、保护采访对象，并为自己写下的每一句话负责。</p></article>
<section class="v3-panel"><div class="v3-section-head"><h3>编辑点评</h3><span>简要意见</span></div><p class="v3-body-copy">采访主题明确，现场细节真实，能够把参观过程和个人感受连接起来。</p></section>
<div class="v3-actions"><button class="v3-btn secondary" onclick="v3Go('J05')">优秀小记者</button><button class="v3-btn" onclick="v3Go('J02')">在线投稿</button></div>
<div class="v3-note info">人物、学校、作品和刊发信息均为演示数据。</div>
'''),
    "J02": page("J02", "小记者在线投稿", "图文上传 · 原创确认 · 提交审核", '''
<section class="v3-hero"><small>注册小记者专属</small><h2>记录校园现场<br>提交原创作品</h2><p>支持校园新闻、人物采访和观察记录等图文稿件。</p></section>
<section class="v3-registration-flow" aria-label="小记者投稿流程"><div class="v3-flow-title"><strong>在线投稿流程</strong><span>3步完成</span></div><div class="v3-flow-track">
<div class="v3-flow-step active"><b>1</b><span><strong>填写稿件</strong><small>正文与图片</small></span></div><span class="v3-flow-arrow material-symbols-outlined" aria-hidden="true">arrow_forward</span>
<div class="v3-flow-step"><b>2</b><span><strong>确认原创</strong><small>作者信息</small></span></div><span class="v3-flow-arrow material-symbols-outlined" aria-hidden="true">arrow_forward</span>
<div class="v3-flow-step pending"><b>3</b><span><strong>编辑审核</strong><small>进度可查</small></span></div>
</div></section>
<section class="v3-rights-panel"><div class="v3-section-head"><h3>投稿须知</h3><span>提交前确认</span></div><div class="v3-rights-grid three">
<div class="v3-rights-item"><span class="material-symbols-outlined">edit_note</span><strong>本人原创</strong></div><div class="v3-rights-item blue"><span class="material-symbols-outlined">shield_person</span><strong>保护隐私</strong></div><div class="v3-rights-item amber"><span class="material-symbols-outlined">fact_check</span><strong>编辑审核</strong></div>
</div><p class="v3-rights-note">不填写电话、住址、身份证号等敏感信息；未录用不提供逐稿详细说明。</p></section>
<form class="v3-card v3-form v3-registration-form" id="journalistSubmissionForm">
<div class="v3-registration-form-head"><div><small>投稿资料</small><h3>提交原创作品</h3><p>带 * 项为必填，图片最多 4 张</p></div><span>01 / 03</span></div>
<fieldset class="v3-registration-group"><legend><span class="material-symbols-outlined">article</span>作品内容</legend><div class="v3-registration-grid">
<div class="v3-field"><label for="journalistCategory">稿件类型 <em>*</em></label><select id="journalistCategory" required><option value="">请选择</option><option>校园新闻</option><option>人物采访</option><option>观察记录</option></select></div>
<div class="v3-field"><label for="journalistTitle">稿件标题 <em>*</em></label><input id="journalistTitle" required maxlength="40" placeholder="请输入标题"></div>
<div class="v3-field full"><label for="journalistBody">稿件正文 <em>*</em></label><textarea id="journalistBody" required maxlength="5000" placeholder="请输入原创稿件内容"></textarea></div>
</div></fieldset>
<button class="v3-registration-upload" type="button" id="journalistImageUpload"><span class="material-symbols-outlined">add_photo_alternate</span><span class="grow"><strong>添加作品图片</strong><small>最多 4 张 · JPG / PNG（演示）</small></span><span class="material-symbols-outlined">chevron_right</span></button>
<fieldset class="v3-registration-group v3-registration-author"><legend><span class="material-symbols-outlined">badge</span>作者信息</legend><div class="v3-registration-grid">
<div class="v3-field"><label for="journalistAuthor">学生姓名 <em>*</em></label><input id="journalistAuthor" required autocomplete="off" placeholder="请输入真实姓名"></div>
<div class="v3-field"><label for="journalistTeacher">指导老师</label><input id="journalistTeacher" autocomplete="off" placeholder="选填"></div>
<div class="v3-field full"><label for="journalistSchool">学校与班级 <em>*</em></label><input id="journalistSchool" required autocomplete="off" placeholder="例如：贵阳某小学 五年级3班"></div>
</div></fieldset>
<label class="v3-registration-consent"><input id="journalistOriginal" type="checkbox" required><span>确认稿件为本人原创、内容真实，并同意编辑部审核与公益刊发展示。</span></label>
<label class="v3-registration-consent"><input id="journalistGuardianConsent" type="checkbox" required><span>涉及未成年人信息和人物照片时，已取得监护人及相关人员同意。</span></label>
<button class="v3-btn v3-registration-submit" type="submit">提交稿件</button></form>
<div class="v3-note info">本页面为交互原型，不会上传或保存真实稿件、图片与个人信息。</div>
<script>
document.getElementById('journalistImageUpload').addEventListener('click',event=>{event.currentTarget.dataset.selected='true';event.currentTarget.innerHTML='<span class="material-symbols-outlined">check_circle</span><span class="grow"><strong>已选择 2 张演示图片</strong><small>可继续填写并提交</small></span><span class="material-symbols-outlined">chevron_right</span>';v3Toast('已选择演示图片')});
document.getElementById('journalistSubmissionForm').addEventListener('submit',event=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;localStorage.setItem('ep-journalist-submission',JSON.stringify({title:document.getElementById('journalistTitle').value,category:document.getElementById('journalistCategory').value,status:'待审核',time:Date.now()}));v3Toast('稿件已提交，当前状态：待审核');setTimeout(()=>v3Go('J03'),700)});
try{const profile=JSON.parse(localStorage.getItem('ep-journalist-onboarding')||'null');if(profile){document.getElementById('journalistAuthor').value=profile.studentName||'';document.getElementById('journalistSchool').value=[profile.school,profile.grade].filter(Boolean).join(' ')}}catch{}
</script>
''', version=POLISHED_VERSION),
    "J03": page("J03", "小记者投稿进度", "待审核 · 已录用 · 已刊发 · 未录用", '''
<section class="v3-hero"><small>个人投稿记录</small><h2>进度清晰<br>反馈保持简明</h2><p>查看稿件处理结果，不展示详细未录用原因。</p></section>
<div class="v3-tabs" aria-label="投稿状态筛选"><button class="v3-tab active" data-status-tab="all">全部</button><button class="v3-tab" data-status-tab="pending">待审核</button><button class="v3-tab" data-status-tab="accepted">已录用</button><button class="v3-tab" data-status-tab="published">已刊发</button><button class="v3-tab" data-status-tab="rejected">未录用</button></div>
<section class="v3-list" id="journalistProgressList">
<article class="v3-activity-card" data-submission-status="pending"><div class="v3-activity-head"><span class="v3-state amber">待审核</span><span class="v3-state outline" id="journalistPendingDate">2026-09-24</span></div><strong id="journalistPendingTitle">校园图书角的一天 [演示数据]</strong><p class="v3-body-copy" id="journalistPendingMeta">校园新闻 · 稿件已进入编辑审核队列。</p></article>
<article class="v3-activity-card" data-submission-status="accepted"><div class="v3-activity-head"><span class="v3-state">已录用</span><span class="v3-state outline">2026-09-18</span></div><strong>会说话的古树 [演示数据]</strong><p class="v3-body-copy">观察记录 · 已录用，等待具体刊发安排。</p></article>
<article class="v3-activity-card" data-submission-status="published"><div class="v3-activity-head"><span class="v3-state">已刊发</span><span class="v3-state outline">2026-09-10</span></div><strong>一张报纸的铅字印记 [演示数据]</strong><p class="v3-body-copy">校园专访 · 已刊登于校园小记者专版。</p><button class="v3-btn secondary" style="width:100%;margin-top:12px" onclick="v3Go('J01')">查看刊发作品</button></article>
<article class="v3-activity-card" data-submission-status="rejected"><div class="v3-activity-head"><span class="v3-state outline">未录用</span><span class="v3-state outline">2026-09-02</span></div><strong>课间十分钟 [演示数据]</strong><p class="v3-body-copy">本稿件暂未录用，可修改后再次投稿。</p><button class="v3-btn secondary" style="width:100%;margin-top:12px" onclick="v3Go('J02')">重新投稿</button></article>
</section>
<div class="v3-search-empty" id="journalistProgressEmpty" hidden>暂无该状态的投稿记录。</div>
<div class="v3-note info">审核状态和刊发信息均为演示数据；未录用稿件不展示逐稿详细原因。</div>
<script>
const progressTabs=[...document.querySelectorAll('[data-status-tab]')];const progressCards=[...document.querySelectorAll('[data-submission-status]')];const progressEmpty=document.getElementById('journalistProgressEmpty');progressTabs.forEach(tab=>tab.addEventListener('click',()=>{progressTabs.forEach(item=>item.classList.toggle('active',item===tab));let visible=0;progressCards.forEach(card=>{const show=tab.dataset.statusTab==='all'||card.dataset.submissionStatus===tab.dataset.statusTab;card.hidden=!show;if(show)visible++});progressEmpty.hidden=visible!==0}));
try{const submission=JSON.parse(localStorage.getItem('ep-journalist-submission')||'null');if(submission){document.getElementById('journalistPendingTitle').textContent=`${submission.title} [演示数据]`;document.getElementById('journalistPendingMeta').textContent=`${submission.category} · 稿件已进入编辑审核队列。`;document.getElementById('journalistPendingDate').textContent=new Date(submission.time||Date.now()).toISOString().slice(0,10)}}catch{}
</script>
'''),
    "J04": page("J04", "小记者作品档案", "个人作品 · 刊发记录 · 荣誉证明", '''
<section class="v3-hero"><small>登录后查看</small><h2>每一次记录<br>都进入成长档案</h2><p>集中查看个人投稿、录用、刊发作品与电子荣誉记录。</p></section>
<section class="v3-registration-flow" aria-label="作品处理流程"><div class="v3-flow-title"><strong>作品处理流程</strong><span>全程可查</span></div><div class="v3-flow-track"><div class="v3-flow-step active"><b>1</b><span><strong>提交作品</strong><small>进入档案</small></span></div><span class="v3-flow-arrow material-symbols-outlined">arrow_forward</span><div class="v3-flow-step"><b>2</b><span><strong>编辑审核</strong><small>状态更新</small></span></div><span class="v3-flow-arrow material-symbols-outlined">arrow_forward</span><div class="v3-flow-step pending"><b>3</b><span><strong>录用刊发</strong><small>电子记录</small></span></div></div></section>
<section class="v3-journalist-profile-card"><div class="v3-journalist-profile-head"><div class="v3-profile"><div class="v3-avatar"><span class="material-symbols-outlined">person</span></div><div><small>我的作品档案 · [演示数据]</small><strong id="journalistArchiveName">林奕辰</strong><p id="journalistArchiveSchool">贵阳某小学 · 小学五年级</p></div></div><button onclick="v3Go('J02')">继续投稿</button></div>
<div class="v3-archive-metrics"><div><strong>6</strong><span>累计投稿</span></div><div><strong>3</strong><span>已录用</span></div><div><strong>2</strong><span>已刊发</span></div><div><strong>2</strong><span>电子证明</span></div></div>
<div class="v3-journalist-actions"><button onclick="v3Go('J03')"><span class="material-symbols-outlined">schedule</span>查看投稿进度</button><button onclick="v3Go('J06')"><span class="material-symbols-outlined">workspace_premium</span>查看电子证书</button></div></section>
<section class="v3-panel v3-journalist-list-panel"><div class="v3-section-head"><h3>已刊发作品</h3><span>[演示数据]</span></div><div class="v3-list"><button class="v3-row" onclick="v3Go('J01')"><img class="v3-thumb" src="../assets/v3/campus-reporter-v2.jpg" alt="校园专访作品演示图"><span class="grow"><strong>一张报纸的铅字印记</strong><p>校园专访 · 校园小记者专版</p></span><span class="v3-state">已刊发</span></button><button class="v3-row" onclick="v3Go('J01')"><span class="v3-icon blue"><span class="material-symbols-outlined">article</span></span><span class="grow"><strong>会说话的古树</strong><p>观察记录 · 电子刊发记录</p></span><span class="v3-state">已刊发</span></button></div></section>
<section class="v3-panel v3-journalist-list-panel"><div class="v3-section-head"><h3>其他稿件</h3><button class="v3-more" onclick="v3Go('J03')">全部进度</button></div><div class="v3-list"><button class="v3-row" onclick="v3Go('J03')"><span class="v3-icon amber"><span class="material-symbols-outlined">hourglass_top</span></span><span class="grow"><strong>校园图书角的一天</strong><p>校园新闻 · 编辑审核中</p></span><span class="v3-state amber">待审核</span></button><button class="v3-row" onclick="v3Go('J03')"><span class="v3-icon"><span class="material-symbols-outlined">task_alt</span></span><span class="grow"><strong>校园里的节水行动</strong><p>校园新闻 · 等待刊发安排</p></span><span class="v3-state">已录用</span></button></div></section>
<div class="v3-note info">档案数据仅本人登录后查看。页面中的数量、作品和刊发记录均为演示数据。</div>
<script>try{const profile=JSON.parse(localStorage.getItem('ep-journalist-onboarding')||'null');if(profile){document.getElementById('journalistArchiveName').textContent=profile.studentName||'测试小记者';document.getElementById('journalistArchiveSchool').textContent=[profile.school,profile.grade].filter(Boolean).join(' · ')}}catch{}</script>
''', version=POLISHED_VERSION),
    "J05": page("J05", "优秀小记者", "人物展示 · 代表作品 · 榜样成长", '''
<section class="v3-hero has-image"><img src="../assets/v3/campus-reporter-v2.jpg" alt="优秀小记者校园采访演示图"><div><small>编辑推荐 · [演示数据]</small><h2>用好奇发现<br>用文字记录</h2><p>展示活跃小记者与代表作品，形成校园榜样。</p></div></section>
<section class="v3-registration-flow" aria-label="优秀小记者展示流程"><div class="v3-flow-title"><strong>展示流程</strong><span>人工筛选</span></div><div class="v3-flow-track"><div class="v3-flow-step active"><b>1</b><span><strong>持续投稿</strong><small>真实记录</small></span></div><span class="v3-flow-arrow material-symbols-outlined">arrow_forward</span><div class="v3-flow-step"><b>2</b><span><strong>编辑筛选</strong><small>作品质量</small></span></div><span class="v3-flow-arrow material-symbols-outlined">arrow_forward</span><div class="v3-flow-step pending"><b>3</b><span><strong>榜样展示</strong><small>代表作品</small></span></div></div></section>
<section class="v3-rights-panel"><div class="v3-section-head"><h3>展示标准</h3><span>编辑部人工筛选</span></div><div class="v3-rights-grid three"><div class="v3-rights-item"><span class="material-symbols-outlined">edit_calendar</span><strong>活跃投稿</strong></div><div class="v3-rights-item blue"><span class="material-symbols-outlined">verified</span><strong>内容真实</strong></div><div class="v3-rights-item amber"><span class="material-symbols-outlined">auto_stories</span><strong>作品质量</strong></div></div><p class="v3-rights-note">不设公开评分、等级或固定排名。</p></section>
<section class="v3-featured-journalist" data-content-actions-anchor><div class="v3-section-head"><h3>本期优秀小记者</h3><span>[演示数据]</span></div><div class="v3-profile"><div class="v3-avatar"><span class="material-symbols-outlined">person</span></div><div><strong>林奕辰</strong><p>贵阳某小学 · 五年级<br>关注校园人物与新闻故事</p></div><span class="v3-state">编辑推荐</span></div><blockquote>“从身边小事出发，用采访、观察和查证完成每一次校园采写。”</blockquote><button class="v3-btn" style="width:100%" onclick="v3Go('J01')">查看代表作品</button></section>
<section class="v3-panel v3-journalist-list-panel"><div class="v3-section-head"><h3>更多优秀小记者</h3><span>[演示数据]</span></div><div class="v3-list"><button class="v3-row" onclick="v3Go('J01')"><span class="v3-icon blue"><span class="material-symbols-outlined">person</span></span><span class="grow"><strong>周雨桐</strong><p>六盘水某中学 · 校园观察</p></span><span class="v3-state">活跃小记者</span></button><button class="v3-row" onclick="v3Go('J01')"><span class="v3-icon amber"><span class="material-symbols-outlined">person</span></span><span class="grow"><strong>王子墨</strong><p>黔东南某小学 · 乡土记录</p></span><span class="v3-state">编辑推荐</span></button></div></section>
<div class="v3-note info">优秀小记者由编辑部根据活跃情况和作品质量人工筛选，不设置公开评分、等级或固定排名。</div>
''', version=POLISHED_VERSION),
    "J06": page("J06", "小记者电子证书", "见报证明 · 荣誉证书 · 电子保存", '''
<section class="v3-hero"><small>登录后查看</small><h2>电子记录<br>留存成长荣誉</h2><p>查看本人见报证明和优秀作品电子证书，减少纸质邮寄。</p></section>
<section class="v3-panel"><div class="v3-inline between"><div><span class="v3-state">见报证明</span><h3 style="margin:9px 0 3px">《一张报纸的铅字印记》</h3><p class="v3-body-copy">林奕辰 · 校园小记者专版 [演示数据]</p></div><span class="v3-icon"><span class="material-symbols-outlined">newspaper</span></span></div><div class="v3-actions"><button class="v3-btn secondary" onclick="v3Toast('正在预览电子见报证明（演示）')">查看证明</button><button class="v3-btn" onclick="v3Toast('电子证明已保存（演示）')">保存图片</button></div></section>
<section class="v3-panel"><div class="v3-inline between"><div><span class="v3-state amber">电子荣誉证书</span><h3 style="margin:9px 0 3px">优秀作品入选证明</h3><p class="v3-body-copy">作品名称与入选日期 [演示数据]</p></div><span class="v3-icon amber"><span class="material-symbols-outlined">workspace_premium</span></span></div><div class="v3-actions"><button class="v3-btn secondary" onclick="v3Toast('正在预览电子证书（演示）')">查看证书</button><button class="v3-btn" onclick="v3Toast('电子证书已保存（演示）')">保存图片</button></div></section>
<div class="v3-note info">证书名称、发放条件与法律效力须由贵州教育报确认。当前页面仅展示电子化方案。</div>
<div class="v3-note">一期不提供纸质证书申请、制作或邮寄功能。</div>
'''),
}


for page_id, content in pages.items():
    (ROOT / "stitch" / f"{page_id}.html").write_text(content, encoding="utf-8")

print(f"generated {len(pages)} journalist pages")
