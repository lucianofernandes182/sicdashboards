import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Filter } from "lucide-react";
import { useState } from "react";

interface FunctionDetail {
  id: string;
  category: string;
  cost2024: number;
  cost2025: number;
  variation: number;
  level: 'funcao' | 'equipamento' | 'elemento';
  parent?: string;
}

interface FunctionDetailGridProps {
  selectedFunction: string;
  onClose: () => void;
}

const functionDetails: Record<string, FunctionDetail[]> = {
  "Educação": [
    // Nível Função
    { id: "edu-1", category: "Ensino Fundamental", cost2024: 8500000, cost2025: 11200000, variation: 31.76, level: 'funcao' },
    { id: "edu-2", category: "Ensino Médio", cost2024: 2800000, cost2025: 3600000, variation: 28.57, level: 'funcao' },
    { id: "edu-3", category: "Educação Infantil", cost2024: 1900000, cost2025: 2400000, variation: 26.32, level: 'funcao' },
    
    // Nível Equipamento Público
    { id: "edu-4", category: "Escolas Municipais", cost2024: 6200000, cost2025: 8100000, variation: 30.65, level: 'equipamento', parent: 'edu-1' },
    { id: "edu-5", category: "Creches", cost2024: 1900000, cost2025: 2400000, variation: 26.32, level: 'equipamento', parent: 'edu-3' },
    { id: "edu-6", category: "Centros de Educação", cost2024: 2800000, cost2025: 3600000, variation: 28.57, level: 'equipamento', parent: 'edu-2' },
    
    // Nível Elemento de Custo
    { id: "edu-7", category: "Pessoal e Encargos", cost2024: 4500000, cost2025: 5900000, variation: 31.11, level: 'elemento', parent: 'edu-4' },
    { id: "edu-8", category: "Material Escolar", cost2024: 800000, cost2025: 1100000, variation: 37.50, level: 'elemento', parent: 'edu-4' },
    { id: "edu-9", category: "Alimentação Escolar", cost2024: 900000, cost2025: 1100000, variation: 22.22, level: 'elemento', parent: 'edu-4' },
    { id: "edu-10", category: "Manutenção", cost2024: 600000, cost2025: 800000, variation: 33.33, level: 'elemento', parent: 'edu-5' },
  ],
  "Saúde": [
    // Nível Função
    { id: "sau-1", category: "Atenção Básica", cost2024: 4200000, cost2025: 5500000, variation: 30.95, level: 'funcao' },
    { id: "sau-2", category: "Média Complexidade", cost2024: 2800000, cost2025: 3700000, variation: 32.14, level: 'funcao' },
    { id: "sau-3", category: "Alta Complexidade", cost2024: 1500000, cost2025: 2000000, variation: 33.33, level: 'funcao' },
    
    // Nível Equipamento Público
    { id: "sau-4", category: "UBS", cost2024: 4200000, cost2025: 5500000, variation: 30.95, level: 'equipamento', parent: 'sau-1' },
    { id: "sau-5", category: "Hospitais", cost2024: 4300000, cost2025: 5700000, variation: 32.56, level: 'equipamento', parent: 'sau-2' },
    
    // Nível Elemento de Custo
    { id: "sau-6", category: "Pessoal Médico", cost2024: 2500000, cost2025: 3300000, variation: 32.00, level: 'elemento', parent: 'sau-4' },
    { id: "sau-7", category: "Medicamentos", cost2024: 1700000, cost2025: 2200000, variation: 29.41, level: 'elemento', parent: 'sau-4' },
    { id: "sau-8", category: "Equipamentos Médicos", cost2024: 2000000, cost2025: 2600000, variation: 30.00, level: 'elemento', parent: 'sau-5' },
  ],
  "Segurança Pública": [
    // Nível Função
    { id: "seg-1", category: "Policiamento Ostensivo", cost2024: 3800000, cost2025: 4900000, variation: 28.95, level: 'funcao' },
    { id: "seg-2", category: "Investigação Criminal", cost2024: 1200000, cost2025: 1600000, variation: 33.33, level: 'funcao' },
    
    // Nível Equipamento Público
    { id: "seg-3", category: "Delegacias", cost2024: 2500000, cost2025: 3200000, variation: 28.00, level: 'equipamento', parent: 'seg-1' },
    { id: "seg-4", category: "Batalhões", cost2024: 2500000, cost2025: 3300000, variation: 32.00, level: 'equipamento', parent: 'seg-1' },
    
    // Nível Elemento de Custo
    { id: "seg-5", category: "Efetivo Policial", cost2024: 2000000, cost2025: 2600000, variation: 30.00, level: 'elemento', parent: 'seg-3' },
    { id: "seg-6", category: "Equipamentos de Segurança", cost2024: 500000, cost2025: 600000, variation: 20.00, level: 'elemento', parent: 'seg-3' },
  ],
  "Administração": [
    // Nível Função
    { id: "adm-1", category: "Gestão Administrativa", cost2024: 2500000, cost2025: 3200000, variation: 28.00, level: 'funcao' },
    { id: "adm-2", category: "Tecnologia da Informação", cost2024: 800000, cost2025: 1100000, variation: 37.50, level: 'funcao' },
    
    // Nível Equipamento Público
    { id: "adm-3", category: "Prefeitura", cost2024: 3300000, cost2025: 4300000, variation: 30.30, level: 'equipamento', parent: 'adm-1' },
    
    // Nível Elemento de Custo
    { id: "adm-4", category: "Pessoal Administrativo", cost2024: 2000000, cost2025: 2600000, variation: 30.00, level: 'elemento', parent: 'adm-3' },
    { id: "adm-5", category: "Material de Expediente", cost2024: 300000, cost2025: 400000, variation: 33.33, level: 'elemento', parent: 'adm-3' },
    { id: "adm-6", category: "Sistemas de Informação", cost2024: 800000, cost2025: 1100000, variation: 37.50, level: 'elemento', parent: 'adm-3' },
  ],
  "Previdência": [
    // Nível Função
    { id: "prev-1", category: "Aposentadorias", cost2024: 4500000, cost2025: 5800000, variation: 28.89, level: 'funcao' },
    { id: "prev-2", category: "Pensões", cost2024: 2200000, cost2025: 2900000, variation: 31.82, level: 'funcao' },
    
    // Nível Equipamento Público
    { id: "prev-3", category: "RPPS", cost2024: 6700000, cost2025: 8700000, variation: 29.85, level: 'equipamento', parent: 'prev-1' },
    
    // Nível Elemento de Custo
    { id: "prev-4", category: "Benefícios Previdenciários", cost2024: 6200000, cost2025: 8100000, variation: 30.65, level: 'elemento', parent: 'prev-3' },
    { id: "prev-5", category: "Administração Previdenciária", cost2024: 500000, cost2025: 600000, variation: 20.00, level: 'elemento', parent: 'prev-3' },
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
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['funcao', 'equipamento', 'elemento']);
  const allDetails = functionDetails[selectedFunction] || [];
  
  const details = allDetails.filter(item => selectedLevels.includes(item.level));
  
  const total2024 = details.reduce((sum, item) => sum + item.cost2024, 0);
  const total2025 = details.reduce((sum, item) => sum + item.cost2025, 0);
  const totalVariation = total2024 > 0 ? ((total2025 - total2024) / total2024) * 100 : 0;

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const getLevelBadge = (level: string) => {
    const configs = {
      'funcao': { label: 'Função', color: 'bg-blue-500' },
      'equipamento': { label: 'Equipamento', color: 'bg-green-500' },
      'elemento': { label: 'Elemento', color: 'bg-orange-500' }
    };
    return configs[level as keyof typeof configs];
  };

  return (
    <div className="mt-4">
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
        
        {/* Level Filters */}
        <div className="flex items-center gap-2 mt-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Níveis:</span>
          {['funcao', 'equipamento', 'elemento'].map(level => {
            const config = getLevelBadge(level);
            return (
              <Badge
                key={level}
                variant={selectedLevels.includes(level) ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedLevels.includes(level) 
                    ? `${config.color} text-white hover:opacity-80` 
                    : 'hover:bg-muted'
                }`}
                onClick={() => toggleLevel(level)}
              >
                {config.label}
              </Badge>
            );
          })}
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
              {details.map((detail) => {
                const levelConfig = getLevelBadge(detail.level);
                return (
                  <TableRow key={detail.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`${levelConfig.color} text-white text-xs`}
                        >
                          {levelConfig.label}
                        </Badge>
                        <span className={detail.level !== 'funcao' ? 'ml-4' : ''}>
                          {detail.category}
                        </span>
                      </div>
                    </TableCell>
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
                );
              })}
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
    </div>
  );
}