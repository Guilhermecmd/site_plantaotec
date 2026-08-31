# Estado do Projeto — site_plantaotec

## Status

Site institucional em produção (branch `master`). Redesign completo v1 (2026-05-12/13) implementado; fatia de SEO + limpeza de conteúdo aplicada em 2026-08-31.

**Atenção — infra quebrada (fora do repositório, pendente com o operador):**
- O VPS de produção (`5.78.156.26`) está fora do ar (confirmado pelo operador em 2026-08-31).
- O DNS de `www.plantaotec.com.br` aponta para `187.73.33.31` — um servidor de terceiros que responde 403 com certificado TLS errado. O apex aponta para o VPS correto. Corrigir o registro DNS do `www` é pré-requisito: canonical, og:url, JSON-LD e sitemap declaram `www` como host canônico.
- Depois do DNS: configurar 301 do apex → `www` (hoje o Traefik serve os dois hosts com 200, conteúdo duplicado).

## Fase atual

Pós-redesign / manutenção incremental. O plano de redesign (`docs/superpowers/plans/2026-05-12-site-plantaotec-redesign.md`, 12 tasks) foi executado integralmente — cada task tem commit correspondente no histórico, terminando em `b1d245a chore: build final — redesign completo v1`. Depois disso houve mais 5 fatias pequenas (imagens institucionais, favicon, ajustes de logo no nav, botão Área do Cliente), a última sendo `9096db7 feat: adicionar botão Área do Cliente na nav`.

## Implementado

- Estrutura separada: `index.html` (semântica) + `css/style.css` + `js/main.js` + `assets/` (sem build step, zero framework).
- Paleta alinhada ao logo real (`--brand #4A5BA8`, `--cyan #29C0DF`), logo real integrado em nav/footer/favicon.
- Copy B2B "resultado + transformação" em todas as seções (hero, sobre, diferenciais, processo, contato).
- 8 cards de serviço completos, incluindo os 2 adicionados no redesign (07 Consultoria, 08 Criação de sites).
- Imagens institucionais reais geradas e integradas (`assets/hero-visual.jpg`, `assets/about-team.jpg`, `assets/og-image.jpg` + meta og:image/twitter:image no `<head>`).
- Segurança: headers no `nginx.conf` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP) aplicados tanto na rota `/` quanto nos assets estáticos.
- Formulário de contato client-side (`js/main.js`): validação de campos obrigatórios + e-mail, máscara de telefone BR, handoff para WhatsApp com mensagem pré-preenchida (sem backend).
- Botão "Área do Cliente" no nav (desktop + painel mobile), linkando para `chamados.plantaotec.com.br`.
- Docker: `docker-compose.dev.yml` (nginx:alpine, porta 8888, volumes montados para hot-reload local) e `docker-compose.yml` (produção, Traefik com TLS via Let's Encrypt para `plantaotec.com.br`/`www.plantaotec.com.br`).

## Fatia de 2026-08-31 — SEO + limpeza de conteúdo público

- **Seções `#clientes` e `#depoimentos` removidas do HTML** por decisão do operador: eram placeholders ("Cliente 01..08", depoimentos de exemplo) e uma nota interna de rascunho estava visível ao público. Recuperar via histórico git quando houver logos/depoimentos reais autorizados. O CSS das seções (`.clients-*`, `.testi*`) foi mantido para o retorno.
- SEO on-page: title keyword-first (≤62 chars), meta description reescrita, `meta keywords` removida, `og:url` + dimensões da og:image, JSON-LD com `image`, `logo` e `openingHoursSpecification`.
- `robots.txt` e `sitemap.xml` criados (host `www`), copiados no `Dockerfile` e montados no compose dev.
- `nginx.conf`: `try_files` com `=404` (fim do soft-404), header HSTS nos 3 blocos, gzip para xml/txt.
- Performance: `fetchpriority="high"` no hero, `loading="lazy"` em about-team e logo do footer, peso 300 removido do Google Fonts (não usado no CSS).
- H2 do `#sobre` agora carrega "Conceição do Mato Dentro"; ano do rodapé tem fallback "2026" sem JS.
- Verificado no dev (porta 8888): home/robots/sitemap 200, rota inexistente 404, zero placeholders no HTML servido.

## Ainda não implementado

- **Carrossel de Clientes** (seção removida em 2026-08-31): faltam os logos reais autorizados para restaurar via git.
- **Depoimentos** (seção removida em 2026-08-31): faltam 2-3 depoimentos reais com autorização para restaurar via git.
- **Google Search Console + Google Business Profile**: cadastrar quando o site voltar ao ar — maior alavanca de aquisição local; fora do repositório.
- Itens marcados como "fora de escopo" no spec original (`docs/superpowers/specs/2026-05-12-site-plantaotec-redesign.md`) e nunca retomados: páginas internas por serviço, blog/área de conteúdo, integração do formulário com CRM/backend, animações adicionais além do `reveal on scroll` existente.

## Próxima fatia recomendada

A definir com o responsável — depende de insumos externos (dados/autorização de clientes) que não estão disponíveis no repositório. Candidatas, em ordem de esforço:

1. **Depoimentos reais**: coletar 3+ depoimentos autorizados por clientes e substituir os textos de exemplo em `#depoimentos`.
2. **Logos de clientes**: obter arquivos de logo (SVG/PNG) autorizados e substituir os placeholders `.client-logo` no carrossel de `#clientes`.
3. **Formulário com backend real**: hoje o "envio" só abre o WhatsApp no client-side; se houver necessidade de captar lead sem depender do usuário ter WhatsApp, avaliar endpoint de recebimento (e-mail transacional ou webhook) — mudança de escopo maior, fora do padrão "site estático sem build step" atual.
