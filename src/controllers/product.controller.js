
import Product from '../models/product.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name')
        .skip(skip)
        .limit(limit),

      Product.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'Products fetched', {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/products/search?q=coffee
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 1) {
      return sendError(res, 400, 'Search query is required');
    }

    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('category', 'name')
      .limit(30);

    return sendSuccess(res, 200, 'Search results', products);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/products/filter
const filterProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      rating,
    } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
    }

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }

    if (rating) {
      filter.rating = {
        $gte: Number(rating),
      };
    }

    const products = await Product.find(filter)
      .populate('category', 'name');

    return sendSuccess(
      res,
      200,
      'Filtered products',
      products
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/products/recommended
const getRecommended = async (req, res) => {
  try {
    const products = await Product.find({
      inStock: true,
    })
      .sort({ rating: -1 })
      .limit(10)
      .populate('category', 'name');

    return sendSuccess(
      res,
      200,
      'Recommended products',
      products
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    ).populate('category', 'name');

    if (!product) {
      return sendError(
        res,
        404,
        'Product not found'
      );
    }

    return sendSuccess(
      res,
      200,
      'Product fetched',
      product
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/products/:id/similar
const getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    ).select('category');

    if (!product) {
      return sendError(
        res,
        404,
        'Product not found'
      );
    }

    const similar = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(6)
      .populate('category', 'name');

    return sendSuccess(
      res,
      200,
      'Similar products',
      similar
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

export {
  getProducts,
  searchProducts,
  filterProducts,
  getRecommended,
  getProductById,
  getSimilarProducts,
};