import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product';
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
      order = await Product.query().where('product_type', 'rental').where('slug', params.slug).first()
    } else if (productType == "handicraft") {
      order = await Product.query().where('product_type', 'handicraft').where('slug', params.slug).first()
    } else if (productType == "custom_handicraft") {
      console.log("No custom_handicraft created yet")
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
    const order = await Order.query()
    .where('id', params.id)
    .preload('items', (itemQuery) => {
      itemQuery.preload('product', (productQuery) => {
        productQuery.preload('categories', (categoryQuery) => {
          categoryQuery.pivotColumns(['product_id'])
        }).preload('images')
    })})
    .firstOrFail()
    const productType = await order.items[0].product.productType

    let product = null;
    if(  productType == "rental") {
      product = await Product.query().where('product_type', 'rental').where('slug', order.items[0].product.slug).first()
    } else if (productType == "handicraft") {
      product = await Product.query().where('product_type', 'handicraft').where('slug', order.items[0].product.slug).first()
    } else if (productType == "custom_handicraft") {
      console.log("No custom_handicraft created yet")
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