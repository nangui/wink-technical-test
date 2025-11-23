import { companyHandlers } from './companies'
import { authHandlers } from './auth'

/**
 * Tous les handlers MSW
 */
export const handlers = [
  ...companyHandlers,
  ...authHandlers,
]

