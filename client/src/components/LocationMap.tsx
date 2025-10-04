import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Delhi": { lat: 28.7041, lng: 77.1025 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Lucknow": { lat: 26.8467, lng: 80.9462 },
  "Surat": { lat: 21.1702, lng: 72.8311 },
  "Kanpur": { lat: 26.4499, lng: 80.3319 },
  "Nagpur": { lat: 21.1458, lng: 79.0882 },
  "Indore": { lat: 22.7196, lng: 75.8577 },
  "Bhopal": { lat: 23.2599, lng: 77.4126 },
  "Visakhapatnam": { lat: 17.6868, lng: 83.2185 },
  "Patna": { lat: 25.5941, lng: 85.1376 },
  "Vadodara": { lat: 22.3072, lng: 73.1812 },
  "Ghaziabad": { lat: 28.6692, lng: 77.4538 },
  "Ludhiana": { lat: 30.9010, lng: 75.8573 }
};

interface LocationMapProps {
  onLocationSelect?: (city: string, lat: number, lng: number) => void;
  selectedCity?: string;
  height?: string;
}

function LocationMarker({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected location</Popup>
    </Marker>
  );
}

export default function LocationMap({ onLocationSelect, selectedCity, height = "400px" }: LocationMapProps) {
  const [cities, setCities] = useState<Array<{ city: string; state: string; pincode: string }>>([]);

  useEffect(() => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Failed to fetch cities:", err));
  }, []);

  const handleCityClick = (city: string, lat: number, lng: number) => {
    if (onLocationSelect) {
      onLocationSelect(city, lat, lng);
    }
  };

  const defaultCenter: [number, number] = selectedCity && CITY_COORDINATES[selectedCity]
    ? [CITY_COORDINATES[selectedCity].lat, CITY_COORDINATES[selectedCity].lng]
    : [20.5937, 78.9629];

  return (
    <div className="rounded-lg overflow-hidden border" style={{ height }} data-testid="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={selectedCity ? 11 : 5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {cities.map((city) => {
          const coords = CITY_COORDINATES[city.city];
          if (!coords) return null;
          
          return (
            <Marker
              key={city.pincode}
              position={[coords.lat, coords.lng]}
              eventHandlers={{
                click: () => handleCityClick(city.city, coords.lat, coords.lng),
              }}
            >
              <Popup>
                <div className="text-center">
                  <div className="font-semibold">{city.city}</div>
                  <div className="text-sm text-muted-foreground">{city.state}</div>
                  <div className="text-xs">PIN: {city.pincode}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {!selectedCity && <LocationMarker onLocationSelect={(lat, lng) => {
          console.log("Location clicked:", lat, lng);
        }} />}
      </MapContainer>
    </div>
  );
}
