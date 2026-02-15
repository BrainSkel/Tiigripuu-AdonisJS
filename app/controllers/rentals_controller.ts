import type { HttpContext } from '@adonisjs/core/http'
import { createRentalSchema } from '#validators/create_laenutus_schema'
import Product from '#models/product'
//import { cuid } from '@adonisjs/core/helpers'
import ProductImage from '#models/product_image'
import RentalInstruction from '#models/rental_instruction'
import RentalDetail from '#models/rental_detail'
import Category from '#models/category'
import { createRentalDetailsSchema } from '#validators/create_rental_details_schema'
import { createProductSchema } from '#validators/create_product_schema'
import { json } from 'stream/consumers'

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
    const categories = await Category.query().from('categories').select('*').whereNotNull('allowed_product_types')
    const rentalCategories = categories.filter(category => category.allowed_product_types.includes('rental'))
    return view.render('rentals/create', { pageTitle: 'Uus laenutus', rentalCategories })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductSchema)
    const categories = request.input('categories') || [];
    const data = { ...payload, product_type: 'rental' }
    const newProduct = await Product.create(data);
    const payloadDetails = await request.validateUsing(createRentalDetailsSchema)
    await RentalDetail.create({
      productId: newProduct.id,
      rentalInfo: payloadDetails.rental_info,
    })
    await newProduct.related('categories').attach(categories.map((id: string) => Number(id)));

    await this.uploadFilesToDrive(request, newProduct.id);


    await this.uploadImagesToDrive(request, newProduct.id);


    return response.redirect().toRoute('admin.dashboard');
  }


  /**
   * Edit individual record
   */
  async edit({ view, params }: HttpContext) {
    const rental = await Product.query()
      .where('slug', params.slug)
      .preload('images')
      .preload('rentalDetail', (query) => {
        query.preload('instructions')
      })
      .preload('categories').firstOrFail();

    const id = rental.id;

    const categories = await Category.query().from('categories').select('*').whereNotNull('allowed_product_types')
    const rentalCategories = categories.filter(category => category.allowed_product_types.includes('rental'))
    const notInProductCategories = await Category.query().where('allowed_product_types', 'rental').whereNotIn('id', (sub) => {
      sub.from('product_categories').select('category_id').where('product_id', id)
    })
    return view.render('rentals/edit', { pageTitle: 'Edit', rental, notInProductCategories })
  }

  /**
   * Handle form submission for the edit action
   */

  //uncomment after implementing
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductSchema)
    const product = await Product.findByOrFail('slug', params.slug)
    const productImages = await product.related('images').query()


    const isVisible = await request.input('is_visible') === '1';

    const data = { ...payload, isVisible: isVisible }


    product.merge(data)
    await product.save()

    if (request.files('imageUrl') != null) {
      await this.uploadImagesToDrive(request, product.id); // Upload image to drive
    }
    if (request.input('instructions') != null) {
      await this.uploadFilesToDrive(request, product.id); // Upload instruction files to drive
    }

    const slugs = request.input('category', [])
    const slugArray = Array.isArray(slugs) ? slugs : [slugs]



    const categories = await Category
      .query()
      .whereIn('slug', slugArray)

    //await Product.query().where('slug', params.slug).update(data);
    await product.related('categories').sync(categories.map(c => c.id))

    return response.redirect().toRoute('admin.dashboard');
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
    return response.redirect().toRoute('admin.dashboard');
  }





  async uploadImagesToDrive(request: any, productId: number) {
    const product = await Product.find(productId);
    await product?.load('images');
    const image = request.files('image_url', {
      size: '10mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })
    const imgAmount = product?.images.length || 0;
    let imageOrder = imgAmount;
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


      const dispalyInGallery = request.input('display_in_gallery') === '1' ? true : false;
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
    const rows = request.input('instructions', []);
    let fileOrder = 0;
    for (const row of rows) {
      fileOrder++;
      const file = row.file ? row.file : null;
      const file_Name = row.file_name ? row.file_name : `instruction_${fileOrder}`;
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
        fileName: file_Name,
        fileOrder: fileOrder,
        rentalDetailId: productId,
      })
    }
  }


}