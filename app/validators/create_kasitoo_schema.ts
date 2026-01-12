import vine from '@vinejs/vine'

export const createKasitooSchema = vine.compile(vine.object({
    Item_name: vine.string().minLength(3).maxLength(255),
    //Image_url: vine.string().optional(),
    Price: vine.number().min(0),
    Description: vine.string().minLength(10).maxLength(1000),
    Category: vine.string().minLength(3).maxLength(255),
}));