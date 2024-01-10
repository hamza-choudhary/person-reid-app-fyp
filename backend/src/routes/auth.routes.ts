import express from 'express'
import {
	deleteUser,
	getUser,
	getUsers,
	login,
	logout,
	registerUser,
	updateUser,
	updateUserPassword,
} from '../controllers/auth.controller'
import verifyToken from '../middleware/authMiddleware'

const router = express.Router()

router.get('/user', verifyToken, getUser)
router.get('/users', getUsers)
router.post('/users', registerUser)
router.put('/users', updateUser)
router.put('/users/password', updateUserPassword) //update profile
router.delete('/users/:userId', deleteUser)

router.post('/login', login)
router.post('/logout', logout)


export { router as authRoutes }
