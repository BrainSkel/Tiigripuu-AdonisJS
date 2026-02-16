import vine from '@vinejs/vine'

export const createCustomerSchema = vine.compile(vine.object({
    customer_first_name: vine.string().maxLength(255),
    customer_last_name: vine.string().maxLength(255),
    customer_email: vine.string().email(),
    customer_phone_number: vine.string().maxLength(20).nullable(),


    

}));