import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('customer_id').unsigned().references('id').inTable('customers').onDelete('CASCADE')

      table.string('order_number').notNullable().unique()
      table.decimal('total_price', 10, 2).notNullable()
      table.enu('status', ['pending', 'confirmed', 'completed', 'cancelled']).notNullable().defaultTo('pending')
      table.string('customer_note').nullable()
      table.date('order_completion_date').nullable()


      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}