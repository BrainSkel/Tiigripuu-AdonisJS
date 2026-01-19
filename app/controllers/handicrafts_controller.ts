import { Redirect, type HttpContext } from '@adonisjs/core/http'
import Handicraft from '#models/handicraft'
import { createKasitooSchema } from '#validators/create_kasitoo_schema'
import { cuid } from '@adonisjs/core/helpers'
import category from '#models/category'

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
  async create({ view }: HttpContext) {
    const categories = await category.query().where('product_type', 'handicraft')
    return view.render('handicrafts/create', { categories, pageTitle: 'Uus kasitöö' })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createKasitooSchema)

    const imageName = await this.uploadImageToDrive(request)

    // Convert form string IDs to numbers for pivot
    const categoryIds: number[] = (payload.category || []).map(id => Number(id))

    const data = {
      itemName: payload.item_name,
      price: payload.price,
      description: payload.description,
      imageUrl: imageName
    }

    const handicraft = await Handicraft.create(data)
    await handicraft.related('categories').attach(categoryIds)

    return response.redirect().toRoute('admin.dashboard')
  }


  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    const handicraft = await Handicraft.findBy('slug', params.slug)
    return view.render('handicrafts/show', { handicraft, pageTitle: handicraft?.itemName })
  }

  /**
   * Edit individual record
   */
  async edit({ params, view }: HttpContext) {
    const handicrafts = await Handicraft.findBy('slug', params.slug)

    return view.render('handicrafts/edit', { pageTitle: 'Edit', handicrafts })
  }

  /**
   * Handle form submission for the edit action
   */

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createKasitooSchema)
    let imageName = request.input('imageUrl'); // Default to existing image name
    if (request.file('imageUrl') !== null) {
      imageName = await this.uploadImageToDrive(request); // Upload image to drive
    }
    const data = { ...payload, image_url: imageName }

    await Handicraft.query().where('slug', params.slug).update(data);

    return response.redirect().toRoute('handicrafts.index');
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const handiCraft = await Handicraft.findBy('slug', params.slug)
    await handiCraft?.delete()
    return response.redirect().toRoute('handicrafts.index')
  }



  async uploadImageToDrive(request: any) {
    const image = request.file('image_url', {
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