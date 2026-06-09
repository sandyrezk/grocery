
import Offer from '../models/offer.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

// GET /api/offers
const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ],
    }).populate(
      'product',
      'name price images'
    );

    return sendSuccess(
      res,
      200,
      'Offers fetched',
      offers
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

export {
  getOffers,
};