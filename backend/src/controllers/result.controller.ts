import { spawn } from 'child_process'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import Gallery from '../models/Gallery.model'
import Query from '../models/Query.model'
import Result from '../models/Result.model'
import { getIo } from '../socket/socket'
import { createError } from '../utils/createError'

export async function getResults(
	req: Request,
	res: Response,
	next: NextFunction
) {
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

export async function getResult(
	req: Request,
	res: Response,
	next: NextFunction
) {
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

export async function deleteResults(
	req: Request,
	res: Response,
	next: NextFunction
) {
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

export async function postImageResults(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { galleryId, queryId } = req.body as {
			galleryId: string
			queryId: string
		}

		if (!galleryId || !queryId) {
			return next(createError('Gallery or Query ID is missing', 400))
		}

		const gallery = await Gallery.findOne({ _id: galleryId, isDeleted: false })
			.select('images')
			.exec()

		const query = await Query.findOne({ _id: queryId, isDeleted: false })
			.select('name image')
			.exec()

		if (!gallery) {
			return next(createError('Gallery not found', 404))
		}

		if (!query) {
			return next(createError('Query not found', 404))
		}

		const result = {
			name: query.name,
			queryImage: query.image,
			galleryImages: gallery.images,
		}

		const resultImages: string[] = []

		const scriptPath = path.resolve(__dirname, '../seqnet')
		const pythonProcess = spawn(
			'python',
			[path.join(scriptPath, 'reid_frame.py')],
			{
				cwd: scriptPath,
			}
		)

		const io = getIo()

		// Send data to Python script via stdin
		pythonProcess.stdin.write(JSON.stringify(result))
		pythonProcess.stdin.end()

		pythonProcess.stdout.on('data', (data: Buffer) => {
			const imageName = data.toString().trim()
			console.log(imageName)
			if (imageName.endsWith('.jpg') && imageName.startsWith('result')) {
				resultImages.push(imageName)

				io.emit('newImage', imageName)

				//TODO: also send image to frontend and close the socket when python stop executing
			}
		})

		//dont throw error here it also stats when there are warnings
		pythonProcess.stderr.on('data', (data) => {
			console.log(`${data}`)
			//   throw new Error(data);
		})

		pythonProcess.on('close', async (code) => {
			console.log(`python script exited with code ${code}`)
			if (code === 0) {
				try {
					if (resultImages.length > 0) {
						//FIXME:
						console.log(`data is sent to db ${resultImages}`)
						const result = new Result({
							queryId,
							galleryId,
							images: resultImages,
						})
						await result.save()
					}
					res.status(200).json({ status: 'ok', data: resultImages })
				} catch (error) {
					next(error)
				}
			} else {
				next(createError('Error in Python script execution', 500))
			}
		})

		pythonProcess.on('error', (error) => {
			next(error)
		})
	} catch (error) {
		next(error)
	}
}

export async function postVideoResults(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { galleryId, queryId } = req.body as {
			galleryId: string
			queryId: string
		}

		if (!galleryId || !queryId) {
			return next(createError('Gallery or Query ID is missing', 400))
		}

		const gallery = await Gallery.findOne({ _id: galleryId, isDeleted: false })
			.select('video')
			.exec()

		const query = await Query.findOne({ _id: queryId, isDeleted: false })
			.select('name image')
			.exec()

		if (!gallery) {
			return next(createError('Gallery not found', 404))
		}

		if (!query) {
			return next(createError('Query not found', 404))
		}

		const result = {
			name: query.name,
			queryImage: query.image,
			galleryVideo: gallery.video,
		}

		let videoName: string

		const scriptPath = path.resolve(__dirname, '../seqnet')
		const pythonProcess = spawn(
			'python',
			[path.join(scriptPath, 'reid_video.py')],
			{
				cwd: scriptPath,
			}
		)

		const io = getIo()

		// Send data to Python script via stdin
		pythonProcess.stdin.write(JSON.stringify(result))
		pythonProcess.stdin.end()

		pythonProcess.stdout.on('data', (data: Buffer) => {
			const message = data.toString()
			if (message.startsWith('FRAME_DATA:')) {
				//? if output is frames send them to frontend
				const frameData = message.replace('FRAME_DATA:', '')
				io.emit('frame', frameData)
			} else if (message.startsWith('OUTPUT_VIDEO_PATH:')) {
				//? means video is generated rename it
				const videoPath = message.replace('OUTPUT_VIDEO_PATH:', '')

				const newFileName = uuidv4() + path.extname(videoPath)
				videoName = newFileName

				const directory = path.dirname(videoPath)
				const newPath = path.join(directory, newFileName)

				// Rename the file
				fs.renameSync(videoPath, newPath)
			} else {
				console.log(message)
			}
		})

		//dont throw error here it also stats when there are warnings
		pythonProcess.stderr.on('data', (data) => {
			console.log(`${data}`)
			//   throw new Error(data);
		})

		pythonProcess.on('close', async (code) => {
			console.log(`python script exited with code ${code}`)
			if (code === 0) {
				try {
					if (videoName) {
						//FIXME:
						const result = new Result({
							queryId,
							galleryId,
							video: videoName,
						})
						await result.save()
						console.log(`data is sent to db ${videoName}`)
					}
					res.status(200).json({ status: 'ok', data: videoName })
				} catch (error) {
					next(error)
				}
			} else {
				next(createError('Error in Python script execution', 500))
			}
		})

		pythonProcess.on('error', (error) => {
			next(error)
		})
	} catch (error) {
		next(error)
	}
}