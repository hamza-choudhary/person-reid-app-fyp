import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

type AuthRequest = Request & {
	userId?: string
}

// Assuming you have a secret key for JWT
const SECRET_KEY = process.env.JWT_KEY || 'your-secret-key'

export default function verifyToken(
	req: AuthRequest,
	res: Response,
	next: NextFunction
) {
	const token = req.headers.authorization?.split(' ')[1] // Bearer Token
	if (!token) {
		return res
			.status(403)
			.json({ message: 'A token is required for authentication' })
	}

	try {
		// Verifying the token
		const decoded = jwt.verify(token, SECRET_KEY)

		// Assuming the token includes the user's ID
		req.userId = (decoded as jwt.JwtPayload)._id // Adjust according to your token payload structure

		next()
	} catch (error) {
		return res.status(401).json({ message: 'Invalid Token' })
	}
}
