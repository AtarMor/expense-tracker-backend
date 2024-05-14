import { config } from '../config/index.js'
import { logger } from '../services/logger.service.js'
import { asyncLocalStorage } from '../services/als.service.js'
import { authService } from '../api/auth/auth.service.js'

export async function requireAuth(req, res, next) {
  if (!req?.cookies?.loginToken) {
      return res.status(401).send('Not Authenticated')
  }
  
  const loggedinUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Not Authenticated')

  req.loggedinUser = loggedinUser
  next()
}
