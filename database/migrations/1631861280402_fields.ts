import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Fields extends BaseSchema {
  protected tableName = 'fields'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').unique().notNullable
      table.enu('type', ['futsal', 'minisoccer', 'soccer', 'basketball', 'volleyball']).notNullable()
      table.integer('venue_id').unsigned().references('venues.id').notNullable().onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
