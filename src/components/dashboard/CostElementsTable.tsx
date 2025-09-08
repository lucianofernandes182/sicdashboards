import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const costElements = [
  { element: "Outros Custos", percentage: 4.5, amount: "R$ 2.8M", trend: "up" },
  { element: "Tributários", percentage: 4.0, amount: "R$ 2.5M", trend: "down" },
  { element: "Manutenção e Operação", percentage: 1.0, amount: "R$ 625K", trend: "up" },
  { element: "Previdenciários e Assistenciais", percentage: 2.0, amount: "R$ 1.2M", trend: "stable" },
  { element: "Pessoal e Encargos", percentage: 1.0, amount: "R$ 625K", trend: "up" },
];

const getTrendColor = (trend: string) => {
  switch (trend) {
    case "up": return "bg-accent text-accent-foreground";
    case "down": return "bg-destructive text-destructive-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getTrendText = (trend: string) => {
  switch (trend) {
    case "up": return "↗️ Alta";
    case "down": return "↘️ Baixa";
    default: return "→ Estável";
  }
};

export function CostElementsTable() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Elementos de Custos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Elemento</TableHead>
              <TableHead className="text-right">%</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Tendência</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {costElements.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.element}</TableCell>
                <TableCell className="text-right">{item.percentage}%</TableCell>
                <TableCell className="text-right font-mono">{item.amount}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className={getTrendColor(item.trend)}>
                    {getTrendText(item.trend)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}