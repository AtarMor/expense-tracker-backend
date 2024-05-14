import { logger } from '../../services/logger.service.js'
import { expenseService } from './expense.service.js'

const allowedCategories = [
    "Food",
    "Utilities",
    "Transportation",
    "Entertainment",
    "Clothing",
    "Healthcare",
    "Rent/Mortgage",
    "Insurance",
    "Education",
    "Shopping"
]

function errorOnEmptyBody(req, res) {
    if (Object.keys(req.body).length === 0) {
        logger.error('Body cannot be empty')
        res.status(500).send({ err: 'Body cannot be empty' })
        return true
    }
    return false
}

function isValidCategory(category) {
    return allowedCategories.some((x) => x === category)
}

function validateExpense(inputExpense) {
    if (!isValidCategory(inputExpense.category)) {
        throw new Error("category is not allowed")
    }
}

export async function getExpenses(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
            category: req.query.category || '',
            date: req.query.date || ''
        }
        logger.debug('Getting Expenses', filterBy)
        const expenses = await expenseService.query(filterBy)
        logger.debug('Got Expenses', expenses)
        res.json(expenses)
    } catch (err) {
        logger.error('Failed to get expenses', err)
        res.status(500).send({ err: 'Failed to get expenses' })
    }
}

export async function getExpenseById(req, res) {
    try {
        const expenseId = req.params.id
        const expense = await expenseService.getById(expenseId)
        res.json(expense)
    } catch (err) {
        logger.error('Failed to get expense by id', err)
        res.status(500).send({ err: 'Failed to get expense by id' })
    }
}

export async function addExpense(req, res) {
    try {
        if (errorOnEmptyBody(req, res)) return
        const expense = req.body

        validateExpense(expense)

        const addedExpense = await expenseService.add(expense)
        res.json(addedExpense)
    } catch (err) {
        logger.error('Failed to add expense', err)
        res.status(500).send({ err: 'Failed to add expense' })
    }
}

export async function updateExpense(req, res) {
    try {
        if (errorOnEmptyBody(req, res)) return
        const expense = req.body

        validateExpense(expense)

        const updatedExpense = await expenseService.update(expense)
        res.json(updatedExpense)
    } catch (err) {
        logger.error('Failed to update expense', err)
        res.status(500).send({ err: 'Failed to update expense' })
    }
}

export async function removeExpense(req, res) {
    try {
        const expenseId = req.params.id
        await expenseService.remove(expenseId)
        res.send()
    } catch (err) {
        logger.error('Failed to remove expense', err)
        res.status(500).send({ err: 'Failed to remove expense' })
    }
}