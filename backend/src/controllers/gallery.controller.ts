import { NextFunction, Request, Response } from 'express'
import { renameFiles, resizeAndSaveImages } from '../helpers/prediction.helper'
import Gallery from '../models/Gallery.model'
import { createError } from '../utils/createError'

type FilesObject = {
	[fieldname: string]: Express.Multer.File[]
}

export const getGalleries = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const result = await Gallery.aggregate([
			{
				$match: {
					isDeleted: false,
					images: { $exists: true, $not: { $size: 0 } }, // Ensure 'images' field exists and is not empty
				},
			},
			{
				$project: {
					// Define the fields to include in the output
					_id: 1,
					size: { $size: '$images' }, // Calculate the size of the images array
					image: { $arrayElemAt: ['$images', 0] }, // Get the first element of the images array
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

export const getVideoGalleries = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const result = await Gallery.find({
			isDeleted: false,
			video: { $ne: undefined },
		})
			.select('_id video createdAt')
			.exec()

		return res.status(200).json({
			status: 'ok',
			data: result,
		})
	} catch (error) {
		next(error)
	}
}

export const postGallery = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const files: FilesObject = req.files as FilesObject
		const id = req.body.userId as string

		// Rename files
		const imgNames = renameFiles(files, 'gallery')

		// Create gallery and save in DB
		const gallery = new Gallery({ createdBy: id, images: imgNames })
		await gallery.save()

		// Resize and save images
		await resizeAndSaveImages(files, imgNames, 'gallery')

		return res.status(201).json({
			status: 'ok',
			data: gallery.toObject(),
			message: 'New gallery is created.',
		})
	} catch (error) {
		next(error)
	}
}

export const postGalleryVideos = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const files: FilesObject = req.files as FilesObject
		const id = req.body.userId as string

		// Rename files
		const fileNames = renameFiles(files, 'gallery')

		const galleryDocuments = fileNames.map((name) => ({
			createdBy: id,
			video: name,
		}))

		const result = await Gallery.insertMany(galleryDocuments)

		// Resize and save images
		await resizeAndSaveImages(files, fileNames, 'video')

		return res.status(201).json({
			status: 'ok',
			data: result,
			message: 'New galleries are created.',
		})
	} catch (error) {
		next(error)
	}
}

export const deleteGallery = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const galleryId = req.params.galleryId as string

		if (!galleryId) {
			return next(createError('galleryId is not provided', 400))
		}

		const result = await Gallery.findByIdAndUpdate(galleryId, {
			$set: { isDeleted: true },
		})

		if (!result) {
			return next(createError('gallery not found', 404))
		}

		return res.status(200).json({
			status: 'ok',
			message: 'gallery deleted successfully.',
		})
	} catch (error) {
		next(error)
	}
}

export const getGallery = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const galleryId = req.params.galleryId as string

		const result = await Gallery.findOne({
			_id: galleryId,
			isDeleted: false,
		}).select('_id images')

		if (!result) {
			return next(createError('gallery not found', 404))
		}

		return res.status(200).json({
			status: 'ok',
			data: result.toObject(),
		})
	} catch (error) {
		next(error)
	}
}

export const putGallery = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const files: FilesObject = req.files as FilesObject
		const galleryId = req.body.galleryId as string

		// Rename files
		const imageNames = renameFiles(files, 'gallery')
		// update gallery and save in DB
		const result = await Gallery.findOneAndUpdate(
			{ _id: galleryId, isDeleted: false },
			{ $push: { images: { $each: imageNames } } },
			{ new: true } // This option ensures you get the updated document
		)

		if (!result) {
			return next(createError('gallery not found', 404))
		}

		// Resize and save images
		await resizeAndSaveImages(files, imageNames, 'gallery')

		return res.status(201).json({
			status: 'ok',
			data: result.toObject(),
			message: 'New gallery is created.',
		})
	} catch (error) {
		next(error)
	}
}

export const deleteGalleryImg = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		type RequestParams = {
			galleryId: string
			imageName: string
		}
		const { galleryId, imageName } = req.params as RequestParams

		if (!imageName || !galleryId) {
			return next(
				createError('galleryImgName or galleryId is not provided', 400)
			)
		}

		const result = await Gallery.findOneAndUpdate(
			{ _id: galleryId, isDeleted: false },
			{ $pull: { images: imageName } },
			{ new: true }
		)

		// Check if a document was matched and modified
		if (!result) {
			return next(createError('GalleryId is incorrect', 404))
		}

		// Check if the images array is empty and set isDeleted to true if so
		if (result.images.length === 0) {
			await Gallery.findByIdAndUpdate(galleryId, { isDeleted: true })
		}

		return res.status(200).json({
			status: 'ok',
			data: result.toObject(),
			message: 'galleryImg deleted successfully.',
		})
	} catch (error) {
		next(error)
	}
}
