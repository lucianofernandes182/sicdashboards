import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CostChart } from "@/components/dashboard/CostChart";
import { PowerDistributionChart } from "@/components/dashboard/PowerDistributionChart";
import { CostElementsTable } from "@/components/dashboard/CostElementsTable";
import { CostCompositionTreemap } from "@/components/dashboard/CostCompositionTreemap";
import { DetailedCostTable } from "@/components/dashboard/DetailedCostTable";
import { FilterSidebar } from "@/components/dashboard/FilterSidebar";
import { DollarSign, TrendingUp, Target, Calendar, Zap, Activity } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-10">
        <div className="max-w-8xl mx-auto space-y-8">
          {/* Hero Header */}
          <header className="text-center space-y-6 animate-fade-in-up">
            <div className="relative">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-primary bg-clip-text text-transparent animate-gradient bg-gradient-to-r from-primary via-secondary to-accent">
                NEXUS COST
              </h1>
              <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-2xl -z-10" />
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Sistema inteligente de análise e monitoramento de custos governamentais com visualização em tempo real
            </p>
            <div className="flex justify-center">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-primary-foreground rounded-full font-semibold shadow-neon animate-pulse-glow">
                <Zap className="h-4 w-4" />
                Status: Online
              </div>
            </div>
          </header>

          {/* Navigation Tabs */}
          <Tabs defaultValue="overview" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="glass p-1 grid grid-cols-3 w-full max-w-md h-12">
                <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  Análise
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  Relatórios
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-8">
              {/* Main Layout with Filter and Content */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Filter Sidebar - Integrated */}
                <div className="xl:col-span-1">
                  <div className="sticky top-8">
                    <FilterSidebar />
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="xl:col-span-3 space-y-8">
                  {/* Metrics Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                      title="Custo Total"
                      value="R$ 62,5M"
                      change={{ value: 12.5, type: "increase" }}
                      icon={<DollarSign className="h-6 w-6 text-primary" />}
                      gradient="bg-gradient-primary"
                    />
                    <MetricCard
                      title="Orçamento Utilizado"
                      value="78.3%"
                      change={{ value: 5.2, type: "increase" }}
                      icon={<Target className="h-6 w-6 text-secondary" />}
                      gradient="bg-gradient-secondary"
                    />
                    <MetricCard
                      title="Economia Mensal"
                      value="R$ 2.1M"
                      change={{ value: 8.7, type: "decrease" }}
                      icon={<TrendingUp className="h-6 w-6 text-accent" />}
                      gradient="bg-gradient-accent"
                    />
                    <MetricCard
                      title="Projeção Anual"
                      value="R$ 185M"
                      change={{ value: 3.1, type: "increase" }}
                      icon={<Calendar className="h-6 w-6 text-warning" />}
                      gradient="bg-gradient-to-br from-warning to-warning-glow"
                    />
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                    <CostChart />
                    <PowerDistributionChart />
                  </div>

                  {/* Tables Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CostElementsTable />
                    <CostCompositionTreemap />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Filter Sidebar */}
                <div className="xl:col-span-1">
                  <div className="sticky top-8">
                    <FilterSidebar />
                  </div>
                </div>

                {/* Analysis Content */}
                <div className="xl:col-span-3">
                  <DetailedCostTable />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Filter Sidebar */}
                <div className="xl:col-span-1">
                  <div className="sticky top-8">
                    <FilterSidebar />
                  </div>
                </div>

                {/* Reports Content */}
                <div className="xl:col-span-3">
                  <div className="glass p-12 rounded-2xl border border-primary/20 text-center animate-fade-in-up">
                    <div className="max-w-md mx-auto space-y-6">
                      <div className="p-4 rounded-full bg-gradient-primary w-20 h-20 flex items-center justify-center mx-auto animate-pulse-glow">
                        <Activity className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold glow-text">
                        Relatórios Avançados
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Sistema de relatórios inteligentes em desenvolvimento. Em breve você terá acesso a análises preditivas, 
                        exportações personalizadas e insights automatizados.
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/20 rounded-full text-sm border border-border/50">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                        Em desenvolvimento
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
