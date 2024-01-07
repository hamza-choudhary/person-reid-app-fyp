import { NextFunction, Request, Response } from 'express'
import { renameFiles, resizeAndSaveImages } from '../helpers/prediction.helper'
import Query from '../models/Query.model'
import { createError } from '../utils/createError'

type FilesObject = {
	[fieldname: string]: Express.Multer.File[]
}

export const getQueries = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const result = await Query.find({ isDeleted: false }).select(
			'-createdAt -isDeleted -results -updatedAt -createdBy'
		)

		return res.status(200).json({
			status: 'ok',
			data: result,
		})
	} catch (error) {
		next(error)
	}
}

export const postQuery = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const files: FilesObject = req.files as FilesObject
		type RequestBody = {
			name: string
			userId: string
			description?: string
		}
		const { name, description, userId }: RequestBody = req.body

		// Rename files
		const imageName = renameFiles(files, 'query')

		// Create query and save in DB
		const query = new Query({
			name,
			description,
			image: imageName[0],
			createdBy: userId,
		})
		await query.save()

		// Resize and save images
		await resizeAndSaveImages(files, imageName, 'query')

		return res.status(201).json({
			status: 'ok',
			data: query.toObject(),
			message: 'New query is created.',
		})
	} catch (error) {
		next(error)
	}
}

export const deleteQuery = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const queryId = req.params.queryId as string

		if (!queryId) {
			return next(createError('queryId is not provided', 400))
		}

		const result = await Query.findByIdAndUpdate(queryId, {
			$set: { isDeleted: true },
		})

		if (!result) {
			return next(createError('query not found', 404))
		}

		return res.status(201).json({
			status: 'ok',
			message: 'query deleted successfully.',
		})
	} catch (error) {
		next(error)
	}
}
