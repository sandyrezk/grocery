
import { Router } from 'express';
import { getOffers } from '../controllers/offer.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Offers
 *   description: Offers APIs
 */

/**
 * @swagger
 * /offers:
 *   get:
 *     summary: Get active offers
 *     tags: [Offers]
 */
router.get('/', getOffers);
export default router;