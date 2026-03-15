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
import OrderItem from '#models/order_item';
import { updateOrderSchema } from '#validators/update_order_schema';
import { DateTime } from 'luxon';

export default class OrdersController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    const orders = await Order.query().preload('customer')
    const completedOrders = await Order.query().where('status', 'completed').preload('customer')
    const cancelledOrders = await Order.query().where('status', 'cancelled').preload('customer')
    return view.render('admin/orders', { pageTitle: 'Admin- Orders', orders, completedOrders, cancelledOrders })


  }

  /**
   * Display form to create a new record
   */
  async create({ view, params, request, response }: HttpContext) {
    const cartKey = request.cookie('cartKey')
    let totalPrice = 0;
    const shoppingCart = await Cart.query()
      .where('cartKey', cartKey)
      .preload('items', (query) => { query.preload('product') })
      .firstOrFail();

    let orders = [];



    for (const item of shoppingCart.items) {
      let orderProduct;
      const product = item.product
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

    for(const orderItem of shoppingCart.items) {
      totalPrice += (orderItem.product.price * orderItem.quantity)
    }
    if(orders[0]) {
      return view.render('orders/create', { pageTitle: "Order", orders, totalPrice })
    } else {
      return response.redirect().back()
    }
    

  }

  async checkAvailability(cartItem: any, orderId: number) {
    const item = await CartItem.query().where('id', cartItem).preload('product').firstOrFail()
    if (item.quantity <= item.product.stockAmount) {
      const totalPrice = item.quantity * item.product.price
      await OrderItem.create({

        orderId: orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: totalPrice
      }

      )
    }

    //If quantity less, return message saying not enoguh items in stock

  }





  /**
   * Handle form submission for the create action
   */
  async store({ request, response, view }: HttpContext) {

    const orderPayload = await request.validateUsing(createOrderSchema)
    const customerPayload = await request.validateUsing(createCustomerSchema)
    const cartKey = request.cookie('cartKey')
    const shoppingCart = await Cart.query()
      .where('cartKey', cartKey)
      .preload('items', (query) => { query.preload('product') })
      .firstOrFail();


    let totalPrice = 0;
    for (const item in shoppingCart.items) {
      totalPrice += (shoppingCart.items[item].product.price * shoppingCart.items[item].quantity)

    }


    //!!const totalPrice = request.input('total_price');

    const customerData = await { ...customerPayload }
    const customer = await Customer.create(customerData);
    const orderValues = await { ...orderPayload, totalPrice: totalPrice, customerId: customer.id }

    const order = await Order.create(orderValues);

    for (const productI in shoppingCart.items) {
      await this.checkAvailability(shoppingCart.items[productI].id, order.id)
      const cartProduct = await Product.query().where('id', shoppingCart.items[productI].productId).firstOrFail();
      cartProduct.stockAmount -= shoppingCart.items[productI].quantity
      cartProduct.save();

    }


    const sentOrder = await Order.query().where('id', order.id).preload('items', (query) => { query.preload('product', (productQuery) => { productQuery.preload('images') }) }).firstOrFail()
    await mail.send((message) => {
      message
        .to(customer.email)
        .from(env.get('MAIL_SENDER'))
        .subject('Teie tellimus ' + sentOrder.orderNumber)
        .htmlView('emails/create_order_to_customer', { order: sentOrder })
    })
    this.deleteCartAndItems(cartKey)

    await mail.send((message) => {
      message
        .to(env.get('ADMIN_EMAIL'))
        .from(env.get('MAIL_SENDER'))
        .subject('Uus tellimus ' + sentOrder.orderNumber)
        .htmlView('emails/create_order_to_admin', { order: sentOrder })
    })
    this.deleteCartAndItems(cartKey)
    response.redirect().toRoute('home')
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {

    /*
for displaying unsensitive order details. Like products, price, status, completion date
*/

  }



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


      const orderItems = await order.items;

    return view.render('orders/edit', { pageTitle: 'Edit', order, orderItems })

  }

  /**
   * Handle form submission for the edit action
   */
  async updateStatus({ params, request, response, session }: HttpContext) {
    const order = await Order.query().where('id', params.id).preload('items', (query) => {
      query.preload('product')
    }).firstOrFail();
    const oldStatus = order.status;
    order.status = request.input('status');


    if (oldStatus != 'cancelled' && order.status == 'cancelled') {
      for (const item of order.items) {
        item.product.stockAmount += item.quantity
        await item.product.save()
      }
    } else if (oldStatus == 'cancelled' && order.status != 'cancelled') {
      for (const item of order.items) {
        if (item.product.stockAmount >= item.quantity) {
          item.product.stockAmount -= item.quantity
          await item.product.save()
        } else {
          session.flash('error', 'Pole piisavalt toodet laos')
          return response.redirect().back()
        }
      }
    }


    await order.save()
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const order = await Order.query().where('id', params.id).preload('items', (query) => {
      query.preload('product')
    }).firstOrFail();
    const payload = await request.validateUsing(updateOrderSchema)

    const data = { ...payload, orderCompletionDate: DateTime.fromJSDate(payload.order_completion_date) }

    const oldStatus = order.status;
    order.status = request.input('status');


    if (oldStatus != 'cancelled' && order.status == 'cancelled') {
      for (const item of order.items) {
        item.product.stockAmount += item.quantity
        await item.product.save()
      }
    } else if (oldStatus == 'cancelled' && order.status != 'cancelled') {
      for (const item of order.items) {
        if (item.product.stockAmount >= item.quantity) {
          item.product.stockAmount -= item.quantity
          await item.product.save()
        } else {
          session.flash('error', 'Pole piisavalt toodet laos')
          return response.redirect().back()
        }
      }
    }
    order.merge(data)

    order.save()

    return response.redirect().toRoute('orders.index')
  }

  /*
  If updating quantity make sure to update stock too
  */


  /**
   * Delete record
   */
  //async destroy({ params }: HttpContext) {}

  async deleteCartAndItems(cartKey: any) {
    const cart = await Cart.query().where("cartKey", cartKey).first()
    cart?.delete();


  }
}