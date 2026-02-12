import RentalInstruction from '#models/rental_instruction';
import type { HttpContext } from '@adonisjs/core/http'

export default class InstructionsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  //async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params, request, response }: HttpContext) {
            const fileId = request.input('instruction_id');
            const file = await RentalInstruction.find(fileId);
            if (file) {
              await file.delete();
            }
            return response.redirect().back();

  }
}