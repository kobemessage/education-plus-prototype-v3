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
    'R04', 'R06', 'S01', 'S05', 'J01', 'J05', 'Y01', 'Y03',
    'C01', 'C03', 'K01', 'K05', 'N01', 'G07'
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
    .ep-published-actions small{display:block;margin-top:9px;color:#71877f;font:500 11px/1.45 "PingFang SC","Microsoft YaHei",-apple-system,sans-serif;text-align:center}
    #ep-login-dialog{position:fixed;inset:0;z-index:10050;display:flex;align-items:flex-end;justify-content:center;padding:16px;background:rgba(9,35,29,.48);backdrop-filter:blur(3px)}
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
    .ep-access-toast{position:fixed;left:50%;bottom:96px;z-index:10060;max-width:calc(100vw - 40px);padding:10px 16px;border-radius:999px;background:#183e34;color:#fff;font:600 13px/1.4 "PingFang SC","Microsoft YaHei",-apple-system,sans-serif;box-shadow:0 8px 22px rgba(8,36,30,.2);transform:translate(-50%,12px);opacity:0;pointer-events:none;transition:.2s}
    .ep-access-toast.show{transform:translate(-50%,0);opacity:1}
    @media(max-width:360px){.ep-access-note{font-size:11px}.ep-published-actions button,.ep-action-added{font-size:12px;padding:0 7px}}
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
    if (privatePages.has(page)) {
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

  function ensurePublishedInteractions() {
    if (!publishedContentPages.has(page)) return;
    const main = document.querySelector('main');
    if (!main) return;
    const existing = new Set();
    const existingControls = [];
    main.querySelectorAll('button,a,[role="button"]').forEach(control => {
      const type = controlActionType(control);
      if (type) {
        existing.add(type);
        existingControls.push(control);
      }
    });
    const missing = ['like', 'favorite', 'share'].filter(type => !existing.has(type));
    if (!missing.length) return;

    const labels = {
      like: ['♡', '点赞'],
      favorite: ['☆', '收藏'],
      share: ['↗', '分享']
    };
    const candidates = [...main.querySelectorAll('.actions,.v3-actions,.article-actions,[aria-label*="文章操作"],[aria-label*="互动"]')];
    const target = candidates.find(container => container.querySelector('button,a')) || existingControls[0]?.parentElement;
    if (target) {
      missing.forEach(type => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ep-action-added';
        button.dataset.epAction = type;
        button.setAttribute('aria-label', labels[type][1]);
        button.textContent = labels[type].join(' ');
        target.append(button);
      });
      return;
    }

    const section = document.createElement('section');
    section.className = 'ep-published-actions';
    section.setAttribute('aria-label', '作品互动');
    section.innerHTML = `<div>${['like', 'favorite', 'share'].map(type => `<button type="button" data-ep-action="${type}" aria-label="${labels[type][1]}"><span aria-hidden="true">${labels[type][0]}</span>${labels[type][1]}</button>`).join('')}</div><small>作品正文可免登录阅读；分享无需登录，点赞与收藏登录后记录</small>`;
    main.append(section);
  }

  function isProtectedAction(label, control) {
    if (control.closest('#ep-login-dialog,#ep-access-gate')) return false;
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
    if (type === 'share') {
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
  window.epAccess = { page, isLoggedIn, privatePages, publishedContentPages, openLoginDialog };
})();
