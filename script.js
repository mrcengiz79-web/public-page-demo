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
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); if(menu.classList.contains('show')) menu.classList.remove('show'); }
  });
});
