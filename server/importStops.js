const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Load JSON file
const rawData = fs.readFileSync('TSPR_OpenData_Archive.json'); // Update path if needed
const jsonData = JSON.parse(rawData);

// Extract, deduplicate, and insert bus stops
async function importStops() {
    try {
        // 🚨 Delete all existing stops before importing new ones
        await prisma.stop.deleteMany();
        console.log("✅ Existing bus stops deleted.");

        const busStops = jsonData.layers.flatMap(layer =>
            layer.features.map(feature => ({
                stopNumber: feature.attributes.Stop_Number.toString(), // Convert to string to avoid mismatch
                name: feature.attributes.Stop_Name,
                latitude: feature.attributes.Stop_Latitude,
                longitude: feature.attributes.Stop_Longitude
            }))
        );

        // 🚨 Remove duplicate stopNumbers
        const uniqueBusStops = Array.from(new Map(busStops.map(stop => [stop.stopNumber, stop])).values());

        console.log(`🚀 Importing ${uniqueBusStops.length} unique bus stops...`);

        // Insert stops into PostgreSQL using Prisma
        await prisma.stop.createMany({ data: uniqueBusStops });

        console.log('✅ Bus stops imported successfully!');
    } catch (error) {
        console.error('❌ Error importing bus stops:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importStops();