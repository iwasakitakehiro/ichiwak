/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/discover",
        destination: "/discover/1",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
