import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for public facilities - Fewer, more realistic distribution
const publicFacilities = [
  { id: 1, name: "Escola Municipal Central", type: "escola", cost: "R$ 2.5M" },
  { id: 2, name: "UBS Vila Velha", type: "ubs", cost: "R$ 1.8M" },
  { id: 3, name: "Praça da Bandeira", type: "praca", cost: "R$ 800K" },
  { id: 4, name: "Terminal Rodoviário", type: "terminal", cost: "R$ 3.1M" },
  { id: 5, name: "Centro Esportivo Municipal", type: "esporte", cost: "R$ 2.2M" },
  { id: 6, name: "Biblioteca Pública", type: "biblioteca", cost: "R$ 900K" },
  { id: 7, name: "UBS Itaparica", type: "ubs", cost: "R$ 1.7M" },
  { id: 8, name: "Centro Cultural", type: "cultura", cost: "R$ 1.9M" },
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
        {/* Mock Google Maps Style Map */}
        <div className="relative flex-1 min-h-96 bg-[#f5f5f5] dark:bg-[#2d2d2d] rounded-lg border border-border/20 overflow-hidden">
          {/* Map Base Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#e8f5e8] to-[#f0f8f0] dark:from-[#1a2e1a] dark:to-[#243324]"></div>
          
          {/* Roads and Streets - Simplified, more realistic layout */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Main avenue (horizontal) */}
              <line x1="0%" y1="45%" x2="100%" y2="45%" stroke="#ffffff" strokeWidth="6" opacity="0.9"/>
              
              {/* Secondary avenue (vertical) */}
              <line x1="40%" y1="0%" x2="40%" y2="100%" stroke="#ffffff" strokeWidth="6" opacity="0.9"/>
              
              {/* Coastal road */}
              <line x1="0%" y1="80%" x2="100%" y2="75%" stroke="#ffffff" strokeWidth="4" opacity="0.8"/>
              
              {/* Local streets */}
              <line x1="0%" y1="25%" x2="100%" y2="25%" stroke="#ffffff" strokeWidth="3" opacity="0.7"/>
              <line x1="0%" y1="65%" x2="100%" y2="65%" stroke="#ffffff" strokeWidth="3" opacity="0.7"/>
              <line x1="15%" y1="0%" x2="15%" y2="100%" stroke="#ffffff" strokeWidth="3" opacity="0.7"/>
              <line x1="70%" y1="0%" x2="70%" y2="100%" stroke="#ffffff" strokeWidth="3" opacity="0.7"/>
            </svg>
          </div>

          {/* Green Areas (Parks) */}
          <div className="absolute top-[10%] left-[5%] w-[20%] h-[25%] bg-[#b8e6b8] dark:bg-[#2d4a2d] rounded-lg opacity-80 border border-[#90c990] dark:border-[#3e5a3e]"></div>
          <div className="absolute top-[50%] right-[10%] w-[15%] h-[20%] bg-[#b8e6b8] dark:bg-[#2d4a2d] rounded-lg opacity-80 border border-[#90c990] dark:border-[#3e5a3e]"></div>
          
          {/* Water Bodies */}
          <div className="absolute bottom-[20%] left-[30%] w-[40%] h-[8%] bg-[#a8d4f0] dark:bg-[#2a4a5c] rounded-full opacity-90 border border-[#7cb8e0] dark:border-[#3a5a6c]"></div>
          
          {/* Building Blocks */}
          <div className="absolute top-[20%] left-[30%] w-[8%] h-[6%] bg-[#e0e0e0] dark:bg-[#4a4a4a] border border-[#d0d0d0] dark:border-[#5a5a5a] opacity-80"></div>
          <div className="absolute top-[40%] left-[70%] w-[6%] h-[8%] bg-[#e0e0e0] dark:bg-[#4a4a4a] border border-[#d0d0d0] dark:border-[#5a5a5a] opacity-80"></div>
          <div className="absolute top-[60%] left-[15%] w-[10%] h-[5%] bg-[#e0e0e0] dark:bg-[#4a4a4a] border border-[#d0d0d0] dark:border-[#5a5a5a] opacity-80"></div>
          <div className="absolute top-[75%] right-[25%] w-[7%] h-[10%] bg-[#e0e0e0] dark:bg-[#4a4a4a] border border-[#d0d0d0] dark:border-[#5a5a5a] opacity-80"></div>

          {/* Facility markers - Fewer, more strategic positions */}
          {publicFacilities.map((facility, index) => {
            const positions = [
              { left: 20, top: 30 }, { left: 35, top: 25 }, { left: 50, top: 40 },
              { left: 60, top: 50 }, { left: 45, top: 70 }, { left: 25, top: 60 },
              { left: 75, top: 35 }, { left: 80, top: 65 }
            ];
            
            const position = positions[index] || { left: 50, top: 50 };
            
            return (
              <div
                key={facility.id}
                className="absolute group cursor-pointer z-20"
                style={{
                  left: `${position.left}%`,
                  top: `${position.top}%`,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                {/* Google Maps style pin */}
                <div className="relative">
                  {/* Pin shadow */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black/20 rounded-full blur-sm"></div>
                  
                  {/* Pin body */}
                  <div 
                    className="w-8 h-10 rounded-t-full border-2 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg relative transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: facilityColors[facility.type as keyof typeof facilityColors],
                      clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
                    }}
                  >
                    {/* Pin top circle */}
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center absolute top-1"
                      style={{
                        backgroundColor: facilityColors[facility.type as keyof typeof facilityColors]
                      }}
                    >
                      <span className="text-xs">
                        {facilityIcons[facility.type as keyof typeof facilityIcons]}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30">
                  <div className="glass p-3 rounded-lg border border-primary/20 shadow-xl whitespace-nowrap text-xs bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      <span>{facilityIcons[facility.type as keyof typeof facilityIcons]}</span>
                      {facility.name}
                    </div>
                    <div className="text-muted-foreground mt-1">💰 {facility.cost}</div>
                    <div className="text-xs text-primary mt-1 capitalize">📍 {facility.type}</div>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/95 dark:border-t-gray-900/95"></div>
                </div>
              </div>
            );
          })}

          {/* Google Maps style controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {/* Zoom controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border/20 overflow-hidden">
              <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-border/20 text-gray-600 dark:text-gray-300 font-bold">
                +
              </button>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 font-bold">
                −
              </button>
            </div>
            
            {/* Map type button */}
            <button className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border/20 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="w-6 h-6 bg-gradient-to-br from-green-200 to-blue-200 dark:from-green-800 dark:to-blue-800 rounded border"></div>
            </button>
          </div>

          {/* Street View control */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border/20 p-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                👤
              </div>
            </div>
          </div>

          {/* Scale indicator */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-600 dark:text-gray-300 border border-border/20">
              500 m
            </div>
          </div>
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
            Mapa simulado com {publicFacilities.length} equipamentos estratégicos distribuídos pela cidade. 
            Passe o mouse sobre os marcadores para ver detalhes dos custos de cada equipamento.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;