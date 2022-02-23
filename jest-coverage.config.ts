import type { Config } from '@jest/types'
import jestConfig from './jest.config'

export default {
    ...jestConfig,
    testResultsProcessor: 'jest-junit',
    coverageReporters: ['cobertura', 'text', 'text-summary'],
    reporters: ['default', 'jest-junit'],
    coverageDirectory: 'out/Test'
} as Config.InitialOptions
