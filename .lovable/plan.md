

## Atualizar Schema De/Para com "Contabilizacao Organica" e "Contabilizacao Programatica"

### Objetivo
Quando o usuario selecionar um sistema de origem na tela De/Para, as opcoes de schema devem ser fixas: **"Contabilizacao Organica"** e **"Contabilizacao Programatica"**. Apos selecionar o schema, o campo de versao aparece para selecao. A logica simula que o backend identifica o schema de origem e faz o vinculo com o schema destino.

### Mudancas no arquivo `src/pages/DeParaMapping.tsx`

1. **Alterar os dados de `filesBySystem`** para que todos os sistemas tenham as mesmas duas opcoes de schema:
   - "Contabilizacao Organica" (com seus campos e versoes proprios)
   - "Contabilizacao Programatica" (com seus campos e versoes proprios)

2. **Atualizar `schemaFields`** com campos relevantes para cada tipo de contabilizacao:
   - **Organica**: campos como Poder, Orgao, Unidade Orcamentaria, Unidade Gestora, etc.
   - **Programatica**: campos como Funcao, Subfuncao, Programa, Acao, etc.

3. **Manter o fluxo progressivo existente**: Sistema -> Schema -> Versao -> Regras de mapeamento (sem mudanca de UX, apenas os dados mudam).

4. **Atualizar o mock de edicao** (useEffect para `id !== "new"`) para refletir os novos IDs de schema.

### Detalhes Tecnicos

- Os IDs dos schemas serao `contabilizacao_organica` e `contabilizacao_programatica`
- Cada sistema tera as mesmas duas opcoes de schema, mas com versoes potencialmente diferentes (simulando que o backend resolve o vinculo por sistema)
- Os campos de origem (`schemaFields`) serao diferenciados por tipo de contabilizacao
- Nenhuma dependencia nova sera necessaria

