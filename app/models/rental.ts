import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'
import { BaseModel, column, beforeCreate, manyToMany } from '@adonisjs/lucid/orm'
import Category from '#models/category'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Rental extends BaseModel {
  @column({ isPrimary: true }) 
  declare id: number

  @column()
  declare slug: string

  @manyToMany(() => Category, { 
    pivotTable: 'rental_categories', 
    pivotColumns: ['rental_id'] 
  })
  declare categories: ManyToMany<typeof Category>

  @column()
  declare itemName: string

  @column()
  declare imageUrl: string | null

  @column()
  declare price: number

  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime


  @beforeCreate()
  public static async generateslug(laenutus: Rental) {

    const base = await (laenutus.itemName ?? 'rental')
    const slugBase = string.slug(base)
    laenutus.slug = `${slugBase}-${Date.now()}`
  }
}