"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryUpload = exports.clearUploads = void 0;
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const clearUploads = (req, res, next) => {
    const uploadPath = path_1.default.join(__dirname, '../uploads');
    fs_1.default.readdirSync(uploadPath).forEach((file) => {
        fs_1.default.unlinkSync(path_1.default.join(uploadPath, file));
    });
    next();
};
exports.clearUploads = clearUploads;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path_1.default.join(__dirname, '../uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        let fileName;
        //set file name for query
        if (file.fieldname === 'query') {
            fileName = 'query.jpg';
        }
        else {
            fileName = 'gallery-' + Date.now().toLocaleString() + '.jpg';
        }
        cb(null, fileName);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
//? Middleware
exports.queryUpload = upload.fields([
    { name: 'query', maxCount: 1 },
    { name: 'gallery', maxCount: 5 },
]);
