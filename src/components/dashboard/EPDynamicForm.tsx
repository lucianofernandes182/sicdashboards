import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileJson, Building2, MapPin, User, Hash, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Schemas disponíveis - mesmos da tela de Cadastro de Equipamentos Públicos
const schemasDisponiveis = [
  { 
    id: "equipamentos_v1", 
    name: "Equipamentos Públicos", 
    version: "v1.0.0",
    description: "Schema padrão básico"
  },
  { 
    id: "equipamentos_v2", 
    name: "Equipamentos Públicos", 
    version: "v2.1.0",
    description: "Schema completo com todos os campos"
  },
];

// Definição dos campos por schema e versão
interface CampoConfig {
  id: string;
  label: string;
  type: "text" | "select";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  gridSpan?: "full" | "half" | "third" | "two-thirds";
  maxLength?: number;
}

interface GrupoCampos {
  titulo: string;
  icone: "building" | "map" | "user" | "hash" | "file";
  campos: CampoConfig[];
}

const getCamposPorSchemaVersao = (schemaId: string, versao: string): GrupoCampos[] => {
  // Campos de Identificação
  const camposIdentificacao: CampoConfig[] = [
    { id: "Modelo", label: "Modelo", type: "text", placeholder: "1", required: true },
    { id: "NumeroControle", label: "Número de Controle", type: "text", placeholder: "0001", required: true },
    { id: "Tipo", label: "Tipo", type: "text", placeholder: "1.12.010", required: true },
    { id: "Descricao", label: "Descrição", type: "text", placeholder: "Nome do equipamento", required: true, gridSpan: "full" },
    { id: "UG", label: "UG", type: "text", placeholder: "076E0600009", required: true, gridSpan: "half" },
  ];

  // Campos de Custos e Organização
  const camposCustos: CampoConfig[] = [
    { id: "Funcao", label: "Função", type: "text", placeholder: "12", required: true },
    { id: "ObjetoDeCustos", label: "Objeto de Custos", type: "text", placeholder: "010", required: true },
    { id: "UnidadeDeCustos", label: "Unidade de Custos", type: "text", placeholder: "001", required: true },
    { id: "CentroDeCustos", label: "Centro de Custos", type: "text", placeholder: "113", required: true },
    { id: "CentroDeResponsabilidade", label: "Centro de Responsabilidade", type: "text", placeholder: "SECRETARIA MUNICIPAL", gridSpan: "full" },
    { id: "FuncaoOrcamentaria", label: "Função Orçamentária", type: "text", placeholder: "12" },
    { id: "PoderOrgao", label: "Poder/Órgão", type: "text", placeholder: "1", required: true },
    { id: "EnteFederado", label: "Ente Federado", type: "text", placeholder: "3", required: true },
  ];

  // Campos de Responsável
  const camposResponsavel: CampoConfig[] = [
    { id: "ResponsavelNome", label: "Nome do Responsável", type: "text", placeholder: "Nome completo", required: true },
    { id: "ResponsavelCPF", label: "CPF do Responsável", type: "text", placeholder: "00000000000", required: true, maxLength: 11 },
  ];

  // Campos de Códigos Nacionais
  const camposCodigosNacionais: CampoConfig[] = [
    { id: "IBGE", label: "Código IBGE", type: "text", placeholder: "3205200", required: true },
    { id: "CodNacionalSigla", label: "Código Nacional (Sigla)", type: "text", placeholder: "INEP", required: true },
    { id: "CodNacionalNumero", label: "Código Nacional (Número)", type: "text", placeholder: "3205200", required: true },
  ];

  // Campos de Imóvel
  const camposImovel: CampoConfig[] = [
    { id: "DescricaoImovel", label: "Descrição do Imóvel", type: "text", placeholder: "Descrição detalhada", gridSpan: "full" },
    { 
      id: "PrincipalOuAnexo", 
      label: "Principal ou Anexo", 
      type: "select",
      required: true,
      options: [
        { value: "Principal", label: "Principal" },
        { value: "Anexo", label: "Anexo" },
      ]
    },
    { id: "Anexo", label: "Código do Anexo", type: "text", placeholder: "000" },
    { 
      id: "CondicaoImovelPropriedade", 
      label: "Condição de Propriedade", 
      type: "select",
      required: true,
      options: [
        { value: "Próprio", label: "Próprio" },
        { value: "Alugado", label: "Alugado" },
        { value: "Cedido", label: "Cedido" },
      ]
    },
    { id: "CondicaoImovelRestricao", label: "Restrição do Imóvel", type: "text", placeholder: "Sem restrições" },
    { 
      id: "CondicaoServico", 
      label: "Condição do Serviço", 
      type: "select",
      required: true,
      options: [
        { value: "Ativo", label: "Ativo" },
        { value: "Inativo", label: "Inativo" },
        { value: "Em Manutenção", label: "Em Manutenção" },
      ]
    },
  ];

  // Campos de Endereço
  const camposEndereco: CampoConfig[] = [
    { id: "EnderecoLogradouro", label: "Logradouro", type: "text", placeholder: "Rua, Avenida...", required: true, gridSpan: "two-thirds" },
    { id: "EnderecoNumero", label: "Número", type: "text", placeholder: "Nº", required: true },
    { id: "EnderecoComplemento", label: "Complemento", type: "text", placeholder: "Apto, Sala..." },
    { id: "EnderecoBairroLocalidade", label: "Bairro/Localidade", type: "text", placeholder: "Bairro", required: true },
    { id: "EnderecoCEP", label: "CEP", type: "text", placeholder: "00000000", required: true, maxLength: 8 },
  ];

  // Campos de Geolocalização (apenas v2.1.0)
  const camposGeolocalizacao: CampoConfig[] = [
    { id: "EnderecoLatitude", label: "Latitude", type: "text", placeholder: "-20.33191435" },
    { id: "EnderecoLongitude", label: "Longitude", type: "text", placeholder: "-40.02914232" },
  ];

  // Lógica para retornar campos baseado no schema e versão
  switch (schemaId) {
    case "equipamentos_v1":
      // Versão básica - campos essenciais
      return [
        { titulo: "Identificação", icone: "building", campos: camposIdentificacao },
        { titulo: "Custos e Organização", icone: "hash", campos: camposCustos.slice(0, 5) }, // Apenas os primeiros campos de custos
        { titulo: "Endereço", icone: "map", campos: camposEndereco },
        { 
          titulo: "Imóvel", 
          icone: "file", 
          campos: [
            camposImovel.find(c => c.id === "CondicaoServico")!,
            camposImovel.find(c => c.id === "CondicaoImovelPropriedade")!,
          ] 
        },
      ];

    case "equipamentos_v2":
      // Versão completa - todos os campos
      return [
        { titulo: "Identificação", icone: "building", campos: camposIdentificacao },
        { titulo: "Custos e Organização", icone: "hash", campos: camposCustos },
        { titulo: "Responsável", icone: "user", campos: camposResponsavel },
        { titulo: "Códigos Nacionais", icone: "hash", campos: camposCodigosNacionais },
        { titulo: "Informações do Imóvel", icone: "file", campos: camposImovel },
        { titulo: "Endereço", icone: "map", campos: [...camposEndereco, ...camposGeolocalizacao] },
      ];

    default:
      return [];
  }
};

const getIcone = (icone: string) => {
  switch (icone) {
    case "building": return <Building2 className="h-4 w-4" />;
    case "map": return <MapPin className="h-4 w-4" />;
    case "user": return <User className="h-4 w-4" />;
    case "hash": return <Hash className="h-4 w-4" />;
    case "file": return <FileText className="h-4 w-4" />;
    default: return <Building2 className="h-4 w-4" />;
  }
};

interface EPDynamicFormProps {
  defaultDescricao?: string;
  onValuesChange?: (values: Record<string, string>) => void;
  compact?: boolean;
}

export const EPDynamicForm = ({ defaultDescricao, onValuesChange, compact = false }: EPDynamicFormProps) => {
  const [selectedSchema, setSelectedSchema] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({
    Descricao: defaultDescricao || ""
  });

  const handleSchemaChange = (value: string) => {
    setSelectedSchema(value);
    setFormValues({ Descricao: defaultDescricao || "" });
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    const newValues = { ...formValues, [fieldId]: value };
    setFormValues(newValues);
    onValuesChange?.(newValues);
  };

  const selectedSchemaData = schemasDisponiveis.find(s => s.id === selectedSchema);
  const gruposCampos = selectedSchema 
    ? getCamposPorSchemaVersao(selectedSchema, selectedSchemaData?.version || "") 
    : [];

  const getGridClass = (gridSpan?: string) => {
    switch (gridSpan) {
      case "full": return "col-span-2 sm:col-span-3";
      case "half": return "col-span-2 sm:col-span-1";
      case "two-thirds": return "col-span-2";
      case "third": return "col-span-1";
      default: return "";
    }
  };

  const renderCampo = (campo: CampoConfig) => {
    if (campo.type === "select" && campo.options) {
      return (
        <Select 
          value={formValues[campo.id] || ""} 
          onValueChange={(value) => handleFieldChange(campo.id, value)}
        >
          <SelectTrigger className="text-xs sm:text-sm h-9">
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
        value={formValues[campo.id] || ""}
        onChange={(e) => handleFieldChange(campo.id, e.target.value)}
        placeholder={campo.placeholder}
        className="text-xs sm:text-sm h-9"
        maxLength={campo.maxLength}
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
              Escolha o schema para exibir os campos apropriados
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className={compact ? "p-3 pt-0" : "p-4 pt-0"}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Schema</Label>
              <Select value={selectedSchema} onValueChange={handleSchemaChange}>
                <SelectTrigger className="text-xs sm:text-sm h-9">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {schemasDisponiveis.map(schema => (
                    <SelectItem key={schema.id} value={schema.id}>
                      {schema.name} ({schema.version})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Versão</Label>
              <Input
                value={selectedSchemaData?.version || ""}
                disabled
                placeholder="Selecione um schema"
                className="text-xs sm:text-sm h-9 bg-muted"
              />
            </div>
          </div>
          {selectedSchemaData && (
            <p className="text-xs text-muted-foreground mt-2">
              {selectedSchemaData.description}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Campos Dinâmicos */}
      {gruposCampos.length > 0 && (
        <ScrollArea className={compact ? "max-h-[320px]" : "max-h-[500px]"}>
          <div className="space-y-3 pr-4">
            {gruposCampos.map((grupo, groupIndex) => (
              <Card key={groupIndex} className={compact ? "border-dashed" : ""}>
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="flex items-center gap-2 text-xs font-medium">
                    {getIcone(grupo.icone)}
                    {grupo.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {grupo.campos.map((campo) => (
                      <div 
                        key={campo.id} 
                        className={`space-y-1 ${getGridClass(campo.gridSpan)}`}
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
        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
          <FileJson className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">Selecione um schema</p>
          <p className="text-xs">Os campos do formulário serão exibidos após a seleção</p>
        </div>
      )}
    </div>
  );
};

export default EPDynamicForm;
