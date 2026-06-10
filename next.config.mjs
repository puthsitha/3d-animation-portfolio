/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Cache the figurine video aggressively — it never changes between deploys
        // without a filename change anyway, and re-downloading ~1MB on every visit
        // defeats the scrub preload.
        source: "/figurine-spin.mp4",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
