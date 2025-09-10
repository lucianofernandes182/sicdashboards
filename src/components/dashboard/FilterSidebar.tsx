import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, RefreshCw, GitCompare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

// Filtros limpos e funcionais sem contexto
export function FilterSidebar() {
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

  return (
    <div className="h-full flex flex-col">
      <Card className="glass neon-border flex-1 flex flex-col">
        <CardHeader className="pb-2 flex-shrink-0">
          <CardTitle className="text-base font-bold glow-text flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            Filtros
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto space-y-3 px-4 pb-4">
          {/* Informações Resumidas - Compactas */}
          <div className="space-y-2 pb-3 border-b border-border/20">
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-foreground">Custo Total</h4>
              <div className="p-2 rounded bg-gradient-primary/10 border border-primary/20">
                <p className="text-sm font-bold text-primary">R$ 62,5M</p>
                <p className="text-xs text-muted-foreground">+12.5%</p>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-foreground">Por Poder</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-1 rounded bg-muted/20">
                  <span className="text-xs text-foreground">Exec</span>
                  <span className="text-xs font-semibold text-primary">65.5%</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded bg-muted/20">
                  <span className="text-xs text-foreground">Leg</span>
                  <span className="text-xs font-semibold text-secondary">34.5%</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-foreground">Não Considerados</h4>
              <div className="p-2 rounded bg-muted/10 border border-border/30">
                <p className="text-xs font-medium text-foreground">R$ 3.2M</p>
              </div>
            </div>
          </div>

          {/* Filter Fields - Compactos */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Entidade</label>
              <Select>
                <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm h-8">
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

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Exercício</label>
              <div className="flex gap-1">
                <Select defaultValue="2024">
                  <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm flex-1 h-8">
                    <SelectValue placeholder="2024" />
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
                  className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground h-8 w-8 p-0"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              <Button 
                variant={compareExercises ? "default" : "outline"} 
                size="sm" 
                className={`w-full text-xs h-7 ${compareExercises ? 'bg-primary text-primary-foreground' : 'bg-card/50 border-border/50'}`}
                onClick={handleCompareToggle}
              >
                <GitCompare className="h-3 w-3 mr-1" />
                {compareExercises ? 'Comparando' : 'Comparar'}
              </Button>
              
              {showComparisonExercises && (
                <div className="space-y-1 p-2 rounded bg-muted/20 border border-border/50">
                  <label className="text-xs font-medium text-muted-foreground">Comparar:</label>
                  <div className="grid grid-cols-2 gap-1">
                    {['2023', '2022', '2021', '2020'].map((year) => (
                      <Button
                        key={year}
                        variant={comparisonExercises.includes(year) ? "default" : "outline"}
                        size="sm"
                        className={`text-xs h-6 ${
                          comparisonExercises.includes(year) 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-card/50 border-border/50'
                        }`}
                        onClick={() => handleComparisonExerciseToggle(year)}
                      >
                        {year}
                      </Button>
                    ))}
                  </div>
                  {comparisonExercises.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {comparisonExercises.map((year) => (
                        <Badge key={year} variant="secondary" className="text-xs">
                          {year}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Mês Inicial</label>
                <Select defaultValue="01">
                  <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm h-8">
                    <SelectValue placeholder="Jan" />
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

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Mês Final</label>
                <Select defaultValue="12">
                  <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm h-8">
                    <SelectValue placeholder="Dez" />
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

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Função</label>
              <Select>
                <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm h-8">
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

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Equipamento</label>
              <Select>
                <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm h-8">
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

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Elemento</label>
              <Select>
                <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm h-8">
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
          </div>

          {/* Action Button */}
          <div className="pt-2 flex-shrink-0">
            <Button className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground shadow-neon h-8">
              <Filter className="h-3 w-3 mr-1" />
              Aplicar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}