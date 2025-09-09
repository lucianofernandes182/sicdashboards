import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mock data for public facilities based on the image
const publicFacilities = [
  { id: 1, name: "Hospital São Francisco", type: "hospital", cost: "R$ 4.5M", coords: [-47.8108, -21.1775] },
  { id: 2, name: "Shopping Santa Úrsula", type: "shopping", cost: "R$ 2.8M", coords: [-47.8095, -21.1760] },
  { id: 3, name: "Praça 7 de Setembro", type: "praca", cost: "R$ 800K", coords: [-47.8090, -21.1750] },
  { id: 4, name: "Escola Municipal Central", type: "escola", cost: "R$ 2.5M", coords: [-47.8120, -21.1780] },
  { id: 5, name: "UBS Vila Dionísio", type: "ubs", cost: "R$ 1.8M", coords: [-47.8130, -21.1800] },
  { id: 6, name: "Terminal Rodoviário", type: "terminal", cost: "R$ 3.1M", coords: [-47.8085, -21.1785] },
  { id: 7, name: "Centro Cultural", type: "cultura", cost: "R$ 1.9M", coords: [-47.8100, -21.1770] },
  { id: 8, name: "Biblioteca Municipal", type: "biblioteca", cost: "R$ 900K", coords: [-47.8115, -21.1765] }
];

const facilityColors = {
  hospital: '#dc2626',
  shopping: '#7c3aed', 
  praca: '#059669',
  escola: '#0284c7',
  ubs: '#ea580c',
  terminal: '#0891b2',
  cultura: '#b91c1c',
  biblioteca: '#7c2d12'
};

const facilityIcons = {
  hospital: '🏥',
  shopping: '🛍️',
  praca: '🌳',
  escola: '🏫',
  ubs: '⚕️',
  terminal: '🚌',
  cultura: '🎭',
  biblioteca: '📚'
};

const MapView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  useEffect(() => {
    // Check if we have a token stored or if user needs to input one
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
      initializeMap(storedToken);
    } else {
      setShowTokenInput(true);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-47.8108, -21.1775], // Center around Vila Velha/Ribeirão area
        zoom: 15,
        pitch: 0,
        bearing: 0
      });

      map.current.on('load', () => {
        // Add markers for each facility
        publicFacilities.forEach((facility) => {
          const markerColor = facilityColors[facility.type as keyof typeof facilityColors];
          
          // Create a custom marker element
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker';
          markerElement.style.cssText = `
            background-color: ${markerColor};
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          `;

          const iconElement = document.createElement('div');
          iconElement.innerHTML = facilityIcons[facility.type as keyof typeof facilityIcons];
          iconElement.style.cssText = `
            transform: rotate(45deg);
            font-size: 12px;
          `;
          markerElement.appendChild(iconElement);

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${facilityIcons[facility.type as keyof typeof facilityIcons]} ${facility.name}</h3>
              <p class="text-xs text-gray-600 mt-1">💰 ${facility.cost}</p>
              <p class="text-xs text-blue-600 capitalize">📍 ${facility.type}</p>
            </div>
          `);

          // Add marker to map
          new mapboxgl.Marker(markerElement)
            .setLngLat(facility.coords as [number, number])
            .setPopup(popup)
            .addTo(map.current!);
        });

        // Add navigation controls
        map.current!.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add scale control
        map.current!.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

        // Add fullscreen control
        map.current!.addControl(new mapboxgl.FullscreenControl(), 'top-right');
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setShowTokenInput(true);
    }
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setShowTokenInput(false);
      initializeMap(mapboxToken);
    }
  };

  return (
    <Card className="glass neon-border group hover:shadow-neon transition-all duration-500 animate-fade-in-up relative overflow-hidden h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-accent opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10 flex-shrink-0">
        <CardTitle className="text-lg font-bold glow-text flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Mapa de Equipamentos Públicos - Vila Velha
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 p-6 flex-1 flex flex-col">
        {showTokenInput ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-md mx-auto space-y-4 text-center">
              <div className="p-4 rounded-full bg-gradient-primary w-16 h-16 flex items-center justify-center mx-auto">
                <MapPin className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Configure o Mapa Interativo</h3>
              <p className="text-muted-foreground text-sm">
                Para usar o mapa interativo do Mapbox, insira seu token público:
              </p>
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja..."
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  className="text-sm"
                />
                <Button 
                  onClick={handleTokenSubmit}
                  className="w-full bg-gradient-primary"
                  disabled={!mapboxToken.trim()}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Ativar Mapa Interativo
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Obtenha seu token gratuito em{' '}
                <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  mapbox.com
                </a>
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Interactive Mapbox Map */}
            <div 
              ref={mapContainer} 
              className="flex-1 min-h-96 rounded-lg border border-border/20 overflow-hidden"
              style={{ minHeight: '400px' }}
            />

            {/* Facility Legend */}
            <div className="mt-6 space-y-3 flex-shrink-0">
              <div className="text-sm font-semibold text-foreground mb-3">Legendas dos Equipamentos:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
                <div className="font-medium mb-1">🗺️ Mapa Interativo de Vila Velha</div>
                Mapa real com {publicFacilities.length} equipamentos públicos georreferenciados. 
                Clique nos marcadores para ver detalhes dos custos de cada equipamento.
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MapView;