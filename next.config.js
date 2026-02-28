const checkEnvVariables = require("./check-env-variables")
const nextIntl = require("next-intl/plugin")


checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */

const withNextIntl = nextIntl("./src/lib/i18n/request-config.js")

const configOpts = {
  httpAgentOptions: {
    keepAlive: false,
  },
  async headers() {
    return [
        {
            source: '/:path*', // Match all routes
            headers: [
                { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
                { key: 'Pragma', value: 'no-cache' },
                { key: 'Expires', value: '0' },
            ],
        },
    ];
},
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "9000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9090",
        pathname: "/medusa/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dashboard.casanesteg.com",
        pathname: "/**",
      },
    ],
  },
}

const nextConfig = withNextIntl(configOpts)

module.exports = nextConfig