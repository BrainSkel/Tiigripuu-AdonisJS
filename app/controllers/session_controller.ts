import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class SessionController {

    async store({ request, auth, response}: HttpContext) {
        const {email, password} = request.only(['email', 'password'])
        const user = await User.verifyCredentials(email, password);

        await auth.use('web').login(user, !!request.input('remember_me'))


        return response.redirect().toRoute('admin.dashboard')
    }

    async destroy({ auth, response} :HttpContext) {
        await auth.use('web').logout()
        return response.redirect('home')
    }

}