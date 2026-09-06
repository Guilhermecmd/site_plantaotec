# Mapa do repositório

## Estrutura

- `index.html` — página única: conteúdo, meta SEO/OG, JSON-LD (`@graph`)
- `404.html` — página de erro (noindex), servida por `error_page` no nginx
- `privacidade.html` — política de privacidade (LGPD), URL limpa `/privacidade`
- `css/style.css` — tokens, base, componentes (`.btn`, `.card`, `.icon-box`,
  `.check-list`, `.text-link`), seções, páginas internas, responsivo
- `js/main.js` — IIFE vanilla: dataLayer, nav, menu móvel, reveal, formulário
- `assets/` — imagens (jpg de origem + webp/avif derivados), ícones, `fonts/`
- `nginx.conf` — rotas, cache, gzip, `error_page`
- `security-headers.conf` — cabeçalhos + CSP, incluído em cada `location`
- `site.webmanifest`, `robots.txt`, `sitemap.xml`
- `docs/MEDICAO.md` — eventos do dataLayer e como ativar GTM/GA4/GSC
- `docs/superpowers/` — specs e planos históricos
- `docs/PROJECT_REFERENCE.md` — bootstrap anterior

## Fan-out

- seção/âncora → nav desktop, painel mobile, rodapé, JSON-LD (`url` dos
  serviços), `scroll-margin-top`
- token CSS → contraste (AA já verificado) e estados hover/focus
- asset novo → gerar webp/avif com `sharp`, `width`/`height` no `<img>`,
  extensão no regex de cache do `nginx.conf`
- alteração em CSS/JS → trocar o `?v=` nos três HTML (cache imutável de 1 ano)
- script/estilo inline → **proibido** pela CSP (`script-src 'self'`,
  `style-src 'self'`); usar arquivo externo e classe
- domínio externo novo → `security-headers.conf` (uma única CSP)
- página nova → `Dockerfile`, `docker-compose.dev.yml`, `sitemap.xml`
- rota/domínio → Compose e Traefik

## Gates

- `docker compose -f docker-compose.dev.yml config`
- `docker build -t plantaotec-site:latest .`
- `git diff --check`
- revisão de segredos e artefatos
- (opcional, fora do repo) `npx html-validate index.html 404.html privacidade.html`
  e Lighthouse contra `http://localhost:8888/`

## Referência preservada

`docs/PROJECT_REFERENCE.md` contém o bootstrap anterior completo.
