import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Filter, RefreshCw, X, TreePine, ChevronLeft, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";

interface FilterSidebarTreeviewProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function FilterSidebarTreeview({ isCollapsed = false, onToggle }: FilterSidebarTreeviewProps) {
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
          <TreePine className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Treeview</h2>
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
        <Accordion type="multiple" defaultValue={["filters", "sources"]} className="space-y-2">
          {/* Filtros Básicos */}
          <AccordionItem value="filters" className="border border-border/20 rounded-lg bg-card/30">
            <AccordionTrigger className="px-3 py-2 text-xs font-semibold hover:no-underline">
              Filtros Básicos
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-3">
              <div className="space-y-2">
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
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Fontes Geradoras */}
          <AccordionItem value="sources" className="border border-border/20 rounded-lg bg-card/30">
            <AccordionTrigger className="px-3 py-2 text-xs font-semibold hover:no-underline">
              Fontes Geradoras
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-3">
              <div className="space-y-2">
                <div className="space-y-1">
                  {sources.map((source) => (
                    <div key={source.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={source.id}
                        checked={selectedSources.includes(source.id)}
                        onCheckedChange={() => handleSourceToggle(source.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-3 w-3"
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
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedSources.map((sourceId) => {
                      const source = sources.find(s => s.id === sourceId);
                      return (
                        <Badge 
                          key={sourceId} 
                          variant="secondary" 
                          className="text-xs py-0 flex items-center gap-1"
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
            </AccordionContent>
          </AccordionItem>

          {/* Configurações da Árvore */}
          <AccordionItem value="tree-config" className="border border-border/20 rounded-lg bg-card/30">
            <AccordionTrigger className="px-3 py-2 text-xs font-semibold hover:no-underline">
              Configurações da Árvore
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 space-y-3">
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Expandir até nível</label>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {[
                      { level: 2, name: "Poder" },
                      { level: 3, name: "Órgão" },
                      { level: 4, name: "Unidade" },
                      { level: 5, name: "Todos" }
                    ].map((item) => (
                      <Button
                        key={item.level}
                        variant={item.level === 4 ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-6"
                      >
                        {item.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Ações rápidas</label>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <Button variant="outline" size="sm" className="text-xs h-6">
                      Expandir
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-6">
                      Recolher
                    </Button>
                  </div>
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