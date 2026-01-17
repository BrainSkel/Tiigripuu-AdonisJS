import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('order_number').notNullable().unique()
      table.string('customer_name').notNullable()
      table.string('customer_email').notNullable()

      table.string('order_type').notNullable()
      table.foreign('order_id').references('id').inTable('laenutuses').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}