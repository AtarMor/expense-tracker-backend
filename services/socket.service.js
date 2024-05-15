import { logger } from './logger.service.js'
import { Server } from 'socket.io'

var gIo = null

export function setupSocketAPI(server) {
    gIo = new Server(server, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        logger.info(`New connected socket [id: ${socket.id}]`)

        socket.on('disconnect', () => {
            logger.info(`Socket disconnected [id: ${socket.id}]`)
        })

        socket.on('refresh', () => {
            logger.info(`Go refresh request from client [id: ${socket.id}], broadcasting...`)
            socket.broadcast.emit('refresh')
        })
    })
}

export const socketService = {
    setupSocketAPI
}
