import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'

export default class CategoriesController {
    public async store({ request, response }: HttpContext) {
        const data = request.only(['name', 'product_type'])

        await Category.create({name: data.name, product_type: data.product_type})
        return response.redirect().back()
    }
}