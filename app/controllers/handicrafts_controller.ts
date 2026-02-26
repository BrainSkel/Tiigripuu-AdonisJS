import { Redirect, type HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import Category from '#models/category'
import { createProductSchema } from '#validators/create_product_schema'
import { createKasitooDetailsSchema } from '#validators/create_kasitoo_details_schema'
import HandicraftDetail from '#models/handicraft_detail'
import ProductImage from '#models/product_image'
import { randomUUID } from 'crypto'

export default class HandicraftsController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    const handicrafts = await Product.query()
      .where('product_type', 'handicraft')
      .preload('categories', (query) => {
        query.pivotColumns(['product_id'])
      }).preload('images')
    return view.render('handicrafts/view', { handicrafts, pageTitle: 'Kasitöö' })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    const categories = await Category.query().from('categories').select('*').whereNotNull('allowed_product_types')
    const handicraftCategories = categories.filter(category => category.allowed_product_types.includes('handicraft'))
    return view.render('handicrafts/create', { categories, handicraftCategories, pageTitle: 'Uus kasitöö' })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductSchema)
    const categories = request.input('categories') || [];
    const data = { ...payload, product_type: 'handicraft' }
    const newProduct = await Product.create(data);
    const payloadDetails = await request.validateUsing(createKasitooDetailsSchema)

    await HandicraftDetail.create({
      productId: newProduct.id,
      handicraftDetails: payloadDetails.handicraft_details,
    })
    await newProduct.related('categories').attach(categories.map((id: string) => Number(id)));

    await this.uploadImagesToDrive(request, newProduct.id);

    return response.redirect().toRoute('admin.dashboard');


  }


  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    const handicraft = await Product.findBy('slug', params.slug)
    return view.render('handicrafts/show', { handicraft, pageTitle: handicraft?.itemName })
  }

  /**
   * Edit individual record
   */
  async edit({ params, view }: HttpContext) {
    const handicraft = await Product.query()
      .where('slug', params.slug)
      .preload('categories')
      .preload('images')
      .preload('handicraftDetail')
      .firstOrFail();

    const id = handicraft.id;

    //const categories = await Category.query().from('categories').select('*').whereNotNull('allowed_product_types')
    const notInProductCategories = await Category.query().where('allowed_product_types', 'handicraft').whereNotIn('id', (sub) => {
      sub.from('product_categories').select('category_id').where('product_id', id)
    })

    return view.render('handicrafts/edit', { pageTitle: 'Edit', handicraft, notInProductCategories })
  }

  /**
   * Handle form submission for the edit action
   */

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductSchema)
    const product = await Product.query().where('slug', params.slug).firstOrFail();
    const detailsPayload = await request.validateUsing(createKasitooDetailsSchema)
    console.log(detailsPayload)
    product.handicraftDetail?.merge({ handicraftDetails: detailsPayload.handicraft_details }).save()


    const isVisible = await request.input('is_visible') === '1';

    const data = { ...payload, isVisible }

    product?.merge(data)
    await product?.save()



    if (request.files('image_url') != null) {
      await this.uploadImagesToDrive(request, product?.id as number);
    }

    const slugs = request.input('category', [])
    const slugArray = Array.isArray(slugs) ? slugs : [slugs];

    const categories = await Category
      .query()
      .whereIn('slug', slugArray)

    //await product?.related('handicraftDetail').save(productDetails)

    await product?.related('categories').sync(categories.map(c => c.id))

    return response.redirect().toRoute('admin.dashboard');
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const handicraft = await Product.query().where('slug', params.slug).firstOrFail();

    await handicraft?.delete()
    return response.redirect().toRoute('admin.dashboard')
  }

    async normalizeName(name: any) {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
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
        const safeName = await this.normalizeName(product?.itemName)
        imageName = `${product?.productType}_${imageOrder}${safeName}_${randomUUID()}.${img.extname}`
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
}