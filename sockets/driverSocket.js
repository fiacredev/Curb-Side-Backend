import * as driverService from '../services/driverService.js'

export const registerDriverSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('⚡ Client connected:', socket.id);

    socket.on('driver:location', async (payload) => {
      try {
        const { driverId, lat, lng } = payload;

        const driver = await driverService.updateLocationRealtime(
          driverId,
          lat,
          lng
        );

        // broadcast to all listeners
        io.emit('driver:update', {
          driverId,
          lat,
          lng,
        });

        console.log('Location updated:', driverId);
      } catch (err) {
        console.error('Socket error:', err.message);
      }
    });

    socket.on('disconnect', () =>
      console.log('Client disconnected:', socket.id)
    );
  });
};
