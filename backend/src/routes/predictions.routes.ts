import express from 'express'

import {
	deleteGallery,
	deleteGalleryImg,
	deleteQuery,
	postGallery,
	postQuery,
	putGallery,
	// putGallery,
	// getUploads,
	// postInference,
	// postPredictionQuery,
	// postUploadGalleryImg,
	// postUploadQueryImg,
} from '../controllers/predictions.controller'
import { configureGalleryMulter } from '../middleware/configureGallery.middleware'
import { configureQueryMulter } from '../middleware/configureQuery.middleware'
import { clearUploads, queryUpload } from '../middleware/queryUpload.middleware'

const router = express.Router()

// router.post('/upload', clearUploads, queryUpload, postPredictionQuery)
// router.post('/upload-gallery', configureGalleryMulter, postUploadGalleryImg)
// router.post('/upload-query', configureQueryMulter, postUploadQueryImg)
// router.post('/inference', postInference)
// router.get('/images/:folder', getUploads)

//fixme: ask gpt for appropriate names for path
router.post('/upload/gallery', configureGalleryMulter, postGallery)
router.put('/update/gallery', configureGalleryMulter, putGallery)
router.delete('/delete/gallery', deleteGallery)
router.delete('/delete/gallery-image', deleteGalleryImg)

router.post('/upload/query', configureQueryMulter, postQuery)
router.delete('/delete/query', deleteQuery)




export { router as predictionRoutes }
