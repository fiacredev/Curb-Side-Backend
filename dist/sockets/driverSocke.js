import * as driverService from '../services/driverService.js';
export const registerDriverSockets = (io) => {
    io.on('connection', (socket) => {
        console.log('client connected:', socket.id);
        socket.on('driver:location', async (payload) => {
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
            }
            catch (err) {
                console.error(`error processing driver location for ${driverId}:`, err);
            }
        });
        socket.on('disconnect', () => {
            console.log('client disconnected:', socket.id);
        });
    });
};
