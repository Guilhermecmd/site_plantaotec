# Lições

Registre somente conclusões permanentes que evitem repetir erro.

## L1 — Estado não é histórico

`PROJECT_STATE.md` descreve o presente. Detalhes antigos ficam em `docs/PROJECT_REFERENCE.md`; regras e fan-out ficam nos documentos próprios.

## L2 — Premissa precisa ser conferida

Documentação pode envelhecer. Antes de implementar, confirme no código, nos testes e no schema se a afirmação ainda é verdadeira.

## L3 — Verificação acompanha o risco

Teste direcionado mostra a mudança; a suíte e o diff final mostram a integração. Mudanças de dados, dinheiro ou segurança exigem o gate mais forte disponível.

## L4 — Fan-out vem antes da edição

Mapear consumidores evita corrigir uma tela e deixar API, relatório, importação ou rotina divergente.

## L5 — Trabalho só existe quando está no Git

Mudança concluída deve estar commitada, verificada e publicada; arquivos locais e artefatos nunca substituem histórico remoto.
