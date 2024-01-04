import express from 'express'
import {
	login,
	logout,
	registerUser,
	updateUser,
} from '../controllers/auth.controller'

const router = express.Router()

router.post('/register', registerUser)
router.put('/update', updateUser)
router.post('/login', login)
router.post('/logout', logout)

export { router as authRoutes }
