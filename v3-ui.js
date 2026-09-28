window.v3Go=function(route){if(parent!==window)parent.postMessage({educationPlusRoute:String(route)},location.origin);else location.href=(/^[A-Z]/.test(String(window.EP_PAGE||''))?'../':'')+'index.html#'+route};
window.v3Toast=function(message){let t=document.querySelector('.v3-toast');if(!t){t=document.createElement('div');t.className='v3-toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');document.body.append(t)}t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)};
window.v3Submit=function(form,message){if(!form.reportValidity())return false;const btn=form.querySelector('button[type="submit"]');btn.disabled=true;btn.setAttribute('aria-busy','true');const old=btn.textContent;btn.textContent='处理中…';setTimeout(()=>{btn.disabled=false;btn.removeAttribute('aria-busy');btn.textContent=old;v3Toast(message||'提交成功，已进入审核流程（演示）')},650);return false};
window.v3SelectJournalistProof=function(){const field=document.getElementById('journalistProof');const label=document.getElementById('journalistProofLabel');if(field)field.value='selected';if(label)label.innerHTML='<strong>学校推荐材料已选择（选填）</strong><br><small>演示文件：学校推荐表.pdf</small>';v3Toast('已选择学校推荐材料（演示）')};
const V3_JOURNALIST_VALIDITY_DAYS=365;
function v3AddDays(timestamp,days){const date=new Date(timestamp);date.setDate(date.getDate()+days);return date.getTime()}
function v3FormatDate(timestamp){if(!timestamp)return'—';return new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(timestamp)).replaceAll('/','-')}
function v3EnsureJournalistValidity(application){if(!application||application.status!=='approved')return application;application.approvedAt=application.approvedAt||application.submittedAt||Date.now();application.validUntil=application.validUntil||v3AddDays(application.approvedAt,V3_JOURNALIST_VALIDITY_DAYS);application.validityYears=1;return application}
window.v3SubmitJournalist=function(event){event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return false;const btn=form.querySelector('button[type="submit"]');btn.disabled=true;btn.textContent='正在提交…';const profile={studentName:document.getElementById('journalistStudentName')?.value||'',school:document.getElementById('journalistSchool')?.value||'',grade:document.getElementById('journalistGrade')?.value||'',guardian:document.getElementById('journalistGuardian')?.value||'',phone:document.getElementById('journalistPhone')?.value||'',status:'pending',submittedAt:Date.now(),validityYears:1};localStorage.setItem('ep-journalist-onboarding',JSON.stringify(profile));localStorage.setItem('ep-v3-reporter-status','pending');setTimeout(()=>{btn.disabled=false;btn.textContent='已提交，查看注册状态';v3Toast('注册申请已提交，等待后台审核（演示）');v3Go('J08')},650);return false};
window.v3LoadJournalistReview=function(){const reviewing=document.getElementById('journalistReviewing');const empty=document.getElementById('journalistReviewEmpty');const status=document.getElementById('journalistReviewStatus');if(!reviewing||!empty)return;let application=null;try{application=JSON.parse(localStorage.getItem('ep-journalist-onboarding')||'null')}catch{}const reporterStatus=localStorage.getItem('ep-v3-reporter-status')||application?.status||'';const hasApplication=Boolean(application)||['pending','approved'].includes(reporterStatus);const approved=reporterStatus==='approved';if(approved&&application){application.status='approved';application=v3EnsureJournalistValidity(application);localStorage.setItem('ep-journalist-onboarding',JSON.stringify(application))}reviewing.hidden=!hasApplication;empty.hidden=hasApplication;if(status)status.textContent=!hasApplication?'待提交申请':approved?'注册已通过':'注册审核中';const title=document.getElementById('journalistReviewTitle');const copy=document.getElementById('journalistReviewCopy');const badge=document.getElementById('journalistReviewBadge');const approve=document.getElementById('journalistApproveDemo');const submit=document.getElementById('journalistSubmitButton');const validity=document.getElementById('journalistValidityPanel');if(title)title.textContent=approved?'注册已通过':'资料待审核';if(copy)copy.textContent=approved?'注册有效期为一年，现在可以使用在线投稿、投稿进度和个人作品档案。':'申请已提交，请留意处理状态变化。';if(badge){badge.textContent=approved?'已通过':'待审核';badge.classList.toggle('amber',!approved)}if(approve)approve.hidden=approved;if(submit)submit.hidden=!approved;if(validity){validity.hidden=!approved;const start=document.getElementById('journalistValidityStart');const end=document.getElementById('journalistValidityEnd');if(start)start.textContent=v3FormatDate(application?.approvedAt);if(end)end.textContent=v3FormatDate(application?.validUntil)}};
window.v3LoadJournalistDemo=function(route){const now=Date.now();const approvedAt=now-86400000*30;const profile={studentName:'林奕辰',school:'贵阳某小学',grade:'小学五年级',guardian:'林女士',phone:'13800000000',status:'approved',submittedAt:approvedAt,approvedAt,validUntil:v3AddDays(approvedAt,V3_JOURNALIST_VALIDITY_DAYS),validityYears:1,demo:true};localStorage.setItem('ep-v3-authenticated','1');localStorage.setItem('ep-v3-reporter-status','approved');localStorage.setItem('ep-journalist-onboarding',JSON.stringify(profile));localStorage.setItem('ep-journalist-submission',JSON.stringify({title:'校园图书角的一天',category:'校园新闻',status:'待审核',time:now-86400000,demo:true}));localStorage.setItem('ep-journalist-demo-loaded','1');v3Toast('测试小记者数据已载入，可体验全部功能');setTimeout(()=>v3Go(route||'4'),500)};
window.v3ApproveJournalistDemo=function(){localStorage.setItem('ep-v3-reporter-status','approved');let application={};try{application=JSON.parse(localStorage.getItem('ep-journalist-onboarding')||'{}')}catch{}application.status='approved';application.approvedAt=Date.now();application.validUntil=v3AddDays(application.approvedAt,V3_JOURNALIST_VALIDITY_DAYS);application.validityYears=1;localStorage.setItem('ep-journalist-onboarding',JSON.stringify(application));v3Toast('已审核通过，有效期一年（演示）');window.v3LoadJournalistReview()};
window.v3SearchCourses=function(input){const query=input.value.trim().toLocaleLowerCase('zh-CN');const courses=[...document.querySelectorAll('[data-course-search]')];let visible=0;for(const course of courses){const source=(course.dataset.courseSearch+' '+course.textContent).toLocaleLowerCase('zh-CN');const match=!query||source.includes(query);course.hidden=!match;if(match)visible++}const count=document.getElementById('courseSearchCount');if(count)count.textContent=query?`找到 ${visible} 门课程`:`共 ${courses.length} 门演示课程`;const empty=document.getElementById('courseSearchEmpty');if(empty)empty.hidden=visible!==0;const clear=document.getElementById('courseSearchClear');if(clear)clear.hidden=!query};
window.v3ClearCourseSearch=function(){const input=document.getElementById('courseSearch');if(!input)return;input.value='';v3SearchCourses(input);input.focus()};
const V3_PUBLIC_COURSES={
  math:{name:'高考数学函数与导数核心方法',subject:'高中数学',school:'贵州师范大学附属中学',schoolCopy:'学校长期开展优质课程共建与教育资源共享，本课程由高中数学教研组参与设计。',teacher:'王明远老师',teacherTitle:'高中数学高级教师',teacherCopy:'长期从事高中数学教学与高考专题研究，擅长用图像和问题链讲清函数与导数。',replay:'函数与导数专题课'},
  physics:{name:'新课标初中物理实验方法',subject:'初中物理',school:'贵阳市实验中学',schoolCopy:'学校重视科学实验与探究式学习，本课程由物理教研组结合新课标共同设计。',teacher:'陈国华老师',teacherTitle:'初中物理骨干教师',teacherCopy:'关注实验探究和生活化教学，善于通过可观察现象帮助学生建立物理概念。',replay:'物理实验方法专题课'},
  family:{name:'如何陪伴青春期孩子成长',subject:'家庭教育',school:'贵州省家庭教育指导中心',schoolCopy:'中心面向学校与家庭提供公益指导服务，本课程聚焦青春期亲子沟通的常见场景。',teacher:'周晓岚老师',teacherTitle:'家庭教育指导教师',teacherCopy:'持续开展家校沟通与家庭教育辅导，注重提供可执行的沟通方法和陪伴建议。',replay:'青春期家庭沟通公益课'}
};
window.v3SelectPublicCourse=function(courseId,route){const selected=V3_PUBLIC_COURSES[courseId]||V3_PUBLIC_COURSES.math;localStorage.setItem('ep-public-course-selection',courseId in V3_PUBLIC_COURSES?courseId:'math');localStorage.setItem('ep-public-course-name',selected.name);v3Go(route||'C04')};
window.v3LoadPublicCourseJourney=function(){const courseId=localStorage.getItem('ep-public-course-selection')||'math';const course=V3_PUBLIC_COURSES[courseId]||V3_PUBLIC_COURSES.math;document.querySelectorAll('[data-course-name]').forEach(node=>node.textContent=course.name);document.querySelectorAll('[data-course-subject]').forEach(node=>node.textContent=course.subject);document.querySelectorAll('[data-course-school]').forEach(node=>node.textContent=course.school);document.querySelectorAll('[data-course-school-copy]').forEach(node=>node.textContent=course.schoolCopy);document.querySelectorAll('[data-course-teacher]').forEach(node=>node.textContent=course.teacher);document.querySelectorAll('[data-course-teacher-title]').forEach(node=>node.textContent=course.teacherTitle);document.querySelectorAll('[data-course-teacher-copy]').forEach(node=>node.textContent=course.teacherCopy);document.querySelectorAll('[data-course-replay]').forEach(node=>node.textContent=course.replay)};
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
