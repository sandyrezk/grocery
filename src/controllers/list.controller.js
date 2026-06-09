
import List from '../models/list.model.js';
import Cart from '../models/cart.model.js';
import User from '../models/user.model.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

import { sendSuccess, sendError } from '../utils/response.js';

// GET /api/lists
const getLists = async (req, res) => {
  try {
    const lists = await List.find({ user: req.user._id })
      .populate('products', 'name price images rating')
      .sort({ updatedAt: -1 });

    return sendSuccess(res, 200, 'Lists fetched', lists);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/lists/favorites
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('wishlist');

    return sendSuccess(
      res,
      200,
      'Favorites fetched',
      user?.wishlist || []
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/lists/history
const getHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .select('items')
      .sort({ createdAt: -1 })
      .limit(5);

    const productIds = [
      ...new Set(
        orders.flatMap((order) =>
          order.items.map((item) => item.product.toString())
        )
      ),
    ];

    const products = await Product.find({
      _id: { $in: productIds },
    }).select('name price oldPrice images rating ratingCount');

    return sendSuccess(res, 200, 'History fetched', products);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/lists/:id
const getListById = async (req, res) => {
  try {
    const list = await List.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('products', 'name price images rating');

    if (!list) {
      return sendError(res, 404, 'List not found');
    }

    return sendSuccess(res, 200, 'List fetched', list);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// POST /api/lists
const createList = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name) {
      return sendError(res, 400, 'List name is required');
    }

    const list = await List.create({
      user: req.user._id,
      name,
      image,
    });

    return sendSuccess(res, 201, 'List created', list);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// PUT /api/lists/:id
const updateList = async (req, res) => {
  try {
    const { name, image } = req.body;

    const list = await List.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        name,
        image,
      },
      {
        new: true,
      }
    );

    if (!list) {
      return sendError(res, 404, 'List not found');
    }

    return sendSuccess(res, 200, 'List updated', list);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// DELETE /api/lists/:id
const deleteList = async (req, res) => {
  try {
    const list = await List.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!list) {
      return sendError(res, 404, 'List not found');
    }

    return sendSuccess(res, 200, 'List deleted');
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// POST /api/lists/:id/items
const addItemToList = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return sendError(res, 400, 'productId is required');
    }

    const list = await List.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!list) {
      return sendError(res, 404, 'List not found');
    }

    if (!list.products.includes(productId)) {
      list.products.push(productId);
      await list.save();
    }

    await list.populate('products', 'name price images rating');

    return sendSuccess(res, 200, 'Item added to list', list);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// DELETE /api/lists/:id/items/:productId
const removeItemFromList = async (req, res) => {
  try {
    const list = await List.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!list) {
      return sendError(res, 404, 'List not found');
    }

    list.products = list.products.filter(
      (product) => product.toString() !== req.params.productId
    );

    await list.save();
    await list.populate('products', 'name price images rating');

    return sendSuccess(res, 200, 'Item removed from list', list);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// POST /api/lists/:id/add-to-cart
const addListToCart = async (req, res) => {
  try {
    const list = await List.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!list) {
      return sendError(res, 404, 'List not found');
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    for (const productId of list.products) {
      const existing = cart.items.find(
        (item) =>
          item.product.toString() === productId.toString()
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.items.push({
          product: productId,
          quantity: 1,
        });
      }
    }

    await cart.save();

    return sendSuccess(res, 200, 'All items added to cart');
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

export {
  getLists,
  getFavorites,
  getHistory,
  getListById,
  createList,
  updateList,
  deleteList,
  addItemToList,
  removeItemFromList,
  addListToCart,
};