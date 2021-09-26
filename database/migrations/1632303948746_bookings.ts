import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Bookings extends BaseSchema {
  protected tableName = 'bookings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.dateTime('play_date_start', { precision: 6 })
      table.dateTime('play_date_end', { precision: 6 })
      table.integer('user_id_booking').unsigned().references('users.id').notNullable().onDelete('CASCADE')
      table.integer('field_id').unsigned().references('fields.id').notNullable().onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
