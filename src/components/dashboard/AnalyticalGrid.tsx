import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AnalyticalData {
  item: string;
  codigo: string;
  valor2024: number;
  valor2025: number;
  variacao: number;
  percentual: number;
  categoria: string;
}

interface AnalyticalGridProps {
  selectedNodeName?: string;
  selectedNodeLevel?: number;
}

export function AnalyticalGrid({ selectedNodeName = "Secretaria Municipal de Educação", selectedNodeLevel = 4 }: AnalyticalGridProps) {
  // Dados analíticos simulados baseados no nó selecionado
  const analyticalData: AnalyticalData[] = [
    {
      item: "Pessoal Ativo",
      codigo: "001.01.01",
      valor2024: 8500000,
      valor2025: 9200000,
      variacao: 8.2,
      percentual: 65.5,
      categoria: "Recursos Humanos"
    },
    {
      item: "Encargos Sociais",
      codigo: "001.01.02",
      valor2024: 1200000,
      valor2025: 1300000,
      variacao: 8.3,
      percentual: 9.3,
      categoria: "Recursos Humanos"
    },
    {
      item: "Material de Consumo",
      codigo: "001.02.01",
      valor2024: 890000,
      valor2025: 950000,
      variacao: 6.7,
      percentual: 6.8,
      categoria: "Materiais"
    },
    {
      item: "Serviços de Terceiros",
      codigo: "001.03.01",
      valor2024: 1800000,
      valor2025: 1950000,
      variacao: 8.3,
      percentual: 13.9,
      categoria: "Contabilidade"
    },
    {
      item: "Equipamentos e Instalações",
      codigo: "001.04.01",
      valor2024: 450000,
      valor2025: 380000,
      variacao: -15.6,
      percentual: 2.7,
      categoria: "Materiais"
    },
    {
      item: "Manutenção e Operação",
      codigo: "001.05.01",
      valor2024: 210000,
      valor2025: 250000,
      variacao: 19.0,
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

  const formatVariation = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
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

  const getVariationColor = (value: number) => {
    if (value > 0) return "text-green-600 dark:text-green-400";
    if (value < 0) return "text-red-600 dark:text-red-400";
    return "text-muted-foreground";
  };

  return (
    <Card className="glass neon-border">
      <CardHeader>
        <CardTitle className="glow-text flex items-center justify-between">
          <span>Dados Analíticos Detalhados</span>
          <Badge variant="outline" className="text-xs">
            Nível {selectedNodeLevel}
          </Badge>
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
                <TableHead className="font-semibold text-right">2024</TableHead>
                <TableHead className="font-semibold text-right">2025</TableHead>
                <TableHead className="font-semibold text-right">Variação</TableHead>
                <TableHead className="font-semibold text-right">% Total</TableHead>
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
                    {formatCurrency(item.valor2024)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(item.valor2025)}
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${getVariationColor(item.variacao)}`}>
                    {formatVariation(item.variacao)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-primary">
                    {item.percentual.toFixed(1)}%
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
        
        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
          <span>Total de {analyticalData.length} itens analíticos</span>
          <span>
            Total: {formatCurrency(analyticalData.reduce((sum, item) => sum + item.valor2025, 0))}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}