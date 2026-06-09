
import User from '../models/user.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ═══════════════════════════════════════════════════════════════
//  PROFILE
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// @desc   جلب بيانات الـ profile الخاصة بالمستخدم
// @route  GET /api/user/profile
// @access Private
// ─────────────────────────────────────────────────────────────
// req.user موجودة لأن الـ protect middleware حطها قبل ما نوصل هنا
// مش محتاجين نعمل DB query تاني، الـ protect عمله بالفعل
const getProfile = async (req, res) => {
  try {
    return sendSuccess(res, 200, 'Profile fetched', req.user);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc   تحديث بيانات الـ profile (اسم، تليفون، صورة)
// @route  PUT /api/user/profile
// @access Private
// ─────────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    // بناخد بس الحقول المسموح بتغييرها
    // مش بنخلي المستخدم يغير الـ email أو password من هنا
    const { username, phone } = req.body;

    // new: true → يرجع الـ document بعد التعديل مش قبله
    // runValidators: true → يشغل الـ schema validators على التعديل
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, phone },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, 200, 'Profile updated successfully', user.toSafeObject());
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ═══════════════════════════════════════════════════════════════
//  DELIVERY ADDRESSES
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// @desc   جلب كل عناوين التوصيل
// @route  GET /api/user/addresses
// @access Private
// ─────────────────────────────────────────────────────────────
const getAddresses = async (req, res) => {
  try {
    // بنجيب بس الـ addresses field من الـ document
    // select('addresses') أسرع من جيب كل الـ user
    const user = await User.findById(req.user._id).select('addresses');
    return sendSuccess(res, 200, 'Addresses fetched', user.addresses);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc   إضافة عنوان جديد
// @route  POST /api/user/addresses
// @access Private
// ─────────────────────────────────────────────────────────────
const addAddress = async (req, res) => {
  try {
    const { label, country, city, street, building, notes, isDefault } = req.body;

    const user = await User.findById(req.user._id);

    // لو المستخدم عايز العنوان ده يبقى الـ default
    // نشيل الـ default من كل العناوين الموجودة الأول
    if (isDefault) {
      user.addresses.forEach(addr => { addr.isDefault = false; });
    }

    // لو مفيش أي عنوان خالص، الأول يبقى default تلقائياً
    const shouldBeDefault = isDefault || user.addresses.length === 0;

    user.addresses.push({ label, country, city, street, building, notes, isDefault: shouldBeDefault });
    await user.save();

    return sendSuccess(res, 201, 'Address added successfully', user.addresses);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc   تعديل عنوان موجود
// @route  PUT /api/user/addresses/:id
// @access Private
// ─────────────────────────────────────────────────────────────
const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // id() دي method على الـ mongoose array بتجيب الـ subdocument
    const address = user.addresses.id(req.params.id);
    if (!address) return sendError(res, 404, 'Address not found');

    const { label, country, city, street, building, notes, isDefault } = req.body;

    // لو بيغير الـ default، نشيل الـ default من البقية
    if (isDefault) {
      user.addresses.forEach(addr => { addr.isDefault = false; });
    }

    // Object.assign بتعدل الـ subdocument field by field
    Object.assign(address, { label, country, city, street, building, notes, isDefault });
    await user.save();

    return sendSuccess(res, 200, 'Address updated successfully', user.addresses);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc   حذف عنوان
// @route  DELETE /api/user/addresses/:id
// @access Private
// ─────────────────────────────────────────────────────────────
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(req.params.id);
    if (!address) return sendError(res, 404, 'Address not found');

    const wasDefault = address.isDefault;

    // pull بتحذف الـ subdocument من الـ array
    user.addresses.pull(req.params.id);

    // لو حذف الـ default، نخلي الأول default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return sendSuccess(res, 200, 'Address deleted successfully', user.addresses);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ═══════════════════════════════════════════════════════════════
//  PAYMENT METHODS
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// @desc   جلب الكروت المحفوظة
// @route  GET /api/user/payment-methods
// @access Private
// ─────────────────────────────────────────────────────────────
const getPaymentMethods = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('paymentMethods');
    return sendSuccess(res, 200, 'Payment methods fetched', user.paymentMethods);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc   إضافة كارت جديد
// @route  POST /api/user/payment-methods
// @access Private
// ─────────────────────────────────────────────────────────────
// ⚠️  مبنحفظش الرقم الكامل للكارت في الـ DB
//     في production، الكارت بيتبعت لـ payment gateway (Stripe/InstaPay)
//     وبنحفظ بس الـ token اللي بيرجع منهم + آخر 4 أرقام
const addPaymentMethod = async (req, res) => {
  try {
    const { type, last4, expiry, isDefault } = req.body;

    // Validation بسيطة
    if (!type || !last4 || !expiry) {
      return sendError(res, 400, 'type, last4, and expiry are required');
    }
    if (!/^\d{4}$/.test(last4)) {
      return sendError(res, 400, 'last4 must be exactly 4 digits');
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return sendError(res, 400, 'expiry must be in MM/YY format');
    }

    const user = await User.findById(req.user._id);

    if (isDefault) {
      user.paymentMethods.forEach(pm => { pm.isDefault = false; });
    }

    const shouldBeDefault = isDefault || user.paymentMethods.length === 0;
    user.paymentMethods.push({ type, last4, expiry, isDefault: shouldBeDefault });
    await user.save();

    return sendSuccess(res, 201, 'Payment method added', user.paymentMethods);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc   حذف كارت
// @route  DELETE /api/user/payment-methods/:id
// @access Private
// ─────────────────────────────────────────────────────────────
const deletePaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const pm = user.paymentMethods.id(req.params.id);
    if (!pm) return sendError(res, 404, 'Payment method not found');

    const wasDefault = pm.isDefault;
    user.paymentMethods.pull(req.params.id);

    // لو حذف الـ default، نخلي الأول default
    if (wasDefault && user.paymentMethods.length > 0) {
      user.paymentMethods[0].isDefault = true;
    }

    await user.save();
    return sendSuccess(res, 200, 'Payment method deleted', user.paymentMethods);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc   تعيين كارت كـ default
// @route  PATCH /api/user/payment-methods/:id/default
// @access Private
// ─────────────────────────────────────────────────────────────
const setDefaultPaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const pm = user.paymentMethods.id(req.params.id);
    if (!pm) return sendError(res, 404, 'Payment method not found');

    // شيل الـ default من الكل وحط على الـ id ده
    user.paymentMethods.forEach(p => { p.isDefault = false; });
    pm.isDefault = true;

    await user.save();
    return sendSuccess(res, 200, 'Default payment method updated', user.paymentMethods);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ═══════════════════════════════════════════════════════════════
//  APP SETTINGS
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// @desc   جلب إعدادات التطبيق
// @route  GET /api/user/settings
// @access Private
// ─────────────────────────────────────────────────────────────
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings');
    return sendSuccess(res, 200, 'Settings fetched', user.settings);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc   تغيير اللغة
// @route  PATCH /api/user/settings/language
// @access Private
// ─────────────────────────────────────────────────────────────
const updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;

    // اللغات المتاحة في التطبيق
    const allowedLanguages = ['en', 'ar', 'fr'];
    if (!allowedLanguages.includes(language)) {
      return sendError(res, 400, `Language must be one of: ${allowedLanguages.join(', ')}`);
    }

    // $set بتعدل nested field بدون ما تمسح بقية الـ settings
    await User.findByIdAndUpdate(req.user._id, { $set: { 'settings.language': language } });

    return sendSuccess(res, 200, 'Language updated', { language });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc   تفعيل/تعطيل Dark Mode
// @route  PATCH /api/user/settings/appearance
// @access Private
// ─────────────────────────────────────────────────────────────
const updateAppearance = async (req, res) => {
  try {
    const { darkMode } = req.body;

    if (typeof darkMode !== 'boolean') {
      return sendError(res, 400, 'darkMode must be true or false');
    }

    await User.findByIdAndUpdate(req.user._id, { $set: { 'settings.darkMode': darkMode } });

    return sendSuccess(res, 200, 'Appearance updated', { darkMode });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ═══════════════════════════════════════════════════════════════
//  NOTIFICATION SETTINGS
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// @desc   جلب إعدادات الإشعارات
// @route  GET /api/user/notification-settings
// @access Private
// ─────────────────────────────────────────────────────────────
const getNotificationSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notificationSettings');
    return sendSuccess(res, 200, 'Notification settings fetched', user.notificationSettings);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc   تحديث إعدادات الإشعارات (toggle أي switch)
// @route  PATCH /api/user/notification-settings
// @access Private
//
// المستخدم بيبعت بس الـ toggles اللي اتغيرت، مش كل الـ settings
// مثال: { "orderConfirmation": false, "cartReminders": true }
// ─────────────────────────────────────────────────────────────
const updateNotificationSettings = async (req, res) => {
  try {
    // الـ fields المسموح بتغييرها
    const allowedFields = [
      'orderConfirmation', 'orderShipped', 'deliveryUpdates',
      'outOfStockAlerts', 'weeklyDiscounts', 'exclusiveMemberOffers',
      'seasonalCampaigns', 'cartReminders', 'paymentBilling',
    ];

    // بنبني الـ update object ديناميكياً
    // بنشيل أي field مش في الـ allowedFields
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] !== 'boolean') {
          return sendError(res, 400, `${field} must be true or false`);
        }
        // بنستخدم dot notation عشان MongoDB يعدل الـ nested field بس
        updates[`notificationSettings.${field}`] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return sendError(res, 400, 'No valid fields provided');
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select('notificationSettings');

    return sendSuccess(res, 200, 'Notification settings updated', user.notificationSettings);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ═══════════════════════════════════════════════════════════════
//  DATA MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// @desc   تنزيل بيانات الحساب (GDPR compliance)
// @route  GET /api/user/data/export
// @access Private
// ─────────────────────────────────────────────────────────────
const downloadData = async (req, res) => {
  try {
    // بنجيب كل بيانات الـ user ونبعتها كـ JSON file
    const user = await User.findById(req.user._id)
      .select('-password -refreshToken -resetPasswordOTP -resetPasswordOTPExpiry');

    const data = {
      exportedAt: new Date().toISOString(),
      account: user.toObject(),
    };

    // بنعمل الـ response كـ JSON file للتنزيل
    res.setHeader('Content-Disposition', `attachment; filename="my-data-${req.user._id}.json"`);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


// ─────────────────────────────────────────────────────────────
// @desc   حذف الحساب نهائياً مع كل البيانات
// @route  DELETE /api/user/account
// @access Private
// ─────────────────────────────────────────────────────────────
const deleteAccount = async (req, res) => {
  try {
    // في production هنحذف أوامر الـ user وكل بياناته
    // دلوقتي بنعمل soft delete بنغير isActive
    await User.findByIdAndDelete(req.user._id);

    // نمسح الـ cookie
    res.clearCookie('refreshToken');

    return sendSuccess(res, 200, 'Account permanently deleted');
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};


export {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  getSettings,
  updateLanguage,
  updateAppearance,
  getNotificationSettings,
  updateNotificationSettings,
  downloadData,
  deleteAccount,
};