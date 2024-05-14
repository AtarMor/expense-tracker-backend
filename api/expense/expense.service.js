import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

export const expenseService = {
    query,
    getById,
    remove,
    add,
    update,
}

function getOwner() {
    const { loggedinUser } = asyncLocalStorage.getStore()
    return loggedinUser.fullName
}

async function query(filterBy) {
    try {
        const endDateFilter = filterBy.endDate === '' ? {} : { $lte: filterBy.endDate }
        const criteria = {
            $or: [
                { description: { $regex: filterBy.txt, $options: 'i' } },
                { category: { $regex: filterBy.txt, $options: 'i' }}
            ],
            category: { $regex: filterBy.category, $options: 'i' },
            date: { $gte: filterBy.startDate, ...endDateFilter },
            owner: { $eq: getOwner() }
        }

        const collection = await dbService.getCollection('expense')
        var expenses = await collection.find(criteria).toArray()
    } catch (err) {
        logger.error('cannot find expenses', err)
        throw err
    }

    return expenses
}

async function getById(expenseId) {
    try {
        const collection = await dbService.getCollection('expense')
        var expense = collection.findOne({ _id: new ObjectId(expenseId) })
        return expense
    } catch (err) {
        logger.error(`while finding expense ${expenseId}`, err)
        throw err
    }
}

async function remove(expenseId) {
    try {
        const collection = await dbService.getCollection('expense')
        await collection.deleteOne({ _id: new ObjectId(expenseId) })
    } catch (err) {
        logger.error(`cannot remove expense ${expenseId}`, err)
        throw err
    }
}

async function add(expense) {
    try {
        const collection = await dbService.getCollection('expense')
        await collection.insertOne({ owner: getOwner(), ...expense})
        return expense
    } catch (err) {
        logger.error('cannot insert expense', err)
        throw err
    }
}

async function update(expense) {
    try {
        logger.debug("Got expense", expense)

        const collection = await dbService.getCollection('expense')
        const { _id, ...expenseToUpdate } = expense

        const res = await collection.updateOne({ _id: new ObjectId(_id) }, { $set: ({ owner: getOwner(), ...expenseToUpdate}) })
        return expense
    } catch (err) {
        logger.error('cannot update toy', err)
        throw err
    }
}