import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const rawData = fs.readFileSync('../TSPR_OpenData_Archive.json', 'utf-8');
const jsonData = JSON.parse(rawData);

interface Stop {
    stopNumber: string;
    name: string;
    latitude: number;
    longitude: number;
}

async function importStops() {
    try {
        await prisma.stop.deleteMany();
        console.log("✅ Existing bus stops deleted.");

        const busStops: Stop[] = jsonData.layers.flatMap((layer: any) =>
            layer.features.map((feature: any) => ({
                stopNumber: feature.attributes.Stop_Number.toString(),
                name: feature.attributes.Stop_Name,
                latitude: feature.attributes.Stop_Latitude,
                longitude: feature.attributes.Stop_Longitude
            }))
        );

        const uniqueBusStops = Array.from(new Map(busStops.map(stop => [stop.stopNumber, stop])).values());

        console.log(`🚀 Importing ${uniqueBusStops.length} unique bus stops...`);

        await prisma.stop.createMany({ data: uniqueBusStops });

        console.log('✅ Bus stops imported successfully!');
    } catch (error) {
        console.error('❌ Error importing bus stops:', error);
    } finally {
        await prisma.();
    }
}

importStops();
