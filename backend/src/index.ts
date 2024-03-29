import cors from 'cors'
import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import http from 'http'
import path from 'path'
import { authRoutes } from './routes/auth.routes'
import { galleryRoutes } from './routes/gallery.routes'
import { queryRoutes } from './routes/query.routes'
import { resultRoutes } from './routes/results.routes'
import { initSocket } from './socket/socket' // Import the Socket.IO module
import './utils/database'

const app = express()
const httpServer = new http.Server(app)
// Initialize Socket.IO
initSocket(httpServer)

app.use(cors())

// app.use(cors())
app.use(express.json()) // Replace bodyParser with express.json()

// Custom error type
class CustomError extends Error {
	status?: number
}

// Static file routes
const uploadsPath = path.join(__dirname, 'uploads')
app.use('/uploads/query', express.static(path.join(uploadsPath, 'query')))
app.use('/uploads/gallery', express.static(path.join(uploadsPath, 'gallery')))
app.use('/uploads/results', express.static(path.join(uploadsPath, 'results')))

// Security headers
app.use((req, res, next) => {
	res.setHeader(
		'Content-Security-Policy',
		"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
	)
	next()
})

// API routes
app.use('/api', galleryRoutes, queryRoutes, resultRoutes)
app.use('/auth', authRoutes)

// Error handling middleware
app.use(
	(error: CustomError, req: Request, res: Response, next: NextFunction) => {
		const status = error.status || 500
		const message = error.message || 'Server internal error'
		res.status(status).json({ status: 'error', message })
	}
)

const PORT = process.env.PORT || 8080
httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
