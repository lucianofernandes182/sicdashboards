import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Crown, Scale } from "lucide-react";
import { useMemo } from "react";

const comparativeData2024 = [
  { name: "Executivo", value: 63, color: "#4285F4", icon: Crown },
  { name: "Legislativo", value: 37, color: "#4285F4", icon: Scale },
];

const comparativeData2025 = [
  { name: "Executivo", value: 64, color: "#FFA726", icon: Crown },
  { name: "Legislativo", value: 36, color: "#FFA726", icon: Scale },
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel2024 = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, name, index
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="10"
      fontWeight="600"
      className="drop-shadow-lg"
    >
      {index === 0 ? `${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const renderCustomizedLabel2025 = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, name, index
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="10"
      fontWeight="600"
      className="drop-shadow-lg"
    >
      {index === 0 ? `${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const IconComponent = data.icon;
    return (
      <div className="glass p-4 rounded-lg border border-primary/20 shadow-neon">
        <div className="flex items-center gap-2 mb-2">
          <IconComponent className="h-4 w-4" style={{ color: data.color }} />
          <span className="font-medium text-foreground">{data.name}</span>
        </div>
        <p className="text-sm" style={{ color: data.color }}>
          Percentual: <span className="font-bold">{data.value?.toFixed(1)}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export function PowerDistributionChart() {
  const chartData2024 = useMemo(() => comparativeData2024, []);
  const chartData2025 = useMemo(() => comparativeData2025, []);

  return (
    <Card className="glass neon-border group hover:shadow-neon transition-all duration-500 animate-fade-in-up relative overflow-hidden h-[300px] flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-secondary opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10 flex-shrink-0 pb-2">
        <CardTitle className="text-lg font-bold glow-text flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Scale className="h-4 w-4 text-primary" />
          </div>
          Custo por Poder
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 flex-1 flex flex-col p-2">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* 2024 Inner Ring */}
              <Pie
                data={chartData2024}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel2024}
                outerRadius={50}
                innerRadius={30}
                dataKey="value"
                strokeWidth={2}
                stroke="white"
              >
                {chartData2024.map((entry, index) => (
                  <Cell 
                    key={`cell-2024-${index}`} 
                    fill={entry.color}
                    opacity={0.8}
                    className="hover:opacity-60 transition-opacity duration-300"
                  />
                ))}
              </Pie>
              
              {/* 2025 Outer Ring */}
              <Pie
                data={chartData2025}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel2025}
                outerRadius={75}
                innerRadius={55}
                dataKey="value"
                strokeWidth={2}
                stroke="white"
              >
                {chartData2025.map((entry, index) => (
                  <Cell 
                    key={`cell-2025-${index}`} 
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                ))}
              </Pie>
              
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Removed fixed center labels */}
        </div>
        
        {/* Custom Legend */}
        <div className="flex justify-center gap-4 mt-2 flex-shrink-0">
          <div className="text-center">
            <div className="text-xs font-semibold text-foreground mb-1">Executivo</div>
            <div className="flex items-center gap-1 justify-center">
              <div className="w-2 h-2 bg-[#4285F4] rounded"></div>
              <span className="text-xs text-muted-foreground">2024: 63%</span>
            </div>
            <div className="flex items-center gap-1 justify-center mt-0.5">
              <div className="w-2 h-2 bg-[#FFA726] rounded"></div>
              <span className="text-xs text-muted-foreground">2025: 64%</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold text-foreground mb-1">Legislativo</div>
            <div className="flex items-center gap-1 justify-center">
              <div className="w-2 h-2 bg-[#4285F4] rounded"></div>
              <span className="text-xs text-muted-foreground">2024: 37%</span>
            </div>
            <div className="flex items-center gap-1 justify-center mt-0.5">
              <div className="w-2 h-2 bg-[#FFA726] rounded"></div>
              <span className="text-xs text-muted-foreground">2025: 36%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}