import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rental_instructions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('file_name').notNullable()
      table.integer('file_order').notNullable()
      table.integer('rental_detail_id').unsigned().references('product_id').inTable('rental_details').onDelete('CASCADE')
      table.string('instruction_url').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}