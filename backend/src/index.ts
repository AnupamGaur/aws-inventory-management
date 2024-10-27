import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { itemRouter } from './routes/item';
import 'dotenv/config'
const client = new PrismaClient();
const app = express();


app.use(express.json());
app.use(cors());

app.use('/api/v1/item', itemRouter);

const port = Number(process.env.PORT) || 3002
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
