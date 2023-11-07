import express from 'express'

import {
	getPredictionResults,
	getUploads,
	postInference,
	postPredictionQuery,
	postUploadGalleryImg,
	postUploadQueryImg,
} from '../controllers/predictions.controller'
import { configureGalleryMulter } from '../middleware/configureGallery.middleware'
import { configureQueryMulter } from '../middleware/configureQuery.middleware'
import { clearUploads, queryUpload } from '../middleware/queryUpload.middleware'

const router = express.Router()

router.post('/upload', clearUploads, queryUpload, postPredictionQuery)
router.get('/results', getPredictionResults)
router.post('/upload-gallery', configureGalleryMulter, postUploadGalleryImg)
router.post('/upload-query', configureQueryMulter, postUploadQueryImg)
router.post('/inference', postInference)
router.get('/images/:folder', getUploads)

export { router as predictionRoutes }
