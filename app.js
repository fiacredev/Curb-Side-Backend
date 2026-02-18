import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

import driverRoutes from './routes/driverRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';

dotenv.config();

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());

app.use('/drivers', driverRoutes);
app.use('/deliveries', deliveryRoutes);

app.get('/', (_, res) => res.send('API running'));

const PORT = 3000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
