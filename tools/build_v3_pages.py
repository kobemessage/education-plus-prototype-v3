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


def page(page_id, title, body, active="首页", subtitle="", home=False):
    prefix = "../" if page_id[0].isalpha() else ""
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
            f'<header class="v3-top"><button class="v3-back" aria-label="返回首页" onclick="v3Go(\'1\')">'
            '<span class="material-symbols-outlined">arrow_back_ios_new</span></button>'
            f'<div class="v3-top-copy"><h1>{title}</h1><p>{subtitle or "教育Plus V3.0"}</p></div>'
            '<span class="v3-badge">演示数据</span></header>'
        )
    return f'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}｜教育Plus V3.0</title><link rel="stylesheet" href="{prefix}v3.css?v=20260921-v3c10"></head>
<body><script>window.EP_PAGE={page_id!r}</script>{header}<main class="v3-shell{' v3-home' if home else ''}">{body}</main>
<footer class="v3-footer">{nav}</footer><script src="{prefix}v3-ui.js?v=20260921-v3c10"></script><script src="{prefix}routes.js?v=20260921-v3c10"></script></body></html>'''


pages = {}

pages["01.html"] = page("1", "教育Plus", '''
<section class="v3-hero has-image"><img src="assets/v3/reading-campus.jpg" alt="校园学生共读演示图"><div>
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
''' + row("校园里的春天：一场关于成长的对话", "致青春 · 校园生活图文精选（演示）", "5", image="assets/v3/campus-view.jpg") + '''</section>
<div class="v3-note info">V3.0 为交互原型。人物、学校、活动和作品均为演示数据；外部平台、视频号及订阅服务尚未真实接入。</div>
''', home=True)

pages["02.html"] = page("2", "读书会", '''
<section class="v3-hero has-image"><img src="assets/v3/reading-campus.jpg" alt="校园共读演示图"><div>
<small>阅读 · 思考 · 分享 · 成长</small><h2>在书中遇见<br>更好的自己</h2><p>聚焦领读、共读与名家阅读三条内容主线。</p></div></section>
<div class="v3-tabs" aria-label="读书会栏目"><button class="v3-tab active">领读精选</button><button class="v3-tab">共读书目</button><button class="v3-tab">名家阅读</button></div>
<section class="v3-section"><div class="v3-section-head"><h3>领读精选</h3><button class="v3-more" onclick="v3Go('R01')">更多</button></div>
''' + row("主题书单：在山水与文字之间认识贵州", "分龄阅读建议 · 编辑精选（演示）", "R07", image="assets/v3/reading-campus.jpg", state="主题书单") + '''</section>
<section class="v3-panel"><div class="v3-section-head"><h3>共读书目</h3><button class="v3-more" onclick="v3Go('R12')">更多</button></div>
<div class="v3-list">
<button class="v3-row" onclick="v3Go('R06')">''' + icon("auto_stories") + '''<span class="grow"><strong>《平凡的世界》</strong><p>阅读进度 62% · 内容展示</p><div class="v3-progress"><i style="width:62%"></i></div></span><span class="material-symbols-outlined">chevron_right</span></button>
<button class="v3-row" onclick="v3Go('R06')">''' + icon("landscape","blue") + '''<span class="grow"><strong>《昆虫记》</strong><p>阅读进度 35% · 自然观察</p><div class="v3-progress"><i style="width:35%"></i></div></span><span class="material-symbols-outlined">chevron_right</span></button>
</div></section>
<section class="v3-section"><div class="v3-section-head"><h3>名家阅读</h3><button class="v3-more" onclick="v3Go('R03')">更多</button></div>
''' + row("阅读，让人生更辽阔", "名家分享 · 讲座回放（演示）", "R04", icon_name="record_voice_over", state="可回放") + '''</section>
<div class="v3-note info">校园读书会由平台后台统一配置，前台不提供自主创建、积分、排行或打卡入口。</div>
''', subtitle="阅读 · 思考 · 分享 · 成长")

pages["06.html"] = page("6", "公益课", '''
<section class="v3-hero has-image"><img src="assets/v3/public-class.jpg" alt="公益课教学演示图"><div>
<small>直播 · 回放 · 课程</small><h2>好课随时回看</h2><p>展示课程内容、教师、参与学校与课程详情。</p><button class="v3-cta" onclick="v3Go('C03')">观看回放</button></div></section>
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
<section class="v3-hero has-image"><img src="assets/v3/science-lab.jpg" alt="学生制作机器人演示图"><div>
<small>探索 · 实践 · 创造 · 分享</small><h2>好奇心<br>让世界更精彩</h2><p>展示科学活动、作品与探访记录。</p></div></section>
<section class="v3-list">
''' + row("小小发明家", "奇思妙想，从校园真实问题开始", "K03", image="assets/v3/science-lab.jpg") + '''
''' + row("一起来寻宝", "发现身边的科学，提交探访作品", "K02", image="assets/v3/campus-view.jpg") + '''
''' + row("科普作品", "用作品分享科学发现与创意", "K01", icon_name="experiment") + '''
''' + row("探访记录", "走进实践现场，记录真实体验", "K04", icon_name="fact_check") + '''
''' + row("编辑答疑", "编辑部整理发布的科普内容", "K05", icon_name="forum", state="内容栏目") + '''
</section>
<div class="v3-note info">科学港展示活动成果和编辑内容，不提供用户向科学家实时提问、专家答复或竞赛获奖承诺。</div>
''', subtitle="探索 · 实践 · 创造 · 分享")

pages["08.html"] = page("8", "填志愿", '''
<section class="v3-hero"><small>升学信息导引 · 外部服务待接入</small><h2>查公开信息<br>做理性选择</h2><p>汇总政策信息与第三方服务入口，不提供录取概率或录取结果承诺。</p></section>
<section class="v3-panel"><div class="v3-section-head"><h3>信息服务</h3><span>以正式发布为准</span></div><div class="v3-grid">
<button class="v3-card" onclick="v3Go('V01')">''' + icon("policy") + '''<strong>招考政策</strong><p>查看公开政策和时间节点</p></button>
<button class="v3-card" onclick="v3Go('V01')">''' + icon("database","blue") + '''<strong>公开数据</strong><p>汇总官方可查信息目录</p></button>
<button class="v3-card" onclick="v3Go('V02')">''' + icon("open_in_new","amber") + '''<strong>第三方服务</strong><p>了解跳转范围与责任边界</p></button>
<button class="v3-card" onclick="v3Toast('院校检索待接入')">''' + icon("search") + '''<strong>院校检索</strong><p>功能入口占位</p></button></div></section>
<div class="v3-note">外部平台尚未真实接入。所有信息仅供参考，请以教育主管部门和招生院校正式发布为准。</div><button class="v3-btn" style="width:100%" onclick="v3Toast('第三方平台待接入')">前往第三方平台（演示）</button>
''', active="服务", subtitle="公开信息 · 理性参考")

pages["09.html"] = page("9", "订报刊", '''
<section class="v3-hero"><small>贵州教育报 · 数字展读</small><h2>本期报纸<br>抢先看</h2><p>浏览头版与精选版面；正式订阅将前往官方订阅服务。</p></section>
<div class="v3-paper"><div class="mast">贵州教育报</div><div class="headline">记录校园里的真实成长与教育实践</div><div class="cols"></div><small>演示版面 · 期号待确认</small></div>
<section class="v3-section"><div class="v3-section-head"><h3>精选版面</h3><span>图片 / PDF 预览</span></div><div class="v3-grid"><button class="v3-card" onclick="v3Go('N01')">''' + icon("article") + '''<strong>校园新闻</strong><p>版面导读 · 演示</p></button><button class="v3-card" onclick="v3Go('N01')">''' + icon("groups","blue") + '''<strong>师生成长</strong><p>作品精选 · 演示</p></button></div></section>
<div class="v3-note">订阅购买、支付、配送、发票与对公信息由外部官方订阅服务负责，本原型不处理交易。</div><div class="v3-actions"><button class="v3-btn" onclick="v3Go('N02')">订阅服务说明</button><button class="v3-btn secondary" onclick="v3Toast('咨询方式待确认')">订阅咨询</button></div>
''', active="服务", subtitle="数字报展读 · 外部订阅")

pages["10.html"] = page("10", "我的", '''
<section class="v3-hero"><small>个人中心 · 演示账号</small><h2>同学，你好</h2><p>个人资料和所有记录均为演示数据，不对应真实用户。</p></section>
<div class="v3-metric-row"><div class="v3-metric"><strong>6</strong><span>投稿记录</span></div><div class="v3-metric"><strong>3</strong><span>参与活动</span></div><div class="v3-metric"><strong>8</strong><span>内容收藏</span></div></div>
<section class="v3-section"><div class="v3-section-head"><h3>我的记录</h3><span>统一查看</span></div><div class="v3-list">
''' + row("小记者资格与电子证", "等待后台审核（演示）", "J07", icon_name="badge", state="审核中") + '''
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

pages["stitch/J07.html"] = page("J07", "小记者资格申请", '''
<section class="v3-hero"><small>独立资格审核</small><h2>申请成为<br>校园小记者</h2><p>普通微信账号仅用于登录；资格申请需另行提交并由后台核验。</p></section>
<form class="v3-card v3-form" onsubmit="return v3Submit(this,'申请已提交，等待后台审核（演示）')">
<div class="v3-field"><label>学生姓名</label><input required placeholder="请输入学生姓名"></div>
<div class="v3-field"><label>学校</label><input required placeholder="请输入学校名称"></div>
<div class="v3-field"><label>所在年级</label><select required><option value="">请选择</option><option>小学四年级</option><option>小学五年级</option><option>小学六年级</option><option>初中一年级</option></select></div>
<div class="v3-field"><label>监护人姓名</label><input required placeholder="请输入监护人姓名"></div>
<div class="v3-field"><label>监护人联系方式</label><input required inputmode="tel" pattern="1[3-9][0-9]{9}" placeholder="11位手机号"></div>
<div class="v3-upload" onclick="v3Toast('材料上传为原型演示')"><span class="material-symbols-outlined">upload_file</span>上传学校盖章推荐材料<br><small>支持照片或 PDF（演示，不会实际上传）</small></div>
<label style="font-size:11px;line-height:1.6"><input type="checkbox" required> 已阅读资格审核与隐私说明</label>
<button class="v3-btn" type="submit">提交资格申请</button></form>
<div class="v3-note">资格仅用于校园采写身份审核，不承诺升学加分、实践学时或商业权益。</div>
''', active="我的", subtitle="资料提交 · 后台审核")

pages["stitch/K01.html"] = page("K01", "科学成果详情", '''
<section class="v3-hero has-image"><img src="../assets/v3/science-lab.jpg" alt="学生科学创作演示图"><div><small>小小发明家 · 精选成果</small><h2>校园节水装置</h2><p>学生作品 · 演示数据</p></div></section>
<div class="v3-card"><strong>作品说明</strong><p>从校园用水观察出发，完成问题记录、方案草图和模型验证。作品经编辑部审核后进行成果展播。</p></div>
<div class="v3-actions"><button class="v3-btn" onclick="v3Toast('已收藏作品')">收藏</button><button class="v3-btn secondary" onclick="v3Toast('分享海报已生成（演示）')">分享</button></div>
''')
pages["stitch/K02.html"] = page("K02", "一起来寻宝作品提交", '''
<section class="v3-hero"><small>探访记录 · 作品征集</small><h2>记录家乡的<br>科学宝藏</h2><p>提交探访图文或短视频，审核通过后进入成果展播。</p></section>
<form class="v3-card v3-form" onsubmit="return v3Submit(this)"><div class="v3-field"><label>作品标题</label><input required></div><div class="v3-field"><label>探访地点</label><input required></div><div class="v3-field"><label>作品说明</label><textarea required></textarea></div><div class="v3-upload" onclick="v3Toast('素材上传为原型演示')"><span class="material-symbols-outlined">add_photo_alternate</span>添加图片或视频（演示）</div><button class="v3-btn" type="submit">提交作品</button></form>
''')
pages["stitch/K03.html"] = page("K03", "小小发明家作品提交", '''
<section class="v3-hero"><small>科普作品 · 创意征集</small><h2>让小创意<br>解决真问题</h2><p>提交问题观察、创意方案和模型照片，编辑审核后择优展播。</p></section>
<form class="v3-card v3-form" onsubmit="return v3Submit(this)"><div class="v3-field"><label>发明名称</label><input required></div><div class="v3-field"><label>想解决的问题</label><textarea required></textarea></div><div class="v3-field"><label>创意方案</label><textarea required></textarea></div><div class="v3-upload" onclick="v3Toast('素材上传为原型演示')"><span class="material-symbols-outlined">add_photo_alternate</span>添加模型照片（演示）</div><button class="v3-btn" type="submit">提交作品</button></form>
''')
pages["stitch/K04.html"] = page("K04", "我的科学港作品", '''
<section class="v3-hero"><small>作品记录</small><h2>我的科学创作</h2><p>查看科普作品和探访记录的审核状态。</p></section><div class="v3-list">
''' + row("校园节水装置", "小小发明家 · 提交日期（演示）", "K01", icon_name="precision_manufacturing", state="审核中") + '''
''' + row("桥梁结构探访", "一起来寻宝 · 提交日期（演示）", "K01", icon_name="landscape", state="已展播") + '''</div>
''', active="我的")
pages["stitch/K05.html"] = page("K05", "编辑答疑", '''
<section class="v3-hero"><small>编辑部精编科普</small><h2>为什么溶洞里<br>会形成石笋？</h2><p>内容来源：公开科普资料整理 · 演示数据</p></section><div class="v3-card"><strong>编辑解读</strong><p>雨水渗入石灰岩层后溶解矿物质，水滴落到洞底时二氧化碳逸出，矿物质逐渐沉积。漫长岁月里，沉积物由下向上生长，形成石笋。</p></div><div class="v3-note info">本栏目由编辑部策划发布，不提供用户提问或专家实时答复。</div>
''')

pages["stitch/N01.html"] = page("N01", "数字报精选版面", '''
<section class="v3-hero"><small>数字报展读</small><h2>本期精选版面</h2><p>图片 / PDF 预览为版式演示。</p></section><div class="v3-paper"><div class="mast">贵州教育报</div><div class="headline">校园里的创新实践，让学习连接真实生活</div><div class="cols"></div></div><div class="v3-actions"><button class="v3-btn" onclick="v3Toast('正在打开高清预览（演示）')">高清预览</button><button class="v3-btn secondary" onclick="v3Go('9')">返回本期</button></div>
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
