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

const detailedCosts = [
  { 
    code: "01", 
    function: "LEGISLATIVA", 
    cost2024: "R$ 100.000", 
    cost2025: "R$ 200.000", 
    variation: "+100.00%",
    trend: "increase"
  },
  { 
    code: "04", 
    function: "ADMINISTRAÇÃO", 
    cost2024: "R$ 200.000", 
    cost2025: "R$ 126.000", 
    variation: "-37.00%",
    trend: "decrease"
  },
  { 
    code: "06", 
    function: "SEGURANÇA PÚBLICA", 
    cost2024: "R$ 300.000", 
    cost2025: "R$ 400.000", 
    variation: "+33.33%",
    trend: "increase"
  },
  { 
    code: "08", 
    function: "ASSISTÊNCIA SOCIAL", 
    cost2024: "R$ 400.000", 
    cost2025: "R$ 500.000", 
    variation: "+25.00%",
    trend: "increase"
  },
  { 
    code: "10", 
    function: "SAÚDE", 
    cost2024: "R$ 500.000", 
    cost2025: "R$ 600.000", 
    variation: "+20.00%",
    trend: "increase"
  },
  { 
    code: "12", 
    function: "EDUCAÇÃO", 
    cost2024: "R$ 5.000.000", 
    cost2025: "R$ 6.600.000", 
    variation: "+32.00%",
    trend: "increase"
  },
];

export function DetailedCostTable() {
  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle>Função / Equipamento Público / Elemento de Custo - Detalhamento</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Função</TableHead>
              <TableHead className="text-right">2024</TableHead>
              <TableHead className="text-right">2025</TableHead>
              <TableHead className="text-right">Variação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detailedCosts.map((item, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="font-mono font-medium">{item.code}</TableCell>
                <TableCell className="font-medium">{item.function}</TableCell>
                <TableCell className="text-right font-mono">{item.cost2024}</TableCell>
                <TableCell className="text-right font-mono">{item.cost2025}</TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant="outline" 
                    className={
                      item.trend === "increase" 
                        ? "border-accent text-accent" 
                        : "border-destructive text-destructive"
                    }
                  >
                    {item.variation}
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