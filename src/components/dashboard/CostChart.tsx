import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useFilters } from "@/contexts/FilterContext";
import { useMemo } from "react";

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-4 rounded-lg border border-primary/20 shadow-neon">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function CostChart() {
  const { filters } = useFilters();

  const chartData = useMemo(() => {
    // Base data for current exercise
    const baseData = [
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

    // If comparing exercises, add comparison data
    if (filters.compareExercises && filters.comparisonExercises.length > 0) {
      return baseData.map((item, index) => {
        const comparisonData: any = { ...item };
        
        filters.comparisonExercises.forEach((year, yearIndex) => {
          // Generate comparison data with some variation
          const variation = (parseInt(year) - 2024) * 0.1;
          comparisonData[`accumulated_${year}`] = Math.max(0, item.accumulated + (item.accumulated * variation) + (Math.sin(index) * 5));
          comparisonData[`monthly_${year}`] = Math.max(0, item.monthly + (item.monthly * variation) + (Math.cos(index) * 3));
        });
        
        return comparisonData;
      });
    }

    return baseData;
  }, [filters.compareExercises, filters.comparisonExercises]);

  const renderLines = () => {
    const lines = [];
    
    // Current exercise lines
    lines.push(
      <Line 
        key="accumulated"
        type="monotone" 
        dataKey="accumulated" 
        stroke="hsl(var(--chart-secondary))" 
        strokeWidth={4}
        dot={{ 
          fill: "hsl(var(--chart-secondary))", 
          strokeWidth: 3, 
          r: 6,
          stroke: "hsl(var(--background))"
        }}
        name={`Acumulado ${filters.exercise}`}
        className="drop-shadow-md"
      />
    );

    lines.push(
      <Line 
        key="budget"
        type="monotone" 
        dataKey="budget" 
        stroke="hsl(var(--chart-tertiary))" 
        strokeWidth={3}
        strokeDasharray="8 8"
        dot={{ 
          fill: "hsl(var(--chart-tertiary))", 
          strokeWidth: 2, 
          r: 4,
          stroke: "hsl(var(--background))"
        }}
        name="Orçamento"
      />
    );

    // Comparison exercise lines
    if (filters.compareExercises && filters.comparisonExercises.length > 0) {
      const colors = ['hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];
      
      filters.comparisonExercises.forEach((year, index) => {
        const color = colors[index % colors.length];
        
        lines.push(
          <Line 
            key={`accumulated_${year}`}
            type="monotone" 
            dataKey={`accumulated_${year}`} 
            stroke={color}
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ 
              fill: color, 
              strokeWidth: 2, 
              r: 4,
              stroke: "hsl(var(--background))"
            }}
            name={`Acumulado ${year}`}
            opacity={0.7}
          />
        );
      });
    }

    return lines;
  };

  const renderBars = () => {
    const bars = [];
    
    // Current exercise bar
    bars.push(
      <Bar 
        key="monthly"
        dataKey="monthly" 
        fill="url(#monthlyGradient)"
        name={`Mensal ${filters.exercise}`}
        radius={[6, 6, 0, 0]}
        className="drop-shadow-sm"
      />
    );

    // Comparison exercise bars (grouped)
    if (filters.compareExercises && filters.comparisonExercises.length > 0) {
      const colors = ['hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];
      
      filters.comparisonExercises.forEach((year, index) => {
        const color = colors[index % colors.length];
        
        bars.push(
          <Bar 
            key={`monthly_${year}`}
            dataKey={`monthly_${year}`} 
            fill={color}
            name={`Mensal ${year}`}
            radius={[6, 6, 0, 0]}
            opacity={0.6}
          />
        );
      });
    }

    return bars;
  };

  return (
    <Card className="col-span-4 glass neon-border group hover:shadow-neon transition-all duration-500 animate-fade-in-up relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-primary opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold glow-text flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Custo Mensal e Acumulado
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Comparativo entre custo realizado e orçamento previsto
            </CardDescription>
          </div>
          <div className="flex items-center text-xs text-success font-medium bg-success/10 px-3 py-1 rounded-full border border-success/20">
            <TrendingUp className="h-3 w-3 mr-1" />
            +12.5%
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pl-2 relative z-10">
        <ResponsiveContainer width="100%" height={380}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="accumulatedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-secondary))" stopOpacity={0.6} />
                <stop offset="100%" stopColor="hsl(var(--chart-secondary))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {renderBars()}
            {renderLines()}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}