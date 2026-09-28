from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VERSION = "20260928-journalist-course-flow-v1"


def detail_page(page_id: str, title: str, subtitle: str, body: str, back: str = "6") -> str:
    return f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}｜教育Plus V3.0</title><link rel="stylesheet" href="../v3.css?v={VERSION}"></head>
<body><script>window.EP_PAGE={page_id!r}</script><header class="v3-top"><button class="v3-back" aria-label="返回" onclick="v3Go('{back}')"><span class="material-symbols-outlined">arrow_back_ios_new</span></button><div class="v3-top-copy"><h1>{title}</h1><p>{subtitle}</p></div><span class="v3-badge">演示数据</span></header><main class="v3-shell">{body}</main>
<script src="../v3-ui.js?v={VERSION}"></script><script>if(window.v3LoadPublicCourseJourney)v3LoadPublicCourseJourney()</script><script src="../access-control.js?v={VERSION}"></script><script src="../routes.js?v={VERSION}"></script></body></html>'''


def course_steps(active: int) -> str:
    labels = (("课程列表", "6"), ("学校简介", "C04"), ("教师简介", "C05"), ("课程回放", "C03"))
    items = []
    for index, (label, route) in enumerate(labels, start=1):
        state = " active" if index == active else " done" if index < active else ""
        items.append(f'<button class="v3-course-step{state}" onclick="v3Go(\'{route}\')"><b>{index}</b><span>{label}</span></button>')
    return '<nav class="v3-course-journey" aria-label="公益课浏览路径">' + ''.join(items) + '</nav>'


j05 = detail_page("J05", "优秀小记者", "活动参与 · 活跃排名 · 代表作品", f'''
<section class="v3-hero has-image"><img src="../assets/v3/campus-reporter-v2.jpg" alt="优秀小记者校园采访演示图"><div><small>活跃榜 · [演示数据]</small><h2>每次参与<br>都有成长记录</h2><p>投稿与小记者活动参与情况共同进入活跃度排序。</p></div></section>
<section class="v3-rights-panel"><div class="v3-section-head"><h3>排名依据</h3><span>按活动周期更新</span></div><div class="v3-rights-grid three"><div class="v3-rights-item"><span class="material-symbols-outlined">edit_calendar</span><strong>活跃投稿</strong></div><div class="v3-rights-item blue"><span class="material-symbols-outlined">event_available</span><strong>活动参与</strong></div><div class="v3-rights-item amber"><span class="material-symbols-outlined">auto_stories</span><strong>作品质量</strong></div></div><p class="v3-rights-note">报名并实际参加小记者活动的次数会被记录并纳入活跃度排名；作品质量仍由编辑部人工审核。</p></section>
<section class="v3-featured-journalist" data-content-actions-anchor><div class="v3-section-head"><h3>本期活跃小记者</h3><span class="v3-rank-badge first">第 1 名</span></div><div class="v3-profile"><div class="v3-avatar"><span class="material-symbols-outlined">person</span></div><div><strong>林奕辰</strong><p>贵阳某小学 · 五年级<br>关注校园人物与新闻故事</p></div><span class="v3-state">编辑推荐</span></div><div class="v3-journalist-activity-metrics"><div><strong>6</strong><span>累计投稿</span></div><div><strong>5</strong><span>参与活动</span></div><div><strong>2</strong><span>已刊发</span></div></div><button class="v3-btn" style="width:100%" onclick="v3Go('J01')">查看代表作品</button></section>
<section class="v3-panel v3-journalist-list-panel"><div class="v3-section-head"><h3>活动参与记录</h3><span>共 5 次</span></div><div class="v3-activity-history"><div><span class="material-symbols-outlined">check_circle</span><p><strong>走进贵州教育报社</strong><small>2026-09-20 · 已参加</small></p></div><div><span class="material-symbols-outlined">check_circle</span><p><strong>校园新闻采访实践</strong><small>2026-08-16 · 已参加</small></p></div><div><span class="material-symbols-outlined">check_circle</span><p><strong>红色文化寻访</strong><small>2026-07-12 · 已参加</small></p></div></div></section>
<section class="v3-panel v3-journalist-list-panel"><div class="v3-section-head"><h3>活跃度排名</h3><span>[演示数据]</span></div><div class="v3-ranking-list"><button onclick="v3Go('J01')"><b>1</b><span class="grow"><strong>林奕辰</strong><small>投稿 6 篇 · 活动 5 次</small></span><span class="v3-state">第1名</span></button><button onclick="v3Go('J01')"><b>2</b><span class="grow"><strong>周雨桐</strong><small>投稿 5 篇 · 活动 4 次</small></span><span class="v3-state outline">第2名</span></button><button onclick="v3Go('J01')"><b>3</b><span class="grow"><strong>王子墨</strong><small>投稿 4 篇 · 活动 3 次</small></span><span class="v3-state outline">第3名</span></button></div></section>
<div class="v3-note info">活动次数以实际签到或主办方确认结果为准；排名为阶段性活跃度展示，不代表作品等级或综合评价。</div>
''', back="4")


j07 = detail_page("J07", "注册小记者", "学生资料 · 监护确认 · 注册审核", '''
<section class="v3-hero"><small>小记者注册</small><h2>记录校园<br>分享真实成长</h2><p>填写学生和监护人基础信息，提交后查看注册处理状态。</p></section>
<section class="v3-panel"><div class="v3-section-head"><h3>快速体验</h3><span>[演示数据]</span></div><p class="v3-body-copy">使用测试小记者“林奕辰”，跳过审核并开放投稿、档案和电子证书。</p><button class="v3-btn" style="width:100%;margin-top:12px" type="button" data-ep-browse-action="true" onclick="v3LoadJournalistDemo('J02')">使用测试小记者体验全部功能</button></section>
<section class="v3-registration-flow" aria-label="小记者注册流程"><div class="v3-flow-title"><strong>小记者注册流程</strong><span>3步完成</span></div><div class="v3-flow-track"><div class="v3-flow-step active"><b>1</b><span><strong>填写资料</strong><small>学生信息</small></span></div><span class="v3-flow-arrow material-symbols-outlined" aria-hidden="true">arrow_forward</span><div class="v3-flow-step"><b>2</b><span><strong>监护确认</strong><small>联系方式</small></span></div><span class="v3-flow-arrow material-symbols-outlined" aria-hidden="true">arrow_forward</span><div class="v3-flow-step pending"><b>3</b><span><strong>后台审核</strong><small>结果通知</small></span></div></div></section>
<section class="v3-validity-card" aria-label="小记者注册有效期"><span class="material-symbols-outlined">event_available</span><div><strong>注册有效期：1年</strong><p>自审核通过之日起计算，到期前提示续期或重新申请。</p></div><span>到期提醒</span></section>
<section class="v3-rights-panel" aria-label="小记者权益功能"><div class="v3-section-head"><h3>权益功能</h3><span>注册后可用</span></div><div class="v3-rights-grid"><div class="v3-rights-item"><span class="material-symbols-outlined">edit_note</span><strong>在线投稿</strong></div><div class="v3-rights-item blue"><span class="material-symbols-outlined">folder_copy</span><strong>作品档案</strong></div><div class="v3-rights-item amber"><span class="material-symbols-outlined">workspace_premium</span><strong>电子证书</strong></div><div class="v3-rights-item"><span class="material-symbols-outlined">confirmation_number</span><strong>活动优惠</strong></div></div><p class="v3-rights-note">活动优惠以教育报具体活动公告为准。</p></section>
<form class="v3-card v3-form v3-registration-form" onsubmit="return v3SubmitJournalist(event)"><div class="v3-registration-form-head"><div><small>注册资料</small><h3>填写基本信息</h3><p>带 * 项为必填，请使用真实信息</p></div><span>01 / 03</span></div><fieldset class="v3-registration-group"><legend><span class="material-symbols-outlined">school</span>学生信息</legend><div class="v3-registration-grid"><div class="v3-field"><label for="journalistStudentName">学生姓名 <em>*</em></label><input id="journalistStudentName" required autocomplete="off" placeholder="请输入姓名"></div><div class="v3-field"><label for="journalistGrade">所在年级 <em>*</em></label><select id="journalistGrade" required><option value="">请选择</option><option>小学四年级</option><option>小学五年级</option><option>小学六年级</option><option>初中一年级</option></select></div><div class="v3-field full"><label for="journalistSchool">学校 <em>*</em></label><input id="journalistSchool" required autocomplete="off" placeholder="请输入学校全称"></div></div></fieldset><fieldset class="v3-registration-group"><legend><span class="material-symbols-outlined">family_restroom</span>监护人信息</legend><div class="v3-registration-grid"><div class="v3-field"><label for="journalistGuardian">监护人姓名 <em>*</em></label><input id="journalistGuardian" required autocomplete="off" placeholder="请输入姓名"></div><div class="v3-field"><label for="journalistPhone">联系方式 <em>*</em></label><input id="journalistPhone" required inputmode="tel" pattern="1[3-9][0-9]{9}" autocomplete="off" placeholder="11位手机号"></div></div></fieldset><input id="journalistProof" type="hidden" value="optional"><button class="v3-registration-upload" type="button" onclick="v3SelectJournalistProof()"><span class="material-symbols-outlined">upload_file</span><span id="journalistProofLabel"><strong>学校推荐材料</strong><small>选填 · 支持照片或 PDF（演示）</small></span><span class="material-symbols-outlined">chevron_right</span></button><label class="v3-registration-consent"><input type="checkbox" required aria-label="确认已阅读隐私说明并由监护人知情提交"><span>已阅读隐私说明，并确认由监护人知情提交</span></label><button class="v3-btn v3-registration-submit" type="submit">提交注册申请</button></form>
<div class="v3-note info">本页为原型演示，不会上传或留存填写的真实个人资料。提交后可进入“注册状态”查看处理进度。</div><div class="v3-note">小记者注册不承诺升学加分、实践学时、纸质证件或固定活动优惠。</div>
''', back="4")


j08 = detail_page("J08", "小记者注册状态", "注册申请 · 有效期 · 结果查询", '''
<section class="v3-hero"><small>注册处理进度</small><h2 id="journalistReviewStatus">待提交申请</h2><p>审核通过后注册有效一年，可使用投稿和个人档案。</p></section>
<section id="journalistReviewEmpty" class="v3-card v3-review-empty"><span class="material-symbols-outlined">assignment_add</span><strong>尚未提交注册申请</strong><p>请先填写学生资料、学校和监护人联系方式。</p><button class="v3-btn" type="button" onclick="v3Go('J07')">前往注册小记者</button></section>
<section id="journalistReviewing" class="v3-card v3-review-card" hidden><div class="v3-review-summary"><span class="v3-icon"><span class="material-symbols-outlined">hourglass_top</span></span><span class="grow"><strong id="journalistReviewTitle">资料待审核</strong><p id="journalistReviewCopy">申请已提交，请留意处理状态变化。</p></span><span id="journalistReviewBadge" class="v3-state amber">待审核</span></div><div class="v3-review-list" aria-label="注册审核步骤"><div class="v3-review-item done"><span class="material-symbols-outlined">check_circle</span><span><strong>注册申请已提交</strong><small>学生与监护人资料已登记（演示）</small></span><span class="v3-state">已完成</span></div><div class="v3-review-item active"><span class="material-symbols-outlined">manage_search</span><span><strong>后台资料审核</strong><small>核对注册信息与监护人确认</small></span><span class="v3-state amber">处理中</span></div><div class="v3-review-item"><span class="material-symbols-outlined">fact_check</span><span><strong>注册结果</strong><small>通过后开放投稿与个人档案</small></span><span class="v3-state outline">待完成</span></div></div><section id="journalistValidityPanel" class="v3-validity-result" hidden><div><span class="material-symbols-outlined">verified</span><strong>注册有效期：1年</strong></div><dl><div><dt>生效日期</dt><dd id="journalistValidityStart">—</dd></div><div><dt>有效期至</dt><dd id="journalistValidityEnd">—</dd></div></dl><p>到期前需按届时规则续期或重新申请。</p></section><div class="v3-actions"><button class="v3-btn secondary" type="button" onclick="v3Go('J07')">修改注册资料</button><button id="journalistApproveDemo" class="v3-btn" type="button" onclick="v3ApproveJournalistDemo()">演示审核通过</button><button id="journalistSubmitButton" class="v3-btn" type="button" onclick="v3Go('J02')" hidden>去在线投稿</button></div></section>
<div class="v3-note info">注册审核由后台人工完成；原型不采集真实身份信息，也不代表正式审核结果。</div>
''', back="4")


course_list = f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>公益课｜教育Plus V3.0</title><link rel="stylesheet" href="v3.css?v={VERSION}"></head><body><script>window.EP_PAGE='6'</script><header class="v3-top"><button class="v3-back" aria-label="返回首页" onclick="v3Go('1')"><span class="material-symbols-outlined">arrow_back_ios_new</span></button><div class="v3-top-copy"><h1>公益课</h1><p>课程列表 · 学校简介 · 教师简介 · 课程回放</p></div><span class="v3-badge">演示数据</span></header><main class="v3-shell">
<section class="v3-hero has-image"><img src="assets/v3/public-class.jpg" alt="公益课教学演示图"><div><small>纯公益 · 名师主讲</small><h2>从课程出发<br>了解学校与教师</h2><p>每门课程均按学校、教师、回放的顺序查看。</p></div></section>
{course_steps(1)}
<section class="v3-course-search"><label class="v3-search-box"><span class="material-symbols-outlined">search</span><input id="courseSearch" type="search" placeholder="搜索课程、学段或主题" oninput="v3SearchCourses(this)"><button id="courseSearchClear" class="v3-search-clear" type="button" onclick="v3ClearCourseSearch()" hidden>清除</button></label><p id="courseSearchCount" class="v3-search-hint">共 3 门演示课程</p></section>
<section class="v3-panel v3-course-list-panel"><div class="v3-section-head"><h3>课程列表</h3><span>选择一门课程</span></div><div class="v3-list"><button class="v3-course-row" data-course-search="高中 数学 函数 导数 贵州师范大学附属中学 王明远" onclick="v3SelectPublicCourse('math','C04')"><img class="v3-thumb" src="assets/v3/public-class.jpg" alt="高中数学公益课演示图"><span class="grow"><strong>高考数学函数与导数核心方法</strong><p>高中数学 · 已有回放</p><small>先了解学校，再查看教师与回放</small></span><span class="material-symbols-outlined">chevron_right</span></button><button class="v3-course-row" data-course-search="初中 物理 实验 贵阳市实验中学 陈国华" onclick="v3SelectPublicCourse('physics','C04')"><span class="v3-icon blue"><span class="material-symbols-outlined">science</span></span><span class="grow"><strong>新课标初中物理实验方法</strong><p>初中物理 · 已有回放</p><small>课程所属学校与教师独立展示</small></span><span class="material-symbols-outlined">chevron_right</span></button><button class="v3-course-row" data-course-search="家庭教育 青春期 贵州省家庭教育指导中心 周晓岚" onclick="v3SelectPublicCourse('family','C04')"><span class="v3-icon amber"><span class="material-symbols-outlined">family_restroom</span></span><span class="grow"><strong>如何陪伴青春期孩子成长</strong><p>家庭教育 · 已有回放</p><small>按单门课程查看完整介绍</small></span><span class="material-symbols-outlined">chevron_right</span></button></div></section>
<div id="courseSearchEmpty" class="v3-search-empty" hidden><span class="material-symbols-outlined">search_off</span><strong>没有找到相关课程</strong><p>可更换课程、学段或主题关键词。</p><button type="button" onclick="v3ClearCourseSearch()">查看全部课程</button></div><div class="v3-note info">学校和教师介绍均归属具体课程，不在公益课首页单独展示。</div></main><script src="v3-ui.js?v={VERSION}"></script><script src="access-control.js?v={VERSION}"></script><script src="routes.js?v={VERSION}"></script></body></html>'''


c01 = detail_page("C01", "课程详情", "单门课程 · 浏览起点", f'''{course_steps(1)}<section class="v3-hero has-image"><img src="../assets/v3/public-class.jpg" alt="公益课程演示图"><div><small data-course-subject>高中数学</small><h2 data-course-name>高考数学函数与导数核心方法</h2><p>先了解课程所属学校，再查看教师和课程回放。</p></div></section><button class="v3-btn" style="width:100%" onclick="v3Go('C04')">查看学校简介</button>''')


c04 = detail_page("C04", "学校简介", "当前课程 · 第 2 步", f'''{course_steps(2)}<section class="v3-course-context"><small>当前课程</small><strong data-course-name>高考数学函数与导数核心方法</strong><span data-course-subject>高中数学</span></section><section class="v3-hero has-image"><img src="../assets/v3/campus-view.jpg" alt="课程所属学校演示图"><div><small>课程所属学校</small><h2 data-course-school>贵州师范大学附属中学</h2><p>本介绍仅对应当前所选课程。</p></div></section><section class="v3-panel"><div class="v3-section-head"><h3>学校简介</h3><span>[演示数据]</span></div><p class="v3-body-copy" data-course-school-copy>学校长期开展优质课程共建与教育资源共享，本课程由高中数学教研组参与设计。</p></section><div class="v3-actions"><button class="v3-btn secondary" onclick="v3Go('6')">返回课程列表</button><button class="v3-btn" onclick="v3Go('C05')">下一步：教师简介</button></div>''')


c05 = detail_page("C05", "教师简介", "当前课程 · 第 3 步", f'''{course_steps(3)}<section class="v3-course-context"><small>当前课程</small><strong data-course-name>高考数学函数与导数核心方法</strong><span data-course-school>贵州师范大学附属中学</span></section><section class="v3-teacher-profile"><div class="v3-avatar large"><span class="material-symbols-outlined">person</span></div><div><small>本课程主讲教师</small><h2 data-course-teacher>王明远老师</h2><strong data-course-teacher-title>高中数学高级教师</strong></div></section><section class="v3-panel"><div class="v3-section-head"><h3>教师简介</h3><span>[演示数据]</span></div><p class="v3-body-copy" data-course-teacher-copy>长期从事高中数学教学与高考专题研究，擅长用图像和问题链讲清函数与导数。</p></section><div class="v3-actions"><button class="v3-btn secondary" onclick="v3Go('C04')">返回学校简介</button><button class="v3-btn" onclick="v3Go('C03')">下一步：课程回放</button></div>''')


c02 = detail_page("C02", "公益课直播", "直播观看 · 单门课程", f'''{course_steps(4)}<section class="v3-hero has-image"><img src="../assets/v3/public-class.jpg" alt="公益课直播演示图"><div><small>直播中 · <span data-course-subject>高中数学</span></small><h2 data-course-name>高考数学函数与导数核心方法</h2><p><span data-course-teacher>王明远老师</span> · <span data-course-school>贵州师范大学附属中学</span></p></div></section><div class="v3-note">直播将在贵州教育报确认的视频号播放。当前仅为跳转占位，不代表视频号或账号能力已接入。</div><button class="v3-btn" style="width:100%" onclick="v3Toast('微信视频号待接入')">进入直播（演示）</button>''')


c03 = detail_page("C03", "课程回放", "当前课程 · 第 4 步", f'''{course_steps(4)}<section class="v3-course-context"><small>当前课程</small><strong data-course-name>高考数学函数与导数核心方法</strong><span><span data-course-teacher>王明远老师</span> · <span data-course-school>贵州师范大学附属中学</span></span></section><section class="v3-hero has-image"><img src="../assets/v3/public-class.jpg" alt="公益课回放演示图"><div><small>视频回放 · <span data-course-subject>高中数学</span></small><h2 data-course-replay>函数与导数专题课</h2><p>学校、教师与课程信息已关联到本条回放。</p></div></section><div class="v3-course-video"><button class="v3-btn" onclick="v3Toast('开始播放演示视频')"><span class="material-symbols-outlined">play_arrow</span>播放课程回放</button></div><div class="v3-actions"><button class="v3-btn secondary" onclick="v3Go('C05')">返回教师简介</button><button class="v3-btn" onclick="v3Go('6')">选择其他课程</button></div><div class="v3-note info">课程教师、学校信息、视频内容与播放能力均为原型演示。</div>''')


outputs = {
    ROOT / "stitch" / "J05.html": j05,
    ROOT / "stitch" / "J07.html": j07,
    ROOT / "stitch" / "J08.html": j08,
    ROOT / "06.html": course_list,
    ROOT / "stitch" / "C01.html": c01,
    ROOT / "stitch" / "C02.html": c02,
    ROOT / "stitch" / "C03.html": c03,
    ROOT / "stitch" / "C04.html": c04,
    ROOT / "stitch" / "C05.html": c05,
}

for target, content in outputs.items():
    target.write_text(content, encoding="utf-8")

print(f"generated {len(outputs)} confirmed journalist/course pages")
