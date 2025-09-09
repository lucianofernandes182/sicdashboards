import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Crown, Scale } from "lucide-react";
import { useFilters } from "@/contexts/FilterContext";
import { useMemo } from "react";

const data = [
  { name: "Executivo", value: 65.5, color: "hsl(var(--chart-primary))", icon: Crown },
  { name: "Legislativo", value: 34.5, color: "hsl(var(--chart-secondary))", icon: Scale },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, name
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="14"
      fontWeight="700"
      className="drop-shadow-lg"
    >
      {`${(percent * 100).toFixed(1)}%`}
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
        {data.comparisonData && data.comparisonData.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/20">
            <p className="text-xs text-muted-foreground mb-1">Comparação:</p>
            {data.comparisonData.map((comp: any, index: number) => (
              <p key={index} className="text-xs" style={{ color: data.color }}>
                {comp.year}: <span className="font-semibold">{comp.value.toFixed(1)}%</span>
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function PowerDistributionChart() {
  const { filters } = useFilters();

  const chartData = useMemo(() => {
    const baseData = [
      { name: "Executivo", value: 65.5, color: "hsl(var(--chart-primary))", icon: Crown },
      { name: "Legislativo", value: 34.5, color: "hsl(var(--chart-secondary))", icon: Scale },
    ];

    // If comparing exercises, show comparison data
    if (filters.compareExercises && filters.comparisonExercises.length > 0) {
      // For comparison, we could show multiple pie charts or modify the tooltip
      // For now, we'll adjust the values slightly based on selected comparison years
      const variation = filters.comparisonExercises.length * 0.5;
      return baseData.map(item => ({
        ...item,
        value: item.value + (Math.random() - 0.5) * variation,
        comparisonData: filters.comparisonExercises.map(year => ({
          year,
          value: item.value + (parseInt(year) - 2024) * 0.8 + (Math.random() - 0.5) * 2
        }))
      }));
    }

    return baseData;
  }, [filters.compareExercises, filters.comparisonExercises]);

  return (
    <Card className="glass neon-border group hover:shadow-neon transition-all duration-500 animate-fade-in-up relative overflow-hidden h-full flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-secondary opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10 flex-shrink-0">
        <CardTitle className="text-lg font-bold glow-text flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Scale className="h-4 w-4 text-primary" />
          </div>
          Custo por Poder
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Distribuição percentual dos custos entre poderes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10 flex-1 flex flex-col">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={250}>
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
              
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                innerRadius={50}
                dataKey="value"
                strokeWidth={3}
                stroke="hsl(var(--background))"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    filter="url(#glow)"
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                ))}
              </Pie>
              
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Custom Legend */}
        <div className="flex justify-center gap-4 mt-4 flex-shrink-0">
          {chartData.map((entry, index) => {
            const IconComponent = entry.icon;
            return (
              <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/20 border border-border/50">
                <IconComponent className="h-4 w-4" style={{ color: entry.color }} />
                <span className="text-sm font-medium text-foreground">{entry.name}</span>
                <span className="text-xs text-muted-foreground">({entry.value.toFixed(1)}%)</span>
              </div>
            );
          })}
        </div>
        
        {filters.compareExercises && filters.comparisonExercises.length > 0 && (
          <div className="mt-3 p-2 rounded-lg bg-muted/10 border border-border/30">
            <p className="text-xs text-muted-foreground text-center">
              Comparando com: {filters.comparisonExercises.join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}