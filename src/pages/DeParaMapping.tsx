import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Database, FileJson, ArrowLeftRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DeParaMapping = () => {
  const navigate = useNavigate();
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
  const [fieldFormatting, setFieldFormatting] = useState<Record<string, string>>({});
  
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

  const handleMappingChange = (sourceField: string, sicField: string) => {
    setFieldMappings((prev) => ({
      ...prev,
      [sourceField]: sicField,
    }));
  };

  const handleFormattingChange = (schemaField: string, formatting: string) => {
    setFieldFormatting((prev) => ({
      ...prev,
      [schemaField]: formatting,
    }));
  };

  const handleSaveMappings = () => {
    console.log("Salvando mapeamentos:", {
      system: selectedSystem,
      file: selectedFile,
      mappings: fieldMappings,
      formatting: fieldFormatting,
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
                setFieldMappings({});
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
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-amber-50 dark:bg-amber-950/20">DE - Campo Origem</TableHead>
                        <TableHead className="bg-amber-50 dark:bg-amber-950/20">Tipo</TableHead>
                        <TableHead className="bg-amber-50 dark:bg-amber-950/20">Descrição</TableHead>
                        <TableHead className="bg-green-50 dark:bg-green-950/20">PARA - Campo SIC</TableHead>
                        <TableHead>Transformação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schemaFields[selectedFile]?.map((field) => (
                        <TableRow key={field.field}>
                          <TableCell className="font-medium bg-amber-50/50 dark:bg-amber-950/10">
                            {field.field}
                          </TableCell>
                          <TableCell className="bg-amber-50/50 dark:bg-amber-950/10">
                            <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                              {field.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm bg-amber-50/50 dark:bg-amber-950/10">
                            {field.description}
                          </TableCell>
                          <TableCell className="bg-green-50/50 dark:bg-green-950/10">
                            <div className="flex items-center gap-2">
                              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                              <Select
                                value={fieldMappings[field.field] || ""}
                                onValueChange={(value) =>
                                  handleMappingChange(field.field, value)
                                }
                              >
                                <SelectTrigger className="max-w-xs">
                                  <SelectValue placeholder="Selecione campo SIC..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {sicFields.map((sicField) => (
                                    <SelectItem key={sicField.field} value={sicField.field}>
                                      {sicField.description}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={fieldFormatting[field.field] || ""}
                              onValueChange={(value) =>
                                handleFormattingChange(field.field, value)
                              }
                            >
                              <SelectTrigger className="max-w-xs">
                                <SelectValue placeholder="Transformação..." />
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button variant="outline" onClick={() => setFieldMappings({})}>
                    Limpar Mapeamentos
                  </Button>
                  <Button onClick={handleSaveMappings}>
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
