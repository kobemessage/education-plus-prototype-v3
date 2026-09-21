from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

NAV_ITEMS = [
    ("首页", "1", "home"),
    ("服务", "11", "apps"),
    ("活动", "12", "event"),
    ("我的", "10", "person"),
]


def icon(name, tone=""):
    return f'<span class="v3-icon {tone}"><span class="material-symbols-outlined">{name}</span></span>'


def row(title, desc, route, icon_name="", image="", state=""):
    lead = f'<img class="v3-thumb" src="{image}" alt="演示内容配图">' if image else icon(icon_name or "article")
    tail = f'<span class="v3-state">{state}</span>' if state else '<span class="material-symbols-outlined">chevron_right</span>'
    return f'<button class="v3-row" onclick="v3Go(\'{route}\')">{lead}<span class="grow"><strong>{title}</strong><p>{desc}</p></span>{tail}</button>'


def page(page_id, title, body, active="", subtitle="", home=False, back_route="1", back_label="返回首页"):
    prefix = "../" if page_id[0].isalpha() else ""
    if not active:
        active = "首页" if page_id == "1" else "活动" if page_id == "12" else "我的" if page_id == "10" or page_id.startswith("G") else "服务"
    nav = "".join(
        f'<button class="{"active" if name == active else ""}" onclick="v3Go(\'{route}\')" aria-label="{name}">'
        f'<span class="material-symbols-outlined">{symbol}</span><span>{name}</span></button>'
        for name, route, symbol in NAV_ITEMS
    )
    if home:
        header = (
            f'<header class="v3-top v3-brand-top"><img class="v3-header-leaves" src="{prefix}assets/v3/header-leaves.jpg" alt=""><div class="v3-top-copy">'
            '<h1>教育Plus</h1>'
            '<p>贵州教育资讯 · 权威教育服务入口</p></div>'
            '<span class="v3-badge">演示数据</span></header>'
        )
    else:
        header = (
            f'<header class="v3-top"><button class="v3-back" aria-label="{back_label}" onclick="v3Go(\'{back_route}\')">'
            '<span class="material-symbols-outlined">arrow_back_ios_new</span></button>'
            f'<div class="v3-top-copy"><h1>{title}</h1><p>{subtitle or "教育Plus V3.0"}</p></div>'
            '<span class="v3-badge">演示数据</span></header>'
        )
    return f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}｜教育Plus V3.0</title><link rel="stylesheet" href="{prefix}v3.css?v=20260921-v3c15"></head>
<body><script>window.EP_PAGE={page_id!r}</script>{header}<main class="v3-shell{' v3-home' if home else ''}">{body}</main>
<footer class="v3-footer">{nav}</footer><script src="{prefix}v3-ui.js?v=20260921-v3c15"></script><script src="{prefix}routes.js?v=20260921-v3c15"></script></body></html>'''


pages = {}

pages["01.html"] = page("1", "教育Plus", '''
<section class="v3-hero has-image"><img src="assets/v3/campus-reading-v2.jpg" alt="学生在校园图书馆共同阅读的演示图"><div>
<small>教育Plus · 清新校园青绿</small><h2>让阅读点亮<br>更广阔的未来</h2>
<p>连接校园内容、成长记录与公益教育服务。</p><button class="v3-cta" onclick="v3Go('11')">立即浏览</button></div></section>
<section class="v3-panel" aria-label="八大板块导航">
<div class="v3-entry-grid">
<button class="v3-entry" onclick="v3Go('2')">''' + icon("menu_book") + '''<strong>读书会</strong></button>
<button class="v3-entry" onclick="v3Go('3')">''' + icon("draw") + '''<strong>少年派</strong></button>
<button class="v3-entry" onclick="v3Go('4')">''' + icon("photo_camera") + '''<strong>小记者</strong></button>
<button class="v3-entry" onclick="v3Go('5')">''' + icon("school") + '''<strong>致青春</strong></button>
<button class="v3-entry" onclick="v3Go('6')">''' + icon("co_present") + '''<strong>公益课</strong></button>
<button class="v3-entry" onclick="v3Go('7')">''' + icon("science") + '''<strong>科学港</strong></button>
<button class="v3-entry" onclick="v3Go('8')">''' + icon("explore") + '''<strong>填志愿</strong></button>
<button class="v3-entry" onclick="v3Go('9')">''' + icon("newspaper") + '''<strong>订报刊</strong></button>
</div></section>
<section class="v3-section"><div class="v3-section-head"><h3>正在直播</h3><span>微信视频号待接入</span></div>
''' + row("数学专题公益课", "函数图像与解题思路 · 1.2万人观看（演示）", "6", image="assets/v3/public-class.jpg", state="直播中") + '''</section>
<section class="v3-section"><div class="v3-section-head"><h3>今日推荐</h3><button class="v3-more" onclick="v3Go('12')">查看全部</button></div>
''' + row("校园里的春天：一场关于成长的对话", "致青春 · 校园生活图文精选（演示）", "5", image="assets/v3/university-life-v2.jpg") + '''</section>
<div class="v3-note info">V3.0 为交互原型。人物、学校、活动和作品均为演示数据；外部平台、视频号及订阅服务尚未真实接入。</div>
''', home=True)

pages["02.html"] = page("2", "读书会", '''
<section class="v3-hero has-image"><img src="assets/v3/campus-reading-v2.jpg" alt="学生在校园图书馆共同阅读的演示图"><div>
<small>阅读 · 思考 · 分享 · 成长</small><h2>在书中遇见<br>更好的自己</h2><p>聚焦领读、共读与名家阅读三条内容主线。</p></div></section>
<section class="v3-section v3-module-nav"><div class="v3-section-head"><h3>阅读与成长</h3><span>3项服务</span></div><div class="v3-grid" aria-label="读书会二级导航">
<button class="v3-card" onclick="v3Go('R12')">''' + icon("groups_3") + '''<strong>大家一起读</strong><p>校园共读与主题书单</p></button>
<button class="v3-card" onclick="v3Go('R03')">''' + icon("record_voice_over", "amber") + '''<strong>名家谈阅读</strong><p>访谈、讲座与阅读方法</p></button>
<button class="v3-card" onclick="v3Go('R01')">''' + icon("co_present", "blue") + '''<strong>做领读员</strong><p>培训课程与领读实践</p></button></div></section>
<section class="v3-section"><div class="v3-section-head"><h3>领读精选</h3><button class="v3-more" onclick="v3Go('R01')">更多</button></div>
''' + row("主题书单：在山水与文字之间认识贵州", "分龄阅读建议 · 编辑精选（演示）", "R07", image="assets/v3/campus-reading-v2.jpg", state="主题书单") + '''</section>
<section class="v3-panel"><div class="v3-section-head"><h3>共读书目</h3><button class="v3-more" onclick="v3Go('R12')">更多</button></div>
<div class="v3-list">
<button class="v3-row" onclick="v3Go('R06')">''' + icon("auto_stories") + '''<span class="grow"><strong>《平凡的世界》</strong><p>阅读进度 62% · 内容展示</p><div class="v3-progress"><i style="width:62%"></i></div></span><span class="material-symbols-outlined">chevron_right</span></button>
<button class="v3-row" onclick="v3Go('R06')">''' + icon("landscape","blue") + '''<span class="grow"><strong>《昆虫记》</strong><p>阅读进度 35% · 自然观察</p><div class="v3-progress"><i style="width:35%"></i></div></span><span class="material-symbols-outlined">chevron_right</span></button>
</div></section>
<section class="v3-section"><div class="v3-section-head"><h3>名家阅读</h3><button class="v3-more" onclick="v3Go('R03')">更多</button></div>
''' + row("阅读，让人生更辽阔", "名家分享 · 讲座回放（演示）", "R04", icon_name="record_voice_over", state="可回放") + '''</section>
<div class="v3-note info">校园读书会由平台后台统一配置，前台不提供自主创建、积分、排行或打卡入口。</div>
''', subtitle="阅读 · 思考 · 分享 · 成长")

pages["03.html"] = page("3", "少年派", '''
<section class="v3-hero has-image"><img src="assets/v3/youth-creation-v2.jpg" alt="学生进行书画创作的演示图"><div>
<small>写作 · 艺术 · 展示 · 成长</small><h2>让每一次创作<br>都被认真看见</h2><p>展示学生作品、热门赛事、名师指导与成长档案。</p><button class="v3-cta" onclick="v3Go('S02')">提交作品</button></div></section>
<section class="v3-section v3-module-nav"><div class="v3-section-head"><h3>创作与成长</h3><span>4项服务</span></div><div class="v3-grid" aria-label="少年派二级导航">
<button class="v3-card" onclick="v3Go('S01')">''' + icon("gallery_thumbnail") + '''<strong>作品展示</strong><p>图文与艺术作品精选</p></button>
<button class="v3-card" onclick="v3Go('S03')">''' + icon("campaign","amber") + '''<strong>热门赛事</strong><p>查看征集主题与规则</p></button>
<button class="v3-card" onclick="v3Go('S05')">''' + icon("rate_review","blue") + '''<strong>名师指导</strong><p>查看编辑与教师建议</p></button>
<button class="v3-card" onclick="v3Go('S06')">''' + icon("folder_copy") + '''<strong>成长档案</strong><p>汇总个人作品与状态</p></button></div></section>
<section class="v3-section"><div class="v3-section-head"><h3>精选作品</h3><button class="v3-more" onclick="v3Go('S01')">查看详情</button></div>
''' + row("梧桐树下的旧书摊", "某实验小学 · 林*辰 · 散文 [演示数据]", "S01", image="assets/v3/youth-creation-v2.jpg", state="编辑精选") + '''</section>
<section class="v3-panel"><div class="v3-section-head"><h3>征集中</h3><span>[演示数据]</span></div><strong style="font-size:14px">“筑梦黔山”青少年作品征集</strong><p style="font-size:12px;line-height:1.65;color:var(--v3-muted)">征集作文、诗歌和书画作品，审核通过后进入专题展示。</p><button class="v3-btn" onclick="v3Go('S03')">参与征集</button></section>
<div class="v3-note info">作品、学校、人物、赛事与审核状态均为演示数据；平台不收取评审或认证费用。</div>
''', subtitle="作品展示 · 赛事 · 指导 · 档案")

pages["04.html"] = page("4", "小记者", '''
<section class="v3-hero has-image"><img src="assets/v3/campus-reporter-v2.jpg" alt="校园小记者采访教师的演示图"><div>
<small>入驻 · 采写 · 作品 · 荣誉</small><h2>记录校园现场<br>写下真实成长</h2><p>从资格申请到采写投稿，形成线上作品成长档案。</p></div></section>
<section class="v3-section v3-module-nav"><div class="v3-section-head"><h3>采写与成长</h3><span>4项服务</span></div><div class="v3-grid" aria-label="小记者二级导航">
<button class="v3-card" onclick="v3Go('J07')">''' + icon("person_add") + '''<strong>入驻资格</strong><p>提交资料与学校推荐</p></button>
<button class="v3-card" onclick="v3Go('J02')">''' + icon("edit_note") + '''<strong>采写投稿</strong><p>提交校园新闻与专访</p></button>
<button class="v3-card" onclick="v3Go('J04')">''' + icon("folder_copy","blue") + '''<strong>作品档案</strong><p>查看录用与刊发记录</p></button>
<button class="v3-card" onclick="v3Go('J05')">''' + icon("workspace_premium","amber") + '''<strong>风采荣誉</strong><p>优秀小记者与作品荣誉</p></button></div></section>
<section class="v3-section"><div class="v3-section-head"><h3>资格与荣誉状态</h3><span>在线查询</span></div><div class="v3-list">
''' + row("资格审核", "查看学校推荐材料核验进度", "J08", icon_name="fact_check", state="审核中") + '''
''' + row("荣誉证书", "查看见报与优秀作品入选证明", "J06", icon_name="workspace_premium") + '''</div></section>
<div class="v3-note info">小记者一期仅提供线上资格审核、校园采写、投稿与作品展示，不包含线下研学、活动报名、签到、核销或实践学时。</div>
''', subtitle="入驻资格 · 采写投稿 · 作品档案")

pages["05.html"] = page("5", "致青春", '''
<section class="v3-hero has-image"><img src="assets/v3/university-life-v2.jpg" alt="大学生在校园交流学习的演示图"><div>
<small>高校青年内容共创</small><h2>看见大学里的<br>青春与创造</h2><p>展示校园生活、社团风采和教育报主题活动。</p></div></section>
<section class="v3-section v3-module-nav"><div class="v3-section-head"><h3>青春内容</h3><span>4项服务</span></div><div class="v3-grid" aria-label="致青春二级导航">
<button class="v3-card" onclick="v3Go('Y01')">''' + icon("school") + '''<strong>我的大学</strong><p>校园生活与青春故事</p></button>
<button class="v3-card" onclick="v3Go('Y02')">''' + icon("groups", "blue") + '''<strong>多彩社团</strong><p>社团入驻与风采展示</p></button>
<button class="v3-card" onclick="v3Go('Y03')">''' + icon("campaign", "amber") + '''<strong>主题活动</strong><p>教育报组织的线上征集</p></button>
<button class="v3-card" onclick="v3Go('Y04')">''' + icon("edit_square") + '''<strong>创作入口</strong><p>发布图文或短视频</p></button></div></section>
<section class="v3-section"><div class="v3-section-head"><h3>我的大学</h3><button class="v3-more" onclick="v3Go('Y05')">我的发布</button></div>
''' + row("晚风穿过图书馆：我的大学普通一天", "某高校 · 林*同学 · 图文 [演示数据]", "Y01", image="assets/v3/university-life-v2.jpg") + '''</section>
<div class="v3-note info">社团入驻与个人创作使用不同入口；主题活动由教育报组织发布，所有内容和状态均为演示数据。</div>
''', subtitle="我的大学 · 多彩社团 · 主题活动")

pages["06.html"] = page("6", "公益课", '''
<section class="v3-hero has-image"><img src="assets/v3/public-class.jpg" alt="公益课教学演示图"><div>
<small>直播 · 回放 · 课程</small><h2>好课随时回看</h2><p>展示课程内容、教师、参与学校与课程详情。</p><button class="v3-cta" onclick="v3Go('C03')">观看回放</button></div></section>
<section class="v3-section v3-module-nav"><div class="v3-section-head"><h3>公益课服务</h3><span>3项服务</span></div><div class="v3-grid" aria-label="公益课二级导航">
<button class="v3-card" onclick="v3Go('C03')">''' + icon("play_circle") + '''<strong>课程回放</strong><p>按课程主题观看回放</p></button>
<button class="v3-card" onclick="v3Go('C01')">''' + icon("menu_book", "blue") + '''<strong>课程详情</strong><p>查看教师、学校与大纲</p></button>
<button class="v3-card" onclick="v3Go('C02')">''' + icon("live_tv", "amber") + '''<strong>直播说明</strong><p>视频号直播待接入</p></button></div></section>
<section class="v3-course-search" aria-label="公益课搜索">
  <div class="v3-search-box"><span class="material-symbols-outlined" aria-hidden="true">search</span><input id="courseSearch" type="search" aria-label="搜索老师、课程或基本信息" placeholder="搜索老师、课程或基本信息" autocomplete="off" oninput="v3SearchCourses(this)"><button id="courseSearchClear" class="v3-search-clear" type="button" onclick="v3ClearCourseSearch()" hidden>清除</button></div>
  <div class="v3-search-hint">可搜索教师、课程名称、学段、学科与课程关键词</div>
</section>
<section class="v3-section"><div class="v3-section-head"><h3>精选回放</h3><span id="courseSearchCount">共 3 门演示课程</span></div>
<div class="v3-list" id="courseSearchResults">
<button class="v3-row" data-course-search="周老师 数学专题公益课 初中数学 函数图像 解题思路 42分钟 回放" onclick="v3Go('C03')"><img class="v3-thumb" src="assets/v3/public-class.jpg" alt="演示内容配图"><span class="grow"><strong>数学专题公益课</strong><p>周老师（演示） · 初中数学 · 函数图像 · 42分钟</p></span><span class="v3-state">可回放</span></button>
<button class="v3-row" data-course-search="陈老师 把家乡写进作文里 小学语文 写作方法 生活观察 36分钟 回放" onclick="v3Go('C01')"><span class="v3-icon"><span class="material-symbols-outlined">play_circle</span></span><span class="grow"><strong>把家乡写进作文里</strong><p>陈老师（演示） · 小学语文 · 写作方法 · 36分钟</p></span><span class="material-symbols-outlined">chevron_right</span></button>
<button class="v3-row" data-course-search="王老师 陪孩子建立阅读习惯 家庭教育 亲子阅读 阅读习惯 28分钟 回放" onclick="v3Toast('课程详情为演示内容')"><span class="v3-icon amber"><span class="material-symbols-outlined">family_restroom</span></span><span class="grow"><strong>陪孩子建立阅读习惯</strong><p>王老师（演示） · 家庭教育 · 亲子阅读 · 28分钟</p></span><span class="material-symbols-outlined">chevron_right</span></button>
</div>
<div class="v3-search-empty" id="courseSearchEmpty" hidden><span class="material-symbols-outlined" aria-hidden="true">search_off</span><strong>没有找到相关课程</strong><p>请尝试搜索教师、课程名称、学段或其他关键词。</p><button type="button" onclick="v3ClearCourseSearch()">清除搜索</button></div>
</section>
<section class="v3-panel"><div class="v3-section-head"><h3>下一场直播</h3><span>时间待确认</span></div><p style="font-size:12px;color:var(--v3-muted);line-height:1.7;margin:0">正式直播将在贵州教育报确认的视频号中进行。当前仅展示跳转和直播占位状态。</p><div class="v3-actions"><button class="v3-btn" onclick="v3Go('C02')">查看直播说明</button></div></section>
<div class="v3-note">视频号和账号能力尚未接入；本模块不提供资料下载、学习时长统计或直播预约。</div>
''', active="服务", subtitle="直播 · 回放 · 课程")

pages["07.html"] = page("7", "科学港", '''
<section class="v3-hero has-image"><img src="assets/v3/science-exploration-v2.jpg" alt="学生在贵州喀斯特地貌开展科学探访的演示图"><div>
<small>探索 · 实践 · 创造 · 分享</small><h2>好奇心<br>让世界更精彩</h2><p>展示科学活动、作品与探访记录。</p></div></section>
<section class="v3-section v3-module-nav"><div class="v3-section-head"><h3>科学探索</h3><span>5项服务</span></div><div class="v3-grid" aria-label="科学港二级导航">
<button class="v3-card" onclick="v3Go('K03')">''' + icon("precision_manufacturing") + '''<strong>小小发明家</strong><p>从真实问题开始创造</p></button>
<button class="v3-card" onclick="v3Go('K02')">''' + icon("travel_explore", "amber") + '''<strong>一起来寻宝</strong><p>发现身边的科学宝藏</p></button>
<button class="v3-card" onclick="v3Go('K01')">''' + icon("experiment", "blue") + '''<strong>科普作品</strong><p>分享科学发现与创意</p></button>
<button class="v3-card" onclick="v3Go('K04')">''' + icon("fact_check") + '''<strong>探访记录</strong><p>记录线上探访成果</p></button>
<button class="v3-card" onclick="v3Go('K05')">''' + icon("forum", "amber") + '''<strong>编辑答疑</strong><p>编辑部精编科普内容</p></button></div></section>
<div class="v3-note info">科学港展示活动成果和编辑内容，不提供用户向科学家实时提问、专家答复或竞赛获奖承诺。</div>
''', subtitle="探索 · 实践 · 创造 · 分享")

pages["08.html"] = page("8", "填志愿", '''
<section class="v3-hero"><small>升学信息导引 · 外部服务待接入</small><h2>查公开信息<br>做理性选择</h2><p>汇总政策信息与第三方服务入口，不提供录取概率或录取结果承诺。</p></section>
<section class="v3-section v3-module-nav"><div class="v3-section-head"><h3>信息服务</h3><span>4项服务</span></div><div class="v3-grid" aria-label="填志愿二级导航">
<button class="v3-card" onclick="v3Go('V01')">''' + icon("policy") + '''<strong>招考政策</strong><p>查看公开政策和时间节点</p></button>
<button class="v3-card" onclick="v3Go('V01')">''' + icon("database","blue") + '''<strong>公开数据</strong><p>汇总官方可查信息目录</p></button>
<button class="v3-card" onclick="v3Toast('院校检索待接入')">''' + icon("search") + '''<strong>院校检索</strong><p>公开检索功能待接入</p></button>
<button class="v3-card" onclick="v3Go('V02')">''' + icon("open_in_new","amber") + '''<strong>第三方服务</strong><p>了解跳转范围与责任边界</p></button></div></section>
<div class="v3-note">外部平台尚未真实接入。所有信息仅供参考，请以教育主管部门和招生院校正式发布为准。</div><button class="v3-btn" style="width:100%" onclick="v3Toast('第三方平台待接入')">前往第三方平台（演示）</button>
''', active="服务", subtitle="公开信息 · 理性参考")

pages["09.html"] = page("9", "订报刊", '''
<section class="v3-hero has-image"><img src="assets/v3/newspaper-preview-v2.jpg" alt="教育报数字版面展读演示图"><div><small>贵州教育报 · 数字展读</small><h2>本期报纸<br>抢先看</h2><p>浏览头版与精选版面；正式订阅将前往官方订阅服务。</p></div></section>
<section class="v3-section v3-module-nav"><div class="v3-section-head"><h3>报刊服务</h3><span>4项服务</span></div><div class="v3-grid" aria-label="订报刊二级导航">
<button class="v3-card" onclick="document.querySelector('.v3-paper').scrollIntoView({behavior:'smooth',block:'start'})">''' + icon("newspaper") + '''<strong>本期报纸</strong><p>查看当期头版演示</p></button>
<button class="v3-card" onclick="v3Go('N01')">''' + icon("article", "blue") + '''<strong>精选版面</strong><p>浏览数字版面导读</p></button>
<button class="v3-card" onclick="v3Go('N02')">''' + icon("open_in_new", "amber") + '''<strong>订阅说明</strong><p>官方订阅服务待接入</p></button>
<button class="v3-card" onclick="v3Toast('订阅咨询方式待甲方确认')">''' + icon("support_agent") + '''<strong>订阅咨询</strong><p>热线与渠道待确认</p></button></div></section>
<div class="v3-paper"><div class="mast">贵州教育报</div><div class="headline">记录校园里的真实成长与教育实践</div><div class="cols"></div><small>演示版面 · 期号待确认</small></div>
<section class="v3-section"><div class="v3-section-head"><h3>精选版面</h3><span>图片 / PDF 预览</span></div><div class="v3-grid"><button class="v3-card" onclick="v3Go('N01')">''' + icon("article") + '''<strong>校园新闻</strong><p>版面导读 · 演示</p></button><button class="v3-card" onclick="v3Go('N01')">''' + icon("groups","blue") + '''<strong>师生成长</strong><p>作品精选 · 演示</p></button></div></section>
<div class="v3-note">订阅购买、支付、配送、发票与对公信息由外部官方订阅服务负责，本原型不处理交易。</div><div class="v3-actions"><button class="v3-btn" onclick="v3Go('N02')">订阅服务说明</button><button class="v3-btn secondary" onclick="v3Toast('咨询方式待确认')">订阅咨询</button></div>
''', active="服务", subtitle="数字报展读 · 外部订阅")

pages["10.html"] = page("10", "我的", '''
<section class="v3-hero"><small>个人中心 · 演示账号</small><h2>同学，你好</h2><p>个人资料和所有记录均为演示数据，不对应真实用户。</p></section>
<div class="v3-metric-row"><div class="v3-metric"><strong>6</strong><span>投稿记录</span></div><div class="v3-metric"><strong>3</strong><span>参与活动</span></div><div class="v3-metric"><strong>8</strong><span>内容收藏</span></div></div>
<section class="v3-section"><div class="v3-section-head"><h3>我的记录</h3><span>统一查看</span></div><div class="v3-list">
''' + row("小记者资格与电子证", "查看入驻申请与资格审核进度", "J08", icon_name="badge", state="审核中") + '''
''' + row("我的投稿", "少年派、小记者、致青春与科学港", "G05", icon_name="edit_document") + '''
''' + row("参与活动", "查看已经确认的活动记录", "G04", icon_name="event_available") + '''
''' + row("我的收藏", "收藏的文章、课程与作品", "G03", icon_name="favorite") + '''
''' + row("个人资料", "维护演示账号基础信息", "G06", icon_name="manage_accounts") + '''
</div></section><div class="v3-note info">小记者资格审核与普通微信账号注册相互独立。</div>
''', active="我的", subtitle="投稿 · 活动 · 资格")

services = [
    ("2", "读书会", "共读与名家阅读", "menu_book"),
    ("3", "少年派", "作品与赛事", "draw"),
    ("4", "小记者", "采写成长", "photo_camera"),
    ("5", "致青春", "高校内容", "school"),
    ("7", "科学港", "科学成果", "science"),
]
service_cards = "".join(
    f'<button class="v3-card" onclick="v3Go(\'{route}\')">{icon(symbol)}<strong>{name}</strong><p>{desc}</p></button>'
    for route, name, desc, symbol in services
)
pages["11.html"] = page("11", "服务", f'''
<section class="v3-hero"><small>教育Plus V3.0 · 服务大厅</small><h2>内容专区<br>与便民工具</h2><p>八个入口直达对应模块，功能边界清晰呈现。</p></section>
<section class="v3-section"><div class="v3-section-head"><h3>内容专区</h3><span>5项</span></div><div class="v3-grid">{service_cards}</div></section>
<section class="v3-section"><div class="v3-section-head"><h3>便民工具</h3><span>3项</span></div><div class="v3-grid three">
<button class="v3-card" onclick="v3Go('6')">{icon("co_present")}<strong>公益课</strong><p>直播回放</p></button>
<button class="v3-card" onclick="v3Go('8')">{icon("explore","blue")}<strong>填志愿</strong><p>外部导引</p></button>
<button class="v3-card" onclick="v3Go('9')">{icon("newspaper","amber")}<strong>订报刊</strong><p>数字展读</p></button></div></section>
<div class="v3-note info">所有人物、数据与内容均为演示；外部服务为待接入占位，不采集真实交易信息。</div>
''', active="服务", subtitle="内容专区 · 便民工具")

pages["12.html"] = page("12", "活动", '''
<section class="v3-hero"><small>教育报公益活动聚合</small><h2>发现正在发生的<br>校园内容与征集</h2><p>按板块和状态浏览线上征集、内容展播与直播信息。</p></section>
<div class="v3-tabs" id="activityCategoryTabs" aria-label="活动分类"><button class="v3-tab active" data-activity-category="全部">全部</button><button class="v3-tab" data-activity-category="读书会">读书会</button><button class="v3-tab" data-activity-category="少年派">少年派</button><button class="v3-tab" data-activity-category="致青春">致青春</button></div>
<div class="v3-status-filter" id="activityStatusTabs" aria-label="活动状态"><button class="active" data-activity-status="全部">全部状态</button><button data-activity-status="征集中">征集中</button><button data-activity-status="进行中">进行中</button><button data-activity-status="已结束">已结束</button></div>
<section class="v3-list" id="activityList" aria-live="polite">
<article class="v3-activity-card" data-category="读书会" data-status="进行中"><div class="v3-activity-head"><span class="v3-state">读书会</span><span class="v3-state outline">进行中</span></div><strong>全省校园共读计划 [演示数据]</strong><dl><div><dt>主办方</dt><dd>贵州教育报 [演示数据]</dd></div><div><dt>时间</dt><dd>时间待确认</dd></div><div><dt>参与对象</dt><dd>全省中小学校</dd></div></dl><button class="v3-btn secondary" onclick="v3Go('R12')">查看详情</button></article>
<article class="v3-activity-card" data-category="少年派" data-status="征集中"><div class="v3-activity-head"><span class="v3-state">少年派</span><span class="v3-state amber">征集中</span></div><strong>“筑梦黔山”青少年作品征集 [演示数据]</strong><dl><div><dt>主办方</dt><dd>贵州教育报 [演示数据]</dd></div><div><dt>时间</dt><dd>截止时间待确认</dd></div><div><dt>参与对象</dt><dd>中小学生</dd></div></dl><button class="v3-btn" onclick="v3Go('S03')">参与征集</button></article>
<article class="v3-activity-card" data-category="致青春" data-status="征集中"><div class="v3-activity-head"><span class="v3-state">致青春</span><span class="v3-state amber">征集中</span></div><strong>“我和我的大学”图文与短视频征集 [演示数据]</strong><dl><div><dt>主办方</dt><dd>贵州教育报 [演示数据]</dd></div><div><dt>时间</dt><dd>截止时间待确认</dd></div><div><dt>参与对象</dt><dd>高校学生</dd></div></dl><button class="v3-btn" onclick="v3Go('Y03')">参与征集</button></article>
<article class="v3-activity-card" data-category="读书会" data-status="已结束"><div class="v3-activity-head"><span class="v3-state">读书会</span><span class="v3-state outline">已结束</span></div><strong>名家阅读分享会 [演示数据]</strong><dl><div><dt>主办方</dt><dd>贵州教育报 [演示数据]</dd></div><div><dt>时间</dt><dd>日期待确认</dd></div><div><dt>参与对象</dt><dd>教师、学生与家长</dd></div></dl><button class="v3-btn secondary" onclick="v3Go('R04')">观看直播</button></article>
</section>
<div class="v3-search-empty" id="activityEmpty" hidden><span class="material-symbols-outlined">event_busy</span><strong>暂无符合条件的活动</strong><p>请选择其他板块或状态。</p></div>
<div class="v3-note info">活动页面仅聚合读书会、少年派和致青春的线上内容。小记者不含线下活动；科学港不提供活动报名。</div>
''', active="活动", subtitle="征集 · 展播 · 直播")

pages["stitch/J07.html"] = page("J07", "小记者入驻申请", '''
<section class="v3-hero"><small>小记者入驻流程</small><h2>申请成为<br>校园小记者</h2><p>完成学生资料、学校推荐与监护人确认后，由后台进行资格审核。</p></section>
<section class="v3-process" aria-label="小记者入驻流程">
<div class="v3-process-step active"><span class="material-symbols-outlined">person_edit</span><strong>填写资料</strong><small>学生基础信息</small></div>
<div class="v3-process-step"><span class="material-symbols-outlined">approval</span><strong>学校推荐</strong><small>盖章材料</small></div>
<div class="v3-process-step"><span class="material-symbols-outlined">family_restroom</span><strong>监护确认</strong><small>联系人信息</small></div>
<div class="v3-process-step pending"><span class="material-symbols-outlined">fact_check</span><strong>资格审核</strong><small>后台核验</small></div>
</section>
<form class="v3-card v3-form" onsubmit="return v3SubmitJournalist(event)">
<div class="v3-field"><label for="journalistStudentName">学生姓名</label><input id="journalistStudentName" required autocomplete="off" placeholder="请输入学生姓名"></div>
<div class="v3-field"><label for="journalistSchool">学校</label><input id="journalistSchool" required autocomplete="off" placeholder="请输入学校名称"></div>
<div class="v3-field"><label for="journalistGrade">所在年级</label><select id="journalistGrade" required><option value="">请选择</option><option>小学四年级</option><option>小学五年级</option><option>小学六年级</option><option>初中一年级</option></select></div>
<div class="v3-field"><label for="journalistGuardian">监护人姓名</label><input id="journalistGuardian" required autocomplete="off" placeholder="请输入监护人姓名"></div>
<div class="v3-field"><label for="journalistPhone">监护人联系方式</label><input id="journalistPhone" required inputmode="tel" pattern="1[3-9][0-9]{9}" autocomplete="off" placeholder="11位手机号"></div>
<input id="journalistProof" type="hidden" value="">
<button class="v3-upload" type="button" onclick="v3SelectJournalistProof()"><span class="material-symbols-outlined">upload_file</span><span id="journalistProofLabel"><strong>选择学校盖章推荐材料</strong><br><small>支持照片或 PDF（演示，不会实际上传）</small></span></button>
<label style="font-size:11px;line-height:1.6"><input type="checkbox" required aria-label="确认已阅读资格审核与隐私说明并由监护人知情提交"> 已阅读资格审核与隐私说明，并确认由监护人知情提交</label>
<button class="v3-btn" type="submit">提交入驻申请</button></form>
<div class="v3-note info">本页仅演示入驻流程，不会上传或留存填写的个人资料。提交后可进入“资格审核”查看演示进度。</div>
<div class="v3-note">小记者资格仅用于校园采写身份审核，不承诺升学加分、实践学时或商业权益。</div>
''', subtitle="资料提交 · 学校推荐 · 资格审核", back_route="4", back_label="返回小记者")

pages["stitch/J08.html"] = page("J08", "小记者资格审核", '''
<section class="v3-hero"><small>资格审核进度</small><h2 id="journalistReviewStatus">待提交申请</h2><p>查看学校推荐材料、身份资料与电子记者证的审核状态。</p></section>
<section id="journalistReviewEmpty" class="v3-card v3-review-empty"><span class="material-symbols-outlined">assignment_add</span><strong>尚未提交入驻申请</strong><p>请先填写学生资料、上传学校推荐材料并完成监护人确认。</p><button class="v3-btn" type="button" onclick="v3Go('J07')">前往申请入驻</button></section>
<section id="journalistReviewing" class="v3-card v3-review-card" hidden>
<div class="v3-review-summary"><span class="v3-icon"><span class="material-symbols-outlined">hourglass_top</span></span><span class="grow"><strong>资料审核中</strong><p>申请已进入后台核验流程，请留意审核状态变化。</p></span><span class="v3-state amber">审核中</span></div>
<div class="v3-review-list" aria-label="资格审核步骤">
<div class="v3-review-item done"><span class="material-symbols-outlined">check_circle</span><span><strong>入驻申请已提交</strong><small>学生与监护人资料已登记（演示）</small></span><span class="v3-state">已完成</span></div>
<div class="v3-review-item active"><span class="material-symbols-outlined">manage_search</span><span><strong>学校推荐材料核验</strong><small>正在核对盖章推荐材料（演示）</small></span><span class="v3-state amber">进行中</span></div>
<div class="v3-review-item"><span class="material-symbols-outlined">fact_check</span><span><strong>小记者资格审核</strong><small>材料核验完成后进入资格确认</small></span><span class="v3-state outline">待开始</span></div>
<div class="v3-review-item"><span class="material-symbols-outlined">badge</span><span><strong>生成电子记者证</strong><small>审核通过后展示电子证件</small></span><span class="v3-state outline">待开始</span></div>
</div>
<div class="v3-actions"><button class="v3-btn secondary" type="button" onclick="v3Toast('补充材料入口为原型演示')">补充材料</button><button class="v3-btn" type="button" onclick="v3Toast('审核进度已刷新（演示）')">刷新进度</button></div>
</section>
<div class="v3-note info">资格审核由后台人工完成；原型不采集真实身份信息，也不代表正式审核结果。</div>
''', subtitle="材料核验 · 审核进度 · 结果查询", back_route="4", back_label="返回小记者")

pages["stitch/R12.html"] = page("R12", "全省校园读书会", '''
<section class="v3-hero has-image"><img src="../assets/v3/campus-reading-v2.jpg" alt="学生在校园图书馆共同阅读的演示图"><div><small>大家一起读 · 共读书会</small><h2>一起读一本好书</h2><p>发现校园读书会、共读书目、活动动态与加入说明。</p></div></section>
<section class="v3-metric-row" aria-label="共读书会演示数据"><div class="v3-metric"><strong>286</strong><span>学校 [演示]</span></div><div class="v3-metric"><strong>12.8万</strong><span>学生 [演示]</span></div><div class="v3-metric"><strong>9,420</strong><span>作品 [演示]</span></div></section>
<section class="v3-section"><div class="v3-section-head"><h3>本期共读书目</h3><button class="v3-more" onclick="v3Go('R07')">全部书目</button></div>
''' + row("《人类群星闪耀时》", "分龄导读 · 进度与人数均为演示数据", "R08", image="../assets/v3/campus-reading-v2.jpg", state="共读中") + '''</section>
<section class="v3-section"><div class="v3-section-head"><h3>校园读书会</h3><span>后台统一配置</span></div><div class="v3-list">
''' + row("某中学“黔青悦读”读书会", "学校资料 · 共读书目 · 活动动态 [演示数据]", "R13", icon_name="school", state="共读中") + '''
''' + row("某小学“童声共读”读书会", "学校资料 · 分龄阅读 · 作品展示 [演示数据]", "R13", icon_name="local_library", state="展示中") + '''</div></section>
<section class="v3-panel"><div class="v3-section-head"><h3>加入说明</h3><span>一期规则</span></div><ol class="v3-steps"><li>学校向平台提交读书会基础资料。</li><li>平台核对学校与指导教师信息。</li><li>审核通过后由后台建立学校读书会主页。</li></ol><button class="v3-btn secondary" onclick="v3Toast('申请方式待甲方确认')">查看申请说明</button></section>
<div class="v3-note info">校园读书会由平台后台统一创建，前台不提供自主建会、积分、排行或商业权益。</div>
''', subtitle="学校资料 · 共读书目 · 活动动态", back_route="2", back_label="返回读书会")

pages["stitch/R13.html"] = page("R13", "学校读书会主页", '''
<section class="v3-hero has-image"><img src="../assets/v3/campus-reading-v2.jpg" alt="学校读书会共同阅读的演示图"><div><small>某中学 · [演示数据]</small><h2>“黔青悦读”读书会</h2><p>共读经典、分享思考，让阅读成为校园里的共同成长。</p></div></section>
<section class="v3-metric-row"><div class="v3-metric"><strong>286</strong><span>参与师生 [演示]</span></div><div class="v3-metric"><strong>12</strong><span>参与班级 [演示]</span></div><div class="v3-metric"><strong>36</strong><span>精选作品 [演示]</span></div></section>
<section class="v3-panel"><div class="v3-section-head"><h3>学校资料</h3><span>[演示数据]</span></div><p class="v3-body-copy">指导教师：周*老师 · 学校信息待确认<br>读书会简介：围绕经典阅读、主题分享与优秀作品展示开展校园共读。</p></section>
<section class="v3-section"><div class="v3-section-head"><h3>本期共读书目</h3><button class="v3-more" onclick="v3Go('R08')">书目详情</button></div>
''' + row("《人类群星闪耀时》", "本期主题：选择、勇气与责任 [演示数据]", "R08", image="../assets/v3/campus-reading-v2.jpg", state="共读中") + '''</section>
<section class="v3-section"><div class="v3-section-head"><h3>活动动态</h3><span>内容展示</span></div><div class="v3-list">
''' + row("班级共读分享会", "图文动态 · 日期待确认 [演示数据]", "R06", icon_name="forum") + '''
''' + row("优秀读后感展示", "学生作品 · 作者已脱敏 [演示数据]", "R05", icon_name="article") + '''</div></section>
<section class="v3-panel"><div class="v3-section-head"><h3>加入本校读书会</h3><span>说明</span></div><p class="v3-body-copy">学生加入方式由学校统一通知；平台前台不直接创建成员关系。如需建立学校主页，请由学校联系人提交资料并等待平台审核。</p><button class="v3-btn secondary" onclick="v3Toast('加入方式请以学校通知为准')">查看加入说明</button></section>
<div class="v3-note info">学校、人物、数量、动态和书目信息均为演示数据。</div>
''', subtitle="学校资料 · 共读书目 · 活动动态", back_route="R12", back_label="返回全省校园读书会")

pages["stitch/K01.html"] = page("K01", "科学成果详情", '''
<section class="v3-hero has-image"><img src="../assets/v3/science-exploration-v2.jpg" alt="学生开展科学探访的演示图"><div><small>小小发明家 · 精选成果</small><h2>校园节水装置</h2><p>学生作品 · 演示数据</p></div></section>
<div class="v3-card"><strong>作品说明</strong><p>从校园用水观察出发，完成问题记录、方案草图和模型验证。作品经编辑部审核后进行成果展播。</p></div>
<div class="v3-actions"><button class="v3-btn" onclick="v3Toast('已收藏作品')">收藏</button><button class="v3-btn secondary" onclick="v3Toast('分享海报已生成（演示）')">分享</button></div>
''')
pages["stitch/K02.html"] = page("K02", "一起来寻宝作品提交", '''
<section class="v3-hero has-image"><img src="../assets/v3/science-exploration-v2.jpg" alt="学生开展科学探访的演示图"><div><small>探访记录 · 作品征集</small><h2>记录家乡的<br>科学宝藏</h2><p>提交探访图文或短视频，审核通过后进入成果展播。</p></div></section>
<form class="v3-card v3-form" onsubmit="return v3Submit(this)"><div class="v3-field"><label for="scienceTreasureTitle">作品标题</label><input id="scienceTreasureTitle" required></div><div class="v3-field"><label for="scienceTreasurePlace">探访地点</label><input id="scienceTreasurePlace" required></div><div class="v3-field"><label for="scienceTreasureDescription">作品说明</label><textarea id="scienceTreasureDescription" required></textarea></div><button class="v3-upload" type="button" onclick="v3Toast('素材上传为原型演示')"><span class="material-symbols-outlined">add_photo_alternate</span>添加图片或视频（演示）</button><button class="v3-btn" type="submit">提交作品</button></form>
''')
pages["stitch/K03.html"] = page("K03", "小小发明家作品提交", '''
<section class="v3-hero"><small>科普作品 · 创意征集</small><h2>让小创意<br>解决真问题</h2><p>提交问题观察、创意方案和模型照片，编辑审核后择优展播。</p></section>
<form class="v3-card v3-form" onsubmit="return v3Submit(this)"><div class="v3-field"><label for="scienceInventionName">发明名称</label><input id="scienceInventionName" required></div><div class="v3-field"><label for="scienceProblem">想解决的问题</label><textarea id="scienceProblem" required></textarea></div><div class="v3-field"><label for="scienceIdea">创意方案</label><textarea id="scienceIdea" required></textarea></div><button class="v3-upload" type="button" onclick="v3Toast('素材上传为原型演示')"><span class="material-symbols-outlined">add_photo_alternate</span>添加模型照片（演示）</button><button class="v3-btn" type="submit">提交作品</button></form>
''')
pages["stitch/K04.html"] = page("K04", "我的科学港作品", '''
<section class="v3-hero"><small>作品记录</small><h2>我的科学创作</h2><p>查看科普作品和探访记录的审核状态。</p></section><div class="v3-list">
''' + row("校园节水装置", "小小发明家 · 提交日期（演示）", "K01", icon_name="precision_manufacturing", state="审核中") + '''
''' + row("桥梁结构探访", "一起来寻宝 · 提交日期（演示）", "K01", icon_name="landscape", state="已展播") + '''</div>
''')
pages["stitch/K05.html"] = page("K05", "编辑答疑", '''
<section class="v3-hero"><small>编辑部精编科普</small><h2>为什么溶洞里<br>会形成石笋？</h2><p>内容来源：公开科普资料整理 · 演示数据</p></section><div class="v3-card"><strong>编辑解读</strong><p>雨水渗入石灰岩层后溶解矿物质，水滴落到洞底时二氧化碳逸出，矿物质逐渐沉积。漫长岁月里，沉积物由下向上生长，形成石笋。</p></div><div class="v3-note info">本栏目由编辑部策划发布，不提供用户提问或专家实时答复。</div>
''')

pages["stitch/N01.html"] = page("N01", "数字报精选版面", '''
<section class="v3-hero has-image"><img src="../assets/v3/newspaper-preview-v2.jpg" alt="教育报数字版面展读演示图"><div><small>数字报展读</small><h2>本期精选版面</h2><p>图片 / PDF 预览为版式演示。</p></div></section><div class="v3-paper"><img class="v3-paper-preview" src="../assets/v3/newspaper-preview-v2.jpg" alt="教育报精选版面演示预览"><div class="mast">贵州教育报</div><div class="headline">校园里的创新实践，让学习连接真实生活</div></div><div class="v3-actions"><button class="v3-btn" onclick="v3Toast('正在打开高清预览（演示）')">高清预览</button><button class="v3-btn secondary" onclick="v3Go('9')">返回本期</button></div>
''', active="服务")
pages["stitch/N02.html"] = page("N02", "外部订阅服务说明", '''
<section class="v3-hero"><small>外部平台跳转占位</small><h2>前往官方<br>订阅服务</h2><p>正式上线后由贵州教育报确认目标小程序与跳转方式。</p></section><div class="v3-note">继续后将离开教育Plus。订阅购买、支付、配送、发票和售后由外部官方订阅服务提供并承担责任。</div><div class="v3-actions"><button class="v3-btn" onclick="v3Toast('外部订阅服务待接入')">继续前往（演示）</button><button class="v3-btn secondary" onclick="v3Go('9')">暂不前往</button></div>
''', active="服务")

pages["stitch/C01.html"] = page("C01", "公益课详情", '''
<section class="v3-hero has-image"><img src="../assets/v3/public-class.jpg" alt="公益课演示图"><div><small>课程回放 · 语文</small><h2>把家乡写进作文里</h2><p>陈老师（演示） · 合作学校待确认</p></div></section><div class="v3-card"><strong>课程大纲</strong><p>1. 从生活中寻找题材<br>2. 用动作与细节塑造人物<br>3. 让结尾回到具体画面</p></div><section class="v3-section"><div class="v3-section-head"><h3>回放章节</h3><span>时长演示</span></div><div class="v3-list">
<button class="v3-row" onclick="v3Toast('章节回放为演示内容')">''' + icon("play_circle") + '''<span class="grow"><strong>第一章：从身边发现好故事</strong><p>12:30 · 演示</p></span><span class="material-symbols-outlined">chevron_right</span></button>
<button class="v3-row" onclick="v3Toast('章节回放为演示内容')">''' + icon("play_circle") + '''<span class="grow"><strong>第二章：让细节会说话</strong><p>15:40 · 演示</p></span><span class="material-symbols-outlined">chevron_right</span></button></div></section>
''', active="服务")
pages["stitch/C02.html"] = page("C02", "公益课直播", '''
<section class="v3-hero has-image"><img src="../assets/v3/public-class.jpg" alt="公益课直播演示图"><div><small>外部直播 · 演示</small><h2>阅读如何帮助我们写作</h2><p>直播时间与教师信息待确认</p></div></section><div class="v3-note">直播将在贵州教育报确认的视频号播放。当前仅为跳转占位，不代表视频号或账号能力已接入。</div><button class="v3-btn" style="width:100%" onclick="v3Toast('微信视频号待接入')">即将跳转微信视频号（演示）</button>
''', active="服务")
pages["stitch/C03.html"] = page("C03", "公益课回放", '''
<section class="v3-hero has-image"><img src="../assets/v3/public-class.jpg" alt="公益课回放演示图"><div><small>视频回放 · 初中数学</small><h2>数学专题公益课</h2><p>周老师（演示） · 函数图像与解题思路</p></div></section><div class="v3-card" style="aspect-ratio:16/9;display:grid;place-items:center;background:#153f37;color:white"><button class="v3-btn" onclick="v3Toast('开始播放演示视频')"><span class="material-symbols-outlined" style="vertical-align:middle">play_arrow</span> 播放回放</button></div><section class="v3-section"><div class="v3-card"><strong>本章要点</strong><p>从坐标系识别函数图像，理解变量关系，并用图像信息梳理解题步骤。</p></div></section><div class="v3-note info">课程教师、视频内容与播放能力均为原型演示。</div>
''', active="服务")

for path, content in pages.items():
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")

print(f"generated {len(pages)} V3 pages")
