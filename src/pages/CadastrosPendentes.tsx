import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CheckCircle, Building2, FileText, ClipboardList, ExternalLink, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EPDynamicForm } from "@/components/dashboard/EPDynamicForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interface para registros pendentes de cadastro
interface RegistroPendente {
  id: string;
  tipo: "EP" | "VPD";
  codigo: string;
  descricao: string;
  origem: string;
  valor: number;
  dataIdentificacao: string;
  status: "pendente" | "em_analise";
}

// Mock de registros pendentes de cadastro
const mockRegistrosPendentes: RegistroPendente[] = [
  {
    id: "pend-1",
    tipo: "EP",
    codigo: "EP-2025-001",
    descricao: "Escola Municipal José de Alencar",
    origem: "Sistema de Educação",
    valor: 125000.00,
    dataIdentificacao: "2025-05-15",
    status: "pendente"
  },
  {
    id: "pend-2",
    tipo: "VPD",
    codigo: "3.3.9.1.00.00.00",
    descricao: "Despesas com Manutenção Predial",
    origem: "CP - Contabilidade",
    valor: 45780.50,
    dataIdentificacao: "2025-05-18",
    status: "pendente"
  },
  {
    id: "pend-3",
    tipo: "EP",
    codigo: "EP-2025-002",
    descricao: "Centro de Saúde Vila Nova",
    origem: "Sistema de Saúde",
    valor: 89500.00,
    dataIdentificacao: "2025-05-20",
    status: "em_analise"
  },
  {
    id: "pend-4",
    tipo: "VPD",
    codigo: "3.1.2.0.00.00.00",
    descricao: "Encargos Patronais",
    origem: "SIC - SMARRH",
    valor: 234100.00,
    dataIdentificacao: "2025-05-22",
    status: "pendente"
  },
  {
    id: "pend-5",
    tipo: "EP",
    codigo: "EP-2025-003",
    descricao: "Ginásio Poliesportivo Central",
    origem: "Sistema de Esportes",
    valor: 156700.00,
    dataIdentificacao: "2025-05-25",
    status: "pendente"
  }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export default function CadastrosPendentes() {
  const navigate = useNavigate();
  const [registrosPendentes, setRegistrosPendentes] = useState<RegistroPendente[]>(mockRegistrosPendentes);
  const [registroEmEdicao, setRegistroEmEdicao] = useState<RegistroPendente | null>(null);
  const [isAjusteModalOpen, setIsAjusteModalOpen] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "EP" | "VPD">("todos");

  const pendentesEP = registrosPendentes.filter(r => r.tipo === "EP").length;
  const pendentesVPD = registrosPendentes.filter(r => r.tipo === "VPD").length;

  const registrosFiltrados = filtroTipo === "todos" 
    ? registrosPendentes 
    : registrosPendentes.filter(r => r.tipo === filtroTipo);

  const handleAbrirAjuste = (registro: RegistroPendente) => {
    setRegistroEmEdicao(registro);
    setIsAjusteModalOpen(true);
  };

  const handleSalvarAjuste = () => {
    if (registroEmEdicao) {
      setRegistrosPendentes(prev => prev.filter(r => r.id !== registroEmEdicao.id));
      toast.success(`Cadastro de ${registroEmEdicao.tipo === "EP" ? "Equipamento Público" : "VPD"} realizado com sucesso!`);
      setIsAjusteModalOpen(false);
      setRegistroEmEdicao(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <ClipboardList className="h-6 w-6 text-orange-500" />
                Cadastros Pendentes
              </h1>
              <p className="text-muted-foreground text-sm">
                Registros identificados nos sistemas que necessitam de cadastro
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card 
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              filtroTipo === "todos" && "ring-2 ring-primary"
            )}
            onClick={() => setFiltroTipo("todos")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold">{registrosPendentes.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              filtroTipo === "EP" && "ring-2 ring-blue-500"
            )}
            onClick={() => setFiltroTipo("EP")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Equipamentos Públicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{pendentesEP}</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              filtroTipo === "VPD" && "ring-2 ring-purple-500"
            )}
            onClick={() => setFiltroTipo("VPD")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">VPDs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                <span className="text-2xl font-bold">{pendentesVPD}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Registros Pendentes</CardTitle>
                <CardDescription>
                  Clique em "Ajustar" para realizar o cadastro de cada registro
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-blue-500 text-blue-700 dark:text-blue-400 flex items-center gap-1.5 px-3 py-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {pendentesEP} EP
                </Badge>
                <Badge variant="outline" className="border-purple-500 text-purple-700 dark:text-purple-400 flex items-center gap-1.5 px-3 py-1">
                  <FileText className="h-3.5 w-3.5" />
                  {pendentesVPD} VPD
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {registrosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Nenhum registro pendente</h3>
                <p className="text-muted-foreground">
                  {filtroTipo === "todos" 
                    ? "Todos os registros estão cadastrados corretamente."
                    : `Não há ${filtroTipo === "EP" ? "Equipamentos Públicos" : "VPDs"} pendentes.`}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Tipo</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrosFiltrados.map((registro) => (
                    <TableRow key={registro.id}>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-xs",
                            registro.tipo === "EP" 
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" 
                              : "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                          )}
                        >
                          {registro.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{registro.codigo}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={registro.descricao}>
                        {registro.descricao}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{registro.origem}</TableCell>
                      <TableCell className="text-right font-semibold text-sm">
                        {registro.valor > 0 ? formatCurrency(registro.valor) : "-"}
                      </TableCell>
                      <TableCell className="text-xs">{formatDate(registro.dataIdentificacao)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px]",
                            registro.status === "em_analise" 
                              ? "border-yellow-500 text-yellow-700 dark:text-yellow-400" 
                              : "border-orange-500 text-orange-700 dark:text-orange-400"
                          )}
                        >
                          {registro.status === "em_analise" ? "Em Análise" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => handleAbrirAjuste(registro)}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Ajustar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Ajuste de Cadastro */}
      <Dialog open={isAjusteModalOpen} onOpenChange={setIsAjusteModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {registroEmEdicao?.tipo === "EP" ? (
                <Building2 className="h-5 w-5 text-blue-500" />
              ) : (
                <FileText className="h-5 w-5 text-purple-500" />
              )}
              Cadastrar {registroEmEdicao?.tipo === "EP" ? "Equipamento Público" : "VPD"}
            </DialogTitle>
            <DialogDescription>
              Complete as informações abaixo para realizar o cadastro do registro pendente.
            </DialogDescription>
          </DialogHeader>

          {registroEmEdicao && (
            <ScrollArea className="flex-1 max-h-[60vh]">
              <div className="space-y-4 pr-4">
                {/* Informações do registro pendente */}
                <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Código</span>
                    <span className="font-mono text-sm">{registroEmEdicao.codigo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Origem</span>
                    <span className="text-sm">{registroEmEdicao.origem}</span>
                  </div>
                  {registroEmEdicao.valor > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Valor</span>
                      <span className="text-sm font-semibold">{formatCurrency(registroEmEdicao.valor)}</span>
                    </div>
                  )}
                </div>

                {/* Formulário dinâmico baseado no tipo */}
                {registroEmEdicao.tipo === "EP" ? (
                  <EPDynamicForm 
                    defaultDescricao={registroEmEdicao.descricao}
                    compact={true}
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Input 
                        id="descricao" 
                        defaultValue={registroEmEdicao.descricao}
                        placeholder="Descrição do registro"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select>
                        <SelectTrigger id="categoria">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pessoal">Pessoal e Encargos</SelectItem>
                          <SelectItem value="beneficios">Benefícios Previdenciários</SelectItem>
                          <SelectItem value="manutencao">Manutenção e Operação</SelectItem>
                          <SelectItem value="tributarias">Tributárias</SelectItem>
                          <SelectItem value="outras">Outras VPDs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="natureza">Natureza da Despesa</Label>
                      <Input id="natureza" placeholder="Ex: 3.3.90.30.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="observacao">Observação</Label>
                      <Input id="observacao" placeholder="Observações adicionais (opcional)" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="gap-2 sm:gap-0 flex-shrink-0 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsAjusteModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarAjuste}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Salvar Cadastro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
