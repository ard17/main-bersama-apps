import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersHasBookings extends BaseSchema {
  protected tableName = 'users_has_bookings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('users_id').unsigned().references('users.id')
      table.integer('bookings_id').unsigned().references('bookings.id')
      table.unique(['users_id', 'bookings_id'])
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
