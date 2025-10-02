import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import MapView from "./MapView";

// Mock data for monthly and accumulated costs (comparison)
const costComparisonData = [
  { month: "Jan", escolaA: 5, escolaB: 8, escolaC: 4, umei: 3, escolaAAcum: 5, escolaBAcum: 8, escolaCAcum: 4, umeiAcum: 3 },
  { month: "Fev", escolaA: 8, escolaB: 10, escolaC: 6, umei: 5, escolaAAcum: 13, escolaBAcum: 18, escolaCAcum: 10, umeiAcum: 8 },
  { month: "Mar", escolaA: 12, escolaB: 15, escolaC: 8, umei: 7, escolaAAcum: 25, escolaBAcum: 33, escolaCAcum: 18, umeiAcum: 15 },
  { month: "Abr", escolaA: 18, escolaB: 20, escolaC: 12, umei: 10, escolaAAcum: 43, escolaBAcum: 53, escolaCAcum: 30, umeiAcum: 25 },
  { month: "Mai", escolaA: 22, escolaB: 25, escolaC: 15, umei: 12, escolaAAcum: 65, escolaBAcum: 78, escolaCAcum: 45, umeiAcum: 37 },
  { month: "Jun", escolaA: 28, escolaB: 32, escolaC: 20, umei: 15, escolaAAcum: 93, escolaBAcum: 110, escolaCAcum: 65, umeiAcum: 52 },
  { month: "Jul", escolaA: 35, escolaB: 38, escolaC: 25, umei: 18, escolaAAcum: 128, escolaBAcum: 148, escolaCAcum: 90, umeiAcum: 70 },
  { month: "Ago", escolaA: 42, escolaB: 45, escolaC: 30, umei: 22, escolaAAcum: 170, escolaBAcum: 193, escolaCAcum: 120, umeiAcum: 92 },
  { month: "Set", escolaA: 50, escolaB: 52, escolaC: 35, umei: 25, escolaAAcum: 220, escolaBAcum: 245, escolaCAcum: 155, umeiAcum: 117 },
  { month: "Out", escolaA: 58, escolaB: 62, escolaC: 42, umei: 30, escolaAAcum: 278, escolaBAcum: 307, escolaCAcum: 197, umeiAcum: 147 },
  { month: "Nov", escolaA: 68, escolaB: 72, escolaC: 48, umei: 35, escolaAAcum: 346, escolaBAcum: 379, escolaCAcum: 245, umeiAcum: 182 },
  { month: "Dez", escolaA: 75, escolaB: 80, escolaC: 55, umei: 40, escolaAAcum: 421, escolaBAcum: 459, escolaCAcum: 300, umeiAcum: 222 }
];

// Mock data for cost elements radar chart
const costElementsData = [
  { category: "Pessoal e Encargos", value2024: 85, value2025: 90 },
  { category: "Tributárias", value2024: 45, value2025: 50 },
  { category: "Manutenção e Operação", value2024: 70, value2025: 75 },
  { category: "Previdenciários e Assistenciais", value2024: 60, value2025: 65 },
  { category: "Outros Custos", value2024: 40, value2025: 45 },
  { category: "Demais Gastos", value2024: 55, value2025: 60 }
];

const ComparativeView = () => {
  return (
    <div className="space-y-6">
      {/* Top Section: Cards and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Cost Cards */}
        <div className="space-y-4">
          {/* Maior Custo Card */}
          <Card className="glass border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Maior Custo</p>
                  <p className="text-xs text-muted-foreground">1.3.3205200.12.0002</p>
                  <p className="text-base font-bold text-foreground">UMEI Escola B</p>
                </div>
                <div className="flex items-center gap-1 bg-green-500/20 text-green-600 dark:text-green-400 px-3 py-2 rounded-full">
                  <div className="text-3xl font-black">12</div>
                  <div className="text-xs flex flex-col items-center">
                    <span className="font-medium">%</span>
                    <span className="text-xs">variação</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menor Custo Card */}
          <Card className="glass border-border/50">
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Menor Custo</p>
                <p className="text-xs text-muted-foreground">1.3.3205200.12.0001</p>
                <p className="text-base font-bold text-foreground">UMEI VEREADOR ARNALDO BORGO</p>
              </div>
            </CardContent>
          </Card>

          {/* Maior e Menor Custo por Indicador */}
          <Card className="glass border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-green-500/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-full">
                    <div className="text-4xl font-black">36</div>
                    <div className="text-xs flex flex-col items-center">
                      <span className="font-medium">%</span>
                      <span className="text-xs">variação</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Maior Custo por Indicador</p>
                      <p className="text-xs text-muted-foreground">1.3.3205200.12.0003</p>
                      <p className="text-sm font-bold text-foreground">UMEI Escola C</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Menor Custo por Indicador</p>
                      <p className="text-xs text-muted-foreground">1.3.3205200.12.0001</p>
                      <p className="text-sm font-bold text-foreground">UMEI VEREADOR ARNALDO BORGO</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Map and Info */}
        <div className="space-y-4">
          <Card className="glass border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Função</CardTitle>
                  <p className="text-2xl font-black text-primary mt-1">12 - EDUCAÇÃO</p>
                </div>
                <div className="text-right">
                  <CardTitle className="text-base font-bold">Objeto de Custos</CardTitle>
                  <p className="text-sm font-semibold text-foreground mt-1">043 - ESCOLA DE ENSINO FUNDAMENTAL</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-64 relative overflow-hidden rounded-b-lg">
                <MapView />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly and Accumulated Cost Chart (Comparison) */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-bold">CUSTO MENSAL E ACUMULADO (COMPARADO)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={costComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  yAxisId="left"
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  yAxisId="right"
                  orientation="right"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                
                {/* Bars for monthly costs */}
                <Bar yAxisId="left" dataKey="escolaA" fill="#3b82f6" name="Escola A" />
                <Bar yAxisId="left" dataKey="escolaB" fill="#f97316" name="Escola B" />
                <Bar yAxisId="left" dataKey="escolaC" fill="#84cc16" name="Escola C" />
                <Bar yAxisId="left" dataKey="umei" fill="#eab308" name="UMEI VEREADOR ARNALDO BORGO" />
                
                {/* Lines for accumulated costs */}
                <Line yAxisId="right" type="monotone" dataKey="escolaAAcum" stroke="#1e40af" strokeWidth={2} dot={{ r: 3 }} name="Escola A (Acum)" />
                <Line yAxisId="right" type="monotone" dataKey="escolaBAcum" stroke="#c2410c" strokeWidth={2} dot={{ r: 3 }} name="Escola B (Acum)" />
                <Line yAxisId="right" type="monotone" dataKey="escolaCAcum" stroke="#4d7c0f" strokeWidth={2} dot={{ r: 3 }} name="Escola C (Acum)" />
                <Line yAxisId="right" type="monotone" dataKey="umeiAcum" stroke="#a16207" strokeWidth={2} dot={{ r: 3 }} name="UMEI (Acum)" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Elements Radar Chart */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-bold">ELEMENTO DE CUSTOS (COMPARADO)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={costElementsData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="category" 
                  stroke="hsl(var(--foreground))"
                  fontSize={11}
                  tick={{ fill: 'hsl(var(--foreground))' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Radar 
                  name="2024" 
                  dataKey="value2024" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3} 
                />
                <Radar 
                  name="2025" 
                  dataKey="value2025" 
                  stroke="#f97316" 
                  fill="#f97316" 
                  fillOpacity={0.3} 
                />
                <Legend />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparativeView;
