import cors from 'cors'
import 'dotenv/config'
import express, {
	ErrorRequestHandler,
	NextFunction,
	Request,
	Response,
} from 'express'
import path from 'path'
import { predictionRoutes } from './routes/predictions.routes'

const app = express()
app.use(cors())

type CustomError = Error & {
	status?: number
	messages?: string
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use((req, res, next) => {
	res.setHeader(
		'Content-Security-Policy',
		"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
	)
	next()
})

app.use('/prediction', predictionRoutes)

//? Express Error Middleware
app.use(
	(
		error: CustomError,
		req: Request,
		res: Response,
		next: NextFunction
	): void => {
		console.log('in express error middleware', error, 'in the end')
		const status = error.status || 500
		const message = error.message || 'server internal error'

		res.status(status).json({ status: 'error', message: message })
	}
)

app.listen(process.env.PORT, () =>
	console.log(`server is running on port ${process.env.PORT}`)
)
