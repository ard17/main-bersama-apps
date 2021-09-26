import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Venue from 'App/Models/Venue'
import Booking from 'App/Models/Booking'

export default class Field extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: 'futsal' | 'minisoccer' | 'soccer' | 'basketball' | 'volleyball'

  @column()
  public venue_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Venue, {
    foreignKey: 'venue_id',
  })
  public venue: BelongsTo<typeof Venue>

  @hasMany(() => Booking, {
    foreignKey: 'field_id'
  })
  public bookings: HasMany<typeof Booking>

  @hasMany(() => Booking, {
    foreignKey: 'field_id'
  })
  public count: HasMany<typeof Booking>
}
