import { Config } from '@jest/types';
import { createPackageJestConfig } from '../../test/createJestConfig';
import packageJson from './package.json';

export default createPackageJestConfig(
  packageJson.name
) as Config.InitialOptions;
