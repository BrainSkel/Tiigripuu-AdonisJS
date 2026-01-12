import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'handicrafts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('Slug').notNullable().unique()
      table.string('Category').notNullable()
      table.string('Item_name').notNullable()
      table.string('Image_url').notNullable()
      table.integer('Price').unsigned().notNullable()
      table.text('Description').notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('Slug')
      table.dropColumn('Category')
      table.dropColumn('Item_name')
      table.dropColumn('Image_url')
      table.dropColumn('Price')
      table.dropColumn('Description')
    })
  }
}