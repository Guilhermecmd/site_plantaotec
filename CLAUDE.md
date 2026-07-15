# site_plantaotec — instruções do agente

Site institucional estático em HTML/CSS/JS puro, servido por nginx.

## Início da sessão

1. Leia `PROJECT_STATE.md`.
2. Consulte `docs/MAP.md` para localizar o fan-out.
3. Leia `docs/LESSONS.md`.
4. Abra `docs/PROJECT_REFERENCE.md` apenas para o detalhe histórico necessário.

Anuncie a fatia e confirme sua premissa no código antes de editar.

## Fluxo por fatia

1. Identifique comportamento, risco e consumidores.
2. Escreva teste primeiro para correção ou regra de negócio.
3. Faça a menor mudança completa.
4. Rode teste direcionado e os gates do projeto.
5. Revise diff, segurança, dados e artefatos.
6. Atualize `PROJECT_STATE.md`; lições e mapa somente quando houver conhecimento reutilizável.
7. Faça commit lógico e publique apenas depois da verificação.

## Regras permanentes

- Copy em PT-BR.
- Continuar sem framework e sem build step.
- Preservar --brand #4A5BA8 e --cyan #29C0DF.
- Não trocar identidade sem decisão explícita.
- Não remover CSP ou headers de segurança.
- Novo domínio externo exige ajuste mínimo da CSP.
- Não publicar promessa ou número sem fonte.
- Validar desktop e mobile.

## Comandos

```powershell
docker compose -f docker-compose.dev.yml config
docker build -t plantaotec-site:latest .
```

Fontes detalhadas antigas foram preservadas em `docs/PROJECT_REFERENCE.md`.
