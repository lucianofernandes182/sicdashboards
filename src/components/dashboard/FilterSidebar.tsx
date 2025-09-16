import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, RefreshCw, GitCompare, ChevronLeft, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";

interface FilterSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  activeView?: string;
  onViewChange?: (view: string) => void;
}

export function FilterSidebar({ isCollapsed = false, onToggle, activeView = "overview", onViewChange }: FilterSidebarProps) {
  const [compareExercises, setCompareExercises] = useState(false);
  const [comparisonExercises, setComparisonExercises] = useState<string[]>([]);
  const [showComparisonExercises, setShowComparisonExercises] = useState(false);

  const handleCompareToggle = () => {
    const newCompareState = !compareExercises;
    setCompareExercises(newCompareState);
    setShowComparisonExercises(newCompareState);
    if (!newCompareState) {
      setComparisonExercises([]);
    }
  };

  const handleComparisonExerciseToggle = (exercise: string) => {
    const currentExercises = comparisonExercises;
    const newExercises = currentExercises.includes(exercise)
      ? currentExercises.filter(e => e !== exercise)
      : [...currentExercises, exercise];
    setComparisonExercises(newExercises);
  };

  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50">
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          className="glass border-primary/20 hover:bg-primary/10 rounded-r-lg rounded-l-none px-2 py-6"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-80 z-40 flex flex-col bg-background/95 backdrop-blur-sm border-r border-border/20">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-3 border-b border-border/20 bg-gradient-primary/5">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Filtros</h2>
        </div>
        <Button
          onClick={onToggle}
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-primary/10"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* View Selection */}
        <div className="space-y-2 mb-4">
          <h3 className="text-xs font-semibold text-muted-foreground px-1">Visualização</h3>
          <div className="grid grid-cols-2 gap-1">
            <Button
              variant={activeView === "overview" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start text-xs h-7 glass border-border/50"
              onClick={() => onViewChange?.("overview")}
            >
              Visão Geral
            </Button>
            <Button
              variant={activeView === "analysis" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start text-xs h-7 glass border-border/50"
              onClick={() => onViewChange?.("analysis")}
            >
              Análise
            </Button>
            <Button
              variant={activeView === "treeview" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start text-xs h-7 glass border-border/50"
              onClick={() => onViewChange?.("treeview")}
            >
              Treeview
            </Button>
            <Button
              variant={activeView === "detalhamento" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start text-xs h-7 glass border-border/50"
              onClick={() => onViewChange?.("detalhamento")}
            >
              Detalhamento
            </Button>
          </div>
        </div>

        <Accordion type="multiple" defaultValue={["summary", "filters"]} className="space-y-2">
          {/* Resumo Section */}
          <AccordionItem value="summary" className="border border-border/20 rounded-lg bg-card/30">
            <AccordionTrigger className="px-3 py-2 text-xs font-semibold hover:no-underline">
              Resumo
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-2">
              <div className="space-y-2">
                <div className="p-2 rounded bg-gradient-primary/10 border border-primary/20">
                  <p className="text-xs font-medium text-muted-foreground">Custo Total</p>
                  <p className="text-sm font-bold text-primary">R$ 62,5M</p>
                  <p className="text-xs text-muted-foreground">+12.5%</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Por Poder</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-2 py-1 rounded bg-muted/20">
                      <span className="text-xs">Executivo</span>
                      <span className="text-xs font-semibold text-primary">65.5%</span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1 rounded bg-muted/20">
                      <span className="text-xs">Legislativo</span>
                      <span className="text-xs font-semibold text-secondary">34.5%</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded bg-muted/10 border border-border/30">
                  <p className="text-xs font-medium text-muted-foreground">Não Considerados</p>
                  <p className="text-xs font-semibold">R$ 3.2M</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Filtros Básicos */}
          <AccordionItem value="filters" className="border border-border/20 rounded-lg bg-card/30">
            <AccordionTrigger className="px-3 py-2 text-xs font-semibold hover:no-underline">
              Filtros Básicos
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-3">
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Entidade</label>
                  <Select>
                    <SelectTrigger className="h-7 text-xs bg-card/50 border-border/50">
                      <SelectValue placeholder="Selecionar..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                      <SelectItem value="prefeitura">Prefeitura</SelectItem>
                      <SelectItem value="camara">Câmara</SelectItem>
                      <SelectItem value="autarquia">Autarquias</SelectItem>
                      <SelectItem value="fundacao">Fundações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Exercício</label>
                  <div className="flex gap-1">
                    <Select defaultValue="2024">
                      <SelectTrigger className="h-7 text-xs bg-card/50 border-border/50 flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 w-7 p-0 bg-card/50 border-border/50"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Button 
                    variant={compareExercises ? "default" : "outline"} 
                    size="sm" 
                    className="w-full text-xs h-6 mt-1"
                    onClick={handleCompareToggle}
                  >
                    <GitCompare className="h-3 w-3 mr-1" />
                    {compareExercises ? 'Comparando' : 'Comparar'}
                  </Button>
                  
                  {showComparisonExercises && (
                    <div className="mt-2 p-2 rounded bg-muted/20 border border-border/50">
                      <label className="text-xs font-medium text-muted-foreground">Comparar:</label>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        {['2023', '2022', '2021', '2020'].map((year) => (
                          <Button
                            key={year}
                            variant={comparisonExercises.includes(year) ? "default" : "outline"}
                            size="sm"
                            className="text-xs h-5"
                            onClick={() => handleComparisonExerciseToggle(year)}
                          >
                            {year}
                          </Button>
                        ))}
                      </div>
                      {comparisonExercises.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {comparisonExercises.map((year) => (
                            <Badge key={year} variant="secondary" className="text-xs py-0">
                              {year}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Mês Inicial</label>
                    <Select defaultValue="01">
                      <SelectTrigger className="h-7 text-xs bg-card/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                        <SelectItem value="01">Jan</SelectItem>
                        <SelectItem value="02">Fev</SelectItem>
                        <SelectItem value="03">Mar</SelectItem>
                        <SelectItem value="04">Abr</SelectItem>
                        <SelectItem value="05">Mai</SelectItem>
                        <SelectItem value="06">Jun</SelectItem>
                        <SelectItem value="07">Jul</SelectItem>
                        <SelectItem value="08">Ago</SelectItem>
                        <SelectItem value="09">Set</SelectItem>
                        <SelectItem value="10">Out</SelectItem>
                        <SelectItem value="11">Nov</SelectItem>
                        <SelectItem value="12">Dez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Mês Final</label>
                    <Select defaultValue="12">
                      <SelectTrigger className="h-7 text-xs bg-card/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                        <SelectItem value="01">Jan</SelectItem>
                        <SelectItem value="02">Fev</SelectItem>
                        <SelectItem value="03">Mar</SelectItem>
                        <SelectItem value="04">Abr</SelectItem>
                        <SelectItem value="05">Mai</SelectItem>
                        <SelectItem value="06">Jun</SelectItem>
                        <SelectItem value="07">Jul</SelectItem>
                        <SelectItem value="08">Ago</SelectItem>
                        <SelectItem value="09">Set</SelectItem>
                        <SelectItem value="10">Out</SelectItem>
                        <SelectItem value="11">Nov</SelectItem>
                        <SelectItem value="12">Dez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Filtros Avançados */}
          <AccordionItem value="advanced" className="border border-border/20 rounded-lg bg-card/30">
            <AccordionTrigger className="px-3 py-2 text-xs font-semibold hover:no-underline">
              Filtros Avançados
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-3">
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Função</label>
                  <Select>
                    <SelectTrigger className="h-7 text-xs bg-card/50 border-border/50">
                      <SelectValue placeholder="Selecionar..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                      <SelectItem value="01">01 - Legislativa</SelectItem>
                      <SelectItem value="04">04 - Administração</SelectItem>
                      <SelectItem value="06">06 - Segurança</SelectItem>
                      <SelectItem value="08">08 - Assistência</SelectItem>
                      <SelectItem value="10">10 - Saúde</SelectItem>
                      <SelectItem value="12">12 - Educação</SelectItem>
                      <SelectItem value="15">15 - Urbanismo</SelectItem>
                      <SelectItem value="26">26 - Transporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Objeto de Custo</label>
                  <Select>
                    <SelectTrigger className="h-7 text-xs bg-card/50 border-border/50">
                      <SelectValue placeholder="Selecionar..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                      <SelectItem value="atividade">Atividade</SelectItem>
                      <SelectItem value="projeto">Projeto</SelectItem>
                      <SelectItem value="operacao">Operação Especial</SelectItem>
                      <SelectItem value="reserva">Reserva de Contingência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Elemento de Custo</label>
                  <Select>
                    <SelectTrigger className="h-7 text-xs bg-card/50 border-border/50">
                      <SelectValue placeholder="Selecionar..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                      <SelectItem value="pessoal">Pessoal</SelectItem>
                      <SelectItem value="terceiros">Terceiros</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="equipamento">Equipamentos</SelectItem>
                      <SelectItem value="obras">Obras</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                      <SelectItem value="tributarios">Tributários</SelectItem>
                      <SelectItem value="previdencia">Previdência</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Equipamento Público</label>
                  <Select>
                    <SelectTrigger className="h-7 text-xs bg-card/50 border-border/50">
                      <SelectValue placeholder="Selecionar..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                      <SelectItem value="escola">Escolas</SelectItem>
                      <SelectItem value="ubs">UBS</SelectItem>
                      <SelectItem value="praca">Praças</SelectItem>
                      <SelectItem value="cemiterio">Cemitérios</SelectItem>
                      <SelectItem value="mercado">Mercados</SelectItem>
                      <SelectItem value="terminal">Terminais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Apply Button - Fixed at bottom */}
      <div className="p-3 border-t border-border/20 bg-gradient-primary/5">
        <Button className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground h-8 text-xs">
          <Filter className="h-3 w-3 mr-1" />
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}