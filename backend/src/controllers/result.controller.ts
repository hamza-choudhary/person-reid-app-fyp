import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import Result from '../models/Result.model'
import { createError } from '../utils/createError'

export const getResults = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const result = await Result.aggregate([
			{ $match: { isDeleted: false } },
			{
				$lookup: {
					from: 'queries',
					localField: 'queryId',
					foreignField: '_id',
					as: 'queryData',
				},
			},
			{
				$unwind: {
					path: '$queryData',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: 1,
					queryId: '$queryData._id',
					name: '$queryData.name',
					queryImage: '$queryData.image',
					resultImage: { $arrayElemAt: ['$images', 0] },
					size: { $size: '$images' },
					createdAt: 1,
				},
			},
		])

		return res.status(200).json({
			status: 'ok',
			data: result,
		})
	} catch (error) {
		next(error)
	}
}

export const getResult = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const resultId = req.params.resultId as string
		const id = new mongoose.Types.ObjectId(resultId)
		const result = await Result.aggregate([
			{ $match: { _id: id, isDeleted: false } },
			{
				$lookup: {
					from: 'queries', // Make sure this is the correct collection name
					localField: 'queryId',
					foreignField: '_id',
					as: 'queryData',
				},
			},
			{
				$unwind: {
					path: '$queryData',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					_id: 1,
					queryId: '$queryData._id',
					name: '$queryData.name',
					description: '$queryData.description',
					queryImage: '$queryData.image',
					resultImages: '$images',
					createdAt: 1,
				},
			},
		])

		return res.status(200).json({
			status: 'ok',
			data: result[0],
		})
	} catch (error) {
		next(error)
	}
}

export const deleteResults = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const resultId = req.params.resultId as string

		if (!resultId) {
			return next(createError('resultId is not provided', 400))
		}

		const result = await Result.findByIdAndUpdate(resultId, {
			$set: { isDeleted: true },
		})

		if (!result) {
			return next(createError('result not found', 404))
		}

		return res.status(200).json({
			status: 'ok',
			message: 'result deleted successfully.',
		})
	} catch (error) {
		next(error)
	}
}
