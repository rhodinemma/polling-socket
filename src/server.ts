require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
import { createAdapter } from '@socket.io/redis-adapter';
import app from './app';
import constants from './constants';

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
    },
})

io.on('connection', (socket: any) => {
    const { UPDATE_ROOM } = constants.SOCKET_EVENTS;
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on(UPDATE_ROOM, (data: any) => {
        socket.leaveAll(); // Removes the user from all rooms because a user can only be in one room at a time.
        socket.join(data.pollId); // pollId is the room name
    });
})

server.listen(app.get('port'), () => {
    console.log(`Listening on ${app.get('port')}`);
});