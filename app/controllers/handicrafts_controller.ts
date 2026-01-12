import type { HttpContext } from '@adonisjs/core/http'
import Handicraft from '#models/handicraft'
import { createKasitooSchema } from '#validators/create_kasitoo_schema'
import { cuid } from '@adonisjs/core/helpers'

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
  async create({view}: HttpContext) {
    return view.render('handicrafts/create', { pageTitle: 'Uus kasitöö' })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createKasitooSchema)

    const imageName = await this.uploadImageToDrive(request);

    const data = { ...payload, Image_url: imageName }
    await Handicraft.create(data);
    return response.redirect().toRoute('handicrafts.index')
  }

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