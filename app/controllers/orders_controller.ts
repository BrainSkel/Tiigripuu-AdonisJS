import type { HttpContext } from '@adonisjs/core/http'
import Rental from '#models/rental'
import Handicraft from '#models/handicraft'
import Order from '#models/order'
import { createOrderSchema } from '#validators/create_order_schema';

export default class OrdersController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  async create({ view, params }: HttpContext) {

    const productType = params.type;
    let order = null;
    if( productType == "rental") {
      order = await Rental.findBy('slug', params.slug)
    } else if (productType == "handiwork") {
      order = await Handicraft.findBy('slug', params.slug)
    } else if (productType == "custom_handiwork") {
      console.log("No kasitooCustom created yet")
    }

    return view.render('orders/create', {pageTitle: "Order", order, productType })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createOrderSchema)

    await Order.create(payload);
    console.log(response)

    response.redirect().toRoute('admin.dashboard')

  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params, view }: HttpContext) {
    const order = await Order.findBy('order_number', params.orderId) 
    const productType = await order?.productType
    const productId = await order?.productId
    let product = null;
    if(  productType == "rental") {
      product = await Rental.findBy('slug', productId)
    } else if (productType == "handiwork") {
      product = await Handicraft.findBy('slug', productId)
    } else if (productType == "custom_handiwork") {
      console.log("No kasitooCustom created yet")
    } else {
      console.log("edit open error")
    }

    return view.render('orders/edit', {pageTitle: 'Edit', order, product})

  }

  /**
   * Handle form submission for the edit action
   */

  //async update({ params, request }: HttpContext) {}          !!!!!!!!!!!!!!!!

  /**
   * Delete record
   */
  //async destroy({ params }: HttpContext) {}
}