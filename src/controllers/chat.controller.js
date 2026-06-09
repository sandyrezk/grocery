
import Chat from '../models/chat.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

// GET /api/chat/history
const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      user: req.user._id,
    });

    return sendSuccess(
      res,
      200,
      'Chat history fetched',
      chat?.messages || []
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// POST /api/chat/message
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return sendError(res, 400, 'Message is required');
    }

    let chat = await Chat.findOne({
      user: req.user._id,
    });

    if (!chat) {
      chat = await Chat.create({
        user: req.user._id,
        messages: [],
      });
    }

    // User Message
    chat.messages.push({
      role: 'user',
      content: message,
    });

    // Bot Reply
    const botReply = getBotReply(message);

    chat.messages.push({
      role: 'bot',
      content: botReply,
    });

    await chat.save();

    return sendSuccess(
      res,
      200,
      'Message sent',
      {
        userMessage: message,
        botReply,
      }
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// Helper
const getBotReply = (message) => {
  const msg = message.toLowerCase();

  if (msg.includes('deal') || msg.includes('offer')) {
    return 'Check out our latest offers in the Offers section!';
  }

  if (msg.includes('milk')) {
    return '"QuickMart" full-fat milk is 15% off today. Shall I add it to your list?';
  }

  if (msg.includes('track') || msg.includes('order')) {
    return 'You can track your order from the My Orders section.';
  }

  return "I'm here to help with your shopping! Ask me about deals, products, or your orders.";
};

export {
  getChatHistory,
  sendMessage,
};