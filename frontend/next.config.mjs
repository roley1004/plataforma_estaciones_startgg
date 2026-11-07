/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Requerido por Konva.js para evitar que Next.js intente empaquetar el paquete nativo 'canvas' en SSR
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;
