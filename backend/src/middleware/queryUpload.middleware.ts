import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'

export const clearUploads = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const uploadPath = path.join(__dirname, '../uploads')
	fs.readdirSync(uploadPath).forEach((file) => {
		fs.unlinkSync(path.join(uploadPath, file))
	})
	next()
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadPath = path.join(__dirname, '../uploads')
		cb(null, uploadPath)
	},
	filename: function (req, file, cb) {
		let fileName
		//set file name for query
		if (file.fieldname === 'query') {
			fileName = 'query.jpg'
		} else {
			fileName = 'gallery-' + Date.now().toLocaleString() + '.jpg'
		}
		cb(null, fileName)
	},
})
const upload = multer({ storage: storage })
//? Middleware
export const queryUpload = upload.fields([
	{ name: 'query', maxCount: 1 },
	{ name: 'gallery', maxCount: 5 },
])
