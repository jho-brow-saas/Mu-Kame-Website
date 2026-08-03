(function(){
  var s=document.getElementById('fakeSearch');
  if(s){s.onkeydown=function(e){e=e||window.event;if(e.keyCode===13){window.location='rankings.php';return false;}};}
  function byId(id){return document.getElementById(id);}
  function openModal(id){var m=byId(id);if(!m)return;m.className='modal-backdrop open';m.setAttribute('aria-hidden','false');document.body.className=document.body.className+' modal-open';}
  function closeModal(m){if(!m)return;m.className='modal-backdrop';m.setAttribute('aria-hidden','true');document.body.className=document.body.className.replace(/\s*modal-open/g,'');}
  function bind(cls,fn){var els=document.getElementsByClassName(cls),i;for(i=0;i<els.length;i++){els[i].onclick=fn;}}
  bind('js-open-login',function(){openModal('loginModal');});
  bind('js-open-register',function(){openModal('registerModal');});
  bind('js-close-modal',function(){closeModal(this.parentNode.parentNode);});
  bind('js-switch-register',function(){closeModal(byId('loginModal'));openModal('registerModal');});
  bind('js-switch-login',function(){closeModal(byId('registerModal'));openModal('loginModal');});
  var backs=document.getElementsByClassName('modal-backdrop'),j;for(j=0;j<backs.length;j++){backs[j].onclick=function(e){e=e||window.event;if((e.target||e.srcElement)===this)closeModal(this);};}
  if(window.__openAuthModal==='login')openModal('loginModal');
  if(window.__openAuthModal==='register')openModal('registerModal');
})();
