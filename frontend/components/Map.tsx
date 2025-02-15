import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';

interface Stop {
    stopNumber: string;
    name: string;
    latitude: number;
    longitude: number;
    adopted?: boolean;
}

export default function Map() {
    const [stops, setStops] = useState<Stop[]>([]);

    useEffect(() => {
        fetch('http://localhost:5002/api/stops')
            .then(res => res.json())
            .then((data: Stop[]) => setStops(data));
    }, []);

    return (
        <MapContainer center={[49.2827, -123.1207]} zoom={12} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {stops.map(stop => (
                <Marker key={stop.stopNumber} position={[stop.latitude, stop.longitude]}>
                    <Popup>
                        <h3>{stop.name}</h3>
                        <p>{stop.adopted ? "Adopted!" : "Available for adoption"}</p>
                        <button className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                            onClick={() => fetch(`/api/stops/${stop.stopNumber}/adopt`, { method: 'POST' })}>
                            Adopt Stop
                        </button>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
