import vine from '@vinejs/vine'

export const createRentalDetailsSchema = vine.compile(vine.object({
        rental_info: vine.string().minLength(5).maxLength(1000),
}));