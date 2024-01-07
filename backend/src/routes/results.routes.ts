import express from 'express'

import {
	deleteResults,
	getResult,
	getResults,
} from '../controllers/result.controller'

const router = express.Router()

router.get('/results', getResults)
router.get('/results/:resultId', getResult)
router.delete('/results/:resultId', deleteResults)

export { router as resultRoutes }
