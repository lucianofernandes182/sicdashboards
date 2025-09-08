import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for public facilities
const publicFacilities = [
  { id: 1, name: "Escola Municipal João Silva", type: "escola", lat: -23.5505, lng: -46.6333, cost: "R$ 2.5M" },
  { id: 2, name: "UBS Centro", type: "ubs", lat: -23.5489, lng: -46.6388, cost: "R$ 1.8M" },
  { id: 3, name: "Praça da Liberdade", type: "praca", lat: -23.5558, lng: -46.6396, cost: "R$ 800K" },
  { id: 4, name: "Cemitério Municipal", type: "cemiterio", lat: -23.5465, lng: -46.6365, cost: "R$ 600K" },
  { id: 5, name: "Mercado Municipal", type: "mercado", lat: -23.5520, lng: -46.6320, cost: "R$ 1.2M" },
  { id: 6, name: "Terminal Rodoviário", type: "terminal", lat: -23.5475, lng: -46.6410, cost: "R$ 3.1M" }
];

const facilityColors = {
  escola: '#8B5CF6', // Purple
  ubs: '#10B981', // Green
  praca: '#F59E0B', // Yellow
  cemiterio: '#6B7280', // Gray
  mercado: '#EF4444', // Red
  terminal: '#3B82F6' // Blue
};

const MapView = () => {

  return (
    <Card className="glass neon-border group hover:shadow-neon transition-all duration-500 animate-fade-in-up relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-accent opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="text-lg font-bold glow-text flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Mapa de Equipamentos Públicos
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 p-6">
        {/* Mock Map */}
        <div className="relative h-80 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-border/20 overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"/>
            </svg>
          </div>
          
          {/* Mock facility markers */}
          {publicFacilities.map((facility, index) => (
            <div
              key={facility.id}
              className="absolute w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:scale-110 transition-transform shadow-lg"
              style={{
                backgroundColor: facilityColors[facility.type as keyof typeof facilityColors],
                left: `${20 + (index % 3) * 25}%`,
                top: `${20 + Math.floor(index / 3) * 30}%`,
              }}
              title={`${facility.name} - ${facility.cost}`}
            >
              {facility.type[0].toUpperCase()}
            </div>
          ))}
          
          {/* Center indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
        </div>

        {/* Facility Legend */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {Object.entries(facilityColors).map(([type, color]) => (
              <Badge 
                key={type} 
                variant="outline" 
                className="text-xs capitalize border-border/50"
              >
                <div 
                  className="w-2 h-2 rounded-full mr-1" 
                  style={{ backgroundColor: color }}
                />
                {type}
              </Badge>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground">
            Mock de visualização dos equipamentos públicos e seus respectivos custos
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;