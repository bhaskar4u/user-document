jest.setTimeout(20000);

// 🔥 Globally mock cache utils
jest.mock('@app/common', () => {
  const actual = jest.requireActual('@app/common');

  return {
    ...actual,
    setCache: jest.fn().mockResolvedValue(undefined),
    getCache: jest.fn().mockResolvedValue(null),
    delCache: jest.fn().mockResolvedValue(undefined),
  };
});

// Silence Redis warning just in case
const originalWarn = console.warn;

console.warn = (...args) => {
  if (args[0] && args[0].toString().includes('Redis')) {
    return;
  }
  originalWarn(...args);
};

afterEach(() => {
  jest.clearAllMocks();
});
