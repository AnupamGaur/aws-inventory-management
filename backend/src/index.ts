import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { itemRouter } from './routes/item';
import 'dotenv/config'
const client = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());

app.use('/api/v1/item', itemRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
