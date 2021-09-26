import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import Field from 'App/Models/Field'
import BookingValidator from 'App/Validators/BookingValidator'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class BookingsController {
  public async index({ response }: HttpContextContract) {
    const bookings = await Booking.query().select('id', 'play_date_start', 'play_date_end', 'user_id_booking', 'field_id')
    response.ok({ message: 'success', data: bookings })
  }

  public async store({ params, request, response, auth }: HttpContextContract) {
    try {
      await request.validate(BookingValidator)
      const field_id = request.input('field_id')
      const venue_id = params.venue_id
      const user = auth.user?.id
      const venue = await Field.query().where('venue_id', venue_id).andWhere('id', field_id).firstOrFail()
      await venue.related('bookings').create({
        play_date_start: request.input('play_date_start'),
        play_date_end: request.input('play_date_end'),
        user_id_booking: user
      })
      response.created({ message: 'berhasil booking' })
    } catch (error) {
      if (error.messages) {
        return response.unprocessableEntity({ message: 'failed', error: error.messages })
      } else {
        return response.unprocessableEntity({ message: 'failed', error: error.message })
      }
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      // Using ORM //
      const booking = await Booking.query()
        .select('id', 'play_date_start', 'play_date_end')
        .where('id', '=', params.id)
        .withCount('players', (query) => {
          query.as('players_count')
        })
        .preload('players', (query) => {
          query.select('id', 'name', 'email')
        })
        .firstOrFail()
      const { id, play_date_start, play_date_end, players } = booking.toJSON()
      const players_count = booking.$extras.players_count
      response.ok({ message: 'success!', data: { id, play_date_start, play_date_end, players_count, players } })
    } catch (error) {
      if (error.messages) {
        return response.unprocessableEntity({ message: 'failed', error: error.messages })
      } else {
        return response.unprocessableEntity({ message: 'failed', error: error.message })
      }
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    const updateSchema = schema.create({
      play_date_start: schema.date.optional({
        format: 'yyyy-MM-dd HH:mm:ss'
      }, [
        rules.after('today')
      ]),
      play_date_end: schema.date.optional({
        format: 'yyyy-MM-dd HH:mm:ss'
      }, [
        rules.after('today')
      ]),
    })
    try {
      await request.validate({ schema: updateSchema })
      // Using ORM //
      const booking = await Booking.findOrFail(params.id)
      booking.play_date_start = request.input('play_date_start')
      booking.play_date_end = request.input('play_date_end')
      booking.save()
      response.ok({ message: 'data updated' })
    } catch (error) {
      if (error.messages) {
        return response.unprocessableEntity({ message: 'failed', error: error.messages })
      } else {
        return response.unprocessableEntity({ message: 'failed', error: error.message })
      }
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const booking = await Field.findOrFail(params.id)
    await booking.delete()
    response.ok({ message: "Data deleted" })
  }

  public async join({ response, auth, params }: HttpContextContract) {
    const booking = await Booking.findOrFail(params.id)
    let user = auth.user!

    try {
      await booking.related('players').attach([user.id])
      response.ok({ message: "Success Join" })
    } catch (error) {
      if (error.messages) {
        return response.unprocessableEntity({ message: 'failed', error: error.messages })
      } else {
        return response.unprocessableEntity({ message: 'failed', error: error.message })
      }
    }
  }

  public async unjoin({ response, auth, params }: HttpContextContract) {
    const booking = await Booking.findOrFail(params.id)
    let user = auth.user!

    await booking.related('players').detach([user.id])
    response.ok({ message: "Success Unjoin" })
  }

  public async schedule({ response, auth }: HttpContextContract) {
    let user = auth.user!.id
    const bookings = await Booking.query()
      .select('id', 'play_date_start', 'play_date_end', 'user_id_booking', 'field_id')
      .where('user_id_booking', user)
    response.ok({ message: 'success', data: bookings })
  }
}
