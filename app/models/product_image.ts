import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

export default class ProductImage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column()
  declare productId: number

  @column()
  declare dispalyInGallery: boolean

  @column()
  declare imageUrl: string

  @column()
  declare displayOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}