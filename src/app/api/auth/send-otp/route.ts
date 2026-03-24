import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OTP from '@/models/OTP';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, type } = await request.json();
    
    if (!email || !type) {
      return NextResponse.json(
        { success: false, message: 'Email and type are required' },
        { status: 400 }
      );
    }

    if (!['registration', 'password-reset'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP type' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Delete any existing OTP for this email and type
    await OTP.deleteMany({ email, type });
    
    // Create new OTP
    const otpRecord = new OTP({
      email,
      otp,
      type,
    });
    
    await otpRecord.save();
    
    // Send email
    const emailResult = await sendOTPEmail(email, otp, type);
    
    if (!emailResult.success) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, message: 'Failed to send OTP email' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    });
    
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
