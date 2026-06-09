
import { Router } from 'express';
import { getCategories } from '../controllers/category.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Categories APIs
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 */
router.get('/', getCategories);
export default router;