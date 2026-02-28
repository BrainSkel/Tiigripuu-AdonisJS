import vine from '@vinejs/vine'

export const createProductSchema = vine.compile(vine.object({
    item_name: vine.string().maxLength(64).minLength(2),
    price: vine.number().positive().decimal([0,2]),
    description: vine.string().minLength(6).maxLength(1000),
    stock_amount: vine.number().positive(),
    //is_visible: vine.boolean(),



}));