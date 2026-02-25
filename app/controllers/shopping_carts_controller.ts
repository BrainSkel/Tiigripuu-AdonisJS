
import Cart from '#models/cart';
import CartItem from '#models/cart_item';
import Product from '#models/product';
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
      cart = await Cart.create({ cartKey: cartKey, status: 'active' });
      response.cookie('cartKey', cartKey, { httpOnly: true, maxAge: '5d' })
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

    const cart = await this.createCart(request, response)
    const productData = await request.validateUsing(addShoppingCartItem);
    const existingItem = cart.items.find(
      (item) => item.productId == productData.productId
    )

    const product = await Product.query().where('id', productData.productId).firstOrFail()

    if (existingItem) {
      const newQuantity = existingItem.quantity += productData.quantity;

      if (newQuantity > product.stockAmount) {
        return response.badRequest('Not enough stock available')
      }

      existingItem.quantity = newQuantity
      await existingItem.save()

    } else {
      if (productData.quantity > product.stockAmount || productData.quantity < 0) {
        return response.badRequest('Not enough stock available')

      }
      await CartItem.create({
        productId: productData.productId,
        quantity: productData.quantity,
        cartId: cart.id
      })


    }
    return response.redirect().back();
  }

  /**
   * Show individual record
   */
  async show({ params, view, request, response }: HttpContext) {
    const cart = this.createCart(request, response)


    return view.render('carts/cart', { pageTitle: 'Ostukorv', cart })
  }
  //add later page to show detailed shopping cart with all items and total price


  /**
   * Edit individual record
   */
  //async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */


  async update({ params, request, response }: HttpContext) {

    const productId = params.id;
    //const payload = await request.validateUsing(addShoppingCartItem);
    const cartItem = await CartItem.findByOrFail('id', productId);
    const quantity = Number(request.input('quantity'));

    const product = await Product.query().where('id', cartItem.productId).firstOrFail()

    //add removing item from cart if quantity is 0
    if (quantity == 0) {
      await cartItem.delete();
      return response.redirect().back();
    }

    if(quantity < 0) {
      return response.badRequest('Invalid quantity')
    }

    if(quantity > product.stockAmount) {
      return response.badRequest('Not enought stock')
    }

    await cartItem.merge({ quantity: quantity }).save();
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


  async createCart(request: any, response: any) {
    let cart;
    const cookieKey = request.cookie('cartKey')
    if (cookieKey) {
      cart = await Cart.query().where('cartKey', request.cookie('cartKey')).first();


    }

    if (!cookieKey || !cart) {
      response.clearCookie('cartKey');
      const cartKey = randomUUID();
      cart = await Cart.create({ cartKey: cartKey, status: 'active' });
      response.cookie('cartKey', cartKey, { httpOnly: true, maxAge: '5d' })
    } else {
      const cartKey = request.cookie('cartKey');
      cart = await Cart.query().where('cartKey', cartKey)
        .firstOrFail();
    }

    return cart = Cart.query().where('id', cart.id).preload('items', (query) => {
      query.preload('product', (productQuery) => {
        productQuery.preload('images')
      })
    }).firstOrFail()
  }
}