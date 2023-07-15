const runtimeCaching = require('next-pwa/cache');
const withTM = require('next-transpile-modules')(['@0xsquid/widget']);

const withPWA = require('next-pwa')({
  dest: 'public',
  skipWaiting: true,
  register: true,
  disable: process.env.NODE_ENV !== 'production',
  runtimeCaching
});

/** @type {import('next').NextConfig} */
module.exports = withTM(
  withPWA({
    reactStrictMode: true,

    webpack(config, options) {
      config.module.rules.push({
        test: /\.mp3$/,
        use: {
          loader: 'url-loader'
        }
      });
      return config;
    },
    target: 'serverless',
    images: {
      domains: ['*']
    }
  })
);
