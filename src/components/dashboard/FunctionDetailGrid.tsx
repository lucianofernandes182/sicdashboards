import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface FunctionDetail {
  id: string;
  category: string;
  cost2024: number;
  cost2025: number;
  variation: number;
}

interface FunctionDetailGridProps {
  selectedFunction: string;
  onClose: () => void;
}

const functionDetails: Record<string, FunctionDetail[]> = {
  "Educação": [
    { id: "1", category: "Ensino Fundamental / Escolas / Pessoal", cost2024: 8500000, cost2025: 11200000, variation: 31.76 },
    { id: "2", category: "Ensino Médio / Escolas / Material Escolar", cost2024: 2800000, cost2025: 3600000, variation: 28.57 },
    { id: "3", category: "Educação Infantil / Creches / Alimentação", cost2024: 1900000, cost2025: 2400000, variation: 26.32 },
    { id: "4", category: "Ensino Superior / Universidades / Equipamentos", cost2024: 3200000, cost2025: 4100000, variation: 28.13 },
    { id: "5", category: "Educação Especial / Centros / Manutenção", cost2024: 1600000, cost2025: 2100000, variation: 31.25 },
  ],
  "Saúde": [
    { id: "1", category: "Atenção Básica / UBS / Pessoal", cost2024: 4200000, cost2025: 5500000, variation: 30.95 },
    { id: "2", category: "Média Complexidade / Hospitais / Medicamentos", cost2024: 2800000, cost2025: 3700000, variation: 32.14 },
    { id: "3", category: "Alta Complexidade / Hospitais / Equipamentos", cost2024: 1500000, cost2025: 2000000, variation: 33.33 },
  ],
  "Segurança Pública": [
    { id: "1", category: "Policiamento / Delegacias / Efetivo", cost2024: 3800000, cost2025: 4900000, variation: 28.95 },
    { id: "2", category: "Investigação / Delegacias / Equipamentos", cost2024: 1200000, cost2025: 1600000, variation: 33.33 },
    { id: "3", category: "Prevenção / Comunidade / Projetos", cost2024: 1100000, cost2025: 1400000, variation: 27.27 },
  ],
  "Administração": [
    { id: "1", category: "Gestão / Prefeitura / Pessoal", cost2024: 2500000, cost2025: 3200000, variation: 28.00 },
    { id: "2", category: "Tecnologia / Prefeitura / Sistemas", cost2024: 800000, cost2025: 1100000, variation: 37.50 },
    { id: "3", category: "Comunicação / Prefeitura / Publicidade", cost2024: 900000, cost2025: 1100000, variation: 22.22 },
  ],
  "Previdência": [
    { id: "1", category: "Aposentadorias / RPPS / Benefícios", cost2024: 4500000, cost2025: 5800000, variation: 28.89 },
    { id: "2", category: "Pensões / RPPS / Benefícios", cost2024: 2200000, cost2025: 2900000, variation: 31.82 },
    { id: "3", category: "Administração / RPPS / Gestão", cost2024: 500000, cost2025: 700000, variation: 40.00 },
  ]
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value);
};

const formatVariation = (value: number) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export function FunctionDetailGrid({ selectedFunction, onClose }: FunctionDetailGridProps) {
  const details = functionDetails[selectedFunction] || [];
  
  const total2024 = details.reduce((sum, item) => sum + item.cost2024, 0);
  const total2025 = details.reduce((sum, item) => sum + item.cost2025, 0);
  const totalVariation = total2024 > 0 ? ((total2025 - total2024) / total2024) * 100 : 0;

  return (
    <Card className="col-span-12 mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Detalhes da Função: {selectedFunction}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-card/50 backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-primary/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-primary">
                  <div className="flex items-center gap-2">
                    FUNÇÃO / EQUIPAMENTO PÚBLICO / ELEMENTO DE CUSTO
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-center font-semibold text-primary">
                  <div className="flex items-center justify-center gap-2">
                    2024
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-center font-semibold text-primary">
                  <div className="flex items-center justify-center gap-2">
                    2025
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-center font-semibold text-primary">
                  <div className="flex items-center justify-center gap-2">
                    VARIAÇÃO
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map((detail) => (
                <TableRow key={detail.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{detail.category}</TableCell>
                  <TableCell className="text-center font-mono">
                    {formatCurrency(detail.cost2024)}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {formatCurrency(detail.cost2025)}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    <span className={`font-semibold ${detail.variation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatVariation(detail.variation)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-primary/20 hover:bg-primary/25 font-bold">
                <TableCell className="font-bold text-primary">TOTAIS</TableCell>
                <TableCell className="text-center font-mono font-bold text-primary">
                  {formatCurrency(total2024)}
                </TableCell>
                <TableCell className="text-center font-mono font-bold text-primary">
                  {formatCurrency(total2025)}
                </TableCell>
                <TableCell className="text-center font-mono font-bold">
                  <span className={`${totalVariation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatVariation(totalVariation)}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}