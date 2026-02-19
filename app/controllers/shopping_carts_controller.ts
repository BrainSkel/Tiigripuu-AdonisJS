
import Cart from '#models/cart';
import CartItem from '#models/cart_item';
import { addShoppingCartItem } from '#validators/add_shopping_cart_item'
import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'

export default class ShoppingCartsController {
  /**
   * Display a list of resource
   */
  async index({ params, view, request, response }: HttpContext) {
    let cart;
    if (!request.cookie('cartKey')) {
      const cartKey = randomUUID();
      cart = await Cart.create({ cartKey: cartKey, status: 'active'});
      response.cookie('cartKey', cartKey, {httpOnly: true, maxAge: '5d'})
    } else {
      const cartKey = request.cookie('cartKey');
      cart = await Cart.query().where('cartKey', cartKey).preload('items').firstOrFail();
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
  async store({ request }: HttpContext) {

    const product = await request.validateUsing(addShoppingCartItem);
    await CartItem.create({
      productId: product.productId,
      quantity: product.quantity
    })
    return true;
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
  async update({ params, request }: HttpContext) {

    const product = params.id;
    const payload = await request.validateUsing(addShoppingCartItem);
    const cartItem = await CartItem.findByOrFail('productId', product);

    //add removing item from cart if quantity is 0
    if (payload.quantity === 0) {
      await cartItem.delete();
      return true;
    }
    cartItem.quantity = payload.quantity;
    await cartItem.save();
    return true;
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const product = params.id;
    const cartItem = await CartItem.findByOrFail('productId', product);
    await cartItem.delete();
    return true;
  }
}