import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'
import { BaseModel, column, beforeCreate, manyToMany } from '@adonisjs/lucid/orm'
import Category from '#models/category'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Handicraft extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({})
  declare slug: string

  @manyToMany(() => Category, { 
    pivotTable: 'handicraft_categories', 
    pivotColumns: ['handicraft_id'], 
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
  public static async generateslug(handicraft: Handicraft) {

    const base = await (handicraft.itemName ?? 'handicraft')
    const slugBase = string.slug(base)
    handicraft.slug = `H${slugBase}-${Date.now()}`
  }
}