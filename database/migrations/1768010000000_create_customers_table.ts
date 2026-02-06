import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').notNullable()
      table.string('phone_number').nullable()


      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}