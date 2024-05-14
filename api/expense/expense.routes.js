import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import { getExpenses, getExpenseById, addExpense, updateExpense, removeExpense } from './expense.controller.js'

export const expenseRoutes = express.Router()

expenseRoutes.get('/', log, getExpenses)
expenseRoutes.get('/:id', getExpenseById)
expenseRoutes.post('/', addExpense)
expenseRoutes.put('/:id', updateExpense)
expenseRoutes.delete('/:id', removeExpense)