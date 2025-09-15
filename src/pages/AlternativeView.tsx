import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CostChart } from "@/components/dashboard/CostChart";
import { PowerDistributionChart } from "@/components/dashboard/PowerDistributionChart";
import { CostElementsTable } from "@/components/dashboard/CostElementsTable";
import { CostCompositionTreemap } from "@/components/dashboard/CostCompositionTreemap";
import { FunctionDetailGrid } from "@/components/dashboard/FunctionDetailGrid";
import { DetailedCostTable } from "@/components/dashboard/DetailedCostTable";
import { FilterSidebar } from "@/components/dashboard/FilterSidebar";
import { FilterSidebarTreeview } from "@/components/dashboard/FilterSidebarTreeview";
import { TreeViewComponent } from "@/components/dashboard/TreeViewComponent";
import { AnalyticalGrid } from "@/components/dashboard/AnalyticalGrid";
import MapView from "@/components/dashboard/MapView";
import { CheckSquare, Scale, AlertTriangle, Activity, Zap, Home, Eye, GitBranch } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AlternativeView = () => {
  const navigate = useNavigate();
  const [selectedTreeNode, setSelectedTreeNode] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-10">
        {/* Brasão de Vila Velha - Canto Superior Esquerdo */}
        <div className="absolute top-6 left-6">
          <img 
            src="/lovable-uploads/acff9526-10f0-4e00-a220-2818bfdb205c.png" 
            alt="Brasão de Vila Velha" 
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Header Controls - Canto Superior Direito */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-primary text-primary-foreground rounded-full text-xs font-medium shadow-neon">
            <Zap className="h-3 w-3" />
            Online
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-1 glass border-primary/20 text-xs px-3 py-1.5 h-auto"
          >
            <Eye className="h-3 w-3" />
            Principal
          </Button>
          <ThemeToggle />
        </div>

        <div className="max-w-8xl mx-auto space-y-8">
          {/* Hero Header */}
          <header className="text-center space-y-6 animate-fade-in-up pt-12">
            <div className="relative">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-primary bg-clip-text text-transparent animate-gradient bg-gradient-to-r from-primary via-secondary to-accent">
                Apuração de Custos do Município de Vila Velha
              </h1>
              <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-2xl -z-10" />
            </div>
          </header>

          {/* Navigation Tabs */}
          <Tabs defaultValue="overview" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="glass p-1 grid grid-cols-4 w-full max-w-2xl h-12">
                <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  Análise
                </TabsTrigger>
                <TabsTrigger value="treeview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  <GitBranch className="h-4 w-4 mr-1" />
                  Treeview
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  Relatórios
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-8">
              {/* Filter Sidebar */}
              <FilterSidebar 
                isCollapsed={sidebarCollapsed} 
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
              />
              
              {/* Main Content Area */}
              <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-80'}`}>
                <div className="space-y-8">
                  {/* Charts Row - Custo Mensal/Acumulado, Custo por Poder e Elemento de Custos */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[300px]">
                    <div className="lg:col-span-6">
                      <CostChart />
                    </div>
                    <div className="lg:col-span-3">
                      <PowerDistributionChart />
                    </div>
                    <div className="lg:col-span-3">
                      <CostElementsTable />
                    </div>
                  </div>

                  {/* Composição dos Custos por Função */}
                  <div className="w-full">
                    <CostCompositionTreemap onFunctionSelect={setSelectedFunction} />
                  </div>

                  {/* Detailed Grid for Selected Function */}
                  {selectedFunction && (
                    <FunctionDetailGrid 
                      selectedFunction={selectedFunction}
                      onClose={() => setSelectedFunction(null)}
                    />
                  )}

                  {/* Mapa */}
                  <div className="w-full">
                    <MapView />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-8">
              {/* Filter Sidebar */}
              <FilterSidebar 
                isCollapsed={sidebarCollapsed} 
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
              />
              
              {/* Analysis Content */}
              <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-80'}`}>
                <DetailedCostTable />
              </div>
            </TabsContent>

            <TabsContent value="treeview" className="space-y-8">
              {/* Filter Sidebar - Simplified for Treeview */}
              <FilterSidebarTreeview 
                isCollapsed={sidebarCollapsed} 
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
              />
              
              {/* Treeview Content */}
              <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-80'}`}>
                <div className="space-y-6">
                  {/* TreeView Component */}
                  <TreeViewComponent onNodeSelect={setSelectedTreeNode} />
                  
                  {/* Analytical Grid */}
                  <AnalyticalGrid 
                    selectedNodeName={selectedTreeNode?.name || "Secretaria Municipal de Educação"}
                    selectedNodeLevel={selectedTreeNode?.level || 4}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-8">
              {/* Filter Sidebar */}
              <FilterSidebar 
                isCollapsed={sidebarCollapsed} 
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
              />
              
              {/* Reports Content */}
              <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-80'}`}>
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AlternativeView;