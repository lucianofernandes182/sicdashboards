import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

interface CostItem {
  id: string;
  code?: string;
  name: string;
  cost2024: number;
  cost2025: number;
  variation: number;
  level: number;
  hasChildren: boolean;
  parentId?: string;
}

const hierarchicalCosts: CostItem[] = [
  {
    id: "01",
    code: "01",
    name: "LEGISLATIVA",
    cost2024: 100.00,
    cost2025: 200.00,
    variation: 100.00,
    level: 0,
    hasChildren: false
  },
  {
    id: "04",
    code: "04",
    name: "ADMINISTRAÇÃO",
    cost2024: 200.00,
    cost2025: 126.00,
    variation: -37.00,
    level: 0,
    hasChildren: false
  },
  {
    id: "06",
    code: "06",
    name: "SEGURANÇA PÚBLICA",
    cost2024: 300.00,
    cost2025: 400.00,
    variation: 33.33,
    level: 0,
    hasChildren: false
  },
  {
    id: "08",
    code: "08",
    name: "ASSISTÊNCIA SOCIAL",
    cost2024: 400.00,
    cost2025: 500.00,
    variation: 25.00,
    level: 0,
    hasChildren: false
  },
  {
    id: "10",
    code: "10",
    name: "SAÚDE",
    cost2024: 500.00,
    cost2025: 600.00,
    variation: 20.00,
    level: 0,
    hasChildren: false
  },
  {
    id: "12",
    code: "12",
    name: "EDUCAÇÃO",
    cost2024: 5000.00,
    cost2025: 6600.00,
    variation: 32.00,
    level: 0,
    hasChildren: true
  },
  {
    id: "12-1",
    code: "1.3.3205200.12.0001",
    name: "Escola XXXXXXX",
    cost2024: 5000.00,
    cost2025: 6600.00,
    variation: 32.00,
    level: 1,
    hasChildren: true,
    parentId: "12"
  },
  {
    id: "12-1-1",
    name: "3.3 - Manutenção e Operação de Máquina Pública",
    cost2024: 5000.00,
    cost2025: 6600.00,
    variation: 32.00,
    level: 2,
    hasChildren: true,
    parentId: "12-1"
  },
  {
    id: "12-1-1-1",
    name: "3.3.1 - Uso de Material de Consumo",
    cost2024: 2000.00,
    cost2025: 2350.00,
    variation: 17.50,
    level: 3,
    hasChildren: true,
    parentId: "12-1-1"
  },
  {
    id: "12-1-1-1-1",
    name: "3.3.1.1.1.03 - Gás e Materiais Engarrafados",
    cost2024: 1000.00,
    cost2025: 1150.00,
    variation: 15.00,
    level: 4,
    hasChildren: false,
    parentId: "12-1-1-1"
  },
  {
    id: "12-1-1-1-2",
    name: "3.3.1.1.1.28 - Material de Proteção e Segurança",
    cost2024: 1000.00,
    cost2025: 1200.00,
    variation: 20.00,
    level: 4,
    hasChildren: false,
    parentId: "12-1-1-1"
  },
  {
    id: "12-1-1-2",
    name: "3.3.2 - Serviços",
    cost2024: 3000.00,
    cost2025: 4250.00,
    variation: 41.67,
    level: 3,
    hasChildren: true,
    parentId: "12-1-1"
  },
  {
    id: "12-1-1-2-1",
    name: "3.3.2.3.1.06 - Serviços de Manutenção - PJ",
    cost2024: 1000.00,
    cost2025: 1350.00,
    variation: 35.00,
    level: 4,
    hasChildren: false,
    parentId: "12-1-1-2"
  },
  {
    id: "12-1-1-2-2",
    name: "3.3.2.3.1.39 - Serviços de Controle Ambiental - PJ",
    cost2024: 1000.00,
    cost2025: 1400.00,
    variation: 40.00,
    level: 4,
    hasChildren: false,
    parentId: "12-1-1-2"
  },
  {
    id: "12-1-1-2-3",
    name: "3.3.2.3.1.51 - Serviços Técnicos Profissionais - PJ",
    cost2024: 1000.00,
    cost2025: 1500.00,
    variation: 50.00,
    level: 4,
    hasChildren: false,
    parentId: "12-1-1-2"
  },
  {
    id: "13",
    code: "13",
    name: "CULTURA",
    cost2024: 100.00,
    cost2025: 200.00,
    variation: 100.00,
    level: 0,
    hasChildren: false
  },
  {
    id: "15",
    code: "15",
    name: "URBANISMO",
    cost2024: 200.00,
    cost2025: 100.00,
    variation: -50.00,
    level: 0,
    hasChildren: false
  }
];

export function DetailedCostTable() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getVisibleItems = () => {
    const visibleItems: CostItem[] = [];
    
    for (const item of hierarchicalCosts) {
      if (item.level === 0) {
        visibleItems.push(item);
        if (item.hasChildren && expandedItems.has(item.id)) {
          addChildrenToVisible(item.id, visibleItems);
        }
      }
    }
    
    return visibleItems;
  };

  const addChildrenToVisible = (parentId: string, visibleItems: CostItem[]) => {
    const children = hierarchicalCosts.filter(item => item.parentId === parentId);
    for (const child of children) {
      visibleItems.push(child);
      if (child.hasChildren && expandedItems.has(child.id)) {
        addChildrenToVisible(child.id, visibleItems);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const formatVariation = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getRowClassName = (item: CostItem, index: number) => {
    let className = "hover:bg-muted/50 ";
    
    // Alternate row colors for better readability
    if (index % 2 === 0) {
      className += "bg-muted/20 ";
    }
    
    // Special styling for different levels
    if (item.level === 0) {
      className += "font-semibold ";
    }
    
    return className;
  };

  const visibleItems = getVisibleItems();

  return (
    <Card className="col-span-6 glass neon-border">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
        <CardTitle className="text-lg font-bold">
          FUNÇÃO / EQUIPAMENTO PÚBLICO / ELEMENTO DE CUSTO
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-emerald-600 hover:bg-emerald-600">
              <TableHead className="text-white font-bold border-r border-emerald-500">FUNÇÃO / EQUIPAMENTO PÚBLICO / ELEMENTO DE CUSTO</TableHead>
              <TableHead className="text-white font-bold text-right border-r border-emerald-500">2024</TableHead>
              <TableHead className="text-white font-bold text-right border-r border-emerald-500">2025</TableHead>
              <TableHead className="text-white font-bold text-right">VARIAÇÃO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.map((item, index) => (
              <TableRow key={item.id} className={getRowClassName(item, index)}>
                <TableCell className="border-r border-muted">
                  <div 
                    className="flex items-center"
                    style={{ paddingLeft: `${item.level * 20}px` }}
                  >
                    {item.hasChildren ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 mr-2"
                        onClick={() => toggleExpanded(item.id)}
                      >
                        {expandedItems.has(item.id) ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </Button>
                    ) : (
                      <div className="w-6" />
                    )}
                    <div>
                      {item.code && (
                        <span 
                          className={`font-mono text-sm mr-2 ${
                            item.code.includes('.') ? 'text-red-600 font-medium' : 'font-bold'
                          }`}
                        >
                          {item.code} -
                        </span>
                      )}
                      <span className={item.level === 0 ? 'font-bold' : ''}>{item.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono border-r border-muted">
                  {formatCurrency(item.cost2024)}
                </TableCell>
                <TableCell className="text-right font-mono border-r border-muted">
                  {formatCurrency(item.cost2025)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  <span className={item.variation >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatVariation(item.variation)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}