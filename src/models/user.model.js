

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
// ─────────────────────────────────────────────────────────────
// Sub-schema: عنوان توصيل واحد
// ─────────────────────────────────────────────────────────────
const addressSchema = new mongoose.Schema({
  label:     { type: String, required: true, trim: true }, // "Home", "Work"
  country:   { type: String, required: true, trim: true },
  city:      { type: String, required: true, trim: true },
  street:    { type: String, required: true, trim: true },
  building:  { type: String, trim: true, default: null },
  notes:     { type: String, trim: true, default: null },
  isDefault: { type: Boolean, default: false },
}, { _id: true }); // كل عنوان بـ id خاص بيه


// ─────────────────────────────────────────────────────────────
// Sub-schema: كارت دفع محفوظ
// ملاحظة: مش بنحفظ الـ CVV ولا الرقم كامل — بس آخر 4 أرقام
// ─────────────────────────────────────────────────────────────
const paymentMethodSchema = new mongoose.Schema({
  type:       { type: String, enum: ['visa', 'mastercard', 'instapay'], required: true },
  last4:      { type: String, required: true },   // "4242"
  expiry:     { type: String, required: true },   // "12/25"
  isDefault:  { type: Boolean, default: false },
}, { _id: true });


// ─────────────────────────────────────────────────────────────
// Main User Schema
// ─────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3,  'Username must be at least 3 characters'],
      maxlength: [30, 'Username must not exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // مش بترجع في أي query تلقائياً
    },
    phone: { type: String, trim: true, default: null },
    avatar:{ type: String, default: null },

    // ─── Social Login ──────────────────────────────────
    provider:   { type: String, enum: ['local','google','facebook'], default: 'local' },
    providerId: { type: String, default: null },

    // ─── Tokens ────────────────────────────────────────
    refreshToken: { type: String, select: false },

    // ─── Forgot Password ───────────────────────────────
    resetPasswordOTP:       { type: String, select: false },
    resetPasswordOTPExpiry: { type: Date,   select: false },

    // ─── Addresses & Payments (embedded) ───────────────
    // بنحطهم جوا الـ user document مش في collection منفصلة
    // لأنهم دايماً بيتقرأوا مع الـ user ومش محتاجين queries منفصلة
    addresses:      { type: [addressSchema],       default: [] },
    paymentMethods: { type: [paymentMethodSchema], default: [] },

    // ─── Notification Settings ─────────────────────────
    notificationSettings: {
      orderConfirmation:     { type: Boolean, default: true  },
      orderShipped:          { type: Boolean, default: true  },
      deliveryUpdates:       { type: Boolean, default: false },
      outOfStockAlerts:      { type: Boolean, default: true  },
      weeklyDiscounts:       { type: Boolean, default: false },
      exclusiveMemberOffers: { type: Boolean, default: true  },
      seasonalCampaigns:     { type: Boolean, default: true  },
      cartReminders:         { type: Boolean, default: true  },
      paymentBilling:        { type: Boolean, default: false },
    },

    // ─── App Settings ──────────────────────────────────
    settings: {
      language: { type: String, default: 'en' },
      darkMode: { type: Boolean, default: false },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


// ─────────────────────────────────────────────────────────────
// Pre-save Hook: hash الـ password قبل الحفظ في الـ DB
// isModified بتتأكد إننا مش بنعمل hash مرتين
// ─────────────────────────────────────────────────────────────
 
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});


// ─────────────────────────────────────────────────────────────
// Instance Method: مقارنة الـ password اللي المستخدم كتبه
// مع الـ hash اللي في الـ DB
// ─────────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


// ─────────────────────────────────────────────────────────────
// Instance Method: إرجاع بيانات الـ user بدون الحقول الحساسة
// بنستخدمها في كل response بنرجع فيه بيانات الـ user
// ─────────────────────────────────────────────────────────────
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.resetPasswordOTP;
  delete obj.resetPasswordOTPExpiry;
  return obj;
};


const User = mongoose.model('User', userSchema);

export default User;