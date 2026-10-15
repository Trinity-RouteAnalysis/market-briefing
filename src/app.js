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

// 지역 탭: 그 지역 노선 변경(전체 탭의 목록에서 data-rg 로 골라) 붙이기
const CAT={new:'신규취항',inc:'증편',re:'재개',dec:'감편',sus:'운휴',end:'단항'};
document.querySelectorAll('main[data-week]').forEach(main=>{
  const all=main.querySelector('.regpanel[data-all]'); if(!all) return;
  main.querySelectorAll('.regpanel:not([data-all])').forEach(p=>{
    const rg=p.id.split('-r-')[1];
    const trend=p.querySelector('ul'); if(trend){const h=document.createElement('h4');h.className='rg-h';h.textContent='동향';p.insertBefore(h,trend);}
    const box=document.createElement('div'); box.className='rg-chg'; let n=0, chips='', groups='';
    Object.entries(CAT).forEach(([k,label])=>{
      const items=[...all.querySelectorAll('.acc[id$="-'+k+'"] li')].filter(li=>(li.dataset.rg||'').split(' ').includes(rg));
      if(!items.length) return; n+=items.length;
      const cls=(k==='dec'||k==='sus'||k==='end')?'down':'new';
      chips+='<span class="rg-chip '+cls+'">'+label+' <b>'+items.length+'</b></span>';
      groups+='<div class="rg-grp"><div class="rg-gh">'+label+' '+items.length+'건</div><ul>'+items.map(li=>'<li>'+li.innerHTML+'</li>').join('')+'</ul></div>';
    });
    box.innerHTML='<h4 class="rg-h">노선 변경 '+n+'건</h4>'+(n?'<div class="rg-chips">'+chips+'</div>'+groups:'<p class="none">이번 주 이 지역 노선 변경 없음</p>');
    p.appendChild(box);
  });
});
