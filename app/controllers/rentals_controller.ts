import type { HttpContext } from '@adonisjs/core/http'
import { createLaenutusSchema } from '#validators/create_laenutus_schema'
import Laenutus from '#models/laenutus'

export default class RentalsController {
  /**
   * Display a list of resource
   */
public async index({ view }: HttpContext) {
  const rentals = await Laenutus.all()            // plain objects
  return view.render('rentals/view', { pageTitle: 'Laenutus', rentals })
}


  /**
   * Display form to create a new record
   */
  async create({view}: HttpContext) {
    return view.render('rentals/create', { pageTitle: 'Uus laenutus'})
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createLaenutusSchema)
    await Laenutus.create(payload);

    console.log(payload);
    return response.redirect().toRoute('rentals.index');
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ view, params }: HttpContext) {
    const rentals = await Laenutus.findBy('Slug', params.Slug)
    
    return view.render('rentals/edit', { pageTitle: 'Edit', rentals })
  }

  /**
   * Handle form submission for the edit action
   */

  //uncomment after implementing
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createLaenutusSchema)
    await Laenutus.query().where('Slug', params.Slug).update(payload);
    return response.redirect().toRoute('rentals.index');
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const rental = await Laenutus
      .query()
      .where('Slug', params.Slug)
      .firstOrFail();

    await rental.delete();
    return response.redirect().toRoute('rentals.index');
  }
}