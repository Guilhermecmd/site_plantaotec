# site_plantaotec — Instruções para Claude Code

Site institucional da Plantão Tecnologia (TI gerenciada, segurança, nuvem AWS, IA/automação para empresas em Conceição do Mato Dentro/MG). HTML/CSS/JS estático, zero framework, zero build step, servido por nginx via Docker.

## Início de sessão (leitura obrigatória, nesta ordem)

1. `PROJECT_STATE.md` — estado real do projeto (o que foi implementado, o que falta, próxima fatia). Comece por aqui em vez de re-explorar `index.html`/`css`/`js`/`docs/` do zero: economiza tempo e tokens.
2. `docs/superpowers/specs/` e `docs/superpowers/plans/` — spec e plano do redesign vigente (paleta, copy, estrutura de arquivos).
3. `PROMPTS_IMAGENS.md` — prompts e instruções para gerar/trocar imagens institucionais em `assets/`.

Anuncie a fatia atual no início do trabalho.

## Execução otimizada

Mudanças mecânicas e amplas (reescrever copy em várias seções, replicar um padrão de card em N lugares, trocar assets em lote) podem ser delegadas a um agente de modelo mais barato com brief prescritivo (arquivo exato, trecho ANTES/DEPOIS, como nos planos em `docs/superpowers/plans/`). Decisões de design/copy e a revisão final do diff ficam na sessão principal. Não repita exploração já registrada em `PROJECT_STATE.md`.

## Fluxo de desenvolvimento (por fatia)

Fatias pequenas, ponta a ponta. Não há TDD formal (site estático) — a verificação é visual/manual, documentada no fechamento da fatia: abrir `docker compose -f docker-compose.dev.yml up -d` em `http://localhost:8888`, conferir as páginas/seções afetadas em desktop e em mobile (redimensionar < 980px ou DevTools).

Commits granulares na convenção já usada no `git log` (`feat:`, `design:`, `copy:`, `security:`, `chore:`, `docs:`, `refactor:` — mensagem curta em pt-BR). **Fechamento de docs é o commit final da fatia**: atualizar `PROJECT_STATE.md` (mover item para Implementado + nova Próxima fatia recomendada).

## Regras invioláveis

- Conteúdo e copy em pt-BR; nomes de arquivo/commits também em pt-BR (código/CSS/JS podem ter nomes técnicos em inglês).
- Identidade visual: paleta do logo real (`--brand #4A5BA8`, `--cyan #29C0DF`) e logo em `assets/` — não trocar sem alinhar com o responsável.
- Nada de framework/build step: continua HTML/CSS/JS puro servido por nginx.
- Headers de segurança do `nginx.conf` (CSP, X-Frame-Options, etc.) não podem ser removidos; ao adicionar novo domínio externo (fonte, script, imagem), atualizar o CSP correspondente.

## Comandos

```bash
docker compose -f docker-compose.dev.yml up -d    # dev local — http://localhost:8888, volumes montados (hot-reload)
docker compose -f docker-compose.dev.yml down
docker build -t plantaotec-site:latest .          # valida o build de produção (Dockerfile copia css/js/assets)
```

Produção usa `docker-compose.yml` (Traefik, TLS via Let's Encrypt, domínio `plantaotec.com.br`) — não é para rodar localmente.
