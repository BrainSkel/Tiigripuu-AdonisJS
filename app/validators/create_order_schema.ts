import vine from '@vinejs/vine'

export const createOrderSchema = vine.compile(vine.object({
    customer_first_name: vine.string().maxLength(255),
    customer_last_name: vine.string().maxLength(255),
    customer_email: vine.string().email(),

    product_type: vine.enum(['laenutus','handiwork','custom_handiwork']),

    status: vine.enum(['pending','confirmed','completed', 'cancelled']),

    

}));