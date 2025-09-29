import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  RefreshCw, 
  Download, 
  Search, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  XCircle,
  Clock,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Dados de exemplo - em produção viriam de uma API
const mockInconsistentRecords = [
  {
    _id: "65f3a2b1c4d5e6f7g8h9i0j1",
    versao: "2.1.0",
    projeto: "SIC-PMVV",
    template: "FOLHA_PAGAMENTO_SERVIDOR",
    status: "Inconsistente",
    dataInconsistencia: "2024-03-15T14:30:25.000Z",
    mensagemId: "MSG_001_2024_03_15",
    tentativasReprocessamento: 3,
    podeReprocessar: true,
    dadosOriginais: {
      _v: {
        codigoServidor: "12345",
        nomeServidor: "João Silva Santos",
        cpf: "123.456.789-00",
        matricula: "2024001",
        cargo: "Analista Sistemas",
        salarioBase: 8500.00,
        gratificacoes: 1200.50,
        descontos: 850.75,
        salarioLiquido: 8849.75,
        competencia: "2024-03",
        unidadeGestora: "SEMGE",
        statusFolha: "PROCESSADA"
      }
    },
    errosValidacao: [
      "Campo 'cpf' deve seguir o formato XXX.XXX.XXX-XX",
      "Valor de 'salarioLiquido' não confere com cálculo (salarioBase + gratificacoes - descontos)",
      "Campo 'cargo' contém caracteres especiais não permitidos"
    ],
    camposInvalidos: [
      { campo: "cpf", valorRecebido: "123.456.789-00" },
      { campo: "salarioLiquido", valorRecebido: "8849.75" },
      { campo: "cargo", valorRecebido: "Analista Sistemas" }
    ],
    warnings: [
      "Servidor não encontrado na base de dados ativa",
      "Competência anterior ao período mínimo permitido"
    ]
  },
  {
    _id: "65f3a2b1c4d5e6f7g8h9i0j2",
    versao: "2.1.0",
    projeto: "SIC-PMVV",
    template: "DESPESA_CONTRATACAO",
    status: "Inconsistente",
    dataInconsistencia: "2024-03-15T15:45:12.000Z",
    mensagemId: "MSG_002_2024_03_15",
    tentativasReprocessamento: 1,
    podeReprocessar: false,
    dadosOriginais: {
      _v: {
        numeroContrato: "CT-2024-001",
        fornecedor: "Empresa XYZ Ltda",
        cnpj: "12.345.678/0001-90",
        valorContrato: 150000.00,
        dataAssinatura: "2024-02-15",
        prazoExecucao: 180,
        objeto: "Prestação de serviços de manutenção",
        modalidade: "PREGAO_ELETRONICO"
      }
    },
    errosValidacao: [
      "CNPJ inválido - dígitos verificadores incorretos",
      "Data de assinatura posterior à data atual"
    ],
    camposInvalidos: [
      { campo: "cnpj", valorRecebido: "12.345.678/0001-90" },
      { campo: "dataAssinatura", valorRecebido: "2024-02-15" }
    ],
    warnings: [
      "Valor do contrato acima da média para esta modalidade"
    ]
  }
];

const InconsistentRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(mockInconsistentRecords[0]);
  const [expandedData, setExpandedData] = useState(false);
  const { toast } = useToast();

  const filteredRecords = mockInconsistentRecords.filter(record =>
    record._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.mensagemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Inconsistente':
        return 'bg-destructive text-destructive-foreground';
      case 'Processado':
        return 'bg-green-500 text-white';
      case 'Pendente':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const handleReprocess = () => {
    if (selectedRecord.podeReprocessar) {
      toast({
        title: "Reprocessamento iniciado",
        description: `Registro ${selectedRecord._id} foi enviado para reprocessamento.`,
      });
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(selectedRecord, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `registro_${selectedRecord._id}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "JSON exportado",
      description: "Arquivo baixado com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Registros Inconsistentes</h1>
          <p className="text-muted-foreground">Gerenciamento de registros com inconsistências no MongoDB</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Registros */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Registros
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, mensagem ou status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {filteredRecords.map((record) => (
                    <Card
                      key={record._id}
                      className={`cursor-pointer transition-all ${
                        selectedRecord._id === record._id
                          ? 'ring-2 ring-primary'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedRecord(record)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="text-sm font-mono text-muted-foreground">
                            {record._id.slice(-8)}...
                          </div>
                          <Badge className={getStatusBadgeColor(record.status)}>
                            {record.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(record.dataInconsistencia)}
                          </div>
                          <div className="text-xs">
                            {record.tentativasReprocessamento} tentativas
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Detalhes do Registro */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="font-mono text-lg">
                    ID: {selectedRecord._id}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Versão: {selectedRecord.versao}</span>
                    <span>Projeto: {selectedRecord.projeto}</span>
                    <span>Template: {selectedRecord.template}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusBadgeColor(selectedRecord.status)}>
                      {selectedRecord.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(selectedRecord.dataInconsistencia)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleReprocess}
                    disabled={!selectedRecord.podeReprocessar}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reprocessar
                  </Button>
                  <Button
                    onClick={handleExportJSON}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Exportar JSON
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="dados" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="dados">Dados Originais</TabsTrigger>
                  <TabsTrigger value="validacoes">Validações</TabsTrigger>
                  <TabsTrigger value="historico">Histórico</TabsTrigger>
                </TabsList>

                <TabsContent value="dados" className="mt-4">
                  <Collapsible open={expandedData} onOpenChange={setExpandedData}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        Dados Enviados
                        {expandedData ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(selectedRecord.dadosOriginais._v).map(([key, value]) => (
                              <div key={key} className="space-y-1">
                                <div className="text-sm font-medium text-muted-foreground">
                                  {key}
                                </div>
                                <div className="text-sm font-mono bg-muted p-2 rounded">
                                  {String(value)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                </TabsContent>

                <TabsContent value="validacoes" className="mt-4">
                  <div className="space-y-6">
                    {/* Erros de Validação */}
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Erros de Validação</AlertTitle>
                      <AlertDescription>
                        <ul className="mt-2 space-y-1">
                          {selectedRecord.errosValidacao.map((erro, index) => (
                            <li key={index} className="text-sm">
                              {index + 1}. {erro}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>

                    {/* Campos Inválidos */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Campos Inválidos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Campo</TableHead>
                              <TableHead>Valor Recebido</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedRecord.camposInvalidos.map((campo, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{campo.campo}</TableCell>
                                <TableCell className="font-mono bg-muted">{campo.valorRecebido}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    {/* Avisos */}
                    {selectedRecord.warnings.length > 0 && (
                      <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertTitle className="text-yellow-800 dark:text-yellow-200">Avisos (Warnings)</AlertTitle>
                        <AlertDescription>
                          <ul className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-300">
                            {selectedRecord.warnings.map((warning, index) => (
                              <li key={index} className="text-sm">
                                • {warning}
                              </li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="historico" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Histórico de Processamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Mensagem ID:</span>
                          <span className="text-sm font-mono">{selectedRecord.mensagemId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Tentativas de Reprocessamento:</span>
                          <Badge variant="outline">{selectedRecord.tentativasReprocessamento}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Pode Reprocessar:</span>
                          <Badge className={selectedRecord.podeReprocessar ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                            {selectedRecord.podeReprocessar ? 'Sim' : 'Não'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Última Inconsistência:</span>
                          <span className="text-sm">{formatDate(selectedRecord.dataInconsistencia)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InconsistentRecords;