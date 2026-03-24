import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OTP from '@/models/OTP';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, otp, type, password, firstName, lastName } = await request.json();
    
    if (!email || !otp || !type) {
      return NextResponse.json(
        { success: false, message: 'Email, OTP, and type are required' },
        { status: 400 }
      );
    }

    // Find the OTP record
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type,
      verified: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }
    
    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();
    
    if (type === 'registration') {
      // Complete user registration
      if (!password || !firstName || !lastName) {
        return NextResponse.json(
          { success: false, message: 'Password, first name, and last name are required for registration' },
          { status: 400 }
        );
      }
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'User already exists' },
          { status: 400 }
        );
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create user
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        verified: true,
      });
      
      await user.save();
      
      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
      });
    }
    
    if (type === 'password-reset') {
      // Verify user exists
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully. You can now reset your password.',
        verified: true
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
    });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
