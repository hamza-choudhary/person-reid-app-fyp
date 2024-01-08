// socket.ts
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export const initSocket = (server) => {
    io = new SocketIOServer(server, {
        // Socket.IO configuration
    });

    io.on('connection', (socket) => {
        console.log('New client connected');
        
        // You can set up all your socket event listeners here
        // For example:
        // socket.on('someEvent', (data) => {
        //     // handle the event
        // });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};

export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
