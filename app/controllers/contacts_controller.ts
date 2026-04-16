import mail from '@adonisjs/mail/services/main'
import env from '#start/env';
import type { HttpContext } from '@adonisjs/core/http'

export default class ContactsController {

    public async send({ request, response }: HttpContext) {
        const data = request.all();
        

    await mail.send((message) => {
        message
        .to(env.get('ADMIN_EMAIL'))
        .from(data.email)
        .subject(data.name + ': ' + data.subject)
        .htmlView('emails/contactUs', { data: data })
    })
    return response.redirect().back()
    }
}