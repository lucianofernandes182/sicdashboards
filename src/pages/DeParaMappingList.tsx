import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DeParaConfiguration {
  id: string;
  sistema: string;
  schema: string;
  version: string;
  rulesCount: number;
  createdAt: string;
}

const DeParaMappingList = () => {
  const navigate = useNavigate();
  
  // Mock data - apenas configurações com regras
  const [configurations, setConfigurations] = useState<DeParaConfiguration[]>([
    {
      id: "1",
      sistema: "Sistema A",
      schema: "Schema Vendas",
      version: "v1.0",
      rulesCount: 5,
      createdAt: "2025-10-20"
    },
    {
      id: "2",
      sistema: "Sistema B",
      schema: "Schema Clientes",
      version: "v2.1",
      rulesCount: 3,
      createdAt: "2025-10-22"
    }
  ]);

  const handleNewConfiguration = () => {
    navigate("/de-para/new");
  };

  const handleEditConfiguration = (id: string) => {
    navigate(`/de-para/${id}`);
  };

  const handleDeleteConfiguration = (id: string) => {
    setConfigurations(prev => prev.filter(config => config.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mapeamento De/Para</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie as configurações de mapeamento entre sistemas
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={handleNewConfiguration} className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Configuração
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {configurations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                Nenhuma configuração com regras encontrada
              </p>
              <Button onClick={handleNewConfiguration} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar primeira configuração
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {configurations.map((config) => (
              <Card key={config.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span>{config.sistema}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditConfiguration(config.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteConfiguration(config.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Criado em {new Date(config.createdAt).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Schema:</span>
                      <span className="text-sm font-medium">{config.schema}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Versão:</span>
                      <span className="text-sm font-medium">{config.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Regras:</span>
                      <span className="text-sm font-medium">{config.rulesCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DeParaMappingList;
