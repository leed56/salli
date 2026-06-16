const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// expo-sqlite's web build ships a WebAssembly binary (wa-sqlite.wasm) that Metro
// must treat as a resolvable asset, otherwise web bundling fails to resolve it.
config.resolver.assetExts.push("wasm");

module.exports = config;
