import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

export default class OptionalAuthMiddleware {
  async handle(
    ctx: HttpContext, 
    next: NextFn, 
    options: {
    guards?: (keyof Authenticators)[]
  } = {}
) {
    try {
      // Attempt to authenticate using session guard
      await ctx.auth.authenticateUsing(options.guards)
    } catch {
      // Ignore if not logged in
    }

    await next()
  }
}