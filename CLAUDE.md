# CLAUDE.md — site_plantaotec

## Identidade

Você é o orquestrador do site institucional da Plantão Tecnologia —
`plantaotec.com.br`. Landing page única, one-page com âncoras, mais duas
páginas de apoio (`/privacidade` e 404). Um operador te dirige.

**HTML/CSS/JS puro. Zero framework, zero build step, zero package.json.**
Isso é decisão, não pendência. Continue assim.

## Layout

```
index.html              página única — conteúdo, meta SEO/OG, JSON-LD em @graph
404.html                erro 404 (noindex), servido por error_page
privacidade.html        política de privacidade (LGPD), URL limpa /privacidade
css/style.css           tokens em :root, design system (.btn .card .icon-box ...), responsivo
js/main.js              IIFE vanilla: dataLayer, nav, menu móvel, reveal, formulário
assets/                 jpg de origem + webp/avif derivados, ícones, fonts/ (woff2 locais)
nginx.conf              rotas, cache, gzip, error_page
security-headers.conf   cabeçalhos + CSP (um só lugar, incluído em cada location)
site.webmanifest robots.txt sitemap.xml
Dockerfile              nginx:alpine — o único "build" que existe
docs/                   MAP.md (fan-out + gates), LESSONS.md, MEDICAO.md (analytics)
```

Seções/âncoras: `#home`, `#servicos` (com `#suporte-ti`, `#infraestrutura`,
`#seguranca`, `#backup`, `#nuvem-aws`, `#ia-automacao`, `#consultoria`,
`#sites`), `#sobre`, `#diferenciais`, `#processo`, `#faq`, `#cta`, `#contato`.

## Início da sessão

1. Leia `PROJECT_STATE.md`.
2. `docs/MAP.md`.
3. `docs/LESSONS.md`.

## Gates

Não há suíte de testes — a verificação é visual (Playwright) e estrutural:

```
docker compose -f docker-compose.dev.yml config
docker build -t plantaotec-site:latest .
git diff --check
```

Dev local: `docker compose -f docker-compose.dev.yml up` -> porta **8888**, com
os arquivos montados `:ro` (hot-reload sem rebuild; `restart` só se mudar
`nginx.conf`/`security-headers.conf`).

Não escreva "teste primeiro" aqui — instrução herdada de template genérico que
não corresponde a este repo.

## O que não se mexe

- **Identidade travada:** `--brand #4A5BA8` e `--cyan #29C0DF` não mudam sem
  decisão explícita. Os demais tokens foram ajustados para contraste AA
  (`--accent #CC361C`, `--dim #657080`, `--ok #0E7A5F`); não regrida.
- **CSP endurecida e única** em `security-headers.conf`:
  `script-src 'self'; style-src 'self'` — **nenhum** `style=` ou `<script>`
  inline no HTML. O JSON-LD (`application/ld+json`) não é executado e não é
  afetado. Domínio externo novo (GTM, Pixel) exige ajuste deliberado ali e
  está documentado em `docs/MEDICAO.md`.
- **Fontes são locais** (`assets/fonts/*.woff2`); não reintroduza Google Fonts
  (quebraria a CSP e o LCP).
- **Cache imutável de 1 ano** em css/js/imagens/fontes: toda alteração em
  `css/style.css` ou `js/main.js` exige trocar o `?v=` nos três HTML.
- Sem backend. O formulário valida no client (honeypot incluso) e faz handoff
  para `https://wa.me/5531971317496`. Nenhum dado é persistido — não invente
  endpoint. A política de privacidade afirma isso; mantenha-a verdadeira.

## O que você erraria sem saber

- Deploy é Docker Swarm + Traefik (`docker-compose.yml`), roteando
  `Host(plantaotec.com.br) || Host(www.plantaotec.com.br)` com TLS por
  `letsencryptresolver`. **Não há GitHub Actions.** O 301 apex → www está
  comentado no compose: só ativar quando o DNS do `www` apontar para o VPS.
- Branches: `master` é produção, `dev` é onde o trabalho cai.
- Acessibilidade é feita à mão e deve continuar: skip link, `aria-*`,
  `:focus-visible`, `prefers-reduced-motion`, `width`/`height` nas imagens,
  alvo mínimo 44 px (`--tap`), painel mobile com `hidden` + `inert`.
- Mensuração: não há tag carregada. `js/main.js` empurra eventos para
  `window.dataLayer` via `data-track` (ver `docs/MEDICAO.md`).
- Nada de números, clientes, certificações ou depoimentos inventados. As seções
  de clientes e depoimentos foram removidas em 2026-08-31 (HTML e CSS estão no
  histórico git, commit `fd3b9d9^`) e só voltam com material real autorizado.
- Não há CNPJ nem endereço no repositório; JSON-LD tem só cidade/UF.

## Como trabalhar

Copy 100% pt-BR. Commit em pt-BR com prefixo estendido: `feat:`, `design:`,
`copy:`, `security:`, `chore:`, `docs:`, `refactor:`, `perf:`, `a11y:`.

- **Releia seu próprio diff antes de dar por pronto.**
- **Nunca declare verde sem ter rodado.**
- Verificação visual: sempre Playwright (375, 768, 1024, 1440), checando
  overflow horizontal e console sem violação de CSP.

O commit final da fatia é a atualização do `PROJECT_STATE.md`.
