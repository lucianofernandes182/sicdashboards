import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, RefreshCw, Download, GitCompare } from "lucide-react";
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
    <div className="space-y-4">
      <Card className="glass neon-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold glow-text flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filtros
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Filter Fields */}
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Entidade</label>
              <Select>
                <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <SelectValue placeholder="Selecionar entidade..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                  <SelectItem value="prefeitura">Prefeitura Municipal</SelectItem>
                  <SelectItem value="camara">Câmara Municipal</SelectItem>
                  <SelectItem value="autarquia">Autarquias</SelectItem>
                  <SelectItem value="fundacao">Fundações</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Exercício</label>
              <div className="flex gap-2">
                <Select defaultValue="2024">
                  <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm flex-1">
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
                  className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              <Button 
                variant={compareExercises ? "default" : "outline"} 
                size="sm" 
                className={`w-full text-xs ${compareExercises ? 'bg-primary text-primary-foreground' : 'bg-card/50 border-border/50'}`}
                onClick={handleCompareToggle}
              >
                <GitCompare className="h-3 w-3 mr-1" />
                {compareExercises ? 'Comparando Exercícios' : 'Comparar Exercícios'}
              </Button>
              
              {showComparisonExercises && (
                <div className="space-y-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                  <label className="text-xs font-medium text-muted-foreground">Exercícios para Comparar:</label>
                  <div className="grid grid-cols-2 gap-1">
                    {['2023', '2022', '2021', '2020'].map((year) => (
                      <Button
                        key={year}
                        variant={comparisonExercises.includes(year) ? "default" : "outline"}
                        size="sm"
                        className={`text-xs h-7 ${
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
                    <div className="flex flex-wrap gap-1 mt-2">
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mês Inicial</label>
                <Select defaultValue="01">
                  <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <SelectValue placeholder="Jan" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                    <SelectItem value="01">Janeiro</SelectItem>
                    <SelectItem value="02">Fevereiro</SelectItem>
                    <SelectItem value="03">Março</SelectItem>
                    <SelectItem value="04">Abril</SelectItem>
                    <SelectItem value="05">Maio</SelectItem>
                    <SelectItem value="06">Junho</SelectItem>
                    <SelectItem value="07">Julho</SelectItem>
                    <SelectItem value="08">Agosto</SelectItem>
                    <SelectItem value="09">Setembro</SelectItem>
                    <SelectItem value="10">Outubro</SelectItem>
                    <SelectItem value="11">Novembro</SelectItem>
                    <SelectItem value="12">Dezembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mês Final</label>
                <Select defaultValue="12">
                  <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <SelectValue placeholder="Dez" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                    <SelectItem value="01">Janeiro</SelectItem>
                    <SelectItem value="02">Fevereiro</SelectItem>
                    <SelectItem value="03">Março</SelectItem>
                    <SelectItem value="04">Abril</SelectItem>
                    <SelectItem value="05">Maio</SelectItem>
                    <SelectItem value="06">Junho</SelectItem>
                    <SelectItem value="07">Julho</SelectItem>
                    <SelectItem value="08">Agosto</SelectItem>
                    <SelectItem value="09">Setembro</SelectItem>
                    <SelectItem value="10">Outubro</SelectItem>
                    <SelectItem value="11">Novembro</SelectItem>
                    <SelectItem value="12">Dezembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Função</label>
              <Select>
                <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <SelectValue placeholder="Selecionar função..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                  <SelectItem value="01">01 - Legislativa</SelectItem>
                  <SelectItem value="04">04 - Administração</SelectItem>
                  <SelectItem value="06">06 - Segurança Pública</SelectItem>
                  <SelectItem value="08">08 - Assistência Social</SelectItem>
                  <SelectItem value="10">10 - Saúde</SelectItem>
                  <SelectItem value="12">12 - Educação</SelectItem>
                  <SelectItem value="15">15 - Urbanismo</SelectItem>
                  <SelectItem value="26">26 - Transporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Equipamento Público</label>
              <Select>
                <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <SelectValue placeholder="Selecionar equipamento..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                  <SelectItem value="escola">Escolas Municipais</SelectItem>
                  <SelectItem value="ubs">Unidades Básicas de Saúde</SelectItem>
                  <SelectItem value="praca">Praças e Parques</SelectItem>
                  <SelectItem value="cemiterio">Cemitérios</SelectItem>
                  <SelectItem value="mercado">Mercados Municipais</SelectItem>
                  <SelectItem value="terminal">Terminais Rodoviários</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Elemento de Custo</label>
              <Select>
                <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <SelectValue placeholder="Selecionar elemento..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                  <SelectItem value="pessoal">Pessoal e Encargos</SelectItem>
                  <SelectItem value="terceiros">Serviços de Terceiros</SelectItem>
                  <SelectItem value="material">Material de Consumo</SelectItem>
                  <SelectItem value="equipamento">Equipamentos</SelectItem>
                  <SelectItem value="obras">Obras e Instalações</SelectItem>
                  <SelectItem value="outros">Outros Custos</SelectItem>
                  <SelectItem value="tributarios">Tributários</SelectItem>
                  <SelectItem value="previdencia">Previdenciários e Assistenciais</SelectItem>
                  <SelectItem value="manutencao">Manutenção e Operação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Informações Resumidas */}
          <div className="space-y-3 pt-4 border-t border-border/20">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Custo Total Selecionado</h4>
              <div className="p-3 rounded-lg bg-gradient-primary/10 border border-primary/20">
                <p className="text-lg font-bold text-primary">R$ 62,5M</p>
                <p className="text-xs text-muted-foreground">+12.5% vs mês anterior</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Composição por Poder</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between p-2 rounded bg-muted/20">
                  <span className="text-xs text-foreground">Executivo</span>
                  <span className="text-xs font-semibold text-primary">65.5%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/20">
                  <span className="text-xs text-foreground">Legislativo</span>
                  <span className="text-xs font-semibold text-secondary">34.5%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Gastos Não Considerados</h4>
              <div className="p-3 rounded-lg bg-muted/10 border border-border/30">
                <p className="text-sm font-medium text-foreground">R$ 3.2M</p>
                <p className="text-xs text-muted-foreground">Valores fora do escopo atual</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground shadow-neon">
              <Filter className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
            <Button variant="outline" className="w-full bg-card/50 border-border/50">
              <Download className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}