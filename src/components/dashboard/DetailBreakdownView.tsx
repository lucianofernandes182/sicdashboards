import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ComposedChart } from 'recharts';

const DetailBreakdownView = () => {
  // Sample data based on the image
  const costData = [
    { month: 'Jan', '2024Accumulated': 5, '2025Accumulated': 8, '2024Monthly': 5, '2025Monthly': 8 },
    { month: 'Fev', '2024Accumulated': 8, '2025Accumulated': 12, '2024Monthly': 3, '2025Monthly': 4 },
    { month: 'Mar', '2024Accumulated': 12, '2025Accumulated': 15, '2024Monthly': 4, '2025Monthly': 3 },
    { month: 'Abr', '2024Accumulated': 18, '2025Accumulated': 22, '2024Monthly': 6, '2025Monthly': 7 },
    { month: 'Mai', '2024Accumulated': 25, '2025Accumulated': 32, '2024Monthly': 7, '2025Monthly': 10 },
    { month: 'Jun', '2024Accumulated': 35, '2025Accumulated': 42, '2024Monthly': 10, '2025Monthly': 10 },
    { month: 'Jul', '2024Accumulated': 45, '2025Accumulated': 58, '2024Monthly': 10, '2025Monthly': 16 },
    { month: 'Ago', '2024Accumulated': 60, '2025Accumulated': 75, '2024Monthly': 15, '2025Monthly': 17 },
    { month: 'Set', '2024Accumulated': 75, '2025Accumulated': 95, '2024Monthly': 15, '2025Monthly': 20 },
    { month: 'Out', '2024Accumulated': 90, '2025Accumulated': 120, '2024Monthly': 15, '2025Monthly': 25 },
    { month: 'Nov', '2024Accumulated': 110, '2025Accumulated': 145, '2024Monthly': 20, '2025Monthly': 25 },
    { month: 'Dez', '2024Accumulated': 130, '2025Accumulated': 180, '2024Monthly': 20, '2025Monthly': 35 },
  ];

  // Data for two-level pie chart
  const yearData = [
    { name: '2024', value: 50, color: '#3B82F6' },
    { name: '2025', value: 50, color: '#F59E0B' },
  ];

  const costUnitsData = [
    { name: 'Pedagogia', value: 30, color: '#4F46E5', year: '2024' },
    { name: 'Administração', value: 20, color: '#F59E0B', year: '2024' },
    { name: 'Biblioteca', value: 15, color: '#8B5CF6', year: '2025' },
    { name: 'Centros Esportivos', value: 12, color: '#10B981', year: '2025' },
    { name: 'Laboratórios', value: 13, color: '#EF4444', year: '2024' },
    { name: 'Alimentação e Nutrição', value: 10, color: '#F97316', year: '2025' },
  ];

  const legendData = [
    { name: 'Pedagogia', color: '#4F46E5' },
    { name: 'Administração', color: '#F59E0B' },
    { name: 'Biblioteca', color: '#8B5CF6' },
    { name: 'Centros Esportivos', color: '#10B981' },
    { name: 'Laboratórios', color: '#EF4444' },
    { name: 'Alimentação e Nutrição', color: '#F97316' },
  ];

  const costElementsData = [
    { name: 'Outros Custos', '2024': 4500, '2025': 7000 },
    { name: 'Tributários', '2024': 4000, '2025': 6000 },
    { name: 'Manutenção e Operação', '2024': 1000, '2025': 2500 },
    { name: 'Previdenciários e Assistenciais', '2024': 2000, '2025': 4000 },
    { name: 'Pessoal e Encargos', '2024': 1000, '2025': 3000 },
  ];

  const otherExpensesData = [
    { name: 'Gastos', '2024': 6.0, '2025': 5.0 },
  ];

  const COLORS = ['#3B82F6', '#F59E0B', '#8B5CF6', '#10B981', '#EF4444', '#F97316'];

  return (
    <div className="space-y-6">
      {/* Top Section: Hierarchy Cards (Left) + Cost Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Hierarchy Cards + KPIs */}
        <div className="space-y-4">
          {/* Hierarchy Cards */}
          <Card className="glass border-border/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Função</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold text-foreground">12 - EDUCAÇÃO</div>
            </CardContent>
          </Card>

          <Card className="glass border-border/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Objeto de Custos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-bold text-foreground">043 - ESCOLA DE ENSINO FUNDAMENTAL</div>
            </CardContent>
          </Card>

          <Card className="glass border-border/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">Equipamento Público</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-bold text-foreground">1.3.3205200.12.0001</div>
              <div className="text-xs text-muted-foreground mt-1">UMEI VEREADOR ARNALDO BORGO</div>
            </CardContent>
          </Card>

          {/* Cost Comparison Card */}
          <Card className="glass border-border/20">
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 p-2 rounded">
                  <div className="text-xs text-muted-foreground">2024 (Anterior)</div>
                  <div className="text-sm font-bold text-foreground">1.500,2 Mi</div>
                </div>
                <div className="bg-primary/10 p-2 rounded">
                  <div className="text-xs text-muted-foreground">2025</div>
                  <div className="text-sm font-bold text-primary">1.500,2 Mi</div>
                </div>
              </div>
              <div className="mt-2 text-center">
                <div className="text-xs text-muted-foreground">Variação</div>
                <div className="flex items-center justify-center gap-1 text-xs text-destructive">
                  <TrendingUp className="h-3 w-3" />
                  + R$ 38,5M | 500,0 (%)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI Cards */}
          <Card className="glass border-border/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground">ALUNOS MATRICULADOS</div>
              <div className="text-2xl font-bold text-primary">1.535</div>
            </CardContent>
          </Card>

          <Card className="glass border-border/20 bg-secondary/5">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground">CUSTO POR ALUNO</div>
              <div className="text-2xl font-bold text-secondary">R$ 2.500,00</div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Monthly and Accumulated Cost Chart */}
        <div className="lg:col-span-2">
          <Card className="glass border-border/20 h-full">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">CUSTO MENSAL E ACUMULADO</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="2024Accumulated" fill="#F59E0B" name="2024 Acumulado" />
                  <Bar dataKey="2025Accumulated" fill="#3B82F6" name="2025 Acumulado" />
                  <Line 
                    type="monotone" 
                    dataKey="2024Monthly" 
                    stroke="#F59E0B" 
                    strokeDasharray="5 5"
                    name="2024 Mensal"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="2025Monthly" 
                    stroke="#3B82F6" 
                    strokeDasharray="5 5"
                    name="2025 Mensal"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Pie Chart (Left) + Bar Charts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Units Pie Chart */}
        <Card className="glass border-border/20">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">UNIDADE DE CUSTOS</CardTitle>
          </CardHeader>
          <CardContent className="flex">
            {/* Legend */}
            <div className="w-28 space-y-1 mr-2">
              {legendData.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
            
            {/* Two-level Pie Chart */}
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  {/* Inner pie - Years */}
                  <Pie
                    data={yearData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    paddingAngle={1}
                    dataKey="value"
                    label={({ name, value }) => `${name}\n${value}%`}
                    labelLine={false}
                  >
                    {yearData.map((entry, index) => (
                      <Cell key={`inner-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  
                  {/* Outer pie - Categories */}
                  <Pie
                    data={costUnitsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={160}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ value }) => `${value}%`}
                    labelLine={false}
                  >
                    {costUnitsData.map((entry, index) => (
                      <Cell key={`outer-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Cost Elements + Other Expenses */}
        <div className="space-y-6">
          {/* Cost Elements */}
          <Card className="glass border-border/20">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">ELEMENTOS DE CUSTOS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {costElementsData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="relative">
                    <div className="flex h-6 rounded overflow-hidden bg-muted/20">
                      <div 
                        className="bg-amber-500 flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${(item['2024'] / (item['2024'] + item['2025'])) * 100}%` }}
                      >
                        {item['2024'].toLocaleString()}
                      </div>
                      <div 
                        className="bg-blue-600 flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${(item['2025'] / (item['2024'] + item['2025'])) * 100}%` }}
                      >
                        {item['2025'].toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-center gap-6 text-xs mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded"></div>
                  <span>2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span>2025</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Expenses */}
          <Card className="glass border-border/20">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Demais Gastos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {otherExpensesData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="relative">
                    <div className="flex h-6 rounded overflow-hidden bg-muted/20">
                      <div 
                        className="bg-amber-500 flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${(item['2024'] / (item['2024'] + item['2025'])) * 100}%` }}
                      >
                        {item['2024']}
                      </div>
                      <div 
                        className="bg-blue-600 flex items-center justify-center text-xs text-white font-medium"
                        style={{ width: `${(item['2025'] / (item['2024'] + item['2025'])) * 100}%` }}
                      >
                        {item['2025']}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-center gap-6 text-xs mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded"></div>
                  <span>2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span>2025</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailBreakdownView;
