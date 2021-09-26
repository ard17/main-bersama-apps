import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 45).notNullable()
      table.string('email', 45).unique().notNullable()
      table.string('password', 180).notNullable()
      table.enu('role', ['owner', 'user']).defaultTo('user')
      table.string('remember_me_token').nullable()
      table.boolean('is_verified').defaultTo(false)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
