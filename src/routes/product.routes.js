
import { Router } from 'express';

import {
  getProducts,
  searchProducts,
  filterProducts,
  getRecommended,
  getProductById,
  getSimilarProducts,
} from '../controllers/product.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products APIs
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 */
router.get('/', getProducts);

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/search', searchProducts);

/**
 * @swagger
 * /products/filter:
 *   get:
 *     summary: Filter products
 *     tags: [Products]
 */
router.get('/filter', filterProducts);

/**
 * @swagger
 * /products/recommended:
 *   get:
 *     summary: Get recommended products
 *     tags: [Products]
 */
router.get('/recommended', getRecommended);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /products/{id}/similar:
 *   get:
 *     summary: Get similar products
 *     tags: [Products]
 */
router.get('/:id/similar', getSimilarProducts);

export default router;