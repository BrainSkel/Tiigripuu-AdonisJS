// import type { HttpContext } from '@adonisjs/core/http'
import { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import Order from '#models/order'
import Category from '#models/category'
// import { createKasitooSchema } from '#validators/create_kasitoo_schema'
// import { createRentalSchema } from '#validators/create_laenutus_schema'
// import { cuid } from '@adonisjs/core/helpers'


export default class AdminController {
  public async orders({ view }: HttpContext) {
    const orders = await Order.query().preload('customer')
    const completedOrders = await Order.query().where('status', 'completed').preload('customer')
    const cancelledOrders = await Order.query().where('status', 'cancelled').preload('customer')
    return view.render('admin/orders', { pageTitle: 'Admin- Orders', orders, completedOrders, cancelledOrders  })
  }


  public async dashboard({ view }: HttpContext) {
      const products = await Product.query().preload('images')

      const categories = await Category.query().from('categories').select('*').whereNotNull('allowed_product_types')
      const rentalCategories = categories.filter(category => category.allowed_product_types.includes('rental'))
      const handicraftCategories = categories.filter(category => category.allowed_product_types.includes('handicraft'))


    const rentals = products.filter(product => product.productType === 'rental')
    const handicrafts = products.filter(product => product.productType === 'handicraft')

    // const rentalCategories = await Category.query().where('product_type', 'rental')
    // const handicraftCategories = await Category.query().where('product_type', 'handicraft')
    return view.render('admin/dashboard', { pageTitle: 'Admin- Dashboard', products, rentals, handicrafts, rentalCategories, handicraftCategories })
  }
}