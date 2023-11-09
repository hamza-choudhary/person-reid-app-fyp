import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

type FilesObject = {
	[fieldname: string]: Express.Multer.File[]
}

export async function renameAndResize(
	files: FilesObject,
	imgType: string,
	dimensions: { width: number; height: number },
	personName: string | undefined = undefined
) {
	if (!files[imgType]) {
		throw new Error(`No ${imgType} images uploaded.`)
	}

	const uploadPath = path.join(__dirname, `../uploads/${imgType}`)
	if (!fs.existsSync(uploadPath)) {
		fs.mkdirSync(uploadPath)
	}

	// Calculate the next image number based on existing files
	const existingFiles = fs
		.readdirSync(uploadPath)
		.filter((file) => file.startsWith(`${imgType}-`))
	let nextNumber =
		existingFiles.reduce((max, fileName) => {
			const parts = fileName.split('-')
			let numberPart = parts[1] // fileName.replace(`${imgType}-`, '').replace('.jpg', '')
			if (imgType == 'query') {
				numberPart = parts[2]
			}
			const number = parseInt(numberPart, 10)
			return number > max ? number : max
		}, 0) + 1

	for (const file of files[imgType]) {
		const image = sharp(file.buffer)
		const resizedImage = await image
			.resize(dimensions.width, dimensions.height, { fit: 'fill' })
			.toBuffer()

		let newFileName = `${imgType}-${nextNumber}.jpg`
		if (imgType === 'query' && personName) {
			newFileName = `${imgType}-${personName}-${nextNumber}.jpg`
		}
		const newPath = path.join(uploadPath, newFileName)

		await fs.promises.writeFile(newPath, resizedImage) // Save the resized image directly

		nextNumber++
	}
}
