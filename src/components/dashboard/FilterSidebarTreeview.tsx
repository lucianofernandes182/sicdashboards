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
    <div className="h-full flex flex-col">
      <Card className="glass neon-border flex-1 flex flex-col">
        <CardHeader className="pb-2 flex-shrink-0">
          <CardTitle className="text-base font-bold glow-text flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            Filtros - Treeview
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto space-y-3 px-4 pb-4">
          {/* Filter Fields - Compactos */}
          <div className="space-y-2">
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
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Fontes Geradoras</label>
              
              {/* Checkboxes for multiple selection */}
              <div className="space-y-1">
                {sources.map((source) => (
                  <div key={source.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={source.id}
                      checked={selectedSources.includes(source.id)}
                      onCheckedChange={() => handleSourceToggle(source.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
                    />
                    <label 
                      htmlFor={source.id} 
                      className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {source.label}
                    </label>
                  </div>
                ))}
              </div>

              {/* Selected sources badges */}
              {selectedSources.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
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