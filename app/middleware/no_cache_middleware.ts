import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class NoCacheMiddleware {
  async handle({ response }: HttpContext, next: NextFn) {
    response.header('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.header('Pragma', 'no-cache')
    response.header('Expires', '0')

    await next()
  }
}