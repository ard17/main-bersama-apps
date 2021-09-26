import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VenueValidator from 'App/Validators/VenueValidator'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Venue from 'App/Models/Venue'

export default class VenuesController {
  public async index({ request, response }: HttpContextContract) {
    if (request.qs().type) {
      try {
        const type = request.qs().type
        const venue = await Venue.query().select('id', 'name', 'address', 'phone')
          .whereHas('fields', (query) => {
            query.where('type', type)
          })
          .preload('fields', (query) => {
            query.select('id', 'name', 'type').where('type', type)
          })
        response.ok({ message: 'success', data: venue })
      } catch (error) {
        if (error.messages) {
          return response.notFound({ message: 'Row not found', error: error.messages })
        } else {
          return response.notFound({ message: 'Row not found', error: error.message })
        }
      }
    } else {
      const venue = await Venue.query().preload('fields')
      response.ok({ message: 'success', data: venue })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(VenueValidator)
    try {
      const venue = new Venue()
      await venue.fill(payload).save()
      response.created({ message: 'created new venue' })
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
      const venue = await Venue.query().where('id', '=', params.id).preload('fields').firstOrFail()
      response.ok({ message: 'Success', data: venue })
      console.log(venue);

    } catch (error) {
      if (error.messages) {
        return response.notFound({ message: 'failed', error: error.messages })
      } else {
        return response.notFound({ message: 'failed', error: error.message })
      }
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    const updateSchema = schema.create({
      name: schema.string.optional({}, [
        rules.minLength(4)
      ]),
      address: schema.string.optional(),
      phone: schema.string.optional({}, [
        rules.mobile({ strict: true })
      ])
    })
    const payload = await request.validate({ schema: updateSchema })
    const venue = await Venue.findOrFail(params.id)
    await venue.merge(payload).save()
    response.ok({ message: 'Updated' })
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const venue = await Venue.findOrFail(params.id)
      await venue.delete()
      response.ok({ message: "Deleted" })
    } catch (error) {
      return response.notFound({ message: 'Row not found', error: error.message })
    }
  }
}
