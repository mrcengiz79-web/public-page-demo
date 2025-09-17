// Mobil menü
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
if (toggle) {
  toggle.addEventListener('click', ()=> menu.classList.toggle('show'));
}

// Yıl
document.getElementById('yil').textContent = new Date().getFullYear();

// Yumuşak kaydırma
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth'});
      if(menu.classList.contains('show')) menu.classList.remove('show');
    }
  });
});

// Aktif bölüm vurgusu
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.menu a[href^="#"]');
const mapLinks = new Map([...navLinks].map(l => [l.getAttribute('href').slice(1), l]));
if (sections.length && navLinks.length) {
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const id = entry.target.id;
      if(mapLinks.has(id)){
        if(entry.isIntersecting){
          navLinks.forEach(l=>l.classList.remove('active'));
          mapLinks.get(id).classList.add('active');
        }
      }
    });
  },{rootMargin:"-40% 0px -50% 0px", threshold:0});
  sections.forEach(s=>observer.observe(s));
}

// ---------- Lightbox (Referanslar) ----------
(function(){
  const imgs = Array.from(document.querySelectorAll('#referanslar .gallery img'));
  if (!imgs.length) return;

  const lb = document.querySelector('.lightbox');
  const lbImg = lb.querySelector('.lb-img');
  const lbCaption = lb.querySelector('.lb-caption');
  const lbCounter = lb.querySelector('.lb-counter');
  const btnPrev = lb.querySelector('.lb-prev');
  const btnNext = lb.querySelector('.lb-next');
  const btnClose = lb.querySelector('.lb-close');

  let idx = 0;

  function show(i){
    idx = (i + imgs.length) % imgs.length;
    const el = imgs[idx];
    lbImg.src = el.src;
    lbImg.alt = el.alt || '';
    lbCaption.textContent = el.alt || '';
    lbCounter.textContent = `${idx+1} / ${imgs.length}`;
    // Preload komşular
    const next = new Image(); next.src = imgs[(idx+1)%imgs.length].src;
    const prev = new Image(); prev.src = imgs[(idx-1+imgs.length)%imgs.length].src;
  }

  function open(i){
    show(i);
    lb.classList.add('show');
    document.body.classList.add('no-scroll');
    lb.setAttribute('aria-hidden','false');
  }

  function close(){
    lb.classList.remove('show');
    document.body.classList.remove('no-scroll');
    lb.setAttribute('aria-hidden','true');
  }

  // Tıklama ile aç
  imgs.forEach((el, i)=>{
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', ()=> open(i));
  });

  // Butonlar
  btnPrev.addEventListener('click', ()=> show(idx-1));
  btnNext.addEventListener('click', ()=> show(idx+1));
  btnClose.addEventListener('click', close);

  // Dışına tıklayınca kapat (sadece arka plan)
  lb.addEventListener('click', (e)=>{
    const inside = e.target.closest('.lb-inner, .lb-prev, .lb-next, .lb-close');
    if(!inside) close();
  });

  // Klavye
  window.addEventListener('keydown', (e)=>{
    if(!lb.classList.contains('show')) return;
    if(e.key === 'Escape') close();
    else if(e.key === 'ArrowLeft') show(idx-1);
    else if(e.key === 'ArrowRight') show(idx+1);
  });

  // Dokunmatik kaydırma (basit)
  let startX = null;
  lb.addEventListener('touchstart', (e)=>{
    startX = e.touches[0].clientX;
  }, {passive:true});
  lb.addEventListener('touchend', (e)=>{
    if(startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 50){
      if(dx < 0) show(idx+1); else show(idx-1);
    }
    startX = null;
  });
})();
