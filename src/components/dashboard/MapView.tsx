import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

// Mock data for public facilities in Vila Velha
const publicFacilities = [
  { id: 1, name: "Hospital São Francisco", type: "hospital", cost: "R$ 4.5M", position: { lat: -20.3308, lng: -40.3008 } },
  { id: 2, name: "Shopping Vila Velha", type: "shopping", cost: "R$ 2.8M", position: { lat: -20.3289, lng: -40.2925 } },
  { id: 3, name: "Praça da Bandeira", type: "praca", cost: "R$ 800K", position: { lat: -20.3295, lng: -40.2958 } },
  { id: 4, name: "Escola Municipal Central", type: "escola", cost: "R$ 2.5M", position: { lat: -20.3315, lng: -40.2995 } },
  { id: 5, name: "UBS Glória", type: "ubs", cost: "R$ 1.8M", position: { lat: -20.3278, lng: -40.2985 } },
  { id: 6, name: "Terminal Rodoviário", type: "terminal", cost: "R$ 3.1M", position: { lat: -20.3325, lng: -40.2945 } },
  { id: 7, name: "Centro Cultural", type: "cultura", cost: "R$ 1.9M", position: { lat: -20.3302, lng: -40.2972 } },
  { id: 8, name: "Biblioteca Municipal", type: "biblioteca", cost: "R$ 900K", position: { lat: -20.3288, lng: -40.2978 } }
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
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMapsKey, setGoogleMapsKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    // Check if we have a key stored
    const storedKey = localStorage.getItem('google_maps_key');
    if (storedKey) {
      setGoogleMapsKey(storedKey);
      loadGoogleMaps(storedKey);
    } else {
      setShowKeyInput(true);
    }
  }, []);

  const loadGoogleMaps = (apiKey: string) => {
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    window.initMap = initializeMap;
    
    script.onerror = () => {
      console.error('Erro ao carregar Google Maps');
      setShowKeyInput(true);
    };
    
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || mapInitialized) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: -20.3295, lng: -40.2958 }, // Vila Velha, ES
      zoom: 15,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    });

    // Add markers for each facility
    publicFacilities.forEach((facility) => {
      const marker = new window.google.maps.Marker({
        position: facility.position,
        map: map,
        title: facility.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 0C6.7 0 0 6.7 0 15c0 8.3 15 25 15 25s15-16.7 15-25c0-8.3-6.7-15-15-15z" 
                    fill="${facilityColors[facility.type as keyof typeof facilityColors]}" 
                    stroke="white" 
                    stroke-width="2"/>
              <circle cx="15" cy="15" r="8" fill="white"/>
              <text x="15" y="20" font-family="Arial" font-size="14" text-anchor="middle" fill="${facilityColors[facility.type as keyof typeof facilityColors]}">
                ${facilityIcons[facility.type as keyof typeof facilityIcons]}
              </text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(30, 40),
          anchor: new window.google.maps.Point(15, 40)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #333; font-size: 14px;">
              ${facilityIcons[facility.type as keyof typeof facilityIcons]} ${facility.name}
            </h3>
            <p style="margin: 4px 0; color: #666; font-size: 12px;">💰 ${facility.cost}</p>
            <p style="margin: 4px 0; color: #0284c7; font-size: 12px; text-transform: capitalize;">📍 ${facility.type}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });

    setMapInitialized(true);
  };

  const handleKeySubmit = () => {
    if (googleMapsKey.trim()) {
      localStorage.setItem('google_maps_key', googleMapsKey);
      setShowKeyInput(false);
      loadGoogleMaps(googleMapsKey);
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
        {showKeyInput ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-md mx-auto space-y-4 text-center">
              <div className="p-4 rounded-full bg-gradient-primary w-16 h-16 flex items-center justify-center mx-auto">
                <MapPin className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Configure o Google Maps</h3>
              <p className="text-muted-foreground text-sm">
                Para exibir o mapa do Google Maps, insira sua API key:
              </p>
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={googleMapsKey}
                  onChange={(e) => setGoogleMapsKey(e.target.value)}
                  className="text-sm"
                />
                <Button 
                  onClick={handleKeySubmit}
                  className="w-full bg-gradient-primary"
                  disabled={!googleMapsKey.trim()}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Ativar Google Maps
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Obtenha sua API key em{' '}
                <a 
                  href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline"
                >
                  Google Cloud Console
                </a>
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Google Maps Container */}
            <div 
              ref={mapRef}
              className="flex-1 min-h-96 rounded-lg border border-border/20 overflow-hidden bg-gray-100"
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
                <div className="font-medium mb-1">🗺️ Google Maps - Vila Velha, ES</div>
                Mapa interativo com {publicFacilities.length} equipamentos públicos da região central de Vila Velha. 
                Clique nos marcadores para ver detalhes dos custos.
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MapView;