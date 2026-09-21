(()=>{
  const id=String(window.EP_PAGE||'');
  const replacements=[['科学追问官','小小发明家']];
  const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=walk.nextNode()){if(n.parentElement&&/^(SCRIPT|STYLE)$/.test(n.parentElement.tagName))continue;let s=n.nodeValue;for(const [a,b] of replacements)s=s.split(a).join(b);n.nodeValue=s}
  const mark=document.createElement('div');mark.className='v3-global-mark';mark.textContent='[演示数据] · V3.0 原型';document.body.append(mark);
  if(/^R/.test(id)){
    const readingWalk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let readingNode;
    while(readingNode=readingWalk.nextNode()){
      if(readingNode.parentElement&&/^(SCRIPT|STYLE)$/.test(readingNode.parentElement.tagName))continue;
      readingNode.nodeValue=readingNode.nodeValue.replaceAll('打卡','共读记录').replaceAll('积分','成长记录').replaceAll('排行榜','精选展示').replaceAll('排行','精选');
    }
    document.querySelectorAll('[onclick*="openCheckinModal"],#checkinModal').forEach(el=>el.style.display='none');
  }
  const banned=id==='1'?['读书会打卡与共读进度','向科学家提出真实问题']:id==='2'?['阅读打卡','阅读积分','阅读排行']:id==='3'||/^S/.test(id)?['评论区','全部评论','发表评论']:id==='10'?['阅读积分','订单与发票','科学港投稿与提问']:id==='11'?['阅读打卡','科学提问','报刊发票']:[];
  for(const phrase of banned){
    for(const el of [...document.querySelectorAll('body *')]){if(el.children.length===0&&el.textContent.trim().includes(phrase)){const box=el.closest('button,a,[class*="rounded"],[class*="grid"]')||el;box.style.display='none'}}
  }
  document.querySelectorAll('[onclick*="R09"],[onclick*="R10"],[onclick*="R11"],[onclick*="N03"],[onclick*="N04"],[onclick*="N05"],[onclick*="G08"]').forEach(el=>el.style.display='none');
  if(id==='4'){
    const host=document.querySelector('main>div')||document.querySelector('main');
    if(host&&!document.getElementById('v3-journalist-onboarding')){
      const section=document.createElement('section');
      section.id='v3-journalist-onboarding';
      section.className='v3-journalist-onboarding';
      section.setAttribute('aria-label','小记者入驻与资格审核');
      section.innerHTML='<div class="v3-journalist-onboarding-head"><div><span class="material-symbols-outlined">how_to_reg</span><strong>小记者入驻</strong></div><span>提交资料 · 资格审核</span></div><div class="v3-journalist-onboarding-grid"><button type="button" data-onboarding-route="J07"><span class="v3-icon"><span class="material-symbols-outlined">person_add</span></span><span><strong>申请入驻</strong><small>填写资料与学校推荐</small></span><span class="material-symbols-outlined">chevron_right</span></button><button type="button" data-onboarding-route="J08"><span class="v3-icon amber"><span class="material-symbols-outlined">fact_check</span></span><span><strong>资格审核</strong><small>查看材料核验进度</small></span><span class="material-symbols-outlined">chevron_right</span></button></div>';
      section.querySelectorAll('[data-onboarding-route]').forEach(button=>button.onclick=()=>window.epGo(button.dataset.onboardingRoute));
      host.insertBefore(section,host.children[2]||null);
    }
  }
})();
