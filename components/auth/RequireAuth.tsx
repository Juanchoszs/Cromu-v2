"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/validate-session');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
          } else {
            router.push('/espacio?redirect=/admin');
          }
        } else {
          router.push('/espacio?redirect=/admin');
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        router.push('/espacio?redirect=/admin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Mostrar spinner mientras verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido protegido
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Por defecto, no mostrar nada (ya que se está redirigiendo)
  return null;
};

export default RequireAuth;
