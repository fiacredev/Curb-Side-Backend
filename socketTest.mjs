import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected');

  socket.emit('driver:location', {
    driverId: '6995a1441287438bcc1b863d',
    lat: 12.34,
    lng: 56.77,
  });
});

socket.on('driver:update', (data) => {
  console.log('Broadcast received:', data);
});
