import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product';
import Order from '#models/order'
import { createOrderSchema } from '#validators/create_order_schema';
import { createCustomerSchema } from '#validators/create_customer_schema';
import Customer from '#models/customer';
import Cart from '#models/cart';
import CartItem from '#models/cart_item';
import mail from '@adonisjs/mail/services/main'
import env from '#start/env'

export default class OrdersController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) { }

  /**
   * Display form to create a new record
   */
  async create({ view, params, request }: HttpContext) {
    const cartKey = request.cookie('cartKey')
    const shoppingCart = await Cart.query()
      .where('cartKey', cartKey)
      .preload('items', (query) => { query.preload('product') })
      .firstOrFail();

    let orders = [];



    for (const item in shoppingCart.items) {
      let orderProduct;
      const product = shoppingCart.items[item].product
      if (product.productType == "rental") {
        orderProduct = await Product.query().where('product_type', 'rental').where('slug', product.slug).preload('rentalDetail').preload('images').preload('categories').firstOrFail()
      } else if (product.productType == "handicraft") {
        orderProduct = await Product.query().where('product_type', 'handicraft').where('slug', product.slug).preload('handicraftDetail').preload('images').preload('categories').firstOrFail()
      } else if (product.productType == "custom_handicraft") {
        console.log("No custom_handicraft created yet")
      } else {
        console.log("create open error")
      }


      orders.push(orderProduct)
    }

    //!!order. total price

    await console.log();
    return view.render('orders/create', { pageTitle: "Order", orders })
    //return orders;

  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {

    const orderPayload = await request.validateUsing(createOrderSchema)
    const customerPayload = await request.validateUsing(createCustomerSchema)
    const cartKey = request.cookie('cartKey')
    const shoppingCart = await Cart.query()
      .where('cartKey', cartKey)
      .preload('items', (query) => { query.preload('product') })
      .firstOrFail();


    let totalPrice = 0;
    for (const item in shoppingCart.items) {
      totalPrice += shoppingCart.items[item].product.price * shoppingCart.items[item].quantity

    }
    console.log(totalPrice)







    //!!const totalPrice = request.input('total_price');

    const customerData = await { ...customerPayload }
    const customer = await Customer.create(customerData);
    const orderValues = await { ...orderPayload, totalPrice: totalPrice, customerId: customer.id }

    const order = await Order.create(orderValues);


    const sentOrder = await Order.query().where('id', order.id)
    // await mail.send((message) => {
    //   message
    //     .to(customerPayload.customer_email)
    //     .from(env.get('MAIL_SENDER'))
    //     .subject('Teie tellimus OrderNR TBA')
    //     .htmlView('emails/create_order_to_customer')
    // })
    this.deleteCartAndItems(cartKey)

    response.redirect().toRoute('admin.dashboard')

  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) { }

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
        })
      })
      .firstOrFail()
    const productType = await order.items[0].product.productType

    let product = null;
    if (productType == "rental") {
      product = await Product.query().where('product_type', 'rental').where('slug', order.items[0].product.slug).first()
    } else if (productType == "handicraft") {
      product = await Product.query().where('product_type', 'handicraft').where('slug', order.items[0].product.slug).first()
    } else if (productType == "custom_handicraft") {
      console.log("No custom_handicraft created yet")
    } else {
      console.log("edit open error")
    }

    return view.render('orders/edit', { pageTitle: 'Edit', order, product })

  }

  /**
   * Handle form submission for the edit action
   */

  //async update({ params, request }: HttpContext) {}          !!!!!!!!!!!!!!!!

  /**
   * Delete record
   */
  //async destroy({ params }: HttpContext) {}

  async deleteCartAndItems(cartKey: any) {
    const cart = await Cart.query().where("cartKey", cartKey).first()
    cart?.delete();
    console.log('Cart deleted')

  
  }
}