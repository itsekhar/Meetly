import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Missing',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Missing',
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
      NEXT_PUBLIC_ZEGO_APP_ID: process.env.NEXT_PUBLIC_ZEGO_APP_ID ? 'Set' : 'Missing',
      NEXT_PUBLIC_ZEGO_SERVER_SECRET: process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET ? 'Set' : 'Missing',
      EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Missing',
      EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Missing',
    };

    return NextResponse.json({
      message: 'Environment check',
      environment: envCheck,
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Environment check failed', details: error },
      { status: 500 }
    );
  }
}
