import type { HttpContext } from '@adonisjs/core/http'
import { createRentalSchema } from '#validators/create_laenutus_schema'
import Product from '#models/product'
//import { cuid } from '@adonisjs/core/helpers'
import ProductImage from '#models/product_image'
import RentalInstruction from '#models/rental_instruction'
import RentalDetail from '#models/rental_detail'
import { createRentalDetailsSchema } from '#validators/create_rental_details_schema'

export default class RentalsController {
  /**
   * Display a list of resource
   */
  public async index({ view }: HttpContext) {
    const rentals = await Product.query().where('product_type', 'rental').preload('images')            // plain objects
    return view.render('rentals/view', { pageTitle: 'Rental', rentals })
  }
  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    console.log(params);
    const slug = params.slug;
    const rental = await Product.query().where('slug', slug).preload('images').firstOrFail();
    return view.render('rentals/show', { pageTitle: rental?.itemName, rental })
  }


  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    return view.render('rentals/create', { pageTitle: 'Uus laenutus' })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createRentalSchema)



    const data = { ...payload, product_type: 'rental' }
    const newProduct = await Product.create(data);
    const payloadDetails = await request.validateUsing(createRentalDetailsSchema)
    await RentalDetail.create({
      productId: newProduct.id,
      rentalInfo: payloadDetails.rental_info,
    })
    await this.uploadImagesToDrive(request, newProduct.id);
    await this.uploadFilesToDrive(request, newProduct.id);

    console.log(data);
    return response.redirect().toRoute('admin.dashboard');
  }


  /**
   * Edit individual record
   */
  async edit({ view, params }: HttpContext) {
    const rentals = await Product.findBy('slug', params.slug)

    return view.render('rentals/edit', { pageTitle: 'Edit', rentals })
  }

  /**
   * Handle form submission for the edit action
   */

  //uncomment after implementing
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createRentalSchema)
    const product = await Product.query().where('slug', params.slug).firstOrFail();
    let imageName = request.input('imageUrl'); // Default to existing image name
    if (request.file('imageUrl') !== null) {
      imageName = await this.uploadImagesToDrive(request, product.id); // Upload image to drive
    }
    const data = { ...payload, image_url: imageName }

    await Product.query().where('slug', params.slug).update(data);

    return response.redirect().toRoute('rentals.index');
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const rental = await Product
      .query()
      .where('slug', params.slug)
      .firstOrFail();

    await rental.delete();
    return response.redirect().toRoute('rentals.index');
  }



  async uploadImagesToDrive(request: any, productId: number) {
    const product = await Product.find(productId);
    const image = request.files('image_url', {
      size: '10mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })
    let imageOrder = 0;
    for (const img of image) {
      imageOrder++;
      let imageName = ''
      if (img) {
        imageName = `${product?.productType}_${imageOrder}${product?.itemName.replace(/\s+/g, '_')}.${img.extname}`
        const key = `uploads/${imageName}`
        await img.moveToDisk(key)
      } else {
        imageName = 'default.jpg'
      }


      const dispalyInGallery = request.input('display_in_gallery') === 'on' ? true : false;

      ProductImage.create({
        imageUrl: imageName,
        productId: productId,
        dispalyInGallery: dispalyInGallery,
        displayOrder: imageOrder
      })
    }
  }

  async uploadFilesToDrive(request: any, productId: number) {
    const product = await Product.find(productId);
    const files = request.files('rental_instructions', {
      size: '10mb',
      extnames: ['pdf', 'doc', 'docx'],
    })
    let fileOrder = 0;
    for (const file of files) {
      fileOrder++;
      let fileName = ''
      if (file) {
        fileName = `${product?.productType}_${fileOrder}${product?.itemName.replace(/\s+/g, '_')}.${file.extname}`
        const key = `uploads/${fileName}`
        await file.moveToDisk(key)
      } else {
        fileName = 'default.pdf'
      }

      RentalInstruction.create({
        instructionUrl: fileName,
        rentalDetailId: productId,
      })
    }
  }


}