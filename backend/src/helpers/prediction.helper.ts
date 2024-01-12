import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

type FilesObject = {
  [fieldname: string]: Express.Multer.File[]
}

export function renameFiles(files: FilesObject, imgType: string) {
  if (!files[imgType] || files[imgType].length === 0) {
    throw new Error(`No ${imgType} image files uploaded.`)
  }

  return files[imgType].map(() => `${uuidv4()}.jpg`)
}

export function renameVideoFiles(
  files: FilesObject,
  videoType: string
): string[] {
  if (!files[videoType] || files[videoType].length === 0) {
    throw new Error(`No ${videoType} video files uploaded.`)
  }

  return files[videoType].map((file) => {
    const extension = path.extname(file.originalname) || '.mp4' // Default to .mp4 if no extension found
    return `${uuidv4()}${extension}`
  })
}

async function resizeImage(
  file: Express.Multer.File,
  newPath: string,
  minWidth: number,
  minHeight: number,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<void> {
  const image = sharp(file.buffer)
  const metadata = await image.metadata()

  if (!metadata.width || !metadata.height) {
    throw new Error('Invalid image dimensions')
  }

  let newWidth = Math.max(metadata.width, minWidth)
  let newHeight = Math.max(metadata.height, minHeight)

  // Calculate the aspect ratio
  const aspectRatio = newWidth / newHeight

  // Adjust dimensions to meet minimum and maximum requirements
  if (newWidth > maxWidth || newHeight > maxHeight) {
    if (aspectRatio >= 1) {
      // Width is the dominant dimension
      newWidth = Math.min(newWidth, maxWidth)
      newHeight = Math.round(newWidth / aspectRatio)
      if (newHeight < minHeight) {
        newHeight = minHeight
        newWidth = Math.round(newHeight * aspectRatio)
      }
    } else {
      // Height is the dominant dimension
      newHeight = Math.min(newHeight, maxHeight)
      newWidth = Math.round(newHeight * aspectRatio)
      if (newWidth < minWidth) {
        newWidth = minWidth
        newHeight = Math.round(newWidth / aspectRatio)
      }
    }
  }

  // Resize the image
  await image.resize(newWidth, newHeight, { fit: 'fill' }).toFile(newPath)
}

async function processGallery(files: FilesObject, newFileNames: string[]) {
  const uploadPath = path.join(__dirname, '../uploads/gallery')
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath)
  }

  for (let i = 0; i < files['gallery'].length; i++) {
    const file = files['gallery'][i]
    const newFileName = newFileNames[i]
    const newPath = path.join(uploadPath, newFileName)
    await resizeImage(file, newPath, 900, 1500)
  }
}

async function processVideos(files: FilesObject, newFileNames: string[]) {
  const uploadPath = path.join(__dirname, '../uploads/gallery')

  await fs.promises.mkdir(uploadPath, { recursive: true })

  for (let i = 0; i < files['gallery'].length; i++) {
    const file = files['gallery'][i]
    const newFileName = newFileNames[i]
    const newPath = path.join(uploadPath, newFileName)

    if (file.buffer) {
      // For in-memory storage, write the buffer to a new file
      await fs.promises.writeFile(newPath, file.buffer)
    } else if (file.path) {
      // For disk storage, rename/move the file
      await fs.promises.rename(file.path, newPath)
    } else {
      throw new Error('File path and buffer are both undefined')
    }
  }
}

async function processQuery(files: FilesObject, newFileNames: string[]) {
  const uploadPath = path.join(__dirname, '../uploads/query')
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath)
  }

  for (let i = 0; i < files['query'].length; i++) {
    const file = files['query'][i]
    const newFileName = newFileNames[i]
    const newPath = path.join(uploadPath, newFileName)
    await resizeImage(file, newPath, 467, 944)
  }
}

export async function resizeAndSaveImages(
  files: FilesObject,
  newFileNames: string[],
  imgType: string
) {
  if (imgType === 'gallery') {
    await processGallery(files, newFileNames)
  } else if (imgType === 'query') {
    await processQuery(files, newFileNames)
  } else if (imgType === 'video') {
    await processVideos(files, newFileNames)
  } else {
    throw new Error(`Invalid image type: ${imgType}`)
  }
}
