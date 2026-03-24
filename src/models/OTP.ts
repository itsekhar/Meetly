import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  type: 'registration' | 'password-reset';
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    length: 6,
  },
  type: {
    type: String,
    enum: ['registration', 'password-reset'],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for automatic cleanup of expired OTPs
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Ensure only one active OTP per email and type
OTPSchema.index({ email: 1, type: 1, verified: 1 });

const OTP = mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);

export default OTP;
