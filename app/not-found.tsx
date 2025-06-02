import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="text-9xl font-bold text-emerald-600 dark:text-emerald-500 mb-6">404</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Página no encontrada
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Lo sentimos, la página que estás buscando no está disponible o no existe.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/" passHref>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 text-lg">
                    <Home className="mr-2 h-5 w-5" />
                    Volver al inicio
                  </Button>
                </Link>
                <Link href="/contacto" passHref>
                  <Button variant="outline" className="px-6 py-6 text-lg border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700">
                    Contactar soporte
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const dynamic = 'force-static';
