import express from 'express'

import {
	deleteQuery,
	getQueries,
	postQuery,
} from '../controllers/query.controller'
import { configureQueryMulter } from '../middleware/configureQuery.middleware'

const router = express.Router()

router.get('/queries', getQueries)
router.post('/queries', configureQueryMulter, postQuery)
router.delete('/queries/:queryId', deleteQuery)

export { router as queryRoutes }
