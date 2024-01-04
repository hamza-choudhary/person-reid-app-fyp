// import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.model'
import { createError } from '../utils/createError'

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
		}
		const { name, email, password, phone, role }: RequestBody = req.body

		new User({ name, email, password, phone, role })

		res.status(201).json({ message: 'user created' })
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

		const user = await User.findOne({ email: email })

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

		const token = jwt.sign({ id: user._id }, process.env.JWT_KEY as string, {
			expiresIn: '60d',
		})

		const { ...info } = user.toObject()

		res
			.cookie('access_token', token, { httpOnly: true })
			.status(200)
			.json({ data: info })
	} catch (error) {
		next(error)
	}
}

export async function logout(req: Request, res: Response) {
	res
		.clearCookie('access_token', { sameSite: 'none', secure: true })
		.status(200)
		.json({ data: 'logged out successfully' })
}

export async function updateProfile(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { id, name, password, phone } = req.body

		if (!name && !password && !phone) {
			return next(createError('At least one field is mandatory', 400))
		}

		const updatedUser = await User.findOneAndUpdate(
			{ _id: id, isDeleted: { $ne: true } },
			{ name, password, phone },
			{ new: true, runValidators: true }
		).select('-password')

		if (!updatedUser) {
			return next(createError('User not found', 404))
		}

		res.status(200).json({ data: updatedUser })
	} catch (error) {
		next(error)
	}
}
