import multer from 'multer';
// import path from 'path';
// import fs from 'fs'

// Function to ensure a directory exists, creating it if necessary
// const ensureDirectoryExists = (directoryPath: string) => {
//   if (!fs.existsSync(directoryPath)) {
//     fs.mkdirSync(directoryPath, { recursive: true }); // Use recursive option to create nested folders if needed
//   }
// };

const storage = multer.memoryStorage(); // Use memory storage to handle file data as a buffer


const upload = multer({ storage: storage });

export const configureGalleryMulter = upload.fields([
  { name: 'gallery', maxCount: 30 },
]);
