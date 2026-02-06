import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('slug').notNullable().unique()
      table.enum('product_type', ['rental', 'handicraft']).notNullable()
      table.string('item_name').notNullable()
      table.decimal('price', 10, 2).notNullable()
      table.text('description').notNullable()
      table.integer('stock_amount').notNullable().defaultTo(0)
      table.boolean('is_visible').notNullable().defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}