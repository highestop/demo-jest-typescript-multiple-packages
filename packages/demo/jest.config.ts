import { Config } from '@jest/types'
import { createJestConfig } from '../../testing/jest.config.builder'
import packageJson from './package.json'

export default {
    ...createJestConfig(packageJson.name),
    displayName: packageJson.name
} as Config.InitialOptions
