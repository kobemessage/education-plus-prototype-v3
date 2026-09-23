(()=>{
  const inferred=(location.pathname.match(/\/([A-Z]\d{2})\.html$/i)||[])[1];
  const id=String(window.EP_PAGE||inferred||'').toUpperCase();
  const pageTitles={
    R01:'来做领读员',R02:'领读课程详情',R03:'名家谈阅读',R04:'名家文章详情',R05:'读后感精选',R06:'读后感详情',R07:'共读书库',R08:'书目详情',R12:'大家一起读',R13:'学校读书会主页',
    S01:'少年派作品详情',S02:'少年派作品投稿',S03:'热门赛事详情',S04:'投稿进度',S05:'名师指导详情',S06:'成长作品档案',
    J01:'小记者作品详情',J02:'小记者采写投稿',J03:'小记者投稿进度',J04:'小记者作品档案',J05:'小记者风采',J06:'小记者风采荣誉',J07:'小记者入驻申请',J08:'小记者资格审核',
    Y01:'我的大学动态详情',Y02:'社团入驻申请',Y03:'贵州教育报主题活动',Y04:'创作发布',Y05:'我的发布',
    C01:'公益课详情',C02:'公益课直播',C03:'公益课回放',
    K01:'科学成果详情',K02:'一起来寻宝作品提交',K03:'小小发明家作品提交',K04:'我的科学港作品',K05:'编辑答疑',
    V01:'招考政策与公开数据',V02:'第三方服务接入说明',N01:'数字报精选版面',N02:'外部订阅服务说明',
    G01:'搜索结果',G02:'消息与通知',G03:'我的收藏',G04:'我的活动记录',G05:'我的投稿',G06:'个人资料',G07:'教育资讯详情'
  };
  const groups={R:['读书会','2'],S:['少年派','3'],J:['小记者','4'],Y:['致青春','5'],C:['公益课','6'],K:['科学港','7'],V:['填志愿','8'],N:['订报刊','9'],G:['我的','10']};
  const group=groups[id[0]]||['教育Plus','1'];
  const replacements=[['名师公益课','公益课'],['公益课堂','公益课'],['教育看板','致青春'],['科学追问官','编辑答疑']];
  const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
  while(node=walk.nextNode()){
    if(node.parentElement&&/^(SCRIPT|STYLE)$/.test(node.parentElement.tagName))continue;
    let text=node.nodeValue;
    for(const [from,to] of replacements)text=text.split(from).join(to);
    if(/^[JK]/.test(id))text=text.replaceAll('研学手记','探访记录').replaceAll('线下打卡','线下记录');
    node.nodeValue=text;
  }

  document.querySelectorAll('main h1').forEach(heading=>{
    const replacement=document.createElement('h2');
    [...heading.attributes].forEach(attribute=>replacement.setAttribute(attribute.name,attribute.value));
    replacement.innerHTML=heading.innerHTML;
    heading.replaceWith(replacement);
  });

  const isNativeV3=Boolean(document.querySelector('body > .v3-top,body > header.v3-top'));
  if(!isNativeV3&&id){
    document.body.classList.add('v3-legacy-unified');
    const oldHeader=document.querySelector('body > header');
    if(oldHeader)oldHeader.classList.add('ep-legacy-header');
    const main=document.querySelector('main');
    if(main)main.classList.add('ep-unified-main');
    const header=document.createElement('header');
    header.className='v3-top ep-unified-top';
    header.innerHTML=`<button class="v3-back" type="button" aria-label="返回${group[0]}"><span class="material-symbols-outlined">arrow_back_ios_new</span></button><div class="v3-top-copy"><h1>${pageTitles[id]||group[0]}</h1><p>${group[0]} · 教育Plus V3.0</p></div><span class="v3-badge">演示数据</span>`;
    header.querySelector('button').addEventListener('click',()=>window.epGo?window.epGo(group[1]):history.back());
    document.body.prepend(header);
  }

  document.querySelectorAll('main button[aria-label^="返回"],main a[aria-label^="返回"]').forEach(control=>control.classList.add('ep-inner-back'));
  const duplicateTitles={G03:'我的收藏',G04:'我的活动记录',R03:'名家谈阅读',R05:'读后感精选'};
  if(duplicateTitles[id]){
    document.querySelectorAll('main h1,main h2,main h3,main span,main div').forEach(element=>{
      if(element.children.length===0&&(element.textContent||'').trim()===duplicateTitles[id]&&element.getBoundingClientRect().top<280){
        element.classList.add('ep-duplicate-title');
      }
    });
  }

  if(/^R/.test(id)){
    const readingWalk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let readingNode;
    while(readingNode=readingWalk.nextNode()){
      if(readingNode.parentElement&&/^(SCRIPT|STYLE)$/.test(readingNode.parentElement.tagName))continue;
      readingNode.nodeValue=readingNode.nodeValue.replaceAll('阅读打卡','共读记录').replaceAll('积分排行','精选展示').replaceAll('阅读积分','成长记录');
    }
    document.querySelectorAll('[onclick*="openCheckinModal"],#checkinModal').forEach(el=>el.hidden=true);
  }

  const removedRoutes=['R09','R10','R11','N03','N04','N05','G08'];
  document.querySelectorAll('[onclick],[data-ep-route],a[href]').forEach(el=>{
    const source=[el.getAttribute('onclick'),el.dataset.epRoute,el.getAttribute('href')].filter(Boolean).join(' ');
    if(removedRoutes.some(route=>source.includes(route)))el.hidden=true;
  });

  const hiddenPhrases=/^S/.test(id)?['评论区','全部评论','发表评论']:id==='G03'?['采风活动','科学港实践']:[];
  hiddenPhrases.forEach(phrase=>{
    document.querySelectorAll('body *').forEach(el=>{
      if(el.closest('.ep-access-note,#ep-login-dialog,#ep-access-gate'))return;
      if(el.children.length===0&&(el.textContent||'').includes(phrase)){
        const block=el.closest('article,[class*="card"],a,button')||el;
        block.hidden=true;
      }
    });
  });

  document.querySelectorAll('button,a,[role="button"]').forEach(control=>{
    if(!control.hasAttribute('aria-label')){
      const label=(control.textContent||'').replace(/\s+/g,' ').trim();
      if(label)control.setAttribute('aria-label',label.slice(0,80));
    }
  });
  document.querySelectorAll('input:not([type="hidden"]),select,textarea').forEach(control=>{
    if(control.getAttribute('aria-label')||control.getAttribute('aria-labelledby'))return;
    if(control.id&&document.querySelector(`label[for="${CSS.escape(control.id)}"]`))return;
    const wrapped=control.closest('label');
    const group=control.closest('.form-group,.v3-field');
    const label=wrapped||group?.querySelector('label');
    const accessibleName=((label?.textContent||control.placeholder||control.name||'表单字段').replace(/\s+/g,' ').trim()).slice(0,80);
    control.setAttribute('aria-label',accessibleName);
  });
})();
