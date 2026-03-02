import * as driverService from '../services/driverService.js';
export const registerDriverSockets = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        socket.on('driver:location', async (payload) => {
            try {
                const { driverId, lat, lng } = payload;
                // Basic validation
                if (!driverId || lat == null || lng == null) {
                    console.warn('Invalid driver location payload:', payload);
                    return;
                }
                await driverService.updateLocationRealtime(driverId, lat, lng);
                // Broadcast updated location
                io.emit('driver:update', {
                    driverId,
                    lat,
                    lng,
                });
                console.log('Location updated:', driverId);
            }
            catch (err) {
                if (err instanceof Error) {
                    console.error('Socket error:', err.message);
                }
                else {
                    console.error('Socket error:', err);
                }
            }
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
