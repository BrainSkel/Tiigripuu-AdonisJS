import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { createCategorySchema } from '#validators/create_category_schema'

export default class CategoriesController {
    public async store({ request, response }: HttpContext) {
        const data = await request.validateUsing(createCategorySchema)
        console.log(data);

        await Category.create({ name: data.name, allowed_product_types: data.allowed_product_types})
        return response.redirect().back()
    }

    async destroy({ params, response }: HttpContext) {
        const category = await Category.findBy('slug', params.slug)
        await category?.delete()
        return response.redirect().back()
    }
}