# Plantão Tecnologia — Redesign do Site
**Data:** 2026-05-12  
**Status:** Aprovado para implementação

---

## Objetivo

Refatorar o site institucional da Plantão Tecnologia para:
- Converter melhor visitantes B2B (donos, gestores, diretores)
- Alinhar paleta de cores ao logo real da marca
- Separar o arquivo único em múltiplos arquivos (HTML, CSS, JS, assets)
- Adicionar os 2 serviços ausentes (Consultoria e Sites)
- Reescrever todos os textos no tom "resultado + transformação"
- Melhorar segurança via headers HTTP no nginx
- Gerar documento de prompts de imagem para geração com IA

---

## Estrutura de arquivos

```
site_plantaotec/
├── index.html              ← só estrutura semântica
├── css/
│   └── style.css           ← todo o CSS extraído
├── js/
│   └── main.js             ← todo o JS extraído
├── assets/
│   ├── logo.png            ← logo colorido (nav, footer claro)
│   ├── logo-white.png      ← logo branco (hero, footer escuro)
│   ├── logo-icon.png       ← ícone isolado (favicon)
│   ├── hero-visual.jpg     ← slot — imagem lado direito do hero
│   ├── about-team.jpg      ← slot — seção Sobre
│   └── og-image.jpg        ← slot — thumbnail redes sociais
├── PROMPTS_IMAGENS.md      ← prompts para geração no ChatGPT
├── nginx.conf
├── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
└── .dockerignore
```

---

## Paleta de cores

| Variável       | Valor     | Uso                                      |
|----------------|-----------|------------------------------------------|
| `--brand`      | `#4A5BA8` | Azul principal (do logo)                 |
| `--brand-2`    | `#3A4B98` | Azul escuro (hover, gradiente)           |
| `--cyan`       | `#29C0DF` | Ciano do logo (destaques inline, ícones) |
| `--accent`     | `#E8472C` | Vermelho — exclusivo para CTAs           |
| `--accent-soft`| `#FCE9E2` | Fundo suave dos badges                   |
| `--ok`         | `#128A6E` | Verde de status/sucesso                  |
| `--bg`         | `#FFFFFF` | Fundo principal                          |
| `--surface`    | `#FAF9F6` | Fundo de cards                           |
| `--text`       | `#0B1220` | Texto principal                          |
| `--muted`      | `#5B6573` | Texto secundário                         |

---

## Logo

- **Nav (fundo claro):** `<img src="assets/logo.png" alt="Plantão Tecnologia" height="36">`
- **Hero / footer (fundo escuro):** `<img src="assets/logo-white.png" alt="Plantão Tecnologia" height="36">`
- **Favicon:** `assets/logo-icon.png` referenciado como `<link rel="icon">`

---

## Hero

**Eyebrow:** Conceição do Mato Dentro · MG e Região

**Headline:**
> Enquanto você foca no negócio,  
> a Plantão **cuida da TI.**

*(palavra "cuida da TI." em `--cyan`)*

**Subtítulo:**
> Empresas que param de improvisar TI crescem mais rápido. Assumimos sua operação com contrato, SLA e atendimento humano de quem está aqui.

**CTAs:** "Fale Conosco →" (btn-primary) · "Ver soluções" (btn-outline)

**Layout:** Grid 2 colunas — texto à esquerda, slot de imagem (`hero-visual.jpg`) à direita. Se imagem não estiver disponível, mantém o card de soluções atual como fallback.

**Trust bar (4 células):** Atuação · Foco · Stack · Modelo — sem alteração de conteúdo.

---

## Serviços — 8 cards

| # | Título | Headline | Tag(s) |
|---|--------|----------|--------|
| 01 | Suporte e TI gerenciada | Sua TI operada. Sua equipe, livre. | Sem imprevisto · SLA no contrato |
| 02 | Infraestrutura e redes | Base técnica que aguenta crescer. | Escalável · Documentado |
| 03 | Segurança da informação | Proteção antes do incidente. | Proativo · LGPD |
| 04 | Backup e continuidade | Quando algo falhar, você está de pé. | Testado · RPO/RTO definido |
| 05 | Nuvem AWS | Escale sob demanda. Pague pelo que usa. | FinOps · Sem surpresa na fatura |
| 06 | IA e automação | Faça mais com a mesma equipe. | +Produtividade · Sem contratar |
| 07 | Consultoria de TI *(novo)* | Decisões técnicas com quem conhece seu cenário. | Diagnóstico · Planejamento · Projetos pontuais |
| 08 | Criação de sites *(novo)* | Presença digital que trabalha por você. | Conversão · Manutenção inclusa |

Grid: 3 colunas no desktop → 2 no tablet → 1 no mobile.

---

## Seção Sobre

**Headline:**
> Domínio técnico de quem opera, com a **presença local** de quem está aqui.

**Texto (3 parágrafos — tom resultado):**
1. A Plantão nasceu para as empresas da região pararem de improvisar TI e começarem a ter um parceiro técnico de verdade.
2. Atuamos com TI gerenciada, segurança, nuvem AWS, consultoria e criação de sites. Atendimento local em Conceição do Mato Dentro, com capacidade técnica de cloud e IA.
3. Não vendemos hora avulsa de pânico. Vendemos previsibilidade — com SLA escrito, processo claro e gente que atende quando precisar.

**Visual:** slot `about-team.jpg` no lugar do painel de stats atual. Se imagem indisponível, mantém os 4 stat cards como fallback.

---

## Diferenciais — 4 cards

| Ícone | Título | Texto |
|-------|--------|-------|
| Relógio | SLA que você assina | Janelas de atendimento definidas em contrato. Sem labirinto de protocolo, sem depender da boa vontade do fornecedor. |
| Escudo | Segurança de verdade | Firewall, EDR e backup testado. Tratamos seus dados com a mesma paranoia que tratamos os nossos. |
| Nuvem | Nuvem no tamanho certo | AWS dimensionada pelo seu volume real. Nenhuma arquitetura de startup sendo cobrada do seu CNPJ. |
| Engrenagem | Automação que libera tempo | IA e automação só fazem sentido se eliminam fricção. Mapeamos, entregamos e mantemos. |

---

## Processo — 4 passos (sem alteração estrutural, copy atualizado)

1. **Diagnóstico técnico** — Levantamento do ambiente, mapeamento de riscos. Saímos com clareza, não com promessa.
2. **Proposta sob medida** — Escopo, tecnologia e SLA definidos juntos. Sem letra miúda.
3. **Implantação e onboarding** — Execução documentada, checkpoints no calendário. Você sabe o que acontece e quando.
4. **Operação acompanhada** — Monitoramento contínuo, reuniões periódicas. A Plantão não some depois da entrega.

---

## Seções sem alteração estrutural

- **Clientes:** carrossel mantido, slots de logo documentados nos comentários HTML
- **Depoimentos:** 3 cards, textos anônimos (substituir com reais quando disponíveis)
- **CTA Banner:** hero dark com botões "Fale Conosco" + "Chamar no WhatsApp"
- **Formulário de contato:** mantido, handoff para WhatsApp
- **Footer:** atualizado com logo branco e links existentes

---

## Segurança — nginx.conf

Headers adicionados:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';" always;
server_tokens off;
```

---

## PROMPTS_IMAGENS.md — conteúdo

### hero-visual.jpg
```
Professional IT support scene for a Brazilian small business. A focused technician 
in a clean office environment monitors server infrastructure on dual screens. 
Warm blue tones (#4A5BA8), modern and trustworthy atmosphere. 
No text. Horizontal format 1200x800px. Photorealistic.
```

### about-team.jpg
```
Small professional IT team of 2-3 people in a modern Brazilian office, 
reviewing infrastructure plans together. Collaborative, trustworthy atmosphere. 
Blue and white tones. No text. Horizontal 1200x800px. Photorealistic.
```

### og-image.jpg
```
Clean tech brand cover image. Dark blue background (#4A5BA8), 
white text area placeholder, cyan (#29C0DF) geometric accent on the right. 
Minimalist, corporate, B2B. 1200x630px. No photography, flat design.
```

---

## Dockerfile — alteração

Adicionar cópia dos novos diretórios:

```dockerfile
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/
```

---

## Fora de escopo

- Páginas internas por serviço (pode vir em próxima iteração)
- Blog ou área de conteúdo
- Integração com CRM ou formulário backend
- Animações adicionais além das já existentes
