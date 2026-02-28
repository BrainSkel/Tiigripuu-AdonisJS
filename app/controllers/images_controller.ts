import ProductImage from '#models/product_image';
import type { HttpContext } from '@adonisjs/core/http'

export default class ImagesController {
  /**
   * Display a list of resource
   */
  //async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  //async create({}: HttpContext) {}

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
  async destroy({ request, response }: HttpContext) {
    const productId = request.input('product_id')
        const imageId = request.input('image_id');
        const image = await ProductImage.find(imageId);
        const moreThanOneImage = await ProductImage.query().where('product_id', productId);
        if (image && moreThanOneImage[1]) {
          await image.delete();
        }
        return response.redirect().back();
  }
}