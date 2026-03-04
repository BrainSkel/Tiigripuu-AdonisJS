import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class SessionController {

    async index({ view }: HttpContext) {

        return view.render('auth/login')
    }

    async store({ request, auth, response }: HttpContext) {
        console.log('start')
        const { email, password } = await request.only(['email', 'password'])
        console.log(email, password)
        const user = await User.verifyCredentials(email, password);
        console.log('1')
        await auth.use('web').login(user, !!request.input('remember_me'))
        console.log('logged in')


        return response.redirect().toRoute('admin.dashboard')
    }

    async destroy({ auth, response }: HttpContext) {
        await auth.use('web').logout()
        return response.redirect().toRoute('home')
    }

}