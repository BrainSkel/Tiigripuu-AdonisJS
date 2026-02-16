
import HandicraftDetail from '#models/handicraft_detail';
import vine from '@vinejs/vine'

export const createKasitooDetailsSchema = vine.compile(vine.object({
        handicraft_details: vine.string().minLength(5).maxLength(1000),
}));