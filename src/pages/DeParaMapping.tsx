import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Database, FileJson, ArrowLeftRight, Plus, Trash2, Pencil } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Estrutura de regras de mapeamento DE/PARA
type SourceCondition = {
  id: string;
  field: string;
  value: string;
};

type TargetCondition = {
  id: string;
  field: string;
  value: string;
};

type MappingRule = {
  id: string;
  sourceConditions: SourceCondition[];
  targetConditions: TargetCondition[];
  transformation: string;
};

const DeParaMapping = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [savedMappings, setSavedMappings] = useState<MappingRule[]>([]);
  const [mappingRules, setMappingRules] = useState<MappingRule[]>([]);
  const isNewConfig = id === "new";
  
  // Campos padronizados do SIC (PARA)
  const sicFields = [
    { field: "modelo", description: "Modelo" },
    { field: "funcao", description: "Função" },
    { field: "objeto_custos_ep", description: "Objeto de Custos (EP)" },
    { field: "unidade_custos", description: "Unidade de Custos" },
    { field: "centro_custos", description: "Centro de Custos" },
    { field: "poder_orgao", description: "Poder/Órgão" },
    { field: "ente_federado", description: "Ente Federado" },
    { field: "ibge", description: "IBGE" },
    { field: "funcao_sic", description: "Função (SIC)" },
    { field: "numero_controle", description: "Nº Controle" },
  ];

  // Mock data - Replace with actual API calls to MongoDB
  const systems = [
    { id: "smarcp", name: "SMARCP" },
    { id: "sistema2", name: "Sistema 2" },
    { id: "sistema3", name: "Sistema 3" },
  ];

  const filesBySystem: Record<string, Array<{ id: string; name: string; versions: string[] }>> = {
    smarcp: [
      { id: "contabilizacao_organica", name: "Contabilização Orgânica", versions: ["v1.2.0", "v1.1.5", "v1.0.0"] },
      { id: "contabilizacao_programatica", name: "Contabilização Programática", versions: ["v1.2.0", "v1.1.0"] },
    ],
    sistema2: [
      { id: "contabilizacao_organica", name: "Contabilização Orgânica", versions: ["v2.1.0", "v2.0.8"] },
      { id: "contabilizacao_programatica", name: "Contabilização Programática", versions: ["v2.1.0", "v2.0.5"] },
    ],
    sistema3: [
      { id: "contabilizacao_organica", name: "Contabilização Orgânica", versions: ["v1.5.2", "v1.4.9"] },
      { id: "contabilizacao_programatica", name: "Contabilização Programática", versions: ["v1.5.2", "v1.3.0"] },
    ],
  };

  // Campos dos sistemas de origem (DE) - diferenciados por tipo de contabilização
  const schemaFields: Record<string, Array<{ field: string; type: string; description: string }>> = {
    contabilizacao_organica: [
      { field: "poder", type: "string", description: "Poder" },
      { field: "orgao", type: "string", description: "Órgão" },
      { field: "unidade_orcamentaria", type: "string", description: "Unidade Orçamentária" },
      { field: "unidade_gestora", type: "string", description: "Unidade Gestora" },
      { field: "entidade", type: "string", description: "Entidade" },
      { field: "unidade_executora", type: "string", description: "Unidade Executora" },
      { field: "ep_ligada_uoiue", type: "string", description: "EP ligada a UOIUE" },
      { field: "unidade_custos_ep", type: "string", description: "Unidade de Custos EP" },
      { field: "centro_custos_ep", type: "string", description: "Centro de Custos EP" },
    ],
    contabilizacao_programatica: [
      { field: "funcao", type: "string", description: "Função" },
      { field: "subfuncao", type: "string", description: "Subfunção" },
      { field: "programa", type: "string", description: "Programa" },
      { field: "acao", type: "string", description: "Ação" },
      { field: "plano_orcamentario", type: "string", description: "Plano Orçamentário" },
      { field: "natureza_despesa", type: "string", description: "Natureza da Despesa" },
      { field: "fonte_recurso", type: "string", description: "Fonte de Recurso" },
      { field: "identificador_uso", type: "string", description: "Identificador de Uso" },
    ],
  };

  const handleAddRule = () => {
    const newRule: MappingRule = {
      id: `rule-${Date.now()}`,
      sourceConditions: [{ id: `cond-${Date.now()}`, field: "", value: "" }],
      targetConditions: [{ id: `target-${Date.now()}`, field: "", value: "" }],
      transformation: "none",
    };
    setMappingRules([...mappingRules, newRule]);
  };

  const handleUpdateRule = (ruleId: string, field: keyof MappingRule, value: string) => {
    setMappingRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, [field]: value } : rule
      )
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    setMappingRules((prev) => prev.filter((rule) => rule.id !== ruleId));
  };

  const handleAddSourceCondition = (ruleId: string) => {
    setMappingRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              sourceConditions: [
                ...rule.sourceConditions,
                { id: `cond-${Date.now()}`, field: "", value: "" },
              ],
            }
          : rule
      )
    );
  };

  const handleUpdateSourceCondition = (
    ruleId: string,
    conditionId: string,
    field: keyof SourceCondition,
    value: string
  ) => {
    setMappingRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              sourceConditions: rule.sourceConditions.map((cond) =>
                cond.id === conditionId ? { ...cond, [field]: value } : cond
              ),
            }
          : rule
      )
    );
  };

  const handleDeleteSourceCondition = (ruleId: string, conditionId: string) => {
    setMappingRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              sourceConditions: rule.sourceConditions.filter(
                (cond) => cond.id !== conditionId
              ),
            }
          : rule
      )
    );
  };

  const handleAddTargetCondition = (ruleId: string) => {
    setMappingRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              targetConditions: [
                ...rule.targetConditions,
                { id: `target-${Date.now()}`, field: "", value: "" },
              ],
            }
          : rule
      )
    );
  };

  const handleUpdateTargetCondition = (
    ruleId: string,
    conditionId: string,
    field: keyof TargetCondition,
    value: string
  ) => {
    setMappingRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              targetConditions: rule.targetConditions.map((cond) =>
                cond.id === conditionId ? { ...cond, [field]: value } : cond
              ),
            }
          : rule
      )
    );
  };

  const handleDeleteTargetCondition = (ruleId: string, conditionId: string) => {
    setMappingRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              targetConditions: rule.targetConditions.filter(
                (cond) => cond.id !== conditionId
              ),
            }
          : rule
      )
    );
  };

  // Load existing configuration if editing
  useEffect(() => {
    if (!isNewConfig && id) {
      // Mock data - Replace with actual API call
      // Simulate loading existing configuration
      setSelectedSystem("smarcp");
      setSelectedFile("contabilizacao_organica");
      setSelectedVersion("v1.2.0");
      
      const mockRules: MappingRule[] = [
        {
          id: "rule-1",
          sourceConditions: [
            { id: "cond-1", field: "entidade", value: "214" },
            { id: "cond-2", field: "orgao", value: "12" }
          ],
          targetConditions: [
            { id: "target-1", field: "modelo", value: "1" }
          ],
          transformation: "none"
        }
      ];
      setMappingRules(mockRules);
    }
  }, [id, isNewConfig]);

  const handleSaveMappings = () => {
    console.log("Salvando mapeamentos:", {
      id: isNewConfig ? "novo" : id,
      system: selectedSystem,
      file: selectedFile,
      version: selectedVersion,
      rules: mappingRules,
    });
    setSavedMappings([...mappingRules]);
    setMappingRules([]);
    // TODO: Implement API call to save mappings to MongoDB
  };

  const handleEditSavedRule = (rule: MappingRule) => {
    // Remove from saved and add to editing area
    setSavedMappings((prev) => prev.filter((r) => r.id !== rule.id));
    setMappingRules((prev) => [...prev, rule]);
  };

  const handleDeleteSavedRule = (ruleId: string) => {
    setSavedMappings((prev) => prev.filter((r) => r.id !== ruleId));
  };

  const getTransformationPreview = (rule: MappingRule) => {
    const transformation = rule.transformation;
    if (transformation === "none") return null;

    // Build example from target (PARA) values
    const targetExample = rule.targetConditions
      .map((c) => c.value)
      .filter(Boolean)
      .join(", ");
    
    const example = targetExample || "exemplo";

    switch (transformation) {
      case "uppercase":
        return { label: "MAIÚSCULAS", before: example, after: example.toUpperCase() };
      case "lowercase":
        return { label: "minúsculas", before: example, after: example.toLowerCase() };
      case "trim":
        return { label: "Remover espaços", before: `" ${example} "`, after: example.trim() };
      case "number":
        return { label: "Número", before: example, after: Number(example) ? Number(example).toLocaleString("pt-BR") : "0" };
      case "date":
        return { label: "Data", before: example, after: "dd/mm/aaaa" };
      case "currency":
        return { label: "Moeda", before: example, after: `R$ ${Number(example) ? Number(example).toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "0,00"}` };
      case "zerofill":
        return { label: "Zeros à esquerda", before: example, after: example.padStart(10, "0") };
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md shadow-sm border-b border-border/50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/de-para")}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isNewConfig ? "Nova Configuração De/Para" : "Editar Configuração De/Para"}
              </h1>
              {!isNewConfig && (
                <p className="text-sm text-muted-foreground">ID: {id}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* System and Schema Selection - Side by Side */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* System Selection */}
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                DE - Sistema Origem
              </CardTitle>
              <CardDescription>
                Escolha o sistema que fornece os dados a serem transformados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedSystem} onValueChange={(value) => {
                setSelectedSystem(value);
                setSelectedFile("");
                setSelectedVersion("");
                setMappingRules([]);
                setSavedMappings([]);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um sistema..." />
                </SelectTrigger>
                <SelectContent>
                  {systems.map((system) => (
                    <SelectItem key={system.id} value={system.id}>
                      {system.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

            {/* File Selection */}
            {selectedSystem && (
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-5 w-5" />
                  Schema de Dados
                </CardTitle>
                <CardDescription>
                  Escolha o schema e a versão dos campos de origem a serem mapeados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Schema</Label>
                  <Select value={selectedFile} onValueChange={(value) => {
                    setSelectedFile(value);
                    setSelectedVersion("");
                    setMappingRules([]);
                    setSavedMappings([]);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um schema..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filesBySystem[selectedSystem]?.map((file) => (
                        <SelectItem key={file.id} value={file.id}>
                          {file.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedFile && (
                  <div className="space-y-2">
                    <Label>Versão</Label>
                    <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma versão..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filesBySystem[selectedSystem]
                          ?.find((file) => file.id === selectedFile)
                          ?.versions.map((version) => (
                            <SelectItem key={version} value={version}>
                              {version}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
            )}
          </div>

          {/* Field Mapping */}
          {selectedFile && selectedVersion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="h-5 w-5" />
                  Mapeamento DE/PARA
                </CardTitle>
                <CardDescription>
                  Configure como os campos do sistema de origem (DE) serão transformados nos campos padronizados do SIC (PARA)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    Adicione regras para mapear valores específicos dos campos de origem para valores nos campos do SIC
                  </p>
                  <Button onClick={handleAddRule} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Regra
                  </Button>
                </div>

                {mappingRules.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg bg-muted/20">
                    <ArrowLeftRight className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      Nenhuma regra de mapeamento configurada
                    </p>
                    <Button onClick={handleAddRule} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Regra
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mappingRules.map((rule, index) => (
                      <Card key={rule.id} className="border-2">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Regra #{index + 1}</CardTitle>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRule(rule.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* DE - Origem */}
                            <div className="space-y-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                              <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">DE - Origem</Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddSourceCondition(rule.id)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Campo
                                </Button>
                              </div>
                              
                              {rule.sourceConditions.map((condition, condIndex) => (
                                <div
                                  key={condition.id}
                                  className="space-y-2 p-3 bg-background rounded border"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-muted-foreground">
                                      Condição {condIndex + 1}
                                    </span>
                                    {rule.sourceConditions.length > 1 && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() =>
                                          handleDeleteSourceCondition(rule.id, condition.id)
                                        }
                                      >
                                        <Trash2 className="h-3 w-3 text-destructive" />
                                      </Button>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm">Campo</Label>
                                    <Select
                                      value={condition.field}
                                      onValueChange={(value) =>
                                        handleUpdateSourceCondition(
                                          rule.id,
                                          condition.id,
                                          "field",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione campo..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {schemaFields[selectedFile]?.map((field) => (
                                          <SelectItem key={field.field} value={field.field}>
                                            {field.description}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm">Valor</Label>
                                    <Input
                                      placeholder="Ex: 214"
                                      value={condition.value}
                                      onChange={(e) =>
                                        handleUpdateSourceCondition(
                                          rule.id,
                                          condition.id,
                                          "value",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* PARA - Destino */}
                            <div className="space-y-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                              <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">PARA - SIC</Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddTargetCondition(rule.id)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Campo
                                </Button>
                              </div>
                              
                              {rule.targetConditions.map((condition, condIndex) => (
                                <div
                                  key={condition.id}
                                  className="space-y-2 p-3 bg-background rounded border"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-muted-foreground">
                                      Campo {condIndex + 1}
                                    </span>
                                    {rule.targetConditions.length > 1 && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() =>
                                          handleDeleteTargetCondition(rule.id, condition.id)
                                        }
                                      >
                                        <Trash2 className="h-3 w-3 text-destructive" />
                                      </Button>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm">Campo</Label>
                                    <Select
                                      value={condition.field}
                                      onValueChange={(value) =>
                                        handleUpdateTargetCondition(
                                          rule.id,
                                          condition.id,
                                          "field",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione campo do SIC..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {sicFields.map((field) => (
                                          <SelectItem key={field.field} value={field.field}>
                                            {field.description}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm">Valor</Label>
                                    <Input
                                      placeholder="Ex: 1"
                                      value={condition.value}
                                      onChange={(e) =>
                                        handleUpdateTargetCondition(
                                          rule.id,
                                          condition.id,
                                          "value",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Transformação */}
                          <div className="mt-4 space-y-2">
                            <Label className="text-sm">Transformação (opcional)</Label>
                            <Select
                              value={rule.transformation}
                              onValueChange={(value) =>
                                handleUpdateRule(rule.id, "transformation", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione transformação..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Sem transformação</SelectItem>
                                <SelectItem value="uppercase">MAIÚSCULAS</SelectItem>
                                <SelectItem value="lowercase">minúsculas</SelectItem>
                                <SelectItem value="trim">Remover espaços</SelectItem>
                                <SelectItem value="number">Converter para número</SelectItem>
                                <SelectItem value="date">Formatar como data</SelectItem>
                                <SelectItem value="currency">Formatar como moeda</SelectItem>
                                <SelectItem value="zerofill">Preencher com zeros</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-4 mt-6">
                  <Button variant="outline" onClick={() => setMappingRules([])}>
                    Limpar Todas as Regras
                  </Button>
                  <Button onClick={handleSaveMappings} disabled={mappingRules.length === 0}>
                    Salvar Configuração
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saved Mappings List */}
          {savedMappings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Regras Salvas</CardTitle>
                <CardDescription>
                  Configuração de mapeamento DE/PARA salva para {selectedSystem} - {selectedFile} ({selectedVersion})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Condições Origem (DE)</TableHead>
                      <TableHead>Campos SIC (PARA)</TableHead>
                      <TableHead>Transformação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedMappings.map((rule, index) => {
                      const preview = getTransformationPreview(rule);
                      return (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium align-top">{index + 1}</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {rule.sourceConditions.map((condition, condIndex) => (
                              <div
                                key={condition.id}
                                className="flex flex-col gap-1 p-2 bg-amber-50 dark:bg-amber-950/20 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-muted-foreground">
                                    {condIndex > 0 ? "E" : "SE"}
                                  </span>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                      {schemaFields[selectedFile]?.find(
                                        (f) => f.field === condition.field
                                      )?.description || condition.field}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {condition.field}
                                    </span>
                                  </div>
                                  <span className="text-xs font-semibold">=</span>
                                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 rounded font-mono text-xs">
                                    {condition.value}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-2">
                            {rule.targetConditions.map((condition, condIndex) => (
                              <div
                                key={condition.id}
                                className="flex flex-col gap-1 p-2 bg-green-50 dark:bg-green-950/20 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-muted-foreground">
                                    {condIndex > 0 ? "E" : "→"}
                                  </span>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                      {sicFields.find((f) => f.field === condition.field)?.description || condition.field}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {condition.field}
                                    </span>
                                  </div>
                                  <span className="text-xs font-semibold">=</span>
                                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 rounded font-mono text-xs">
                                    {condition.value}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          {preview ? (
                            <div className="space-y-1">
                              <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded">
                                {preview.label}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-xs text-muted-foreground line-through">
                                  {preview.before}
                                </span>
                                <span className="text-xs">→</span>
                                <span className="font-mono text-xs font-semibold text-foreground">
                                  {preview.after}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="align-top text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditSavedRule(rule)}
                              title="Editar regra"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSavedRule(rule.id)}
                              title="Excluir regra"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default DeParaMapping;
