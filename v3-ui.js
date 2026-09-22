window.v3Go=function(route){if(parent!==window)parent.postMessage({educationPlusRoute:String(route)},location.origin);else location.href=(/^[A-Z]/.test(String(window.EP_PAGE||''))?'../':'')+'index.html#'+route};
window.v3Toast=function(message){let t=document.querySelector('.v3-toast');if(!t){t=document.createElement('div');t.className='v3-toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');document.body.append(t)}t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)};
window.v3Submit=function(form,message){if(!form.reportValidity())return false;const btn=form.querySelector('button[type="submit"]');btn.disabled=true;btn.setAttribute('aria-busy','true');const old=btn.textContent;btn.textContent='处理中…';setTimeout(()=>{btn.disabled=false;btn.removeAttribute('aria-busy');btn.textContent=old;v3Toast(message||'提交成功，已进入审核流程（演示）')},650);return false};
window.v3SelectJournalistProof=function(){const field=document.getElementById('journalistProof');const label=document.getElementById('journalistProofLabel');if(field)field.value='selected';if(label)label.innerHTML='<strong>学校推荐材料已选择</strong><br><small>演示文件：学校推荐表.pdf</small>';v3Toast('已选择学校推荐材料（演示）')};
window.v3SubmitJournalist=function(event){event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return false;const proof=document.getElementById('journalistProof');if(!proof||proof.value!=='selected'){v3Toast('请先选择学校推荐材料（演示）');return false}const btn=form.querySelector('button[type="submit"]');btn.disabled=true;btn.textContent='正在提交…';localStorage.setItem('ep-journalist-onboarding',JSON.stringify({status:'reviewing',submittedAt:Date.now()}));setTimeout(()=>{btn.disabled=false;btn.textContent='已提交，查看资格审核';v3Toast('入驻申请已提交，进入资格审核（演示）');v3Go('J08')},650);return false};
window.v3LoadJournalistReview=function(){const reviewing=document.getElementById('journalistReviewing');const empty=document.getElementById('journalistReviewEmpty');const status=document.getElementById('journalistReviewStatus');if(!reviewing||!empty)return;let application=null;try{application=JSON.parse(localStorage.getItem('ep-journalist-onboarding')||'null')}catch{}const hasApplication=application&&application.status==='reviewing';reviewing.hidden=!hasApplication;empty.hidden=hasApplication;if(status)status.textContent=hasApplication?'资料审核中':'待提交申请'};
window.v3SearchCourses=function(input){const query=input.value.trim().toLocaleLowerCase('zh-CN');const courses=[...document.querySelectorAll('[data-course-search]')];let visible=0;for(const course of courses){const source=(course.dataset.courseSearch+' '+course.textContent).toLocaleLowerCase('zh-CN');const match=!query||source.includes(query);course.hidden=!match;if(match)visible++}const count=document.getElementById('courseSearchCount');if(count)count.textContent=query?`找到 ${visible} 门课程`:`共 ${courses.length} 门演示课程`;const empty=document.getElementById('courseSearchEmpty');if(empty)empty.hidden=visible!==0;const clear=document.getElementById('courseSearchClear');if(clear)clear.hidden=!query};
window.v3ClearCourseSearch=function(){const input=document.getElementById('courseSearch');if(!input)return;input.value='';v3SearchCourses(input);input.focus()};
function filterActivities(){const list=document.getElementById('activityList');if(!list)return;const category=document.querySelector('[data-activity-category].active')?.dataset.activityCategory||'全部';const status=document.querySelector('[data-activity-status].active')?.dataset.activityStatus||'全部';let visible=0;list.querySelectorAll('[data-category][data-status]').forEach(card=>{const match=(category==='全部'||card.dataset.category===category)&&(status==='全部'||card.dataset.status===status);card.hidden=!match;if(match)visible++});const empty=document.getElementById('activityEmpty');if(empty)empty.hidden=visible!==0}
document.addEventListener('click',event=>{const category=event.target.closest('[data-activity-category]');if(category){category.closest('.v3-tabs').querySelectorAll('[data-activity-category]').forEach(item=>item.classList.toggle('active',item===category));filterActivities();return}const status=event.target.closest('[data-activity-status]');if(status){status.closest('.v3-status-filter').querySelectorAll('[data-activity-status]').forEach(item=>item.classList.toggle('active',item===status));filterActivities();return}const tab=event.target.closest('.v3-tab');if(!tab)return;const group=tab.closest('.v3-tabs');group.querySelectorAll('.v3-tab').forEach(item=>item.classList.toggle('active',item===tab));v3Toast(`已切换至“${tab.textContent.trim()}”（演示）`)});
document.addEventListener('invalid',event=>{const field=event.target;if(!field.matches('input,select,textarea'))return;field.setAttribute('aria-invalid','true');let error=field.parentElement.querySelector('.v3-field-error');if(!error){error=document.createElement('div');error.className='v3-field-error';error.setAttribute('role','alert');field.insertAdjacentElement('afterend',error)}error.textContent=field.validationMessage||'请完整填写此项'},true);
document.addEventListener('input',event=>{const field=event.target;if(!field.matches('input,select,textarea'))return;if(field.checkValidity()){field.removeAttribute('aria-invalid');const error=field.parentElement.querySelector('.v3-field-error');if(error)error.remove()}});
if(String(window.EP_PAGE||'')==='J08')window.v3LoadJournalistReview();

let v3ServiceSheetOpener=null;
window.v3OpenServiceSheet=function(opener){
  const sheet=document.getElementById('serviceSubmissionSheet');
  if(!sheet)return;
  v3ServiceSheetOpener=opener||document.activeElement;
  sheet.hidden=false;
  document.body.classList.add('v3-sheet-open');
  requestAnimationFrame(()=>sheet.querySelector('.v3-service-sheet-close')?.focus());
};
window.v3CloseServiceSheet=function(){
  const sheet=document.getElementById('serviceSubmissionSheet');
  if(!sheet||sheet.hidden)return;
  sheet.hidden=true;
  document.body.classList.remove('v3-sheet-open');
  if(v3ServiceSheetOpener&&typeof v3ServiceSheetOpener.focus==='function')v3ServiceSheetOpener.focus();
};
window.v3FilterServices=function(input){
  const query=(input?.value||'').trim().toLocaleLowerCase('zh-CN');
  const items=[...document.querySelectorAll('[data-service-item]')];
  let visible=0;
  items.forEach(item=>{
    const source=`${item.dataset.serviceSearch||''} ${item.textContent||''}`.toLocaleLowerCase('zh-CN');
    const match=!query||source.includes(query);
    item.hidden=!match;
    if(match)visible++;
  });
  document.querySelectorAll('[data-service-group]').forEach(group=>{
    group.hidden=![...group.querySelectorAll('[data-service-item]')].some(item=>!item.hidden);
  });
  const count=document.getElementById('serviceSearchCount');
  if(count)count.textContent=query?`找到 ${visible} 项服务`:`共 ${items.length} 项服务`;
  const empty=document.getElementById('serviceSearchEmpty');
  if(empty)empty.hidden=visible!==0;
  const clear=document.getElementById('serviceSearchClear');
  if(clear)clear.hidden=!query;
};
window.v3ClearServiceSearch=function(){
  const input=document.getElementById('serviceSearch');
  if(!input)return;
  input.value='';
  v3FilterServices(input);
  input.focus();
};
document.addEventListener('click',event=>{
  if(event.target.closest('[data-service-sheet-close]'))v3CloseServiceSheet();
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!document.getElementById('serviceSubmissionSheet')?.hidden)v3CloseServiceSheet();
});
