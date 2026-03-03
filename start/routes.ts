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
import {middleware} from '#start/kernel';
import SessionController from '#controllers/session_controller';


router.get('/', [MainsController, 'index'] ).as('home');


router.resource('rentals', RentalsController).params({
    rentals: 'slug',
})
router.resource('handicrafts', HandicraftsController).params({
    handicrafts: 'slug',
})
router.resource('images', ImagesController).params({
    images: 'id',
})
router.resource('instructions', InstructionsController).params({
    instructions: 'id',
})
router.resource('shopping-carts', ShoppingCartsController).params({
    'shopping-carts': 'id',
})

router.resource('orders', OrdersController).params({
    'orderId': 'id',
})


// router.get('/orders/create', [OrdersController, 'create']).as('orders.create')
// router.post('/orders', [OrdersController, 'store']).as('orders.store')
// router.get('/orders/edit/:orderId', [OrdersController, 'edit']).as('orders.edit')
router.get('/auth/login', [SessionController, 'login']).as('auth.login')
router.post('/auth/store', [SessionController, 'store']).as('session.store').use(middleware.guest()) // we dont want logged in user to log in again
router.get('/admin/orders', [AdminController, 'orders']).as('admin.orders').use(middleware.auth()); // we dont want not logged in users to see this
router.patch('/admin/orders/:id', [OrdersController, 'updateStatus']).as('order.updateStatus').use(middleware.auth());
router.get('/admin/dashboard', [AdminController, 'dashboard']).as('admin.dashboard').use(middleware.auth());
router.post('/admin/categories', [CategoriesController, 'store']).as('categories.store').use(middleware.auth());
router.delete('/admin/destroy/:slug', [CategoriesController, 'destroy']).as('categories.destroy').use(middleware.auth());