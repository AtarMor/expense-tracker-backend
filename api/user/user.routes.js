import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { getUser, deleteUser, updateUser } from './user.controller.js'

const router = express.Router()

router.get('/:id', requireAuth, getUser)

export const userRoutes = router
