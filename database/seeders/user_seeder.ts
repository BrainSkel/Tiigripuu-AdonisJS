import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    const userData = {full_name: 'TP Admin', email: 'admin@tiigripuu.ee',password: 'Test123'}
    await User.create(userData)
  }
}