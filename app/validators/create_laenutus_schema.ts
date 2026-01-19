import vine from '@vinejs/vine'

export const createRentalSchema = vine.compile(vine.object({
    item_name: vine.string().minLength(3).maxLength(255),
    //image_url: vine.string().optional(),
    price: vine.number().min(0),
    description: vine.string().minLength(10).maxLength(1000),
}));