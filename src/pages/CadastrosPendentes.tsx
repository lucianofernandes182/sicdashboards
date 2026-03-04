import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowLeft, CheckCircle, Building2, FileText,
  ExternalLink, AlertCircle, Link2, X, Search, ShieldCheck, RefreshCw, XCircle, AlertTriangle, Clock } from
"lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

type InconsistenciaTipo =
"EP_NAO_ENCONTRADO" |
"EP_SEM_CODIGO" |
"VPD_INEXISTENTE" |
"VPD_NULL_PERMITIDO" |
"AGUARDANDO_VALIDACAO";

type RevalidacaoStatus =
"VALIDADO" |
"ERRO_CADASTRO_NAO_EXISTE" |
"ERRO_CODIGO_INVALIDO" |
"VPD_NULL_PERMITIDO";

interface RegistroPendente {
  id: string;
  tipo: "EP" | "VPD";
  codigo: string | null;
  descricao: string;
  tipoMovimento: string;
  origem: string;
  valor: number;
  dataIdentificacao: string;
  inconsistencia: InconsistenciaTipo;
}

const mockRegistrosPendentes: RegistroPendente[] = [
{
  id: "pend-1",
  tipo: "EP",
  codigo: "EP-2025-001",
  descricao: "Escola Municipal José de Alencar",
  tipoMovimento: "Depreciação",
  origem: "Sistema de Educação",
  valor: 125000.0,
  dataIdentificacao: "2025-05-15",
  inconsistencia: "EP_NAO_ENCONTRADO"
},
{
  id: "pend-2",
  tipo: "VPD",
  codigo: "3.3.9.1.00.00.00",
  descricao: "Despesas com Manutenção Predial",
  tipoMovimento: "Amortização",
  origem: "CP - Contabilidade",
  valor: 45780.5,
  dataIdentificacao: "2025-05-18",
  inconsistencia: "VPD_INEXISTENTE"
},
{
  id: "pend-3",
  tipo: "EP",
  codigo: null,
  descricao: "Centro de Saúde Vila Nova",
  tipoMovimento: "Depreciação",
  origem: "Sistema de Saúde",
  valor: 89500.0,
  dataIdentificacao: "2025-05-20",
  inconsistencia: "EP_SEM_CODIGO"
},
{
  id: "pend-4",
  tipo: "VPD",
  codigo: null,
  descricao: "Encargos Patronais",
  tipoMovimento: "Exaustão",
  origem: "SIC - SMARRH",
  valor: 234100.0,
  dataIdentificacao: "2025-05-22",
  inconsistencia: "VPD_NULL_PERMITIDO"
},
{
  id: "pend-5",
  tipo: "EP",
  codigo: "EP-2025-003",
  descricao: "Ginásio Poliesportivo Central",
  tipoMovimento: "Reavaliação",
  origem: "Sistema de Esportes",
  valor: 156700.0,
  dataIdentificacao: "2025-05-25",
  inconsistencia: "EP_NAO_ENCONTRADO"
},
{
  id: "pend-6",
  tipo: "VPD",
  codigo: "3.1.2.0.00.00.00",
  descricao: "Benefícios Previdenciários",
  tipoMovimento: "Amortização",
  origem: "CP - Contabilidade",
  valor: 89200.0,
  dataIdentificacao: "2025-05-28",
  inconsistencia: "AGUARDANDO_VALIDACAO"
}];


const formatCurrency = (value: number) =>
new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const inconsistenciaConfig: Record<InconsistenciaTipo, {label: string;color: string;icon: React.ReactNode;}> = {
  EP_NAO_ENCONTRADO: {
    label: "EP não encontrado",
    color: "border-destructive text-destructive",
    icon: <XCircle className="h-3 w-3" />
  },
  EP_SEM_CODIGO: {
    label: "EP sem código",
    color: "border-yellow-500 text-yellow-700 dark:text-yellow-400",
    icon: <AlertTriangle className="h-3 w-3" />
  },
  VPD_INEXISTENTE: {
    label: "VPD inexistente",
    color: "border-destructive text-destructive",
    icon: <XCircle className="h-3 w-3" />
  },
  VPD_NULL_PERMITIDO: {
    label: "VPD nulo (permitido)",
    color: "border-yellow-500 text-yellow-700 dark:text-yellow-400",
    icon: <AlertTriangle className="h-3 w-3" />
  },
  AGUARDANDO_VALIDACAO: {
    label: "Aguardando validação",
    color: "border-blue-500 text-blue-700 dark:text-blue-400",
    icon: <Clock className="h-3 w-3" />
  }
};

// Simula resultado da revalidação
function simularRevalidacao(registro: RegistroPendente): RevalidacaoStatus {
  if (registro.inconsistencia === "VPD_NULL_PERMITIDO") return "VPD_NULL_PERMITIDO";
  if (registro.inconsistencia === "AGUARDANDO_VALIDACAO") return "VALIDADO";
  if (registro.inconsistencia === "EP_SEM_CODIGO" && !registro.codigo) return "ERRO_CODIGO_INVALIDO";
  // Simula: 30% de chance de ter sido corrigido
  return Math.random() > 0.7 ? "VALIDADO" : "ERRO_CADASTRO_NAO_EXISTE";
}


export default function CadastrosPendentes() {
  const navigate = useNavigate();
  const [registrosPendentes, setRegistrosPendentes] = useState<RegistroPendente[]>(mockRegistrosPendentes);
  const [registroEmValidacao, setRegistroEmValidacao] = useState<RegistroPendente | null>(null);
  const [registrosSelecionados, setRegistrosSelecionados] = useState<Set<string>>(new Set());
  const [isRevalidacaoModalOpen, setIsRevalidacaoModalOpen] = useState(false);
  const [isVinculacaoModalOpen, setIsVinculacaoModalOpen] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "EP" | "VPD">("todos");
  const [codigoManual, setCodigoManual] = useState("");
  const [revalidacaoResultado, setRevalidacaoResultado] = useState<RevalidacaoStatus | null>(null);
  const [isRevalidando, setIsRevalidando] = useState(false);

  const pendentesEP = registrosPendentes.filter((r) => r.tipo === "EP").length;
  const pendentesVPD = registrosPendentes.filter((r) => r.tipo === "VPD").length;

  const registrosFiltrados =
  filtroTipo === "todos" ? registrosPendentes : registrosPendentes.filter((r) => r.tipo === filtroTipo);

  const registrosSelecionadosArray = registrosPendentes.filter((r) => registrosSelecionados.has(r.id));
  const tipoSelecionado = registrosSelecionadosArray.length > 0 ? registrosSelecionadosArray[0].tipo : null;
  const totalValorSelecionado = registrosSelecionadosArray.reduce((acc, r) => acc + r.valor, 0);

  // Estado para revalidação em massa
  const [isRevalidacaoMassaModalOpen, setIsRevalidacaoMassaModalOpen] = useState(false);
  const [isRevalidandoMassa, setIsRevalidandoMassa] = useState(false);
  const [resultadosMassa, setResultadosMassa] = useState<{registro: RegistroPendente; resultado: RevalidacaoStatus}[]>([]);

  const handleToggleSelecao = (id: string) => {
    setRegistrosSelecionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelecionarTodos = () => {
    if (registrosFiltrados.every((r) => registrosSelecionados.has(r.id))) {
      setRegistrosSelecionados(new Set());
    } else {
      setRegistrosSelecionados(new Set(registrosFiltrados.map((r) => r.id)));
    }
  };

  const handleRevalidarEmMassa = () => {
    setIsRevalidandoMassa(true);
    setResultadosMassa([]);
    setIsRevalidacaoMassaModalOpen(true);

    setTimeout(() => {
      const selecionados = registrosPendentes.filter((r) => registrosSelecionados.has(r.id));
      const resultados = selecionados.map((reg) => ({
        registro: reg,
        resultado: simularRevalidacao(reg),
      }));
      setResultadosMassa(resultados);
      setIsRevalidandoMassa(false);

      const idsValidados = resultados
        .filter((r) => r.resultado === "VALIDADO" || r.resultado === "VPD_NULL_PERMITIDO")
        .map((r) => r.registro.id);

      if (idsValidados.length > 0) {
        setTimeout(() => {
          setRegistrosPendentes((prev) => prev.filter((r) => !idsValidados.includes(r.id)));
          setRegistrosSelecionados((prev) => {
            const next = new Set(prev);
            idsValidados.forEach((id) => next.delete(id));
            return next;
          });
          toast.success(`${idsValidados.length} registro(s) validado(s) e removido(s) da listagem.`);
        }, 2000);
      }
    }, 1500);
  };

  const handleLimparSelecao = () => setRegistrosSelecionados(new Set());

  const handleAbrirRevalidacao = (registro: RegistroPendente) => {
    setRegistroEmValidacao(registro);
    setRevalidacaoResultado(null);
    setCodigoManual("");
    setIsRevalidando(true);
    setIsRevalidacaoModalOpen(true);

    // Executa revalidação automaticamente ao abrir
    setTimeout(() => {
      const resultado = simularRevalidacao(registro);
      setRevalidacaoResultado(resultado);
      setIsRevalidando(false);

      if (resultado === "VALIDADO" || resultado === "VPD_NULL_PERMITIDO") {
        setTimeout(() => {
          setRegistrosPendentes((prev) => prev.filter((r) => r.id !== registro.id));
          toast.success("Registro validado com sucesso.");
          setIsRevalidacaoModalOpen(false);
          setRegistroEmValidacao(null);
          setRevalidacaoResultado(null);
        }, 1500);
      }
    }, 1200);
  };

  const handleAbrirVinculacao = () => {
    if (registrosSelecionados.size < 2) {
      toast.error("Selecione pelo menos 2 registros para vincular");
      return;
    }
    setIsVinculacaoModalOpen(true);
  };

  const handleSalvarVinculacao = () => {
    const ids = Array.from(registrosSelecionados);
    setRegistrosPendentes((prev) => prev.filter((r) => !ids.includes(r.id)));
    toast.success(
      `${ids.length} registros vinculados com sucesso!`
    );
    setIsVinculacaoModalOpen(false);
    setRegistrosSelecionados(new Set());
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("pt-BR");

  

  const getResultMessage = (): {icon: React.ReactNode;text: string;variant: "success" | "error" | "warning";} | null => {
    if (!registroEmValidacao || !revalidacaoResultado) return null;
    const reg = registroEmValidacao;

    switch (revalidacaoResultado) {
      case "VALIDADO":
        return { icon: <CheckCircle className="h-5 w-5 text-green-500" />, text: "Registro consistente — será removido da listagem.", variant: "success" };
      case "VPD_NULL_PERMITIDO":
        return { icon: <CheckCircle className="h-5 w-5 text-green-500" />, text: "VPD nulo permitido pela regra contábil — registro validado.", variant: "success" };
      case "ERRO_CADASTRO_NAO_EXISTE":
        return reg.tipo === "EP" ?
        { icon: <XCircle className="h-5 w-5 text-destructive" />, text: `A contabilização informa o código ${reg.codigo || "(sem código)"}, porém não existe cadastro correspondente no sistema.`, variant: "error" } :
        { icon: <XCircle className="h-5 w-5 text-destructive" />, text: `O código de VPD ${reg.codigo || "(nulo)"} não foi encontrado no sistema.`, variant: "error" };
      case "ERRO_CODIGO_INVALIDO":
        return { icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />, text: "Registro recebido sem código válido.", variant: "warning" };
      default:
        return null;
    }
  };

  const resultMessage = getResultMessage();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/comparacao-vpds")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                Cadastro de Pendentes
              </h1>
              <p className="text-muted-foreground text-sm">
                Registros identificados nos sistemas externos que necessitam de validação de consistência cadastral
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card
            className={cn("cursor-pointer transition-all hover:shadow-md", filtroTipo === "todos" && "ring-2 ring-primary")}
            onClick={() => setFiltroTipo("todos")}>
            
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
            className={cn("cursor-pointer transition-all hover:shadow-md", filtroTipo === "EP" && "ring-2 ring-blue-500")}
            onClick={() => setFiltroTipo("EP")}>
            
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
            className={cn("cursor-pointer transition-all hover:shadow-md", filtroTipo === "VPD" && "ring-2 ring-purple-500")}
            onClick={() => setFiltroTipo("VPD")}>
            
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

        {/* Barra de Ações em Lote */}
        {registrosSelecionados.size > 0 &&
        <Card className="border-primary bg-primary/5">
            <CardContent className="py-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {registrosSelecionados.size} registro{registrosSelecionados.size > 1 ? "s" : ""} selecionado{registrosSelecionados.size > 1 ? "s" : ""}
                  </Badge>
                  {(() => {
                    const epCount = registrosSelecionadosArray.filter(r => r.tipo === "EP").length;
                    const vpdCount = registrosSelecionadosArray.filter(r => r.tipo === "VPD").length;
                    return (
                      <div className="flex items-center gap-1.5">
                        {epCount > 0 && (
                          <Badge variant="outline" className="text-xs border-blue-500 text-blue-700 dark:text-blue-400">
                            {epCount} EP
                          </Badge>
                        )}
                        {vpdCount > 0 && (
                          <Badge variant="outline" className="text-xs border-purple-500 text-purple-700 dark:text-purple-400">
                            {vpdCount} VPD
                          </Badge>
                        )}
                      </div>
                    );
                  })()}
                  {totalValorSelecionado > 0 &&
                <span className="text-sm text-muted-foreground">
                      Total: <span className="font-semibold">{formatCurrency(totalValorSelecionado)}</span>
                    </span>
                }
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleLimparSelecao} className="gap-1.5">
                    <X className="h-3.5 w-3.5" />
                    Limpar
                  </Button>
                  <Button size="sm" onClick={handleRevalidarEmMassa} className="gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Revalidar em Massa
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleAbrirVinculacao} className="gap-1.5" disabled={registrosSelecionados.size < 2}>
                    <Link2 className="h-3.5 w-3.5" />
                    Vincular a um Cadastro
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        }

        {/* Main Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Registros Pendentes de Validação</CardTitle>
                <CardDescription>
                  Clique em "Revalidar" para verificar a consistência cadastral de cada registro
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
            {registrosFiltrados.length === 0 ?
            <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                
                <p className="text-muted-foreground">
                  {filtroTipo === "todos" ?
                "Todos os registros estão consistentes." :
                `Não há ${filtroTipo === "EP" ? "Equipamentos Públicos" : "VPDs"} pendentes de validação.`}
                </p>
              </div> :

            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                      checked={registrosFiltrados.length > 0 && registrosFiltrados.every((r) => registrosSelecionados.has(r.id))}
                      onCheckedChange={handleSelecionarTodos} />
                    </TableHead>
                    <TableHead className="w-[80px]">Tipo</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Tipo Movimento</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrosFiltrados.map((registro) => {
                  const inc = inconsistenciaConfig[registro.inconsistencia];
                  return (
                    <TableRow
                      key={registro.id}
                      className={cn(registrosSelecionados.has(registro.id) && "bg-primary/5")}>
                      
                        <TableCell>
                          <Checkbox
                          checked={registrosSelecionados.has(registro.id)}
                          onCheckedChange={() => handleToggleSelecao(registro.id)} />
                        
                        </TableCell>
                        <TableCell>
                          <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            registro.tipo === "EP" ?
                            "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" :
                            "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                          )}>
                          
                            {registro.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {registro.codigo || <span className="text-muted-foreground italic">sem código</span>}
                        </TableCell>
                        <TableCell className="text-xs">{registro.tipoMovimento}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{registro.origem}</TableCell>
                        <TableCell className="text-right font-semibold text-sm">
                          {registro.valor > 0 ? formatCurrency(registro.valor) : "-"}
                        </TableCell>
                        <TableCell className="text-xs">{formatDate(registro.dataIdentificacao)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => handleAbrirRevalidacao(registro)}>
                          
                            <Search className="h-3.5 w-3.5" />
                            Revalidar
                          </Button>
                        </TableCell>
                      </TableRow>);

                })}
                </TableBody>
              </Table>
            }
          </CardContent>
        </Card>
      </div>

      {/* Modal de Revalidação - Simplificado */}
      <Dialog open={isRevalidacaoModalOpen} onOpenChange={setIsRevalidacaoModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Revalidar Registro
            </DialogTitle>
            <DialogDescription>
              Verificação de consistência cadastral do registro recebido.
            </DialogDescription>
          </DialogHeader>

          {registroEmValidacao &&
          <div className="space-y-4">
              {/* Info do registro */}
              <div className="p-3 bg-muted/50 rounded-lg space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tipo</span>
                  <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs",
                    registroEmValidacao.tipo === "EP" ?
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" :
                    "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                  )}>
                  
                    {registroEmValidacao.tipo === "EP" ? "Equipamento Público" : "VPD"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Código</span>
                  <span className="font-mono">
                    {registroEmValidacao.codigo || <span className="text-muted-foreground italic">não informado</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Origem</span>
                  <span>{registroEmValidacao.origem}</span>
                </div>
                {registroEmValidacao.valor > 0 &&
              <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Valor</span>
                    <span className="font-semibold">{formatCurrency(registroEmValidacao.valor)}</span>
                  </div>
              }
              </div>

              {/* Loading */}
              {isRevalidando &&
            <div className="flex items-center gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                  <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                  <span className="text-sm text-primary font-medium">Validando registro...</span>
                </div>
            }

              {/* Resultado */}
              {resultMessage && !isRevalidando &&
            <div className={cn(
              "flex items-start gap-3 p-4 rounded-lg border",
              resultMessage.variant === "success" && "border-green-500/30 bg-green-500/5",
              resultMessage.variant === "error" && "border-destructive/30 bg-destructive/5",
              resultMessage.variant === "warning" && "border-yellow-500/30 bg-yellow-500/5"
            )}>
                  {resultMessage.icon}
                  <p className="text-sm">{resultMessage.text}</p>
                </div>
            }
            </div>
          }

          <DialogFooter className="gap-2 sm:gap-0">
            {revalidacaoResultado && (revalidacaoResultado === "ERRO_CADASTRO_NAO_EXISTE" || revalidacaoResultado === "ERRO_CODIGO_INVALIDO") && registroEmValidacao?.tipo === "EP" &&
            <Button
              variant="outline"
              onClick={() => navigate("/equipamentos-publicos")}
              className="gap-1.5">
              
                <ExternalLink className="h-4 w-4" />
                Ir para Cadastro de EP
              </Button>
            }
            <Button variant="outline" onClick={() => setIsRevalidacaoModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Vinculação Múltipla */}
      <Dialog open={isVinculacaoModalOpen} onOpenChange={setIsVinculacaoModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              Vincular Registros a um Único Cadastro
            </DialogTitle>
            <DialogDescription>
              Os {registrosSelecionadosArray.length} registros selecionados serão vinculados a um único cadastro de{" "}
              {tipoSelecionado === "EP" ? "Equipamento Público" : "VPD"}.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="space-y-4 pr-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Registros que serão vinculados:</Label>
                <div className="border rounded-lg divide-y">
                  {registrosSelecionadosArray.map((registro) =>
                  <div key={registro.id} className="p-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs shrink-0",
                          registro.tipo === "EP" ?
                          "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" :
                          "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                        )}>
                        
                          {registro.tipo}
                        </Badge>
                        <div className="min-w-0">
                          <p className="font-mono text-xs text-muted-foreground">{registro.codigo || "sem código"}</p>
                          <p className="text-sm truncate">{registro.descricao}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">{registro.origem}</p>
                        {registro.valor > 0 && <p className="font-semibold text-sm">{formatCurrency(registro.valor)}</p>}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Total:</span>
                  <span className="text-lg font-bold">{formatCurrency(totalValorSelecionado)}</span>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2 sm:gap-0 flex-shrink-0 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsVinculacaoModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarVinculacao}>
              <Link2 className="h-4 w-4 mr-2" />
              Vincular e Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Revalidação em Massa */}
      <Dialog open={isRevalidacaoMassaModalOpen} onOpenChange={setIsRevalidacaoMassaModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Revalidação em Massa
            </DialogTitle>
            <DialogDescription>
              Resultado da revalidação de {registrosSelecionadosArray.length} registro(s) selecionado(s).
            </DialogDescription>
          </DialogHeader>

          {isRevalidandoMassa ? (
            <div className="flex items-center gap-3 p-6 rounded-lg border border-primary/30 bg-primary/5 justify-center">
              <RefreshCw className="h-5 w-5 text-primary animate-spin" />
              <span className="text-sm text-primary font-medium">Validando registros...</span>
            </div>
          ) : resultadosMassa.length > 0 ? (
            <ScrollArea className="flex-1 max-h-[60vh]">
              <div className="space-y-5 pr-4">
                {/* Agrupamento por tipo */}
                {["EP", "VPD"].map((tipo) => {
                  const doTipo = resultadosMassa.filter((r) => r.registro.tipo === tipo);
                  if (doTipo.length === 0) return null;
                  const validados = doTipo.filter((r) => r.resultado === "VALIDADO" || r.resultado === "VPD_NULL_PERMITIDO");
                  const inconsistentes = doTipo.filter((r) => r.resultado !== "VALIDADO" && r.resultado !== "VPD_NULL_PERMITIDO");

                  return (
                    <div key={tipo} className="space-y-3">
                      <div className="flex items-center gap-2">
                        {tipo === "EP" ? <Building2 className="h-4 w-4 text-blue-500" /> : <FileText className="h-4 w-4 text-purple-500" />}
                        <span className="font-semibold text-sm">{tipo === "EP" ? "Equipamentos Públicos" : "VPDs"}</span>
                        <Badge variant="outline" className="text-xs">{doTipo.length} registro(s)</Badge>
                      </div>

                      {/* Validados */}
                      {validados.length > 0 && (
                        <div className="border border-green-500/30 bg-green-500/5 rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-semibold">{validados.length} Validado(s)</span>
                          </div>
                          {validados.map((r) => (
                            <div key={r.registro.id} className="flex items-center justify-between text-sm pl-6">
                              <span className="font-mono text-xs">{r.registro.codigo || "sem código"}</span>
                              <span className="text-xs text-muted-foreground">{r.registro.origem}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Inconsistentes */}
                      {inconsistentes.length > 0 && (
                        <div className="border border-destructive/30 bg-destructive/5 rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2 text-destructive">
                            <XCircle className="h-4 w-4" />
                            <span className="text-xs font-semibold">{inconsistentes.length} Inconsistência(s)</span>
                          </div>
                          {inconsistentes.map((r) => (
                            <div key={r.registro.id} className="flex items-center justify-between text-sm pl-6 gap-2">
                              <div>
                                <span className="font-mono text-xs">{r.registro.codigo || "sem código"}</span>
                                <span className="text-xs text-muted-foreground ml-2">— {r.registro.origem}</span>
                              </div>
                              <span className="text-xs text-destructive shrink-0">
                                {r.resultado === "ERRO_CADASTRO_NAO_EXISTE" ? "Cadastro não encontrado" : "Código inválido"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevalidacaoMassaModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

}