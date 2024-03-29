// import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.model'
import { createError } from '../utils/createError'

type AuthRequest = Request & {
	userId?: string
}
export async function getUser(
	req: AuthRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const userId = req.userId

		if (!userId) {
			return res
				.status(400)
				.send({ message: 'User ID not provided in request' })
		}

		const result = await User.findById(userId).select(
			'_id name email role cnic phone'
		)

		if (!result) {
      return res.status(404).send({ message: 'User not found' });
    }

		res.status(200).json({ status: 'ok', data: result })
	} catch (error) {
		next(error)
	}
}

export async function getUsers(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const result = await User.find({
			isDeleted: false,
			role: { $ne: 'admin' },
		}).select('_id name email role cnic phone')

		res.status(200).json({ status: 'ok', data: result })
	} catch (error) {
		next(error)
	}
}

export async function registerUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		type RequestBody = {
			name: string
			email: string
			password: string
			phone: string
			role: string
			cnic: string
		}
		const { name, email, password, phone, role, cnic }: RequestBody = req.body

		const user = new User({ name, email, password, phone, role, cnic })
		const result = await user.save()

		res.status(201).json({
			status: 'ok',
			data: {
				_id: result._id,
				name: result.name,
				email: result.email,
				role: result.role,
				cnic: result.cnic,
			},
		})
	} catch (error) {
		const customError = error as { code?: number }
		if (customError?.code === 11000) {
			return next(createError('email already exists', 409))
		}

		next(error)
	}
}

export async function updateUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		type RequestBody = {
			_id: string
			name: string | null
			password: string | null
			phone: string | null
			role: string | null
			cnic: string | null
		}

		const { _id, name, password, phone, role, cnic }: RequestBody = req.body

		if (!name && !password && !phone && !cnic && !role) {
			return next(createError('At least one field is mandatory', 400))
		}

		const updatedUser = await User.findOneAndUpdate(
			{ _id: _id, isDeleted: false },
			{ name, password, phone, role, cnic },
			{ new: true }
		).select('_id name email phone cnic role')

		if (!updatedUser) {
			return next(createError('User not found', 404))
		}

		res.status(200).json({ status: 'ok', data: updatedUser })
	} catch (error) {
		next(error)
	}
}

export async function updateUserPassword(
	req: Request,
	res: Response,
	next: NextFunction
) {
	type RequestBody = {
		userId: string
		currentPassword: string
		newPassword: string
	}

	try {
		const { userId, currentPassword, newPassword }: RequestBody = req.body
		const user = await User.findOne({ _id: userId }).select(
			'password isDeleted'
		)

		//FIXME: match hashed passwords

		if (!user || user.isDeleted) {
			throw createError('user not found', 404)
		}

		//FIXME: hashed pswds should match
		// const isCorrect = bcrypt.compareSync(req.body.password, user.password)
		const isCorrect = currentPassword === user.password

		if (!isCorrect) {
			throw createError('current password is not correct', 400)
		}

		const result = await User.findOneAndUpdate(
			{
				_id: userId,
			},
			{
				$set: { password: newPassword },
			}
		)

		if (!result) {
			return next(createError('user not found', 404))
		}

		res.status(200).json({ status: 'ok' })
	} catch (error) {
		next(error)
	}
}

export async function deleteUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const userId = req.params.userId as string

		const result = await User.findOneAndUpdate(
			{
				_id: userId,
				role: { $ne: 'admin' },
			},
			{
				$set: { isDeleted: true },
			}
		)

		if (!result) {
			return next(createError('user not found', 404))
		}
		res.status(200).json({ status: 'ok' })
	} catch (error) {
		next(error)
	}
}

export async function login(req: Request, res: Response, next: NextFunction) {
	try {
		type RequestBody = {
			email: string
			password: string
		}
		const { email, password }: RequestBody = req.body

		const user = await User.findOne({ email: email }).select(
			'_id name email password phone cnic role'
		)

		if (!user || user.isDeleted) {
			throw createError('user not found', 404)
		}

		//FIXME: hashed pswds should match
		// const isCorrect = bcrypt.compareSync(req.body.password, user.password)
		const isCorrect = password === user.password

		if (!isCorrect) {
			throw createError('wrong password', 400)
		}

		// Check if the environment variable is defined
		if (!process.env.JWT_KEY) {
			throw new Error('JWT_KEY is not defined')
		}

		const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY as string, {
			expiresIn: '60d',
		})

		const { password: pswd, ...info } = user.toObject()

		res.status(200).json({ status: 'ok', data: info, access_token: token })
	} catch (error) {
		next(error)
	}
}

export async function logout(req: Request, res: Response) {
	res
		.clearCookie('access_token', { sameSite: 'none', secure: true })
		.status(200)
		.json({ status: 'ok', data: 'logged out successfully' })
}
