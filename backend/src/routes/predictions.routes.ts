import express from 'express'

import { postPredictionQuery, getPredictionResults } from '../controllers/predictions.controller'
import { clearUploads, queryUpload } from '../middleware/queryUpload.middleware'

const router = express.Router()

router.post('/upload', clearUploads, queryUpload, postPredictionQuery)
router.get('/results', getPredictionResults)

export { router as predictionRoutes }
