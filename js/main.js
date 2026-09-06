/* Plantão Tecnologia — interações do site (vanilla, sem dependências) */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var WA_NUMBER = '5531971317496';
  var SCROLLED_AT = 12;
  var MIN_PHONE_DIGITS = 10;
  var MAX_PHONE_DIGITS = 11;

  /* ---------- Mensuração: eventos no dataLayer (compatível com GTM/GA4) ---------- */
  function track(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    var payload = { event: eventName };
    if (params) {
      Object.keys(params).forEach(function (k) { payload[k] = params[k]; });
    }
    window.dataLayer.push(payload);
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;
    track(el.getAttribute('data-track'), {
      label: el.getAttribute('data-track-label') || '',
      href: el.getAttribute('href') || ''
    });
  });

  /* ---------- Ano do rodapé ---------- */
  var year = document.getElementById('y');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Cabeçalho fixo ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var ticking = false;
    var updateNav = function () {
      nav.classList.toggle('scrolled', window.scrollY > SCROLLED_AT);
      ticking = false;
    };
    updateNav();
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateNav);
    }, { passive: true });
  }

  /* ---------- Menu móvel ---------- */
  var burger = document.getElementById('hamburger');
  var panel = document.getElementById('mobilePanel');
  if (burger && panel) {
    var MENU_CLOSE_MS = 350;
    var setMenu = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('menu-open', open);
      if (open) {
        panel.hidden = false;
        panel.inert = false;
        /* Dois frames: o primeiro aplica display, o segundo anima o transform. */
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () { panel.classList.add('open'); });
        });
      } else {
        panel.classList.remove('open');
        panel.inert = true;
        window.setTimeout(function () { if (!panel.classList.contains('open')) panel.hidden = true; }, MENU_CLOSE_MS);
      }
    };
    var isMenuOpen = function () { return burger.getAttribute('aria-expanded') === 'true'; };

    burger.addEventListener('click', function () { setMenu(!isMenuOpen()); });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen()) { setMenu(false); burger.focus(); }
    });
  }

  /* ---------- Animação de entrada ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('visible');
        io.unobserve(en.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Seção ativa no menu (sem leitura de layout no scroll) ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var current = null;
    var sectionIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) current = en.target.id;
      });
      navLinks.forEach(function (a) {
        var active = a.getAttribute('href') === '#' + current;
        if (active) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (s) { sectionIo.observe(s); });
  }

  /* ---------- Formulário: máscara, validação e handoff para o WhatsApp ---------- */
  var form = document.getElementById('leadForm');
  var feedback = document.getElementById('formFeedback');
  var phone = document.getElementById('f-tel');
  var submitBtn = document.getElementById('submitBtn');

  function onlyDigits(v) { return String(v || '').replace(/\D/g, ''); }

  function maskPhone(v) {
    var d = onlyDigits(v).slice(0, MAX_PHONE_DIGITS);
    if (d.length > 10) return d.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    if (d.length > 6) return d.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    if (d.length > 2) return d.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    if (d.length > 0) return d.replace(/^(\d{0,2}).*/, '($1');
    return '';
  }

  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim()); }

  function setFieldError(input, hasError) {
    if (!input) return;
    var msg = document.getElementById(input.getAttribute('aria-describedby') || '');
    if (hasError) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    if (msg) msg.classList.toggle('show', hasError);
  }

  /* Monta o aviso com nós do DOM (sem innerHTML): texto + link opcional + texto final. */
  function showFeedback(type, text, link, after) {
    if (!feedback) return;
    feedback.classList.remove('ok', 'err');
    feedback.classList.add(type);
    feedback.textContent = '';
    feedback.appendChild(document.createTextNode(text));
    if (link) {
      var a = document.createElement('a');
      a.href = link.href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = link.text;
      feedback.appendChild(a);
    }
    if (after) feedback.appendChild(document.createTextNode(after));
  }

  function buildMessage(data) {
    var lines = ['Olá, sou ' + data.nome + (data.empresa ? ', da empresa ' + data.empresa : '') + '.'];
    lines.push('E-mail: ' + data.email);
    lines.push('Telefone: ' + data.telefone);
    lines.push('');
    lines.push('Mensagem: ' + data.mensagem);
    return lines.join('\n');
  }

  if (phone) {
    phone.addEventListener('input', function (e) { e.target.value = maskPhone(e.target.value); });
  }

  if (form && feedback) {
    var fields = {
      nome: document.getElementById('f-nome'),
      telefone: phone,
      email: document.getElementById('f-email'),
      mensagem: document.getElementById('f-msg')
    };

    Object.keys(fields).forEach(function (k) {
      if (fields[k]) fields[k].addEventListener('input', function () { setFieldError(fields[k], false); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var raw = new FormData(form);
      var data = {};
      raw.forEach(function (v, k) { data[k] = String(v).trim(); });

      /* Honeypot: bots preenchem o campo oculto; humanos não. */
      if (data.site) {
        showFeedback('ok', 'Pronto! Abrimos o WhatsApp em uma nova aba.');
        form.reset();
        return;
      }

      var errors = {
        nome: !data.nome,
        telefone: onlyDigits(data.telefone).length < MIN_PHONE_DIGITS,
        email: !isEmail(data.email),
        mensagem: !data.mensagem
      };
      var firstInvalid = null;
      Object.keys(errors).forEach(function (k) {
        setFieldError(fields[k], errors[k]);
        if (errors[k] && !firstInvalid) firstInvalid = fields[k];
      });

      if (firstInvalid) {
        showFeedback('err', 'Confira os campos destacados antes de enviar.');
        firstInvalid.focus();
        return;
      }

      var waUrl = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(buildMessage(data));

      if (submitBtn) submitBtn.setAttribute('aria-busy', 'true');
      var win = window.open(waUrl, '_blank', 'noopener');
      track('form_submit', { label: 'contato', href: waUrl });

      if (win === null) {
        showFeedback('err', 'O navegador bloqueou a nova aba. ', { href: waUrl, text: 'Clique aqui para abrir o WhatsApp' }, ' com a sua mensagem.');
      } else {
        showFeedback('ok', 'Pronto! Abrimos o WhatsApp em uma nova aba com a sua mensagem. Se não abriu, ', { href: waUrl, text: 'clique aqui' }, '. Se preferir, escreva para contato@plantaotec.com.br.');
        form.reset();
      }
      if (submitBtn) submitBtn.removeAttribute('aria-busy');
    });
  }
})();
