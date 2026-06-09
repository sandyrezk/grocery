
import Notification from '../models/notification.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return sendSuccess(
      res,
      200,
      'Notifications fetched',
      notifications
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// PATCH /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!notif) {
      return sendError(res, 404, 'Notification not found');
    }

    return sendSuccess(
      res,
      200,
      'Marked as read',
      notif
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// PATCH /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    return sendSuccess(
      res,
      200,
      'All notifications marked as read'
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// POST /api/notifications/device-token
const saveDeviceToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return sendError(
        res,
        400,
        'Device token is required'
      );
    }

    return sendSuccess(
      res,
      200,
      'Device token saved'
    );
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

export {
  getNotifications,
  markAsRead,
  markAllAsRead,
  saveDeviceToken,
};