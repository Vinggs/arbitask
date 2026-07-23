import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Beritahu next-intl lokasi persis file konfigurasi kita
const withNextIntl = createNextIntlPlugin("./i18n.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "play-lh.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.poki-cdn.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
