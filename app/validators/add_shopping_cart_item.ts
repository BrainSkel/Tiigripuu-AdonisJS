
import vine from '@vinejs/vine'

export const addShoppingCartItem = vine.compile(vine.object({
    productId: vine.number(),
    quantity: vine.number().min(0)

}));