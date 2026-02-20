
import Cart from '#models/cart';
import CartItem from '#models/cart_item';
import { addShoppingCartItem } from '#validators/add_shopping_cart_item'
import { Redirect, type HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'

export default class ShoppingCartsController {
  /**
   * Display a list of resource
   */
  async index({ params, view, request, response }: HttpContext) {
    let cart;
    const cookieKey = request.cookie('cartKey')

    if (cookieKey) {
      cart = await Cart.query().where('cartKey', request.cookie('cartKey')).first();


    }

    if (!cookieKey || !cart) {
      response.clearCookie('cartKey');
      const cartKey = randomUUID();
      cart = await Cart.create({ cartKey: cartKey, status: 'active'});
      response.cookie('cartKey', cartKey, {httpOnly: true, maxAge: '5d'})
    } else {
      const cartKey = request.cookie('cartKey');
      cart = await Cart.query().where('cartKey', cartKey).preload('items', (query) => {
          query.preload('product', (productQuery) => {
            productQuery.preload('images')
          })
        }
    ).firstOrFail();
    }

      
    return view.render('carts/cart', { pageTitle: 'Ostukorv', cart })
  }

  /**
   * Display form to create a new record
   */
  //async create({}: HttpContext) {}


  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {

    const product = await request.validateUsing(addShoppingCartItem);
    const cartKey = request.cookie('cartKey');
    const cart = await Cart.query().where('cartKey', cartKey).firstOrFail();
    await CartItem.create({
      productId: product.productId,
      quantity: product.quantity,
      cartId: cart.id
    })
    return response.redirect().back();
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) { }

  //add later page to show detailed shopping cart with all items and total price


  /**
   * Edit individual record
   */
  //async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {

    const product = params.id;
    //const payload = await request.validateUsing(addShoppingCartItem);
    const cartItem = await CartItem.findByOrFail('id', product);
    const quantity = request.input('quantity');

    //add removing item from cart if quantity is 0
    if (quantity == 0) {
      await cartItem.delete();
      console.log('Item removed from cart');
      return response.redirect().back();
    }

    cartItem.quantity = quantity

    await cartItem.merge({ quantity: cartItem.quantity }).save();
    return response.redirect().back();
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const product = params.id;
    const cartItem = await CartItem.findByOrFail('id', product);
    await cartItem.delete();
    return response.redirect().back();
  }
}