
import { Router } from 'express';
import multer from 'multer';
import { protect } from '../middlewares/auth.middleware.js';

import {
  scanReceipt,
  scanBarcode,
} from '../controllers/scanner.controller.js';

const router = Router();

// multer: بيستقبل الصورة في الـ memory
const upload = multer({
  storage: multer.memoryStorage(),
});

router.use(protect);
/**
 * @swagger
 * tags:
 *   name: Scanner
 *   description: Receipt & Barcode Scanner APIs
 */

/**
 * @swagger
 * /scanner/receipt:
 *   post:
 *     summary: Scan receipt image
 *     tags: [Scanner]
 */
router.post('/receipt', upload.single('image'), scanReceipt);

/**
 * @swagger
 * /scanner/barcode:
 *   post:
 *     summary: Scan barcode
 *     tags: [Scanner]
 */
router.post('/barcode', scanBarcode);

export default router;