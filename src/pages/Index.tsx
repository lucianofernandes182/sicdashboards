import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CostChart } from "@/components/dashboard/CostChart";
import { PowerDistributionChart } from "@/components/dashboard/PowerDistributionChart";
import { CostElementsTable } from "@/components/dashboard/CostElementsTable";
import { CostCompositionTreemap } from "@/components/dashboard/CostCompositionTreemap";
import { DetailedCostTable } from "@/components/dashboard/DetailedCostTable";
import { FilterSidebar } from "@/components/dashboard/FilterSidebar";
import MapView from "@/components/dashboard/MapView";
import { TreeViewComponent } from "@/components/dashboard/TreeViewComponent";
import DetailBreakdownView from "@/components/dashboard/DetailBreakdownView";
import { AnalyticalGrid } from "@/components/dashboard/AnalyticalGrid";
import { Zap, Activity, Eye } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeView, setActiveView] = useState("overview");
  const [selectedTreeNode, setSelectedTreeNode] = useState(null);

  const handleTreeNodeSelect = (node: any) => {
    setSelectedTreeNode(node?.name || null);
  };

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
            onClick={() => navigate('/alternative')}
            className="flex items-center gap-1 glass border-primary/20 text-xs px-3 py-1.5 h-auto"
          >
            <Eye className="h-3 w-3" />
            Protótipo
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
          <Tabs value={activeView} onValueChange={setActiveView} className="space-y-8">

            <TabsContent value="overview" className="space-y-8">
              {/* Filter Sidebar */}
              <FilterSidebar 
                isCollapsed={sidebarCollapsed} 
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                activeView={activeView}
                onViewChange={setActiveView}
              />
              
              {/* Main Content Area */}
              <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-80'}`}>
                <div className="space-y-8">
                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <CostChart />
                    </div>
                    <div className="lg:col-span-1">
                      <PowerDistributionChart />
                    </div>
                    <div className="lg:col-span-1">
                      <CostElementsTable />
                    </div>
                  </div>

                  {/* Map Full Width Row */}
                  <div className="w-full">
                    <MapView />
                  </div>

                  {/* Treemap Row */}
                  <div className="w-full">
                    <CostCompositionTreemap />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-8">
              {/* Filter Sidebar */}
              <FilterSidebar 
                isCollapsed={sidebarCollapsed} 
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                activeView={activeView}
                onViewChange={setActiveView}
              />
              
              {/* Analysis Content */}
              <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-80'}`}>
                <DetailedCostTable />
              </div>
            </TabsContent>

            <TabsContent value="treeview" className="space-y-8">
              {/* Filter Sidebar */}
              <FilterSidebar 
                isCollapsed={sidebarCollapsed} 
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                activeView={activeView}
                onViewChange={setActiveView}
              />
              
              {/* TreeView Content */}
              <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-80'}`}>
                <div className="space-y-8">
                  {/* TreeView and Analytical Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-1">
                      <TreeViewComponent onNodeSelect={handleTreeNodeSelect} />
                    </div>
                    <div className="lg:col-span-1">
                      <AnalyticalGrid selectedNodeName={selectedTreeNode} />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="detalhamento" className="space-y-8">
              {/* Filter Sidebar */}
              <FilterSidebar 
                isCollapsed={sidebarCollapsed} 
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                activeView={activeView}
                onViewChange={setActiveView}
              />
              
              {/* Detalhamento Content */}
              <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-80'}`}>
                <DetailBreakdownView />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
