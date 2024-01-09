import express from 'express'
import {
  deleteUser,
  getUsers,
  login,
  logout,
  registerUser,
  updateUser,
} from '../controllers/auth.controller'

const router = express.Router()

router.get('/users', getUsers)
router.post('/users', registerUser)
router.put('/users', updateUser)
router.delete('/users/:userId', deleteUser)

router.post('/login', login)
router.post('/logout', logout)

export { router as authRoutes }
