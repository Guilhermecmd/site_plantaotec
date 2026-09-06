# Estado do Projeto — site_plantaotec

## Status

Site institucional em produção (branch `master`). Redesign v1 (2026-05), fatia
de SEO (2026-08-31) e **auditoria + refatoração completa (2026-09-06)** na
branch `auditoria-refatoracao`, pronta para merge em `dev` → `master`.

**Atenção — infra quebrada (fora do repositório, pendente com o operador):**
- O VPS de produção (`5.78.156.26`) está fora do ar (confirmado em 2026-08-31).
- O DNS de `www.plantaotec.com.br` aponta para `187.73.33.31` (terceiros, 403,
  TLS errado). O apex aponta para o VPS correto. Corrigir o registro DNS do
  `www` é pré-requisito: canonical, og:url, JSON-LD e sitemap usam `www`.
- Depois do DNS: ativar o 301 apex → `www` (labels Traefik já escritas,
  comentadas, em `docker-compose.yml`).

## Fase atual

Pós-auditoria. Próximo passo é o operador revisar visualmente na porta 8888,
fazer merge e publicar a imagem (`docker build` + `docker stack deploy`).

## Métricas da fatia 2026-09-06 (Lighthouse, dev local)

| | Perf | A11y | Boas práticas | SEO | LCP | FCP |
|---|---|---|---|---|---|---|
| Mobile antes | 93 | 89 | 100 | 100 | 2,5 s | 2,5 s |
| Mobile depois | 99 | 100 | 100 | 100 | 1,5 s | 1,2 s |
| Desktop antes | 99 | 89 | 100 | 100 | 0,8 s | 0,8 s |
| Desktop depois | 100 | 100 | 100 | 100 | 0,4 s | 0,3 s |

Peso transferido (gzip): CSS 6,0 → 6,4 KB (com FAQ, 404, privacidade e
`@font-face`), JS 1,6 → 2,9 KB (validação por campo + dataLayer), HTML
7,7 → 10,4 KB (FAQ + JSON-LD). Fontes: Google Fonts (7 pesos, bloqueante,
~1,4 s no mobile) → 2 woff2 locais (27 + 15 KB, preload). Hero: JPEG 74 KB →
AVIF 11 KB / WebP 19 KB com `srcset`.

## Implementado (acumulado)

- Estrutura sem build: `index.html` + `404.html` + `privacidade.html` +
  `css/style.css` + `js/main.js` + `assets/`.
- Design system em `css/style.css`: tokens (cor, tipo, espaço, raio, sombra,
  `--tap` 44 px, `--nav-h`), componentes `.btn` (primary/dark/outline/on-dark/wa,
  `-lg`), `.card`/`.card-hover`, `.icon-box`, `.check-list`, `.text-link`,
  `.label`, `.eyebrow`, páginas internas (`.page`, `.prose`). CSS morto removido
  (hero-card, about-visual, portfolio, logo-mark, btn-ghost, clientes,
  depoimentos — estes dois últimos recuperáveis em `fd3b9d9^`).
- Contraste AA em todos os textos: `--accent #CC361C`, `--dim #657080`,
  `--ok #0E7A5F`, botão WhatsApp com texto escuro, destaque do banner em
  `--cyan-soft`. `--brand` e `--cyan` intactos.
- Acessibilidade: skip link, `main#conteudo`, `aria-labelledby` nas seções,
  painel mobile `<nav hidden inert>`, hambúrguer com `type` e rótulo dinâmico,
  headings h1 → h2 → h3 sem salto (rodapé com h2), `dl` no bloco de confiança,
  erros de formulário por campo (`aria-invalid` + `aria-describedby`), foco no
  primeiro campo inválido, alvos ≥ 44 px, `aria-current` no menu.
- Copy/conversão: H1 "Suporte e gestão de TI para empresas que não podem
  parar." com sub que responde o quê / para quem / onde / como; CTA principal
  WhatsApp no hero e "Solicitar diagnóstico" no nav/banner; títulos dos 8
  serviços viraram nomes de serviço (keyword) com âncora própria e link de
  WhatsApp pré-preenchido por serviço; seção **FAQ** com 7 perguntas baseadas
  só no que o site já afirmava; nota de privacidade no formulário; rodapé com
  links por serviço e política de privacidade.
- SEO: JSON-LD `@graph` (LocalBusiness+ProfessionalService com
  `hasOfferCatalog` de 8 `Service`, `WebSite`, `WebPage`, `FAQPage`);
  `BreadcrumbList` em `/privacidade`; OG/Twitter alinhados ao title;
  `og:image:alt`; sitemap com 2 URLs; robots com `Disallow: /404.html`;
  `error_page 404` real; `try_files $uri.html` para URL limpa.
- Performance: fontes locais (variável Jakarta 200–800 + Plex Mono 500,
  subset latin, preload, `font-display: swap`); `<picture>` AVIF/WebP com
  `srcset`/`sizes` no hero e no Sobre; logo redimensionado (324×128, webp/png);
  ícones 32/192/512 + apple-touch-icon + `site.webmanifest`; `?v=20260906` nos
  assets com cache imutável; scroll sem leitura de layout (IntersectionObserver
  para seção ativa, rAF no nav).
- Segurança: CSP única em `security-headers.conf` sem `'unsafe-inline'`
  (`script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'self';
  form-action 'self'; frame-ancestors 'self'`), zero `style=` inline, zero
  violação no console (verificado no Playwright); honeypot no formulário;
  `Permissions-Policy` ampliada; `server_tokens off`; feedback do formulário
  montado com nós DOM (sem `innerHTML`).
- Mensuração: eventos `whatsapp_click`, `cta_click`, `form_submit`,
  `email_click`, `area_cliente`, `social_click` no `window.dataLayer` via
  `data-track`. Nenhuma tag carregada. Guia em `docs/MEDICAO.md`.
- LGPD: `/privacidade` descreve exatamente o que o site faz (sem cookies, sem
  analytics, formulário → WhatsApp, logs do servidor). Sem banner de cookies
  porque não há cookies.
- Docker: `Dockerfile` copia as 3 páginas, manifest e o include de headers;
  `docker-compose.dev.yml` monta tudo `:ro`; `.dockerignore` exclui docs e
  ferramentas; `.gitignore` ignora `.playwright-mcp/`.

## Verificado em 2026-09-06

- `html-validate` (recommended + no-inline-style) limpo nas 3 páginas.
- Playwright: 375 / 768 / 1440 sem overflow horizontal; menu móvel abre/fecha
  com `hidden`/`inert`/`aria-expanded` corretos e trava o scroll; formulário
  vazio marca os 4 campos e foca o primeiro; formulário preenchido monta a URL
  do WhatsApp com máscara `(31) 99999-8888`, dispara `form_submit` e reseta;
  console sem erros nem violações de CSP.
- Gates: `docker compose ... config`, `docker build`, `git diff --check`,
  `nginx -t` dentro do container; imagem de produção testada na porta 8889
  (200 em `/`, `/privacidade`, manifest com MIME correto; 404 em rota
  inexistente e em `/404.html` direto).

## Ainda não implementado / depende do responsável

- **DNS do `www` + 301 apex → www** (ver "Atenção").
- **Google Search Console** (verificar domínio via DNS, enviar sitemap) e
  **Google Business Profile** (NAP igual ao JSON-LD). Maior alavanca local.
- **GTM/GA4**: seguir `docs/MEDICAO.md`; exige ajustar a CSP e a política.
- **CNPJ, razão social e endereço**: não existem no repositório. Ao obter,
  adicionar no rodapé (`.footer-bottom`), no JSON-LD (`streetAddress`,
  `postalCode`, `taxID`) e na política de privacidade (seção 1).
- **Depoimentos e logos de clientes reais**: restaurar seções de `fd3b9d9^`
  (HTML) — o CSS `.clients-*`/`.testi*` também está lá.
- **Fotos reais** de equipe/escritório para substituir as ilustrações
  (`hero-visual`, `about-team`), mantendo `<picture>` AVIF/WebP.
- **Páginas por serviço** (ex.: `/suporte-ti-conceicao-do-mato-dentro`): hoje
  são âncoras na home. Ganho real de SEO local, mas cada página duplica
  header/footer sem build; decidir antes se vale introduzir um gerador mínimo.
- Blog/conteúdo, formulário com backend/CRM: fora de escopo, como no spec.

## Próxima fatia recomendada

1. Operador: revisar em `localhost:8888`, merge em `dev` e `master`, build e
   deploy quando o VPS voltar; corrigir DNS do `www`; ativar o 301.
2. Cadastrar Search Console + Business Profile (sem código).
3. Coletar CNPJ/endereço e 3 depoimentos autorizados → fatia de confiança.
