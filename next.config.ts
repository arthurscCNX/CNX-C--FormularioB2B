import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Parceiros podem ter recebido o endereço antigo; ele não pode quebrar.
        source: '/formularioB2B',
        destination: '/formulario-b2b',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
