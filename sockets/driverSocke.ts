import * as driverService from '../services/driverService.js';

interface DriverLocationPayload {
  driverId: string;
  lat: number;
  lng: number;
}

export const registerDriverSockets = (io: any) => {
  io.on('connection', (socket: any) => {
    console.log('client connected:', socket.id);

    socket.on('driver:location', async (payload: DriverLocationPayload) => {
      const { driverId, lat, lng } = payload;

      if (!driverId || lat == null || lng == null) {
        console.warn('Invalid driver location payload:', payload);
        return;
      }

      try {
        const driver = await driverService.updateLocationRealtime(driverId, lat, lng);

        if (!driver) {
          console.error(`location NOT updated for driver ${driverId}`);
          return;
        }

        io.emit('driver:update', { driverId, lat, lng });
        console.log(`location updated for driver ${driverId}`);
      } catch (err) {
        console.error(`error processing driver location for ${driverId}:`, err);
      }
    });

    socket.on('disconnect', () => {
      console.log('client disconnected:', socket.id);
    });
  });
};