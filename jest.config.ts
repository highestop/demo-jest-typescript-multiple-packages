import { Config } from '@jest/types';
import { createJestConfig } from './test/create-jest-config';
import packageJson from './package.json';

export default {
  ...createJestConfig(),
  displayName: packageJson.name,
} as Config.InitialOptions;
