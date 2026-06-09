import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  saveDeviceToken,
} from '../controllers/notification.controller.js';

const router = Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notifications APIs
 */

router.get('/', getNotifications);

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 */
router.patch('/read-all', markAllAsRead);

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 */
router.patch('/:id/read', markAsRead);

/**
 * @swagger
 * /notifications/device-token:
 *   post:
 *     summary: Save device token
 *     tags: [Notifications]
 */
router.post('/device-token', saveDeviceToken);
export default router;