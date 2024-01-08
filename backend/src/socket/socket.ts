// socket.ts
import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

let io: SocketIOServer

export const initSocket = (server: HTTPServer) => {
	io = new SocketIOServer(server, {
		cors: {
			origin: '*', // or specify origins you want to allow
			methods: ['GET', 'POST'],
		},
	})

	io.on('connection', (socket) => {
		console.log('New client connected')

		socket.on('disconnect', () => {
			console.log('Client disconnected')
		})
	})

	return io
}

export const getIo = () => {
	if (!io) {
		throw new Error('Socket.io not initialized!')
	}
	return io
}
