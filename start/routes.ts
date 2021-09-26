/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})
Route.group(() => {
  Route.resource('venues', 'VenuesController').apiOnly().middleware({
    'index': ['auth', 'verifyAll'],
    'store': ['auth', 'verifyVenueOwner'],
    'show': ['auth', 'verifyAll'],
    'update': ['auth', 'verifyVenueOwner'],
    'destroy': ['auth', 'verifyVenueOwner']
  })
  Route.shallowResource('venues.fields', 'FieldsController').apiOnly().middleware({
    'index': ['auth', 'verifyAll'],
    'store': ['auth', 'verifyVenueOwner'],
    'show': ['auth', 'verifyAll'],
    'update': ['auth', 'verifyVenueOwner'],
    'destroy': ['auth', 'verifyVenueOwner']
  })
  Route.resource('venues.bookings', 'BookingsController').only(['store']).middleware({ 'store': ['auth', 'verifyUser'] })
  Route.resource('/bookings', 'BookingsController').apiOnly().except(['store']).middleware({ '*': ['auth', 'verifyUser'] })
  Route.post('/bookings/:id/join', 'BookingsController.join').as('bookings.join').middleware(['auth', 'verifyUser'])
  Route.post('/bookings/:id/unjoin', 'BookingsController.unjoin').as('bookings.unjoin').middleware(['auth', 'verifyUser'])
  Route.get('/schedules', 'BookingsController.schedule').as('user.schedules').middleware(['auth', 'verifyUser'])
  Route.post('/register', 'AuthController.register').as('users.register')
  Route.post('/login', 'AuthController.login').as('users.login')
  Route.post('/otp-confirmation', 'AuthController.otpConfirm').as('users.confirmation')

}).prefix('/api/v1')