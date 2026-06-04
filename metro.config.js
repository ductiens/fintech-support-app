const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable unstable package exports resolution to prevent bundling issues with @tanstack/react-query
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
