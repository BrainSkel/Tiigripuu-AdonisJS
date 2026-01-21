
import vine from '@vinejs/vine'

export const createCategorySchema = vine.compile(vine.object({
    name: vine.string().unique(async (db, value, field) => {
        //const id = field.meta?.id
        const existingCategory = await db
        .from('categories')
        .where('name', value)
        .first()
        return !existingCategory
    }),
    product_type: vine.enum(['handicraft', 'rental', undefined]),

}));