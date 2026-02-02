import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('order_number').notNullable().unique()

      table.integer('product_id').unsigned().nullable()
      table.enu('product_type', ['rental', 'handiwork', 'custom_handiwork']).notNullable()

      table.enu('status', ['pending', 'confirmed', 'completed', 'cancelled']).notNullable().defaultTo('pending')

      table.date('order_completion_date').nullable()

      table.string('customer_first_name').notNullable()
      table.string('customer_last_name').notNullable()
      table.string('customer_email').notNullable()
      table.string('customer_comment').nullable()

      table.index(['product_id', 'product_type'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}