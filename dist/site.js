const video = document.querySelector('.hero-media video');
const control = document.querySelector('.play');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
if (video && control && video.querySelector('source')) {
  control.hidden = false;
  const syncControl = () => { control.textContent = video.paused ? 'Play video' : 'Pause video'; };
  const play = () => video.play().catch(syncControl);
  video.addEventListener('play', syncControl);
  video.addEventListener('pause', syncControl);
  control.addEventListener('click', () => video.paused ? play() : video.pause());
  motion.addEventListener('change', () => motion.matches ? video.pause() : play());
  if (!motion.matches) play();
}
if (!motion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      entry.target.classList.add('reveal');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.catalog img').forEach((photo, index) => {
    photo.style.setProperty('--delay', matchMedia('(min-width: 761px)').matches ? index * 75 + 'ms' : '0ms');
    observer.observe(photo);
  });
}
const form = document.querySelector('#quote');
if (form) {
  const product = new URLSearchParams(location.search).get('product');
  const productField = form.elements.namedItem('product');
  if ([...productField.options].some(option => option.value === product)) productField.value = product;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(form);
    const labels = {company:'Company',email:'Work email',product:'Product',quantity:'Estimated quantity',destination:'Destination country or port',notes:'Notes'};
    const lines = Object.entries(labels).map(([key, label]) => label + ': ' + fields.get(key).trim());
    const message = ['MARA BUSINESS — quote request', '', ...lines].join('\n');
    const whatsapp = new URL('https://wa.me/255651728851');
    whatsapp.searchParams.set('text', message);
    window.location.assign(whatsapp.href);
  });
}
