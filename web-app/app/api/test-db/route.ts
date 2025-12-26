import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      return NextResponse.json({
        status: 'success',
        message: 'Database connection successful',
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
