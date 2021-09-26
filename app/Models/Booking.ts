import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Field from 'App/Models/Field'
import User from 'App/Models/User'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public play_date_start: DateTime

  @column()
  public play_date_end: DateTime

  @column()
  public user_id_booking: number

  @column()
  public field_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Field, {
    foreignKey: 'field_id',
  })
  public field: BelongsTo<typeof Field>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'bookings_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'users_id',
    pivotTable: 'users_has_bookings'
  })
  public players: ManyToMany<typeof User>
}
