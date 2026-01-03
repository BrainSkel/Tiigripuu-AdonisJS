import type { HttpContext } from '@adonisjs/core/http'
import Laenutus from '#models/laenutus'

export default class RentalsController {
  /**
   * Display a list of resource
   */
public async index({ view }: HttpContext) {
  const rentalsModels = await Laenutus.all()
  console.log('models collection:', rentalsModels)                 // Lucid collection
  console.log('first model $attributes:', rentalsModels[0]?.$attributes)
  const rentals = rentalsModels
  console.log('toJSON output:', rentals)                          // plain objects
  return view.render('rentals/view', { pageTitle: 'Laenutus', rentals })
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

  //uncomment after implementing
  //async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}