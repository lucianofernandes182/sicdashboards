import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Database, FileJson, ArrowLeftRight, Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DeParaMapping = () => {
  const navigate = useNavigate();
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string>("");
  
  // Estrutura de regras de mapeamento DE/PARA
  type MappingRule = {
    id: string;
    sourceField: string;
    sourceValue: string;
    targetField: string;
    targetValue: string;
    transformation: string;
  };
  
  const [mappingRules, setMappingRules] = useState<MappingRule[]>([]);
  
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

  const filesBySystem: Record<string, Array<{ id: string; name: string; version: string }>> = {
    smarcp: [
      { id: "schema1", name: "Schema Orçamentário", version: "v1.2.0" },
      { id: "schema2", name: "Schema Financeiro", version: "v1.0.5" },
    ],
    sistema2: [
      { id: "schema3", name: "Schema Receitas", version: "v2.1.0" },
    ],
    sistema3: [
      { id: "schema4", name: "Schema Despesas", version: "v1.5.2" },
    ],
  };

  // Campos dos sistemas de origem (DE)
  const schemaFields: Record<string, Array<{ field: string; type: string; description: string }>> = {
    schema1: [
      { field: "entidade", type: "string", description: "Entidade" },
      { field: "unio_orcamentaria_1nivel", type: "string", description: "Unidade Orçamentária (1º Nível)" },
      { field: "unio_orcamentaria_2nivel", type: "string", description: "Unidade Orçamentária (2º Nível)" },
      { field: "unidade_executora", type: "string", description: "Unidade Executora" },
      { field: "ep_ligada_uoiue", type: "string", description: "EP ligada a UOIUE" },
      { field: "unidade_custos_ep", type: "string", description: "Unidade de Custos EP" },
      { field: "centro_custos_ep", type: "string", description: "Centro de Custos EP" },
      { field: "funcao", type: "string", description: "Função" },
      { field: "subfuncao", type: "string", description: "SubFunção" },
      { field: "programa", type: "string", description: "Programa" },
      { field: "acao", type: "string", description: "Ação" },
    ],
    schema2: [
      { field: "codigo_unidade", type: "string", description: "Código da Unidade" },
      { field: "descricao_unidade", type: "string", description: "Descrição da Unidade" },
      { field: "codigo_funcao", type: "string", description: "Código da Função" },
      { field: "valor_orcado", type: "number", description: "Valor Orçado" },
    ],
    schema3: [
      { field: "orgao", type: "string", description: "Órgão" },
      { field: "unidade_gestora", type: "string", description: "Unidade Gestora" },
      { field: "funcao_governo", type: "string", description: "Função de Governo" },
      { field: "acao_orcamentaria", type: "string", description: "Ação Orçamentária" },
    ],
    schema4: [
      { field: "codigo_despesa", type: "string", description: "Código da Despesa" },
      { field: "elemento_despesa", type: "string", description: "Elemento de Despesa" },
      { field: "valor_empenhado", type: "number", description: "Valor Empenhado" },
      { field: "data_empenho", type: "date", description: "Data do Empenho" },
    ],
  };

  const handleAddRule = () => {
    const newRule: MappingRule = {
      id: `rule-${Date.now()}`,
      sourceField: "",
      sourceValue: "",
      targetField: "",
      targetValue: "",
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

  const handleSaveMappings = () => {
    console.log("Salvando mapeamentos:", {
      system: selectedSystem,
      file: selectedFile,
      rules: mappingRules,
    });
    // TODO: Implement API call to save mappings to MongoDB
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md shadow-sm border-b border-border/50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">Mapeamento De/Para</h1>
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
                setMappingRules([]);
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
                  Escolha o schema com os campos de origem a serem mapeados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedFile} onValueChange={setSelectedFile}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um schema..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filesBySystem[selectedSystem]?.map((file) => (
                      <SelectItem key={file.id} value={file.id}>
                        <div className="flex flex-col">
                          <span>{file.name}</span>
                          <span className="text-xs text-muted-foreground">{file.version}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            )}
          </div>

          {/* Field Mapping */}
          {selectedFile && (
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
                              <Label className="text-base font-semibold">DE - Origem</Label>
                              
                              <div className="space-y-2">
                                <Label className="text-sm">Campo</Label>
                                <Select
                                  value={rule.sourceField}
                                  onValueChange={(value) =>
                                    handleUpdateRule(rule.id, "sourceField", value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione campo de origem..." />
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
                                  value={rule.sourceValue}
                                  onChange={(e) =>
                                    handleUpdateRule(rule.id, "sourceValue", e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            {/* PARA - Destino */}
                            <div className="space-y-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                              <Label className="text-base font-semibold">PARA - SIC</Label>
                              
                              <div className="space-y-2">
                                <Label className="text-sm">Campo</Label>
                                <Select
                                  value={rule.targetField}
                                  onValueChange={(value) =>
                                    handleUpdateRule(rule.id, "targetField", value)
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
                                  value={rule.targetValue}
                                  onChange={(e) =>
                                    handleUpdateRule(rule.id, "targetValue", e.target.value)
                                  }
                                />
                              </div>
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
        </div>
      </main>
    </div>
  );
};

export default DeParaMapping;
