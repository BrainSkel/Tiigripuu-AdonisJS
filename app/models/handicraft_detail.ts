import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

export default class HandicraftDetail extends BaseModel {

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @column({ columnName: 'product_id', isPrimary: true })
  declare productId: number

  @column()
  declare handicraftDetails: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}