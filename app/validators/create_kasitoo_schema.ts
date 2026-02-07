import vine from '@vinejs/vine'

export const createKasitooSchema = vine.compile(vine.object({
    item_name: vine.string().minLength(3).maxLength(255),
    //image_url: vine.string().optional(),
    price: vine.number().decimal(2).positive(),
    description: vine.string().minLength(10).maxLength(1000),
    stock_amount: vine.number().positive(),
    isVisible: vine.boolean(),
}));