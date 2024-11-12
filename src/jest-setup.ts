jest.mock('cache-manager-redis-yet');
jest.mock('bcryptjs');

process.env = {
  ...process.env,
  CACHE_TTL_MAP: '{"mock-url" : 10}',
};
