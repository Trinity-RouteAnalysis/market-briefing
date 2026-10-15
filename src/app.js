// week switching (주차 수와 무관)
document.querySelectorAll('.weekpill').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.weekpill').forEach(b=>b.classList.toggle('active',b===btn));
    document.querySelectorAll('main[data-week]').forEach(m=>m.hidden=(m.dataset.week!==btn.dataset.week));
    window.scrollTo({top:0,behavior:'smooth'});
  });
});
// accordion toggle (click head or stat card)
document.querySelectorAll('.acc-head').forEach(h=>{
  h.addEventListener('click',()=>h.parentElement.classList.toggle('open'));
});
document.querySelectorAll('.stat[data-acc]').forEach(s=>{
  s.addEventListener('click',()=>{
    const t=document.getElementById(s.dataset.acc);
    t.classList.toggle('open');
    t.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
});
// region tabs
document.querySelectorAll('.regtabs').forEach(tabs=>{
  const scope=tabs.dataset.reg;
  tabs.querySelectorAll('.regtab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      tabs.querySelectorAll('.regtab').forEach(b=>b.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.regpanel[id^="'+scope+'-r-"]').forEach(p=>p.classList.remove('active'));
      document.getElementById(tab.dataset.r).classList.add('active');
    });
  });
});
