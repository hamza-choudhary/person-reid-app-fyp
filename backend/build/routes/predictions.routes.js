"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const predictions_controller_1 = require("../controllers/predictions.controller");
const queryUpload_middleware_1 = require("../middleware/queryUpload.middleware");
const router = express_1.default.Router();
exports.predictionRoutes = router;
router.post('/upload', queryUpload_middleware_1.clearUploads, queryUpload_middleware_1.queryUpload, predictions_controller_1.postPredictionQuery);
router.get('/results', predictions_controller_1.getPredictionResults);
