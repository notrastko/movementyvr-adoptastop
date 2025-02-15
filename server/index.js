const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/stops', async (req, res) => {
    const stops = await prisma.stop.findMany();
    res.json(stops);
});

app.post('/api/stops/:id/adopt', async (req, res) => {
    const { id } = req.params;
    await prisma.stop.update({
        where: { id: parseInt(id) },
        data: { adopted: true }
    });
    res.json({ message: "Stop adopted" });
});

app.listen(5001, () => console.log("Server running on port 5000"));