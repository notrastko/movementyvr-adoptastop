import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/stops', async (req: Request, res: Response) => {
    const stops = await prisma.stop.findMany();
    res.json(stops);
});

app.post('/api/stops/:id/adopt', async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.stop.update({
        where: { id: parseInt(id) },
        data: { adopted: true }
    });
    res.json({ message: "Stop adopted" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
