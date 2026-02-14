const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['<rootDir>/apps'],

  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',

  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths,
    { prefix: '<rootDir>/' }
  ),
};