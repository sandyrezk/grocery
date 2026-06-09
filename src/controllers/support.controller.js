
import { sendSuccess, sendError } from '../utils/response.js';

// GET /api/support/faq
const getFAQ = async (req, res) => {
  try {
    const faqs = [
      {
        q: 'How do I track my order?',
        a: 'Go to My Orders and tap Track Order.',
      },
      {
        q: 'Can I cancel my order?',
        a: 'You can cancel within 5 minutes of placing it.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept Cash, Card, and InstaPay.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Usually 30–60 minutes depending on your location.',
      },
    ];

    return sendSuccess(res, 200, 'FAQ fetched', faqs);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// POST /api/support/contact
const contactSupport = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!message) {
      return sendError(res, 400, 'Message is required');
    }

    console.log(
      `📩 Support ticket from ${req.user.email}: ${subject} — ${message}`
    );

    return sendSuccess(
      res,
      200,
      "Your message has been sent. We'll get back to you soon."
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// GET /api/app/info
const getAppInfo = async (req, res) => {
  try {
    return sendSuccess(res, 200, 'App info', {
      version: '1.0.5',
      terms: 'https://groceryplus.com/terms',
      privacy: 'https://groceryplus.com/privacy',
      about: 'Grocery Plus — Fresh groceries delivered to your door.',
    });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

export {
  getFAQ,
  contactSupport,
  getAppInfo,
};