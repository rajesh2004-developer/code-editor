import axios from 'axios';
import { NextResponse } from 'next/server';
import uniqid from 'uniqid';

export async function POST(req) {
  try {
    const { code, language } = await req.json();
    const res = await axios.post(
      'https://api.hackerearth.com/v4/partner/code-evaluation/submissions/',
      {
        lang: language,
        source: code || '',
        input: '',
        memory_limit: 243232,
        time_limit: 5,
        context: `{'id': ${uniqid()}}`,
        callback: 'https://client.com/callback/',
      },
      {
        headers: {
          'client-secret': process.env.NEXT_PUBLIC_HACKEREARTH_CLIENT_ID,
          'content-type': 'application/json',
        },
      }
    );
    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      status: error.status || 500,
    });
  }
}
