import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';

import {
  getChatHistory,
  sendMessage,
} from '../controllers/chat.controller.js';

const router = Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: AI Chat APIs
 */

/**
 * @swagger
 * /chat/history:
 *   get:
 *     summary: Get chat history
 *     tags: [Chat]
 */
router.get('/history', getChatHistory);

/**
 * @swagger
 * /chat/message:
 *   post:
 *     summary: Send chat message
 *     tags: [Chat]
 */
router.post('/message', sendMessage);

export default router;