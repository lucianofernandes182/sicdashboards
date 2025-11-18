import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ComposedChart } from 'recharts';
import { useState } from 'react';

const DetailBreakdownView = () => {
  const [selectedCostUnit, setSelectedCostUnit] = useState<string | null>(null);
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

  // Data for two-ring donut chart
  // Inner ring: Cost Units (shades of gray)
  const costUnitsInner = [
    { name: 'Administração E Gestão', value: 5200, color: '#4B5563' },
    { name: 'Almoxarifado', value: 3800, color: '#6B7280' },
    { name: 'Arquivo', value: 2900, color: '#9CA3AF' },
    { name: 'Base De Vigilância', value: 2400, color: '#D1D5DB' },
    { name: 'Auditórios E Similares', value: 2600, color: '#E5E7EB' },
  ];

  // Outer ring: Year breakdown per Cost Unit (2023, 2024, 2025, 2026 for each unit)
  const costUnitsOuter = [
    // Administração E Gestão
    { name: 'Administração E Gestão', value: 2000, year: '2023', color: '#DC2626', parentColor: '#4B5563' },
    { name: 'Administração E Gestão', value: 2500, year: '2024', color: '#F59E0B', parentColor: '#4B5563' },
    { name: 'Administração E Gestão', value: 2700, year: '2025', color: '#3B82F6', parentColor: '#4B5563' },
    { name: 'Administração E Gestão', value: 2900, year: '2026', color: '#10B981', parentColor: '#4B5563' },
    // Almoxarifado
    { name: 'Almoxarifado', value: 1500, year: '2023', color: '#DC2626', parentColor: '#6B7280' },
    { name: 'Almoxarifado', value: 1800, year: '2024', color: '#F59E0B', parentColor: '#6B7280' },
    { name: 'Almoxarifado', value: 2000, year: '2025', color: '#3B82F6', parentColor: '#6B7280' },
    { name: 'Almoxarifado', value: 2200, year: '2026', color: '#10B981', parentColor: '#6B7280' },
    // Arquivo
    { name: 'Arquivo', value: 1200, year: '2023', color: '#DC2626', parentColor: '#9CA3AF' },
    { name: 'Arquivo', value: 1400, year: '2024', color: '#F59E0B', parentColor: '#9CA3AF' },
    { name: 'Arquivo', value: 1500, year: '2025', color: '#3B82F6', parentColor: '#9CA3AF' },
    { name: 'Arquivo', value: 1700, year: '2026', color: '#10B981', parentColor: '#9CA3AF' },
    // Base De Vigilância
    { name: 'Base De Vigilância', value: 900, year: '2023', color: '#DC2626', parentColor: '#D1D5DB' },
    { name: 'Base De Vigilância', value: 1100, year: '2024', color: '#F59E0B', parentColor: '#D1D5DB' },
    { name: 'Base De Vigilância', value: 1300, year: '2025', color: '#3B82F6', parentColor: '#D1D5DB' },
    { name: 'Base De Vigilância', value: 1500, year: '2026', color: '#10B981', parentColor: '#D1D5DB' },
    // Auditórios E Similares
    { name: 'Auditórios E Similares', value: 1000, year: '2023', color: '#DC2626', parentColor: '#E5E7EB' },
    { name: 'Auditórios E Similares', value: 1200, year: '2024', color: '#F59E0B', parentColor: '#E5E7EB' },
    { name: 'Auditórios E Similares', value: 1400, year: '2025', color: '#3B82F6', parentColor: '#E5E7EB' },
    { name: 'Auditórios E Similares', value: 1600, year: '2026', color: '#10B981', parentColor: '#E5E7EB' },
  ];

  // Filter data based on selection
  const filteredInnerData = selectedCostUnit 
    ? costUnitsInner.filter(item => item.name === selectedCostUnit)
    : costUnitsInner;
  
  const filteredOuterData = selectedCostUnit
    ? costUnitsOuter.filter(item => item.name === selectedCostUnit)
    : costUnitsOuter;

  const legendData = [
    { name: 'Administração E Gestão', color: '#5EAAA8' },
    { name: 'Almoxarifado', color: '#A78BA8' },
    { name: 'Arquivo', color: '#8B7AA8' },
    { name: 'Base De Vigilância', color: '#6B9AA1' },
    { name: 'Auditórios E Similares', color: '#7BA9C5' },
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

  const costCenterData = [
    { name: "Salas de Aula", value2024: 100, value2025: 150 },
    { name: "Sala dos Professores", value2024: 200, value2025: 250 },
    { name: "Sala Sec.", value2024: 100, value2025: 160 },
    { name: "Administração", value2024: 400, value2025: 450 },
    { name: "Almoxarifado", value2024: 950, value2025: 950 },
    { name: "Sanitários", value2024: 550, value2025: 500 },
    { name: "Acervo Bibliográfico", value2024: 670, value2025: 750 },
    { name: "Sala de Leitura", value2024: 850, value2025: 900 },
    { name: "Quadra", value2024: 400, value2025: 500 },
    { name: "Vestiários", value2024: 1000, value2025: 1000 },
    { name: "Piscina", value2024: 800, value2025: 900 },
    { name: "Lab. Informática", value2024: 1200, value2025: 1300 },
    { name: "Lab. Ciências", value2024: 900, value2025: 950 },
    { name: "Lab. Química", value2024: 550, value2025: 500 },
    { name: "Auditório", value2024: 670, value2025: 750 },
    { name: "Restaurante", value2024: 800, value2025: 850 },
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
                  {/* Barras para valores acumulados */}
                  <Bar dataKey="2024Accumulated" fill="#F59E0B" name="2024 Acumulado" />
                  <Bar dataKey="2025Accumulated" fill="#3B82F6" name="2025 Acumulado" />
                  {/* Linhas para valores mensais */}
                  <Line 
                    type="monotone" 
                    dataKey="2024Monthly" 
                    stroke="#DC2626" 
                    name="2024 Mensal"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#DC2626" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="2025Monthly" 
                    stroke="#059669" 
                    name="2025 Mensal"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#059669" }}
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
            {/* Interactive Legend */}
            <div className="w-32 space-y-2 mr-2">
              {costUnitsInner.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 p-1 rounded transition-colors"
                  onClick={() => setSelectedCostUnit(selectedCostUnit === item.name ? null : item.name)}
                >
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span 
                    className={`text-xs ${selectedCostUnit === item.name ? 'font-bold text-foreground' : 'text-muted-foreground'}`}
                  >
                    {item.name.length > 20 ? item.name.substring(0, 18) + '...' : item.name}
                  </span>
                </div>
              ))}
              {selectedCostUnit && (
                <button
                  onClick={() => setSelectedCostUnit(null)}
                  className="text-xs text-primary hover:underline w-full text-left pl-5"
                >
                  Limpar filtro
                </button>
              )}
            </div>
            
            {/* Two-ring Donut Chart */}
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  {/* Inner ring - Cost Units */}
                  <Pie
                    data={filteredInnerData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, name }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      
                      // Abbreviate long names
                      const shortName = name.length > 15 ? name.substring(0, 12) + '...' : name;
                      
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill="white" 
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="9"
                          fontWeight="600"
                          className="drop-shadow-lg"
                        >
                          {shortName}
                        </text>
                      );
                    }}
                    labelLine={false}
                    strokeWidth={2}
                    stroke="white"
                  >
                    {costUnitsInner.map((entry, index) => (
                      <Cell key={`inner-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  
                  {/* Outer ring - Years per Cost Unit */}
                  <Pie
                    data={filteredOuterData}
                    cx="50%"
                    cy="50%"
                    innerRadius={115}
                    outerRadius={160}
                    paddingAngle={1}
                    dataKey="value"
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, year }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill="white" 
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="11"
                          fontWeight="700"
                          className="drop-shadow-lg"
                        >
                          {year}
                        </text>
                      );
                    }}
                    labelLine={false}
                    strokeWidth={2}
                    stroke="white"
                  >
                    {costUnitsOuter.map((entry, index) => (
                      <Cell key={`outer-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value: any, name: any, props: any) => {
                      const year = props.payload.year;
                      const unitName = props.payload.name;
                      return [
                        `R$ ${value.toLocaleString('pt-BR')}`,
                        year ? `${unitName} - ${year}` : unitName
                      ];
                    }}
                  />
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

      {/* Centro de Custos Section */}
      <div className="w-full">
        <Card className="glass border-border/20">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-center">CENTRO DE CUSTOS</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={costCenterData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [value, name === 'value2024' ? '2024' : '2025']}
                />
                <Bar 
                  dataKey="value2024" 
                  fill="#F59E0B" 
                  name="2024"
                  label={{ position: 'top', fontSize: 10 }}
                />
                <Bar 
                  dataKey="value2025" 
                  fill="#3B82F6" 
                  name="2025"
                  label={{ position: 'top', fontSize: 10 }}
                />
              </BarChart>
            </ResponsiveContainer>
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
  );
};

export default DetailBreakdownView;
