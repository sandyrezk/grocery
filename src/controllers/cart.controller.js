import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

// helper: جيب أو أنشئ cart للـ user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId })
    .populate('items.product', 'name price images inStock');

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  return cart;
};

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);

    return sendSuccess(res, 200, 'Cart fetched', cart);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// POST /api/cart/items
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return sendError(res, 400, 'productId is required');
    }

    const product = await Product.findById(productId);

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    if (!product.inStock) {
      return sendError(res, 400, 'Product is out of stock');
    }

    const cart = await getOrCreateCart(req.user._id);

    const existing = cart.items.find(
      (i) =>
        i.product?._id?.toString() === productId ||
        i.product?.toString() === productId
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name price images inStock');

    return sendSuccess(res, 200, 'Item added to cart', cart);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// PATCH /api/cart/items/:id
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return sendError(res, 400, 'Quantity must be at least 1');
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return sendError(res, 404, 'Cart not found');
    }

    const item = cart.items.id(req.params.id);

    if (!item) {
      return sendError(res, 404, 'Item not found in cart');
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate('items.product', 'name price images inStock');

    return sendSuccess(res, 200, 'Cart updated', cart);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// DELETE /api/cart/items/:id
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return sendError(res, 404, 'Cart not found');
    }

    const item = cart.items.id(req.params.id);

    if (!item) {
      return sendError(res, 404, 'Item not found in cart');
    }

    cart.items.pull(req.params.id);

    await cart.save();
    await cart.populate('items.product', 'name price images inStock');

    return sendSuccess(res, 200, 'Item removed from cart', cart);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// DELETE /api/cart
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    return sendSuccess(res, 200, 'Cart cleared');
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};