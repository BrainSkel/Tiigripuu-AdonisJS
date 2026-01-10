/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
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