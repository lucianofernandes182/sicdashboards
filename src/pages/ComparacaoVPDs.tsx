import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronRight, TrendingUp, TrendingDown, Minus, CircleAlert, ShieldCheck, FileWarning, Info, Eye, Building2, School, Users, FileText, DollarSign, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface VPDDetail {
  codigo: string;
  descricao: string;
  valorCP: number;
  valorSIC: number;
}

interface VPDSubGroup {
  codigo: string;
  descricao: string;
  totalCP: number;
  totalSIC: number;
  vpds: VPDDetail[];
}

interface VPDGroup {
  codigoPrincipal: string;
  descricao: string;
  totalCP: number;
  totalSIC: number;
  subgrupos: VPDSubGroup[];
}

interface VPDRecord {
  id: string;
  mes: string;
  ano: string;
  status: "aprovado" | "pendente";
  modeloOrganico: {
    totalVPDs: number;
    totalSIC: number;
    gruposVPD: VPDGroup[];
  };
  modeloProgramatico: {
    totalVPDs: number;
    totalSIC: number;
    gruposVPD: VPDGroup[];
  };
}

// Mock data baseado na estrutura da imagem de referência
const mockRecords: VPDRecord[] = [
  {
    id: "1",
    mes: "05",
    ano: "2025",
    status: "pendente",
    modeloOrganico: {
      totalVPDs: 70475120.53,
      totalSIC: 70475120.53,
      gruposVPD: [
        {
          codigoPrincipal: "3.1.0.0.00.00.00",
          descricao: "PESSOAL E ENCARGOS",
          totalCP: 45450503.59,
          totalSIC: 45450503.59,
          subgrupos: [
            {
              codigo: "3.1.1.0.00.00.00",
              descricao: "REMUNERAÇÃO A PESSOAL",
              totalCP: 35205989.39,
              totalSIC: 35205989.39,
              vpds: [
                { codigo: "3.1.1.1.00.00.00", descricao: "Vencimentos e Salários", valorCP: 25000000.00, valorSIC: 25000000.00 },
                { codigo: "3.1.1.2.00.00.00", descricao: "Gratificações", valorCP: 8000000.00, valorSIC: 7950000.00 },
                { codigo: "3.1.1.3.00.00.00", descricao: "Adicionais", valorCP: 2205989.39, valorSIC: 2255989.39 }
              ]
            },
            {
              codigo: "3.1.2.0.00.00.00",
              descricao: "ENCARGOS PATRONAIS",
              totalCP: 5240514.20,
              totalSIC: 5240514.20,
              vpds: [
                { codigo: "3.1.2.1.00.00.00", descricao: "INSS Patronal", valorCP: 3500000.00, valorSIC: 3500000.00 },
                { codigo: "3.1.2.2.00.00.00", descricao: "FGTS", valorCP: 1740514.20, valorSIC: 1740514.20 }
              ]
            },
            {
              codigo: "3.1.3.0.00.00.00",
              descricao: "BENEFÍCIOS A PESSOAL",
              totalCP: 2500000.00,
              totalSIC: 2500000.00,
              vpds: [
                { codigo: "3.1.3.1.00.00.00", descricao: "Vale Alimentação", valorCP: 1500000.00, valorSIC: 1500000.00 },
                { codigo: "3.1.3.2.00.00.00", descricao: "Vale Transporte", valorCP: 1000000.00, valorSIC: 1000000.00 }
              ]
            },
            {
              codigo: "3.1.8.0.00.00.00",
              descricao: "CUSTO DE PESSOAL E ENCARGOS",
              totalCP: 2504000.00,
              totalSIC: 2504000.00,
              vpds: [
                { codigo: "3.1.8.1.00.00.00", descricao: "Outros Custos de Pessoal", valorCP: 2504000.00, valorSIC: 2504000.00 }
              ]
            }
          ]
        },
        {
          codigoPrincipal: "3.2.0.0.00.00.00",
          descricao: "BENEFÍCIOS PREVIDENCIÁRIOS E ASSISTENCIAIS",
          totalCP: 2800000.00,
          totalSIC: 2800000.00,
          subgrupos: [
            {
              codigo: "3.2.1.0.00.00.00",
              descricao: "APOSENTADORIAS E REFORMAS",
              totalCP: 1500000.00,
              totalSIC: 1500000.00,
              vpds: [
                { codigo: "3.2.1.1.00.00.00", descricao: "Aposentadorias", valorCP: 1200000.00, valorSIC: 1200000.00 },
                { codigo: "3.2.1.2.00.00.00", descricao: "Reformas", valorCP: 300000.00, valorSIC: 300000.00 }
              ]
            },
            {
              codigo: "3.2.2.0.00.00.00",
              descricao: "PENSÕES",
              totalCP: 800000.00,
              totalSIC: 800000.00,
              vpds: [
                { codigo: "3.2.2.1.00.00.00", descricao: "Pensões por Morte", valorCP: 800000.00, valorSIC: 800000.00 }
              ]
            },
            {
              codigo: "3.2.3.0.00.00.00",
              descricao: "BENEFÍCIOS DE PRESTAÇÃO CONTINUADA",
              totalCP: 300000.00,
              totalSIC: 300000.00,
              vpds: [
                { codigo: "3.2.3.1.00.00.00", descricao: "BPC Idoso", valorCP: 200000.00, valorSIC: 200000.00 },
                { codigo: "3.2.3.2.00.00.00", descricao: "BPC Deficiente", valorCP: 100000.00, valorSIC: 100000.00 }
              ]
            },
            {
              codigo: "3.2.5.0.00.00.00",
              descricao: "POLÍTICAS PÚBLICAS DE TRANSFERÊNCIA DE RENDA",
              totalCP: 200000.00,
              totalSIC: 200000.00,
              vpds: [
                { codigo: "3.2.5.1.00.00.00", descricao: "Bolsa Família", valorCP: 200000.00, valorSIC: 200000.00 }
              ]
            }
          ]
        },
        {
          codigoPrincipal: "3.3.0.0.00.00.00",
          descricao: "MANUTENÇÃO E OPERAÇÃO DA MÁQUINA PÚBLICA",
          totalCP: 18124617.94,
          totalSIC: 18174617.94,
          subgrupos: [
            {
              codigo: "3.3.1.0.00.00.00",
              descricao: "USO DE MATERIAL DE CONSUMO",
              totalCP: 2500000.00,
              totalSIC: 2500000.00,
              vpds: [
                { codigo: "3.3.1.1.00.00.00", descricao: "Material de Escritório", valorCP: 500000.00, valorSIC: 500000.00 },
                { codigo: "3.3.1.2.00.00.00", descricao: "Material de Limpeza", valorCP: 800000.00, valorSIC: 800000.00 },
                { codigo: "3.3.1.3.00.00.00", descricao: "Material de Informática", valorCP: 1200000.00, valorSIC: 1200000.00 }
              ]
            },
            {
              codigo: "3.3.2.0.00.00.00",
              descricao: "SERVIÇOS",
              totalCP: 8000000.00,
              totalSIC: 8050000.00,
              vpds: [
                { codigo: "3.3.2.1.00.00.00", descricao: "Serviços de Terceiros - PJ", valorCP: 5000000.00, valorSIC: 5000000.00 },
                { codigo: "3.3.2.2.00.00.00", descricao: "Serviços de Terceiros - PF", valorCP: 2000000.00, valorSIC: 2050000.00 },
                { codigo: "3.3.2.3.00.00.00", descricao: "Serviços de Utilidade Pública", valorCP: 1000000.00, valorSIC: 1000000.00 }
              ]
            },
            {
              codigo: "3.3.3.0.00.00.00",
              descricao: "DEPRECIAÇÃO, AMORTIZAÇÃO E EXAUSTÃO",
              totalCP: 3124617.94,
              totalSIC: 3124617.94,
              vpds: [
                { codigo: "3.3.3.1.00.00.00", descricao: "Depreciação de Bens Móveis", valorCP: 2000000.00, valorSIC: 2000000.00 },
                { codigo: "3.3.3.2.00.00.00", descricao: "Depreciação de Bens Imóveis", valorCP: 1124617.94, valorSIC: 1124617.94 }
              ]
            },
            {
              codigo: "3.3.8.0.00.00.00",
              descricao: "CUSTO DE MATERIAIS, SERVIÇOS E CONSUMO DE CAPITAL FIXO",
              totalCP: 4500000.00,
              totalSIC: 4500000.00,
              vpds: [
                { codigo: "3.3.8.1.00.00.00", descricao: "Outros Custos Operacionais", valorCP: 4500000.00, valorSIC: 4500000.00 }
              ]
            }
          ]
        },
        {
          codigoPrincipal: "3.7.0.0.00.00.00",
          descricao: "TRIBUTÁRIAS",
          totalCP: 1800000.00,
          totalSIC: 1800000.00,
          subgrupos: [
            {
              codigo: "3.7.1.0.00.00.00",
              descricao: "IMPOSTOS, TAXAS E CONTRIBUIÇÕES DE MELHORIA",
              totalCP: 1000000.00,
              totalSIC: 1000000.00,
              vpds: [
                { codigo: "3.7.1.1.00.00.00", descricao: "IPTU", valorCP: 600000.00, valorSIC: 600000.00 },
                { codigo: "3.7.1.2.00.00.00", descricao: "Outras Taxas", valorCP: 400000.00, valorSIC: 400000.00 }
              ]
            },
            {
              codigo: "3.7.2.0.00.00.00",
              descricao: "CONTRIBUIÇÕES",
              totalCP: 500000.00,
              totalSIC: 500000.00,
              vpds: [
                { codigo: "3.7.2.1.00.00.00", descricao: "Contribuições Sociais", valorCP: 500000.00, valorSIC: 500000.00 }
              ]
            },
            {
              codigo: "3.7.8.0.00.00.00",
              descricao: "CUSTO COM TRIBUTOS",
              totalCP: 300000.00,
              totalSIC: 300000.00,
              vpds: [
                { codigo: "3.7.8.1.00.00.00", descricao: "Outros Custos Tributários", valorCP: 300000.00, valorSIC: 300000.00 }
              ]
            }
          ]
        },
        {
          codigoPrincipal: "3.9.0.0.00.00.00",
          descricao: "OUTRAS VARIAÇÕES PATRIMONIAIS DIMINUTIVAS",
          totalCP: 2300000.00,
          totalSIC: 2300000.00,
          subgrupos: [
            {
              codigo: "3.9.1.0.00.00.00",
              descricao: "PREMIAÇÕES",
              totalCP: 400000.00,
              totalSIC: 400000.00,
              vpds: [
                { codigo: "3.9.1.1.00.00.00", descricao: "Prêmios Diversos", valorCP: 400000.00, valorSIC: 400000.00 }
              ]
            },
            {
              codigo: "3.9.4.0.00.00.00",
              descricao: "INCENTIVOS",
              totalCP: 600000.00,
              totalSIC: 600000.00,
              vpds: [
                { codigo: "3.9.4.1.00.00.00", descricao: "Incentivos Fiscais", valorCP: 600000.00, valorSIC: 600000.00 }
              ]
            },
            {
              codigo: "3.9.7.0.00.00.00",
              descricao: "VPD DE CONSTITUIÇÃO DE PROVISÕES",
              totalCP: 800000.00,
              totalSIC: 800000.00,
              vpds: [
                { codigo: "3.9.7.1.00.00.00", descricao: "Provisões Diversas", valorCP: 800000.00, valorSIC: 800000.00 }
              ]
            },
            {
              codigo: "3.9.8.0.00.00.00",
              descricao: "CUSTO DE OUTRAS VPD",
              totalCP: 500000.00,
              totalSIC: 500000.00,
              vpds: [
                { codigo: "3.9.8.1.00.00.00", descricao: "Outros Custos", valorCP: 500000.00, valorSIC: 500000.00 }
              ]
            }
          ]
        }
      ]
    },
    modeloProgramatico: {
      totalVPDs: 70475120.53,
      totalSIC: 70475120.53,
      gruposVPD: [
        {
          codigoPrincipal: "3.1.0.0.00.00.00",
          descricao: "PESSOAL E ENCARGOS",
          totalCP: 45450503.59,
          totalSIC: 45450503.59,
          subgrupos: [
            {
              codigo: "3.1.1.0.00.00.00",
              descricao: "REMUNERAÇÃO A PESSOAL",
              totalCP: 35205989.39,
              totalSIC: 35205989.39,
              vpds: [
                { codigo: "3.1.1.1.00.00.00", descricao: "Vencimentos e Salários", valorCP: 25000000.00, valorSIC: 25000000.00 },
                { codigo: "3.1.1.2.00.00.00", descricao: "Gratificações", valorCP: 8000000.00, valorSIC: 8000000.00 },
                { codigo: "3.1.1.3.00.00.00", descricao: "Adicionais", valorCP: 2205989.39, valorSIC: 2205989.39 }
              ]
            },
            {
              codigo: "3.1.2.0.00.00.00",
              descricao: "ENCARGOS PATRONAIS",
              totalCP: 5240514.20,
              totalSIC: 5240514.20,
              vpds: [
                { codigo: "3.1.2.1.00.00.00", descricao: "INSS Patronal", valorCP: 3500000.00, valorSIC: 3500000.00 },
                { codigo: "3.1.2.2.00.00.00", descricao: "FGTS", valorCP: 1740514.20, valorSIC: 1740514.20 }
              ]
            },
            {
              codigo: "3.1.3.0.00.00.00",
              descricao: "BENEFÍCIOS A PESSOAL",
              totalCP: 2500000.00,
              totalSIC: 2500000.00,
              vpds: [
                { codigo: "3.1.3.1.00.00.00", descricao: "Vale Alimentação", valorCP: 1500000.00, valorSIC: 1500000.00 },
                { codigo: "3.1.3.2.00.00.00", descricao: "Vale Transporte", valorCP: 1000000.00, valorSIC: 1000000.00 }
              ]
            },
            {
              codigo: "3.1.8.0.00.00.00",
              descricao: "CUSTO DE PESSOAL E ENCARGOS",
              totalCP: 2504000.00,
              totalSIC: 2504000.00,
              vpds: [
                { codigo: "3.1.8.1.00.00.00", descricao: "Outros Custos de Pessoal", valorCP: 2504000.00, valorSIC: 2504000.00 }
              ]
            }
          ]
        },
        {
          codigoPrincipal: "3.2.0.0.00.00.00",
          descricao: "BENEFÍCIOS PREVIDENCIÁRIOS E ASSISTENCIAIS",
          totalCP: 2800000.00,
          totalSIC: 2800000.00,
          subgrupos: [
            {
              codigo: "3.2.1.0.00.00.00",
              descricao: "APOSENTADORIAS E REFORMAS",
              totalCP: 1500000.00,
              totalSIC: 1500000.00,
              vpds: [
                { codigo: "3.2.1.1.00.00.00", descricao: "Aposentadorias", valorCP: 1200000.00, valorSIC: 1200000.00 },
                { codigo: "3.2.1.2.00.00.00", descricao: "Reformas", valorCP: 300000.00, valorSIC: 300000.00 }
              ]
            },
            {
              codigo: "3.2.2.0.00.00.00",
              descricao: "PENSÕES",
              totalCP: 800000.00,
              totalSIC: 800000.00,
              vpds: [
                { codigo: "3.2.2.1.00.00.00", descricao: "Pensões por Morte", valorCP: 800000.00, valorSIC: 800000.00 }
              ]
            },
            {
              codigo: "3.2.3.0.00.00.00",
              descricao: "BENEFÍCIOS DE PRESTAÇÃO CONTINUADA",
              totalCP: 300000.00,
              totalSIC: 300000.00,
              vpds: [
                { codigo: "3.2.3.1.00.00.00", descricao: "BPC Idoso", valorCP: 200000.00, valorSIC: 200000.00 },
                { codigo: "3.2.3.2.00.00.00", descricao: "BPC Deficiente", valorCP: 100000.00, valorSIC: 100000.00 }
              ]
            },
            {
              codigo: "3.2.5.0.00.00.00",
              descricao: "POLÍTICAS PÚBLICAS DE TRANSFERÊNCIA DE RENDA",
              totalCP: 200000.00,
              totalSIC: 200000.00,
              vpds: [
                { codigo: "3.2.5.1.00.00.00", descricao: "Bolsa Família", valorCP: 200000.00, valorSIC: 200000.00 }
              ]
            }
          ]
        },
        {
          codigoPrincipal: "3.3.0.0.00.00.00",
          descricao: "MANUTENÇÃO E OPERAÇÃO DA MÁQUINA PÚBLICA",
          totalCP: 18124617.94,
          totalSIC: 18124617.94,
          subgrupos: [
            {
              codigo: "3.3.1.0.00.00.00",
              descricao: "USO DE MATERIAL DE CONSUMO",
              totalCP: 2500000.00,
              totalSIC: 2500000.00,
              vpds: [
                { codigo: "3.3.1.1.00.00.00", descricao: "Material de Escritório", valorCP: 500000.00, valorSIC: 500000.00 },
                { codigo: "3.3.1.2.00.00.00", descricao: "Material de Limpeza", valorCP: 800000.00, valorSIC: 800000.00 },
                { codigo: "3.3.1.3.00.00.00", descricao: "Material de Informática", valorCP: 1200000.00, valorSIC: 1200000.00 }
              ]
            },
            {
              codigo: "3.3.2.0.00.00.00",
              descricao: "SERVIÇOS",
              totalCP: 8000000.00,
              totalSIC: 8000000.00,
              vpds: [
                { codigo: "3.3.2.1.00.00.00", descricao: "Serviços de Terceiros - PJ", valorCP: 5000000.00, valorSIC: 5000000.00 },
                { codigo: "3.3.2.2.00.00.00", descricao: "Serviços de Terceiros - PF", valorCP: 2000000.00, valorSIC: 2000000.00 },
                { codigo: "3.3.2.3.00.00.00", descricao: "Serviços de Utilidade Pública", valorCP: 1000000.00, valorSIC: 1000000.00 }
              ]
            },
            {
              codigo: "3.3.3.0.00.00.00",
              descricao: "DEPRECIAÇÃO, AMORTIZAÇÃO E EXAUSTÃO",
              totalCP: 3124617.94,
              totalSIC: 3124617.94,
              vpds: [
                { codigo: "3.3.3.1.00.00.00", descricao: "Depreciação de Bens Móveis", valorCP: 2000000.00, valorSIC: 2000000.00 },
                { codigo: "3.3.3.2.00.00.00", descricao: "Depreciação de Bens Imóveis", valorCP: 1124617.94, valorSIC: 1124617.94 }
              ]
            },
            {
              codigo: "3.3.8.0.00.00.00",
              descricao: "CUSTO DE MATERIAIS, SERVIÇOS E CONSUMO DE CAPITAL FIXO",
              totalCP: 4500000.00,
              totalSIC: 4500000.00,
              vpds: [
                { codigo: "3.3.8.1.00.00.00", descricao: "Outros Custos Operacionais", valorCP: 4500000.00, valorSIC: 4500000.00 }
              ]
            }
          ]
        },
        {
          codigoPrincipal: "3.7.0.0.00.00.00",
          descricao: "TRIBUTÁRIAS",
          totalCP: 1800000.00,
          totalSIC: 1800000.00,
          subgrupos: [
            {
              codigo: "3.7.1.0.00.00.00",
              descricao: "IMPOSTOS, TAXAS E CONTRIBUIÇÕES DE MELHORIA",
              totalCP: 1000000.00,
              totalSIC: 1000000.00,
              vpds: [
                { codigo: "3.7.1.1.00.00.00", descricao: "IPTU", valorCP: 600000.00, valorSIC: 600000.00 },
                { codigo: "3.7.1.2.00.00.00", descricao: "Outras Taxas", valorCP: 400000.00, valorSIC: 400000.00 }
              ]
            },
            {
              codigo: "3.7.2.0.00.00.00",
              descricao: "CONTRIBUIÇÕES",
              totalCP: 500000.00,
              totalSIC: 500000.00,
              vpds: [
                { codigo: "3.7.2.1.00.00.00", descricao: "Contribuições Sociais", valorCP: 500000.00, valorSIC: 500000.00 }
              ]
            },
            {
              codigo: "3.7.8.0.00.00.00",
              descricao: "CUSTO COM TRIBUTOS",
              totalCP: 300000.00,
              totalSIC: 300000.00,
              vpds: [
                { codigo: "3.7.8.1.00.00.00", descricao: "Outros Custos Tributários", valorCP: 300000.00, valorSIC: 300000.00 }
              ]
            }
          ]
        },
        {
          codigoPrincipal: "3.9.0.0.00.00.00",
          descricao: "OUTRAS VARIAÇÕES PATRIMONIAIS DIMINUTIVAS",
          totalCP: 2300000.00,
          totalSIC: 2300000.00,
          subgrupos: [
            {
              codigo: "3.9.1.0.00.00.00",
              descricao: "PREMIAÇÕES",
              totalCP: 400000.00,
              totalSIC: 400000.00,
              vpds: [
                { codigo: "3.9.1.1.00.00.00", descricao: "Prêmios Diversos", valorCP: 400000.00, valorSIC: 400000.00 }
              ]
            },
            {
              codigo: "3.9.4.0.00.00.00",
              descricao: "INCENTIVOS",
              totalCP: 600000.00,
              totalSIC: 600000.00,
              vpds: [
                { codigo: "3.9.4.1.00.00.00", descricao: "Incentivos Fiscais", valorCP: 600000.00, valorSIC: 600000.00 }
              ]
            },
            {
              codigo: "3.9.7.0.00.00.00",
              descricao: "VPD DE CONSTITUIÇÃO DE PROVISÕES",
              totalCP: 800000.00,
              totalSIC: 800000.00,
              vpds: [
                { codigo: "3.9.7.1.00.00.00", descricao: "Provisões Diversas", valorCP: 800000.00, valorSIC: 800000.00 }
              ]
            },
            {
              codigo: "3.9.8.0.00.00.00",
              descricao: "CUSTO DE OUTRAS VPD",
              totalCP: 500000.00,
              totalSIC: 500000.00,
              vpds: [
                { codigo: "3.9.8.1.00.00.00", descricao: "Outros Custos", valorCP: 500000.00, valorSIC: 500000.00 }
              ]
            }
          ]
        }
      ]
    }
  }
];

// Mock data para estrutura da TreeView no modal
interface TreeNode {
  id: string;
  name: string;
  code?: string;
  value: number;
  level: number;
  children?: TreeNode[];
  icon?: string;
  isEquipment?: boolean;
}

const getMockTreeDataForVPD = (vpd: VPDDetail): TreeNode[] => {
  return [
    {
      id: "1",
      name: "ORGÂNICO",
      code: "1",
      value: vpd.valorSIC,
      level: 1,
      icon: "Building2",
      children: [
        {
          id: "1.12",
          name: "EDUCAÇÃO",
          code: "12",
          value: vpd.valorSIC * 0.8,
          level: 2,
          icon: "School",
          children: [
            {
              id: "1.12.010",
              name: "SECRETARIA MUNICIPAL",
              code: "010",
              value: vpd.valorSIC * 0.6,
              level: 3,
              icon: "Users",
              children: [
                {
                  id: "1.12.010.001",
                  name: "Secretaria Municipal de Educação",
                  code: "1.3.3205200.12.0001",
                  value: vpd.valorSIC * 0.4,
                  level: 4,
                  icon: "FileText"
                },
                {
                  id: "1.12.010.002",
                  name: "Coordenadoria de Ensino",
                  code: "1.3.3205200.12.0002",
                  value: vpd.valorSIC * 0.2,
                  level: 4,
                  icon: "FileText"
                }
              ]
            }
          ]
        },
        {
          id: "1.04",
          name: "ADMINISTRAÇÃO",
          code: "04",
          value: vpd.valorSIC * 0.2,
          level: 2,
          icon: "Building2",
          children: [
            {
              id: "1.04.001",
              name: "Secretaria de Administração",
              code: "001",
              value: vpd.valorSIC * 0.2,
              level: 3,
              icon: "Users"
            }
          ]
        }
      ]
    }
  ];
};

export default function ComparacaoVPDs() {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<VPDRecord | null>(null);
  const [records, setRecords] = useState<VPDRecord[]>(mockRecords);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedSubGroups, setExpandedSubGroups] = useState<Set<string>>(new Set());
  const [selectedVPD, setSelectedVPD] = useState<VPDDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalExpandedNodes, setModalExpandedNodes] = useState<Set<string>>(new Set());

  const openVPDDetail = (vpd: VPDDetail) => {
    setSelectedVPD(vpd);
    setModalExpandedNodes(new Set());
    setIsModalOpen(true);
  };

  const toggleModalNode = (nodeId: string) => {
    setModalExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Building2": return <Building2 className="h-4 w-4" />;
      case "School": return <School className="h-4 w-4" />;
      case "Users": return <Users className="h-4 w-4" />;
      case "FileText": return <FileText className="h-4 w-4" />;
      case "DollarSign": return <DollarSign className="h-4 w-4" />;
      case "MapPin": return <MapPin className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const renderTreeNode = (node: TreeNode): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = modalExpandedNodes.has(node.id);

    return (
      <div key={node.id} className="w-full">
        <div 
          className={cn(
            "flex items-start gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/30",
            node.isEquipment && "bg-blue-500/10 border border-blue-500/20"
          )}
          style={{ paddingLeft: `${Math.min((node.level - 1) * 12, 36)}px` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleModalNode(node.id);
              }}
              className="flex-shrink-0 p-0.5 hover:bg-muted/50 rounded mt-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </button>
          ) : (
            <div className="w-4 sm:w-5 flex-shrink-0" />
          )}
          
          {node.icon && (
            <div className="flex-shrink-0 mt-0.5">
              {getIconComponent(node.icon)}
            </div>
          )}
          
          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
            <div className="flex-1 min-w-0">
              {node.code && (
                <div className="text-[10px] sm:text-xs font-mono text-muted-foreground bg-muted/20 px-1.5 py-0.5 rounded inline-block mb-1">
                  {node.code}
                </div>
              )}
              <div className={cn(
                "text-xs sm:text-sm font-medium leading-snug",
                node.isEquipment && "text-blue-600 dark:text-blue-400"
              )}>
                {node.name}
              </div>
            </div>
            
            <div className="text-xs sm:text-sm font-bold text-primary whitespace-nowrap">
              {formatCurrency(node.value)}
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-0.5">
            {node.children?.map(renderTreeNode)}
          </div>
        )}
      </div>
    );
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

  const toggleSubGroup = (subGroupKey: string) => {
    setExpandedSubGroups(prev => {
      const next = new Set(prev);
      if (next.has(subGroupKey)) {
        next.delete(subGroupKey);
      } else {
        next.add(subGroupKey);
      }
      return next;
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const hasDivergence = (valorCP: number, valorSIC: number) => {
    return Math.abs(valorCP - valorSIC) > 0.01;
  };

  const getDivergenceAmount = (valorCP: number, valorSIC: number) => {
    return valorCP - valorSIC;
  };

  const calcularDiferenca = (vpd: number, total: number) => {
    const diferenca = Math.abs(vpd - total);
    const percentual = total !== 0 ? (diferenca / total) * 100 : 0;
    return { diferenca, percentual };
  };

  const temDivergencia = (vpd: number, total: number) => {
    const { diferenca } = calcularDiferenca(vpd, total);
    return diferenca > 0.01;
  };

  const subgrupoTemDivergencia = (subgrupo: VPDSubGroup) => {
    return hasDivergence(subgrupo.totalCP, subgrupo.totalSIC) || 
           subgrupo.vpds.some(vpd => hasDivergence(vpd.valorCP, vpd.valorSIC));
  };

  const subgrupoTemDivergenciaInterna = (subgrupo: VPDSubGroup) => {
    return !hasDivergence(subgrupo.totalCP, subgrupo.totalSIC) && 
           subgrupo.vpds.some(vpd => hasDivergence(vpd.valorCP, vpd.valorSIC));
  };

  const grupoTemDivergencia = (grupo: VPDGroup) => {
    return hasDivergence(grupo.totalCP, grupo.totalSIC) || 
           grupo.subgrupos.some(sub => subgrupoTemDivergencia(sub));
  };

  const grupoTemDivergenciaInterna = (grupo: VPDGroup) => {
    return !hasDivergence(grupo.totalCP, grupo.totalSIC) && 
           grupo.subgrupos.some(sub => subgrupoTemDivergencia(sub));
  };

  const calcularDivergenciaInternaGrupo = (grupo: VPDGroup) => {
    let totalDivergencia = 0;
    grupo.subgrupos.forEach(sub => {
      sub.vpds.forEach(vpd => {
        if (hasDivergence(vpd.valorCP, vpd.valorSIC)) {
          totalDivergencia += Math.abs(vpd.valorCP - vpd.valorSIC);
        }
      });
    });
    return totalDivergencia;
  };

  const calcularDivergenciaInternaSubgrupo = (subgrupo: VPDSubGroup) => {
    let totalDivergencia = 0;
    subgrupo.vpds.forEach(vpd => {
      if (hasDivergence(vpd.valorCP, vpd.valorSIC)) {
        totalDivergencia += Math.abs(vpd.valorCP - vpd.valorSIC);
      }
    });
    return totalDivergencia;
  };

  const contarItensSemDivergencia = (grupos: VPDGroup[]) => {
    let gruposSemDiv = 0;
    let subgruposSemDiv = 0;
    let vpdsSemDiv = 0;

    grupos.forEach(grupo => {
      if (!grupoTemDivergencia(grupo)) {
        gruposSemDiv++;
      }
      grupo.subgrupos.forEach(sub => {
        if (!subgrupoTemDivergencia(sub)) {
          subgruposSemDiv++;
        }
        sub.vpds.forEach(vpd => {
          if (!hasDivergence(vpd.valorCP, vpd.valorSIC)) {
            vpdsSemDiv++;
          }
        });
      });
    });

    return { gruposSemDiv, subgruposSemDiv, vpdsSemDiv };
  };

  const handleAprovar = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    const divergenciaOrganico = temDivergencia(record.modeloOrganico.totalVPDs, record.modeloOrganico.totalSIC);
    const divergenciaProgramatico = temDivergencia(record.modeloProgramatico.totalVPDs, record.modeloProgramatico.totalSIC);

    if (divergenciaOrganico || divergenciaProgramatico) {
      toast.error("Não é possível aprovar registro com divergências");
      return;
    }

    setRecords(records.map(r => 
      r.id === recordId ? { ...r, status: "aprovado" as const } : r
    ));
    toast.success("Registro aprovado com sucesso!");
    setSelectedRecord(null);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Comparação de VPDs</h1>
            <p className="text-muted-foreground">Conciliação bancária - Validação de registros mensais entre sistemas</p>
          </div>
        </div>

        {!selectedRecord ? (
          <Card>
            <CardHeader>
              <CardTitle>Registros de VPDs</CardTitle>
              <CardDescription>Selecione um registro para visualizar a comparação detalhada</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês/Ano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Modelo Orgânico</TableHead>
                    <TableHead>Modelo Programático</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => {
                    const divOrganic = temDivergencia(record.modeloOrganico.totalVPDs, record.modeloOrganico.totalSIC);
                    const divProg = temDivergencia(record.modeloProgramatico.totalVPDs, record.modeloProgramatico.totalSIC);
                    
                    return (
                      <TableRow key={record.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedRecord(record)}>
                        <TableCell className="font-medium">{record.mes}/{record.ano}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={record.status === "aprovado" ? "default" : "secondary"} 
                            className={`flex items-center gap-1 ${record.status === "aprovado" ? "bg-green-600" : "bg-amber-500"}`}
                          >
                            {record.status === "aprovado" ? (
                              <>
                                <ShieldCheck className="h-3 w-3" />
                                Aprovado
                              </>
                            ) : (
                              <>
                                <FileWarning className="h-3 w-3" />
                                Pendente
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {formatCurrency(record.modeloOrganico.totalVPDs)}
                            {divOrganic && (
                              <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                <CircleAlert className="h-3 w-3" />
                                Divergente
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {formatCurrency(record.modeloProgramatico.totalVPDs)}
                            {divProg && (
                              <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                <CircleAlert className="h-3 w-3" />
                                Divergente
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Ver Detalhes</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para listagem
              </Button>
              {selectedRecord.status === "pendente" && (
                <Button onClick={() => handleAprovar(selectedRecord.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar Registro
                </Button>
              )}
            </div>

            <div className="grid gap-6">
              {/* Modelo Orgânico */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Modelo Orgânico - {selectedRecord.mes}/{selectedRecord.ano}</CardTitle>
                      <CardDescription>Conciliação entre CP (VPDs) e SIC (Sistemas)</CardDescription>
                    </div>
                    {temDivergencia(selectedRecord.modeloOrganico.totalVPDs, selectedRecord.modeloOrganico.totalSIC) ? (
                      <Badge variant="destructive" className="flex items-center gap-2 animate-pulse">
                        <XCircle className="h-4 w-4" />
                        Divergente
                      </Badge>
                    ) : (
                      <Badge variant="default" className="flex items-center gap-2 bg-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Conciliado
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {/* CP - VPDs */}
                    <div className="space-y-4 border-r pr-6">
                      <div className="p-4 bg-primary/10 border-2 border-primary/20 rounded-lg">
                        <p className="text-xs font-semibold text-primary mb-1">CP - VPDs</p>
                        <p className="text-sm text-muted-foreground mb-2">Total do mês {selectedRecord.mes}/{selectedRecord.ano}</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(selectedRecord.modeloOrganico.totalVPDs)}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-muted-foreground">Detalhamento por VPD</p>
                          {(() => {
                            const { gruposSemDiv, subgruposSemDiv, vpdsSemDiv } = contarItensSemDivergencia(selectedRecord.modeloOrganico.gruposVPD);
                            const totalItensOk = gruposSemDiv + subgruposSemDiv + vpdsSemDiv;
                            if (totalItensOk > 0) {
                              return (
                                <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400 flex items-center gap-1.5">
                                  <CheckCircle className="h-3 w-3" />
                                  {totalItensOk} {totalItensOk === 1 ? 'item' : 'itens'} OK
                                </Badge>
                              );
                            }
                            return null;
                          })()}
                        </div>
                        {selectedRecord.modeloOrganico.gruposVPD.filter(grupo => grupoTemDivergencia(grupo)).map((grupo) => (
                          <Collapsible key={`organico-cp-${grupo.codigoPrincipal}`} open={expandedGroups.has(`organico-cp-${grupo.codigoPrincipal}`)}>
                            <div className="border rounded-lg overflow-hidden">
                              <CollapsibleTrigger
                                onClick={() => toggleGroup(`organico-cp-${grupo.codigoPrincipal}`)}
                                className="w-full p-3 flex items-center justify-between hover:bg-accent/50 transition-colors bg-yellow-50 dark:bg-yellow-950/30"
                              >
                                <div className="flex flex-col items-start flex-1">
                                  <span className="text-xs font-mono text-muted-foreground">{grupo.codigoPrincipal}</span>
                                  <span className="text-sm font-medium">{grupo.descricao}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="text-sm font-semibold">{formatCurrency(grupo.totalCP)}</span>
                                    {hasDivergence(grupo.totalCP, grupo.totalSIC) ? (
                                      <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                          Dif: {formatCurrency(Math.abs(grupo.totalCP - grupo.totalSIC))}
                                        </Badge>
                                      </div>
                                    ) : grupoTemDivergenciaInterna(grupo) && (
                                      <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                          Dif: {formatCurrency(calcularDivergenciaInternaGrupo(grupo))}
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                  {expandedGroups.has(`organico-cp-${grupo.codigoPrincipal}`) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="px-3 pb-3 pt-1 space-y-2">
                                  {grupo.subgrupos.filter(sub => subgrupoTemDivergencia(sub)).map((subgrupo) => (
                                    <Collapsible key={`organico-cp-sub-${subgrupo.codigo}`} open={expandedSubGroups.has(`organico-cp-sub-${subgrupo.codigo}`)}>
                                      <div className="border rounded-lg overflow-hidden">
                                        <CollapsibleTrigger
                                          onClick={() => toggleSubGroup(`organico-cp-sub-${subgrupo.codigo}`)}
                                          className="w-full p-2 flex items-center justify-between hover:bg-accent/50 transition-colors bg-orange-50 dark:bg-orange-950/20"
                                        >
                                          <div className="flex flex-col items-start flex-1">
                                            <span className="text-xs font-mono text-muted-foreground">{subgrupo.codigo}</span>
                                            <span className="text-xs font-medium">{subgrupo.descricao}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="flex flex-col items-end gap-0.5">
                                              <span className="text-xs font-semibold">{formatCurrency(subgrupo.totalCP)}</span>
                                              {hasDivergence(subgrupo.totalCP, subgrupo.totalSIC) ? (
                                                <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                                  Dif: {formatCurrency(Math.abs(subgrupo.totalCP - subgrupo.totalSIC))}
                                                </Badge>
                                              ) : subgrupoTemDivergenciaInterna(subgrupo) && (
                                                <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                                  Dif: {formatCurrency(calcularDivergenciaInternaSubgrupo(subgrupo))}
                                                </Badge>
                                              )}
                                            </div>
                                            {expandedSubGroups.has(`organico-cp-sub-${subgrupo.codigo}`) ? (
                                              <ChevronDown className="h-3 w-3" />
                                            ) : (
                                              <ChevronRight className="h-3 w-3" />
                                            )}
                                          </div>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                          <div className="px-2 pb-2 pt-1">
                                            <Table>
                                              <TableHeader>
                                                <TableRow>
                                                  <TableHead className="text-xs">Código</TableHead>
                                                  <TableHead className="text-xs">Descrição</TableHead>
                                                  <TableHead className="text-right text-xs">Valor CP</TableHead>
                                                  <TableHead className="text-xs w-[50px]"></TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {subgrupo.vpds.filter(vpd => hasDivergence(vpd.valorCP, vpd.valorSIC)).map((vpd) => (
                                                  <TableRow 
                                                    key={vpd.codigo} 
                                                    className={`${hasDivergence(vpd.valorCP, vpd.valorSIC) ? 'bg-red-50 dark:bg-red-950/20' : 'bg-background'}`}
                                                  >
                                                    <TableCell className="text-xs py-2 font-mono">
                                                      <div className="flex items-center gap-1">
                                                        {vpd.codigo}
                                                        {hasDivergence(vpd.valorCP, vpd.valorSIC) && (
                                                          <AlertTriangle className="h-3 w-3 text-destructive" />
                                                        )}
                                                      </div>
                                                    </TableCell>
                                                    <TableCell className="text-xs py-2">{vpd.descricao}</TableCell>
                                                    <TableCell className="text-right text-xs py-2 font-semibold">{formatCurrency(vpd.valorCP)}</TableCell>
                                                    <TableCell className="text-center py-2">
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => openVPDDetail(vpd)}
                                                      >
                                                        <Eye className="h-3 w-3" />
                                                      </Button>
                                                    </TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </div>
                                        </CollapsibleContent>
                                      </div>
                                    </Collapsible>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        ))}
                      </div>
                    </div>

                    {/* SIC - Sistemas */}
                    <div className="space-y-4 pl-6">
                      <div className="p-4 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">SIC - Sistemas</p>
                        <p className="text-sm text-muted-foreground mb-2">Total dos sistemas integrados</p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">{formatCurrency(selectedRecord.modeloOrganico.totalSIC)}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-muted-foreground">Detalhamento por VPD</p>
                          {(() => {
                            const { gruposSemDiv, subgruposSemDiv, vpdsSemDiv } = contarItensSemDivergencia(selectedRecord.modeloOrganico.gruposVPD);
                            const totalItensOk = gruposSemDiv + subgruposSemDiv + vpdsSemDiv;
                            if (totalItensOk > 0) {
                              return (
                                <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400 flex items-center gap-1.5">
                                  <CheckCircle className="h-3 w-3" />
                                  {totalItensOk} {totalItensOk === 1 ? 'item' : 'itens'} OK
                                </Badge>
                              );
                            }
                            return null;
                          })()}
                        </div>
                        {selectedRecord.modeloOrganico.gruposVPD.filter(grupo => grupoTemDivergencia(grupo)).map((grupo) => (
                          <Collapsible key={`organico-sic-${grupo.codigoPrincipal}`} open={expandedGroups.has(`organico-sic-${grupo.codigoPrincipal}`)}>
                            <div className="border rounded-lg overflow-hidden">
                              <CollapsibleTrigger
                                onClick={() => toggleGroup(`organico-sic-${grupo.codigoPrincipal}`)}
                                className="w-full p-3 flex items-center justify-between hover:bg-accent/50 transition-colors bg-yellow-50 dark:bg-yellow-950/30"
                              >
                                <div className="flex flex-col items-start flex-1">
                                  <span className="text-xs font-mono text-muted-foreground">{grupo.codigoPrincipal}</span>
                                  <span className="text-sm font-medium">{grupo.descricao}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="text-sm font-semibold">{formatCurrency(grupo.totalSIC)}</span>
                                    {hasDivergence(grupo.totalCP, grupo.totalSIC) ? (
                                      <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                          CP: {formatCurrency(grupo.totalCP)}
                                        </Badge>
                                      </div>
                                    ) : grupoTemDivergenciaInterna(grupo) && (
                                      <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                          Dif: {formatCurrency(calcularDivergenciaInternaGrupo(grupo))}
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                  {expandedGroups.has(`organico-sic-${grupo.codigoPrincipal}`) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="px-3 pb-3 pt-1 space-y-2">
                                  {grupo.subgrupos.filter(sub => subgrupoTemDivergencia(sub)).map((subgrupo) => (
                                    <Collapsible key={`organico-sic-sub-${subgrupo.codigo}`} open={expandedSubGroups.has(`organico-sic-sub-${subgrupo.codigo}`)}>
                                      <div className="border rounded-lg overflow-hidden">
                                        <CollapsibleTrigger
                                          onClick={() => toggleSubGroup(`organico-sic-sub-${subgrupo.codigo}`)}
                                          className="w-full p-2 flex items-center justify-between hover:bg-accent/50 transition-colors bg-orange-50 dark:bg-orange-950/20"
                                        >
                                          <div className="flex flex-col items-start flex-1">
                                            <span className="text-xs font-mono text-muted-foreground">{subgrupo.codigo}</span>
                                            <span className="text-xs font-medium">{subgrupo.descricao}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="flex flex-col items-end gap-0.5">
                                              <span className="text-xs font-semibold">{formatCurrency(subgrupo.totalSIC)}</span>
                                              {hasDivergence(subgrupo.totalCP, subgrupo.totalSIC) ? (
                                                <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                                  CP: {formatCurrency(subgrupo.totalCP)}
                                                </Badge>
                                              ) : subgrupoTemDivergenciaInterna(subgrupo) && (
                                                <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                                  Dif: {formatCurrency(calcularDivergenciaInternaSubgrupo(subgrupo))}
                                                </Badge>
                                              )}
                                            </div>
                                            {expandedSubGroups.has(`organico-sic-sub-${subgrupo.codigo}`) ? (
                                              <ChevronDown className="h-3 w-3" />
                                            ) : (
                                              <ChevronRight className="h-3 w-3" />
                                            )}
                                          </div>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                          <div className="px-2 pb-2 pt-1">
                                            <Table>
                                              <TableHeader>
                                                <TableRow>
                                                  <TableHead className="text-xs">Código</TableHead>
                                                  <TableHead className="text-xs">Descrição</TableHead>
                                                  <TableHead className="text-right text-xs">Valor SIC</TableHead>
                                                  <TableHead className="text-xs w-[50px]"></TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {subgrupo.vpds.filter(vpd => hasDivergence(vpd.valorCP, vpd.valorSIC)).map((vpd) => (
                                                  <TableRow 
                                                    key={vpd.codigo} 
                                                    className={`${hasDivergence(vpd.valorCP, vpd.valorSIC) ? 'bg-red-50 dark:bg-red-950/20 border-l-4 border-l-destructive' : 'bg-background'}`}
                                                  >
                                                    <TableCell className="text-xs py-2 font-mono">
                                                      <div className="flex items-center gap-1">
                                                        {vpd.codigo}
                                                        {hasDivergence(vpd.valorCP, vpd.valorSIC) && (
                                                          <AlertTriangle className="h-3 w-3 text-destructive animate-pulse" />
                                                        )}
                                                      </div>
                                                    </TableCell>
                                                    <TableCell className="text-xs py-2">
                                                      <div className="flex items-center gap-2">
                                                        <span>{vpd.descricao}</span>
                                                        {hasDivergence(vpd.valorCP, vpd.valorSIC) && (
                                                          <Badge variant="outline" className="text-[10px] py-0 h-4 border-amber-500 text-amber-700 dark:text-amber-400 flex items-center gap-0.5">
                                                            SIC ≠ CP
                                                          </Badge>
                                                        )}
                                                      </div>
                                                    </TableCell>
                                                    <TableCell className="text-right text-xs py-2 font-semibold">
                                                      <div className="flex flex-col items-end gap-0.5">
                                                        <span>{formatCurrency(vpd.valorSIC)}</span>
                                                        {hasDivergence(vpd.valorCP, vpd.valorSIC) && (
                                                          <span className="text-[10px] text-muted-foreground font-normal">
                                                            CP: {formatCurrency(vpd.valorCP)}
                                                          </span>
                                                        )}
                                                      </div>
                                                    </TableCell>
                                                    <TableCell className="text-center py-2">
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() => openVPDDetail(vpd)}
                                                      >
                                                        <Eye className="h-3 w-3" />
                                                      </Button>
                                                    </TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </div>
                                        </CollapsibleContent>
                                      </div>
                                    </Collapsible>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Resumo de Diferença */}
                   {temDivergencia(selectedRecord.modeloOrganico.totalVPDs, selectedRecord.modeloOrganico.totalSIC) && (
                    <div className="mt-6 p-4 bg-destructive/10 border-2 border-destructive/30 rounded-lg animate-fade-in">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-full bg-destructive/20">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <p className="font-semibold text-destructive">Divergência Identificada no Modelo Orgânico</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Diferença Absoluta:</p>
                          <p className="font-semibold">{formatCurrency(calcularDiferenca(selectedRecord.modeloOrganico.totalVPDs, selectedRecord.modeloOrganico.totalSIC).diferenca)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Percentual:</p>
                          <p className="font-semibold">{calcularDiferenca(selectedRecord.modeloOrganico.totalVPDs, selectedRecord.modeloOrganico.totalSIC).percentual.toFixed(2)}%</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Modelo Programático */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Modelo Programático - {selectedRecord.mes}/{selectedRecord.ano}</CardTitle>
                      <CardDescription>Conciliação entre CP (VPDs) e SIC (Sistemas)</CardDescription>
                    </div>
                    {temDivergencia(selectedRecord.modeloProgramatico.totalVPDs, selectedRecord.modeloProgramatico.totalSIC) ? (
                      <Badge variant="destructive" className="flex items-center gap-2 animate-pulse">
                        <XCircle className="h-4 w-4" />
                        Divergente
                      </Badge>
                    ) : (
                      <Badge variant="default" className="flex items-center gap-2 bg-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Conciliado
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {/* CP - VPDs */}
                    <div className="space-y-4 border-r pr-6">
                      <div className="p-4 bg-primary/10 border-2 border-primary/20 rounded-lg">
                        <p className="text-xs font-semibold text-primary mb-1">CP - VPDs</p>
                        <p className="text-sm text-muted-foreground mb-2">Total do mês {selectedRecord.mes}/{selectedRecord.ano}</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(selectedRecord.modeloProgramatico.totalVPDs)}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-muted-foreground">Detalhamento por VPD</p>
                          {(() => {
                            const { gruposSemDiv, subgruposSemDiv, vpdsSemDiv } = contarItensSemDivergencia(selectedRecord.modeloProgramatico.gruposVPD);
                            const totalItensOk = gruposSemDiv + subgruposSemDiv + vpdsSemDiv;
                            if (totalItensOk > 0) {
                              return (
                                <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400 flex items-center gap-1.5">
                                  <CheckCircle className="h-3 w-3" />
                                  {totalItensOk} {totalItensOk === 1 ? 'item' : 'itens'} OK
                                </Badge>
                              );
                            }
                            return null;
                          })()}
                        </div>
                        {selectedRecord.modeloProgramatico.gruposVPD.filter(grupo => grupoTemDivergencia(grupo)).map((grupo) => (
                          <Collapsible key={`programatico-cp-${grupo.codigoPrincipal}`} open={expandedGroups.has(`programatico-cp-${grupo.codigoPrincipal}`)}>
                            <div className="border rounded-lg overflow-hidden">
                              <CollapsibleTrigger
                                onClick={() => toggleGroup(`programatico-cp-${grupo.codigoPrincipal}`)}
                                className="w-full p-3 flex items-center justify-between hover:bg-accent/50 transition-colors bg-yellow-50 dark:bg-yellow-950/30"
                              >
                                <div className="flex flex-col items-start flex-1">
                                  <span className="text-xs font-mono text-muted-foreground">{grupo.codigoPrincipal}</span>
                                  <span className="text-sm font-medium">{grupo.descricao}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="text-sm font-semibold">{formatCurrency(grupo.totalCP)}</span>
                                    {hasDivergence(grupo.totalCP, grupo.totalSIC) ? (
                                      <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                          Dif: {formatCurrency(Math.abs(grupo.totalCP - grupo.totalSIC))}
                                        </Badge>
                                      </div>
                                    ) : grupoTemDivergenciaInterna(grupo) && (
                                      <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                          Dif: {formatCurrency(calcularDivergenciaInternaGrupo(grupo))}
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                  {expandedGroups.has(`programatico-cp-${grupo.codigoPrincipal}`) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="px-3 pb-3 pt-1 space-y-2">
                                  {grupo.subgrupos.filter(sub => subgrupoTemDivergencia(sub)).map((subgrupo) => (
                                    <Collapsible key={`programatico-cp-sub-${subgrupo.codigo}`} open={expandedSubGroups.has(`programatico-cp-sub-${subgrupo.codigo}`)}>
                                      <div className="border rounded-lg overflow-hidden">
                                        <CollapsibleTrigger
                                          onClick={() => toggleSubGroup(`programatico-cp-sub-${subgrupo.codigo}`)}
                                          className="w-full p-2 flex items-center justify-between hover:bg-accent/50 transition-colors bg-orange-50 dark:bg-orange-950/20"
                                        >
                                          <div className="flex flex-col items-start flex-1">
                                            <span className="text-xs font-mono text-muted-foreground">{subgrupo.codigo}</span>
                                            <span className="text-xs font-medium">{subgrupo.descricao}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="flex flex-col items-end gap-0.5">
                                              <span className="text-xs font-semibold">{formatCurrency(subgrupo.totalCP)}</span>
                                              {hasDivergence(subgrupo.totalCP, subgrupo.totalSIC) ? (
                                                <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                                  Dif: {formatCurrency(Math.abs(subgrupo.totalCP - subgrupo.totalSIC))}
                                                </Badge>
                                              ) : subgrupoTemDivergenciaInterna(subgrupo) && (
                                                <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                                  Dif: {formatCurrency(calcularDivergenciaInternaSubgrupo(subgrupo))}
                                                </Badge>
                                              )}
                                            </div>
                                            {expandedSubGroups.has(`programatico-cp-sub-${subgrupo.codigo}`) ? (
                                              <ChevronDown className="h-3 w-3" />
                                            ) : (
                                              <ChevronRight className="h-3 w-3" />
                                            )}
                                          </div>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                          <div className="px-2 pb-2 pt-1">
                                            <Table>
                                              <TableHeader>
                                                <TableRow>
                                                  <TableHead className="text-xs">Código</TableHead>
                                                  <TableHead className="text-xs">Descrição</TableHead>
                                                  <TableHead className="text-right text-xs">Valor CP</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {subgrupo.vpds.filter(vpd => hasDivergence(vpd.valorCP, vpd.valorSIC)).map((vpd) => (
                                                  <TableRow 
                                                    key={vpd.codigo} 
                                                     className={`${hasDivergence(vpd.valorCP, vpd.valorSIC) ? 'bg-red-50 dark:bg-red-950/20 border-l-4 border-l-destructive' : 'bg-background'}`}
                                                  >
                                                    <TableCell className="text-xs py-2 font-mono">
                                                       <div className="flex items-center gap-1">
                                                         {vpd.codigo}
                                                          {hasDivergence(vpd.valorCP, vpd.valorSIC) && (
                                                           <div className="relative">
                                                             <AlertTriangle className="h-3 w-3 text-destructive animate-pulse" />
                                                           </div>
                                                         )}
                                                       </div>
                                                     </TableCell>
                                                    <TableCell className="text-xs py-2">
                                                      <div className="flex items-center gap-2">
                                                        <span>{vpd.descricao}</span>
                                                        {hasDivergence(vpd.valorCP, vpd.valorSIC) && (
                                                          <Badge variant="outline" className="text-[10px] py-0 h-4 border-amber-500 text-amber-700 dark:text-amber-400 flex items-center gap-0.5">
                                                            {vpd.valorSIC > vpd.valorCP ? (
                                                              <TrendingUp className="h-2.5 w-2.5" />
                                                            ) : vpd.valorSIC < vpd.valorCP ? (
                                                              <TrendingDown className="h-2.5 w-2.5" />
                                                            ) : (
                                                              <Minus className="h-2.5 w-2.5" />
                                                            )}
                                                            SIC ≠ CP
                                                          </Badge>
                                                        )}
                                                      </div>
                                                    </TableCell>
                                                    <TableCell className="text-right text-xs py-2 font-semibold">
                                                      <div className="flex flex-col items-end gap-0.5">
                                                        <span>{formatCurrency(vpd.valorCP)}</span>
                                                        {hasDivergence(vpd.valorCP, vpd.valorSIC) && (
                                                          <span className="text-[10px] text-muted-foreground font-normal">
                                                            SIC: {formatCurrency(vpd.valorSIC)}
                                                          </span>
                                                        )}
                                                      </div>
                                                    </TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </div>
                                        </CollapsibleContent>
                                      </div>
                                    </Collapsible>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        ))}
                      </div>
                    </div>

                    {/* SIC - Sistemas */}
                    <div className="space-y-4 pl-6">
                      <div className="p-4 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">SIC - Sistemas</p>
                        <p className="text-sm text-muted-foreground mb-2">Total dos sistemas integrados</p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">{formatCurrency(selectedRecord.modeloProgramatico.totalSIC)}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-muted-foreground">Detalhamento por VPD</p>
                          {(() => {
                            const { gruposSemDiv, subgruposSemDiv, vpdsSemDiv } = contarItensSemDivergencia(selectedRecord.modeloProgramatico.gruposVPD);
                            const totalItensOk = gruposSemDiv + subgruposSemDiv + vpdsSemDiv;
                            if (totalItensOk > 0) {
                              return (
                                <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400 flex items-center gap-1.5">
                                  <CheckCircle className="h-3 w-3" />
                                  {totalItensOk} {totalItensOk === 1 ? 'item' : 'itens'} OK
                                </Badge>
                              );
                            }
                            return null;
                          })()}
                        </div>
                        {selectedRecord.modeloProgramatico.gruposVPD.filter(grupo => grupoTemDivergencia(grupo)).map((grupo) => (
                          <Collapsible key={`programatico-sic-${grupo.codigoPrincipal}`} open={expandedGroups.has(`programatico-sic-${grupo.codigoPrincipal}`)}>
                            <div className="border rounded-lg overflow-hidden">
                              <CollapsibleTrigger
                                onClick={() => toggleGroup(`programatico-sic-${grupo.codigoPrincipal}`)}
                                className="w-full p-3 flex items-center justify-between hover:bg-accent/50 transition-colors bg-yellow-50 dark:bg-yellow-950/30"
                              >
                                <div className="flex flex-col items-start flex-1">
                                  <span className="text-xs font-mono text-muted-foreground">{grupo.codigoPrincipal}</span>
                                  <span className="text-sm font-medium">{grupo.descricao}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="text-sm font-semibold">{formatCurrency(grupo.totalSIC)}</span>
                                    {hasDivergence(grupo.totalCP, grupo.totalSIC) ? (
                                      <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                          CP: {formatCurrency(grupo.totalCP)}
                                        </Badge>
                                      </div>
                                    ) : grupoTemDivergenciaInterna(grupo) && (
                                      <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                          Dif: {formatCurrency(calcularDivergenciaInternaGrupo(grupo))}
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                  {expandedGroups.has(`programatico-sic-${grupo.codigoPrincipal}`) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="px-3 pb-3 pt-1 space-y-2">
                                  {grupo.subgrupos.filter(sub => subgrupoTemDivergencia(sub)).map((subgrupo) => (
                                    <Collapsible key={`programatico-sic-sub-${subgrupo.codigo}`} open={expandedSubGroups.has(`programatico-sic-sub-${subgrupo.codigo}`)}>
                                      <div className="border rounded-lg overflow-hidden">
                                        <CollapsibleTrigger
                                          onClick={() => toggleSubGroup(`programatico-sic-sub-${subgrupo.codigo}`)}
                                          className="w-full p-2 flex items-center justify-between hover:bg-accent/50 transition-colors bg-orange-50 dark:bg-orange-950/20"
                                        >
                                          <div className="flex flex-col items-start flex-1">
                                            <span className="text-xs font-mono text-muted-foreground">{subgrupo.codigo}</span>
                                            <span className="text-xs font-medium">{subgrupo.descricao}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="flex flex-col items-end gap-0.5">
                                              <span className="text-xs font-semibold">{formatCurrency(subgrupo.totalSIC)}</span>
                                              {hasDivergence(subgrupo.totalCP, subgrupo.totalSIC) ? (
                                                <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                                  CP: {formatCurrency(subgrupo.totalCP)}
                                                </Badge>
                                              ) : subgrupoTemDivergenciaInterna(subgrupo) && (
                                                <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-amber-500 text-amber-700 dark:text-amber-400">
                                                  Dif: {formatCurrency(calcularDivergenciaInternaSubgrupo(subgrupo))}
                                                </Badge>
                                              )}
                                            </div>
                                            {expandedSubGroups.has(`programatico-sic-sub-${subgrupo.codigo}`) ? (
                                              <ChevronDown className="h-3 w-3" />
                                            ) : (
                                              <ChevronRight className="h-3 w-3" />
                                            )}
                                          </div>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                          <div className="px-2 pb-2 pt-1">
                                            <Table>
                                              <TableHeader>
                                                <TableRow>
                                                  <TableHead className="text-xs">Código</TableHead>
                                                  <TableHead className="text-xs">Descrição</TableHead>
                                                  <TableHead className="text-right text-xs">Valor SIC</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {subgrupo.vpds.filter(vpd => hasDivergence(vpd.valorCP, vpd.valorSIC)).map((vpd) => (
                                                  <TableRow 
                                                    key={vpd.codigo} 
                                                     className={`${hasDivergence(vpd.valorCP, vpd.valorSIC) ? 'bg-red-50 dark:bg-red-950/20 border-l-4 border-l-destructive' : 'bg-background'}`}
                                                  >
                                                   <TableCell className="text-xs py-2 font-mono">
                                                      <div className="flex items-center gap-1">
                                                        {vpd.codigo}
                                                        {hasDivergence(vpd.valorCP, vpd.valorSIC) && (
                                                          <AlertTriangle className="h-3 w-3 text-destructive" />
                                                        )}
                                                      </div>
                                                    </TableCell>
                                                    <TableCell className="text-xs py-2">
                                                      <div className="flex items-center gap-2">
                                                        <span>{vpd.descricao}</span>
                                                        {hasDivergence(vpd.valorCP, vpd.valorSIC) && (
                                                          <Badge variant="outline" className="text-[10px] py-0 h-4 border-amber-500 text-amber-700 dark:text-amber-400 flex items-center gap-0.5">
                                                            {vpd.valorSIC > vpd.valorCP ? (
                                                              <TrendingUp className="h-2.5 w-2.5" />
                                                            ) : vpd.valorSIC < vpd.valorCP ? (
                                                              <TrendingDown className="h-2.5 w-2.5" />
                                                            ) : (
                                                              <Minus className="h-2.5 w-2.5" />
                                                            )}
                                                            SIC ≠ CP
                                                          </Badge>
                                                        )}
                                                      </div>
                                                    </TableCell>
                                                     <TableCell className="text-right text-xs py-2 font-semibold">
                                                       <div className="flex flex-col items-end gap-0.5">
                                                         <div className="flex items-center gap-2">
                                                           <span>{formatCurrency(vpd.valorSIC)}</span>
                                                         </div>
                                                         {hasDivergence(vpd.valorCP, vpd.valorSIC) && (
                                                           <div className="flex items-center gap-1 text-destructive">
                                                             <span className="text-[10px] font-normal">
                                                               CP: {formatCurrency(vpd.valorCP)}
                                                             </span>
                                                             <span className="text-[10px] font-semibold">
                                                               ({formatCurrency(getDivergenceAmount(vpd.valorCP, vpd.valorSIC))})
                                                             </span>
                                                           </div>
                                                         )}
                                                       </div>
                                                     </TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </div>
                                        </CollapsibleContent>
                                      </div>
                                    </Collapsible>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Resumo de Diferença */}
                   {temDivergencia(selectedRecord.modeloProgramatico.totalVPDs, selectedRecord.modeloProgramatico.totalSIC) && (
                    <div className="mt-6 p-4 bg-destructive/10 border-2 border-destructive/30 rounded-lg animate-fade-in">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-full bg-destructive/20">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <p className="font-semibold text-destructive">Divergência Identificada no Modelo Programático</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Diferença Absoluta:</p>
                          <p className="font-semibold">{formatCurrency(calcularDiferenca(selectedRecord.modeloProgramatico.totalVPDs, selectedRecord.modeloProgramatico.totalSIC).diferenca)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Percentual:</p>
                          <p className="font-semibold">{calcularDiferenca(selectedRecord.modeloProgramatico.totalVPDs, selectedRecord.modeloProgramatico.totalSIC).percentual.toFixed(2)}%</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhamento VPD */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Estrutura de Análise de Custos
            </DialogTitle>
            <DialogDescription>
              {selectedVPD && (
                <div className="flex flex-col gap-1 mt-2">
                  <span className="font-mono text-sm">{selectedVPD.codigo}</span>
                  <span className="font-medium">{selectedVPD.descricao}</span>
                  <div className="flex gap-4 mt-2">
                    <Badge variant="outline" className="text-xs">
                      CP: {formatCurrency(selectedVPD.valorCP)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      SIC: {formatCurrency(selectedVPD.valorSIC)}
                    </Badge>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-1 max-h-96 overflow-y-auto border rounded-lg p-3 bg-muted/20">
            {selectedVPD && getMockTreeDataForVPD(selectedVPD).map(renderTreeNode)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
