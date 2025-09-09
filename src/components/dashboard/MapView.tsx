import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for public facilities - More examples spread across the map
const publicFacilities = [
  { id: 1, name: "Escola Municipal João Silva", type: "escola", cost: "R$ 2.5M" },
  { id: 2, name: "UBS Centro", type: "ubs", cost: "R$ 1.8M" },
  { id: 3, name: "Praça da Liberdade", type: "praca", cost: "R$ 800K" },
  { id: 4, name: "Cemitério Municipal", type: "cemiterio", cost: "R$ 600K" },
  { id: 5, name: "Mercado Municipal", type: "mercado", cost: "R$ 1.2M" },
  { id: 6, name: "Terminal Rodoviário", type: "terminal", cost: "R$ 3.1M" },
  { id: 7, name: "Escola Estadual Maria Clara", type: "escola", cost: "R$ 2.8M" },
  { id: 8, name: "UBS Vila Nova", type: "ubs", cost: "R$ 1.5M" },
  { id: 9, name: "Parque Central", type: "praca", cost: "R$ 1.1M" },
  { id: 10, name: "Centro Esportivo", type: "esporte", cost: "R$ 2.2M" },
  { id: 11, name: "Biblioteca Municipal", type: "biblioteca", cost: "R$ 900K" },
  { id: 12, name: "Posto de Saúde Norte", type: "ubs", cost: "R$ 1.7M" },
  { id: 13, name: "Escola Técnica", type: "escola", cost: "R$ 3.2M" },
  { id: 14, name: "Centro Cultural", type: "cultura", cost: "R$ 1.9M" },
  { id: 15, name: "Terminal Urbano Sul", type: "terminal", cost: "R$ 2.7M" }
];

const facilityColors = {
  escola: '#059669', // Green
  ubs: '#0284C7', // Blue
  praca: '#DC2626', // Red
  cemiterio: '#6B7280', // Gray
  mercado: '#7C3AED', // Purple
  terminal: '#EA580C', // Orange
  esporte: '#0891B2', // Cyan
  biblioteca: '#B91C1C', // Dark Red
  cultura: '#7C2D12' // Brown
};

const facilityIcons = {
  escola: '🏫',
  ubs: '🏥',
  praca: '🌳',
  cemiterio: '⚱️',
  mercado: '🏪',
  terminal: '🚌',
  esporte: '⚽',
  biblioteca: '📚',
  cultura: '🎭'
};

const MapView = () => {

  return (
    <Card className="glass neon-border group hover:shadow-neon transition-all duration-500 animate-fade-in-up relative overflow-hidden h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-accent opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10 flex-shrink-0">
        <CardTitle className="text-lg font-bold glow-text flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Mapa de Equipamentos Públicos
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 p-6 flex-1 flex flex-col">
        {/* Mock Map */}
        <div className="relative flex-1 min-h-96 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-border/20 overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="hsl(var(--border))" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"/>
            </svg>
          </div>
          
          {/* Mock roads/streets */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <line x1="20%" y1="0" x2="20%" y2="100%" stroke="hsl(var(--muted-foreground))" strokeWidth="2" opacity="0.3"/>
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="hsl(var(--muted-foreground))" strokeWidth="3" opacity="0.4"/>
              <line x1="80%" y1="0" x2="80%" y2="100%" stroke="hsl(var(--muted-foreground))" strokeWidth="2" opacity="0.3"/>
              <line x1="0" y1="25%" x2="100%" y2="25%" stroke="hsl(var(--muted-foreground))" strokeWidth="2" opacity="0.3"/>
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="hsl(var(--muted-foreground))" strokeWidth="4" opacity="0.5"/>
              <line x1="0" y1="75%" x2="100%" y2="75%" stroke="hsl(var(--muted-foreground))" strokeWidth="2" opacity="0.3"/>
            </svg>
          </div>
          
          {/* Mock facility markers - Better distributed */}
          {publicFacilities.map((facility, index) => {
            const positions = [
              { left: 15, top: 20 }, { left: 35, top: 15 }, { left: 25, top: 40 },
              { left: 55, top: 25 }, { left: 45, top: 45 }, { left: 65, top: 35 },
              { left: 75, top: 20 }, { left: 85, top: 45 }, { left: 70, top: 60 },
              { left: 40, top: 70 }, { left: 20, top: 65 }, { left: 60, top: 75 },
              { left: 30, top: 80 }, { left: 80, top: 70 }, { left: 50, top: 85 }
            ];
            
            const position = positions[index] || { left: 50, top: 50 };
            
            return (
              <div
                key={facility.id}
                className="absolute group cursor-pointer"
                style={{
                  left: `${position.left}%`,
                  top: `${position.top}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Marker */}
                <div
                  className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-sm font-bold text-white hover:scale-125 transition-all duration-300 shadow-lg relative z-10"
                  style={{
                    backgroundColor: facilityColors[facility.type as keyof typeof facilityColors]
                  }}
                >
                  {facilityIcons[facility.type as keyof typeof facilityIcons]}
                </div>
                
                {/* Pulse animation */}
                <div 
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{
                    backgroundColor: facilityColors[facility.type as keyof typeof facilityColors]
                  }}
                />
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                  <div className="glass p-2 rounded-lg border border-primary/20 shadow-neon whitespace-nowrap text-xs">
                    <div className="font-semibold text-foreground">{facility.name}</div>
                    <div className="text-muted-foreground">{facility.cost}</div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Center indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full animate-pulse border-2 border-background shadow-lg" />
        </div>

        {/* Facility Legend */}
        <div className="mt-6 space-y-3 flex-shrink-0">
          <div className="text-sm font-semibold text-foreground mb-3">Legendas dos Equipamentos:</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(facilityColors).map(([type, color]) => (
              <Badge 
                key={type} 
                variant="outline" 
                className="text-xs capitalize border-border/50 justify-start p-2"
              >
                <span className="text-sm mr-2">
                  {facilityIcons[type as keyof typeof facilityIcons]}
                </span>
                <div 
                  className="w-2 h-2 rounded-full mr-2" 
                  style={{ backgroundColor: color }}
                />
                {type}
              </Badge>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/20 rounded-lg border border-border/30">
            <div className="font-medium mb-1">📍 Visualização Interativa de Equipamentos Públicos</div>
            Mapa simulado com {publicFacilities.length} equipamentos distribuídos pela cidade. 
            Passe o mouse sobre os marcadores para ver detalhes dos custos de cada equipamento.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;