import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'handicraft_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('handicraft_id').unsigned().references('handicrafts.id')
      table.integer('category_id').unsigned().references('categories.id')

      table.unique(['handicraft_id', 'category_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}