import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Building, Target } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CostChart } from "@/components/dashboard/CostChart";
import { PowerDistributionChart } from "@/components/dashboard/PowerDistributionChart";
import { CostElementsTable } from "@/components/dashboard/CostElementsTable";
import { CostCompositionTreemap } from "@/components/dashboard/CostCompositionTreemap";
import { DetailedCostTable } from "@/components/dashboard/DetailedCostTable";

const Index = () => {
  const [activeTab, setActiveTab] = useState("orcamentaria");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Apuração dos Custos do Município
          </h1>
          <p className="text-lg text-muted-foreground">
            Sistema Integrado de Controle de Custos Públicos
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="orcamentaria" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Visão Orçamentária
            </TabsTrigger>
            <TabsTrigger value="institucional" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Visão Institucional
            </TabsTrigger>
            <TabsTrigger value="politicas" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Foco nas Políticas Públicas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orcamentaria" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Custo Total Selecionado" 
                value="R$ 25.000.000,00" 
                change={{ value: 12.5, type: "increase" }}
              />
              <MetricCard 
                title="Executivo" 
                value="R$ 20.000.000" 
                change={{ value: 8.2, type: "increase" }}
              />
              <MetricCard 
                title="Legislativo" 
                value="R$ 5.000.000" 
                change={{ value: 3.1, type: "decrease" }}
              />
              <MetricCard 
                title="Gastos não considerados no Orçamento" 
                value="R$ 1.000.000" 
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
              <CostChart />
              <PowerDistributionChart />
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
              <CostElementsTable />
              <CostCompositionTreemap />
            </div>

            {/* Detailed Table */}
            <div className="grid grid-cols-1 gap-6">
              <DetailedCostTable />
            </div>
          </TabsContent>

          <TabsContent value="institucional" className="space-y-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Visão Institucional</h2>
              <p className="text-muted-foreground">
                Conteúdo da visão institucional será implementado conforme necessidades específicas.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="politicas" className="space-y-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Foco nas Políticas Públicas</h2>
              <p className="text-muted-foreground">
                Análise detalhada das políticas públicas e seus impactos orçamentários.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
