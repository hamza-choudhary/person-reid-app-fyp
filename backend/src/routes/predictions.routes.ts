// import express from 'express'

// import {
// 	deleteGallery,
// 	deleteGalleryImg,
// 	deleteQuery,
// 	deleteResults,
// 	getGalleries,
// 	getGallery,
// 	getQueries,
// 	getResult,
// 	getResults,
// 	postGallery,
// 	postQuery,
// 	putGallery,
// } from '../controllers/predictions.controller'
// import { configureGalleryMulter } from '../middleware/configureGallery.middleware'
// import { configureQueryMulter } from '../middleware/configureQuery.middleware'
// import { clearUploads, queryUpload } from '../middleware/queryUpload.middleware'

// const router = express.Router()

// // router.post('/upload', clearUploads, queryUpload, postPredictionQuery)
// // router.post('/upload-gallery', configureGalleryMulter, postUploadGalleryImg)
// // router.post('/upload-query', configureQueryMulter, postUploadQueryImg)
// // router.post('/inference', postInference)
// // router.get('/images/:folder', getUploads)

// //fixme: ask gpt for appropriate names for path

// router.get('/all/gallery', getGalleries)
// router.post('/upload/gallery', configureGalleryMulter, postGallery)
// router.delete('/delete/gallery', deleteGallery)

// router.get('/gallery/:galleryId', getGallery)
// router.put('/update/gallery', configureGalleryMulter, putGallery)
// router.delete('/delete/gallery-image', deleteGalleryImg)

// router.get('/all/queries', getQueries)
// router.post('/upload/query', configureQueryMulter, postQuery)
// router.delete('/delete/query', deleteQuery)

// router.get('/all/results', getResults)
// router.delete('/delete/result', deleteResults)
// router.get('/results/:resultId', getResult)

// export { router as predictionRoutes }
