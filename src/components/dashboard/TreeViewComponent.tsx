import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronDown, Building2, School, Users, FileText, DollarSign, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeNode {
  id: string;
  name: string;
  code?: string;
  value: number;
  level: number;
  children?: TreeNode[];
  icon?: React.ReactNode;
  isEquipment?: boolean;
}

const treeData: TreeNode[] = [
  {
    id: "1",
    name: "ORGÂNICO",
    code: "1",
    value: 52000000,
    level: 1,
    icon: <Building2 className="h-4 w-4" />,
    children: [
      {
        id: "1.2",
        name: "EDUCAÇÃO",
        code: "12",
        value: 52000000,
        level: 2,
        icon: <School className="h-4 w-4" />,
        children: [
          {
            id: "1.2.010",
            name: "SECRETARIA MUNICIPAL",
            code: "010",
            value: 52000000,
            level: 3,
            icon: <Users className="h-4 w-4" />,
            children: [
              {
                id: "1.2.010.001",
                name: "Secretaria Municipal de Educação",
                code: "1.3.3205200.12.0001",
                value: 42000000,
                level: 4,
                icon: <MapPin className="h-4 w-4" />,
                isEquipment: true,
                children: [
                  {
                    id: "1.2.010.001.admin",
                    name: "Administração e Gestão",
                    code: "001",
                    value: 10000000,
                    level: 5,
                    icon: <FileText className="h-4 w-4" />,
                    children: [
                      {
                        id: "1.2.010.001.admin.rh",
                        name: "Recursos Humanos",
                        code: "001.01",
                        value: 10000000,
                        level: 6,
                        icon: <DollarSign className="h-4 w-4" />
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

interface TreeViewComponentProps {
  onNodeSelect?: (node: TreeNode) => void;
}

export function TreeViewComponent({ onNodeSelect }: TreeViewComponentProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleNodeClick = (node: TreeNode) => {
    setSelectedNode(node.id);
    onNodeSelect?.(node);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderNode = (node: TreeNode) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode === node.id;

    return (
      <div key={node.id} className="w-full">
        <div 
          className={cn(
            "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/30",
            isSelected && "bg-primary/10 border border-primary/20",
            node.isEquipment && "bg-blue-500/10 border border-blue-500/20"
          )}
          style={{ paddingLeft: `${(node.level - 1) * 20 + 8}px` }}
          onClick={() => handleNodeClick(node)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.id);
              }}
              className="flex-shrink-0 p-1 hover:bg-muted/50 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          
          {!hasChildren && <div className="w-5" />}
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {node.icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {node.code && (
                  <span className="text-xs font-mono text-muted-foreground bg-muted/20 px-2 py-1 rounded">
                    {node.code}
                  </span>
                )}
                <span className={cn(
                  "text-sm font-medium truncate",
                  node.isEquipment && "text-blue-600 dark:text-blue-400"
                )}>
                  {node.name}
                </span>
              </div>
            </div>
            <div className="text-sm font-semibold text-primary">
              {formatCurrency(node.value)}
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children?.map(renderNode)}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="glass neon-border">
      <CardHeader>
        <CardTitle className="glow-text">Estrutura de Análise de Custos</CardTitle>
        <p className="text-sm text-muted-foreground">
          Visualize a hierarquia de custos organizados em 6 níveis
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {treeData.map(renderNode)}
        </div>
      </CardContent>
    </Card>
  );
}