let menuY = 0;
let scrollY = 0;
window.addEventListener('scroll', function () {
  const el = document.querySelector('.form__container');
  const height = el.offsetHeight;
  const pos = window.pageYOffset;
  const diff = scrollY - pos;

  menuY = Math.min(0, Math.max(-height, menuY + diff));
  el.style.position =
    pos >= height ? 'fixed' : pos === 0 ? 'absolute' : el.style.position;
  el.style.transform = `translateY(${
    el.style.position === 'fixed' ? menuY : 0
  }px)`;

  scrollY = pos;
});
