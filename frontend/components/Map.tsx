import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

interface Stop {
    stopNumber: string;
    name: string;
    latitude: number;
    longitude: number;
    adopted?: boolean;
}

function ClusterMarkers({ stops }: { stops: Stop[] }) {
    const map = useMap();

    useEffect(() => {
        if (!map || stops.length === 0) return;

        // Clear existing layers
        map.eachLayer(layer => {
            if (layer instanceof L.MarkerClusterGroup) {
                map.removeLayer(layer);
            }
        });

        // Create a marker cluster group
        const markers = L.markerClusterGroup();

        stops.forEach(stop => {
            const marker = L.marker([stop.latitude, stop.longitude])
                .bindPopup(`<h3>${stop.name}</h3><p>${stop.adopted ? "Adopted!" : "Available for adoption"}</p>`);
            markers.addLayer(marker);
        });

        map.addLayer(markers);
    }, [stops, map]);

    return null;
}

export default function Map() {
    const [stops, setStops] = useState<Stop[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/stops')
            .then(res => res.json())
            .then((data: Stop[]) => setStops(data));
    }, []);

    return (
        <div className="w-screen h-screen">
            <MapContainer
                center={[49.2827, -123.1207]}
                zoom={12}
                className="h-full w-full"
                style={{ height: "100vh", width: "100vw" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ClusterMarkers stops={stops} />
            </MapContainer>
        </div>
    );
}
