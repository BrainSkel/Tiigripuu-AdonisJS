import vine from '@vinejs/vine'

export const createProductSchema = vine.compile(vine.object({
    item_name: vine.string().maxLength(255),
    price: vine.number().decimal(2).positive(),
    description: vine.string().maxLength(1000),
    stock_amount: vine.number().positive(),
    //is_visible: vine.boolean(),



}));