import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Menu } from "lucide-react";
import { FilterSidebar } from "@/components/dashboard/FilterSidebar";
import { FilterSidebarTreeview } from "@/components/dashboard/FilterSidebarTreeview";
import { AnalyticalGrid } from "@/components/dashboard/AnalyticalGrid";
import DetailBreakdownView from "@/components/dashboard/DetailBreakdownView";
import { TreeViewComponent } from "@/components/dashboard/TreeViewComponent";
import MapView from "@/components/dashboard/MapView";
import { CostCompositionTreemap } from "@/components/dashboard/CostCompositionTreemap";
import ProjectionsView from "@/components/dashboard/ProjectionsView";

const Dashboard = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("overview");
  const [selectedTreeNode, setSelectedTreeNode] = useState(null);
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);

  const visionTypes = {
    orcamentaria: {
      title: "Visão Orçamentária",
      description: "Programas orçamentários como base para mensuração de custos",
      color: "bg-blue-500"
    },
    institucional: {
      title: "Visão Institucional", 
      description: "Estrutura organizacional das instituições públicas",
      color: "bg-green-500"
    },
    politicas: {
      title: "Foco nas Políticas Públicas",
      description: "Custos atribuídos aos programas e ações das políticas públicas",
      color: "bg-purple-500"
    }
  };

  const currentVision = visionTypes[type as keyof typeof visionTypes] || visionTypes.orcamentaria;

  const handleTreeNodeSelect = (node: any) => {
    setSelectedTreeNode(node);
  };

  const handleDataSourcesChange = (sources: string[]) => {
    setSelectedDataSources(sources);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">VV</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Apuração de Custos</h1>
                <p className="text-sm text-muted-foreground">Município de Vila Velha - ES</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className={`${currentVision.color} text-white`}>
              {currentVision.title}
            </Badge>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Sistema Online</span>
            </div>
            <Button variant="outline" size="sm">
              Protótipo
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {activeView === "treeview" ? (
          <FilterSidebarTreeview 
            isCollapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            onSourcesChange={handleDataSourcesChange}
          />
        ) : (
          <FilterSidebar isCollapsed={sidebarCollapsed} onViewChange={setActiveView} />
        )}
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Vision Info Banner */}
            <div className="mb-6 p-4 bg-card border rounded-lg">
              <h2 className="text-lg font-semibold text-foreground mb-2">{currentVision.title}</h2>
              <p className="text-sm text-muted-foreground">{currentVision.description}</p>
            </div>

            <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-background/50 backdrop-blur-sm">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="analysis">Análise</TabsTrigger>
                <TabsTrigger value="treeview">Visão Hierárquica</TabsTrigger>
                <TabsTrigger value="detalhamento">Detalhamento</TabsTrigger>
                <TabsTrigger value="projecoes">Projeções</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <AnalyticalGrid />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MapView />
                  <CostCompositionTreemap />
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6">
                <AnalyticalGrid />
              </TabsContent>

              <TabsContent value="treeview" className="space-y-6">
                <TreeViewComponent 
                  onNodeSelect={handleTreeNodeSelect} 
                  selectedSources={selectedDataSources}
                />
                {selectedTreeNode && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Detalhes: {selectedTreeNode.name}
                    </h3>
                    <AnalyticalGrid />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="detalhamento" className="space-y-6">
                <DetailBreakdownView />
              </TabsContent>

              <TabsContent value="projecoes" className="space-y-6">
                <ProjectionsView />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;