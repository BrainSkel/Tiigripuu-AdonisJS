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
import ImagesController from '#controllers/images_controller';
import OrdersController from '#controllers/orders_controller';
import RentalsController from '#controllers/rentals_controller';
import InstructionsController from '#controllers/instructions_controller';
import ShoppingCartsController from '#controllers/shopping_carts_controller';
import Order from '#models/order';
import router from '@adonisjs/core/services/router';
import MainsController from '#controllers/mains_controller';
import { middleware } from '#start/kernel';
import SessionController from '#controllers/session_controller';


router.get('/', [MainsController, 'index']).as('home').use(middleware.optionalAuth())






//------------------------------
// Optional authentication sites
//------------------------------
router.group(() => {

    router.resource('rentals', RentalsController).params({
        rentals: 'slug',
    }).only(['show', 'index'])

    router.resource('handicrafts', HandicraftsController).params({
        handicrafts: 'slug',
    }).only(['show', 'index'])

    router.resource('shopping-carts', ShoppingCartsController).params({
        'shopping-carts': 'id',
    })

    router.resource('orders', OrdersController).params({
        'orderId': 'id',
    }).only(['index', 'show', 'create', 'store'])


}).use(middleware.optionalAuth())







//------------------------------
// Required authentication sites   (ADMIN)
//------------------------------
router.group(() => {

    router.resource('rentals', RentalsController).params({
        rentals: 'slug',
    }).except(['show', 'index'])

    router.resource('handicrafts', HandicraftsController).params({
        handicrafts: 'slug',
    }).except(['show', 'index'])

        router.resource('orders', OrdersController).params({
        'orderId': 'id',
    }).except(['index', 'show', 'create', 'store'])

    router.resource('images', ImagesController).params({
        images: 'id',
    })

    router.resource('instructions', InstructionsController).params({
        instructions: 'id',
    })


    router.group(() => {
        // router.get('/orders', [AdminController, 'orders']).as('admin.orders');
        //router.patch('/orders/:id', [OrdersController, 'updateStatus']).as('order.updateStatus');
        router.get('/dashboard', [AdminController, 'dashboard']).as('admin.dashboard');
        router.post('/categories', [CategoriesController, 'store']).as('categories.store');
        router.delete('/destroy/:slug', [CategoriesController, 'destroy']).as('categories.destroy');
    })



    router.delete('/logOut', [SessionController, 'destroy']).as('auth.logOut')

}).use(middleware.auth())
    .prefix('/admin')






//------------------------------
// Guest Only sites (login)
//------------------------------
router.group(() => {
    router.get('/login', [SessionController, 'index']).as('auth.login')
    router.post('/login', [SessionController, 'store']).as('auth.store')
}).use(middleware.guest())
