import { Config } from '@jest/types';
import { pathsToModuleNameMapper, RawCompilerOptions } from 'ts-jest';
import tsconfig from './tsconfig.json';

// https://jestjs.io/docs/configuration

function matchProject(project?: string): (file: string) => boolean {
  return file => !project || file.includes(project);
}

function setupEnv(project?: string): Config.InitialOptions {
  return {
    verbose: true,
    testEnvironment: 'jsdom',
    testURL: 'http://localhost/',
  };
}

function coverageConfig(project?: string): Config.InitialOptions {
  return {
    // jest-junit 生成报告配置见 package.json 中的 jest-junit 项
    testResultsProcessor: 'jest-junit',
    collectCoverageFrom: [
      '<rootDir>/(src|test)/**/*.(ts|tsx)',
      '<rootDir>/packages/*/(src|test)/**/*.(ts|tsx)',
      '!**/__tests__/**',
      '!**/*.(test|spec).(ts|tsx)',
    ],
    // https://gist.github.com/rishitells/3c4536131819cff4eba2c8ab5bbb4570
    coverageReporters: ['cobertura', 'text', 'text-summary'],
    reporters: ['default', 'jest-junit'],
    // 测试覆盖率报告生成目录
    coverageDirectory: 'out/Test',
  };
}

// 初始化环境
const globalSetupFiles = ['reflect-metadata'];
const projectSetupFiles = ['<rootDir>/packages/app/testing/setup.js'];
// 预加载扩展
const globalSetupFilesAfterEnv = ['jest-enzyme'];
const projectSetupFilesAfterEnv = [
  '<rootDir>/testing/jest.setup.ts',
  '<rootDir>/packages/demo/testing/setup-jest.ts',
  '<rootDir>/packages/app/testing/setupAfterEnv.ts',
];
function setupFiles(
  project?: string
): Pick<Config.InitialOptions, 'setupFiles' | 'setupFilesAfterEnv'> {
  return {
    setupFiles: [
      ...projectSetupFiles.filter(matchProject(project)),
      ...globalSetupFiles,
    ],
    setupFilesAfterEnv: [
      ...projectSetupFilesAfterEnv.filter(matchProject(project)),
      ...globalSetupFilesAfterEnv,
    ],
  };
}

function testTarget(
  project?: string
): Pick<
  Config.InitialOptions,
  | 'testRegex'
  | 'testMatch'
  | 'testPathIgnorePatterns'
  | 'modulePathIgnorePatterns'
> {
  return {
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.(spec|test).(ts|tsx)',
      '<rootDir>/testing/**/*.(spec|test).(ts|tsx)',
      `<rootDir>/packages/${
        project ?? '*'
      }/src/**/__tests__/**/*.(spec|test).(ts|tsx)`,
      `<rootDir>/packages/${project ?? '*'}/testing/**/*.(spec|test).(ts|tsx)`,
      '<rootDir>/jest.config.build.spec.ts',
    ],
    // 忽略的测试示例文件
    testPathIgnorePatterns: ['<rootDir>/testing/demo'],
    // 忽略的模块，不参与编译
    modulePathIgnorePatterns: ['<rootDir>/packages/doc'],
  };
}

function parserConfig(
  project?: string
): Pick<
  Config.InitialOptions,
  'moduleNameMapper' | 'preset' | 'transform' | 'globals'
> {
  return {
    preset: 'ts-jest',
    globals: {
      'ts-jest': {
        isolatedModules: true,
        tsconfig: tsconfig.compilerOptions as RawCompilerOptions,
      },
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    // https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/
    moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  };
}

function snapshotConfig(
  project?: string
): Pick<Config.InitialOptions, 'snapshotSerializers'> {
  return { snapshotSerializers: ['enzyme-to-json/serializer'] };
}

const packagePrefix = '@package/';

export function createJestConfig(project?: string): Config.InitialOptions {
  if (project) {
    project = project.slice(packagePrefix.length);
  }

  let config: Config.InitialOptions = {};
  if (!!project) {
    config.rootDir = '../../';
  }
  config = {
    ...testTarget(project),
    ...parserConfig(project),
    ...setupFiles(project),
    ...snapshotConfig(project),
    ...setupEnv(project),
    ...config,
  };
  if (!project) {
    config = {
      ...config,
      ...coverageConfig(project),
    };
  }
  return config;
}
