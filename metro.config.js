const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Dukungan file .wasm untuk expo-sqlite di web
if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

// Header untuk SharedArrayBuffer (dipakai SQLite di web)
config.server = config.server || {};
const previousEnhance = config.server.enhanceMiddleware;

config.server.enhanceMiddleware = (middleware, server) => {
  const base = previousEnhance ? previousEnhance(middleware, server) : middleware;
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    base(req, res, next);
  };
};

module.exports = config;