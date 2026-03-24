import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import OTP from '@/models/OTP';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, newPassword } = await request.json();
    
    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Email and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    // Verify that OTP was verified for password reset
    const verifiedOTP = await OTP.findOne({
      email,
      type: 'password-reset',
      verified: true,
      expiresAt: { $gt: new Date(Date.now() - 30 * 60 * 1000) } // Within last 30 minutes
    });
    
    if (!verifiedOTP) {
      return NextResponse.json(
        { success: false, message: 'Please verify OTP first' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    // Delete the used OTP
    await OTP.deleteOne({ _id: verifiedOTP._id });
    
    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
