module.exports = {
  swcMinify: false,
  trailingSlash: true,
  env: {
    // HOST - change to your local backend for development
    HOST_API_KEY: 'http://192.168.17.124:8000/api/app/v1',
  },
  async rewrites() {
    return process.env.NODE_ENV !== 'production'
      ? [
          {
            source: '/api/app/v1/:path*',
            destination: 'http://192.168.17.124:8000/api/app/v1/:path*',
          },
        ]
      : [];
  },
};
