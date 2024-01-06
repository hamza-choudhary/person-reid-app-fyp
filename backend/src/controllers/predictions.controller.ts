import { spawn } from 'child_process'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import sharp from 'sharp'
import { promisify } from 'util'
import { renameFiles, resizeAndSaveImages } from '../helpers/prediction.helper'
import Gallery from '../models/Gallery.model'
import Query from '../models/Query.model'
import User from '../models/User.model'
import { createError } from '../utils/createError'

type FilesObject = {
	[fieldname: string]: Express.Multer.File[]
}

// export const postPredictionQuery = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   //! FIXME: write a code which can read path from req.files so renameFiles convertFiles and resizeFiles dont have to read sperattly files by fs.read file function
//   //! put all these functions into helpers or services folder
//   const files: FilesObject = req.files as FilesObject;
//   const gallery = files.gallery;
//   const query = files.query;
//   const uploadDirectory = query[0].destination;

//   const renameFiles = async (
//     images: Express.Multer.File[],
//     fileName = "gallery"
//   ) => {
//     for (let i = 0; i < images.length; i++) {
//       const img = images[i];
//       const oldPath = img.path;

//       const fileExtension = ".jpg";

//       if (fileName === "query") {
//         img.filename = `${fileName}${fileExtension}`;
//       } else {
//         img.filename = `${fileName}-${i + 1}${fileExtension}`;
//       }

//       const newPath = path.join(uploadDirectory, img.filename);
//       console.log(uploadDirectory);
//       await fs.promises.rename(oldPath, newPath);

//       if (fileName === "query") {
//         img.filename = `${fileName}${fileExtension}`;
//       } else {
//         img.filename = `${fileName}-${i + 1}${fileExtension}`;
//       }
//       img.path = newPath;
//     }
//   };

//   const resizeAllImages = async () => {
//     const files = await fs.promises.readdir(uploadDirectory);

//     for (const file of files) {
//       if (file.endsWith(".jpg")) {
//         const imagePath = path.join(uploadDirectory, file);

//         let resizeWidth = 1920;
//         let resizeHeight = 1080;

//         if (file.startsWith("query")) {
//           // If the file starts with "query", resize it to 600x600
//           resizeWidth = 467;
//           resizeHeight = 944;
//         }

//         const resizedImagePath = imagePath.replace(".jpg", "-resized.jpg");

//         await sharp(imagePath)
//           .resize(resizeWidth, resizeHeight)
//           .toFile(resizedImagePath); // Save the resized image to a temporary file

//         // Replace the original file with the resized one
//         await fs.promises.rename(resizedImagePath, imagePath);
//       }
//     }
//   };

//   const convertAllToWebP = async () => {
//     // const uploadDirectory = path.join(__dirname, 'uploads')
//     const files = await fs.promises.readdir(uploadDirectory);

//     // Convert sharp's toFile to a promise-based function
//     promisify(sharp().toFile);

//     for (const file of files) {
//       if (file.endsWith(".jpg")) {
//         const imagePath = path.join(uploadDirectory, file);
//         const webPPath = imagePath.replace(".jpg", ".webp");

//         await sharp(imagePath).toFormat("webp").toFile(webPPath);
//       }
//     }
//   };

//   const getImagePaths = async (
//     directoryPath: string
//   ): Promise<{ query: string[]; gallery: string[]; result: string[] }> => {
//     const imagePaths: { query: string[]; gallery: string[]; result: string[] } =
//       {
//         query: [],
//         gallery: [],
//         result: [],
//       };

//     const files = await fs.promises.readdir(directoryPath);

//     for (const file of files) {
//       // const filePath = path.join(directoryPath, file)
//       const serverPath = "http://localhost:8080/uploads/";

//       console.log(file);
//       if (file === "query.jpg") {
//         imagePaths.query.push(serverPath + file);
//       } else if (file.startsWith("gallery-") && file.endsWith(".jpg")) {
//         imagePaths.gallery.push(serverPath + file);
//       } else if (file.startsWith("result-") && file.endsWith(".jpg")) {
//         imagePaths.result.push(serverPath + file);
//       }
//     }

//     return imagePaths;
//   };

//   try {
//     //renaming files
//     await renameFiles(gallery);
//     await renameFiles(query, "query");

//     await resizeAllImages();

//     const scriptPath = path.resolve(__dirname, "../seqnet");
//     const pythonProcess = spawn("python", [`${scriptPath}\\reid_frame.py`], {
//       cwd: scriptPath,
//     });

//     pythonProcess.stdout.on("data", async (data) => {
//       console.log(`${data}`);

//       const imgPaths = await getImagePaths(uploadDirectory);
//       console.log(imgPaths);
//       res.json({
//         message: "Images uploaded and converted to WebP successfully",
//         data: imgPaths,
//       });
//     });

//     //dont throw error here it also stats when there are warnings
//     pythonProcess.stderr.on("data", (data) => {
//       console.log(`${data}`);
//       //   throw new Error(data);
//     });

//     pythonProcess.on("close", (code) => {
//       if (code !== 0) {
//         throw new Error(
//           `something wrong with python script code end wth ${code}`
//         );
//       }
//     });

//     // await convertAllToWebP()
//   } catch (error) {
//     next(error);
//   }
// };

export const getGalleries = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const result = await Gallery.aggregate([
			{ $match: { isDeleted: false } }, // Filter out documents where isDeleted is false
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
			message: 'New gallery is created.',
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
		type RequestBody = {
			galleryId: string
			galleryImgName: string
		}
		const { galleryId, galleryImgName }: RequestBody = req.body

		if (!galleryImgName || !galleryId) {
			return next(
				createError('galleryImgName or galleryId is not provided', 400)
			)
		}

		const result = await Gallery.findOneAndUpdate(
			{ _id: galleryId, isDeleted: false },
			{ $pull: { images: galleryImgName } },
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

export const deleteGallery = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const galleryId = req.body.galleryId as string

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
		const queryId = req.body.queryId as string

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

//TODO: create prediction where we recieve query id and gallery id then fetch all gallery image and provide them to python to find

// export const postUploadQueryImg = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const files: FilesObject = req.files as FilesObject;
//     const name = req.body.name;
//     await renameAndResize(files, "query", { width: 467, height: 944 }, name);

//     return res
//       .status(200)
//       .json({ message: "Query images uploaded successfully." });
//   } catch (error) {
//     next(error);
//   }
// };

// export const postInference = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const queryImgPath = req.body.query;
//   const resultFolderPath = path.join(__dirname, "../uploads", "results");

//   try {
//     // Check if the 'result' folder exists
//     if (fs.existsSync(resultFolderPath)) {
//       // If the folder exists, remove it
//       await fs.promises.rm(resultFolderPath, { recursive: true });
//     }
//     // Create the 'result' folder (it will also create it if it doesn't exist)
//     await fs.promises.mkdir(resultFolderPath, { recursive: true });

//     const scriptPath = path.resolve(__dirname, "../seqnet");
//     console.log("inference start");
//     const pythonProcess = spawn(
//       "python",
//       [`${scriptPath}\\reid_frame.py`, queryImgPath],
//       {
//         cwd: scriptPath,
//       }
//     );

//     pythonProcess.stdout.on("data", async (data) => {
//       console.log(`${data}`);

//       res.json({
//         message: "inference completed",
//       });
//     });

//     //dont throw error here it also stats when there are warnings
//     pythonProcess.stderr.on("data", (data) => {
//       console.log(`${data}`);
//       //   throw new Error(data);
//     });

//     pythonProcess.on("close", (code) => {
//       if (code !== 0) {
//         throw new Error(
//           `something wrong with python script code end wth ${code}`
//         );
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getUploads = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const folder = req.params.folder; // It must be gallery, query, results

//   try {
//     const directory = path.join(__dirname, `../uploads/${folder}`);
//     fs.readdir(directory, (err, files) => {
//       if (err) {
//         next(err);
//         // Throw err
//       } else {
//         // Filter files with the ".jpg" extension
//         const jpgFiles = files.filter((file) => path.extname(file) === ".jpg");
//         res.status(200).json({ data: jpgFiles });
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };
