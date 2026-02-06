import type { HttpContext } from '@adonisjs/core/http'
import { createRentalSchema } from '#validators/create_laenutus_schema'
import Product from '#models/product'
import { cuid } from '@adonisjs/core/helpers'

export default class RentalsController {
  /**
   * Display a list of resource
   */
  public async index({ view }: HttpContext) {
    const rentals = await Product.query().where('product_type', 'rental')            // plain objects
    return view.render('rentals/view', { pageTitle: 'Rental', rentals })
  }
  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    console.log(params);
    const rental = await Product.findBy('slug', params.slug)
    return view.render('rentals/show', { pageTitle: rental?.itemName, rental })
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
    const payload = await request.validateUsing(createRentalSchema)

    const imageName = await this.uploadImageToDrive(request);

    const data = { ...payload, image_url: imageName, product_type: 'rental' }
    await Product.create(data);

    console.log(data);
    return response.redirect().toRoute('admin.dashboard');
  }


  /**
   * Edit individual record
   */
  async edit({ view, params }: HttpContext) {
    const rentals = await Product.findBy('slug', params.slug)

    return view.render('rentals/edit', { pageTitle: 'Edit', rentals })
  }

  /**
   * Handle form submission for the edit action
   */

  //uncomment after implementing
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createRentalSchema)
    let imageName = request.input('imageUrl'); // Default to existing image name
    if (request.file('imageUrl') !== null) {
      imageName = await this.uploadImageToDrive(request); // Upload image to drive
    }
    const data = { ...payload, image_url: imageName }

    await Product.query().where('slug', params.slug).update(data);

    return response.redirect().toRoute('rentals.index');
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const rental = await Product
      .query()
      .where('slug', params.slug)
      .firstOrFail();

    await rental.delete();
    return response.redirect().toRoute('rentals.index');
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