import { NextResponse } from 'next/server';

export async function GET() {
  const mongoUri = process.env.MONGODB_URI;
  
  return NextResponse.json({
    message: 'Environment variable check',
    MONGODB_URI: {
      exists: !!mongoUri,
      length: mongoUri?.length || 0,
      startsWith: mongoUri?.startsWith('mongodb') || false,
      firstChars: mongoUri?.substring(0, 20) || 'Not set',
      lastChars: mongoUri?.substring(mongoUri.length - 20) || 'Not set'
    },
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}
