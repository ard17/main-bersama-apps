import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FieldValidator from 'App/Validators/FieldValidator'
import { schema, rules } from "@ioc:Adonis/Core/Validator"
import Field from 'App/Models/Field'
import Venue from 'App/Models/Venue'

export default class FieldsController {
  public async index({ request, response }: HttpContextContract) {
    if (request.qs().name) {
      const field = await Field.findBy('name', request.qs().name)
      response.ok({ message: 'success', data: field })
    } else {
      const field = await Field.all()
      response.ok({ message: 'success', data: field })
    }
  }

  public async store({ params, request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(FieldValidator)
      const venue = await Venue.findOrFail(params.venue_id)
      await venue.related('fields').create(payload)
      response.created({ message: 'created' })
    } catch (err) {
      response.badRequest({ message: 'failed', error: err.messages })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const field = await Field.query()
        .select('id', 'name', 'type', 'venue_id')
        .where('id', '=', params.id)
        .preload('venue', (query) => {
          query.select('id', 'name', 'address', 'phone')
        })
        .preload('bookings', (query) => {
          query.select('id', 'play_date_start', 'play_date_end', 'user_id_booking')
        }).firstOrFail()


      console.log(field);
      response.ok({ message: 'success!', data: field })
    } catch (err) {
      response.notFound({ message: 'failed', error: err.message })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    const updateSchema = schema.create({
      name: schema.string.optional({}, [
        rules.minLength(4)
      ]),
      type: schema.enum.optional(
        ['futsal', 'minisoccer', 'soccer', 'basketball', 'volleyball']
      ),
    })
    try {
      await request.validate({ schema: updateSchema })
      // Using ORM //
      const field = await Field.findOrFail(params.id)
      field.name = request.input('name')
      field.type = request.input('type')
      field.venue_id = request.input('venue_id')
      field.save()
      response.ok({ message: 'data updated' })
    } catch (err) {
      response.badRequest({ message: err.messages })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    // Using ORM //
    const field = await Field.findOrFail(params.id)
    await field.delete()
    response.ok({ message: "Data deleted" })
  }
}
