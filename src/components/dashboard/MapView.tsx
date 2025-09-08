import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Settings } from "lucide-react";
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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-46.6333, -23.5505], // São Paulo coordinates
        zoom: 12,
        pitch: 45,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.on('style.load', () => {
        // Add facilities to map
        publicFacilities.forEach(facility => {
          // Create custom marker element
          const markerElement = document.createElement('div');
          markerElement.className = 'facility-marker';
          markerElement.style.cssText = `
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: ${facilityColors[facility.type as keyof typeof facilityColors]};
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
          `;
          markerElement.textContent = facility.type[0].toUpperCase();

          // Create popup
          const popup = new mapboxgl.Popup({ 
            offset: 25,
            className: 'facility-popup'
          }).setHTML(`
            <div class="p-3">
              <h4 class="font-semibold text-foreground">${facility.name}</h4>
              <p class="text-sm text-muted-foreground capitalize">${facility.type}</p>
              <p class="text-sm font-medium text-primary">${facility.cost}</p>
            </div>
          `);

          // Add marker to map
          new mapboxgl.Marker(markerElement)
            .setLngLat([facility.lng, facility.lat])
            .setPopup(popup)
            .addTo(map.current!);

          // Add click handler
          markerElement.addEventListener('click', () => {
            setSelectedFacility(facility);
          });
        });

        setIsMapReady(true);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <Card className="glass neon-border group hover:shadow-neon transition-all duration-500 animate-fade-in-up relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-accent opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="text-lg font-bold glow-text flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Mapa de Equipamentos Públicos
        </CardTitle>
        
        {!isMapReady && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Cole seu Mapbox Public Token aqui..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="bg-card/50 border-border/50 backdrop-blur-sm"
              />
              <Button 
                onClick={initializeMap}
                disabled={!mapboxToken}
                className="bg-gradient-primary hover:bg-gradient-primary/90"
              >
                <Settings className="h-4 w-4 mr-2" />
                Carregar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Para usar o mapa, obtenha seu token público em{' '}
              <a 
                href="https://mapbox.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
              . Recomendamos conectar ao Supabase para gerenciar tokens de forma segura.
            </p>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="relative z-10 p-0">
        <div className="relative h-96">
          <div ref={mapContainer} className="absolute inset-0 rounded-b-lg overflow-hidden" />
          
          {!isMapReady && mapboxToken && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-b-lg">
              <div className="text-center space-y-2">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-muted-foreground">Carregando mapa...</p>
              </div>
            </div>
          )}
        </div>

        {/* Facility Legend */}
        {isMapReady && (
          <div className="p-4 border-t border-border/50">
            <div className="flex flex-wrap gap-2">
              {Object.entries(facilityColors).map(([type, color]) => (
                <Badge 
                  key={type} 
                  variant="outline" 
                  className="text-xs capitalize"
                  style={{ borderColor: color, color }}
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-1" 
                    style={{ backgroundColor: color }}
                  />
                  {type}
                </Badge>
              ))}
            </div>
            
            {selectedFacility && (
              <div className="mt-3 p-3 rounded-lg bg-muted/20 border border-border/50">
                <h4 className="font-semibold text-sm">{selectedFacility.name}</h4>
                <p className="text-xs text-muted-foreground capitalize">{selectedFacility.type}</p>
                <p className="text-xs font-medium text-primary">{selectedFacility.cost}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapView;