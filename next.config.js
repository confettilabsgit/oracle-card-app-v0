/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

const nextConfig = withPWA({
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
  },
})

module.exports = nextConfig
  
  