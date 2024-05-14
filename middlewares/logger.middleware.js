import {logger} from '../services/logger.service.js'

export async function log(req, res, next) {
  logger.info('Got request')
  next()
}

