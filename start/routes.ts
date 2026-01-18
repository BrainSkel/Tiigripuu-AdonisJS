/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import AdminController from '#controllers/admin_controller';
import HandicraftsController from '#controllers/handicrafts_controller';
import RentalsController from '#controllers/rentals_controller';
import router from '@adonisjs/core/services/router'


router.on('/').render('pages/home')


router.resource('rentals', RentalsController).params({
    rentals: 'Slug',
})
router.resource('handicrafts', HandicraftsController).params({
    handicrafts: 'Slug',
})

router.get('/admin/orders', [AdminController, 'orders']).as('admin.orders');
router.get('/admin/dashboard', [AdminController, 'dashboard']).as('admin.dashboard');