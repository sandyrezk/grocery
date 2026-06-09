import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

// GET /api/orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Orders fetched', orders);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    return sendSuccess(res, 200, 'Order fetched', order);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;

    if (!deliveryAddress) {
      return sendError(res, 400, 'Delivery address is required');
    }

    if (!paymentMethod) {
      return sendError(res, 400, 'Payment method is required');
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return sendError(res, 400, 'Cart is empty');
    }

    const DELIVERY_FEE = 70;

    const items = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images?.[0] || null,
    }));

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const total = subtotal + DELIVERY_FEE;

    const order = await Order.create({
      user: req.user._id,
      items,
      deliveryAddress,
      deliveryFee: DELIVERY_FEE,
      total,
      paymentMethod,
      paymentStatus: 'pending',
    });

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    return sendSuccess(
      res,
      201,
      'Order placed successfully',
      order
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/orders/:id/tracking
export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select('status driverLocation');

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    return sendSuccess(res, 200, 'Tracking info', order);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// POST /api/orders/:id/alert
export const setAlert = async (req, res) => {
  try {
    return sendSuccess(
      res,
      200,
      'Alert set successfully'
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};