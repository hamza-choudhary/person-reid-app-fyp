import express from 'express'

import {
	deleteResults,
	getResult,
	getResults,
	postImageResults,
	postVideoResults,
} from '../controllers/result.controller'

const router = express.Router()

router.get('/results', getResults)
router.get('/results/:resultId', getResult) //FIXME: /results/images/resultId | results/video/resultId
router.delete('/results/:resultId', deleteResults)

router.post('/results', postImageResults)
router.post('/results/video', postVideoResults)

export { router as resultRoutes }
