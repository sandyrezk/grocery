import { Router } from 'express';

import { protect } from '../middlewares/auth.middleware.js';

import {
  getProfile,
  updateProfile,

  // Addresses
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,

  // Payment Methods
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,

  // Settings
  getSettings,
  updateLanguage,
  updateAppearance,

  // Notifications
  getNotificationSettings,
  updateNotificationSettings,

  // Data Management
  downloadData,
  deleteAccount,
} from '../controllers/user.controller.js';

import {
  updateProfileValidator,
  addAddressValidator,
} from '../validators/user.validator.js';

import { validate } from '../middlewares/validation.middleware.js';

const router = Router();

// كل الـ routes دي محتاجة user يكون logged in
router.use(protect);

// ─── Profile ───────────────────────────────────────────────
/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get current user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched
 */
router.get('/profile', getProfile);
/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', updateProfileValidator, validate, updateProfile);

// ─── Delivery Addresses ────────────────────────────────────
/**
 * @swagger
 * /user/addresses:
 *   get:
 *     summary: Get all delivery addresses
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses fetched
 */
router.get('/addresses', getAddresses);
/**
 * @swagger
 * /user/addresses:
 *   post:
 *     summary: Add new address
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *               - country
 *               - city
 *               - street
 *             properties:
 *               label:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               street:
 *                 type: string
 *               building:
 *                 type: string
 *               notes:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Address added successfully
 */
router.post('/addresses', addAddressValidator, validate, addAddress);
/**
 * @swagger
 * /user/addresses/{id}:
 *   put:
 *     summary: Update address
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 */
router.put('/addresses/:id', addAddressValidator, validate, updateAddress);
/**
 * @swagger
 * /user/addresses/{id}:
 *   delete:
 *     summary: Delete address
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 */
router.delete('/addresses/:id', deleteAddress);

// ─── Payment Methods ───────────────────────────────────────
/**
 * @swagger
 * /user/payment-methods:
 *   get:
 *     summary: Get payment methods
 *     tags:
 *       - Payment Methods
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment methods fetched
 */
router.get('/payment-methods', getPaymentMethods);
/**
 * @swagger
 * /user/payment-methods:
 *   post:
 *     summary: Add payment method
 *     tags:
 *       - Payment Methods
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - last4
 *               - expiry
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [visa, mastercard, instapay]
 *               last4:
 *                 type: string
 *               expiry:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Payment method added
 */
router.post('/payment-methods', addPaymentMethod);
/**
 * @swagger
 * /user/payment-methods/{id}:
 *   delete:
 *     summary: Delete payment method
 *     tags:
 *       - Payment Methods
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment method deleted
 */
router.delete('/payment-methods/:id', deletePaymentMethod);
/**
 * @swagger
 * /user/payment-methods/{id}/default:
 *   patch:
 *     summary: Set default payment method
 *     tags:
 *       - Payment Methods
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Default payment method updated
 */
router.patch('/payment-methods/:id/default', setDefaultPaymentMethod);

// ─── Settings ──────────────────────────────────────────────
/**
 * @swagger
 * /user/settings:
 *   get:
 *     summary: Get app settings
 *     tags:
 *       - Settings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings fetched
 */
router.get('/settings', getSettings);
/**
 * @swagger
 * /user/settings/language:
 *   patch:
 *     summary: Change application language
 *     tags:
 *       - Settings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Language updated
 */
router.patch('/settings/language', updateLanguage);
/**
 * @swagger
 * /user/settings/appearance:
 *   patch:
 *     summary: Toggle dark mode
 *     tags:
 *       - Settings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Appearance updated
 */
router.patch('/settings/appearance', updateAppearance);

// ─── Notification Settings ─────────────────────────────────
/**
 * @swagger
 * /user/notification-settings:
 *   get:
 *     summary: Get notification settings
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification settings fetched
 */
router.get('/notification-settings', getNotificationSettings);
/**
 * @swagger
 * /user/notification-settings:
 *   patch:
 *     summary: Update notification settings
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification settings updated
 */
router.patch('/notification-settings', updateNotificationSettings);

// ─── Data Management ───────────────────────────────────────
/**
 * @swagger
 * /user/data/export:
 *   get:
 *     summary: Export user data
 *     tags:
 *       - Account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data exported
 */
router.get('/data/export', downloadData);
/**
 * @swagger
 * /user/account:
 *   delete:
 *     summary: Delete user account permanently
 *     tags:
 *       - Account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account permanently deleted
 */
router.delete('/account', deleteAccount);

export default router;