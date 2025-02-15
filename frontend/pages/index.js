import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map.tsx'), { ssr: false });

export default function Home() {
    return (
        <div className="h-screen w-full">
            <Map />
        </div>
    );
}