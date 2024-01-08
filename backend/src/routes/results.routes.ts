import express from 'express'

import {
	deleteResults,
	getResult,
	getResults,
	postResults,
} from '../controllers/result.controller'

const router = express.Router()

router.get('/results', getResults)
router.get('/results/:resultId', getResult)
router.delete('/results/:resultId', deleteResults)

router.post('/results', postResults)

export { router as resultRoutes }
