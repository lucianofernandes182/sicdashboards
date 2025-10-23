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

  const schemaFields: Record<string, Array<{ field: string; type: string; description: string }>> = {
    schema1: [
      { field: "codigo", type: "string", description: "Código do elemento" },
      { field: "descricao", type: "string", description: "Descrição do item" },
      { field: "valor", type: "number", description: "Valor orçado" },
      { field: "data", type: "date", description: "Data de referência" },
    ],
    schema2: [
      { field: "id_transacao", type: "string", description: "ID da transação" },
      { field: "valor_total", type: "number", description: "Valor total" },
    ],
    schema3: [
      { field: "receita_id", type: "string", description: "ID da receita" },
      { field: "valor_receita", type: "number", description: "Valor da receita" },
    ],
    schema4: [
      { field: "despesa_id", type: "string", description: "ID da despesa" },
      { field: "valor_despesa", type: "number", description: "Valor da despesa" },
    ],
  };

  const handleMappingChange = (schemaField: string, apiField: string) => {
    setFieldMappings((prev) => ({
      ...prev,
      [schemaField]: apiField,
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
                Selecionar Sistema Integrado
              </CardTitle>
              <CardDescription>
                Escolha o sistema fonte de dados para configurar o mapeamento
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
                  Selecionar Schema JSON
                </CardTitle>
                <CardDescription>
                  Escolha o arquivo de schema para mapear os campos
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
                  Mapeamento de Campos
                </CardTitle>
                <CardDescription>
                  Configure o mapeamento entre os campos do schema e os campos da API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campo do Schema</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Campo da API</TableHead>
                        <TableHead>Formatação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schemaFields[selectedFile]?.map((field) => (
                        <TableRow key={field.field}>
                          <TableCell className="font-medium">{field.field}</TableCell>
                          <TableCell>
                            <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                              {field.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {field.description}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Nome do campo da API"
                                value={fieldMappings[field.field] || ""}
                                onChange={(e) =>
                                  handleMappingChange(field.field, e.target.value)
                                }
                                className="max-w-xs"
                              />
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
                                <SelectValue placeholder="Selecione formatação..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Sem formatação</SelectItem>
                                <SelectItem value="uppercase">MAIÚSCULAS</SelectItem>
                                <SelectItem value="lowercase">minúsculas</SelectItem>
                                <SelectItem value="trim">Remover espaços</SelectItem>
                                <SelectItem value="number">Converter para número</SelectItem>
                                <SelectItem value="date">Formatar como data</SelectItem>
                                <SelectItem value="currency">Formatar como moeda</SelectItem>
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
