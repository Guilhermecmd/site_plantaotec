/* Year */
document.getElementById('y').textContent = new Date().getFullYear();

/* Sticky nav state */
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* Mobile menu */
const burger = document.getElementById('hamburger');
const panel = document.getElementById('mobilePanel');
const toggleMenu = (open) => {
  const isOpen = open ?? !panel.classList.contains('open');
  panel.classList.toggle('open', isOpen);
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  panel.setAttribute('aria-hidden', String(!isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
};
burger.addEventListener('click', () => toggleMenu());
panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && panel.classList.contains('open')) toggleMenu(false);
});

/* Reveal on scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('visible');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* Phone mask BR + Form submit -> WhatsApp handoff */
const phone = document.getElementById('f-tel');
const form = document.getElementById('leadForm');
const fb = document.getElementById('formFeedback');
if (phone && form && fb) {
  const showFb = (type, msg) => {
    fb.classList.remove('ok', 'err');
    fb.classList.add('form-feedback', type);
    fb.textContent = msg;
  };

  phone.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    else if (v.length > 0) v = v.replace(/^(\d{0,2}).*/, '($1');
    e.target.value = v;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const required = ['nome', 'telefone', 'email', 'mensagem'];
    const missing = required.filter(k => !String(data[k] || '').trim());
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email || ''));

    if (missing.length || !emailOk) {
      showFb('err', 'Por favor, preencha os campos obrigatórios e confira o e-mail.');
      return;
    }

    const text =
      `Olá, sou ${data.nome}` +
      (data.empresa ? ` da empresa ${data.empresa}` : '') +
      `.\nE-mail: ${data.email}\nTelefone: ${data.telefone}\n\nMensagem: ${data.mensagem}`;

    const wa = `https://wa.me/5531971317496?text=${encodeURIComponent(text)}`;
    window.open(wa, '_blank', 'noopener');

    showFb('ok', 'Pronto! Abrimos o WhatsApp em uma nova aba com sua mensagem. Se preferir, envie por e-mail também.');
    form.reset();
  });
}

/* Active section in nav */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const setActive = () => {
  const y = window.scrollY + 120;
  let current = sections[0];
  sections.forEach(s => { if (s.offsetTop <= y) current = s; });
  navLinks.forEach(a => a.classList.remove('active'));
  const active = Array.from(navLinks).find(a => a.getAttribute('href') === '#' + (current?.id || ''));
  if (active) active.classList.add('active');
};
if (sections.length) {
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
}
