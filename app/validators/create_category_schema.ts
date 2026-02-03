
import vine from '@vinejs/vine'

export const createCategorySchema = vine.compile(vine.object({
    product_type: vine.enum(['handicraft', 'rental', undefined]),
    name: vine.string().unique(async (db, value, field) => {
        const product_type = await field.data?.product_type
        //const id = field.meta?.id
        const existingCategory = await db
            .from('categories')
            .where('product_type', product_type)
            .where('name', value)
            .first();
        return !existingCategory
    }),

}));