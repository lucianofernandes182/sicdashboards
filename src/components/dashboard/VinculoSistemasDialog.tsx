import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Server, Plus, Trash2, Edit, Settings2, AlertTriangle, CheckCircle2, Info, ArrowLeft, Save, Layers } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export interface VinculoSistema {
  id: string;
  sistema: string;
  codigoNoSistema: string;
  descricaoNoSistema: string;
  tipoVinculo: "direto" | "avancado";
  status: "valido" | "requer_regra";
  acumuladores: string[];
  regraAvancada?: RegraAvancada;
}

interface RegraAvancada {
  contextoOrganico: {
    poder: string;
    orgao: string;
    unidadeOrcamentaria: string;
  };
  contextoProgramatico: {
    funcao: string;
    subfuncao: string;
    programa: string;
    acao: string;
  };
  condicoesOpcionais: string;
}

interface VinculoSistemasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipamentoUG: string;
  equipamentoDescricao: string;
  equipamentoNumeroControle: string;
  vinculos: VinculoSistema[];
  onVinculosChange: (vinculos: VinculoSistema[]) => void;
}

// Simulates backend detection of whether a code requires advanced rules
const detectRequiresAdvancedRule = (sistema: string, codigo: string): { requires: boolean; reason: string } => {
  const genericCodes = ["GEN001", "GEN002", "GERAL", "TODOS"];
  if (genericCodes.some(gc => codigo.toUpperCase().includes(gc))) {
    return { requires: true, reason: "O código informado é genérico e pode estar vinculado a múltiplos equipamentos." };
  }
  if (codigo.startsWith("CP")) {
    return { requires: true, reason: "Vínculos com o sistema CP geralmente exigem contexto orgânico e programático." };
  }
  return { requires: false, reason: "" };
};

const sistemasDisponiveis = [
  { id: "AM", name: "AM - Administração de Materiais" },
  { id: "RH", name: "RH - Recursos Humanos" },
  { id: "CP", name: "CP - Contabilidade Pública" },
];

const acumuladoresDisponiveis = [
  { id: "DEP", label: "Depreciação" },
  { id: "AMO", label: "Amortização" },
  { id: "EXA", label: "Exaustão" },
  { id: "RED", label: "Redução ao Valor Recuperável" },
  { id: "REA", label: "Reavaliação" },
];

export const VinculoSistemasDialog = ({
  open,
  onOpenChange,
  equipamentoUG,
  equipamentoDescricao,
  equipamentoNumeroControle,
  vinculos,
  onVinculosChange,
}: VinculoSistemasDialogProps) => {
  const [subView, setSubView] = useState<"list" | "add" | "advanced">("list");
  const [selectedSistema, setSelectedSistema] = useState("");
  const [selectedCodigo, setSelectedCodigo] = useState("");
  const [selectedDescricao, setSelectedDescricao] = useState("");
  const [selectedAcumuladores, setSelectedAcumuladores] = useState<string[]>([]);
  const [advancedWarning, setAdvancedWarning] = useState<{ requires: boolean; reason: string }>({ requires: false, reason: "" });
  const [editingVinculoId, setEditingVinculoId] = useState<string | null>(null);
  const [regraAvancada, setRegraAvancada] = useState<RegraAvancada>({
    contextoOrganico: { poder: "", orgao: "", unidadeOrcamentaria: "" },
    contextoProgramatico: { funcao: "", subfuncao: "", programa: "", acao: "" },
    condicoesOpcionais: "",
  });

  const resetAddForm = () => {
    setSelectedSistema("");
    setSelectedCodigo("");
    setSelectedDescricao("");
    setSelectedAcumuladores([]);
    setAdvancedWarning({ requires: false, reason: "" });
    setEditingVinculoId(null);
    setRegraAvancada({
      contextoOrganico: { poder: "", orgao: "", unidadeOrcamentaria: "" },
      contextoProgramatico: { funcao: "", subfuncao: "", programa: "", acao: "" },
      condicoesOpcionais: "",
    });
  };

  const handleCodigoChange = (codigo: string) => {
    setSelectedCodigo(codigo);
    if (selectedSistema && codigo) {
      const detection = detectRequiresAdvancedRule(selectedSistema, codigo);
      setAdvancedWarning(detection);
    } else {
      setAdvancedWarning({ requires: false, reason: "" });
    }
  };

  const handleSaveDirect = () => {
    if (!selectedSistema || !selectedCodigo) {
      toast.error("Selecione o sistema e informe o código.");
      return;
    }
    const newVinculo: VinculoSistema = {
      id: editingVinculoId || crypto.randomUUID(),
      sistema: selectedSistema,
      codigoNoSistema: selectedCodigo,
      descricaoNoSistema: selectedDescricao,
      tipoVinculo: "direto",
      status: advancedWarning.requires ? "requer_regra" : "valido",
      acumuladores: selectedAcumuladores,
    };

    if (editingVinculoId) {
      onVinculosChange(vinculos.map(v => v.id === editingVinculoId ? newVinculo : v));
    } else {
      onVinculosChange([...vinculos, newVinculo]);
    }
    toast.success("Vínculo salvo com sucesso!");
    resetAddForm();
    setSubView("list");
  };

  const handleSaveAdvanced = () => {
    if (!selectedSistema || !selectedCodigo) {
      toast.error("Selecione o sistema e informe o código.");
      return;
    }
    const newVinculo: VinculoSistema = {
      id: editingVinculoId || crypto.randomUUID(),
      sistema: selectedSistema,
      codigoNoSistema: selectedCodigo,
      descricaoNoSistema: selectedDescricao,
      tipoVinculo: "avancado",
      status: "valido",
      acumuladores: selectedAcumuladores,
      regraAvancada,
    };

    if (editingVinculoId) {
      onVinculosChange(vinculos.map(v => v.id === editingVinculoId ? newVinculo : v));
    } else {
      onVinculosChange([...vinculos, newVinculo]);
    }
    toast.success("Vínculo com regra avançada salvo com sucesso!");
    resetAddForm();
    setSubView("list");
  };

  const handleDelete = (id: string) => {
    onVinculosChange(vinculos.filter(v => v.id !== id));
    toast.success("Vínculo removido!");
  };

  const handleEdit = (vinculo: VinculoSistema) => {
    setSelectedSistema(vinculo.sistema);
    setSelectedCodigo(vinculo.codigoNoSistema);
    setSelectedDescricao(vinculo.descricaoNoSistema);
    setSelectedAcumuladores(vinculo.acumuladores || []);
    setEditingVinculoId(vinculo.id);
    const detection = detectRequiresAdvancedRule(vinculo.sistema, vinculo.codigoNoSistema);
    setAdvancedWarning(detection);
    if (vinculo.regraAvancada) {
      setRegraAvancada(vinculo.regraAvancada);
    }
    setSubView("add");
  };

  const handleConfigureAdvanced = (vinculo: VinculoSistema) => {
    setSelectedSistema(vinculo.sistema);
    setSelectedCodigo(vinculo.codigoNoSistema);
    setEditingVinculoId(vinculo.id);
    if (vinculo.regraAvancada) {
      setRegraAvancada(vinculo.regraAvancada);
    }
    setSubView("advanced");
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      resetAddForm();
      setSubView("list");
    }
    onOpenChange(value);
  };

  const toggleAcumulador = (id: string) => {
    setSelectedAcumuladores(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Server className="h-4 w-4 sm:h-5 sm:w-5" />
            Vínculo com Sistemas
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Equipamento: <strong>{equipamentoUG}</strong> — {equipamentoDescricao}
          </DialogDescription>
        </DialogHeader>

        {/* LIST VIEW */}
        {subView === "list" && (
          <div className="space-y-4 mt-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {vinculos.length === 0
                  ? "Nenhum sistema vinculado. Adicione um vínculo para começar."
                  : `${vinculos.length} vínculo(s) cadastrado(s)`}
              </p>
              <Button size="sm" className="text-xs" onClick={() => { resetAddForm(); setSubView("add"); }}>
                <Plus className="h-3 w-3 mr-1" />
                Adicionar vínculo
              </Button>
            </div>

            {vinculos.length > 0 && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Sistema</TableHead>
                      <TableHead className="text-xs">Código</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Descrição</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Acumuladores</TableHead>
                      <TableHead className="text-xs">Tipo</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vinculos.map((vinculo) => (
                      <TableRow key={vinculo.id}>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="text-[10px]">{vinculo.sistema}</Badge>
                        </TableCell>
                        <TableCell className="text-xs font-mono">{vinculo.codigoNoSistema}</TableCell>
                        <TableCell className="text-xs hidden sm:table-cell text-muted-foreground">
                          {vinculo.descricaoNoSistema}
                        </TableCell>
                        <TableCell className="text-xs hidden sm:table-cell">
                          {vinculo.acumuladores && vinculo.acumuladores.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {vinculo.acumuladores.map(ac => (
                                <Badge key={ac} variant="outline" className="text-[10px]">{ac}</Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge
                            variant={vinculo.tipoVinculo === "direto" ? "secondary" : "default"}
                            className="text-[10px]"
                          >
                            {vinculo.tipoVinculo === "direto" ? "Direto" : "Avançado"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {vinculo.status === "valido" ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="h-3 w-3" />
                              <span className="hidden sm:inline">Válido</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-600">
                              <AlertTriangle className="h-3 w-3" />
                              <span className="hidden sm:inline">Requer regra</span>
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(vinculo)} title="Editar">
                              <Edit className="h-3 w-3" />
                            </Button>
                            {(vinculo.status === "requer_regra" || vinculo.tipoVinculo === "avancado") && (
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleConfigureAdvanced(vinculo)} title="Configurar regra avançada">
                                <Settings2 className="h-3 w-3" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(vinculo.id)} title="Remover">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {vinculos.length === 0 && (
              <div className="flex items-start gap-3 rounded-lg border border-dashed p-4">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Como funciona?</p>
                  <p>Vincule este equipamento aos sistemas de origem (AM, RH, CP) informando o código correspondente em cada sistema.</p>
                  <p>Na maioria dos casos, o vínculo é direto e simples. Se o sistema detectar a necessidade de informações adicionais, você será orientado a configurar uma regra avançada.</p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => handleOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </div>
        )}

        {/* ADD VIEW */}
        {subView === "add" && (
          <div className="space-y-4 mt-2">
            <Button variant="ghost" size="sm" className="text-xs -ml-2" onClick={() => { resetAddForm(); setSubView("list"); }}>
              <ArrowLeft className="h-3 w-3 mr-1" />
              Voltar para lista
            </Button>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">
                  {editingVinculoId ? "Editar vínculo" : "Novo vínculo"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Sistema de origem</Label>
                    <Select value={selectedSistema} onValueChange={(v) => { setSelectedSistema(v); setSelectedCodigo(""); setSelectedDescricao(""); setAdvancedWarning({ requires: false, reason: "" }); }}>
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder="Selecione o sistema..." />
                      </SelectTrigger>
                      <SelectContent>
                        {sistemasDisponiveis.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Código no sistema</Label>
                    <Input
                      value={selectedCodigo}
                      onChange={(e) => handleCodigoChange(e.target.value)}
                      className="text-xs h-10"
                      placeholder="Ex: AM001"
                      disabled={!selectedSistema}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Descrição</Label>
                    <Input
                      value={selectedDescricao}
                      onChange={(e) => setSelectedDescricao(e.target.value)}
                      className="text-xs h-10"
                      placeholder="Ex: Almoxarifado Central"
                      disabled={!selectedSistema}
                    />
                  </div>
                </div>

                {/* Acumuladores */}
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    Acumuladores
                  </Label>
                  <p className="text-[11px] text-muted-foreground">Selecione os acumuladores aplicáveis a este vínculo.</p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    {acumuladoresDisponiveis.map(ac => (
                      <label key={ac.id} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedAcumuladores.includes(ac.id)}
                          onCheckedChange={() => toggleAcumulador(ac.id)}
                        />
                        <span className="text-xs">{ac.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Advanced warning */}
                {advancedWarning.requires && selectedCodigo && (
                  <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <div className="space-y-2">
                      <p className="text-xs text-amber-800 dark:text-amber-300">
                        Este vínculo exige informações adicionais para garantir a contabilização correta.
                      </p>
                      <p className="text-[11px] text-muted-foreground">{advancedWarning.reason}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-amber-500/50 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
                        onClick={() => setSubView("advanced")}
                      >
                        <Settings2 className="h-3 w-3 mr-1" />
                        Configurar regra avançada
                      </Button>
                    </div>
                  </div>
                )}

                {/* Success hint */}
                {selectedSistema && selectedCodigo && !advancedWarning.requires && (
                  <div className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/5 p-3">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-green-800 dark:text-green-300">
                      Vínculo direto identificado. Nenhuma configuração adicional é necessária.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => { resetAddForm(); setSubView("list"); }}>
                    Cancelar
                  </Button>
                  <Button size="sm" className="text-xs" onClick={handleSaveDirect} disabled={!selectedSistema || !selectedCodigo}>
                    <Save className="h-3 w-3 mr-1" />
                    Salvar vínculo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ADVANCED RULE VIEW */}
        {subView === "advanced" && (
          <div className="space-y-4 mt-2">
            <Button variant="ghost" size="sm" className="text-xs -ml-2" onClick={() => setSubView("add")}>
              <ArrowLeft className="h-3 w-3 mr-1" />
              Voltar
            </Button>

            <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p>Configuração avançada para o vínculo <strong className="text-foreground">{selectedCodigo}</strong> do sistema <strong className="text-foreground">{selectedSistema}</strong>.</p>
                <p className="mt-1">Preencha os contextos necessários para garantir a contabilização correta.</p>
              </div>
            </div>

            {/* Contexto Orgânico */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">Contexto Orgânico</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Poder</Label>
                    <Input
                      value={regraAvancada.contextoOrganico.poder}
                      onChange={e => setRegraAvancada(prev => ({ ...prev, contextoOrganico: { ...prev.contextoOrganico, poder: e.target.value } }))}
                      className="text-xs h-8"
                      placeholder="Ex: Executivo"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Órgão</Label>
                    <Input
                      value={regraAvancada.contextoOrganico.orgao}
                      onChange={e => setRegraAvancada(prev => ({ ...prev, contextoOrganico: { ...prev.contextoOrganico, orgao: e.target.value } }))}
                      className="text-xs h-8"
                      placeholder="Ex: Secretaria de Educação"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Unidade Orçamentária</Label>
                    <Input
                      value={regraAvancada.contextoOrganico.unidadeOrcamentaria}
                      onChange={e => setRegraAvancada(prev => ({ ...prev, contextoOrganico: { ...prev.contextoOrganico, unidadeOrcamentaria: e.target.value } }))}
                      className="text-xs h-8"
                      placeholder="Ex: 20.101"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contexto Programático */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">Contexto Programático</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Função</Label>
                    <Input
                      value={regraAvancada.contextoProgramatico.funcao}
                      onChange={e => setRegraAvancada(prev => ({ ...prev, contextoProgramatico: { ...prev.contextoProgramatico, funcao: e.target.value } }))}
                      className="text-xs h-8"
                      placeholder="Ex: 12"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Subfunção</Label>
                    <Input
                      value={regraAvancada.contextoProgramatico.subfuncao}
                      onChange={e => setRegraAvancada(prev => ({ ...prev, contextoProgramatico: { ...prev.contextoProgramatico, subfuncao: e.target.value } }))}
                      className="text-xs h-8"
                      placeholder="Ex: 361"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Programa</Label>
                    <Input
                      value={regraAvancada.contextoProgramatico.programa}
                      onChange={e => setRegraAvancada(prev => ({ ...prev, contextoProgramatico: { ...prev.contextoProgramatico, programa: e.target.value } }))}
                      className="text-xs h-8"
                      placeholder="Ex: 0001"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Ação</Label>
                    <Input
                      value={regraAvancada.contextoProgramatico.acao}
                      onChange={e => setRegraAvancada(prev => ({ ...prev, contextoProgramatico: { ...prev.contextoProgramatico, acao: e.target.value } }))}
                      className="text-xs h-8"
                      placeholder="Ex: 2001"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Condições Opcionais */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">Condições opcionais</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-1">
                  <Label className="text-xs">Observações ou condições adicionais</Label>
                  <Input
                    value={regraAvancada.condicoesOpcionais}
                    onChange={e => setRegraAvancada(prev => ({ ...prev, condicoesOpcionais: e.target.value }))}
                    className="text-xs h-8"
                    placeholder="Descreva condições específicas, se houver..."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setSubView("add")}>
                Cancelar
              </Button>
              <Button size="sm" className="text-xs" onClick={handleSaveAdvanced}>
                <Save className="h-3 w-3 mr-1" />
                Salvar regra avançada
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
