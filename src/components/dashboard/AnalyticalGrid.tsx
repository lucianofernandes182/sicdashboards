import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface AnalyticalData {
  item: string;
  codigo: string;
  valorCP: number;
  valorSIC: number;
  diferenca: number;
  percentual: number;
  categoria: string;
}

interface AnalyticalGridProps {
  selectedNodeName?: string;
  selectedNodeLevel?: number;
  valorCP?: number;
  valorSIC?: number;
}

export function AnalyticalGrid({ 
  selectedNodeName = "Secretaria Municipal de Educação", 
  selectedNodeLevel = 4,
  valorCP = 0,
  valorSIC = 0
}: AnalyticalGridProps) {
  // Dados analíticos simulados comparando CP vs SIC
  const analyticalData: AnalyticalData[] = [
    {
      item: "Pessoal Ativo",
      codigo: "001.01.01",
      valorCP: 8500000,
      valorSIC: 8650000,
      diferenca: -150000,
      percentual: 65.5,
      categoria: "Recursos Humanos"
    },
    {
      item: "Encargos Sociais",
      codigo: "001.01.02",
      valorCP: 1200000,
      valorSIC: 1200000,
      diferenca: 0,
      percentual: 9.3,
      categoria: "Recursos Humanos"
    },
    {
      item: "Material de Consumo",
      codigo: "001.02.01",
      valorCP: 890000,
      valorSIC: 875000,
      diferenca: 15000,
      percentual: 6.8,
      categoria: "Materiais"
    },
    {
      item: "Serviços de Terceiros",
      codigo: "001.03.01",
      valorCP: 1800000,
      valorSIC: 1950000,
      diferenca: -150000,
      percentual: 13.9,
      categoria: "Contabilidade"
    },
    {
      item: "Equipamentos e Instalações",
      codigo: "001.04.01",
      valorCP: 450000,
      valorSIC: 380000,
      diferenca: 70000,
      percentual: 2.7,
      categoria: "Materiais"
    },
    {
      item: "Manutenção e Operação",
      codigo: "001.05.01",
      valorCP: 210000,
      valorSIC: 250000,
      diferenca: -40000,
      percentual: 1.8,
      categoria: "Contabilidade"
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDiferenca = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${formatCurrency(value)}`;
  };

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case "Recursos Humanos":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Materiais":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Contabilidade":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getDiferencaColor = (value: number) => {
    if (value > 0) return "text-green-600 dark:text-green-400";
    if (value < 0) return "text-red-600 dark:text-red-400";
    return "text-muted-foreground";
  };

  const totalCP = analyticalData.reduce((sum, item) => sum + item.valorCP, 0);
  const totalSIC = analyticalData.reduce((sum, item) => sum + item.valorSIC, 0);
  const totalDiferenca = totalCP - totalSIC;
  const itensComDivergencia = analyticalData.filter(item => item.diferenca !== 0).length;

  return (
    <Card className="glass neon-border">
      <CardHeader>
        <CardTitle className="glow-text flex items-center justify-between">
          <span>Comparativo CP vs SIC</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Nível {selectedNodeLevel}
            </Badge>
            {itensComDivergencia > 0 ? (
              <Badge variant="destructive" className="text-xs flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {itensComDivergencia} divergência(s)
              </Badge>
            ) : (
              <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Sem divergências
              </Badge>
            )}
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Análise detalhada para: <span className="font-medium text-primary">{selectedNodeName}</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20">
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold">Código</TableHead>
                <TableHead className="font-semibold text-right">CP (VPD)</TableHead>
                <TableHead className="font-semibold text-right">SIC (Sistemas)</TableHead>
                <TableHead className="font-semibold text-right">Diferença</TableHead>
                <TableHead className="font-semibold text-center">Status</TableHead>
                <TableHead className="font-semibold text-center">Categoria</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticalData.map((item, index) => (
                <TableRow key={index} className="hover:bg-muted/10">
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.codigo}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(item.valorCP)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(item.valorSIC)}
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${getDiferencaColor(item.diferenca)}`}>
                    {item.diferenca !== 0 ? formatDiferenca(item.diferenca) : '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.diferenca !== 0 ? (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Divergente
                      </Badge>
                    ) : (
                      <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        OK
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getCategoryColor(item.categoria)}>
                      {item.categoria}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Totais */}
        <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Total de {analyticalData.length} itens analíticos
            </span>
            <div className="flex items-center gap-4 text-sm">
              <span>
                <span className="text-muted-foreground">CP:</span>{" "}
                <span className="font-semibold">{formatCurrency(totalCP)}</span>
              </span>
              <span>
                <span className="text-muted-foreground">SIC:</span>{" "}
                <span className="font-semibold">{formatCurrency(totalSIC)}</span>
              </span>
              <span className={`font-semibold ${getDiferencaColor(totalDiferenca)}`}>
                <span className="text-muted-foreground">Dif:</span>{" "}
                {formatDiferenca(totalDiferenca)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}