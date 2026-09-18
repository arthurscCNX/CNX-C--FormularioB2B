import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Endereço original, que pode ter sido enviado a parceiros.
        source: '/formularioB2B',
        destination: '/formulario-cadastro',
        permanent: true,
      },
      {
        // Endereço usado brevemente durante a migração.
        source: '/formulario-b2b',
        destination: '/formulario-cadastro',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
