import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, FileJson, Save, Plus, Edit, Trash2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const equipamentoSchema = z.object({
  Modelo: z.string().min(1, "Campo obrigatório"),
  Funcao: z.string().min(1, "Campo obrigatório"),
  ObjetoDeCustos: z.string().min(1, "Campo obrigatório"),
  UnidadeDeCustos: z.string().min(1, "Campo obrigatório"),
  CentroDeCustos: z.string().min(1, "Campo obrigatório"),
  PoderOrgao: z.string().min(1, "Campo obrigatório"),
  EnteFederado: z.string().min(1, "Campo obrigatório"),
  IBGE: z.string().min(1, "Campo obrigatório"),
  FuncaoOrcamentaria: z.string().min(1, "Campo obrigatório"),
  NumeroControle: z.string().min(1, "Campo obrigatório"),
  Descricao: z.string().min(1, "Campo obrigatório"),
  UG: z.string().min(1, "Campo obrigatório"),
  Tipo: z.string().min(1, "Campo obrigatório"),
  CentroDeResponsabilidade: z.string().min(1, "Campo obrigatório"),
  ResponsavelNome: z.string().min(1, "Campo obrigatório"),
  ResponsavelCPF: z.string().min(11, "CPF inválido").max(11, "CPF inválido"),
  CodNacionalSigla: z.string().min(1, "Campo obrigatório"),
  CodNacionalNumero: z.string().min(1, "Campo obrigatório"),
  PrincipalOuAnexo: z.string().min(1, "Campo obrigatório"),
  Anexo: z.string(),
  DescricaoImovel: z.string().min(1, "Campo obrigatório"),
  CondicaoImovelPropriedade: z.string().min(1, "Campo obrigatório"),
  CondicaoImovelRestricao: z.string().min(1, "Campo obrigatório"),
  CondicaoServico: z.string().min(1, "Campo obrigatório"),
  EnderecoLogradouro: z.string().min(1, "Campo obrigatório"),
  EnderecoNumero: z.string().min(1, "Campo obrigatório"),
  EnderecoComplemento: z.string(),
  EnderecoBairroLocalidade: z.string().min(1, "Campo obrigatório"),
  EnderecoCEP: z.string().min(8, "CEP inválido").max(8, "CEP inválido"),
  EnderecoLatitude: z.string(),
  EnderecoLongitude: z.string(),
});

type EquipamentoFormValues = z.infer<typeof equipamentoSchema>;

const EquipamentosPublicos = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "form">("list");
  const [editingEquipamento, setEditingEquipamento] = useState<EquipamentoFormValues | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");

  // Mock data - Replace with actual API calls to MongoDB
  const schemas = [
    { id: "equipamentos_v1", name: "Equipamentos Públicos", version: "v1.0.0" },
    { id: "equipamentos_v2", name: "Equipamentos Públicos", version: "v2.1.0" },
  ];

  // Mock list of registered equipment - Replace with actual API calls
  const [equipamentos, setEquipamentos] = useState<EquipamentoFormValues[]>([
    {
      Modelo: "1",
      Funcao: "12",
      ObjetoDeCustos: "010",
      UnidadeDeCustos: "001",
      CentroDeCustos: "113",
      PoderOrgao: "1",
      EnteFederado: "3",
      IBGE: "3205200",
      FuncaoOrcamentaria: "12",
      NumeroControle: "0001",
      Descricao: "SECR. MUN. DE EDUCAÇÃO",
      UG: "076E0600009",
      Tipo: "1.12.010",
      CentroDeResponsabilidade: "SECRETARIA MUNICIPAL DE EDUCAÇÃO",
      ResponsavelNome: "Fulano da Silva",
      ResponsavelCPF: "09252966005",
      CodNacionalSigla: "INEP",
      CodNacionalNumero: "3205200",
      PrincipalOuAnexo: "Principal",
      Anexo: "000",
      DescricaoImovel: "SECRETARIA MUNICIPAL DE EDUCAÇÃO",
      CondicaoImovelPropriedade: "Próprio",
      CondicaoImovelRestricao: "Sem restrições",
      CondicaoServico: "Ativo",
      EnderecoLogradouro: "RUA CASTELO BRANCO",
      EnderecoNumero: "1803",
      EnderecoComplemento: "",
      EnderecoBairroLocalidade: "OLARIA",
      EnderecoCEP: "29123570",
      EnderecoLatitude: "-20.33191435",
      EnderecoLongitude: "-4.02914232",
    },
  ]);

  const form = useForm<EquipamentoFormValues>({
    resolver: zodResolver(equipamentoSchema),
    defaultValues: {
      Modelo: "",
      Funcao: "",
      ObjetoDeCustos: "",
      UnidadeDeCustos: "",
      CentroDeCustos: "",
      PoderOrgao: "",
      EnteFederado: "",
      IBGE: "",
      FuncaoOrcamentaria: "",
      NumeroControle: "",
      Descricao: "",
      UG: "",
      Tipo: "",
      CentroDeResponsabilidade: "",
      ResponsavelNome: "",
      ResponsavelCPF: "",
      CodNacionalSigla: "",
      CodNacionalNumero: "",
      PrincipalOuAnexo: "",
      Anexo: "",
      DescricaoImovel: "",
      CondicaoImovelPropriedade: "",
      CondicaoImovelRestricao: "",
      CondicaoServico: "",
      EnderecoLogradouro: "",
      EnderecoNumero: "",
      EnderecoComplemento: "",
      EnderecoBairroLocalidade: "",
      EnderecoCEP: "",
      EnderecoLatitude: "",
      EnderecoLongitude: "",
    },
  });

  const onSubmit = (data: EquipamentoFormValues) => {
    if (editingEquipamento) {
      // Update existing equipment
      setEquipamentos((prev) =>
        prev.map((eq) =>
          eq.NumeroControle === editingEquipamento.NumeroControle ? data : eq
        )
      );
      toast.success("Equipamento atualizado com sucesso!");
    } else {
      // Add new equipment
      setEquipamentos((prev) => [...prev, data]);
      toast.success("Equipamento cadastrado com sucesso!");
    }
    // TODO: Implement API call to save to MongoDB
    handleBackToList();
  };

  const handleAddNew = () => {
    setEditingEquipamento(null);
    setSelectedSchema("");
    setSelectedVersion("");
    form.reset();
    setView("form");
  };

  const handleEdit = (equipamento: EquipamentoFormValues) => {
    setEditingEquipamento(equipamento);
    setSelectedSchema("equipamentos_v1");
    setSelectedVersion("v1.0.0");
    form.reset(equipamento);
    setView("form");
  };

  const handleDelete = (numeroControle: string) => {
    setEquipamentos((prev) =>
      prev.filter((eq) => eq.NumeroControle !== numeroControle)
    );
    toast.success("Equipamento excluído com sucesso!");
  };

  const handleBackToList = () => {
    setView("list");
    setEditingEquipamento(null);
    setSelectedSchema("");
    setSelectedVersion("");
    form.reset();
  };

  const handleSchemaChange = (value: string) => {
    const schema = schemas.find((s) => s.id === value);
    if (schema) {
      setSelectedSchema(value);
      setSelectedVersion(schema.version);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md shadow-sm border-b border-border/50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">Cadastro de Equipamentos Públicos</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {view === "list" ? (
          /* Listing View */
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Equipamentos Públicos Cadastrados
                    </CardTitle>
                    <CardDescription>
                      Visualize e gerencie os equipamentos públicos cadastrados
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Incluir Novo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número Controle</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Centro de Responsabilidade</TableHead>
                        <TableHead>Condição</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipamentos.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            Nenhum equipamento cadastrado. Clique em "Incluir Novo" para adicionar.
                          </TableCell>
                        </TableRow>
                      ) : (
                        equipamentos.map((equipamento, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {equipamento.NumeroControle}
                            </TableCell>
                            <TableCell>{equipamento.Descricao}</TableCell>
                            <TableCell>{equipamento.Tipo}</TableCell>
                            <TableCell>{equipamento.CentroDeResponsabilidade}</TableCell>
                            <TableCell>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  equipamento.CondicaoServico === "Ativo"
                                    ? "bg-green-500/20 text-green-600"
                                    : "bg-red-500/20 text-red-600"
                                }`}
                              >
                                {equipamento.CondicaoServico}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(equipamento)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(equipamento.NumeroControle)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Form View */
          <div className="grid gap-6">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" onClick={handleBackToList}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Listagem
              </Button>
            </div>

            {/* Schema Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-5 w-5" />
                  {editingEquipamento ? "Editando Equipamento" : "Novo Equipamento"} - Selecionar Schema
                </CardTitle>
                <CardDescription>
                  {editingEquipamento
                    ? "Alterando dados do equipamento existente"
                    : "Escolha o schema do MongoDB para preencher o formulário"}
                </CardDescription>
              </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Schema</Label>
                  <Select value={selectedSchema} onValueChange={handleSchemaChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um schema..." />
                    </SelectTrigger>
                    <SelectContent>
                      {schemas.map((schema) => (
                        <SelectItem key={schema.id} value={schema.id}>
                          {schema.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Versão</Label>
                  <Input
                    value={selectedVersion}
                    disabled
                    placeholder="Versão será preenchida automaticamente"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

            {/* Form */}
            {selectedSchema && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Dados do Equipamento Público
                  </CardTitle>
                  <CardDescription>
                    Preencha os campos abaixo com as informações do equipamento
                  </CardDescription>
                </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Identificação */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Identificação</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="Modelo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Modelo</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="NumeroControle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número de Controle</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="Tipo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="Descricao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="UG"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>UG</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Custos e Organização */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Custos e Organização</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="Funcao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Função</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ObjetoDeCustos"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Objeto de Custos</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="UnidadeDeCustos"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unidade de Custos</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="CentroDeCustos"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Centro de Custos</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="CentroDeResponsabilidade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Centro de Responsabilidade</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="FuncaoOrcamentaria"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Função Orçamentária</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="PoderOrgao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Poder/Órgão</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="EnteFederado"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ente Federado</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Responsável */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Responsável</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="ResponsavelNome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Responsável</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ResponsavelCPF"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CPF do Responsável</FormLabel>
                              <FormControl>
                                <Input {...field} maxLength={11} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Códigos Nacionais */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Códigos Nacionais</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="IBGE"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código IBGE</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="CodNacionalSigla"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código Nacional (Sigla)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="CodNacionalNumero"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código Nacional (Número)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Imóvel */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Informações do Imóvel</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="DescricaoImovel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição do Imóvel</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="PrincipalOuAnexo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Principal ou Anexo</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Principal">Principal</SelectItem>
                                    <SelectItem value="Anexo">Anexo</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="Anexo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código do Anexo</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="CondicaoImovelPropriedade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Condição de Propriedade</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Próprio">Próprio</SelectItem>
                                    <SelectItem value="Alugado">Alugado</SelectItem>
                                    <SelectItem value="Cedido">Cedido</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="CondicaoImovelRestricao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Restrição do Imóvel</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="CondicaoServico"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Condição do Serviço</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Ativo">Ativo</SelectItem>
                                  <SelectItem value="Inativo">Inativo</SelectItem>
                                  <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Endereço */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Endereço</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="EnderecoLogradouro"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Logradouro</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="EnderecoNumero"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="EnderecoComplemento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complemento</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="EnderecoBairroLocalidade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bairro/Localidade</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="EnderecoCEP"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CEP</FormLabel>
                              <FormControl>
                                <Input {...field} maxLength={8} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="EnderecoLatitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Latitude</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="EnderecoLongitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Longitude</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                      <div className="flex justify-end gap-4 pt-6">
                        <Button type="button" variant="outline" onClick={handleBackToList}>
                          Cancelar
                        </Button>
                        <Button type="submit">
                          <Save className="h-4 w-4 mr-2" />
                          {editingEquipamento ? "Atualizar" : "Salvar"} Equipamento
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default EquipamentosPublicos;
