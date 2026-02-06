import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany, hasOne } from '@adonisjs/lucid/orm'
import type { ManyToMany, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Category from '#models/category'
import ProductImage from './product_image.js'
import RentalDetail from './rental_detail.js'
import HandicraftDetail from './handicraft_detail.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare slug: string

  @manyToMany(() => Category, {
    pivotTable: 'product_categories',
  })
  declare categories: ManyToMany<typeof Category>

  @hasMany(() => ProductImage)
  declare images: HasMany<typeof ProductImage>


  // if productType = Rental then you can access rentalDetail
  @hasOne(() => RentalDetail)
  declare rentalDetail: HasOne<typeof RentalDetail>
  // if productType = Handiwork then you can access handicraftDetail
  @hasOne(() => HandicraftDetail)
  declare handicraftDetail: HasOne<typeof HandicraftDetail>



  @column()
  declare productType: 'rental' | 'handiwork'

  @column()
  declare itemName: string

  @column()
  declare price: number

  @column()
  declare description: string

  @column()
  declare stockAmount: number

  @column()
  declare isVisible: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}