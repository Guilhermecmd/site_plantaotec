# Mensuração — como ligar analytics sem tocar no código do site

O site não carrega nenhuma tag hoje (sem GA4, GTM, Pixel). O que existe é a
**camada de eventos**: `js/main.js` empurra objetos para `window.dataLayer`
(o formato que o Google Tag Manager e o GA4 consomem).

## Eventos disparados

| `event`          | Quando                                                | `label` (origem)                                                                 |
|------------------|-------------------------------------------------------|----------------------------------------------------------------------------------|
| `whatsapp_click` | clique em qualquer link `wa.me`                       | `hero`, `banner`, `faq`, `contato`, `footer`, `flutuante`, `menu_mobile`, `servico_*`, `404` |
| `cta_click`      | clique em "Solicitar diagnóstico" / "Falar com a Plantão" | `nav`, `menu_mobile`, `sobre`, `banner`                                       |
| `form_submit`    | formulário validado e WhatsApp aberto                 | `contato`                                                                        |
| `email_click`    | clique em `mailto:`                                   | `contato`, `footer`                                                              |
| `area_cliente`   | clique em Área do Cliente                             | `nav`, `menu_mobile`, `footer`                                                   |
| `social_click`   | Instagram / LinkedIn                                  | `instagram`, `linkedin`, `*_footer`                                              |

Cada evento leva também `href` (URL de destino). Para adicionar um novo ponto
de medição basta pôr `data-track="nome_do_evento" data-track-label="origem"` no
link ou botão; o listener global cuida do resto.

## Passo a passo para ativar (fora do repositório)

1. Criar a propriedade GA4 e o contêiner GTM.
2. No GTM, criar variáveis de camada de dados `label` e `href`, um gatilho de
   evento personalizado por nome acima (ou um gatilho com regex
   `whatsapp_click|cta_click|form_submit|email_click|area_cliente|social_click`)
   e uma tag GA4 Event que repasse `label` e `href` como parâmetros.
3. Marcar `whatsapp_click` e `form_submit` como conversões no GA4.
4. **No código** (única alteração necessária):
   - `index.html`, `404.html`, `privacidade.html`: inserir o snippet do GTM
     **como arquivo externo**, não inline — a CSP bloqueia scripts inline. Ex.:
     `<script src="js/gtm.js?v=..." defer></script>` contendo o snippet, com o
     ID do contêiner.
   - `security-headers.conf`: acrescentar `https://www.googletagmanager.com` em
     `script-src` e, para o GA4, `https://*.google-analytics.com
     https://*.analytics.google.com` em `connect-src`. Se usar Meta Pixel,
     acrescentar `https://connect.facebook.net` (script) e
     `https://www.facebook.com` (img/connect).
   - `privacidade.html`: atualizar a seção "Cookies e rastreadores" e avaliar
     banner de consentimento (LGPD) antes de carregar tags que usem cookies.
5. Google Search Console: verificar a propriedade de domínio
   (`plantaotec.com.br`) via DNS e enviar `https://www.plantaotec.com.br/sitemap.xml`.
6. Google Business Profile: cadastrar a empresa com o mesmo nome, telefone e
   cidade usados no JSON-LD (NAP consistente) e apontar para o site.
