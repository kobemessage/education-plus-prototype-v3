(() => {
  const AUTH_KEY = 'ep-v3-authenticated';
  const params = new URLSearchParams(location.search);
  const inferred = (location.pathname.match(/\/([A-Z]\d{2}|\d{2})\.html$/i) || [])[1] || '';
  const page = String(window.EP_PAGE || inferred).replace(/^0+(?=\d)/, '').toUpperCase();
  const forceGuest = params.get('guest') === '1';
  const forceAuth = params.get('auth') === '1';
  const isLoggedIn = forceAuth || (!forceGuest && localStorage.getItem(AUTH_KEY) === '1');
  const iconLabels = {
    arrow_back: '返回', arrow_back_ios: '返回', arrow_back_ios_new: '返回', close: '关闭',
    more_horiz: '更多', person: '个人中心', account_circle: '个人中心', notifications: '消息通知',
    share: '分享', favorite: '点赞', favorite_border: '点赞', bookmark: '收藏', bookmark_border: '收藏',
    search: '搜索', tune: '筛选', fullscreen: '全屏', volume_up: '音量', play_arrow: '播放',
    chevron_right: '查看详情', expand_more: '展开详情', download: '保存', delete: '删除'
  };

  document.querySelectorAll('img').forEach(image => {
    if (!image.hasAttribute('alt')) image.alt = image.dataset.alt || '';
  });
  document.querySelectorAll('button,a,[role="button"]').forEach(control => {
    if (control.getAttribute('aria-label') || control.getAttribute('title')) return;
    const text = (control.textContent || '').replace(/\s+/g, ' ').trim();
    const icon = control.querySelector('.material-symbols-outlined');
    const iconName = (icon?.textContent || '').trim();
    if (text && text !== iconName) return;
    control.setAttribute('aria-label', iconLabels[iconName] || '操作');
  });

  const privatePages = new Set([
    '10', 'G02', 'G03', 'G04', 'G05', 'G06',
    'S04', 'S06',
    'J02', 'J03', 'J04', 'J06', 'J07', 'J08',
    'Y02', 'Y04', 'Y05',
    'K02', 'K03', 'K04'
  ]);

  const publishedContentPages = new Set([
    '12', 'R04', 'R06', 'R13', 'S01', 'S03', 'S05',
    'J01', 'J05', 'Y01', 'Y03', 'C01', 'C03', 'K01', 'K05',
    'N01', 'G07'
  ]);

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
    .ep-inline-action:focus-visible,.ep-published-actions button:focus-visible{outline:3px solid #efbd23;outline-offset:2px}
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
    .ep-demo-strip{box-sizing:border-box;margin:8px 16px 12px;padding:9px 12px;display:flex;align-items:center;gap:8px;min-height:38px;border:1px solid #dcebe5;border-radius:12px;background:#f2faf7;color:#526a63;font:500 12px/1.45 "PingFang SC","Microsoft YaHei",-apple-system,sans-serif;box-shadow:none}
    .ep-demo-strip strong{flex:none;padding:2px 6px;border-radius:5px;background:#dff3ec;color:#087f73;font-weight:700}
    .ep-demo-strip span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .ep-access-toast{position:fixed;left:50%;bottom:20px;z-index:13060;max-width:calc(100vw - 40px);padding:10px 16px;border-radius:999px;background:#183e34;color:#fff;font:600 13px/1.4 "PingFang SC","Microsoft YaHei",-apple-system,sans-serif;box-shadow:0 8px 22px rgba(8,36,30,.2);transform:translate(-50%,12px);opacity:0;pointer-events:none;transition:.2s}
    .ep-access-toast.show{transform:translate(-50%,0);opacity:1}
    @media(max-width:360px){.ep-access-note{font-size:11px}.ep-published-actions button,.ep-action-added{font-size:12px;padding:0 7px}.ep-inline-engagement .ep-inline-label{display:none}}
  `;
  document.head.append(style);

  function addDemoStrip() {
    if (!document.querySelector('script[src*="v3-overrides.js"]')) return;
    const main = document.querySelector('main');
    if (!main || main.querySelector('.ep-demo-strip')) return;
    const detail = (() => {
      if (page === '1') return '8个服务入口 · 2项内容更新';
      if (page === '2' || page.startsWith('R')) return '3条内容主线 · 8个阅读页面';
      if (page === '3' || page.startsWith('S')) return '6篇成长作品 · 2篇编辑精选';
      if (page === '4' || page.startsWith('J')) return '资格审核中 · 2条投稿记录';
      if (page === '5' || page.startsWith('Y')) return '3条校园内容 · 1条审核中';
      if (page === '6' || page.startsWith('C')) return '4节公益课 · 直播与回放演示';
      if (page === '7' || page.startsWith('K')) return '2条科普作品 · 1条探访记录';
      if (page === '8' || page.startsWith('V')) return '公开信息 · 第三方服务待接入';
      if (page === '9' || page.startsWith('N')) return '数字报预览 · 外部订阅待接入';
      if (page === '10' || page.startsWith('G')) return '个人中心 · 2项进行中 · 5条成长记录';
      if (page === '12') return '全省活动 · 5项演示 · 2项进行中';
      return '服务中心 · 8类服务 · 3条新消息';
    })();
    const strip = document.createElement('aside');
    strip.className = 'ep-demo-strip';
    strip.setAttribute('aria-label', '原型演示数据');
    strip.innerHTML = `<strong>[演示数据]</strong><span>${detail}</span>`;
    main.prepend(strip);
  }

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
  addDemoStrip();
  addAccessNote();
  ensurePublishedInteractions();
  enhanceActivityCards();
  window.epAccess = { page, isLoggedIn, privatePages, publishedContentPages, openLoginDialog };
})();
