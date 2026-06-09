
import { Router } from 'express';

import { protect } from '../middlewares/auth.middleware.js';

import {
  getFAQ,
  contactSupport,
  getAppInfo,
} from '../controllers/support.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Support
 *   description: Support APIs
 */

/**
 * @swagger
 * /support/faq:
 *   get:
 *     summary: Get FAQs
 *     tags: [Support]
 */
router.get('/faq', getFAQ);

/**
 * @swagger
 * /support/info:
 *   get:
 *     summary: Get app info
 *     tags: [Support]
 */
router.get('/info', getAppInfo);

/**
 * @swagger
 * /support/contact:
 *   post:
 *     summary: Contact support
 *     tags: [Support]
 */
router.post('/contact', protect, contactSupport);

export default router;