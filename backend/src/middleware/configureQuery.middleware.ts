import multer from 'multer';
// import path from 'path';
// import fs from 'fs'

// Function to ensure a directory exists, creating it if necessary
// const ensureDirectoryExists = (directoryPath: string) => {
//   if (!fs.existsSync(directoryPath)) {
//     fs.mkdirSync(directoryPath, { recursive: true }); // Use recursive option to create nested folders if needed
//   }
// };

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export const configureQueryMulter = upload.fields([
  { name: 'query', maxCount: 10 },
]);
