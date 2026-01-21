import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import session from '#config/session'
import { createCategorySchema } from '#validators/create_category_schema'

export default class CategoriesController {
    public async store({ request, response }: HttpContext) {
        const data = await request.validateUsing(createCategorySchema)

        await Category.create({name: data.name, product_type: data.product_type})
        return response.redirect().back()
    }
}