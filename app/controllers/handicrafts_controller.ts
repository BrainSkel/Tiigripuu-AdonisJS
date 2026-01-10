import type { HttpContext } from '@adonisjs/core/http'
import Handicraft from '#models/handicraft'

export default class HandicraftsController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    const handicrafts = await Handicraft.all()            // plain objects
    return view.render('handicrafts/view', { handicrafts, pageTitle: 'Kasitöö' })
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  
  //async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}