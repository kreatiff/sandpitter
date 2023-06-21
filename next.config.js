/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  env: {
    CANVAS_API_TOKEN: process.env.CANVAS_API_TOKEN
  },
}

module.exports = nextConfig
