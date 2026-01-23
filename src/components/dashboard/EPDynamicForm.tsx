import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileJson, Building2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Schemas disponíveis com suas versões
const schemasDisponiveis = [
  { 
    id: "ep_basico", 
    name: "EP Básico", 
    versions: [
      { version: "v1.0.0", description: "Campos essenciais" },
      { version: "v1.1.0", description: "Com endereço completo" }
    ]
  },
  { 
    id: "ep_completo", 
    name: "EP Completo", 
    versions: [
      { version: "v1.0.0", description: "Todos os campos" },
      { version: "v2.0.0", description: "Com geolocalização" },
      { version: "v2.1.0", description: "Com responsável e anexos" }
    ]
  },
  { 
    id: "ep_educacao", 
    name: "EP Educação", 
    versions: [
      { version: "v1.0.0", description: "Escolas e creches" }
    ]
  },
  { 
    id: "ep_saude", 
    name: "EP Saúde", 
    versions: [
      { version: "v1.0.0", description: "UBS e hospitais" }
    ]
  },
];

// Definição dos campos por schema e versão
interface CampoConfig {
  id: string;
  label: string;
  type: "text" | "select" | "number";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  gridSpan?: "full" | "half";
}

interface GrupoCampos {
  titulo: string;
  campos: CampoConfig[];
}

const getCamposPorSchemaVersao = (schemaId: string, versao: string): GrupoCampos[] => {
  // Campos base para todos os schemas
  const camposIdentificacao: CampoConfig[] = [
    { id: "NumeroControle", label: "Número de Controle", type: "text", placeholder: "Ex: EP-2025-001", required: true },
    { id: "Descricao", label: "Descrição", type: "text", placeholder: "Nome do equipamento", required: true, gridSpan: "full" },
  ];

  const camposTipo: CampoConfig[] = [
    { 
      id: "Tipo", 
      label: "Tipo", 
      type: "select", 
      required: true,
      options: [
        { value: "1.12.010", label: "Escola" },
        { value: "1.10.020", label: "UBS" },
        { value: "1.10.030", label: "Hospital" },
        { value: "1.13.010", label: "Centro Esportivo" },
        { value: "1.99.010", label: "Administrativo" },
        { value: "1.99.099", label: "Outros" },
      ]
    },
    { 
      id: "CondicaoServico", 
      label: "Condição de Serviço", 
      type: "select", 
      required: true,
      options: [
        { value: "Ativo", label: "Ativo" },
        { value: "Inativo", label: "Inativo" },
        { value: "Em Manutenção", label: "Em Manutenção" },
      ]
    },
  ];

  const camposEnderecoBasico: CampoConfig[] = [
    { id: "EnderecoLogradouro", label: "Logradouro", type: "text", placeholder: "Rua, Avenida...", required: true, gridSpan: "full" },
    { id: "EnderecoNumero", label: "Número", type: "text", placeholder: "Nº", required: true },
    { id: "EnderecoBairroLocalidade", label: "Bairro/Localidade", type: "text", placeholder: "Bairro", required: true },
    { id: "EnderecoCEP", label: "CEP", type: "text", placeholder: "00000-000", required: true },
  ];

  const camposEnderecoCompleto: CampoConfig[] = [
    ...camposEnderecoBasico,
    { id: "EnderecoComplemento", label: "Complemento", type: "text", placeholder: "Apto, Sala..." },
    { id: "EnderecoLatitude", label: "Latitude", type: "text", placeholder: "-20.33191435" },
    { id: "EnderecoLongitude", label: "Longitude", type: "text", placeholder: "-40.02914232" },
  ];

  const camposCustos: CampoConfig[] = [
    { id: "Modelo", label: "Modelo", type: "text", placeholder: "1", required: true },
    { id: "Funcao", label: "Função", type: "text", placeholder: "12", required: true },
    { id: "ObjetoDeCustos", label: "Objeto de Custos", type: "text", placeholder: "010", required: true },
    { id: "UnidadeDeCustos", label: "Unidade de Custos", type: "text", placeholder: "001", required: true },
    { id: "CentroDeCustos", label: "Centro de Custos", type: "text", placeholder: "113", required: true },
    { id: "CentroDeResponsabilidade", label: "Centro de Responsabilidade", type: "text", gridSpan: "full" },
  ];

  const camposResponsavel: CampoConfig[] = [
    { id: "ResponsavelNome", label: "Nome do Responsável", type: "text", placeholder: "Nome completo", required: true },
    { id: "ResponsavelCPF", label: "CPF do Responsável", type: "text", placeholder: "000.000.000-00", required: true },
  ];

  const camposImovel: CampoConfig[] = [
    { id: "DescricaoImovel", label: "Descrição do Imóvel", type: "text", gridSpan: "full" },
    { 
      id: "CondicaoImovelPropriedade", 
      label: "Propriedade", 
      type: "select",
      options: [
        { value: "Próprio", label: "Próprio" },
        { value: "Alugado", label: "Alugado" },
        { value: "Cedido", label: "Cedido" },
        { value: "Comodato", label: "Comodato" },
      ]
    },
    { 
      id: "CondicaoImovelRestricao", 
      label: "Restrição", 
      type: "select",
      options: [
        { value: "Sem restrições", label: "Sem restrições" },
        { value: "Com restrições", label: "Com restrições" },
        { value: "Em análise", label: "Em análise" },
      ]
    },
  ];

  const camposOrganizacao: CampoConfig[] = [
    { id: "PoderOrgao", label: "Poder/Órgão", type: "text", placeholder: "1", required: true },
    { id: "EnteFederado", label: "Ente Federado", type: "text", placeholder: "3", required: true },
    { id: "IBGE", label: "IBGE", type: "text", placeholder: "3205200", required: true },
    { id: "UG", label: "UG", type: "text", placeholder: "076E0600009", required: true },
    { id: "FuncaoOrcamentaria", label: "Função Orçamentária", type: "text", placeholder: "12" },
  ];

  const camposEducacao: CampoConfig[] = [
    { id: "CodNacionalSigla", label: "Código Nacional (Sigla)", type: "text", placeholder: "INEP", required: true },
    { id: "CodNacionalNumero", label: "Código Nacional (Número)", type: "text", placeholder: "32052001", required: true },
    { 
      id: "NivelEnsino", 
      label: "Nível de Ensino", 
      type: "select",
      options: [
        { value: "infantil", label: "Educação Infantil" },
        { value: "fundamental1", label: "Fundamental I" },
        { value: "fundamental2", label: "Fundamental II" },
        { value: "medio", label: "Ensino Médio" },
        { value: "eja", label: "EJA" },
      ]
    },
    { id: "CapacidadeAlunos", label: "Capacidade de Alunos", type: "number", placeholder: "500" },
  ];

  const camposSaude: CampoConfig[] = [
    { id: "CNES", label: "CNES", type: "text", placeholder: "0000000", required: true },
    { 
      id: "TipoEstabelecimento", 
      label: "Tipo de Estabelecimento", 
      type: "select",
      options: [
        { value: "ubs", label: "UBS" },
        { value: "upa", label: "UPA" },
        { value: "hospital", label: "Hospital" },
        { value: "caps", label: "CAPS" },
        { value: "policlinica", label: "Policlínica" },
      ]
    },
    { id: "NumeroLeitos", label: "Número de Leitos", type: "number", placeholder: "0" },
    { 
      id: "AtendimentoUrgencia", 
      label: "Atendimento 24h", 
      type: "select",
      options: [
        { value: "sim", label: "Sim" },
        { value: "nao", label: "Não" },
      ]
    },
  ];

  // Lógica para retornar campos baseado no schema e versão
  switch (schemaId) {
    case "ep_basico":
      if (versao === "v1.0.0") {
        return [
          { titulo: "Identificação", campos: [...camposIdentificacao, ...camposTipo] },
        ];
      }
      if (versao === "v1.1.0") {
        return [
          { titulo: "Identificação", campos: [...camposIdentificacao, ...camposTipo] },
          { titulo: "Endereço", campos: camposEnderecoBasico },
        ];
      }
      break;

    case "ep_completo":
      if (versao === "v1.0.0") {
        return [
          { titulo: "Identificação", campos: [...camposIdentificacao, ...camposTipo] },
          { titulo: "Endereço", campos: camposEnderecoBasico },
          { titulo: "Custos e Organização", campos: camposCustos },
          { titulo: "Organização", campos: camposOrganizacao },
        ];
      }
      if (versao === "v2.0.0") {
        return [
          { titulo: "Identificação", campos: [...camposIdentificacao, ...camposTipo] },
          { titulo: "Endereço Completo", campos: camposEnderecoCompleto },
          { titulo: "Custos e Organização", campos: camposCustos },
          { titulo: "Organização", campos: camposOrganizacao },
        ];
      }
      if (versao === "v2.1.0") {
        return [
          { titulo: "Identificação", campos: [...camposIdentificacao, ...camposTipo] },
          { titulo: "Endereço Completo", campos: camposEnderecoCompleto },
          { titulo: "Custos e Organização", campos: camposCustos },
          { titulo: "Organização", campos: camposOrganizacao },
          { titulo: "Responsável", campos: camposResponsavel },
          { titulo: "Dados do Imóvel", campos: camposImovel },
        ];
      }
      break;

    case "ep_educacao":
      return [
        { titulo: "Identificação", campos: [...camposIdentificacao, ...camposTipo] },
        { titulo: "Endereço", campos: camposEnderecoBasico },
        { titulo: "Dados Educacionais", campos: camposEducacao },
        { titulo: "Custos", campos: camposCustos },
      ];

    case "ep_saude":
      return [
        { titulo: "Identificação", campos: [...camposIdentificacao, ...camposTipo] },
        { titulo: "Endereço", campos: camposEnderecoBasico },
        { titulo: "Dados de Saúde", campos: camposSaude },
        { titulo: "Custos", campos: camposCustos },
      ];
  }

  return [];
};

interface EPDynamicFormProps {
  defaultDescricao?: string;
  onValuesChange?: (values: Record<string, string>) => void;
  compact?: boolean;
}

export const EPDynamicForm = ({ defaultDescricao, onValuesChange, compact = false }: EPDynamicFormProps) => {
  const [selectedSchema, setSelectedSchema] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({
    Descricao: defaultDescricao || ""
  });

  const handleSchemaChange = (value: string) => {
    setSelectedSchema(value);
    setSelectedVersion("");
    setFormValues({ Descricao: defaultDescricao || "" });
  };

  const handleVersionChange = (value: string) => {
    setSelectedVersion(value);
    setFormValues({ Descricao: defaultDescricao || "" });
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    const newValues = { ...formValues, [fieldId]: value };
    setFormValues(newValues);
    onValuesChange?.(newValues);
  };

  const selectedSchemaData = schemasDisponiveis.find(s => s.id === selectedSchema);
  const versionsDisponiveis = selectedSchemaData?.versions || [];
  const gruposCampos = selectedSchema && selectedVersion 
    ? getCamposPorSchemaVersao(selectedSchema, selectedVersion) 
    : [];

  const renderCampo = (campo: CampoConfig) => {
    if (campo.type === "select" && campo.options) {
      return (
        <Select 
          value={formValues[campo.id] || ""} 
          onValueChange={(value) => handleFieldChange(campo.id, value)}
        >
          <SelectTrigger className="text-xs sm:text-sm">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {campo.options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        type={campo.type === "number" ? "number" : "text"}
        value={formValues[campo.id] || ""}
        onChange={(e) => handleFieldChange(campo.id, e.target.value)}
        placeholder={campo.placeholder}
        className="text-xs sm:text-sm"
      />
    );
  };

  return (
    <div className="space-y-4">
      {/* Seleção de Schema e Versão */}
      <Card className={compact ? "border-dashed" : ""}>
        <CardHeader className={compact ? "p-3" : "p-4"}>
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileJson className="h-4 w-4" />
            Selecionar Schema
          </CardTitle>
          {!compact && (
            <CardDescription className="text-xs">
              Escolha o schema e versão para exibir os campos apropriados
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className={compact ? "p-3 pt-0" : "p-4 pt-0"}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Schema</Label>
              <Select value={selectedSchema} onValueChange={handleSchemaChange}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {schemasDisponiveis.map(schema => (
                    <SelectItem key={schema.id} value={schema.id}>
                      {schema.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Versão</Label>
              <Select 
                value={selectedVersion} 
                onValueChange={handleVersionChange}
                disabled={!selectedSchema}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {versionsDisponiveis.map(v => (
                    <SelectItem key={v.version} value={v.version}>
                      {v.version} - {v.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campos Dinâmicos */}
      {gruposCampos.length > 0 && (
        <ScrollArea className={compact ? "max-h-[350px]" : "max-h-[500px]"}>
          <div className="space-y-4 pr-4">
            {gruposCampos.map((grupo, groupIndex) => (
              <Card key={groupIndex} className={compact ? "border-dashed" : ""}>
                <CardHeader className={compact ? "p-3 pb-2" : "p-4 pb-2"}>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4" />
                    {grupo.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent className={compact ? "p-3 pt-0" : "p-4 pt-0"}>
                  <div className="grid grid-cols-2 gap-3">
                    {grupo.campos.map((campo) => (
                      <div 
                        key={campo.id} 
                        className={`space-y-1.5 ${campo.gridSpan === "full" ? "col-span-2" : ""}`}
                      >
                        <Label className="text-xs flex items-center gap-1">
                          {campo.label}
                          {campo.required && <span className="text-destructive">*</span>}
                        </Label>
                        {renderCampo(campo)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Mensagem quando nenhum schema selecionado */}
      {!selectedSchema && (
        <div className="text-center py-6 text-muted-foreground">
          <FileJson className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Selecione um schema para visualizar os campos</p>
        </div>
      )}

      {/* Mensagem quando schema selecionado mas versão não */}
      {selectedSchema && !selectedVersion && (
        <div className="text-center py-6 text-muted-foreground">
          <FileJson className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Selecione uma versão do schema</p>
        </div>
      )}
    </div>
  );
};

export default EPDynamicForm;
