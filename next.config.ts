export default {
  experimental: {
    ppr: true,
    inlineCss: true,
    useCache: true
  },
  devIndicators:true,
  images: {
    domains: ['static.wixstatic.com','fastly.picsum.photos'],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      }
    ]
  }
};
