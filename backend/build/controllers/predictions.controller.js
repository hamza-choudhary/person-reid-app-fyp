"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPredictionResults = exports.postPredictionQuery = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const util_1 = require("util");
const postPredictionQuery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //! FIXME: write a code which can read path from req.files so renameFiles convertFiles and resizeFiles dont have to read sperattly files by fs.read file function
    //! put all these functions into helpers or services folder
    const files = req.files;
    const gallery = files.gallery;
    const query = files.query;
    const uploadDirectory = query[0].destination;
    const renameFiles = (images, fileName = "gallery") => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const oldPath = img.path;
            const fileExtension = ".jpg";
            if (fileName === "query") {
                img.filename = `${fileName}${fileExtension}`;
            }
            else {
                img.filename = `${fileName}-${i + 1}${fileExtension}`;
            }
            const newPath = path_1.default.join(uploadDirectory, img.filename);
            console.log(uploadDirectory);
            yield fs_1.default.promises.rename(oldPath, newPath);
            if (fileName === "query") {
                img.filename = `${fileName}${fileExtension}`;
            }
            else {
                img.filename = `${fileName}-${i + 1}${fileExtension}`;
            }
            img.path = newPath;
        }
    });
    const resizeAllImages = () => __awaiter(void 0, void 0, void 0, function* () {
        const files = yield fs_1.default.promises.readdir(uploadDirectory);
        for (const file of files) {
            if (file.endsWith(".jpg")) {
                const imagePath = path_1.default.join(uploadDirectory, file);
                let resizeWidth = 1920;
                let resizeHeight = 1080;
                if (file.startsWith("query")) {
                    // If the file starts with "query", resize it to 600x600
                    resizeWidth = 467;
                    resizeHeight = 944;
                }
                const resizedImagePath = imagePath.replace(".jpg", "-resized.jpg");
                yield (0, sharp_1.default)(imagePath)
                    .resize(resizeWidth, resizeHeight)
                    .toFile(resizedImagePath); // Save the resized image to a temporary file
                // Replace the original file with the resized one
                yield fs_1.default.promises.rename(resizedImagePath, imagePath);
            }
        }
    });
    const convertAllToWebP = () => __awaiter(void 0, void 0, void 0, function* () {
        // const uploadDirectory = path.join(__dirname, 'uploads')
        const files = yield fs_1.default.promises.readdir(uploadDirectory);
        // Convert sharp's toFile to a promise-based function
        (0, util_1.promisify)((0, sharp_1.default)().toFile);
        for (const file of files) {
            if (file.endsWith(".jpg")) {
                const imagePath = path_1.default.join(uploadDirectory, file);
                const webPPath = imagePath.replace(".jpg", ".webp");
                yield (0, sharp_1.default)(imagePath).toFormat("webp").toFile(webPPath);
            }
        }
    });
    const getImagePaths = (directoryPath) => __awaiter(void 0, void 0, void 0, function* () {
        const imagePaths = {
            query: [],
            gallery: [],
            result: [],
        };
        const files = yield fs_1.default.promises.readdir(directoryPath);
        for (const file of files) {
            // const filePath = path.join(directoryPath, file)
            const serverPath = "http://localhost:8080/uploads/";
            console.log(file);
            if (file === "query.jpg") {
                imagePaths.query.push(serverPath + file);
            }
            else if (file.startsWith("gallery-") && file.endsWith(".jpg")) {
                imagePaths.gallery.push(serverPath + file);
            }
            else if (file.startsWith("result-") && file.endsWith(".jpg")) {
                imagePaths.result.push(serverPath + file);
            }
        }
        return imagePaths;
    });
    try {
        //renaming files
        yield renameFiles(gallery);
        yield renameFiles(query, "query");
        yield resizeAllImages();
        const scriptPath = path_1.default.resolve(__dirname, "../seqnet");
        const pythonProcess = (0, child_process_1.spawn)("python", [
            `${scriptPath}\\demo.py`,
            "--cfg",
            "exp_cuhk/config.yaml",
            "--ckpt",
            "exp_cuhk/epoch_19.pth",
        ], { cwd: scriptPath });
        pythonProcess.stdout.on("data", (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`${data}`);
            const imgPaths = yield getImagePaths(uploadDirectory);
            console.log(imgPaths);
            res.json({
                message: "Images uploaded and converted to WebP successfully",
                data: imgPaths,
            });
        }));
        //dont throw error here it also stats when there are warnings
        pythonProcess.stderr.on("data", (data) => {
            console.log(`${data}`);
            //   throw new Error(data);
        });
        pythonProcess.on("close", (code) => {
            if (code !== 0) {
                throw new Error(`something wrong with python script code end wth ${code}`);
            }
        });
        // await convertAllToWebP()
    }
    catch (error) {
        next(error);
    }
});
exports.postPredictionQuery = postPredictionQuery;
//make predictions use python
//convert images into webp
//send response {query[filepath], gallery[filepath, filepath], results[filepath, filepath]}
const getPredictionResults = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getPredictionResults = getPredictionResults;
