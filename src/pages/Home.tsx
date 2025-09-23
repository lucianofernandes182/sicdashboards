import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">VV</span>
              </div>
              <h1 className="text-2xl font-bold text-green-600">MUNICÍPIO DE VILA VELHA</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {visionOptions.map((option, index) => (
            <Card 
              key={index}
              className="bg-muted/30 hover:bg-muted/50 transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 hover:shadow-lg"
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

        {/* Bottom Notice */}
        <div className="mt-16 text-center">
          <p className="text-destructive font-medium text-sm max-w-4xl mx-auto">
            ESTUDAR UMA FORMA DE MOSTRAR AQUI AS ENTIDADES E ATÉ QUE MÊS OS CUSTOS DAS MESMAS ESTÃO CONSOLIDADOS/FECHADOS
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;