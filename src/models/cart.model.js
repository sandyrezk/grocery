import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    _id: true,
  }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

// Virtual: Total Items
cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
});

// Include virtuals in JSON responses
cartSchema.set('toJSON', {
  virtuals: true,
});

cartSchema.set('toObject', {
  virtuals: true,
});

const Cart = mongoose.model(
  'Cart',
  cartSchema
);

export default Cart;