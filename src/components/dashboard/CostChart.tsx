import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", accumulated: 20, monthly: 15, budget: 18 },
  { month: "Fev", accumulated: 35, monthly: 18, budget: 22 },
  { month: "Mar", accumulated: 50, monthly: 12, budget: 25 },
  { month: "Abr", accumulated: 65, monthly: 22, budget: 28 },
  { month: "Mai", accumulated: 80, monthly: 28, budget: 30 },
  { month: "Jun", accumulated: 95, monthly: 25, budget: 32 },
  { month: "Jul", accumulated: 110, monthly: 30, budget: 35 },
  { month: "Ago", accumulated: 125, monthly: 32, budget: 38 },
  { month: "Set", accumulated: 140, monthly: 35, budget: 40 },
  { month: "Out", accumulated: 155, monthly: 38, budget: 42 },
  { month: "Nov", accumulated: 170, monthly: 40, budget: 45 },
  { month: "Dez", accumulated: 185, monthly: 42, budget: 48 },
];

export function CostChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Custo Mensal e Acumulado</CardTitle>
        <CardDescription>
          Comparativo entre custo realizado e orçamento previsto
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs fill-muted-foreground"
            />
            <YAxis className="text-xs fill-muted-foreground" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Bar 
              dataKey="monthly" 
              fill="hsl(var(--chart-primary))" 
              name="Mensal"
              radius={[4, 4, 0, 0]}
            />
            <Line 
              type="monotone" 
              dataKey="accumulated" 
              stroke="hsl(var(--chart-secondary))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--chart-secondary))", strokeWidth: 2, r: 4 }}
              name="Acumulado"
            />
            <Line 
              type="monotone" 
              dataKey="budget" 
              stroke="hsl(var(--chart-tertiary))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "hsl(var(--chart-tertiary))", strokeWidth: 2, r: 3 }}
              name="Orçamento"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}