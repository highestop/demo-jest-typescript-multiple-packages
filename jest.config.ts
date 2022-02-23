import { Config } from '@jest/types';
import { createJestConfig } from './jest.config.build';
import packageJson from './package.json';

export default {
  ...createJestConfig(),
  displayName: packageJson.name,
} as Config.InitialOptions;
