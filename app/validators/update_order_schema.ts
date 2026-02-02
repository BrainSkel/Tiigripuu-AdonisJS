import vine from '@vinejs/vine'

export const updateOrderSchema = vine.compile(vine.object({
    order_completion_date: vine.date().optional(),
    status: vine.enum(['pending','confirmed','completed', 'cancelled']),



}));