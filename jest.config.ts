import type { Config } from '@jest/types';

export default {
  setupFilesAfterEnv: ['./test/setup-jest.ts'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/', 'dist/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/__test__/*',
    '!src/**/*.spec.ts',
    '!src/**/*.test-helper.ts',
  ],
  coverageReporters: ['text', 'text-summary'],
} as Config.InitialOptions;
