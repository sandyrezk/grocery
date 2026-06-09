
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
    },

    howToUse: [
      {
        type: String,
      },
    ],

    images: [
      {
        type: String,
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    oldPrice: {
      type: Number,
      default: null,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    size: {
      type: String,
      default: null,
    },

    includes: {
      type: String,
      default: null,
    },

    expiry: {
      type: String,
      default: null,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search Index
productSchema.index({
  name: 'text',
  description: 'text',
});

const Product = mongoose.model(
  'Product',
  productSchema
);

export default Product;