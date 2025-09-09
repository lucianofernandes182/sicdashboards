import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Filter, RefreshCw, X } from "lucide-react";
import { useState } from "react";

export function FilterSidebarTreeview() {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const sources = [
    { id: "recursos-humanos", label: "Recursos Humanos" },
    { id: "materiais", label: "Materiais" },
    { id: "contabilidade", label: "Contabilidade" }
  ];

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const removeSource = (sourceId: string) => {
    setSelectedSources(prev => prev.filter(id => id !== sourceId));
  };

  return (
    <div className="space-y-4">
      <Card className="glass neon-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold glow-text flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filtros - Treeview
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Filter Fields - Apenas Exercício e Fontes Geradoras */}
          <div className="space-y-3">
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
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Fontes Geradoras</label>
              
              {/* Checkboxes for multiple selection */}
              <div className="space-y-2">
                {sources.map((source) => (
                  <div key={source.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={source.id}
                      checked={selectedSources.includes(source.id)}
                      onCheckedChange={() => handleSourceToggle(source.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label 
                      htmlFor={source.id} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {source.label}
                    </label>
                  </div>
                ))}
              </div>

              {/* Selected sources badges */}
              {selectedSources.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedSources.map((sourceId) => {
                    const source = sources.find(s => s.id === sourceId);
                    return (
                      <Badge 
                        key={sourceId} 
                        variant="secondary" 
                        className="text-xs flex items-center gap-1"
                      >
                        {source?.label}
                        <button
                          onClick={() => removeSource(sourceId)}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-2 w-2" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-primary-foreground shadow-neon">
              <Filter className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}