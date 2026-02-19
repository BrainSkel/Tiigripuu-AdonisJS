import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import CartItem from './cart_item.js'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cartKey: string

  @hasMany(() => CartItem)
  declare items: HasMany<typeof CartItem>

  @column()
  declare status: 'active' | 'completed' | 'abandoned'

  @column.dateTime()
  declare expiresAt: DateTime | null


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}