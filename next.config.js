/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
}

const withTM = require('next-transpile-modules')(['openbim-components', 'bim-fragment', 'three']); // pass the modules you would like to see transpiled

module.exports = withTM(nextConfig);
