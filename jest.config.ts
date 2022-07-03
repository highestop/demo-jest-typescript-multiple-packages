import { Config } from '@jest/types';
import { createGlobalJestConfig } from './test/createJestConfig';
import packageJson from './package.json';

export default createGlobalJestConfig(
  packageJson.name
) as Config.InitialOptions;
