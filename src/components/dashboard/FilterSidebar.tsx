import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, RefreshCw, Download, GitCompare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useFilters } from "@/contexts/FilterContext";
import { useState } from "react";

export function FilterSidebar() {
  const { filters, updateFilter } = useFilters();
  const [showComparisonExercises, setShowComparisonExercises] = useState(false);

  const handleCompareToggle = () => {
    const newCompareState = !filters.compareExercises;
    updateFilter('compareExercises', newCompareState);
    setShowComparisonExercises(newCompareState);
    if (!newCompareState) {
      updateFilter('comparisonExercises', []);
    }
  };

  const handleComparisonExerciseToggle = (exercise: string) => {
    const currentExercises = filters.comparisonExercises;
    const newExercises = currentExercises.includes(exercise)
      ? currentExercises.filter(e => e !== exercise)
      : [...currentExercises, exercise];
    updateFilter('comparisonExercises', newExercises);
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
              <Select value={filters.entity} onValueChange={(value) => updateFilter('entity', value)}>
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
                <Select value={filters.exercise} onValueChange={(value) => updateFilter('exercise', value)}>
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
                variant={filters.compareExercises ? "default" : "outline"} 
                size="sm" 
                className={`w-full text-xs ${filters.compareExercises ? 'bg-primary text-primary-foreground' : 'bg-card/50 border-border/50'}`}
                onClick={handleCompareToggle}
              >
                <GitCompare className="h-3 w-3 mr-1" />
                {filters.compareExercises ? 'Comparando Exercícios' : 'Comparar Exercícios'}
              </Button>
              
              {showComparisonExercises && (
                <div className="space-y-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                  <label className="text-xs font-medium text-muted-foreground">Exercícios para Comparar:</label>
                  <div className="grid grid-cols-2 gap-1">
                    {['2023', '2022', '2021', '2020'].map((year) => (
                      <Button
                        key={year}
                        variant={filters.comparisonExercises.includes(year) ? "default" : "outline"}
                        size="sm"
                        className={`text-xs h-7 ${
                          filters.comparisonExercises.includes(year) 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-card/50 border-border/50'
                        }`}
                        onClick={() => handleComparisonExerciseToggle(year)}
                      >
                        {year}
                      </Button>
                    ))}
                  </div>
                  {filters.comparisonExercises.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {filters.comparisonExercises.map((year) => (
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
                <Select value={filters.startMonth} onValueChange={(value) => updateFilter('startMonth', value)}>
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
                <Select value={filters.endMonth} onValueChange={(value) => updateFilter('endMonth', value)}>
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
              <Select value={filters.function} onValueChange={(value) => updateFilter('function', value)}>
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
              <Select value={filters.publicEquipment} onValueChange={(value) => updateFilter('publicEquipment', value)}>
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
              <Select value={filters.costElement} onValueChange={(value) => updateFilter('costElement', value)}>
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