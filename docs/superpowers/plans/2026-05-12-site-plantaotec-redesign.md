# Plantão Tecnologia — Redesign do Site

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separar o site em múltiplos arquivos (HTML/CSS/JS/assets), atualizar paleta ao logo real, reescrever copy B2B outcome-first, adicionar Consultoria e Sites como serviços, e adicionar headers de segurança no nginx.

**Architecture:** Site estático HTML/CSS/JS servido por nginx:alpine via Docker. O arquivo único `index.html` (~1.400 linhas) é desmembrado em `index.html` (estrutura), `css/style.css` (estilos), `js/main.js` (comportamento) e `assets/` (imagens). Zero frameworks, zero build step. Testes = verificação visual no browser em `http://localhost:8888` e build Docker sem erros.

**Tech Stack:** HTML5, CSS3, Vanilla JS, nginx:alpine, Docker, Docker Compose

**Spec de referência:** `docs/superpowers/specs/2026-05-12-site-plantaotec-redesign.md`

**Dev container:** `docker compose -f docker-compose.dev.yml up -d` → `http://localhost:8888`

---

### Task 1: Extrair CSS para css/style.css

**Files:**
- Create: `css/style.css`
- Modify: `index.html`

- [ ] **Step 1: Criar o arquivo css/style.css**

Copiar todo o conteúdo do bloco `<style>` do `index.html` (linhas 54–715, sem as tags `<style>` e `</style>`) para o novo arquivo:

```bash
mkdir css
```

Criar `css/style.css` com todo o CSS extraído. O conteúdo começa em:
```css
/* ============================================================
   PLANTÃO TECNOLOGIA — single-file site (light theme corporativo)
   ============================================================ */
:root { ... }
```
e termina em:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .reveal { opacity: 1; transform: none; }
}
```

- [ ] **Step 2: Substituir o bloco `<style>` no index.html pelo link externo**

Remover as linhas 53–716 do `index.html` (o bloco `<style>` inteiro) e substituir por:

```html
  <link rel="stylesheet" href="css/style.css" />
```

A linha deve ficar logo após o bloco de preconnect do Google Fonts (antes do `<script type="application/ld+json">`).

- [ ] **Step 3: Verificar no browser**

```bash
docker compose -f docker-compose.dev.yml restart
```

Abrir `http://localhost:8888`. O site deve carregar com todos os estilos intactos. Se aparecer sem CSS, verificar caminho `href="css/style.css"`.

- [ ] **Step 4: Commit**

```bash
git init  # se repositório ainda não existir
git add index.html css/style.css
git commit -m "refactor: extrair CSS para css/style.css"
```

---

### Task 2: Extrair JS para js/main.js

**Files:**
- Create: `js/main.js`
- Modify: `index.html`

- [ ] **Step 1: Criar o arquivo js/main.js**

```bash
mkdir js
```

Copiar todo o conteúdo do bloco `<script>` do `index.html` (linhas 1338–1431, sem as tags `<script>` e `</script>`) para `js/main.js`. O conteúdo começa em:

```js
/* Year */
document.getElementById('y').textContent = new Date().getFullYear();
```

e termina em:

```js
  if (sections.length) {
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }
```

- [ ] **Step 2: Substituir o bloco `<script>` no index.html**

Remover o bloco `<script>...</script>` inline e substituir por (antes de `</body>`):

```html
  <script src="js/main.js" defer></script>
```

- [ ] **Step 3: Verificar no browser**

Recarregar `http://localhost:8888`. Testar:
- Menu hamburger abre/fecha no mobile (redimensionar janela para < 980px)
- Formulário de contato valida campos obrigatórios
- Ano no footer exibe `2026`
- Scroll destaca o item correto no nav

- [ ] **Step 4: Commit**

```bash
git add index.html js/main.js
git commit -m "refactor: extrair JS para js/main.js"
```

---

### Task 3: Atualizar docker-compose.dev.yml com novos volumes

**Files:**
- Modify: `docker-compose.dev.yml`

- [ ] **Step 1: Adicionar volumes para css/, js/ e assets/**

Substituir o conteúdo de `docker-compose.dev.yml` por:

```yaml
services:
  site:
    image: nginx:alpine
    container_name: plantaotec-dev
    ports:
      - "8888:80"
    volumes:
      - ./index.html:/usr/share/nginx/html/index.html:ro
      - ./css:/usr/share/nginx/html/css:ro
      - ./js:/usr/share/nginx/html/js:ro
      - ./assets:/usr/share/nginx/html/assets:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    restart: unless-stopped
```

- [ ] **Step 2: Restartar container**

```bash
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d
```

Verificar `http://localhost:8888` — site carrega normalmente.

- [ ] **Step 3: Commit**

```bash
git add docker-compose.dev.yml
git commit -m "chore: adicionar volumes css/js/assets no compose dev"
```

---

### Task 4: Atualizar paleta de cores no css/style.css

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Atualizar variáveis :root**

No bloco `:root` de `css/style.css`, substituir as linhas de brand e adicionar cyan:

```css
/* ANTES: */
--brand: #0E2A47;
--brand-2: #16386F;

/* DEPOIS: */
--brand: #4A5BA8;
--brand-2: #3A4B98;
--cyan: #29C0DF;
```

- [ ] **Step 2: Corrigir cor hardcoded no hero::before**

Localizar em `css/style.css` o seletor `.hero::before` e atualizar o rgba da cor brand:

```css
/* ANTES: */
.hero::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(60% 50% at 85% 15%, rgba(232, 71, 44, 0.06), transparent 60%),
    radial-gradient(40% 40% at 0% 100%, rgba(14, 42, 71, 0.04), transparent 60%);
}

/* DEPOIS: */
.hero::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(60% 50% at 85% 15%, rgba(232, 71, 44, 0.06), transparent 60%),
    radial-gradient(40% 40% at 0% 100%, rgba(74, 91, 168, 0.04), transparent 60%);
}
```

- [ ] **Step 3: Adicionar classe .cyan para uso em headlines**

Adicionar ao final da seção de utilitários (logo após `.mono` e `.eyebrow`):

```css
.cyan { color: var(--cyan); }
.hero h1 .cyan { color: var(--cyan); font-weight: 700; }
```

- [ ] **Step 4: Verificar no browser**

Recarregar `http://localhost:8888`. Conferir:
- Nav e logo-mark em azul médio (#4A5BA8) — não mais naval escuro
- Hero card e process-num em azul médio
- Botões "Fale Conosco" ainda em vermelho (#E8472C)
- CTA banner (seção escura) em azul médio

- [ ] **Step 5: Commit**

```bash
git add css/style.css
git commit -m "design: atualizar paleta para azul do logo (#4A5BA8) + ciano (#29C0DF)"
```

---

### Task 5: Integrar logo real

**Files:**
- Modify: `index.html`

Os arquivos de logo já estão em `assets/`: `logo.png` (colorido), `logo-white.png` (branco), `logo-icon.png` (ícone isolado).

- [ ] **Step 1: Adicionar favicon no `<head>`**

Localizar o bloco de meta tags no `index.html` e adicionar após `<link rel="canonical">`:

```html
  <link rel="icon" type="image/png" href="assets/logo-icon.png" />
```

- [ ] **Step 2: Substituir logo do nav pelo logo real**

Localizar no `index.html` o bloco do nav com comentário `SLOT DO LOGO` e substituir o conteúdo do `<a class="logo">`:

```html
<!-- ANTES: -->
<a href="#home" class="logo" aria-label="Plantão Tecnologia">
  <span class="logo-mark" aria-hidden="true"></span>
  <span class="logo-text"><b>Plantão</b> <span>Tecnologia</span></span>
</a>

<!-- DEPOIS: -->
<a href="#home" class="logo" aria-label="Plantão Tecnologia">
  <img src="assets/logo.png" alt="Plantão Tecnologia" height="40" style="display:block;">
</a>
```

- [ ] **Step 3: Substituir logo do footer**

Localizar no `index.html` o bloco `footer-brand` e substituir o `<a class="logo">`:

```html
<!-- ANTES: -->
<a href="#home" class="logo">
  <span class="logo-mark" aria-hidden="true"></span>
  <span class="logo-text"><b>Plantão</b> <span>Tecnologia</span></span>
</a>

<!-- DEPOIS: -->
<a href="#home" class="logo" aria-label="Plantão Tecnologia">
  <img src="assets/logo.png" alt="Plantão Tecnologia" height="40" style="display:block;">
</a>
```

- [ ] **Step 4: Verificar no browser**

Recarregar `http://localhost:8888`. Conferir:
- Logo real aparece no nav (canto superior esquerdo)
- Logo real aparece no footer
- Ícone de favicon no browser tab
- Ao scrollar, nav fica com fundo branco e logo continua visível

- [ ] **Step 5: Commit**

```bash
git add index.html assets/
git commit -m "design: integrar logo real no nav e footer"
```

---

### Task 6: Atualizar copy do hero

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Atualizar eyebrow, h1 e subtítulo do hero**

Localizar a seção `<!-- ============== HERO ==============` e substituir o bloco de texto:

```html
<!-- ANTES: -->
<span class="eyebrow reveal">Conceição do Mato Dentro · MG e Região</span>
<h1 class="reveal delay-1">
  Tecnologia que <span class="accent">mantém sua empresa</span> funcionando.
</h1>
<p class="hero-sub reveal delay-2">
  Suporte de TI, infraestrutura, segurança, nuvem AWS e automação para empresas que precisam de um parceiro técnico confiável e próximo. Da operação do dia a dia ao agente de IA do seu atendimento.
</p>

<!-- DEPOIS: -->
<span class="eyebrow reveal">Conceição do Mato Dentro · MG e Região</span>
<h1 class="reveal delay-1">
  Enquanto você foca no negócio,<br>
  a Plantão <span class="cyan">cuida da TI.</span>
</h1>
<p class="hero-sub reveal delay-2">
  Empresas que param de improvisar TI crescem mais rápido. Assumimos sua operação com contrato, SLA e atendimento humano de quem está aqui.
</p>
```

- [ ] **Step 2: Atualizar label do hero-card**

Localizar `.hero-card-head` e atualizar o label:

```html
<!-- ANTES: -->
<span class="label">Soluções em destaque</span>

<!-- DEPOIS: -->
<span class="label">O que assumimos por você</span>
```

- [ ] **Step 3: Verificar no browser**

Recarregar `http://localhost:8888`. Conferir:
- Headline nova exibe com "cuida da TI." em ciano (#29C0DF)
- Subtítulo mais curto e direto
- Layout hero mantém proporções corretas

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "copy: atualizar hero — headline outcome-first com ciano"
```

---

### Task 7: Reescrever os 8 cards de serviço

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Substituir a seção `.services-grid` completa**

Localizar `<div class="services-grid">` e substituir tudo até o `</div>` correspondente pelos 8 cards abaixo:

```html
<div class="services-grid">

  <article class="service reveal">
    <div class="service-head">
      <div class="service-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"/><path d="M12 7v5l3 2"/></svg>
      </div>
      <span class="service-num">01</span>
    </div>
    <h3>Sua TI operada. Sua equipe, livre.</h3>
    <p>Você para de resolver chamado de TI e passa a receber relatório de funcionamento. A Plantão assume a operação com SLA acordado e atendimento humano de quem está aqui.</p>
    <ul class="service-subs">
      <li>Helpdesk e atendimento técnico</li>
      <li>Atendimento em campo e remoto</li>
      <li>Gestão de chamados com SLA</li>
      <li>Inventário, documentação e governança</li>
      <li>Relatórios periódicos de funcionamento</li>
    </ul>
    <a class="service-link" href="#contato">Falar sobre suporte <span>→</span></a>
  </article>

  <article class="service reveal delay-1">
    <div class="service-head">
      <div class="service-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><circle cx="7" cy="7" r="0.6" fill="currentColor"/><circle cx="7" cy="17" r="0.6" fill="currentColor"/></svg>
      </div>
      <span class="service-num">02</span>
    </div>
    <h3>Base técnica que aguenta crescer.</h3>
    <p>Servidores, rede, Wi-Fi e cabeamento projetados para o seu volume real — não para uma empresa dez vezes maior. Tudo documentado e com suporte contínuo.</p>
    <ul class="service-subs">
      <li>Servidores físicos e virtuais</li>
      <li>Virtualização (VMware / Hyper-V)</li>
      <li>Cabeamento estruturado e fibra</li>
      <li>Wi-Fi corporativo</li>
      <li>Switches e equipamentos de rede</li>
    </ul>
    <a class="service-link" href="#contato">Falar sobre infraestrutura <span>→</span></a>
  </article>

  <article class="service reveal delay-2">
    <div class="service-head">
      <div class="service-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4v6c0 5-4 7.5-8 8-4-.5-8-3-8-8V7z"/><path d="M9 12l2 2 4-4"/></svg>
      </div>
      <span class="service-num">03</span>
    </div>
    <h3>Proteção antes do incidente.</h3>
    <p>Firewall, EDR e processo de resposta a incidentes. Recuperar dados após um ataque custa dez vezes mais do que prevenir. Conformidade com LGPD inclusa.</p>
    <ul class="service-subs">
      <li>Firewall corporativo (UTM / NGFW)</li>
      <li>VPN e acesso remoto seguro</li>
      <li>EDR / antivírus gerenciado</li>
      <li>Hardening de servidores e estações</li>
      <li>Monitoramento e resposta a incidentes</li>
      <li>Adequação à LGPD</li>
    </ul>
    <a class="service-link" href="#contato">Falar sobre segurança <span>→</span></a>
  </article>

  <article class="service reveal">
    <div class="service-head">
      <div class="service-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a3 3 0 0 1-3 3H6a3 3 0 1 1 .5-5.95A5 5 0 0 1 16.5 11a3 3 0 0 1 4.5 4z"/><path d="M12 13v6M9 16l3-3 3 3"/></svg>
      </div>
      <span class="service-num">04</span>
    </div>
    <h3>Quando algo falhar, você está de pé.</h3>
    <p>Backup testado, não só configurado. Regra 3-2-1, replicação em nuvem e plano de recuperação com RPO e RTO definidos — você sabe exatamente o tempo de retorno.</p>
    <ul class="service-subs">
      <li>Backup local + off-site (regra 3-2-1)</li>
      <li>Replicação para nuvem</li>
      <li>Plano de Recuperação de Desastres (DR)</li>
      <li>Testes periódicos de restore</li>
      <li>RPO e RTO acordados em contrato</li>
    </ul>
    <a class="service-link" href="#contato">Falar sobre backup <span>→</span></a>
  </article>

  <article class="service reveal delay-1">
    <div class="service-head">
      <div class="service-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a3 3 0 0 1-3 3H6a3 3 0 1 1 .5-5.95A5 5 0 0 1 16.5 11a3 3 0 0 1 4.5 4z"/></svg>
      </div>
      <span class="service-num">05</span>
    </div>
    <h3>Escale sob demanda. Pague pelo que usa.</h3>
    <p>Migração, arquitetura e operação na AWS dimensionadas para o seu negócio. FinOps desde o dia um — sem pagar por capacidade ociosa nem ser surpreendido na fatura.</p>
    <ul class="service-subs">
      <li>Migração de cargas para AWS</li>
      <li>Arquitetura e dimensionamento</li>
      <li>EC2 · S3 · RDS · VPC · IAM</li>
      <li>FinOps e governança de custos</li>
      <li>Infraestrutura como código (IaC)</li>
      <li>Operação e monitoramento</li>
    </ul>
    <a class="service-link" href="#contato">Falar sobre nuvem <span>→</span></a>
  </article>

  <article class="service reveal delay-2">
    <div class="service-head">
      <div class="service-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>
      </div>
      <span class="service-num">06</span>
    </div>
    <h3>Faça mais com a mesma equipe.</h3>
    <p>Agentes de IA para atendimento, automação de processos repetitivos e integrações entre sistemas. Você ganha horas por semana sem contratar mais ninguém.</p>
    <ul class="service-subs">
      <li>Agentes de IA para atendimento</li>
      <li>Bots WhatsApp e multicanal</li>
      <li>Automação de processos (n8n / Make)</li>
      <li>Integrações entre sistemas (APIs)</li>
      <li>Implantação e integração de ERPs</li>
    </ul>
    <a class="service-link" href="#contato">Falar sobre IA e automação <span>→</span></a>
  </article>

  <article class="service reveal">
    <div class="service-head">
      <div class="service-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
      </div>
      <span class="service-num">07</span>
    </div>
    <h3>Decisões técnicas com quem conhece seu cenário.</h3>
    <p>Diagnóstico de ambiente, planejamento de TI e projetos pontuais. Para quando você precisa de orientação estratégica antes de investir — sem compromisso de contrato mensal.</p>
    <ul class="service-subs">
      <li>Diagnóstico de ambiente TI</li>
      <li>Planejamento estratégico de TI</li>
      <li>Projetos pontuais e assessoria</li>
      <li>Avaliação de fornecedores e soluções</li>
      <li>Gestão de projetos tecnológicos</li>
    </ul>
    <a class="service-link" href="#contato">Falar sobre consultoria <span>→</span></a>
  </article>

  <article class="service reveal delay-1">
    <div class="service-head">
      <div class="service-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      </div>
      <span class="service-num">08</span>
    </div>
    <h3>Presença digital que trabalha por você.</h3>
    <p>Sites institucionais, landing pages e lojas virtuais com foco em conversão. Desenvolvemos, hospedamos e mantemos — você só aparece na frente do cliente.</p>
    <ul class="service-subs">
      <li>Sites institucionais</li>
      <li>Landing pages de conversão</li>
      <li>Lojas virtuais (e-commerce)</li>
      <li>Hospedagem e manutenção</li>
      <li>SEO técnico e performance</li>
    </ul>
    <a class="service-link" href="#contato">Falar sobre sites <span>→</span></a>
  </article>

</div>
```

- [ ] **Step 2: Verificar no browser**

Recarregar `http://localhost:8888` e rolar até a seção Serviços. Conferir:
- 8 cards exibem corretamente em grid 3 colunas (desktop)
- Cards 07 e 08 aparecem na última linha
- Todos os textos novos estão corretos
- Hover nos cards funciona (borda + seta vermelha)

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "copy: reescrever 6 serviços e adicionar Consultoria (07) e Sites (08)"
```

---

### Task 8: Atualizar copy das seções Sobre, Diferenciais e Processo

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Atualizar parágrafos da seção Sobre**

Localizar a seção `id="sobre"` e substituir os três parágrafos dentro de `.about-copy`:

```html
<!-- ANTES: -->
<p style="margin-top:26px;">A Plantão Tecnologia nasceu para resolver o que a maioria das empresas da região não tem tempo — nem precisa ter — de resolver sozinha: manter a tecnologia funcionando enquanto o negócio cresce.</p>
<p>Atuamos com TI gerenciada, segurança da informação, nuvem AWS e automação. Combinamos atendimento próximo de quem está em Conceição do Mato Dentro com domínio técnico em cloud, redes e inteligência artificial.</p>
<p>Não vendemos hora avulsa de pânico. Vendemos um relacionamento contínuo, com SLA escrito, processo claro e gente que atende o telefone quando algo precisa ser resolvido agora.</p>

<!-- DEPOIS: -->
<p style="margin-top:26px;">A Plantão nasceu para as empresas da região pararem de improvisar TI e começarem a ter um parceiro técnico de verdade — que assume responsabilidade e entrega previsibilidade.</p>
<p>Atuamos com TI gerenciada, segurança, nuvem AWS, consultoria e criação de sites. Atendimento local em Conceição do Mato Dentro com capacidade técnica em cloud, redes e inteligência artificial.</p>
<p>Não vendemos hora avulsa de pânico. Vendemos previsibilidade — com SLA escrito, processo claro e gente que atende quando precisar.</p>
```

- [ ] **Step 2: Atualizar os 4 cards de Diferenciais**

Localizar a seção `id="diferenciais"` e substituir o conteúdo de `.diff-grid`:

```html
<div class="diff-grid">
  <article class="diff reveal">
    <div class="diff-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>
    </div>
    <h3>SLA que você assina</h3>
    <p>Janelas de atendimento definidas em contrato. Sem labirinto de protocolo, sem depender da boa vontade do fornecedor.</p>
  </article>
  <article class="diff reveal delay-1">
    <div class="diff-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4v6c0 5-4 7.5-8 8-4-.5-8-3-8-8V7z"/><path d="M9 12l2 2 4-4"/></svg>
    </div>
    <h3>Segurança de verdade</h3>
    <p>Firewall, EDR e backup testado. Tratamos seus dados com a mesma paranoia que tratamos os nossos.</p>
  </article>
  <article class="diff reveal delay-2">
    <div class="diff-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17h18"/><path d="M5 12c2-3 5-3 7 0s5 3 7 0"/><path d="M5 7h14"/></svg>
    </div>
    <h3>Nuvem no tamanho certo</h3>
    <p>AWS dimensionada pelo seu volume real. Nenhuma arquitetura de startup sendo cobrada do seu CNPJ.</p>
  </article>
  <article class="diff reveal delay-3">
    <div class="diff-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12h8M12 8v8"/></svg>
    </div>
    <h3>Automação que libera tempo</h3>
    <p>IA e automação só fazem sentido se eliminam fricção. Mapeamos, entregamos e mantemos.</p>
  </article>
</div>
```

- [ ] **Step 3: Atualizar copy dos 4 passos do Processo**

Localizar a seção `id="processo"` e substituir o conteúdo de `.process-list`:

```html
<div class="process-list">
  <article class="process-step reveal">
    <div class="process-num">01</div>
    <div>
      <h3>Diagnóstico técnico</h3>
      <p>Visita ou call com seu time, levantamento do ambiente atual e mapeamento de riscos. Saímos com clareza sobre o que precisa mudar — não com promessa.</p>
    </div>
  </article>
  <article class="process-step reveal delay-1">
    <div class="process-num">02</div>
    <div>
      <h3>Proposta sob medida</h3>
      <p>Escopo claro, tecnologia escolhida para o seu cenário, SLA combinado e investimento sem letra miúda. Discutimos juntos antes de fechar.</p>
    </div>
  </article>
  <article class="process-step reveal">
    <div class="process-num">03</div>
    <div>
      <h3>Implantação e onboarding</h3>
      <p>Execução documentada, transferência de conhecimento e checkpoints no calendário. Você sabe quando, quem e como em cada etapa.</p>
    </div>
  </article>
  <article class="process-step reveal delay-1">
    <div class="process-num">04</div>
    <div>
      <h3>Operação acompanhada</h3>
      <p>Monitoramento contínuo, atendimento sob SLA e reuniões periódicas de evolução. A Plantão não some depois da entrega.</p>
    </div>
  </article>
</div>
```

- [ ] **Step 4: Atualizar título da seção Contato**

Localizar o `<h2>` dentro de `id="contato"` e substituir:

```html
<!-- ANTES: -->
<h2>Conte o que <span class="accent">está acontecendo</span>. Respondemos em breve.</h2>

<!-- DEPOIS: -->
<h2>Conte o que <span class="accent">está acontecendo</span>. A Plantão entra em contato.</h2>
```

- [ ] **Step 5: Verificar no browser**

Rolar pelas seções Sobre, Diferenciais, Processo e Contato. Confirmar que os novos textos aparecem corretamente.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "copy: atualizar Sobre, Diferenciais, Processo e Contato"
```

---

### Task 9: Adicionar security headers no nginx.conf

**Files:**
- Modify: `nginx.conf`

- [ ] **Step 1: Substituir nginx.conf completo**

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    server_tokens off;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';" always;

    gzip on;
    gzip_vary on;
    gzip_types text/html text/css application/javascript image/svg+xml;
    gzip_min_length 1024;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    location ~* \.(css|js|svg|png|jpg|jpeg|gif|ico|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
```

- [ ] **Step 2: Restartar container e verificar headers**

```bash
docker compose -f docker-compose.dev.yml restart
curl -I http://localhost:8888
```

Saída esperada deve incluir:
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; ...
```

- [ ] **Step 3: Verificar site no browser**

Abrir `http://localhost:8888` e verificar no DevTools (F12 → Network → clique na requisição `/` → Headers) que os headers aparecem. O site deve funcionar normalmente — sem bloqueio de fontes ou estilos.

Se as fontes do Google não carregarem, verificar que o CSP inclui `https://fonts.googleapis.com` em `style-src` e `https://fonts.gstatic.com` em `font-src`.

- [ ] **Step 4: Commit**

```bash
git add nginx.conf
git commit -m "security: adicionar X-Frame-Options, CSP, Referrer-Policy e Permissions-Policy"
```

---

### Task 10: Atualizar Dockerfile

**Files:**
- Modify: `Dockerfile`

- [ ] **Step 1: Atualizar Dockerfile para copiar novos diretórios**

```dockerfile
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80
```

- [ ] **Step 2: Buildar imagem e verificar**

```bash
docker build -t plantaotec-site:latest .
```

Saída esperada: build sem erros, linha final `naming to docker.io/library/plantaotec-site:latest done`.

- [ ] **Step 3: Testar a imagem buildada**

```bash
docker run --rm -p 9000:80 plantaotec-site:latest
```

Abrir `http://localhost:9000` — site deve carregar identicamente ao dev. Depois parar com `Ctrl+C`.

- [ ] **Step 4: Commit**

```bash
git add Dockerfile
git commit -m "chore: atualizar Dockerfile para incluir css/ js/ assets/"
```

---

### Task 11: Criar PROMPTS_IMAGENS.md

**Files:**
- Create: `PROMPTS_IMAGENS.md`

- [ ] **Step 1: Criar o arquivo de prompts**

```markdown
# Prompts de Imagem — Plantão Tecnologia

Gere as imagens abaixo com o ChatGPT (DALL·E) ou outro gerador.
Salve cada arquivo na pasta `assets/` com o nome indicado.

---

## assets/hero-visual.jpg
**Onde aparece:** Coluna direita do hero (acima da dobra), visível em desktop.
**Dimensões:** 900×700px, formato horizontal/retrato.

**Prompt:**
```
Professional IT support scene for a small Brazilian business.
A confident technician monitors a modern server rack and dual screens
in a clean, organized office. Warm blue tones aligned with #4A5BA8.
Trustworthy, local, human atmosphere. No text overlay.
Photorealistic, horizontal format, natural lighting.
```

---

## assets/about-team.jpg
**Onde aparece:** Coluna direita da seção "Sobre", substituindo os 4 stat cards.
**Dimensões:** 800×600px, formato horizontal.

**Prompt:**
```
Two or three IT professionals in a modern Brazilian office reviewing
infrastructure plans and a laptop screen together. Collaborative,
professional, trustworthy mood. Blue and white color tones.
No text overlay. Photorealistic, horizontal, natural lighting.
```

---

## assets/og-image.jpg
**Onde aparece:** Thumbnail ao compartilhar o link nas redes sociais (WhatsApp, LinkedIn).
**Dimensões:** 1200×630px (padrão Open Graph).

**Prompt:**
```
Clean B2B tech brand cover. Dark blue background (#4A5BA8),
minimalist geometric composition with a cyan (#29C0DF) accent element
on the right side. Space for text on the left (leave it empty).
Corporate, professional, flat design style. No photography.
```

---

## Como usar as imagens depois de geradas

1. Salvar os arquivos em `assets/` com os nomes exatos acima.
2. No `index.html`, substituir o bloco `<aside class="hero-card">` pelo trecho abaixo:

```html
<aside class="reveal delay-2" aria-label="Imagem institucional">
  <img src="assets/hero-visual.jpg"
       alt="Equipe da Plantão Tecnologia em atuação"
       style="width:100%;border-radius:20px;box-shadow:0 24px 48px -16px rgba(74,91,168,0.18);">
</aside>
```

3. Na seção Sobre, substituir `<aside class="about-visual">` por:

```html
<aside class="reveal delay-1" aria-label="Time Plantão Tecnologia">
  <img src="assets/about-team.jpg"
       alt="Time da Plantão Tecnologia"
       style="width:100%;border-radius:20px;border:1px solid var(--line);">
</aside>
```

4. Adicionar no `<head>` do `index.html` (após as metas de Open Graph existentes):

```html
<meta property="og:image" content="https://www.plantaotec.com.br/assets/og-image.jpg" />
<meta name="twitter:image" content="https://www.plantaotec.com.br/assets/og-image.jpg" />
```
```

- [ ] **Step 2: Commit**

```bash
git add PROMPTS_IMAGENS.md
git commit -m "docs: adicionar PROMPTS_IMAGENS.md com prompts para ChatGPT"
```

---

### Task 12: Teste final e build de produção

**Files:** nenhum (verificação)

- [ ] **Step 1: Verificação completa no browser de dev**

Abrir `http://localhost:8888` e percorrer todas as seções:

| Seção | O que verificar |
|-------|----------------|
| Nav | Logo real, links funcionam, hamburger mobile |
| Hero | Headline nova, "cuida da TI." em ciano, botões CTA |
| Serviços | 8 cards, textos novos, hover com seta vermelha |
| Sobre | Parágrafos novos, stats cards visíveis |
| Diferenciais | 4 cards com títulos novos |
| Processo | 4 passos com textos novos |
| Clientes | Carrossel animado |
| Depoimentos | 3 cards |
| CTA Banner | Azul novo (#4A5BA8), botões visíveis |
| Contato | Formulário, validação, handoff WhatsApp |
| Footer | Logo real, links, ano correto |
| WhatsApp float | Botão verde fixo no canto |

- [ ] **Step 2: Verificar responsividade**

No DevTools, testar em 375px (mobile) e 768px (tablet):
- Hero empilha em coluna única
- Serviços em 1 coluna (mobile) e 2 colunas (tablet)
- Menu hamburger abre corretamente
- Formulário em coluna única

- [ ] **Step 3: Build final de produção**

```bash
docker build -t plantaotec-site:latest .
```

Build deve completar sem erros.

- [ ] **Step 4: Commit final**

```bash
git add -A
git commit -m "chore: build final — redesign completo v1"
```
