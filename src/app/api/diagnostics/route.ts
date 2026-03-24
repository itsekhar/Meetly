import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic functionality
    const basicTest = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      platform: process.platform,
      nodeVersion: process.version,
    };

    // Test environment variables
    const envTest = {
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Missing',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Missing',
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || 'Not set',
      NEXT_PUBLIC_ZEGO_APP_ID: process.env.NEXT_PUBLIC_ZEGO_APP_ID ? 'Set' : 'Missing',
      NEXT_PUBLIC_ZEGO_SERVER_SECRET: process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET ? 'Set' : 'Missing',
      EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Missing',
      EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Missing',
    };

    // Test MongoDB connection
    let mongoTest = 'Not tested';
    try {
      const mongoose = await import('mongoose');
      if (mongoose.default.connection.readyState === 1) {
        mongoTest = 'Connected';
      } else {
        mongoTest = 'Not connected';
      }
    } catch (error) {
      mongoTest = `Error: ${error}`;
    }

    return NextResponse.json({
      status: 'success',
      message: 'Production diagnostics',
      basic: basicTest,
      environment: envTest,
      mongodb: mongoTest,
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Diagnostic failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
