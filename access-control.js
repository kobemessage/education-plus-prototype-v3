(() => {
  const AUTH_KEY = 'ep-v3-authenticated';
  const params = new URLSearchParams(location.search);
  const inferred = (location.pathname.match(/\/([A-Z]\d{2}|\d{2})\.html$/i) || [])[1] || '';
  const page = String(window.EP_PAGE || inferred).replace(/^0+(?=\d)/, '').toUpperCase();
  const forceGuest = params.get('guest') === '1';
  const forceAuth = params.get('auth') === '1';
  const isLoggedIn = forceAuth || (!forceGuest && localStorage.getItem(AUTH_KEY) === '1');

  const privatePages = new Set([
    '10', 'G02', 'G03', 'G04', 'G05', 'G06',
    'S02', 'S04', 'S06',
    'J02', 'J03', 'J04', 'J06', 'J07', 'J08',
    'Y02', 'Y04', 'Y05',
    'K02', 'K03', 'K04'
  ]);

  const publishedContentPages = new Set([
    '12', 'R04', 'R06', 'R12', 'R13', 'S01', 'S03', 'S05',
    'J01', 'J05', 'Y01', 'Y03', 'C01', 'C03', 'K01', 'K05',
    'N01', 'G07'
  ]);

  const discoveryCatalog = {
    HOME: {
      eyebrow: '校园自选单',
      title: '从今天的教育现场继续出发',
      intro: '内容、作品和服务串成一条可继续浏览的路径。',
      items: [
        ['R12', 'auto_stories', '正在发生', '全省校园共读计划', '看学校读什么、怎么读'],
        ['C03', 'play_circle', '随时可看', '公益课精选回放', '从课堂内容继续学习'],
        ['G07', 'newspaper', '今日导读', '校园里的教育新鲜事', '用一篇资讯了解更多校园']
      ]
    },
    R: {
      eyebrow: '阅读接力',
      title: '从一篇文字走到下一段共读',
      intro: '把书目、读后感和校园读书会放在同一条阅读线上。',
      items: [
        ['R07', 'library_books', '找一本书', '共读书库', '从主题、年级和荐读理由开始'],
        ['R05', 'rate_review', '看一篇文章', '读后感精选', '读同龄人如何写下自己的思考'],
        ['R12', 'diversity_3', '参加共读', '全省校园读书会', '了解学校信息、书目和最新动态']
      ]
    },
    S: {
      eyebrow: '少年派灵感站',
      title: '从灵感、指导到完整作品',
      intro: '每一次表达都可以找到参照、修改建议和展示机会。',
      items: [
        ['S05', 'tips_and_updates', '写作锦囊', '名师指导', '用具体示例解开创作卡点'],
        ['S01', 'ink_pen', '编辑精选', '少年派作品', '看一篇完整作品如何被呈现'],
        ['S03', 'emoji_events', '正在征集', '热门赛事', '查看主题、对象与投稿说明']
      ]
    },
    J: {
      eyebrow: '校园采写手记',
      title: '好故事从观察和提问开始',
      intro: '看作品、学方法、认识校园小记者的成长路径。',
      items: [
        ['J01', 'photo_camera', '作品现场', '一篇完整采写作品', '从标题、图片到正文一次看完'],
        ['J05', 'face_6', '校园面孔', '小记者风采', '认识记录校园的同龄人'],
        ['J07', 'badge', '成为记录者', '小记者入驻说明', '了解学校推荐和监护人确认流程']
      ]
    },
    Y: {
      eyebrow: '青春切片',
      title: '让每一种大学生活都有回声',
      intro: '从校园日常到社团故事，再到主题征集，持续记录青春。',
      items: [
        ['Y01', 'photo_library', '校园日常', '晚风穿过图书馆', '看一组带有时间温度的校园记录'],
        ['Y03', 'campaign', '主题征集', '贵州教育报主题活动', '查看征集主题和作品要求'],
        ['Y04', 'edit_square', '写下此刻', '发布图文或短视频', '把自己的校园故事整理成作品']
      ]
    },
    C: {
      eyebrow: '公益课学习单',
      title: '一门好课不只有播放键',
      intro: '把课程内容、主讲教师、参与学校和回放入口连在一起。',
      items: [
        ['C01', 'menu_book', '先读课程', '课程详情', '了解主讲教师、课程大纲与参与学校'],
        ['C03', 'smart_display', '立即学习', '精选课程回放', '按主题找到适合当下的课程'],
        ['C02', 'live_tv', '直播预告', '直播服务说明', '了解视频号待接入范围和观看方式']
      ]
    },
    K: {
      eyebrow: '好奇心实验簿',
      title: '从身边问题发现科学线索',
      intro: '发明、探访和科普内容都从真实观察开始。',
      items: [
        ['K01', 'science', '科学发现', '家乡科学宝藏', '看少年如何记录喀斯特与生态'],
        ['K05', 'forum', '编辑精编', '科学问题解读', '用可理解的方式拆解一个科学现象'],
        ['K03', 'precision_manufacturing', '动手创造', '小小发明家', '把问题、草图和测试记录整理成作品']
      ]
    },
    V: {
      eyebrow: '升学信息夹',
      title: '先核对信息，再做选择',
      intro: '政策、时间节点和外部服务边界都需要看清楚。',
      items: [
        ['V01', 'policy', '公开信息', '招考政策与数据', '按当年官方发布内容核对'],
        ['V02', 'open_in_new', '服务边界', '第三方服务说明', '看清跳转范围、信息责任和待接入状态'],
        ['G07', 'article', '教育资讯', '近期教育新闻导读', '从公开资讯补充理解背景']
      ]
    },
    N: {
      eyebrow: '报纸展读架',
      title: '从一个版面看见更多校园',
      intro: '用数字导读先找到感兴趣的版面，再了解正式订阅服务。',
      items: [
        ['N01', 'newspaper', '精选版面', '校园新闻与师生成长', '按版面导读浏览本期精选内容'],
        ['N02', 'subscriptions', '订阅必读', '官方订阅服务说明', '了解交易、配送与发票服务边界'],
        ['G07', 'school', '延伸阅读', '今日教育资讯', '从纸面主题延伸到更新的校园现场']
      ]
    },
    G: {
      eyebrow: '我的内容轨迹',
      title: '把收藏、活动和作品放在一处',
      intro: '从看过什么、参加什么到发布什么，都有清晰去处。',
      items: [
        ['G03', 'favorite', '继续阅读', '我的收藏', '找回收藏的文章、课程和作品'],
        ['G04', 'event_available', '参与记录', '我的活动', '查看已参与活动的状态和去向'],
        ['G05', 'edit_document', '创作记录', '我的投稿', '统一查看不同板块的作品进度']
      ]
    },
    ACTIVITY: {
      eyebrow: '本周校园活动簿',
      title: '选一个主题，让参与不停在浏览',
      intro: '征集、共读与校园记录都可查看详情并分享给同学。',
      items: [
        ['S03', 'draw', '作品征集', '“筑梦黔山”少年作品', '查看主题、对象和投稿说明'],
        ['Y03', 'video_camera_front', '青春记录', '“我和我的大学”征集', '用图文或短视频记录校园日常'],
        ['R12', 'auto_stories', '校园共读', '全省校园共读计划', '看学校、书目和共读动态']
      ]
    }
  };

  const discoveryImages = {
    R: ['assets/v3/campus-reading-v2.jpg', '校园共读主题演示图片'],
    S: ['assets/v3/youth-creation-v2.jpg', '少年创作主题演示图片'],
    J: ['assets/v3/campus-reporter-v2.jpg', '校园小记者主题演示图片'],
    Y: ['assets/v3/university-life-v2.jpg', '大学生活主题演示图片'],
    C: ['assets/v3/public-class.jpg', '公益课堂主题演示图片'],
    K: ['assets/v3/science-exploration-v2.jpg', '科学探索主题演示图片'],
    V: ['assets/v3/application-guidance-v2.png', '升学志愿指导主题演示图片'],
    N: ['assets/v3/newspaper-preview-v2.jpg', '数字报刊主题演示图片'],
    G: ['assets/v3/campus-view.jpg', '校园内容服务主题演示图片']
  };

  const style = document.createElement('style');
  style.id = 'ep-access-style';
  style.textContent = `
    .ep-access-note{box-sizing:border-box;margin:8px 0 14px;padding:9px 12px;min-height:42px;display:flex;align-items:center;gap:8px;border:1px solid #d8e9e3;border-radius:13px;background:#f3faf7;color:#536d65;font:500 12px/1.45 "PingFang SC","Microsoft YaHei",-apple-system,sans-serif}
    .ep-access-note strong{flex:none;padding:3px 7px;border-radius:6px;background:#dff3ec;color:#087f73;font-weight:700}
    .ep-access-note[data-private="true"]{border-color:#eadfb8;background:#fffaf0;color:#756848}
    .ep-access-note[data-private="true"] strong{background:#f7e9b9;color:#735d13}
    .ep-published-actions{box-sizing:border-box;margin:16px 0 8px;padding:14px;border:1px solid #dce9e4;border-radius:18px;background:#fff;box-shadow:0 4px 14px rgba(24,62,52,.045)}
    .ep-published-actions>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
    .ep-published-actions button,.ep-action-added{appearance:none;box-sizing:border-box;min-width:0;min-height:44px;border:1px solid #d5e7e1;border-radius:13px;background:#f5faf8;color:#315b51;font:600 13px/1 "PingFang SC","Microsoft YaHei",-apple-system,sans-serif;display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:0 10px;cursor:pointer}
    .ep-published-actions button:active,.ep-action-added:active{transform:scale(.97);background:#eaf5f1}
    .ep-published-actions button.active,.ep-action-added.active,.ep-inline-action.active{border-color:#8bcabb;background:#e5f5ef;color:#087f73}
    .ep-published-actions small{display:block;margin-top:9px;color:#71877f;font:500 11px/1.45 "PingFang SC","Microsoft YaHei",-apple-system,sans-serif;text-align:center}
    .ep-action-count{font-variant-numeric:tabular-nums;color:#6d827b;font-weight:600}
    .ep-inline-engagement{box-sizing:border-box;margin-top:12px;padding-top:10px;border-top:1px dashed #dbe8e3;display:flex;align-items:center;gap:7px}
    .ep-inline-engagement .ep-inline-label{margin-right:auto;color:#71877f;font:600 11px/1.3 "PingFang SC","Microsoft YaHei",-apple-system,sans-serif}
    .ep-inline-action{appearance:none;min-height:36px;padding:0 10px;border:1px solid #d9e8e3;border-radius:999px;background:#f7fbf9;color:#41675e;display:inline-flex;align-items:center;justify-content:center;gap:4px;font:600 12px/1 "PingFang SC","Microsoft YaHei",-apple-system,sans-serif;cursor:pointer}
    .ep-inline-action:active{transform:scale(.96)}
    .ep-discovery{box-sizing:border-box;margin:24px 0 10px;padding:17px;border:1px solid #dbe9e4;border-radius:22px;background:linear-gradient(150deg,#f7fbf9 0%,#edf7f3 100%);color:#173f36;box-shadow:0 8px 24px rgba(24,62,52,.055);font-family:"PingFang SC","Microsoft YaHei",-apple-system,sans-serif;position:relative;overflow:hidden}
    .ep-unified-main>.ep-discovery{margin-right:16px;margin-left:16px}
    .ep-discovery:before{content:"";position:absolute;width:84px;height:84px;right:-31px;top:-36px;border:18px solid rgba(8,127,115,.075);border-radius:50%}
    .ep-discovery-head{position:relative;padding-right:30px}
    .ep-discovery-eyebrow{display:inline-flex;align-items:center;gap:6px;margin:0 0 7px;color:#087f73;font-size:11px;line-height:1.2;font-weight:800;letter-spacing:.08em}
    .ep-discovery-eyebrow:before{content:"";width:16px;height:2px;border-radius:2px;background:#efbd23}
    .ep-discovery h2{margin:0;color:#173f36;font-size:18px;line-height:1.45;font-weight:800;letter-spacing:-.01em}
    .ep-discovery-intro{margin:6px 0 14px;color:#657c74;font-size:12px;line-height:1.65}
    .ep-discovery-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
    .ep-discovery-card{appearance:none;box-sizing:border-box;min-width:0;min-height:136px;padding:13px;border:1px solid #dbe9e4;border-radius:16px;background:rgba(255,255,255,.9);color:#173f36;text-align:left;display:flex;flex-direction:column;align-items:flex-start;gap:7px;box-shadow:0 3px 12px rgba(24,62,52,.04);cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
    .ep-discovery-card:nth-child(3):last-child{grid-column:1/-1;min-height:0}
    .ep-discovery-card:hover{transform:translateY(-2px);border-color:#b9d9cf;box-shadow:0 7px 18px rgba(24,62,52,.075)}
    .ep-discovery-card:active{transform:scale(.985)}
    .ep-discovery-card:focus-visible,.ep-inline-action:focus-visible,.ep-published-actions button:focus-visible{outline:3px solid #efbd23;outline-offset:2px}
    .ep-discovery-icon{width:38px;height:38px;border-radius:13px;background:#e2f4ee;color:#087f73;display:flex;align-items:center;justify-content:center;flex:none}
    .ep-discovery-icon .material-symbols-outlined{font-size:21px!important}
    .ep-discovery-kicker{color:#8a6a12;font-size:10px;line-height:1.25;font-weight:800}
    .ep-discovery-card strong{font-size:13px;line-height:1.45;font-weight:800}
    .ep-discovery-copy{margin:0;color:#70837d;font-size:11px;line-height:1.55}
    .ep-discovery-media{display:block;width:100%;aspect-ratio:16/10;margin-top:auto;border:1px solid #e1ece8;border-radius:12px;object-fit:cover;background:#eaf4f0}
    .ep-discovery-card:nth-child(3):last-child .ep-discovery-media{aspect-ratio:16/7}
    .ep-discovery-arrow{align-self:flex-end;color:#7d968e;font-size:18px!important}
    .ep-discovery-demo{margin:11px 1px 0;color:#7d918a;font-size:10px;line-height:1.45;text-align:right}
    #ep-login-dialog{position:fixed;inset:0;z-index:13050;display:flex;align-items:flex-end;justify-content:center;padding:16px;background:rgba(9,35,29,.48);backdrop-filter:blur(3px)}
    #ep-login-dialog[hidden]{display:none!important}
    #ep-login-dialog .ep-login-sheet{box-sizing:border-box;width:min(100%,390px);padding:22px 18px calc(18px + env(safe-area-inset-bottom,0px));border-radius:24px 24px 18px 18px;background:#fff;color:#173f36;box-shadow:0 18px 44px rgba(8,36,30,.22);font-family:"PingFang SC","Microsoft YaHei",-apple-system,sans-serif}
    #ep-login-dialog .ep-login-icon{width:46px;height:46px;margin-bottom:12px;border-radius:15px;background:#e1f4ed;color:#087f73;display:flex;align-items:center;justify-content:center;font-size:24px}
    #ep-login-dialog h2{margin:0 0 7px;font-size:19px;line-height:1.35}
    #ep-login-dialog p{margin:0 0 16px;color:#657b74;font-size:13px;line-height:1.65}
    #ep-login-dialog .ep-login-buttons{display:grid;grid-template-columns:1fr 1.5fr;gap:9px}
    #ep-login-dialog button{min-height:46px;border:1px solid #cfe2dc;border-radius:13px;background:#fff;color:#376158;font:700 14px/1 "PingFang SC","Microsoft YaHei",-apple-system,sans-serif;cursor:pointer}
    #ep-login-dialog button[data-primary="true"]{border-color:#087f73;background:#087f73;color:#fff}
    .ep-private-locked>:not(#ep-access-gate):not(script):not(style){display:none!important}
    #ep-access-gate{box-sizing:border-box;min-height:100dvh;width:100%;padding:56px 18px 32px;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#f4faf7 0%,#edf5f1 100%);font-family:"PingFang SC","Microsoft YaHei",-apple-system,sans-serif}
    #ep-access-gate .ep-gate-card{box-sizing:border-box;width:min(100%,390px);padding:28px 20px;border:1px solid #d5e6df;border-radius:26px;background:#fff;text-align:center;box-shadow:0 16px 42px rgba(24,62,52,.1)}
    #ep-access-gate .ep-gate-icon{width:60px;height:60px;margin:0 auto 16px;border-radius:20px;background:#e2f4ee;color:#087f73;display:flex;align-items:center;justify-content:center;font-size:30px}
    #ep-access-gate h1{margin:0 0 8px;color:#173f36;font-size:22px;line-height:1.35}
    #ep-access-gate p{margin:0 0 18px;color:#6a8179;font-size:14px;line-height:1.65}
    #ep-access-gate .ep-gate-hint{margin:0 0 18px;padding:10px 12px;border-radius:12px;background:#f3f8f6;color:#527067;font-size:12px;line-height:1.55}
    #ep-access-gate button{width:100%;min-height:48px;margin-top:9px;border:1px solid #cfe2dc;border-radius:14px;background:#fff;color:#376158;font:700 14px/1 "PingFang SC","Microsoft YaHei",-apple-system,sans-serif;cursor:pointer}
    #ep-access-gate button[data-primary="true"]{border-color:#087f73;background:#087f73;color:#fff}
    .ep-access-toast{position:fixed;left:50%;bottom:96px;z-index:13060;max-width:calc(100vw - 40px);padding:10px 16px;border-radius:999px;background:#183e34;color:#fff;font:600 13px/1.4 "PingFang SC","Microsoft YaHei",-apple-system,sans-serif;box-shadow:0 8px 22px rgba(8,36,30,.2);transform:translate(-50%,12px);opacity:0;pointer-events:none;transition:.2s}
    .ep-access-toast.show{transform:translate(-50%,0);opacity:1}
    @media(max-width:360px){.ep-access-note{font-size:11px}.ep-published-actions button,.ep-action-added{font-size:12px;padding:0 7px}.ep-discovery{padding:14px}.ep-discovery-card{padding:11px}.ep-inline-engagement .ep-inline-label{display:none}}
    @media(prefers-reduced-motion:reduce){.ep-discovery-card{transition:none}.ep-discovery-card:hover{transform:none}}
  `;
  document.head.append(style);

  function toast(message) {
    let element = document.querySelector('.ep-access-toast');
    if (!element) {
      element = document.createElement('div');
      element.className = 'ep-access-toast';
      element.setAttribute('role', 'status');
      element.setAttribute('aria-live', 'polite');
      document.body.append(element);
    }
    element.textContent = message;
    element.classList.add('show');
    clearTimeout(element._timer);
    element._timer = setTimeout(() => element.classList.remove('show'), 2200);
  }

  function go(route) {
    if (typeof window.v3Go === 'function') window.v3Go(route);
    else if (parent !== window) parent.postMessage({ educationPlusRoute: String(route) }, location.origin);
    else location.href = (location.pathname.includes('/stitch/') ? '../' : '') + 'index.html#' + route;
  }

  function discoveryKey() {
    if (page === '12') return 'ACTIVITY';
    if (page === '11') return '';
    if (page === '1') return 'HOME';
    if (/^[2-9]$/.test(page)) return ({ 2: 'R', 3: 'S', 4: 'J', 5: 'Y', 6: 'C', 7: 'K', 8: 'V', 9: 'N' })[page];
    if (page === '10') return 'G';
    return discoveryCatalog[page[0]] ? page[0] : 'HOME';
  }

  function discoveryImage(route) {
    const key = discoveryImages[route[0]] ? route[0] : 'G';
    const [source, alt] = discoveryImages[key];
    const prefix = location.pathname.includes('/stitch/') ? '../' : '';
    return { source: prefix + source, alt };
  }

  function addDiscovery() {
    const main = document.querySelector('main');
    const catalog = discoveryCatalog[discoveryKey()];
    if (!main || !catalog || main.querySelector('.ep-discovery')) return;
    const items = catalog.items.filter(item => item[0] !== page);
    const section = document.createElement('section');
    section.className = 'ep-discovery';
    section.setAttribute('aria-labelledby', `ep-discovery-title-${page || 'home'}`);
    section.innerHTML = `
      <div class="ep-discovery-head">
        <p class="ep-discovery-eyebrow">${catalog.eyebrow}</p>
        <h2 id="ep-discovery-title-${page || 'home'}">${catalog.title}</h2>
        <p class="ep-discovery-intro">${catalog.intro}</p>
      </div>
      <div class="ep-discovery-grid">
        ${items.map(([route, icon, kicker, title, copy]) => {
          const media = discoveryImage(route);
          return `
          <button class="ep-discovery-card" type="button" data-ep-discovery-route="${route}" aria-label="${title}">
            <span class="ep-discovery-icon" aria-hidden="true"><span class="material-symbols-outlined">${icon}</span></span>
            <span class="ep-discovery-kicker">${kicker}</span>
            <strong>${title}</strong>
            <span class="ep-discovery-copy">${copy}</span>
            <img class="ep-discovery-media" src="${media.source}" alt="${title}：${media.alt}" decoding="async">
            <span class="material-symbols-outlined ep-discovery-arrow" aria-hidden="true">arrow_forward</span>
          </button>`;
        }).join('')}
      </div>
      <p class="ep-discovery-demo">以上人物、作品、活动与数量均为演示内容</p>`;
    section.addEventListener('click', event => {
      const card = event.target.closest('[data-ep-discovery-route]');
      if (card) go(card.dataset.epDiscoveryRoute);
    });
    main.append(section);
  }

  function completeLogin() {
    localStorage.setItem(AUTH_KEY, '1');
    const url = new URL(location.href);
    url.searchParams.delete('guest');
    history.replaceState(null, '', url.href);
    location.reload();
  }

  function openLoginDialog(actionLabel) {
    let dialog = document.getElementById('ep-login-dialog');
    if (!dialog) {
      dialog = document.createElement('div');
      dialog.id = 'ep-login-dialog';
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.setAttribute('aria-labelledby', 'ep-login-title');
      dialog.innerHTML = `<div class="ep-login-sheet"><div class="ep-login-icon" aria-hidden="true">●</div><h2 id="ep-login-title">登录后使用个人互动</h2><p id="ep-login-copy"></p><div class="ep-login-buttons"><button type="button" data-close="true">暂不登录</button><button type="button" data-primary="true">模拟微信登录</button></div></div>`;
      document.body.append(dialog);
      dialog.querySelector('[data-close]').addEventListener('click', () => { dialog.hidden = true; });
      dialog.querySelector('[data-primary]').addEventListener('click', completeLogin);
      dialog.addEventListener('click', event => { if (event.target === dialog) dialog.hidden = true; });
    }
    dialog.querySelector('#ep-login-copy').textContent = `${actionLabel || '该操作'}会写入个人账号记录。作品正文与主要内容仍可免登录阅读，分享也无需登录。`;
    dialog.hidden = false;
  }

  function addAccessNote() {
    const main = document.querySelector('main');
    if (!main || main.querySelector('.ep-access-note')) return;
    const note = document.createElement('div');
    note.className = 'ep-access-note';
    if (page === '11') {
      note.innerHTML = '<strong>公开查询</strong><span>课程、政策、报刊与服务说明可直接查看 · 投稿与入驻需登录</span>';
    } else if (privatePages.has(page)) {
      note.dataset.private = 'true';
      note.innerHTML = '<strong>登录后内容</strong><span>投稿、进度、收藏和个人档案仅本人登录后查看</span>';
    } else if (publishedContentPages.has(page)) {
      note.innerHTML = '<strong>游客可读</strong><span>正文免登录 · 分享免登录 · 点赞、收藏与发表评论需登录</span>';
    } else {
      note.innerHTML = '<strong>公开浏览</strong><span>核心资讯、作品、课程、活动和服务说明无需登录</span>';
    }
    main.prepend(note);
  }

  function showPrivateGate() {
    document.body.classList.add('ep-private-locked');
    const gate = document.createElement('main');
    gate.id = 'ep-access-gate';
    gate.innerHTML = `<section class="ep-gate-card"><div class="ep-gate-icon" aria-hidden="true">●</div><h1>该页面需要登录</h1><p>这里包含个人投稿、审核进度、收藏记录或个人资料，仅向本人开放。</p><div class="ep-gate-hint">首页、已发布作品、教育资讯、公益课程与活动详情均可直接浏览，无需登录。</div><button type="button" data-primary="true">模拟微信登录后查看</button><button type="button" data-public-home="true">返回公开首页</button></section>`;
    document.body.append(gate);
    gate.querySelector('[data-primary]').addEventListener('click', completeLogin);
    gate.querySelector('[data-public-home]').addEventListener('click', () => go('1'));
  }

  function controlLabel(control) {
    return [control.getAttribute('aria-label'), control.getAttribute('title'), control.textContent]
      .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  }

  function actionType(label) {
    if (/分享|海报|转发/.test(label)) return 'share';
    if (/点赞|赞同/.test(label)) return 'like';
    if (/收藏|书架/.test(label)) return 'favorite';
    return '';
  }

  function controlActionType(control) {
    const label = controlLabel(control);
    const source = [
      label,
      control.id,
      control.className,
      control.getAttribute('onclick'),
      control.dataset.epAction
    ].filter(Boolean).join(' ');
    if (/已点赞|toggleLike|juniorToggle\([^)]*点赞|like-btn|btn-like|article-like|thumb_up/.test(source)) return 'like';
    if (/已收藏|toggleStar|juniorToggle\([^)]*收藏|star-btn|btn-fav|article-save|bookmark/.test(source)) return 'favorite';
    if (/分享|海报|转发|share/.test(source)) return 'share';
    return actionType(label);
  }

  const ENGAGEMENT_KEY = 'ep-v3-engagement';

  function readEngagement() {
    try { return JSON.parse(localStorage.getItem(ENGAGEMENT_KEY) || '{}'); }
    catch { return {}; }
  }

  function saveEngagement(data) {
    localStorage.setItem(ENGAGEMENT_KEY, JSON.stringify(data));
  }

  function seedCount(scope, type) {
    const seed = [...`${scope}:${type}`].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 997, 17);
    if (type === 'like') return 48 + (seed % 286);
    if (type === 'favorite') return 16 + (seed % 92);
    return 21 + (seed % 148);
  }

  function engagementRecord(scope) {
    const data = readEngagement();
    return { data, record: data[scope] || { liked: false, favorited: false, shares: 0 } };
  }

  function renderManagedAction(control) {
    const type = control.dataset.epAction;
    const scope = control.dataset.epScope || page;
    const { record } = engagementRecord(scope);
    const labels = {
      like: ['♡', '♥', '点赞'],
      favorite: ['☆', '★', '收藏'],
      share: ['↗', '↗', '分享']
    };
    const selected = type === 'like' ? record.liked : type === 'favorite' ? record.favorited : false;
    const count = seedCount(scope, type) + (type === 'like' && record.liked ? 1 : 0) + (type === 'favorite' && record.favorited ? 1 : 0) + (type === 'share' ? record.shares || 0 : 0);
    const [idleIcon, activeIcon, label] = labels[type];
    control.classList.toggle('active', selected);
    if (type !== 'share') control.setAttribute('aria-pressed', String(selected));
    control.setAttribute('aria-label', `${selected && type !== 'share' ? `取消${label}` : label}，当前 ${count}`);
    control.innerHTML = `<span aria-hidden="true">${selected ? activeIcon : idleIcon}</span><span>${label}</span><span class="ep-action-count">${count}</span>`;
  }

  function createManagedAction(type, scope, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.dataset.epAction = type;
    button.dataset.epScope = scope;
    button.dataset.epManaged = 'true';
    renderManagedAction(button);
    return button;
  }

  function runManagedAction(control) {
    const type = control.dataset.epAction;
    const scope = control.dataset.epScope || page;
    const { data, record } = engagementRecord(scope);
    if (type === 'like') record.liked = !record.liked;
    if (type === 'favorite') record.favorited = !record.favorited;
    if (type === 'share') record.shares = (record.shares || 0) + 1;
    data[scope] = record;
    saveEngagement(data);
    document.querySelectorAll(`[data-ep-managed="true"][data-ep-scope="${CSS.escape(scope)}"]`).forEach(renderManagedAction);
    if (type === 'share') toast('分享卡片已生成（演示），无需登录');
    else if (type === 'like') toast(record.liked ? '已点赞' : '已取消点赞');
    else toast(record.favorited ? '已收藏' : '已取消收藏');
  }

  function ensurePublishedInteractions() {
    if (!publishedContentPages.has(page)) return;
    const main = document.querySelector('main');
    if (!main) return;
    const existing = new Set();
    const existingControls = [];
    main.querySelectorAll('button,a,[role="button"]').forEach(control => {
      const type = controlActionType(control);
      if (type) {
        const actionNames = { like: '点赞', favorite: '收藏', share: '分享' };
        const currentName = control.getAttribute('aria-label') || '';
        if (!actionType(currentName)) control.setAttribute('aria-label', actionNames[type]);
        existing.add(type);
        existingControls.push(control);
      }
    });
    const missing = ['like', 'favorite', 'share'].filter(type => !existing.has(type));
    if (!missing.length) return;

    const candidates = [...main.querySelectorAll('.actions,.v3-actions,.article-actions,[aria-label*="文章操作"],[aria-label*="互动"]')];
    const target = candidates.find(container => container.querySelector('button,a')) || existingControls[0]?.parentElement;
    if (target) {
      missing.forEach(type => {
        target.append(createManagedAction(type, page, 'ep-action-added'));
      });
      return;
    }

    const section = document.createElement('section');
    section.className = 'ep-published-actions';
    section.setAttribute('aria-label', '内容互动');
    const controls = document.createElement('div');
    ['like', 'favorite', 'share'].forEach(type => controls.append(createManagedAction(type, page, 'ep-action-added')));
    const hint = document.createElement('small');
    hint.textContent = '正文和活动信息可免登录阅读；分享无需登录，点赞与收藏登录后记录';
    section.append(controls, hint);
    main.append(section);
  }

  function enhanceActivityCards() {
    if (page !== '12') return;
    document.querySelectorAll('[data-category][data-status]').forEach((card, index) => {
      if (card.querySelector('.ep-inline-engagement')) return;
      const title = card.querySelector('strong')?.textContent?.replace(/\s*\[演示数据\]\s*/g, '').trim() || `活动 ${index + 1}`;
      const actions = document.createElement('div');
      actions.className = 'ep-inline-engagement';
      actions.setAttribute('aria-label', `${title}互动`);
      const label = document.createElement('span');
      label.className = 'ep-inline-label';
      label.textContent = '同学们正在关注';
      actions.append(label);
      actions.append(createManagedAction('like', `12:activity:${index}`, 'ep-inline-action'));
      actions.append(createManagedAction('share', `12:activity:${index}`, 'ep-inline-action'));
      card.append(actions);
    });
  }

  function isProtectedAction(label, control) {
    if (control.closest('#ep-login-dialog,#ep-access-gate')) return false;
    if (control.dataset.epBrowseAction === 'true') return false;
    if (control.dataset.epRequiresLogin === 'true') return true;
    if (/分享|海报|转发|查看评论|全部评论|评论\s*\(\d+\)/.test(label)) return false;
    return /点赞|赞同|收藏|关注|发表评论|发布评论|发送评论|写评论|评论输入|举报|投稿|创作入口|发布创作|发布作品|发起新稿|报名|申请入驻|资格申请|提交申请|继续学习|开始学习|进入课堂|我的发布|我的作品|我的收藏|个人资料/.test(label);
  }

  document.addEventListener('click', event => {
    const control = event.target.closest('button,a,[role="button"],[onclick]');
    if (!control) return;
    const label = controlLabel(control);
    const type = control.dataset.epAction || controlActionType(control);
    if (!isLoggedIn && (type === 'like' || type === 'favorite' || isProtectedAction(label, control))) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openLoginDialog(type === 'like' ? '点赞' : type === 'favorite' ? '收藏' : label.slice(0, 18));
      return;
    }
    if (control.dataset.epManaged === 'true') {
      event.preventDefault();
      event.stopImmediatePropagation();
      runManagedAction(control);
    } else if (type === 'share') {
      event.preventDefault();
      event.stopImmediatePropagation();
      toast('分享卡片已生成（演示），无需登录');
    } else if (control.classList.contains('ep-action-added') || control.closest('.ep-published-actions')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      control.classList.toggle('active');
      toast(control.classList.contains('active') ? (type === 'like' ? '已点赞' : '已收藏') : (type === 'like' ? '已取消点赞' : '已取消收藏'));
    }
  }, true);

  if (privatePages.has(page) && !isLoggedIn) {
    showPrivateGate();
    return;
  }
  addAccessNote();
  ensurePublishedInteractions();
  enhanceActivityCards();
  addDiscovery();
  window.epAccess = { page, isLoggedIn, privatePages, publishedContentPages, openLoginDialog, addDiscovery };
})();
