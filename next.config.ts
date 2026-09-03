import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {

  allowedDevOrigins: ["http://192.168.1.7:3000", "http://192.168.56.1:3000", "http://192.168.1.9:8000"],

  // images: {
  //   qualities: [70, 75],

  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "dashboard.casanesteg.com",
  //       pathname: "/static/uploads/**",
  //     },
  //   ],
  // },

  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "dashboard.casanesteg.com",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "media.casanesteg.com",
  //     },
  //   ]
  // },
  images: {
    unoptimized: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
    experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },


};

export default withNextIntl(nextConfig);