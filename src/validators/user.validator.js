import { body } from 'express-validator';

// ─── Update Profile ────────────────────────────────────────
// كل الحقول optional لأن المستخدم ممكن يغير حاجة واحدة بس
export const updateProfileValidator = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .isLength({ max: 30 }).withMessage('Username must not exceed 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

  body('phone')
    .optional()
    .trim()
    .isMobilePhone().withMessage('Enter a valid phone number'),
];

// ─── Add / Update Address ──────────────────────────────────
export const addAddressValidator = [
  body('label')
    .trim()
    .notEmpty().withMessage('Address label is required')
    .isLength({ max: 30 }).withMessage('Label too long'),

  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),

  body('street')
    .trim()
    .notEmpty().withMessage('Street is required'),

  body('country')
    .trim()
    .notEmpty().withMessage('Country is required'),

  body('isDefault')
    .optional()
    .isBoolean().withMessage('isDefault must be true or false'),
];