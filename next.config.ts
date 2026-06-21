import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {

  images: {
    qualities: [70, 75],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "dashboard.casanesteg.com",
        pathname: "/static/uploads/**",
      },
    ],
  },


  typescript: {
    ignoreBuildErrors: true,
  },

};

export default withNextIntl(nextConfig);