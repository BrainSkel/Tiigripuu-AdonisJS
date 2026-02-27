import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class MainsController {
    async index( {view} :HttpContext ){
        const rentals = await Product.query().where('product_type', 'rental').preload('images').preload('rentalDetail').preload('categories')
        const handicrafts = await Product.query().where('product_type', 'handicraft').preload('images').preload('handicraftDetail').preload('categories')

        return view.render('pages/home', {rentals: rentals, handicrafts: handicrafts})

    }
}