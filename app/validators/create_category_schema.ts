
import vine from '@vinejs/vine'

export const createCategorySchema = vine.compile(vine.object({
    allowed_product_types: vine.array(vine.enum(['rental', 'handicraft', 'custom'])),
    name: vine.string(),

}));