// import type { HttpContext } from '@adonisjs/core/http'
import { HttpContext } from '@adonisjs/core/http'
import Handicraft from '#models/handicraft'
import Laenutus from '#models/laenutus'
// import { createKasitooSchema } from '#validators/create_kasitoo_schema'
// import { createLaenutusSchema } from '#validators/create_laenutus_schema'
// import { cuid } from '@adonisjs/core/helpers'


export default class AdminController {
      public async orders({ view }: HttpContext) {
        const rentals = await Laenutus.all()       
        const handicrafts = await Handicraft.all() // plain objects
        return view.render('admin/orders', { pageTitle: 'Admin- Orders', rentals, handicrafts })
      }
      public async dashboard({ view }: HttpContext) {
        const rentals = await Laenutus.all()       
        const handicrafts = await Handicraft.all() // plain objects
        return view.render('admin/dashboard', { pageTitle: 'Admin- Dashboard', rentals, handicrafts })
      }
}