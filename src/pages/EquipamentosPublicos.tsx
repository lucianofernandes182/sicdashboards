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
import { ArrowLeft, Building2, FileJson, Save, Plus, Edit, Trash2, Link2, Layers } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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

interface EquipamentoAssociado {
  sistema: string;
  equipamentoId: string;
  descricao: string;
}

interface Acumulador {
  id: string;
  Modelo: string;
  Funcao: string;
  ObjetoDeCustos: string;
  UnidadeDeCustos: string;
  CentroDeCustos: string;
}

const EquipamentosPublicos = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "form">("list");
  const [editingEquipamento, setEditingEquipamento] = useState<EquipamentoFormValues | null>(null);
  const [selectedSchema, setSelectedSchema] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [associationDialogOpen, setAssociationDialogOpen] = useState(false);
  const [associatingEquipamento, setAssociatingEquipamento] = useState<EquipamentoFormValues | null>(null);
  const [selectedAssociationSystem, setSelectedAssociationSystem] = useState<string>("");
  const [searchEquipamento, setSearchEquipamento] = useState<string>("");
  const [associations, setAssociations] = useState<Record<string, EquipamentoAssociado[]>>({});
  const [acumuladoresDialogOpen, setAcumuladoresDialogOpen] = useState(false);
  const [acumuladoresEquipamento, setAcumuladoresEquipamento] = useState<EquipamentoFormValues | null>(null);
  const [acumuladores, setAcumuladores] = useState<Record<string, Acumulador[]>>({});
  const [novoAcumulador, setNovoAcumulador] = useState<Omit<Acumulador, "id">>({
    Modelo: "", Funcao: "", ObjetoDeCustos: "", UnidadeDeCustos: "", CentroDeCustos: "",
  });

  // Mock data - Replace with actual API calls to MongoDB
  const schemas = [
    { id: "equipamentos_v1", name: "Equipamentos Públicos", version: "v1.0.0" },
    { id: "equipamentos_v2", name: "Equipamentos Públicos", version: "v2.1.0" },
  ];

  // Mock integrated systems
  const sistemasIntegrados = [
    { id: "smarcp", name: "SMARCP" },
    { id: "sistema_rh", name: "Sistema RH" },
    { id: "sistema_patrimonio", name: "Sistema Patrimônio" },
    { id: "sistema_almoxarifado", name: "Sistema Almoxarifado" },
  ];

  // Mock equipment from different systems
  const equipamentosPorSistema: Record<string, Array<{ id: string; descricao: string }>> = {
    smarcp: [
      { id: "SMARCP001", descricao: "Equipamento SMARCP - Educação Centro" },
      { id: "SMARCP002", descricao: "Equipamento SMARCP - Educação Sul" },
    ],
    sistema_rh: [
      { id: "RH001", descricao: "Equipamento RH - Servidor Educação" },
      { id: "RH002", descricao: "Equipamento RH - Servidor Saúde" },
    ],
    sistema_patrimonio: [
      { id: "PAT001", descricao: "Patrimônio - Imóvel Educação" },
      { id: "PAT002", descricao: "Patrimônio - Veículo Educação" },
    ],
    sistema_almoxarifado: [
      { id: "ALM001", descricao: "Almoxarifado - Material Escolar" },
      { id: "ALM002", descricao: "Almoxarifado - Material Limpeza" },
    ],
  };

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

  const handleOpenAssociations = (equipamento: EquipamentoFormValues) => {
    setAssociatingEquipamento(equipamento);
    setSelectedAssociationSystem("");
    setSearchEquipamento("");
    setAssociationDialogOpen(true);
  };

  const getFilteredEquipamentos = () => {
    if (!selectedAssociationSystem) return [];
    
    const equipamentos = equipamentosPorSistema[selectedAssociationSystem] || [];
    
    if (!searchEquipamento.trim()) return equipamentos;
    
    const searchLower = searchEquipamento.toLowerCase();
    return equipamentos.filter(
      (eq) =>
        eq.id.toLowerCase().includes(searchLower) ||
        eq.descricao.toLowerCase().includes(searchLower)
    );
  };

  const handleToggleAssociation = (equipamentoId: string, sistema: string, descricao: string) => {
    if (!associatingEquipamento) return;

    const key = associatingEquipamento.NumeroControle;
    const currentAssociations = associations[key] || [];
    
    const existingIndex = currentAssociations.findIndex(
      (a) => a.equipamentoId === equipamentoId && a.sistema === sistema
    );

    if (existingIndex >= 0) {
      // Remove association
      setAssociations({
        ...associations,
        [key]: currentAssociations.filter((_, i) => i !== existingIndex),
      });
    } else {
      // Add association
      setAssociations({
        ...associations,
        [key]: [...currentAssociations, { sistema, equipamentoId, descricao }],
      });
    }
  };

  const isAssociated = (equipamentoId: string, sistema: string): boolean => {
    if (!associatingEquipamento) return false;
    const key = associatingEquipamento.NumeroControle;
    const currentAssociations = associations[key] || [];
    return currentAssociations.some(
      (a) => a.equipamentoId === equipamentoId && a.sistema === sistema
    );
  };

  const getAssociationsCount = (numeroControle: string): number => {
    return (associations[numeroControle] || []).length;
  };

  const handleOpenAcumuladores = (equipamento: EquipamentoFormValues) => {
    setAcumuladoresEquipamento(equipamento);
    setNovoAcumulador({ Modelo: "", Funcao: "", ObjetoDeCustos: "", UnidadeDeCustos: "", CentroDeCustos: "" });
    setAcumuladoresDialogOpen(true);
  };

  const handleAddAcumulador = () => {
    if (!acumuladoresEquipamento) return;
    if (!novoAcumulador.Modelo || !novoAcumulador.Funcao || !novoAcumulador.ObjetoDeCustos || !novoAcumulador.UnidadeDeCustos || !novoAcumulador.CentroDeCustos) {
      toast.error("Preencha todos os campos do acumulador.");
      return;
    }
    const key = acumuladoresEquipamento.NumeroControle;
    const newAcumulador: Acumulador = { ...novoAcumulador, id: crypto.randomUUID() };
    setAcumuladores((prev) => ({ ...prev, [key]: [...(prev[key] || []), newAcumulador] }));
    setNovoAcumulador({ Modelo: "", Funcao: "", ObjetoDeCustos: "", UnidadeDeCustos: "", CentroDeCustos: "" });
    toast.success("Acumulador adicionado!");
  };

  const handleDeleteAcumulador = (acumuladorId: string) => {
    if (!acumuladoresEquipamento) return;
    const key = acumuladoresEquipamento.NumeroControle;
    setAcumuladores((prev) => ({ ...prev, [key]: (prev[key] || []).filter((a) => a.id !== acumuladorId) }));
    toast.success("Acumulador removido!");
  };

  const getAcumuladoresCount = (numeroControle: string): number => {
    return (acumuladores[numeroControle] || []).length;
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
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <h1 className="text-lg sm:text-2xl font-bold truncate">Cadastro de Equipamentos Públicos</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {view === "list" ? (
          /* Listing View */
          <div className="grid gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      Equipamentos Públicos Cadastrados
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">
                      Visualize e gerencie os equipamentos públicos cadastrados
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddNew} size="sm" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Incluir Novo
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                {/* Desktop Table View */}
                <div className="hidden md:block rounded-md border">
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
                                  onClick={() => handleOpenAssociations(equipamento)}
                                  title="Associar Equipamentos"
                                >
                                  <Link2 className="h-4 w-4" />
                                  {getAssociationsCount(equipamento.NumeroControle) > 0 && (
                                    <Badge 
                                      variant="secondary" 
                                      className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                                    >
                                      {getAssociationsCount(equipamento.NumeroControle)}
                                    </Badge>
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleOpenAcumuladores(equipamento)}
                                  title="Acumuladores"
                                >
                                  <Layers className="h-4 w-4" />
                                  {getAcumuladoresCount(equipamento.NumeroControle) > 0 && (
                                    <Badge 
                                      variant="secondary" 
                                      className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                                    >
                                      {getAcumuladoresCount(equipamento.NumeroControle)}
                                    </Badge>
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(equipamento)}
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(equipamento.NumeroControle)}
                                  title="Excluir"
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

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {equipamentos.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8 text-sm">
                      Nenhum equipamento cadastrado. Clique em "Incluir Novo" para adicionar.
                    </div>
                  ) : (
                    equipamentos.map((equipamento, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">
                              {equipamento.NumeroControle}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {equipamento.Descricao}
                            </div>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded ml-2 whitespace-nowrap ${
                              equipamento.CondicaoServico === "Ativo"
                                ? "bg-green-500/20 text-green-600"
                                : "bg-red-500/20 text-red-600"
                            }`}
                          >
                            {equipamento.CondicaoServico}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground mb-3">
                          <div><span className="font-medium">Tipo:</span> {equipamento.Tipo}</div>
                          <div className="truncate"><span className="font-medium">Responsabilidade:</span> {equipamento.CentroDeResponsabilidade}</div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t pt-3">
                          <Button
                            variant="outline"
                            onClick={() => handleOpenAssociations(equipamento)}
                            className="h-11 flex items-center justify-center gap-1.5"
                          >
                            <Link2 className="h-5 w-5" />
                            <span className="text-xs">Associar</span>
                            {getAssociationsCount(equipamento.NumeroControle) > 0 && (
                              <Badge 
                                variant="secondary" 
                                className="h-5 min-w-5 p-0 flex items-center justify-center text-[10px]"
                              >
                                {getAssociationsCount(equipamento.NumeroControle)}
                              </Badge>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleOpenAcumuladores(equipamento)}
                            className="h-11 flex items-center justify-center gap-1.5"
                          >
                            <Layers className="h-5 w-5" />
                            <span className="text-xs">Acumul.</span>
                            {getAcumuladoresCount(equipamento.NumeroControle) > 0 && (
                              <Badge 
                                variant="secondary" 
                                className="h-5 min-w-5 p-0 flex items-center justify-center text-[10px]"
                              >
                                {getAcumuladoresCount(equipamento.NumeroControle)}
                              </Badge>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleEdit(equipamento)}
                            className="h-11 flex items-center justify-center gap-1.5"
                          >
                            <Edit className="h-5 w-5" />
                            <span className="text-xs">Editar</span>
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleDelete(equipamento.NumeroControle)}
                            className="h-11 flex items-center justify-center gap-1.5 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="text-xs">Excluir</span>
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Form View */
          <div className="grid gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
              <Button variant="outline" onClick={handleBackToList} size="sm" className="text-xs sm:text-sm">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Voltar para Listagem</span>
                <span className="sm:hidden">Voltar</span>
              </Button>
            </div>

            {/* Schema Selection */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileJson className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="truncate">
                    {editingEquipamento ? "Editando Equipamento" : "Novo Equipamento"} - Selecionar Schema
                  </span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {editingEquipamento
                    ? "Alterando dados do equipamento existente"
                    : "Escolha o schema do MongoDB para preencher o formulário"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm">Schema</Label>
                    <Select value={selectedSchema} onValueChange={handleSchemaChange}>
                      <SelectTrigger className="text-xs sm:text-sm">
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
                    <Label className="text-xs sm:text-sm">Versão</Label>
                    <Input
                      value={selectedVersion}
                      disabled
                      placeholder="Versão será preenchida automaticamente"
                      className="text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form */}
            {selectedSchema && (
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Dados do Equipamento Público
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Preencha os campos abaixo com as informações do equipamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                      {/* Identificação */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold border-b pb-2">Identificação</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="Modelo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Modelo</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="NumeroControle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Número de Controle</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="Tipo"
                            render={({ field }) => (
                              <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel className="text-xs sm:text-sm">Tipo</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="Descricao"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Descrição</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="UG"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">UG</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Custos e Organização */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold border-b pb-2">Custos e Organização</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="Funcao"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Função</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="ObjetoDeCustos"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Objeto de Custos</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="UnidadeDeCustos"
                            render={({ field }) => (
                              <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel className="text-xs sm:text-sm">Unidade de Custos</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="CentroDeCustos"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Centro de Custos</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="CentroDeResponsabilidade"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Centro de Responsabilidade</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="FuncaoOrcamentaria"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Função Orçamentária</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="PoderOrgao"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Poder/Órgão</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="EnteFederado"
                            render={({ field }) => (
                              <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel className="text-xs sm:text-sm">Ente Federado</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Responsável */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold border-b pb-2">Responsável</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="ResponsavelNome"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Nome do Responsável</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="ResponsavelCPF"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">CPF do Responsável</FormLabel>
                                <FormControl>
                                  <Input {...field} maxLength={11} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Códigos Nacionais */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold border-b pb-2">Códigos Nacionais</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="IBGE"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Código IBGE</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="CodNacionalSigla"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Código Nacional (Sigla)</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="CodNacionalNumero"
                            render={({ field }) => (
                              <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel className="text-xs sm:text-sm">Código Nacional (Número)</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Imóvel */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold border-b pb-2">Informações do Imóvel</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="DescricaoImovel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Descrição do Imóvel</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="PrincipalOuAnexo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Principal ou Anexo</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="text-xs sm:text-sm">
                                      <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Principal">Principal</SelectItem>
                                      <SelectItem value="Anexo">Anexo</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="Anexo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Código do Anexo</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="CondicaoImovelPropriedade"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Condição de Propriedade</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="text-xs sm:text-sm">
                                      <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Próprio">Próprio</SelectItem>
                                      <SelectItem value="Alugado">Alugado</SelectItem>
                                      <SelectItem value="Cedido">Cedido</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="CondicaoImovelRestricao"
                            render={({ field }) => (
                              <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel className="text-xs sm:text-sm">Restrição do Imóvel</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="CondicaoServico"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs sm:text-sm">Condição do Serviço</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger className="text-xs sm:text-sm">
                                    <SelectValue placeholder="Selecione..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Ativo">Ativo</SelectItem>
                                    <SelectItem value="Inativo">Inativo</SelectItem>
                                    <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Endereço */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold border-b pb-2">Endereço</h3>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="EnderecoLogradouro"
                            render={({ field }) => (
                              <FormItem className="col-span-3 md:col-span-3">
                                <FormLabel className="text-xs sm:text-sm">Logradouro</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="EnderecoNumero"
                            render={({ field }) => (
                              <FormItem className="col-span-1">
                                <FormLabel className="text-xs sm:text-sm">Número</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="EnderecoComplemento"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Complemento</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="EnderecoBairroLocalidade"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Bairro/Localidade</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="EnderecoCEP"
                            render={({ field }) => (
                              <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel className="text-xs sm:text-sm">CEP</FormLabel>
                                <FormControl>
                                  <Input {...field} maxLength={8} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <FormField
                            control={form.control}
                            name="EnderecoLatitude"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Latitude</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="EnderecoLongitude"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs sm:text-sm">Longitude</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-xs sm:text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4 pt-4 sm:pt-6">
                        <Button type="button" variant="outline" onClick={handleBackToList} size="sm" className="text-xs sm:text-sm">
                          Cancelar
                        </Button>
                        <Button type="submit" size="sm" className="text-xs sm:text-sm">
                          <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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

      {/* Association Dialog */}
      <Dialog open={associationDialogOpen} onOpenChange={setAssociationDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Link2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Associar Equipamentos
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              <span className="block sm:inline">Equipamento Principal: {associatingEquipamento?.Descricao}</span>
              <span className="hidden sm:inline">{" - "}</span>
              <span className="block sm:inline">Número de Controle: {associatingEquipamento?.NumeroControle}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6 mt-3 sm:mt-4">
            {/* Current Associations Summary */}
            {associatingEquipamento && getAssociationsCount(associatingEquipamento.NumeroControle) > 0 && (
              <Card>
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm">Associações Atuais</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {(associations[associatingEquipamento.NumeroControle] || []).map((assoc, idx) => (
                      <Badge key={idx} variant="secondary" className="flex items-center gap-1 text-[10px] sm:text-xs">
                        {sistemasIntegrados.find(s => s.id === assoc.sistema)?.name}: {assoc.descricao}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* System Selection */}
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Selecionar Sistema Integrado</Label>
              <Select
                value={selectedAssociationSystem}
                onValueChange={setSelectedAssociationSystem}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Escolha um sistema para ver seus equipamentos..." />
                </SelectTrigger>
                <SelectContent>
                  {sistemasIntegrados.map((sistema) => (
                    <SelectItem key={sistema.id} value={sistema.id}>
                      {sistema.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Equipment List from Selected System */}
            {selectedAssociationSystem && (
              <Card>
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm">
                    Equipamentos do Sistema:{" "}
                    {sistemasIntegrados.find((s) => s.id === selectedAssociationSystem)?.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Pesquise e selecione os equipamentos que deseja associar
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Search Field */}
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm">Pesquisar Equipamento</Label>
                      <Input
                        placeholder="Digite o ID ou descrição..."
                        value={searchEquipamento}
                        onChange={(e) => setSearchEquipamento(e.target.value)}
                        className="text-xs sm:text-sm"
                      />
                    </div>

                    {/* Equipment List */}
                    <div className="space-y-2 sm:space-y-3 max-h-[250px] sm:max-h-[400px] overflow-y-auto">
                      {getFilteredEquipamentos().length === 0 ? (
                        <div className="text-center text-muted-foreground py-6 sm:py-8 text-xs sm:text-sm">
                          {searchEquipamento
                            ? "Nenhum equipamento encontrado com esse termo de busca."
                            : "Nenhum equipamento disponível neste sistema."}
                        </div>
                      ) : (
                        getFilteredEquipamentos().map((eq) => (
                          <div
                            key={eq.id}
                            className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <Checkbox
                              id={`eq-${eq.id}`}
                              checked={isAssociated(eq.id, selectedAssociationSystem)}
                              onCheckedChange={() =>
                                handleToggleAssociation(eq.id, selectedAssociationSystem, eq.descricao)
                              }
                            />
                            <label
                              htmlFor={`eq-${eq.id}`}
                              className="flex-1 cursor-pointer text-xs sm:text-sm"
                            >
                              <div className="font-medium">{eq.id}</div>
                              <div className="text-muted-foreground text-[10px] sm:text-xs">{eq.descricao}</div>
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4">
              <Button variant="outline" onClick={() => setAssociationDialogOpen(false)} size="sm" className="text-xs sm:text-sm">
                Fechar
              </Button>
              <Button
                onClick={() => {
                  toast.success("Associações salvas com sucesso!");
                  setAssociationDialogOpen(false);
                }}
                size="sm"
                className="text-xs sm:text-sm"
              >
                Salvar Associações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Acumuladores Dialog */}
      <Dialog open={acumuladoresDialogOpen} onOpenChange={setAcumuladoresDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Acumuladores do Equipamento Público</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Gerencie os acumuladores associados a este equipamento
            </DialogDescription>
          </DialogHeader>

          {acumuladoresEquipamento && (
            <div className="space-y-4 sm:space-y-6">
              {/* Equipment Info */}
              <div className="rounded-md border">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground w-[200px]">Código do Equipamento</TableCell>
                      <TableCell>{acumuladoresEquipamento.UG}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">Descrição</TableCell>
                      <TableCell>{acumuladoresEquipamento.Descricao}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Add new acumulador */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Adicionar Acumulador</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Modelo</Label>
                    <Input
                      value={novoAcumulador.Modelo}
                      onChange={(e) => setNovoAcumulador((p) => ({ ...p, Modelo: e.target.value }))}
                      className="text-xs h-8"
                      placeholder="Ex: 1"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Função</Label>
                    <Input
                      value={novoAcumulador.Funcao}
                      onChange={(e) => setNovoAcumulador((p) => ({ ...p, Funcao: e.target.value }))}
                      className="text-xs h-8"
                      placeholder="Ex: 02"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Objeto de Custos</Label>
                    <Input
                      value={novoAcumulador.ObjetoDeCustos}
                      onChange={(e) => setNovoAcumulador((p) => ({ ...p, ObjetoDeCustos: e.target.value }))}
                      className="text-xs h-8"
                      placeholder="Ex: 001"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Unidade de Custos</Label>
                    <Input
                      value={novoAcumulador.UnidadeDeCustos}
                      onChange={(e) => setNovoAcumulador((p) => ({ ...p, UnidadeDeCustos: e.target.value }))}
                      className="text-xs h-8"
                      placeholder="Ex: 001"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Centro de Custos</Label>
                    <Input
                      value={novoAcumulador.CentroDeCustos}
                      onChange={(e) => setNovoAcumulador((p) => ({ ...p, CentroDeCustos: e.target.value }))}
                      className="text-xs h-8"
                      placeholder="Ex: 006"
                    />
                  </div>
                </div>
                <Button onClick={handleAddAcumulador} size="sm" className="text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar
                </Button>
              </div>

              {/* Acumuladores Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Modelo</TableHead>
                      <TableHead className="text-xs">Função</TableHead>
                      <TableHead className="text-xs">Objeto de Custos</TableHead>
                      <TableHead className="text-xs">Unidade de Custos</TableHead>
                      <TableHead className="text-xs">Centro de Custos</TableHead>
                      <TableHead className="text-xs text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(acumuladores[acumuladoresEquipamento.NumeroControle] || []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-6 text-xs">
                          Nenhum acumulador cadastrado para este equipamento.
                        </TableCell>
                      </TableRow>
                    ) : (
                      (acumuladores[acumuladoresEquipamento.NumeroControle] || []).map((acumulador) => (
                        <TableRow key={acumulador.id}>
                          <TableCell className="text-xs">{acumulador.Modelo}</TableCell>
                          <TableCell className="text-xs">{acumulador.Funcao}</TableCell>
                          <TableCell className="text-xs">{acumulador.ObjetoDeCustos}</TableCell>
                          <TableCell className="text-xs">{acumulador.UnidadeDeCustos}</TableCell>
                          <TableCell className="text-xs">{acumulador.CentroDeCustos}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAcumulador(acumulador.id)}
                              className="h-7 w-7"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setAcumuladoresDialogOpen(false)} size="sm" className="text-xs sm:text-sm">
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipamentosPublicos;
