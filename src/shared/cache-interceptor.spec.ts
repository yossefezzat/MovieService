import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CachingInterceptor } from './cache-interceptor';

describe('CachingInterceptor', () => {
  let mockCacheManager;
  let mockCacheManagerGet;
  let mockCacheManagerSet;
  let mockCachedData;
  let mockExecutionContext;
  let mockRequest;
  let mockCallHandler;
  let mockCacheKey;
  let interceptor;

  beforeAll(() => {
    mockCachedData = [
      {
        data: 'mock-cached-data',
      },
    ];
    mockCacheManagerGet = jest.fn().mockResolvedValueOnce(mockCachedData);
    mockCacheManagerSet = jest.fn().mockResolvedValueOnce(true);
    mockCacheManager = {
      get: mockCacheManagerGet,
      set: mockCacheManagerSet,
      wrap: jest.fn(),
      del: jest.fn(),
      reset: jest.fn(),
      store: {},
    };

    interceptor = new CachingInterceptor(mockCacheManager);
  });

  beforeEach(async () => {
    mockRequest = {
      route: {
        path: 'mock-route-path',
      },
      _parsedUrl: {
        path: 'mock-parsed-url-path',
      },
      query: {
        z: '3',
        b: '1',
        a: '2',
      },
    };
    mockCacheKey = `${mockRequest._parsedUrl.path}?a=2&b=1&z=3`;
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue(mockRequest),
    };
    mockCallHandler = {
      handle: jest.fn().mockReturnValue(
        of({ data: 'new-data' }).pipe(
          tap(async (data) => {
            await mockCacheManager.set(mockCacheKey, data, 10000);
          }),
        ),
      ),
    };
  });

  afterEach(() => {
    mockCacheManagerGet.mockRestore();
    mockCacheManagerSet.mockRestore();
    mockExecutionContext = {
      switchToHttp: jest.fn().mockRestore(),
      getRequest: jest.fn().mockRestore(),
    };
    mockCallHandler = {
      handle: jest.fn().mockRestore(),
    };
  });

  describe('intercept', () => {
    it('calls function with the correct params when data are cached', async () => {
      expect(
        await interceptor.intercept(mockExecutionContext, mockCallHandler),
      ).toStrictEqual([, mockCachedData]);
      expect(mockCacheManager.get).toHaveBeenCalledWith(mockCacheKey);
      expect(mockCallHandler.handle).not.toHaveBeenCalled();
    });

    it('calls function with the correct params when data are not cached', async () => {
      mockCacheManagerGet.mockReset().mockResolvedValueOnce(null);
      await interceptor.intercept(mockExecutionContext, mockCallHandler);

      expect(mockCacheManagerGet).toHaveBeenCalledWith(mockCacheKey);
      expect(mockCallHandler.handle).toHaveBeenCalledTimes(1);
    });

    it('sorts query parameters and constructs cache key correctly', async () => {
      mockRequest.query = { z: '3', b: '1', a: '2' };
      const expectedCacheKey = 'mock-parsed-url-path?a=2&b=1&z=3';

      mockCacheManagerGet.mockReset().mockResolvedValueOnce(null);

      await interceptor.intercept(mockExecutionContext, mockCallHandler);

      expect(mockCacheManager.get).toHaveBeenCalledWith(expectedCacheKey);
      expect(mockCallHandler.handle).toHaveBeenCalledTimes(1);
    });
  });
});
