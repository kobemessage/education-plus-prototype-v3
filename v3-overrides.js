(()=>{
  const id=String(window.EP_PAGE||'');
  const replacements=[['致青春','教育看板'],['名师公益课','公益课堂'],['公益课','公益课堂'],['科学追问官','小小发明家']];
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
    if(host&&!document.getElementById('v3-journalist-apply')){const a=document.createElement('button');a.id='v3-journalist-apply';a.className='w-full rounded-xl p-4 bg-white shadow-sm text-left flex items-center gap-3';a.innerHTML='<span class="material-symbols-outlined text-primary">how_to_reg</span><span class="flex-1"><b class="block">小记者资格申请</b><small class="text-outline">独立审核 · 需学校盖章推荐材料</small></span><span class="material-symbols-outlined text-primary">chevron_right</span>';a.onclick=()=>window.epGo('J07');host.insertBefore(a,host.children[2]||null)}
  }
})();
