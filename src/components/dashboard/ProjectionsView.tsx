import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, TrendingDown, Bot, AlertTriangle, Target, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart } from 'recharts';
import { useState } from "react";

const ProjectionsView = () => {
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [projectionPeriod, setProjectionPeriod] = useState("12");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiInsights, setAiInsights] = useState("");

  // Dados históricos e projeções
  const projectionData = [
    { period: '2023 Q1', historical: 4.2, optimistic: null, realistic: null, pessimistic: null },
    { period: '2023 Q2', historical: 4.8, optimistic: null, realistic: null, pessimistic: null },
    { period: '2023 Q3', historical: 5.1, optimistic: null, realistic: null, pessimistic: null },
    { period: '2023 Q4', historical: 5.6, optimistic: null, realistic: null, pessimistic: null },
    { period: '2024 Q1', historical: 6.2, optimistic: null, realistic: null, pessimistic: null },
    { period: '2024 Q2', historical: 6.8, optimistic: null, realistic: null, pessimistic: null },
    { period: '2024 Q3', historical: 7.1, optimistic: null, realistic: null, pessimistic: null },
    { period: '2024 Q4', historical: 7.5, optimistic: null, realistic: null, pessimistic: null },
    { period: '2025 Q1', historical: null, optimistic: 8.2, realistic: 7.8, pessimistic: 7.4 },
    { period: '2025 Q2', historical: null, optimistic: 8.8, realistic: 8.3, pessimistic: 7.7 },
    { period: '2025 Q3', historical: null, optimistic: 9.5, realistic: 8.8, pessimistic: 8.1 },
    { period: '2025 Q4', historical: null, optimistic: 10.2, realistic: 9.4, pessimistic: 8.6 },
    { period: '2026 Q1', historical: null, optimistic: 11.0, realistic: 10.1, pessimistic: 9.2 },
    { period: '2026 Q2', historical: null, optimistic: 11.8, realistic: 10.8, pessimistic: 9.8 },
  ];

  const costCategoryProjections = [
    { category: 'Pessoal', current: 45, projected: 52, variation: 15.6 },
    { category: 'Material', current: 18, projected: 22, variation: 22.2 },
    { category: 'Serviços', current: 25, projected: 28, variation: 12.0 },
    { category: 'Equipamentos', current: 8, projected: 12, variation: 50.0 },
    { category: 'Manutenção', current: 4, projected: 6, variation: 50.0 },
  ];

  const riskFactors = [
    { factor: 'Inflação', impact: 'Alto', probability: 85, description: 'Aumento dos custos operacionais' },
    { factor: 'Demanda Sazonal', impact: 'Médio', probability: 70, description: 'Variação no uso dos equipamentos' },
    { factor: 'Novos Regulamentos', impact: 'Médio', probability: 45, description: 'Mudanças na legislação' },
    { factor: 'Manutenção Preventiva', impact: 'Baixo', probability: 30, description: 'Custos não planejados' },
  ];

  const handleGenerateAIInsights = async () => {
    setIsGeneratingAI(true);
    
    // Simulação de análise com IA
    setTimeout(() => {
      const insights = `Análise IA - ${selectedEquipment || 'Equipamento Selecionado'}:

📊 PROJEÇÃO FINANCEIRA:
• Crescimento esperado: 18.5% nos próximos ${projectionPeriod} meses
• Custo médio mensal projetado: R$ 127.400
• Pico de custos previsto: Q2/2025 (período de manutenção)

⚠️ FATORES DE RISCO:
• Alta probabilidade de aumento inflacionário (85%)
• Necessidade de upgrades tecnológicos em 6 meses
• Pico sazonal de demanda no Q4

🎯 RECOMENDAÇÕES:
• Implementar manutenção preventiva para reduzir custos em 15%
• Renegociar contratos de fornecimento no Q1/2025
• Reservar 12% do orçamento para contingências

🤖 Confiança da análise: 87%`;
      
      setAiInsights(insights);
      setIsGeneratingAI(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Controls Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="glass border-border/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Equipamento/Secretaria</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Selecionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="escola-centro">UMEI Vereador Arnaldo Borgo</SelectItem>
                <SelectItem value="ubs-praia">UBS Praia da Costa</SelectItem>
                <SelectItem value="secretaria-educacao">Secretaria de Educação</SelectItem>
                <SelectItem value="secretaria-saude">Secretaria de Saúde</SelectItem>
                <SelectItem value="centro-esportivo">Centro Esportivo Vila Velha</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="glass border-border/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">Período de Projeção</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={projectionPeriod} onValueChange={setProjectionPeriod}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 meses</SelectItem>
                <SelectItem value="12">12 meses</SelectItem>
                <SelectItem value="24">24 meses</SelectItem>
                <SelectItem value="36">36 meses</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="glass border-border/20">
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground">Cenário Atual</div>
            <div className="text-sm font-bold text-foreground">R$ 96.2K/mês</div>
            <div className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8.5% vs anterior
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/20">
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground">Projeção Realista</div>
            <div className="text-sm font-bold text-primary">R$ 114.1K/mês</div>
            <div className="text-xs text-warning flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +18.6% projetado
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Projections Chart */}
      <Card className="glass border-border/20">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Target className="h-4 w-4" />
            PROJEÇÕES DE CUSTOS - CENÁRIOS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="period" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                label={{ value: 'Custos (M)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              
              {/* Dados históricos */}
              <Line
                type="monotone"
                dataKey="historical"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Histórico"
              />
              
              {/* Cenário otimista */}
              <Line
                type="monotone"
                dataKey="optimistic"
                stroke="#10B981"
                strokeDasharray="5 5"
                strokeWidth={2}
                name="Otimista"
              />
              
              {/* Cenário realista */}
              <Line
                type="monotone"
                dataKey="realistic"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Realista"
              />
              
              {/* Cenário pessimista */}
              <Line
                type="monotone"
                dataKey="pessimistic"
                stroke="#EF4444"
                strokeDasharray="3 3"
                strokeWidth={2}
                name="Pessimista"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Section: Category Projections + AI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Category Projections */}
        <Card className="glass border-border/20">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">PROJEÇÃO POR CATEGORIA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {costCategoryProjections.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">R$ {item.current}K → R$ {item.projected}K</span>
                    <Badge 
                      variant={item.variation > 20 ? "destructive" : item.variation > 10 ? "secondary" : "default"}
                      className="text-xs"
                    >
                      +{item.variation}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                    style={{ width: `${Math.min(item.variation * 2, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Analysis Panel */}
        <Card className="glass border-border/20">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Bot className="h-4 w-4" />
              ANÁLISE INTELIGENTE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={handleGenerateAIInsights}
                disabled={isGeneratingAI || !selectedEquipment}
                className="flex-1 h-8 text-xs bg-gradient-primary"
              >
                {isGeneratingAI ? (
                  <>
                    <Zap className="h-3 w-3 mr-1 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Bot className="h-3 w-3 mr-1" />
                    Gerar Insights
                  </>
                )}
              </Button>
            </div>
            
            {aiInsights && (
              <div className="bg-muted/20 p-3 rounded-lg border border-border/50">
                <Textarea
                  value={aiInsights}
                  readOnly
                  className="min-h-[200px] text-xs bg-transparent border-none resize-none"
                />
              </div>
            )}
            
            {!aiInsights && (
              <div className="text-center text-muted-foreground text-xs py-8">
                <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                Selecione um equipamento e clique em "Gerar Insights" para análise com IA
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis Section */}
      <Card className="glass border-border/20">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            FATORES DE RISCO E OPORTUNIDADES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskFactors.map((risk, index) => (
              <div key={index} className="p-3 bg-muted/10 rounded-lg border border-border/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-medium">{risk.factor}</h4>
                    <p className="text-xs text-muted-foreground">{risk.description}</p>
                  </div>
                  <Badge 
                    variant={risk.impact === 'Alto' ? 'destructive' : risk.impact === 'Médio' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {risk.impact}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Probabilidade:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          risk.probability > 70 ? 'bg-destructive' : 
                          risk.probability > 40 ? 'bg-warning' : 'bg-success'
                        }`}
                        style={{ width: `${risk.probability}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{risk.probability}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectionsView;