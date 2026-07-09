import { AuthHandler, withAuth } from "./withAuth"
import { withErrorHandler } from "./withErrorHandler"

export function withHandler(handler: AuthHandler) {
  return withErrorHandler(withAuth(handler))
}