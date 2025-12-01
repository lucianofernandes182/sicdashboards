# Requisitos Funcionais - Tela de Comparação de VPDs

## 1. Objetivo

A tela de Comparação de VPDs permite reconciliar e validar dados financeiros de Variações Patrimoniais Diminutivas (VPDs) entre duas fontes de informação:

- **CP (Contabilidade Pública)**: Valores oficiais registrados na contabilidade pública
- **SIC (Sistema de Informações de Custo)**: Valores agregados provenientes de múltiplos sistemas integrados de gestão

O objetivo é identificar divergências entre essas fontes, analisá-las e aprovar a reconciliação quando os valores estiverem validados.

---

## 2. Contexto de Uso

### 2.1 Usuários

- Contadores públicos
- Gestores de custos
- Auditores internos
- Controladores financeiros

### 2.2 Quando Utilizar

- Mensalmente, após o fechamento contábil
- Durante auditorias e revisões financeiras
- Quando houver necessidade de conciliação de dados entre sistemas

---

## 3. Funcionalidades Principais

### 3.1 Seleção de Período

**Descrição**: O usuário seleciona o mês e ano para realizar a comparação.

**Comportamento**:
- Sistema exibe dados referentes ao período selecionado
- Cada período possui um status: pendente ou aprovado
- Períodos já aprovados não podem ser editados

### 3.2 Visualização de Modelos

**Descrição**: Os dados são organizados em dois modelos distintos que representam diferentes visões da estrutura organizacional:

**Modelo Orgânico**:
- Organização por secretarias e órgãos governamentais
- Estrutura administrativa da entidade

**Modelo Programático**:
- Organização por programas e projetos governamentais
- Estrutura de planejamento orçamentário

### 3.3 Estrutura Hierárquica de Dados

**Descrição**: Os valores são organizados em três níveis hierárquicos:

**Nível 1 - Grupo Principal**:
- Representa grandes categorias de despesas
- Exemplo: "PESSOAL E ENCARGOS", "OUTRAS DESPESAS CORRENTES"
- Cada grupo possui um código principal (ex: 3.1.0.0.00.00.00)

**Nível 2 - Subgrupo**:
- Subdivisões dentro de cada grupo principal
- Exemplo: dentro de "PESSOAL E ENCARGOS" há "REMUNERAÇÃO A PESSOAL"
- Código de subgrupo (ex: 3.1.1.0.00.00.00)

**Nível 3 - VPD Individual**:
- Detalhamento específico de cada tipo de despesa
- Exemplo: "Vencimentos", "Gratificações", "Adicionais"
- Código da VPD (ex: 3.1.1.1.00.00.00)

**Navegação**:
- Usuário pode expandir e recolher cada nível para visualizar detalhes
- Totais são exibidos em cada nível da hierarquia

### 3.4 Comparação de Valores

**Descrição**: Para cada item da hierarquia, o sistema exibe dois valores lado a lado:

**Valor CP (Contabilidade Pública)**:
- Valor oficial registrado na contabilidade
- Fonte única de verdade contábil

**Valor SIC (Sistema de Informações de Custo)**:
- Soma dos valores de múltiplos sistemas integrados
- Representa a consolidação operacional

**Totalização**:
- Valores de VPDs individuais são somados para formar o total do subgrupo
- Valores de subgrupos são somados para formar o total do grupo principal
- Valores de grupos são somados para formar o total do modelo
- Cada modelo tem seu próprio total geral

### 3.5 Identificação de Divergências

**Descrição**: O sistema identifica automaticamente quando há diferença entre os valores CP e SIC.

**Indicadores Visuais**:
- Badge "SIC ≠ CP" aparece quando há divergência
- Seta para cima (↗) indica que SIC é maior que CP
- Seta para baixo (↘) indica que SIC é menor que CP
- Valor da diferença é exibido entre parênteses
- Ícone de alerta destaca VPDs com divergência

**Exemplo**:
```
Gratificações
CP: R$ 8.000.000,00 (R$ -50.000,00)
SIC: R$ 7.950.000,00
[Badge: SIC ≠ CP ↘]
```

Neste caso, o SIC tem R$ 50.000,00 a menos que o CP.

### 3.6 Detalhamento dos Valores SIC por Sistema

**Descrição**: Cada valor SIC é resultado da soma de valores vindos de diferentes sistemas integrados.

**Funcionalidade de Drill-Down**:
- Usuário pode expandir qualquer VPD individual
- Sistema exibe a decomposição do valor SIC por sistema de origem
- Mostra quais sistemas contribuíram e com quanto

**Sistemas Integrados Comuns**:
- SMARCP (Sistema de Controle Patrimonial)
- SMARRH (Sistema de Recursos Humanos)
- SMARAM (Sistema de Almoxarifado e Material)
- SMARCO (Sistema de Controle Contábil)
- Outros sistemas específicos da organização

**Exemplo de Decomposição**:
```
VPD: Gratificações - R$ 7.950.000,00
  └── Detalhamento por Sistema:
      ├── SMARRH Sistema 1: R$ 4.000.000,00
      ├── SMARRH Sistema 2: R$ 2.500.000,00
      └── SMARCP: R$ 1.450.000,00
      ───────────────────────────────────
      Total SIC: R$ 7.950.000,00
```

**Utilidade**:
- Permite rastrear a origem exata de cada valor
- Facilita identificação de qual sistema está causando divergência
- Auxilia na correção de inconsistências na fonte

### 3.7 Processo de Aprovação

**Descrição**: Após analisar todas as divergências, o usuário pode aprovar a reconciliação.

**Pré-requisitos para Aprovação**:
- Todas as divergências devem ter sido analisadas
- Diferenças devem estar justificadas ou corrigidas
- Usuário deve estar ciente dos valores finais

**Ação de Aprovação**:
- Botão "Aprovar Reconciliação" disponível quando status é "pendente"
- Ao aprovar, status muda para "aprovado"
- Registro aprovado não pode mais ser editado

**Indicação Visual**:
- Badge "Aprovado" com ícone de verificação
- Cor verde indica status aprovado

---

## 4. Regras de Negócio

### 4.1 Soma de Valores

**Regra**: Os valores são sempre somados de baixo para cima na hierarquia.

**Sequência de Cálculo**:
1. Soma das VPDs individuais → Total do Subgrupo
2. Soma dos Subgrupos → Total do Grupo Principal
3. Soma dos Grupos → Total do Modelo

**Importante**: 
- A soma é feita separadamente para CP e SIC
- Uma divergência em uma VPD individual pode ou não propagar divergência nos níveis superiores (depende de compensações)

### 4.2 Validação de Divergências

**Regra**: Uma divergência existe quando o valor CP é diferente do valor SIC.

**Critérios**:
- Comparação exata de valores (não há margem de tolerância)
- Divergências são identificadas em qualquer nível da hierarquia
- Sistema marca visualmente todos os níveis onde há divergência

### 4.3 Imutabilidade de Registros Aprovados

**Regra**: Registros com status "aprovado" não podem ser alterados.

**Razão**: 
- Garantir integridade histórica
- Manter trilha de auditoria
- Prevenir alterações após validação oficial

**Alternativa**:
- Para revisar um período aprovado, criar novo registro com justificativa

### 4.4 Periodicidade

**Regra**: Cada período (mês/ano) possui seu próprio registro de comparação.

**Comportamento**:
- Registros de diferentes períodos são independentes
- Um período pode estar aprovado enquanto outro está pendente
- Não há dependência entre períodos

---

## 5. Benefícios da Funcionalidade

### 5.1 Para Contadores

- Validação rápida de consistência entre sistemas
- Identificação imediata de divergências
- Rastreabilidade da origem dos valores

### 5.2 Para Gestores

- Visão consolidada de custos por diferentes perspectivas
- Confiança na qualidade dos dados financeiros
- Evidência de controles internos para auditorias

### 5.3 Para Auditores

- Trilha completa de reconciliação
- Transparência sobre diferenças identificadas
- Registro histórico imutável após aprovação

---

## 6. Fluxo de Trabalho Típico

1. **Seleção do Período**
   - Usuário acessa a tela e seleciona mês/ano

2. **Análise do Modelo Orgânico**
   - Visualiza totais gerais
   - Identifica grupos com divergência
   - Expande para ver subgrupos e VPDs específicas

3. **Investigação de Divergências**
   - Expande VPDs com divergência
   - Visualiza decomposição por sistema SIC
   - Identifica qual sistema está gerando a diferença

4. **Análise do Modelo Programático**
   - Repete o processo para a visão programática
   - Verifica se as mesmas divergências aparecem

5. **Justificativa e Correção**
   - Documenta razões para diferenças aceitáveis
   - Solicita correções em sistemas quando necessário
   - Aguarda atualização de valores

6. **Aprovação**
   - Após validar que divergências estão justificadas ou corrigidas
   - Clica em "Aprovar Reconciliação"
   - Sistema registra aprovação e torna registro imutável

---

## 7. Cenários de Uso

### Cenário 1: Divergência por Lançamento Atrasado

**Situação**: 
- CP mostra R$ 10.000.000,00
- SIC mostra R$ 9.800.000,00
- Diferença de R$ 200.000,00

**Investigação**:
- Expandir VPD para ver sistemas SIC
- Identificar que SMARRH Sistema 2 ainda não processou folha complementar

**Resolução**:
- Aguardar processamento do sistema
- Verificar novamente após atualização
- Aprovar quando valores coincidirem

### Cenário 2: Diferença Legítima por Critério Contábil

**Situação**:
- CP mostra R$ 5.000.000,00
- SIC mostra R$ 5.100.000,00
- Diferença de R$ 100.000,00

**Investigação**:
- Identificar que diferença é devido a provisões contábeis
- CP inclui provisão de férias, SIC trabalha com valores pagos

**Resolução**:
- Documentar justificativa da diferença
- Aprovar reconciliação com divergência justificada
- Manter registro da explicação

### Cenário 3: Erro de Sistema Identificado

**Situação**:
- CP mostra R$ 3.000.000,00
- SIC mostra R$ 3.500.000,00
- Diferença significativa de R$ 500.000,00

**Investigação**:
- Drill-down identifica que SMARAM está duplicando valores
- Problema técnico no sistema de origem

**Resolução**:
- Acionar equipe técnica para correção no sistema
- NÃO aprovar até correção
- Manter período como pendente até resolução

---

## 8. Termos e Definições

- **VPD**: Variação Patrimonial Diminutiva - representa diminuição no patrimônio público (despesas)
- **CP**: Contabilidade Pública - sistema oficial de registro contábil
- **SIC**: Sistema de Informações de Custo - consolidação de sistemas operacionais
- **Reconciliação**: Processo de comparação e validação de valores entre diferentes fontes
- **Drill-down**: Navegação de dados agregados para dados detalhados
- **Divergência**: Diferença identificada entre valores CP e SIC

---

**Versão:** 1.0  
**Data:** Dezembro 2025  
**Tipo de Documento:** Requisitos Funcionais
