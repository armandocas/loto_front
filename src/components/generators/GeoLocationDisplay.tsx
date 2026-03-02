"use client";

import { useState, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getGeoFallback } from "@/lib/generators/geo-energy";

interface GeoLocationDisplayProps {
  coords: { lat: number; lng: number } | undefined;
  onChange: (coords: { lat: number; lng: number }) => void;
}

export function GeoLocationDisplay({ coords, onChange }: Readonly<GeoLocationDisplayProps>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada");
      onChange(getGeoFallback());
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setError("Permissão negada - usando localização aproximada");
        onChange(getGeoFallback());
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, [onChange]);

  return (
    <div className="space-y-3">
      {!coords ? (
        <div className="p-4 rounded-xl border border-white/10 bg-background/30 text-center space-y-3">
          <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Permita o acesso à sua localização para gerar números baseados no seu ponto geográfico
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={requestLocation}
            disabled={loading}
            className="border-cyan-500/30"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="mr-2 h-4 w-4" />
            )}
            {loading ? "Obtendo localização..." : "Permitir Localização"}
          </Button>
          {error && (
            <p className="text-[10px] text-yellow-400">{error}</p>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">Localização obtida</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[10px]">
              Lat: {coords.lat.toFixed(4)}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              Lng: {coords.lng.toFixed(4)}
            </Badge>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Cada ponto do planeta gera um campo numérico único
          </p>
        </div>
      )}
    </div>
  );
}
