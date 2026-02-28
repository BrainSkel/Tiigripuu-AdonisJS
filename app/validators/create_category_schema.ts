
import vine from '@vinejs/vine'

export const createCategorySchema = vine.compile(vine.object({
    allowed_product_types: vine.enum(['rental', 'handicraft', 'custom'] ),
    name: vine.string().minLength(2).maxLength(20),

}));