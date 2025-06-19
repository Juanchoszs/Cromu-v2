/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de redireccionamiento para manejar correctamente las rutas
  // (Eliminada la regla que causaba el bucle de redirección)
  // Configuración de encabezados para seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // Configuración de imágenes
  images: {
    domains: ['cromu.vercel.app'],
  },
  // Configuración de variables de entorno
  env: {
    CLIENT_URL: 'https://cromu.vercel.app',
    NEXTAUTH_URL: 'https://cromu.vercel.app',
  },
  // Configuración de compilación
  reactStrictMode: true,
  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  // Configuración de ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
