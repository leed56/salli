export function getRequiredClientEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getOptionalClientEnv(key: string) {
  return process.env[key] ?? null;
}
