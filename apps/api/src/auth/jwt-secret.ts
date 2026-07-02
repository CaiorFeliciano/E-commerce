export function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === 'test') {
    return 'test-secret';
  }

  throw new Error(
    'JWT_SECRET environment variable is required. Configure it in your .env file or deployment environment.',
  );
}
