# Prompts de Imagem — Plantão Tecnologia

Gere as imagens abaixo com o ChatGPT (DALL·E) ou outro gerador.
Salve cada arquivo na pasta `assets/` com o nome indicado.

---

## assets/hero-visual.jpg
**Onde aparece:** Coluna direita do hero (acima da dobra), visível em desktop.
**Dimensões:** 900×700px, formato horizontal/retrato.

**Prompt:**
```
Professional IT support scene for a small Brazilian business.
A confident technician monitors a modern server rack and dual screens
in a clean, organized office. Warm blue tones aligned with #4A5BA8.
Trustworthy, local, human atmosphere. No text overlay.
Photorealistic, horizontal format, natural lighting.
```

---

## assets/about-team.jpg
**Onde aparece:** Coluna direita da seção "Sobre", substituindo os 4 stat cards.
**Dimensões:** 800×600px, formato horizontal.

**Prompt:**
```
Two or three IT professionals in a modern Brazilian office reviewing
infrastructure plans and a laptop screen together. Collaborative,
professional, trustworthy mood. Blue and white color tones.
No text overlay. Photorealistic, horizontal, natural lighting.
```

---

## assets/og-image.jpg
**Onde aparece:** Thumbnail ao compartilhar o link nas redes sociais (WhatsApp, LinkedIn).
**Dimensões:** 1200×630px (padrão Open Graph).

**Prompt:**
```
Clean B2B tech brand cover. Dark blue background (#4A5BA8),
minimalist geometric composition with a cyan (#29C0DF) accent element
on the right side. Space for text on the left (leave it empty).
Corporate, professional, flat design style. No photography.
```

---

## Como usar as imagens depois de geradas

1. Salvar os arquivos em `assets/` com os nomes exatos acima.
2. No `index.html`, substituir o bloco `<aside class="hero-card">` pelo trecho abaixo:

```html
<aside class="reveal delay-2" aria-label="Imagem institucional">
  <img src="assets/hero-visual.jpg"
       alt="Equipe da Plantão Tecnologia em atuação"
       style="width:100%;border-radius:20px;box-shadow:0 24px 48px -16px rgba(74,91,168,0.18);">
</aside>
```

3. Na seção Sobre, substituir `<aside class="about-visual">` por:

```html
<aside class="reveal delay-1" aria-label="Time Plantão Tecnologia">
  <img src="assets/about-team.jpg"
       alt="Time da Plantão Tecnologia"
       style="width:100%;border-radius:20px;border:1px solid var(--line);">
</aside>
```

4. Adicionar no `<head>` do `index.html` (após as metas de Open Graph existentes):

```html
<meta property="og:image" content="https://www.plantaotec.com.br/assets/og-image.jpg" />
<meta name="twitter:image" content="https://www.plantaotec.com.br/assets/og-image.jpg" />
```
