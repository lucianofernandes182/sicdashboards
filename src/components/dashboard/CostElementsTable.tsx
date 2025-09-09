import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const costElements = [
  { element: "Outros Custos", value2024: 4.5, value2025: 7.0 },
  { element: "Tributários", value2024: 4.0, value2025: 6.0 },
  { element: "Manutenção e Operação", value2024: 1.0, value2025: 2.5 },
  { element: "Previdenciários e Assistenciais", value2024: 2.0, value2025: 4.0 },
  { element: "Pessoal e Encargos", value2024: 1.0, value2025: 3.0 },
];

const otherExpenses = [
  { element: "Gastos", value2024: 6.0, value2025: 5.0 },
];

export function CostElementsTable() {
  const renderBarChart = (item: { element: string; value2024: number; value2025: number }) => {
    const total = item.value2024 + item.value2025;
    const percentage2024 = (item.value2024 / total) * 100;
    const percentage2025 = (item.value2025 / total) * 100;

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">{item.element}</span>
        </div>
        <div className="flex h-8 bg-muted rounded-lg overflow-hidden">
          <div 
            className="bg-yellow-500 flex items-center justify-center text-white text-xs font-semibold"
            style={{ width: `${percentage2024}%` }}
          >
            {item.value2024}
          </div>
          <div 
            className="bg-blue-600 flex items-center justify-center text-white text-xs font-semibold"
            style={{ width: `${percentage2025}%` }}
          >
            {item.value2025}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="col-span-2 glass neon-border h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg font-bold glow-text">Elementos de Custos</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          {costElements.map((item, index) => (
            <div key={index}>
              {renderBarChart(item)}
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-border/20">
          <h3 className="text-md font-semibold text-foreground mb-4">Demais Gastos</h3>
          <div className="space-y-4">
            {otherExpenses.map((item, index) => (
              <div key={index}>
                {renderBarChart(item)}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-4 border-t border-border/20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-xs text-muted-foreground">2024</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span className="text-xs text-muted-foreground">2025</span>
          </div>
        </div>

        {/* Percentage Scale */}
        <div className="flex justify-between text-xs text-muted-foreground pt-2">
          <span>0%</span>
          <span>20%</span>
          <span>40%</span>
          <span>60%</span>
          <span>80%</span>
          <span>100%</span>
        </div>
      </CardContent>
    </Card>
  );
}