import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { randomBytes } from 'crypto'
import { nanoid } from 'nanoid'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderNumber: string


  @column()
  declare productId: number | null

  @column()
  declare productType: 'rental' | 'handiwork' | 'custom_handiwork'

  @column()
  declare status: 'pending' | 'confirmed' | 'completed' | 'cancelled'

  @column()
  declare customerFirstName: string

  @column()
  declare customerLastName: string

  @column()
  declare customerEmail: string


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static async generateOrderNumber(order: Order) {
    const random = nanoid(6).toUpperCase()
    const orderType = await order.productType[0].toUpperCase()

    const orderNumber = `${orderType}-${DateTime.now().toFormat('ddMM')}${random}`

    order.orderNumber = orderNumber
  }
}