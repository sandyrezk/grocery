import { Router } from 'express';

import { protect } from '../middlewares/auth.middleware.js';

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cart.controller.js';

const router = Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping Cart APIs
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 */
router.post('/items', addToCart);

/**
 * @swagger
 * /cart/items/{id}:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 */
router.patch('/items/:id', updateCartItem);

/**
 * @swagger
 * /cart/items/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 */
router.delete('/items/:id', removeFromCart);

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 */
router.delete('/', clearCart);

export default router;