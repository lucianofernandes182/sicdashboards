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
import { useMemo } from "react";

const comparativeData = [
  { 
    month: "Janeiro", 
    monthly2024: 5, monthly2025: 3,
    accumulated2024: 19, accumulated2025: 6
  },
  { 
    month: "Fevereiro", 
    monthly2024: 7, monthly2025: 4,
    accumulated2024: 25, accumulated2025: 12
  },
  { 
    month: "Março", 
    monthly2024: 8, monthly2025: 6,
    accumulated2024: 37, accumulated2025: 15
  },
  { 
    month: "Abril", 
    monthly2024: 15, monthly2025: 8,
    accumulated2024: 44, accumulated2025: 28
  },
  { 
    month: "Maio", 
    monthly2024: 21, monthly2025: 11,
    accumulated2024: 51, accumulated2025: 37
  },
  { 
    month: "Junho", 
    monthly2024: 18, monthly2025: 13,
    accumulated2024: 30, accumulated2025: 50
  },
  { 
    month: "Julho", 
    monthly2024: 25, monthly2025: 15,
    accumulated2024: 47, accumulated2025: 32
  },
  { 
    month: "Agosto", 
    monthly2024: 32, monthly2025: 18,
    accumulated2024: 63, accumulated2025: 50
  },
  { 
    month: "Setembro", 
    monthly2024: 53, monthly2025: 22,
    accumulated2024: 75, accumulated2025: 72
  },
  { 
    month: "Outubro", 
    monthly2024: 62, monthly2025: 25,
    accumulated2024: 79, accumulated2025: 97
  },
  { 
    month: "Novembro", 
    monthly2024: 75, monthly2025: 28,
    accumulated2024: 74, accumulated2025: 125
  },
  { 
    month: "Dezembro", 
    monthly2024: 87, monthly2025: 32,
    accumulated2024: 85, accumulated2025: 157
  },
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
  const chartData = useMemo(() => {
    return comparativeData;
  }, []);

  const renderLines = () => {
    const lines = [];
    
    // 2024 accumulated line (blue)
    lines.push(
      <Line 
        key="accumulated2024"
        yAxisId="right"
        type="monotone" 
        dataKey="accumulated2024" 
        stroke="#4285F4" 
        strokeWidth={3}
        strokeDasharray="8 8"
        dot={{ 
          fill: "#4285F4", 
          strokeWidth: 2, 
          r: 5,
          stroke: "white"
        }}
        name="Acumulado 2024"
        className="drop-shadow-md"
      />
    );

    // 2025 accumulated line (orange)
    lines.push(
      <Line 
        key="accumulated2025"
        yAxisId="right"
        type="monotone" 
        dataKey="accumulated2025" 
        stroke="#FFA726" 
        strokeWidth={3}
        strokeDasharray="8 8"
        dot={{ 
          fill: "#FFA726", 
          strokeWidth: 2, 
          r: 5,
          stroke: "white"
        }}
        name="Acumulado 2025"
        className="drop-shadow-md"
      />
    );

    return lines;
  };

  const renderBars = () => {
    const bars = [];
    
    // 2024 bars (blue)
    bars.push(
      <Bar 
        key="monthly2024"
        yAxisId="left"
        dataKey="monthly2024" 
        fill="#4285F4"
        name="2024"
        radius={[2, 2, 0, 0]}
        className="drop-shadow-sm"
      />
    );

    // 2025 bars (orange)
    bars.push(
      <Bar 
        key="monthly2025"
        yAxisId="left"
        dataKey="monthly2025" 
        fill="#FFA726"
        name="2025"
        radius={[2, 2, 0, 0]}
        className="drop-shadow-sm"
      />
    );

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
          <ComposedChart data={chartData} margin={{ top: 20, right: 60, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            
            <YAxis 
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              domain={[0, 100]}
            />
            
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              domain={[0, 180]}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {renderBars()}
            {renderLines()}
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-[#4285F4] rounded"></div>
            <span className="text-sm text-muted-foreground">Executivo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-[#FFA726] rounded"></div>
            <span className="text-sm text-muted-foreground">Legislativo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}