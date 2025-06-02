import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get('admin-auth');
  
  if (!authCookie) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const authData = JSON.parse(authCookie.value);
    // Verificar que los datos de autenticación sean válidos
    if (authData && authData.username === 'CromuAdmin') {
      return NextResponse.json({ 
        authenticated: true,
        user: authData.username,
        role: authData.role
      });
    }
  } catch (error) {
    console.error('Error al analizar la cookie de autenticación:', error);
  }

  return NextResponse.json({ authenticated: false });
}

export const dynamic = 'force-dynamic';