// import type { HttpContext } from '@adonisjs/core/http'
import { HttpContext } from '@adonisjs/core/http'
import Handicraft from '#models/handicraft'
import Rental from '#models/rental'
import Order from '#models/order'
import Category from '#models/category'
// import { createKasitooSchema } from '#validators/create_kasitoo_schema'
// import { createRentalSchema } from '#validators/create_laenutus_schema'
// import { cuid } from '@adonisjs/core/helpers'


export default class AdminController {
  public async orders({ view }: HttpContext) {
    const rentals = await Rental.all()
    const handicrafts = await Handicraft.all() // plain objects
    const orders = await Order.all()
    return view.render('admin/orders', { pageTitle: 'Admin- Orders', rentals, handicrafts, orders  })
  }


  public async dashboard({ view }: HttpContext) {
    const rentals = await Rental.query().preload('categories', (query) => {
      query.pivotColumns(['rental_id'])
    })
    const handicrafts = await Handicraft.query().preload('categories', (query) => {
      query.pivotColumns(['handicraft_id'])
    })

    const rentalCategories = await Category.query().where('product_type', 'rental')
    const handicraftCategories = await Category.query().where('product_type', 'handicraft')
    return view.render('admin/dashboard', { pageTitle: 'Admin- Dashboard', rentals, handicrafts, rentalCategories, handicraftCategories })
  }
}