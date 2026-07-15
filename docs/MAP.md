# Mapa do repositório

## Estrutura

- `index.html` — conteúdo e estrutura
- `css/` — tokens e responsividade
- `js/` — interações
- `assets/` — logo e imagens
- `nginx.conf` — entrega e headers
- `PROMPTS_IMAGENS.md` — assets
- `docs/superpowers/` — specs e planos

## Fan-out

- seção/âncora → navegação, links, foco e mobile
- token CSS → contraste e estados
- asset → caminho, alt, dimensão e Dockerfile
- script → teclado, console e ausência de JS
- domínio externo → CSP
- rota/domínio → Compose e Traefik

## Gates

- `docker compose -f docker-compose.dev.yml config`
- `docker build -t plantaotec-site:latest .`
- `git diff --check`
- revisão de segredos e artefatos

## Referência preservada

`docs/PROJECT_REFERENCE.md` contém o bootstrap anterior completo. Se havia um `AGENTS.md` detalhado, ele está em `docs/AGENT_REFERENCE.md`.
