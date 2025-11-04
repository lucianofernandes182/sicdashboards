import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface VPDRecord {
  id: string;
  mes: string;
  ano: string;
  status: "aprovado" | "pendente";
  modeloOrganico: {
    vpds: number;
    sistemas: {
      smarcp: number;
      smarrh: number;
      smaram: number;
      contasConsumo: number;
      total: number;
    };
  };
  modeloProgramatico: {
    vpds: number;
    sistemas: {
      smarcp: number;
      smarrh: number;
      smaram: number;
      contasConsumo: number;
      total: number;
    };
  };
}

// Mock data - substituir por dados reais da API
const mockRecords: VPDRecord[] = [
  {
    id: "1",
    mes: "05",
    ano: "2025",
    status: "pendente",
    modeloOrganico: {
      vpds: 70475120.53,
      sistemas: {
        smarcp: 9905743.87,
        smarrh: 40444503.59,
        smaram: 19293008.69,
        contasConsumo: 666679.06,
        total: 70311935.21
      }
    },
    modeloProgramatico: {
      vpds: 70475120.53,
      sistemas: {
        smarcp: 52005416.31,
        smarrh: 0,
        smaram: 0,
        contasConsumo: 0,
        total: 62096416.31
      }
    }
  },
  {
    id: "2",
    mes: "04",
    ano: "2025",
    status: "aprovado",
    modeloOrganico: {
      vpds: 68500000.00,
      sistemas: {
        smarcp: 9500000.00,
        smarrh: 39000000.00,
        smaram: 18500000.00,
        contasConsumo: 650000.00,
        total: 67650000.00
      }
    },
    modeloProgramatico: {
      vpds: 68500000.00,
      sistemas: {
        smarcp: 50000000.00,
        smarrh: 0,
        smaram: 0,
        contasConsumo: 0,
        total: 60000000.00
      }
    }
  }
];

export default function ComparacaoVPDs() {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<VPDRecord | null>(null);
  const [records, setRecords] = useState<VPDRecord[]>(mockRecords);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calcularDiferenca = (vpd: number, total: number) => {
    const diferenca = Math.abs(vpd - total);
    const percentual = (diferenca / vpd) * 100;
    return { diferenca, percentual };
  };

  const temDivergencia = (vpd: number, total: number) => {
    const { diferenca } = calcularDiferenca(vpd, total);
    return diferenca > 0.01; // Considera divergência se diferença for maior que 1 centavo
  };

  const handleAprovar = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    const divergenciaOrganico = temDivergencia(record.modeloOrganico.vpds, record.modeloOrganico.sistemas.total);
    const divergenciaProgramatico = temDivergencia(record.modeloProgramatico.vpds, record.modeloProgramatico.sistemas.total);

    if (divergenciaOrganico || divergenciaProgramatico) {
      toast.error("Não é possível aprovar registro com divergências");
      return;
    }

    setRecords(records.map(r => 
      r.id === recordId ? { ...r, status: "aprovado" as const } : r
    ));
    toast.success("Registro aprovado com sucesso!");
    setSelectedRecord(null);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Comparação de VPDs</h1>
            <p className="text-muted-foreground">Validação de registros mensais entre sistemas</p>
          </div>
        </div>

        {!selectedRecord ? (
          <Card>
            <CardHeader>
              <CardTitle>Registros de VPDs</CardTitle>
              <CardDescription>Selecione um registro para visualizar a comparação detalhada</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês/Ano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Modelo Orgânico</TableHead>
                    <TableHead>Modelo Programático</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => {
                    const divOrganic = temDivergencia(record.modeloOrganico.vpds, record.modeloOrganico.sistemas.total);
                    const divProg = temDivergencia(record.modeloProgramatico.vpds, record.modeloProgramatico.sistemas.total);
                    
                    return (
                      <TableRow key={record.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedRecord(record)}>
                        <TableCell className="font-medium">{record.mes}/{record.ano}</TableCell>
                        <TableCell>
                          <Badge variant={record.status === "aprovado" ? "default" : "secondary"}>
                            {record.status === "aprovado" ? "Aprovado" : "Pendente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {formatCurrency(record.modeloOrganico.vpds)}
                            {divOrganic && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {formatCurrency(record.modeloProgramatico.vpds)}
                            {divProg && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Ver Detalhes</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para listagem
              </Button>
              {selectedRecord.status === "pendente" && (
                <Button onClick={() => handleAprovar(selectedRecord.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar Registro
                </Button>
              )}
            </div>

            <div className="grid gap-6">
              {/* Modelo Orgânico */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Modelo Orgânico - {selectedRecord.mes}/{selectedRecord.ano}</CardTitle>
                      <CardDescription>Comparação entre CP (VPDs) e SIC (Sistemas)</CardDescription>
                    </div>
                    {temDivergencia(selectedRecord.modeloOrganico.vpds, selectedRecord.modeloOrganico.sistemas.total) ? (
                      <Badge variant="destructive" className="flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Divergente
                      </Badge>
                    ) : (
                      <Badge variant="default" className="flex items-center gap-2 bg-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Validado
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {/* CP - VPDs */}
                    <div className="space-y-4 border-r pr-6">
                      <div className="p-4 bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">CP - VPDs</p>
                        <p className="text-sm text-muted-foreground mb-2">Total do mês {selectedRecord.mes}/{selectedRecord.ano}</p>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(selectedRecord.modeloOrganico.vpds)}</p>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Origem CP</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-sm">AM Patrimônio</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(2881469.10)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">AM Almoxarifado</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(2409547.34)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">AM CompasLiq</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(14001992.25)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">RH Provisão</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(5240514.20)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">RH Liquidação</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(35205989.39)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">CP Transferência</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(163185.42)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">CP Liquidação</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(10572422.93)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {/* SIC - Sistemas */}
                    <div className="space-y-4 pl-6">
                      <div className="p-4 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">SIC - Sistemas</p>
                        <p className="text-sm text-muted-foreground mb-2">Total dos sistemas</p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">{formatCurrency(selectedRecord.modeloOrganico.sistemas.total)}</p>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sistema</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-sm">SMARCP</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(selectedRecord.modeloOrganico.sistemas.smarcp)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">SMARRH</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(selectedRecord.modeloOrganico.sistemas.smarrh)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">SMARAM</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(selectedRecord.modeloOrganico.sistemas.smaram)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">Contas de Consumo</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(selectedRecord.modeloOrganico.sistemas.contasConsumo)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {temDivergencia(selectedRecord.modeloOrganico.vpds, selectedRecord.modeloOrganico.sistemas.total) && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Diferença: {formatCurrency(calcularDiferenca(selectedRecord.modeloOrganico.vpds, selectedRecord.modeloOrganico.sistemas.total).diferenca)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Modelo Programático */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Modelo Programático - {selectedRecord.mes}/{selectedRecord.ano}</CardTitle>
                      <CardDescription>Comparação entre CP (VPDs) e SIC (Sistemas)</CardDescription>
                    </div>
                    {temDivergencia(selectedRecord.modeloProgramatico.vpds, selectedRecord.modeloProgramatico.sistemas.total) ? (
                      <Badge variant="destructive" className="flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Divergente
                      </Badge>
                    ) : (
                      <Badge variant="default" className="flex items-center gap-2 bg-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Validado
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {/* CP - VPDs */}
                    <div className="space-y-4 border-r pr-6">
                      <div className="p-4 bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">CP - VPDs</p>
                        <p className="text-sm text-muted-foreground mb-2">Total do mês {selectedRecord.mes}/{selectedRecord.ano}</p>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(selectedRecord.modeloProgramatico.vpds)}</p>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Origem CP</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-sm">AM Patrimônio</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(2881469.10)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">AM Almoxarifado</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(2316011.74)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">AM CompasLiq</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(14001992.25)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">RH Provisão</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(5240514.20)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">RH Liquidação</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(35205989.39)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">CP Transferência</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(163185.42)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">CP Liquidação</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(10572422.93)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {/* SIC - Sistemas */}
                    <div className="space-y-4 pl-6">
                      <div className="p-4 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">SIC - Sistemas</p>
                        <p className="text-sm text-muted-foreground mb-2">Total dos sistemas</p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">{formatCurrency(selectedRecord.modeloProgramatico.sistemas.total)}</p>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sistema</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-sm">SMARCP</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(selectedRecord.modeloProgramatico.sistemas.smarcp)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">SMARRH</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(selectedRecord.modeloProgramatico.sistemas.smarrh)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">SMARAM</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(selectedRecord.modeloProgramatico.sistemas.smaram)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm">Contas de Consumo</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(selectedRecord.modeloProgramatico.sistemas.contasConsumo)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {temDivergencia(selectedRecord.modeloProgramatico.vpds, selectedRecord.modeloProgramatico.sistemas.total) && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Diferença: {formatCurrency(calcularDiferenca(selectedRecord.modeloProgramatico.vpds, selectedRecord.modeloProgramatico.sistemas.total).diferenca)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
