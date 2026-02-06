import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import string from '@adonisjs/core/helpers/string'
import Product from './product.js'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare allowed_product_type: 'rental' | 'handiwork'

  @manyToMany(() => Product, {
    pivotTable: 'product_categories',
  })
  declare products: ManyToMany<typeof Product>


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime


  @beforeCreate()
  public static async generateslug(categories: Category) {

    const base = await (categories.name ?? 'category')
    const slugBase = string.slug(base)
    categories.slug = `CAT-${slugBase}-${Date.now()}`
  }
}
