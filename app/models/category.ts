import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import string from '@adonisjs/core/helpers/string'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare product_type: 'handicraft' | 'laenutus'


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime


  @beforeCreate()
  public static async generateslug(categories: Category) {

    const base = await (categories.name ?? 'category')
    const slugBase = string.slug(base)
    categories.slug = `${slugBase}-${Date.now()}`
  }
}
