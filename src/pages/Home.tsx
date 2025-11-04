import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, GitBranch, FileText, BarChart3, TrendingUp, ArrowLeftRight, Building2, GitCompare } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const visionOptions = [
    {
      title: "VISÃO ORÇAMENTÁRIA",
      description: "Dentro desse modelo, os programas orçamentários são a base primária para a mensuração dos custos, ou seja, serão os objetos aos quais os custos serão atribuídos.",
      route: "/alternative?type=orcamentaria"
    },
    {
      title: "VISÃO INSTITUCIONAL",
      description: "Tendo como premissa a estrutura organizacional das instituições públicas, tal modelo atribui os custos às unidades/estruturas onde efetivamente os produtos e serviços públicos são gerados",
      route: "/alternative?type=institucional"
    },
    {
      title: "FOCO NAS POLÍTICAS PÚBLICAS",
      description: "O ponto central desse modelo é atribuir os custos aos programas e ações da despesa que compõem as políticas públicas preestabelecidas pelos governos.",
      route: "/alternative?type=politicas"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 animate-pulse" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-card/80 backdrop-blur-md shadow-sm border-b border-border/50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6">
                  <Button 
                    variant="ghost" 
                    className="justify-start gap-3"
                    onClick={() => {
                      navigate("/dashboard/orcamentaria");
                      setMenuOpen(false);
                    }}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start gap-3"
                    onClick={() => {
                      navigate("/dashboard/orcamentaria");
                      setMenuOpen(false);
                    }}
                  >
                    <GitBranch className="h-4 w-4" />
                    Análise de Custos
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start gap-3"
                    onClick={() => {
                      navigate("/dashboard/orcamentaria");
                      setMenuOpen(false);
                    }}
                  >
                    <FileText className="h-4 w-4" />
                    Detalhamento
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start gap-3"
                    onClick={() => {
                      navigate("/dashboard/orcamentaria");
                      setMenuOpen(false);
                    }}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Comparativo
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start gap-3"
                    onClick={() => {
                      navigate("/dashboard/orcamentaria");
                      setMenuOpen(false);
                    }}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Projeções
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start gap-3"
                    onClick={() => {
                      navigate("/de-para");
                      setMenuOpen(false);
                    }}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    De/Para
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start gap-3"
                    onClick={() => {
                      navigate("/equipamentos-publicos");
                      setMenuOpen(false);
                    }}
                  >
                    <Building2 className="h-4 w-4" />
                    Cadastro de Equipamentos Públicos
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start gap-3"
                    onClick={() => {
                      navigate("/comparacao-vpds");
                      setMenuOpen(false);
                    }}
                  >
                    <GitCompare className="h-4 w-4" />
                    Comparação de VPDs
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded overflow-hidden">
                <img 
                  src="/lovable-uploads/4ca62efd-7a75-4137-bade-3a65bb713dab.png" 
                  alt="Vila Velha Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-primary">MUNICÍPIO DE VILA VELHA</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {visionOptions.map((option, index) => (
            <Card 
              key={index}
              className="bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 hover:shadow-neon hover:scale-105"
              onClick={() => navigate(option.route)}
            >
              <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  {option.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {option.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Entidades e Status de Consolidação */}
        <div className="mt-16 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Status de Consolidação de Dados
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Unidades Gestoras */}
            <Card className="bg-card/80 backdrop-blur-sm border-2">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Unidades Gestoras</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Secretaria Municipal de Saúde</span>
                    <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Ago/2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Secretaria Municipal de Educação</span>
                    <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Ago/2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Secretaria Municipal de Obras</span>
                    <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded">Jul/2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Secretaria Municipal de Administração</span>
                    <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Ago/2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sistema de Contabilidade Pública (CP) */}
            <Card className="bg-card/80 backdrop-blur-sm border-2">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Sistema CP</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Receitas</span>
                    <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Atualizado</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Despesas</span>
                    <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Atualizado</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Empenhos</span>
                    <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Atualizado</span>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-xs text-muted-foreground">Última sincronização: Ago/2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sistemas RH e Almoxarifado */}
            <Card className="bg-card/80 backdrop-blur-sm border-2">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Sistemas Integrados</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sistema RH</span>
                    <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Ago/2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Almoxarifado (AM)</span>
                    <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded">Jul/2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Patrimônio</span>
                    <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Ago/2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Compras</span>
                    <span className="text-xs bg-red-500/20 text-red-600 px-2 py-1 rounded">Jun/2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo Geral */}
          <div className="mt-8 text-center">
            <Card className="bg-card/80 backdrop-blur-sm border-2 border-primary/20 inline-block">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Status Geral do SIC</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sistema de Informação de Custos atualizado até Agosto de 2024
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">Atualizado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">Pendente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">Atrasado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;