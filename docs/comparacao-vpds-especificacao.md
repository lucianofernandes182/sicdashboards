# Documentação Técnica - Tela de Comparação de VPDs

## 1. Visão Geral

A tela de Comparação de VPDs (Valores Patrimoniais Divergentes) tem como objetivo reconciliar dados financeiros entre duas fontes principais:
- **CP (Controle Patrimonial)**: Fonte de dados dos VPDs
- **SIC (Sistemas Integrados de Contabilidade)**: Agregação de múltiplos sistemas integrados

A comparação é realizada por período (mês/ano) e organizada em dois modelos distintos: **Modelo Orgânico** e **Modelo Programático**.

---

## 2. Estrutura Hierárquica de Dados

### 2.1 Níveis Hierárquicos

A estrutura de dados segue uma hierarquia de 4 níveis:

```
Registro de Comparação (mês/ano)
├── Modelo Orgânico
│   ├── Grupo Principal (ex: 3.1.0.0.00.00.00)
│   │   ├── Subgrupo (ex: 3.1.1.0.00.00.00)
│   │   │   └── VPD Individual (ex: 3.1.1.1.00.00.00)
│   │   └── ...
│   └── ...
└── Modelo Programático
    └── (mesma estrutura)
```

### 2.2 Interface de Dados

```typescript
interface VPDDetail {
  codigo: string;           // Código hierárquico da VPD (ex: 3.1.1.1.00.00.00)
  descricao: string;        // Descrição textual da VPD
  valorCP: number;          // Valor do Controle Patrimonial
  valorSIC: number;         // Valor agregado dos Sistemas Integrados
}

interface VPDSubGroup {
  codigo: string;           // Código do subgrupo
  descricao: string;        // Descrição do subgrupo
  totalCP: number;          // Soma de todos os valorCP das VPDs filhas
  totalSIC: number;         // Soma de todos os valorSIC das VPDs filhas
  vpds: VPDDetail[];        // Array de VPDs individuais
}

interface VPDGroup {
  codigoPrincipal: string;  // Código do grupo principal
  descricao: string;        // Descrição do grupo
  totalCP: number;          // Soma de todos os totalCP dos subgrupos
  totalSIC: number;         // Soma de todos os totalSIC dos subgrupos
  subgrupos: VPDSubGroup[]; // Array de subgrupos
}

interface VPDRecord {
  id: string;               // Identificador único do registro
  mes: string;              // Mês de referência (formato: "01" a "12")
  ano: string;              // Ano de referência (formato: "YYYY")
  status: "aprovado" | "pendente"; // Status de aprovação
  modeloOrganico: {
    totalVPDs: number;      // Soma total de todos os grupos (CP)
    totalSIC: number;       // Soma total de todos os grupos (SIC)
    gruposVPD: VPDGroup[];  // Array de grupos VPD
  };
  modeloProgramatico: {
    totalVPDs: number;      // Soma total de todos os grupos (CP)
    totalSIC: number;       // Soma total de todos os grupos (SIC)
    gruposVPD: VPDGroup[];  // Array de grupos VPD
  };
}
```

---

## 3. Regras de Soma e Cálculo

### 3.1 Soma Ascendente (Bottom-Up)

Os valores são somados de baixo para cima na hierarquia:

```
VPD Individual (nível mais baixo)
    ↓ soma
Subgrupo
    ↓ soma
Grupo Principal
    ↓ soma
Total do Modelo (Orgânico ou Programático)
```

### 3.2 Fórmulas de Cálculo

#### Nível 1: Total do Subgrupo
```typescript
subgrupo.totalCP = Σ(vpd.valorCP) para todas as vpds do subgrupo
subgrupo.totalSIC = Σ(vpd.valorSIC) para todas as vpds do subgrupo
```

**Exemplo:**
```
Subgrupo: 3.1.1.0.00.00.00 - REMUNERAÇÃO A PESSOAL
├── 3.1.1.1.00.00.00: Vencimentos (CP: 25.000.000,00 | SIC: 25.000.000,00)
├── 3.1.1.2.00.00.00: Gratificações (CP: 8.000.000,00 | SIC: 7.950.000,00)
└── 3.1.1.3.00.00.00: Adicionais (CP: 2.205.989,39 | SIC: 2.255.989,39)

Total do Subgrupo:
- totalCP = 25.000.000,00 + 8.000.000,00 + 2.205.989,39 = 35.205.989,39
- totalSIC = 25.000.000,00 + 7.950.000,00 + 2.255.989,39 = 35.205.989,39
```

#### Nível 2: Total do Grupo Principal
```typescript
grupo.totalCP = Σ(subgrupo.totalCP) para todos os subgrupos do grupo
grupo.totalSIC = Σ(subgrupo.totalSIC) para todos os subgrupos do grupo
```

**Exemplo:**
```
Grupo: 3.1.0.0.00.00.00 - PESSOAL E ENCARGOS
├── Subgrupo 3.1.1: totalCP=35.205.989,39 | totalSIC=35.205.989,39
├── Subgrupo 3.1.2: totalCP=5.240.514,20 | totalSIC=5.240.514,20
├── Subgrupo 3.1.3: totalCP=2.500.000,00 | totalSIC=2.500.000,00
└── Subgrupo 3.1.8: totalCP=2.504.000,00 | totalSIC=2.504.000,00

Total do Grupo:
- totalCP = 35.205.989,39 + 5.240.514,20 + 2.500.000,00 + 2.504.000,00 = 45.450.503,59
- totalSIC = 35.205.989,39 + 5.240.514,20 + 2.500.000,00 + 2.504.000,00 = 45.450.503,59
```

#### Nível 3: Total do Modelo
```typescript
modelo.totalVPDs = Σ(grupo.totalCP) para todos os grupos do modelo
modelo.totalSIC = Σ(grupo.totalSIC) para todos os grupos do modelo
```

**Exemplo:**
```
Modelo Orgânico
├── Grupo 3.1.0: totalCP=45.450.503,59 | totalSIC=45.450.503,59
├── Grupo 3.2.0: totalCP=2.800.000,00 | totalSIC=2.800.000,00
├── Grupo 3.3.0: totalCP=18.124.617,94 | totalSIC=18.174.617,94
├── Grupo 3.7.0: totalCP=1.800.000,00 | totalSIC=1.800.000,00
└── Grupo 3.9.0: totalCP=2.300.000,00 | totalSIC=2.300.000,00

Total do Modelo:
- totalVPDs = 45.450.503,59 + 2.800.000,00 + 18.124.617,94 + 1.800.000,00 + 2.300.000,00 = 70.475.120,53
- totalSIC = 45.450.503,59 + 2.800.000,00 + 18.174.617,94 + 1.800.000,00 + 2.300.000,00 = 70.525.120,53
```

---

## 4. Detalhamento dos Valores SIC - Sistemas

### 4.1 Conceito

O valor **SIC (Sistema Integrado de Contabilidade)** representa a **agregação de múltiplos sistemas integrados** que alimentam dados financeiros. Cada VPD pode ter valores provenientes de diferentes sistemas de origem.

### 4.2 Sistemas de Origem

Os sistemas integrados podem incluir (mas não se limitam a):
- **SMARCP** - Sistema de Controle Patrimonial
- **SMARRH** - Sistema de Recursos Humanos
- **SMARAM** - Sistema de Almoxarifado e Material
- **SMARCO** - Sistema de Controle Contábil
- Outros sistemas específicos da organização

### 4.3 Agregação de Valores SIC

Para cada VPD individual, o valor SIC é calculado como:

```typescript
vpd.valorSIC = Σ(valor do sistema X) para todos os sistemas integrados
```

**Exemplo conceitual:**
```
VPD: 3.1.1.2.00.00.00 - Gratificações
├── SMARRH Sistema 1: R$ 4.000.000,00
├── SMARRH Sistema 2: R$ 2.500.000,00
└── SMARCP: R$ 1.450.000,00

valorSIC = 4.000.000,00 + 2.500.000,00 + 1.450.000,00 = 7.950.000,00
```

### 4.4 Drill-Down por Sistema

A interface permite expandir cada VPD para visualizar a **decomposição por sistema de origem**:

```
VPD Individual (valorSIC total)
    ↓ expandir
Detalhamento por Sistema
├── Sistema A: valor X
├── Sistema B: valor Y
└── Sistema C: valor Z
```

Essa funcionalidade permite rastrear a origem exata de cada valor e identificar quais sistemas estão contribuindo para divergências.

---

## 5. Validações e Regras de Divergência

### 5.1 Definição de Divergência

Uma divergência ocorre quando:
```typescript
valorCP ≠ valorSIC
```

A função de validação implementada é:
```typescript
const hasDivergence = (cpValue: number, sicValue: number): boolean => {
  return cpValue !== sicValue;
};
```

### 5.2 Cálculo do Valor de Divergência

```typescript
const getDivergenceAmount = (cpValue: number, sicValue: number): number => {
  return sicValue - cpValue;
};
```

**Interpretação:**
- **Valor Positivo**: SIC > CP (sistemas integrados têm valor maior)
- **Valor Negativo**: SIC < CP (sistemas integrados têm valor menor)
- **Zero**: Não há divergência

### 5.3 Propagação de Divergências

As divergências se propagam de baixo para cima:

1. **Nível VPD**: Se `vpd.valorCP ≠ vpd.valorSIC` → divergência identificada
2. **Nível Subgrupo**: Se qualquer VPD filha tem divergência OU `subgrupo.totalCP ≠ subgrupo.totalSIC`
3. **Nível Grupo**: Se qualquer subgrupo tem divergência OU `grupo.totalCP ≠ grupo.totalSIC`
4. **Nível Modelo**: Se qualquer grupo tem divergência OU `modelo.totalVPDs ≠ modelo.totalSIC`

### 5.4 Indicadores Visuais de Divergência

#### Em todos os níveis hierárquicos:

**Badge "SIC ≠ CP"**: Indica presença de divergência
- Cor: Âmbar (`border-amber-500 text-amber-700`)
- Ícone direcional:
  - ↗ `TrendingUp`: SIC > CP
  - ↘ `TrendingDown`: SIC < CP
  - − `Minus`: SIC = CP (sem divergência)

**Valor de Diferença**: Exibe o valor exato da divergência
```
CP: R$ 8.000.000,00 (R$ -50.000,00)
```
- Primeiro valor: valor do CP
- Entre parênteses: diferença (SIC - CP)

#### No nível de VPD individual:

**Ícone de Alerta**: `AlertTriangle` com animação pulse
- Aparece quando há divergência
- Cor: Âmbar (`text-amber-500`)

---

## 6. Workflow de Aprovação

### 6.1 Estados do Registro

```typescript
type Status = "pendente" | "aprovado";
```

- **Pendente**: Registro em análise, permite edição e revisão
- **Aprovado**: Reconciliação validada, impede futuras edições

### 6.2 Regras de Aprovação

1. **Pré-requisitos para aprovação:**
   - Todas as divergências devem ser analisadas e justificadas
   - Usuário deve confirmar a reconciliação através do botão "Aprovar Reconciliação"

2. **Efeitos da aprovação:**
   - Status muda de "pendente" para "aprovado"
   - Registro torna-se **read-only** (somente leitura)
   - Badge visual indica status aprovado com ícone de verificação

3. **Persistência:**
   - Status aprovado é permanente para aquele período (mês/ano)
   - Nova comparação requer criação de novo registro

### 6.3 Interface de Aprovação

```tsx
{status === "pendente" && (
  <Button onClick={handleApproval}>
    <CheckCircle className="mr-2 h-4 w-4" />
    Aprovar Reconciliação
  </Button>
)}

{status === "aprovado" && (
  <Badge variant="outline">
    <ShieldCheck className="mr-1 h-3 w-3" />
    Aprovado
  </Badge>
)}
```

---

## 7. Formatação e Apresentação

### 7.1 Formatação de Valores Monetários

```typescript
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
```

**Resultado:** `R$ 1.234.567,89`

### 7.2 Cores Semânticas

- **Verde**: Valores sem divergência, status aprovado
- **Âmbar/Amarelo**: Divergências identificadas, alertas
- **Vermelho**: Divergências críticas, valores negativos
- **Azul**: Informações secundárias, links

### 7.3 Responsividade

- Interface adaptativa para mobile e desktop
- Uso de `whitespace-nowrap` para prevenir quebras de linha em badges e valores
- Classe `shrink-0` para manter ícones com tamanho fixo

---

## 8. Exemplo Completo de Fluxo

### Cenário: Comparação de Maio/2025

1. **Carregamento de Dados:**
   - Sistema carrega VPDRecord para 05/2025
   - Status inicial: "pendente"

2. **Cálculo de Totais:**
   ```
   Modelo Orgânico
   ├── Grupo 3.1.0 (Pessoal)
   │   ├── Subgrupo 3.1.1 (Remuneração)
   │   │   ├── VPD 3.1.1.2: CP=8M | SIC=7.95M → DIVERGÊNCIA: -50K
   │   │   └── ...
   │   │   totalCP = 35.205.989,39
   │   │   totalSIC = 35.205.989,39
   │   └── ...
   │   totalCP = 45.450.503,59
   │   totalSIC = 45.450.503,59
   └── ...
   TOTAL: CP=70.475.120,53 | SIC=70.525.120,53 → DIVERGÊNCIA: +50K
   ```

3. **Identificação de Divergências:**
   - VPD 3.1.1.2 (Gratificações): diferença de -R$ 50.000,00
   - Subgrupo 3.1.1: sem divergência (compensação interna)
   - Total do Modelo: divergência de +R$ 50.000,00

4. **Análise pelo Usuário:**
   - Expande VPD 3.1.1.2 para ver sistemas de origem
   - Identifica que Sistema SMARRH2 tem valor divergente
   - Justifica e documenta a diferença

5. **Aprovação:**
   - Usuário clica em "Aprovar Reconciliação"
   - Status muda para "aprovado"
   - Registro torna-se imutável

---

## 9. Considerações Técnicas

### 9.1 Performance

- Use memoização (`useMemo`) para cálculos de totais
- Componentes colapsáveis evitam renderização desnecessária
- Virtualização pode ser necessária para grandes volumes

### 9.2 Validações de Integridade

```typescript
// Verificar consistência dos totais
const validateTotals = (grupo: VPDGroup): boolean => {
  const calculatedCP = grupo.subgrupos.reduce((sum, sub) => sum + sub.totalCP, 0);
  const calculatedSIC = grupo.subgrupos.reduce((sum, sub) => sum + sub.totalSIC, 0);
  
  return (
    Math.abs(calculatedCP - grupo.totalCP) < 0.01 &&
    Math.abs(calculatedSIC - grupo.totalSIC) < 0.01
  );
};
```

### 9.3 Tratamento de Valores Nulos

- Valores ausentes devem ser tratados como `0`
- Sistemas sem dados para uma VPD não contribuem para o total SIC
- Divergências com valores zero não são exibidas

---

## 10. Glossário

- **VPD**: Variação Patrimonial Diminutiva - categoria contábil que representa diminuição patrimonial
- **CP**: Controle Patrimonial - sistema de referência para valores esperados
- **SIC**: Sistema Integrado de Contabilidade - agregação de múltiplos sistemas
- **Modelo Orgânico**: Estrutura organizacional por secretarias/órgãos
- **Modelo Programático**: Estrutura por programas/projetos governamentais
- **Reconciliação**: Processo de análise e justificativa de divergências
- **Drill-down**: Navegação hierárquica de dados agregados para detalhados

---

## 11. Referências

- Plano de Contas Aplicado ao Setor Público (PCASP)
- Manual de Contabilidade Aplicada ao Setor Público (MCASP)
- Estrutura de códigos VPD conforme legislação vigente

---

**Versão:** 1.0  
**Data:** Dezembro 2025  
**Autor:** Documentação Técnica - Sistema de Comparação VPDs
