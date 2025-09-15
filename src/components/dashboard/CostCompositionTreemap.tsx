import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FunctionDetailGrid } from "./FunctionDetailGrid";
import { useState } from "react";

const departments = [
  { name: "Defesa Pública", value: 2.8, color: "bg-chart-primary" },
  { name: "Administração", value: 4.2, color: "bg-chart-secondary" },
  { name: "Segurança Pública", value: 6.1, color: "bg-chart-tertiary" },
  { name: "Legislativa", value: 3.5, color: "bg-chart-quaternary" },
  { name: "Saúde", value: 8.7, color: "bg-chart-quinary" },
  { name: "Educação", value: 12.4, color: "bg-chart-primary" },
  { name: "Assistência Social", value: 5.3, color: "bg-chart-secondary" },
  { name: "Previdência", value: 7.2, color: "bg-chart-tertiary" },
  { name: "Transporte e Logística", value: 4.8, color: "bg-chart-quaternary" },
];

export function CostCompositionTreemap() {
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  return (
    <Card className="col-span-12">
      <CardHeader>
        <CardTitle>Composição dos Custos por Função</CardTitle>
        <CardDescription>
          Representação visual proporcional dos custos por área administrativa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-2 h-64 mb-4">
          {departments.map((dept, index) => {
            // Calculate relative size based on value
            const sizeClass = dept.value > 10 
              ? "col-span-3 row-span-2" 
              : dept.value > 7 
              ? "col-span-2 row-span-2" 
              : dept.value > 5 
              ? "col-span-2" 
              : "col-span-1";
            
            return (
              <div
                key={index}
                className={`${dept.color} ${sizeClass} rounded-lg flex flex-col justify-center items-center text-white text-xs font-semibold text-center p-2 transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer ${
                  selectedFunction === dept.name ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
                onClick={() => setSelectedFunction(selectedFunction === dept.name ? null : dept.name)}
              >
                <div className="leading-tight">{dept.name}</div>
                <div className="text-lg font-bold mt-1">{dept.value}%</div>
              </div>
            );
          })}
        </div>
        
        {/* Integrated Detail Grid */}
        {selectedFunction && (
          <FunctionDetailGrid 
            selectedFunction={selectedFunction}
            onClose={() => setSelectedFunction(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}