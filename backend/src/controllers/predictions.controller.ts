import { spawn } from 'child_process'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import sharp from 'sharp'
import { promisify } from 'util'
import { renameAndResize } from '../helpers/prediction.helper'

type FilesObject = {
	[fieldname: string]: Express.Multer.File[]
}

export const postPredictionQuery = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	//! FIXME: write a code which can read path from req.files so renameFiles convertFiles and resizeFiles dont have to read sperattly files by fs.read file function
	//! put all these functions into helpers or services folder
	const files: FilesObject = req.files as FilesObject
	const gallery = files.gallery
	const query = files.query
	const uploadDirectory = query[0].destination

	const renameFiles = async (
		images: Express.Multer.File[],
		fileName = 'gallery'
	) => {
		for (let i = 0; i < images.length; i++) {
			const img = images[i]
			const oldPath = img.path

			const fileExtension = '.jpg'

			if (fileName === 'query') {
				img.filename = `${fileName}${fileExtension}`
			} else {
				img.filename = `${fileName}-${i + 1}${fileExtension}`
			}

			const newPath = path.join(uploadDirectory, img.filename)
			console.log(uploadDirectory)
			await fs.promises.rename(oldPath, newPath)

			if (fileName === 'query') {
				img.filename = `${fileName}${fileExtension}`
			} else {
				img.filename = `${fileName}-${i + 1}${fileExtension}`
			}
			img.path = newPath
		}
	}

	const resizeAllImages = async () => {
		const files = await fs.promises.readdir(uploadDirectory)

		for (const file of files) {
			if (file.endsWith('.jpg')) {
				const imagePath = path.join(uploadDirectory, file)

				let resizeWidth = 1920
				let resizeHeight = 1080

				if (file.startsWith('query')) {
					// If the file starts with "query", resize it to 600x600
					resizeWidth = 467
					resizeHeight = 944
				}

				const resizedImagePath = imagePath.replace('.jpg', '-resized.jpg')

				await sharp(imagePath)
					.resize(resizeWidth, resizeHeight)
					.toFile(resizedImagePath) // Save the resized image to a temporary file

				// Replace the original file with the resized one
				await fs.promises.rename(resizedImagePath, imagePath)
			}
		}
	}

	const convertAllToWebP = async () => {
		// const uploadDirectory = path.join(__dirname, 'uploads')
		const files = await fs.promises.readdir(uploadDirectory)

		// Convert sharp's toFile to a promise-based function
		promisify(sharp().toFile)

		for (const file of files) {
			if (file.endsWith('.jpg')) {
				const imagePath = path.join(uploadDirectory, file)
				const webPPath = imagePath.replace('.jpg', '.webp')

				await sharp(imagePath).toFormat('webp').toFile(webPPath)
			}
		}
	}

	const getImagePaths = async (
		directoryPath: string
	): Promise<{ query: string[]; gallery: string[]; result: string[] }> => {
		const imagePaths: { query: string[]; gallery: string[]; result: string[] } =
			{
				query: [],
				gallery: [],
				result: [],
			}

		const files = await fs.promises.readdir(directoryPath)

		for (const file of files) {
			// const filePath = path.join(directoryPath, file)
			const serverPath = 'http://localhost:8080/uploads/'

			console.log(file)
			if (file === 'query.jpg') {
				imagePaths.query.push(serverPath + file)
			} else if (file.startsWith('gallery-') && file.endsWith('.jpg')) {
				imagePaths.gallery.push(serverPath + file)
			} else if (file.startsWith('result-') && file.endsWith('.jpg')) {
				imagePaths.result.push(serverPath + file)
			}
		}

		return imagePaths
	}

	try {
		//renaming files
		await renameFiles(gallery)
		await renameFiles(query, 'query')

		await resizeAllImages()

		const scriptPath = path.resolve(__dirname, '../seqnet')
		const pythonProcess = spawn('python', [`${scriptPath}\\reid_frame.py`], {
			cwd: scriptPath,
		})

		pythonProcess.stdout.on('data', async (data) => {
			console.log(`${data}`)

			const imgPaths = await getImagePaths(uploadDirectory)
			console.log(imgPaths)
			res.json({
				message: 'Images uploaded and converted to WebP successfully',
				data: imgPaths,
			})
		})

		//dont throw error here it also stats when there are warnings
		pythonProcess.stderr.on('data', (data) => {
			console.log(`${data}`)
			//   throw new Error(data);
		})

		pythonProcess.on('close', (code) => {
			if (code !== 0) {
				throw new Error(
					`something wrong with python script code end wth ${code}`
				)
			}
		})

		// await convertAllToWebP()
	} catch (error) {
		next(error)
	}
}

//make predictions use python
//convert images into webp
//send response {query[filepath], gallery[filepath, filepath], results[filepath, filepath]}
export const getPredictionResults = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {}

export const postUploadGalleryImg = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const files: FilesObject = req.files as FilesObject

		await renameAndResize(files, 'gallery', { width: 1920, height: 1080 })

		return res
			.status(200)
			.json({ message: 'Gallery images uploaded successfully.' })
	} catch (error) {
		next(error)
	}
}

export const postUploadQueryImg = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const files: FilesObject = req.files as FilesObject
		const name = req.body.name
		await renameAndResize(files, 'query', { width: 467, height: 944 }, name)

		return res
			.status(200)
			.json({ message: 'Query images uploaded successfully.' })
	} catch (error) {
		next(error)
	}
}

export const postInference = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const queryImgPath = req.body.query
	const resultFolderPath = path.join(__dirname, '../uploads', 'result')

	try {
		// Check if the 'result' folder exists
		if (fs.existsSync(resultFolderPath)) {
			// If the folder exists, remove it
			await fs.promises.rm(resultFolderPath, { recursive: true })
		}
		// Create the 'result' folder (it will also create it if it doesn't exist)
		await fs.promises.mkdir(resultFolderPath, { recursive: true })

		const scriptPath = path.resolve(__dirname, '../seqnet')
		console.log('inference start')
		const pythonProcess = spawn(
			'python',
			[`${scriptPath}\\reid_frame.py`, queryImgPath],
			{
				cwd: scriptPath,
			}
		)

		pythonProcess.stdout.on('data', async (data) => {
			console.log(`${data}`)

			res.json({
				message: 'inference completed',
			})
		})

		//dont throw error here it also stats when there are warnings
		pythonProcess.stderr.on('data', (data) => {
			console.log(`${data}`)
			//   throw new Error(data);
		})

		pythonProcess.on('close', (code) => {
			if (code !== 0) {
				throw new Error(
					`something wrong with python script code end wth ${code}`
				)
			}
		})
	} catch (error) {
		next(error)
	}
}

export const getUploads = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const folder = req.params.folder //! it must be gallery, query, results
	try {
		const directory = path.join(__dirname, `../uploads/${folder}`)
		fs.readdir(directory, (err, files) => {
			if (err) {
				next(err)
			} else {
				res.status(200).json({ data: files })
			}
		})
	} catch (error) {
		next(error)
	}
}
