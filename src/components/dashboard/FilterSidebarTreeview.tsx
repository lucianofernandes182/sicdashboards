import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";

export function FilterSidebarTreeview() {
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
          {/* Informações Resumidas */}
          <div className="space-y-3 pb-4 border-b border-border/20">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Total Selecionado</h4>
              <div className="p-3 rounded-lg bg-gradient-primary/10 border border-primary/20">
                <p className="text-lg font-bold text-primary">R$ 62,5M</p>
                <p className="text-xs text-muted-foreground">6 níveis expandidos</p>
              </div>
            </div>
          </div>

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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fontes Geradoras</label>
              <Select>
                <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <SelectValue placeholder="Selecionar fonte..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50 backdrop-blur-lg z-50">
                  <SelectItem value="recursos-humanos">Recursos Humanos</SelectItem>
                  <SelectItem value="materiais">Materiais</SelectItem>
                  <SelectItem value="contabilidade">Contabilidade</SelectItem>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}