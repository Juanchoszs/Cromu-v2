import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Si la ruta no es /admin, continuar sin verificación
  if (!path.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Verificar la cookie de sesión de administrador
  const adminSession = request.cookies.get('admin-auth');
  
  // Si no hay sesión de administrador, redirigir al login
  if (!adminSession) {
    const loginUrl = new URL('/espacio', request.url);
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar la sesión
  try {
    const sessionData = JSON.parse(adminSession.value);
    
    // Verificar que los datos de la sesión sean válidos
    if (sessionData && sessionData.username === 'CromuAdmin') {
      // Continuar con la solicitud si la sesión es válida
      return NextResponse.next();
    }
    
    // Sesión inválida, redirigir al login
    const loginUrl = new URL('/espacio', request.url);
    loginUrl.searchParams.set('from', path);
    loginUrl.searchParams.set('error', 'invalid_session');
    
    // Eliminar la cookie inválida
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('admin-auth');
    return response;
    
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
    
    // Error al analizar la sesión, redirigir al login
    const loginUrl = new URL('/espacio', request.url);
    loginUrl.searchParams.set('from', path);
    loginUrl.searchParams.set('error', 'session_error');
    
    // Eliminar la cookie inválida
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('admin-auth');
    return response;
  }
}

// Configure which paths should be processed by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
