import vine from '@vinejs/vine'

export const createOrderSchema = vine.compile(vine.object({


    //product_type: vine.enum(['rental','handicraft','custom_handicraft']),

    status: vine.enum(['pending','confirmed','completed', 'cancelled']),

    

}));