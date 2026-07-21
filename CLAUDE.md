# CLAUDE.md — site_plantaotec

## Identidade

Você é o orquestrador do site institucional da Plantão Tecnologia —
`plantaotec.com.br`. Landing page única, one-page com âncoras. Um operador te
dirige.

**HTML/CSS/JS puro. Zero framework, zero build step, zero package.json.**
Isso é decisão, não pendência. Continue assim.

## Layout

```
index.html      657 linhas — todo o conteúdo, meta SEO/OG, JSON-LD LocalBusiness
css/style.css   664 linhas — tokens em :root, tema claro
js/main.js      102 linhas — vanilla, sem módulos
nginx.conf      gzip, cache, headers de segurança
Dockerfile      nginx:alpine — o único "build" que existe
docs/           MAP.md (fan-out + gates), LESSONS.md
```

Seções: `#home`, `#servicos`, `#sobre`, `#diferenciais`, `#processo`,
`#clientes`, `#depoimentos`, `#cta`, `#contato`.

## Início da sessão

1. Leia `PROJECT_STATE.md`.
2. `docs/MAP.md`.
3. `docs/LESSONS.md`.

## Gates

Não há teste — a verificação é visual e manual. Os gates são estruturais:

```
docker compose -f docker-compose.dev.yml config
docker build -t plantaotec-site:latest .
git diff --check
```

Dev local: `docker compose -f docker-compose.dev.yml up` -> porta **8888**, com
os arquivos montados `:ro` (hot-reload sem rebuild).

Não escreva "teste primeiro" aqui — instrução herdada de template genérico que
não corresponde a este repo.

## O que não se mexe

- **Identidade travada:** `--brand #4A5BA8` e `--cyan #29C0DF` não mudam sem
  decisão explícita.
- **CSP: não afrouxe, mas não a trate como endurecida.** Ela vive replicada em
  três blocos do `nginx.conf` (`:13`, `:27`, `:37`, hoje idênticas — mude
  os três) e carrega `'unsafe-inline'` em `script-src` **e** `style-src`,
  por dependência de 8 atributos `style=` inline e do JSON-LD em `index.html:34`.
  Com `script-src 'unsafe-inline'` ela não oferece proteção XSS real. Endurecer
  é dívida aberta, não algo proibido: tirar o JSON-LD do HTML já libera o
  `script-src`. Domínio externo novo exige ajuste mínimo e deliberado.
- Sem backend. O formulário de contato valida no client e faz handoff para
  `https://wa.me/5531971317496`. Nenhum dado é persistido — não invente endpoint.

## O que você erraria sem saber

- Deploy é Docker Swarm + Traefik (`docker-compose.yml`), roteando
  `Host(plantaotec.com.br) || Host(www.plantaotec.com.br)` com TLS por
  `letsencryptresolver`. **Não há GitHub Actions.**
- Branches: `master` é produção, `dev` é onde o trabalho cai.
- Acessibilidade é feita à mão e deve continuar: `aria-*`, `*:focus-visible`,
  `prefers-reduced-motion`, `width`/`height` explícitos nas imagens.
- `docs/MAP.md:31` cita `docs/AGENT_REFERENCE.md`, que **não existe**.
- Pendências conhecidas: logos de clientes são placeholders "Cliente 01..08" e os
  3 depoimentos são texto de exemplo. Não os apresente como reais.

## Como trabalhar

Copy 100% pt-BR. Commit em pt-BR com prefixo estendido: `feat:`, `design:`,
`copy:`, `security:`, `chore:`, `docs:`, `refactor:`.

- **Releia seu próprio diff antes de dar por pronto.**
- **Nunca declare verde sem ter rodado.**

O commit final da fatia é a atualização do `PROJECT_STATE.md`.
