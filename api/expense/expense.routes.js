import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import { getExpenses, getExpenseById, addExpense, updateExpense, removeExpense } from './expense.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

export const expenseRoutes = express.Router()

expenseRoutes.get('/', requireAuth, getExpenses)
expenseRoutes.get('/:id', requireAuth, getExpenseById)
expenseRoutes.post('/', requireAuth, addExpense)
expenseRoutes.put('/:id', requireAuth, updateExpense)
expenseRoutes.delete('/:id', requireAuth, removeExpense)