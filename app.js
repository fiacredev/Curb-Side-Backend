import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import http from "http";
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';


import { registerDriverSockets } from './sockets/driverSocket.js';
import driverRoutes from './routes/driverRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';


dotenv.config();

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());

// api end points about drivers and deleiveries
app.use('/drivers', driverRoutes);
app.use('/deliveries', deliveryRoutes);

const server = http.createServer(app);
const io = new Server(server,{
  cors: {origin:'*'}
})

registerDriverSockets(io);

// api home page endpoint message
app.get('/', (_, res) => res.send('API running'));

const PORT = 3000;


server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`, mongoose.connection.name)
);
