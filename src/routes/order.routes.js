
import { Router } from 'express';

import { protect } from '../middlewares/auth.middleware.js';

import {
  getOrders,
  getOrderById,
  createOrder,
  trackOrder,
  setAlert,
} from '../controllers/order.controller.js';

const router = Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Orders APIs
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 */
router.get('/', getOrders);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create order
 *     tags: [Orders]
 */
router.post('/', createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 */
router.get('/:id', getOrderById);

/**
 * @swagger
 * /orders/{id}/tracking:
 *   get:
 *     summary: Track order
 *     tags: [Orders]
 */
router.get('/:id/tracking', trackOrder);

/**
 * @swagger
 * /orders/{id}/alert:
 *   post:
 *     summary: Set order alert
 *     tags: [Orders]
 */
router.post('/:id/alert', setAlert);

export default router;