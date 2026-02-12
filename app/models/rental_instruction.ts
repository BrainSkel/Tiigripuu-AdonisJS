import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import RentalDetail from './rental_detail.js'

export default class RentalInstruction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => RentalDetail)
  declare rentalDetail: BelongsTo<typeof RentalDetail>

  @column()
  declare fileName: string

  @column()
  declare fileOrder: number

  @column()
  declare rentalDetailId: number

  @column()
  declare instructionUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}