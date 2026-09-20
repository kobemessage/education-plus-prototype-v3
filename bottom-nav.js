(() => {
  const page = String(window.EP_PAGE || document.documentElement.dataset.page || '');
  const activeRoute = page === '1' ? '1' : page === '12' ? '12' : page === '10' ? '10' : '11';
  const items = [
    ['1', '首页', '<span class="material-symbols-outlined" aria-hidden="true">home</span>'],
    ['11', '服务', '<span class="material-symbols-outlined" aria-hidden="true">apps</span>'],
    ['12', '活动', '<span class="material-symbols-outlined" aria-hidden="true">event</span>'],
    ['10', '我的', '<span class="material-symbols-outlined" aria-hidden="true">person</span>']
  ];

  const labels = ['首页', '书会', '读书会', '少年派', '小记者', '教育看板', '公益课堂', '科学港', '填志愿', '订报刊', '服务', '活动', '我的'];
  const iconLabels = {
    arrow_back: '返回', arrow_back_ios: '返回', arrow_back_ios_new: '返回', close: '关闭',
    more_horiz: '更多', person: '个人中心', account_circle: '个人中心', notifications: '消息通知',
    share: '分享', favorite: '点赞', favorite_border: '点赞', bookmark: '收藏', bookmark_border: '收藏',
    search: '搜索', tune: '筛选', fullscreen: '全屏', volume_up: '音量', play_arrow: '播放',
    chevron_right: '查看详情', expand_more: '展开详情', download: '保存', delete: '删除'
  };

  const demoText = (() => {
    if (page === '1') return '8个服务入口 · 2项内容更新';
    if (page === '2' || page.startsWith('R')) return '3条内容主线 · 8个阅读页面';
    if (page === '3' || page.startsWith('S')) return '6篇成长作品 · 2篇编辑精选';
    if (page === '4' || page.startsWith('J')) return '资格审核中 · 2条投稿记录';
    if (page === '5' || page.startsWith('Y')) return '3条校园内容 · 1条审核中';
    if (page === '6' || page.startsWith('C')) return '4节公益课 · 直播与回放演示';
    if (page === '7' || page.startsWith('K')) return '2条科普作品 · 1条探访记录';
    if (page === '8' || page.startsWith('V')) return '公开信息 · 第三方服务待接入';
    if (page === '9' || page.startsWith('N')) return '数字报预览 · 外部订阅待接入';
    if (page === '10') return '个人中心 · 2项进行中 · 5条成长记录';
    if (page === '12') return '全省活动 · 5项演示 · 2项进行中';
    return '服务中心 · 8类服务 · 3条新消息';
  })();

  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('alt')) img.alt = img.dataset.alt || '';
  });
  document.querySelectorAll('button,a,[role="button"]').forEach(control => {
    if (control.getAttribute('aria-label') || control.getAttribute('title')) return;
    const text = (control.textContent || '').replace(/\s+/g, ' ').trim();
    const icon = control.querySelector('.material-symbols-outlined');
    const iconName = (icon?.textContent || '').trim();
    if (text && text !== iconName) return;
    control.setAttribute('aria-label', iconLabels[iconName] || '操作');
  });
  const isLegacyNav = nav => {
    const text = (nav.textContent || '').replace(/\s+/g, '');
    const count = labels.filter(label => text.includes(label)).length;
    const cls = String(nav.className || '');
    const knownBottomNav = nav.id === 'ep-nav' || /(^|\s)(science-nav|bottomnav|tabbar)(\s|$)/.test(cls);
    return knownBottomNav || (count >= 3 && nav.querySelectorAll('button,a').length >= 4);
  };

  document.querySelectorAll('nav').forEach(nav => {
    if (!isLegacyNav(nav)) return;
    let target = nav;
    const parent = nav.parentElement;
    if (parent && /(^|\s)(fixed|tabbar|bottom-nav)(\s|$)/.test(parent.className || '') && /bottom-0|tabbar|bottom-nav/.test(parent.className || '')) {
      target = parent;
    }
    target.classList.add('ep-nav-legacy');
    target.setAttribute('aria-hidden', 'true');
  });

  document.querySelectorAll('body > footer, body > div, main > footer, main > div').forEach(el => {
    const cls = String(el.className || '');
    if (el.classList.contains('ep-nav-legacy')) return;
    if ((cls.includes('fixed') || cls.includes('sticky')) && cls.includes('bottom-0')) {
      el.classList.add('ep-bottom-action');
      document.body.classList.add('ep-has-bottom-action');
    }
  });

  const style = document.createElement('style');
  style.id = 'ep-global-nav-style';
  style.textContent = `
    .ep-nav-legacy{display:none!important}
    html body{padding-bottom:calc(84px + env(safe-area-inset-bottom,0px))!important}
    html body.ep-has-bottom-action{padding-bottom:calc(152px + env(safe-area-inset-bottom,0px))!important}
    .ep-bottom-action{bottom:76px!important}
    #ep-global-nav{position:fixed!important;left:0!important;right:0!important;bottom:0!important;z-index:9998!important;height:calc(76px + env(safe-area-inset-bottom,0px))!important;padding:0 10px env(safe-area-inset-bottom,0px)!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;align-items:stretch!important;background:#fff!important;border-top:1px solid #edf2f0!important;box-shadow:0 -4px 18px rgba(24,62,52,.045)!important;font-family:"PingFang SC","Microsoft YaHei",-apple-system,sans-serif!important}
    #ep-global-nav button{appearance:none!important;border:0!important;background:transparent!important;margin:0!important;padding:8px 2px 7px!important;min-width:0!important;min-height:68px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:5px!important;color:#879a94!important;font:600 14px/1.1 "PingFang SC","Microsoft YaHei",-apple-system,sans-serif!important;letter-spacing:0!important;box-shadow:none!important;border-radius:0!important;transform:none!important}
    #ep-global-nav button:active{background:#f4f8f6!important}
    #ep-global-nav button:focus-visible{outline:3px solid #efbd23!important;outline-offset:-3px!important}
    #ep-global-nav .material-symbols-outlined{display:block!important;font-size:27px!important;line-height:1!important;font-variation-settings:'FILL' 0,'wght' 420,'GRAD' 0,'opsz' 24!important;flex:none!important}
    #ep-global-nav button[data-active="true"]{color:#087f73!important;font-weight:700!important}
    #ep-global-nav button[data-active="true"] .material-symbols-outlined{font-variation-settings:'FILL' 1,'wght' 520,'GRAD' 0,'opsz' 24!important}
    .ep-demo-strip{box-sizing:border-box!important;margin:8px 16px 12px!important;padding:9px 12px!important;display:flex!important;align-items:center!important;gap:8px!important;min-height:38px!important;border:1px solid #dcebe5!important;border-radius:12px!important;background:#f2faf7!important;color:#526a63!important;font:500 12px/1.45 "PingFang SC","Microsoft YaHei",-apple-system,sans-serif!important;box-shadow:none!important}
    .ep-demo-strip strong{flex:none!important;padding:2px 6px!important;border-radius:5px!important;background:#dff3ec!important;color:#087f73!important;font-weight:700!important}
    .ep-demo-strip span{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    @media(max-width:360px){#ep-global-nav button{font-size:13px!important}#ep-global-nav .material-symbols-outlined{font-size:25px!important}}
  `;
  document.head.append(style);

  const main = document.querySelector('main');
  if (main && !main.querySelector('.ep-demo-strip')) {
    const strip = document.createElement('aside');
    strip.className = 'ep-demo-strip';
    strip.setAttribute('aria-label', '原型演示数据');
    strip.innerHTML = `<strong>[演示数据]</strong><span>${demoText}</span>`;
    main.prepend(strip);
  }

  const nav = document.createElement('nav');
  nav.id = 'ep-global-nav';
  nav.setAttribute('aria-label', '全局底部导航');
  items.forEach(([route, label, icon]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.epRoute = route;
    button.dataset.active = String(route === activeRoute);
    if (route === activeRoute) button.setAttribute('aria-current', 'page');
    button.setAttribute('aria-label', label);
    button.innerHTML = icon + `<span>${label}</span>`;
    nav.append(button);
  });
  nav.addEventListener('click', event => {
    const button = event.target.closest('button[data-ep-route]');
    if (!button) return;
    const route = button.dataset.epRoute;
    if (typeof window.epGo === 'function') {
      window.epGo(route);
      return;
    }
    if (parent !== window) {
      parent.postMessage({educationPlusRoute: route}, location.origin === 'null' ? '*' : location.origin);
      return;
    }
    const prefix = location.pathname.includes('/stitch/') ? '../' : '';
    location.href = prefix + 'index.html#' + route;
  });
  document.body.append(nav);
  document.body.classList.add('ep-global-nav-ready');
})();
