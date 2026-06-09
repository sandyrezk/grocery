import Category from '../models/category.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

// GET /api/categories — All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    return sendSuccess(
      res,
      200,
      'Categories fetched',
      categories
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

export { getCategories };