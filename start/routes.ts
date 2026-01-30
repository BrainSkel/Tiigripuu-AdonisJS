/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import AdminController from '#controllers/admin_controller';
import CategoriesController from '#controllers/categories_controller';
import HandicraftsController from '#controllers/handicrafts_controller';
import RentalsController from '#controllers/rentals_controller';
import router from '@adonisjs/core/services/router'


router.on('/').render('pages/home')


router.resource('rentals', RentalsController).params({
    rentals: 'slug',
})
router.resource('handicrafts', HandicraftsController).params({
    handicrafts: 'slug',
})

router.get('/admin/orders', [AdminController, 'orders']).as('admin.orders');
router.get('/admin/dashboard', [AdminController, 'dashboard']).as('admin.dashboard');
router.post('/admin/categories', [CategoriesController, 'store']).as('categories.store');
router.delete('/admin/destroy/:slug', [CategoriesController, 'destroy']).as('categories.destroy');