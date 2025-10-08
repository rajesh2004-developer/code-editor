import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }
    const res = await axios.get(`${url}`);
    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      status: error.status || 500,
    });
  }
}
