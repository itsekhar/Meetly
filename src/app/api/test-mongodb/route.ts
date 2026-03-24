import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    // Test MongoDB connection
    await connectDB();
    
    // Test basic database operation
    const userCount = await User.countDocuments();
    
    return NextResponse.json({
      status: 'success',
      message: 'MongoDB connection successful',
      userCount: userCount,
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Missing',
        JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Missing',
      }
    });
  } catch (error) {
    console.error('MongoDB test error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'MongoDB connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
        timestamp: new Date().toISOString(),
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Missing',
          JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Missing',
        }
      },
      { status: 500 }
    );
  }
}
