import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Laenutus extends BaseModel {
  @column({ isPrimary: true }) 
  declare id: number
  
  @column({columnName: 'Slug'})
  declare Slug: string
  
  @column({columnName: 'Item_name'})
  declare Item_name: string
  
  @column({columnName: 'Image_url'})
  declare Image_url: string | null
  
  @column({columnName: 'Price'})
  declare Price: number
  
  @column({columnName: 'Description'})
  declare Description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}