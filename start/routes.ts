/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import RentalsController from '#controllers/rentals_controller';
import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home')

router.resource('rentals', RentalsController).params({
    rentals: 'Slug',
})