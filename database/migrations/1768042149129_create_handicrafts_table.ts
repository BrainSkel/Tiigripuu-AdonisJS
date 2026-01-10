import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'handicrafts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('Slug').notNullable().unique()
      table.string('Category').notNullable()
      table.string('Item_name').notNullable()
      table.string('Image_url').notNullable()
      table.integer('Price').unsigned().notNullable()
      table.text('Description').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}