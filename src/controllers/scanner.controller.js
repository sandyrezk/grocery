
import Product from '../models/product.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

// POST /api/scanner/receipt
const scanReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'Receipt image is required');
    }

    return sendSuccess(res, 200, 'Receipt scanned', {
      message: 'OCR processing — integrate Google Vision API here',
      file: req.file.filename,
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// POST /api/scanner/barcode
const scanBarcode = async (req, res) => {
  try {
    const { barcode } = req.body;

    if (!barcode) {
      return sendError(res, 400, 'Barcode is required');
    }

    const product = await Product.findOne({ barcode })
      .populate('category', 'name');

    if (!product) {
      return sendError(
        res,
        404,
        'Product not found for this barcode'
      );
    }

    return sendSuccess(
      res,
      200,
      'Product found',
      product
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

export {
  scanReceipt,
  scanBarcode,
};