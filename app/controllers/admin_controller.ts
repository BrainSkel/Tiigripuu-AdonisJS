// import type { HttpContext } from '@adonisjs/core/http'
import { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import Order from '#models/order'
// import { createKasitooSchema } from '#validators/create_kasitoo_schema'
// import { createRentalSchema } from '#validators/create_laenutus_schema'
// import { cuid } from '@adonisjs/core/helpers'


export default class AdminController {
  public async orders({ view }: HttpContext) {
    const orders = await Order.all()
    return view.render('admin/orders', { pageTitle: 'Admin- Orders', products: [], orders  })
  }


  public async dashboard({ view }: HttpContext) {
      const products = await Product.query().preload('images')
      

    const rentals = products.filter(product => product.productType === 'rental')
    const handicrafts = products.filter(product => product.productType === 'handicraft')

    // const rentalCategories = await Category.query().where('product_type', 'rental')
    // const handicraftCategories = await Category.query().where('product_type', 'handicraft')
    return view.render('admin/dashboard', { pageTitle: 'Admin- Dashboard', products, rentals, handicrafts })
  }
}