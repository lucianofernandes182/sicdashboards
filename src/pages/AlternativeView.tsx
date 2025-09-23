import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CostChart } from "@/components/dashboard/CostChart";
import { PowerDistributionChart } from "@/components/dashboard/PowerDistributionChart";
import { CostElementsTable } from "@/components/dashboard/CostElementsTable";
import { CostCompositionTreemap } from "@/components/dashboard/CostCompositionTreemap";
import { DetailedCostTable } from "@/components/dashboard/DetailedCostTable";
import { FilterSidebar } from "@/components/dashboard/FilterSidebar";
import { FilterSidebarTreeview } from "@/components/dashboard/FilterSidebarTreeview";
import { TreeViewComponent } from "@/components/dashboard/TreeViewComponent";
import { AnalyticalGrid } from "@/components/dashboard/AnalyticalGrid";
import DetailBreakdownView from "@/components/dashboard/DetailBreakdownView";
import ProjectionsView from "@/components/dashboard/ProjectionsView";
import MapView from "@/components/dashboard/MapView";
import { CheckSquare, Scale, AlertTriangle, Activity, Zap, Home, Eye, GitBranch, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

const AlternativeView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const visionType = searchParams.get('type') || 'orcamentaria';
  
  const [selectedTreeNode, setSelectedTreeNode] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeView, setActiveView] = useState("overview");

  const visionTypes = {
    orcamentaria: {
      title: "Visão Orçamentária",
      description: "Dentro desse modelo, os programas orçamentários são a base primária para a mensuração dos custos, ou seja, serão os objetos aos quais os custos serão atribuídos.",
      color: "bg-blue-500"
    },
    institucional: {
      title: "Visão Institucional", 
      description: "Tendo como premissa a estrutura organizacional das instituições públicas, tal modelo atribui os custos às unidades/estruturas onde efetivamente os produtos e serviços públicos são gerados",
      color: "bg-green-500"
    },
    politicas: {
      title: "Foco nas Políticas Públicas",
      description: "O ponto central desse modelo é atribuir os custos aos programas e ações da despesa que compõem as políticas públicas preestabelecidas pelos governos.",
      color: "bg-purple-500"
    }
  };

  const currentVision = visionTypes[visionType as keyof typeof visionTypes] || visionTypes.orcamentaria;

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-xs px-3 py-1.5 h-auto"
          >
            <ArrowLeft className="h-3 w-3" />
            Voltar
          </Button>
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

          {/* Vision Info Banner */}
          <div className="mb-6 p-4 bg-card border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">{currentVision.title}</h2>
                <p className="text-sm text-muted-foreground">{currentVision.description}</p>
              </div>
              <Badge variant="secondary" className={`${currentVision.color} text-white`}>
                {currentVision.title}
              </Badge>
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-80'}`}>
            {/* Filter Sidebar */}
            <FilterSidebar 
              isCollapsed={sidebarCollapsed} 
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              activeView={activeView}
              onViewChange={setActiveView}
            />
            
            {/* Conditional Content Based on Active View */}
            {activeView === "overview" && (
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
                  <CostCompositionTreemap />
                </div>

                {/* Mapa */}
                <div className="w-full">
                  <MapView />
                </div>
              </div>
            )}

            {activeView === "analysis" && (
              <DetailedCostTable />
            )}

            {activeView === "treeview" && (
              <div className="space-y-6">
                {/* TreeView Component */}
                <TreeViewComponent onNodeSelect={setSelectedTreeNode} />
                
                {/* Analytical Grid */}
                <AnalyticalGrid 
                  selectedNodeName={selectedTreeNode?.name || "Secretaria Municipal de Educação"}
                  selectedNodeLevel={selectedTreeNode?.level || 4}
                />
              </div>
            )}

            {activeView === "detalhamento" && (
              <DetailBreakdownView />
            )}

            {activeView === "projecoes" && (
              <ProjectionsView />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativeView;