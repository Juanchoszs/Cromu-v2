import { NextResponse } from 'next/server';

export async function POST() {
  // Create response
  const response = NextResponse.json(
    { message: "Sesión cerrada correctamente." },
    { status: 200 }
  );
  
  // Clear the admin-auth cookie
  response.cookies.set({
    name: 'admin-auth',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0 // Expire immediately
  });
  
  return response;
}

export const dynamic = 'force-dynamic'; // Ensure the response is not cached
