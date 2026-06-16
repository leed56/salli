const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// expo-sqlite's web build ships a WebAssembly binary (wa-sqlite.wasm) that Metro
// must treat as a resolvable asset, otherwise web bundling fails to resolve it.
config.resolver.assetExts.push("wasm");

// NativeWind v4 compiles Tailwind classes via Metro using ./global.css as input.
module.exports = withNativeWind(config, { input: "./global.css" });
