# Estado do Projeto — site_plantaotec

## Status

Site institucional em produção (branch `master`, `origin/master` em dia, working tree limpo). Redesign completo v1 (2026-05-12/13) implementado e commitado; sem trabalho em andamento no momento desta leitura.

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

## Ainda não implementado

- **Carrossel de Clientes**: ainda usa placeholders (`Cliente 01`…`Cliente 08`) em `index.html#clientes` — comentário no HTML já documenta como substituir por `<img>` reais, faltam os logos dos clientes.
- **Depoimentos**: os 3 cards em `index.html#depoimentos` são textos anônimos de exemplo, com nota explícita no HTML para substituir por depoimentos reais após autorização do cliente.
- Itens marcados como "fora de escopo" no spec original (`docs/superpowers/specs/2026-05-12-site-plantaotec-redesign.md`) e nunca retomados: páginas internas por serviço, blog/área de conteúdo, integração do formulário com CRM/backend, animações adicionais além do `reveal on scroll` existente.

## Próxima fatia recomendada

A definir com o responsável — depende de insumos externos (dados/autorização de clientes) que não estão disponíveis no repositório. Candidatas, em ordem de esforço:

1. **Depoimentos reais**: coletar 3+ depoimentos autorizados por clientes e substituir os textos de exemplo em `#depoimentos`.
2. **Logos de clientes**: obter arquivos de logo (SVG/PNG) autorizados e substituir os placeholders `.client-logo` no carrossel de `#clientes`.
3. **Formulário com backend real**: hoje o "envio" só abre o WhatsApp no client-side; se houver necessidade de captar lead sem depender do usuário ter WhatsApp, avaliar endpoint de recebimento (e-mail transacional ou webhook) — mudança de escopo maior, fora do padrão "site estático sem build step" atual.
