import mail from '@adonisjs/mail/services/main'
import env from '#start/env';
import type { HttpContext } from '@adonisjs/core/http'

export default class ContactsController {

    public async send({ request, response }: HttpContext) {
        const data = await request.all();
        console.log(data)

        await mail.send((message) => {
            message
                .to(env.get('ADMIN_EMAIL'))
                .from(env.get('MAIL_SENDER'))
                .subject(data.name + ': ' + data.subject)
                .htmlView('emails/contactUs', { data: data })
        })

        console.log('Email sent successfully')
        return response.redirect().back()
    }
}