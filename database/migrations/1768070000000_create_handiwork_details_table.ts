import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'handicraft_details'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      //table.increments('id') product id is primary key

      table.integer('product_id').primary().unsigned().references('id').inTable('products').onDelete('CASCADE')
      table.text('handicraft_details')
      
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}