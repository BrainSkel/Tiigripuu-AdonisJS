import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderNumber: string


  @column()
  declare productId: number | null

  @column()
  declare productType: 'laenutus' | 'handiwork' | 'custom_handiwork'

  @column()
  declare status: 'pending' | 'confirmed' | 'completed' | 'cancelled'

  @column()
  declare customerName: string

  @column()
  declare customerEmail: string


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}