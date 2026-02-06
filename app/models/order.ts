import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'
//import { randomBytes } from 'crypto'
import { nanoid } from 'nanoid'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Customer from './customer.js'
import OrderItem from './order_item.js'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>

  @column()
  declare customerId: number

  @column()
  declare orderNumber: string

  @column()
  declare totalPrice: number

  @column()
  declare status: 'pending' | 'confirmed' | 'completed' | 'cancelled'

  @column()
  declare customerNote?: string

  @column.date()
  declare orderCompletionDate?: DateTime


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  public static async generateOrderNumber(order: Order) {
    const random = nanoid(6).toUpperCase()
    const orderType = "temporary"//await order.productType[0].toUpperCase()

    const orderNumber = `${orderType}-${DateTime.now().toFormat('ddMM')}${random}`

    order.orderNumber = orderNumber
  }
}