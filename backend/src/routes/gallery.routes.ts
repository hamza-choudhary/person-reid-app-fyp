import express from 'express'

import {
	deleteGallery,
	deleteGalleryImg,
	getGalleries,
	getGallery,
	postGallery,
	putGallery,
} from '../controllers/gallery.controller'
import { configureGalleryMulter } from '../middleware/configureGallery.middleware'

const router = express.Router()

router.get('/galleries', getGalleries) 
router.post('/galleries', configureGalleryMulter, postGallery) 
router.delete('/galleries/:galleryId', deleteGallery)

router.get('/galleries/:galleryId', getGallery) 
router.put('/gallery', configureGalleryMulter, putGallery) 
router.delete('/galleries/:galleryId/images/:imageName', deleteGalleryImg) 


export { router as galleryRoutes }
