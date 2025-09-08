import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  className?: string;
  icon?: React.ReactNode;
  gradient?: string;
}

export function MetricCard({ title, value, change, className, icon, gradient = "bg-gradient-primary" }: MetricCardProps) {
  return (
    <Card className={cn(
      "glass neon-border group hover:shadow-neon transition-all duration-500 animate-fade-in-up relative overflow-hidden",
      className
    )}>
      {/* Gradient overlay */}
      <div className={cn("absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20", gradient)} />
      
      {/* Floating icon */}
      <div className="absolute -top-2 -right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
        {icon || <Sparkles className="h-8 w-8 text-primary animate-float" />}
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
        {change && (
          <div className={cn(
            "flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full",
            change.type === "increase" 
              ? "text-success bg-success/10 border border-success/20" 
              : "text-destructive bg-destructive/10 border border-destructive/20"
          )}>
            {change.type === "increase" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{change.value}%</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold glow-text group-hover:scale-105 transition-transform duration-300">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}