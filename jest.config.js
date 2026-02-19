const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Allow both apps and test infra
  roots: ['<rootDir>/apps', '<rootDir>/test'],

  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',

  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths,
    { prefix: '<rootDir>/' }
  ),

  // Global setup (cache mocking etc.)
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],

  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  maxWorkers: '50%',

  // 🔥 Stability Improvements
  detectOpenHandles: false,   // Only enable manually when debugging
  forceExit: true,            // Prevent worker hanging warning
  testTimeout: 20000,
};
