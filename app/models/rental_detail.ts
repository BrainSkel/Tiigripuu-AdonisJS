import { DateTime } from 'luxon'
import { BaseModel, belongsTo, hasMany, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Product from './product.js'
import RentalInstruction from './rental_instruction.js'

export default class RentalDetail extends BaseModel {

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @hasMany(() => RentalInstruction)
  declare instructions: HasMany<typeof RentalInstruction>
  


  @column()
  declare productId: number

  @column()
  declare rentalInfo: string


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}