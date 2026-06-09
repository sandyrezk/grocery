import { Router } from 'express';

import { protect } from '../middlewares/auth.middleware.js';

import {
  getLists,
  getFavorites,
  getHistory,
  getListById,
  createList,
  updateList,
  deleteList,
  addItemToList,
  removeItemFromList,
  addListToCart,
} from '../controllers/list.controller.js';

const router = Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Lists
 *   description: Smart Lists APIs
 */

/**
 * @swagger
 * /lists:
 *   get:
 *     summary: Get all lists
 *     tags: [Lists]
 */
router.get('/', getLists);

/**
 * @swagger
 * /lists:
 *   post:
 *     summary: Create list
 *     tags: [Lists]
 */
router.post('/', createList);

/**
 * @swagger
 * /lists/favorites:
 *   get:
 *     summary: Get favorites
 *     tags: [Lists]
 */
router.get('/favorites', getFavorites);

/**
 * @swagger
 * /lists/history:
 *   get:
 *     summary: Purchase history
 *     tags: [Lists]
 */
router.get('/history', getHistory);

/**
 * @swagger
 * /lists/{id}:
 *   get:
 *     summary: Get list by ID
 *     tags: [Lists]
 */
router.get('/:id', getListById);

/**
 * @swagger
 * /lists/{id}:
 *   put:
 *     summary: Update list
 *     tags: [Lists]
 */
router.put('/:id', updateList);

/**
 * @swagger
 * /lists/{id}:
 *   delete:
 *     summary: Delete list
 *     tags: [Lists]
 */
router.delete('/:id', deleteList);

/**
 * @swagger
 * /lists/{id}/items:
 *   post:
 *     summary: Add product to list
 *     tags: [Lists]
 */
router.post('/:id/items', addItemToList);

/**
 * @swagger
 * /lists/{id}/items/{productId}:
 *   delete:
 *     summary: Remove product from list
 *     tags: [Lists]
 */
router.delete('/:id/items/:productId', removeItemFromList);

/**
 * @swagger
 * /lists/{id}/add-to-cart:
 *   post:
 *     summary: Add list items to cart
 *     tags: [Lists]
 */
router.post('/:id/add-to-cart', addListToCart);
export default router;