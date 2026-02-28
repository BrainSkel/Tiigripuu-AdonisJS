import vine from '@vinejs/vine'

export const createCustomerSchema = vine.compile(vine.object({
    first_name: vine.string().maxLength(64),
    last_name: vine.string().maxLength(64),
    email: vine.string().email(),
    phone_number: vine.string().maxLength(20).nullable(),


    

}));