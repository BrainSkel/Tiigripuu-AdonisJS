import type { HttpContext } from '@adonisjs/core/http'
import { createLaenutusSchema } from '#validators/create_laenutus_schema'
import Laenutus from '#models/laenutus'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'

export default class RentalsController {
  /**
   * Display a list of resource
   */
  public async index({ view }: HttpContext) {
    const rentals = await Laenutus.all()            // plain objects
    return view.render('rentals/view', { pageTitle: 'Laenutus', rentals })
  }
  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    console.log(params);
    const rental = await Laenutus.findBy('Slug', params.Slug)
    return view.render('rentals/show', { pageTitle: 'Show', rental })
  }


  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    return view.render('rentals/create', { pageTitle: 'Uus laenutus' })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createLaenutusSchema)

    const imageName = await this.uploadImageToDrive(request);

    const data = { ...payload, Image_url: imageName }
    await Laenutus.create(data);

    console.log(data);
    return response.redirect().toRoute('rentals.index');
  }


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
    const imageName = await this.uploadImageToDrive(request); // Upload image to drive
    const data = { ...payload, Image_url: imageName }

    await Laenutus.query().where('Slug', params.Slug).update(data);

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

  async uploadImageToDrive(request: any) {
    const image = request.file('Image_url', {
      size: '10mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })
    let imageName = ''
    if (image) {
      imageName = `${cuid()}.${image.extname}`
      const key = `uploads/${imageName}`
      await image.moveToDisk(key)
    } else {
      imageName = 'default.jpg'
    }

    return imageName;

  }
}