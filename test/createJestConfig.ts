import {
  InitialOptionsTsJest,
  pathsToModuleNameMapper,
  RawCompilerOptions,
} from 'ts-jest';
import tsconfig from '../tsconfig.json';

export { InitialOptionsTsJest } from 'ts-jest';

// https://jestjs.io/docs/configuration

const ProjectPackagePrefix = '@package/';

function resolvePackageName(project: string) {
  return project.slice(ProjectPackagePrefix.length);
}

function createJestConfig(project?: string): InitialOptionsTsJest {
  // 获取 project 名称
  if (project) {
    project = resolvePackageName(project);
  }

  // 组合所有的配置
  return {
    preset: 'ts-jest',
    verbose: true,
    testEnvironment: 'jest-environment-jsdom',
    // 指定 project 时，重定向 root 为 package 外的根目录。这里假设 project 在 /packages/{name}
    rootDir: project ? '../../' : '',
    globals: {
      NODE_ENV: 'test',
      'ts-jest': {
        isolatedModules: true,
        tsconfig: tsconfig.compilerOptions as RawCompilerOptions,
      },
    },
    testMatch: [
      `<rootDir>/packages/${
        project ?? '*'
      }/src/**/__tests__/**/*.(test|spec).(ts|tsx)`,
      `<rootDir>/packages/${project ?? '*'}/testing/**/*.(test|spec).(ts|tsx)`,
    ],
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf)$': 'jest-transform-stub',
    },
    transformIgnorePatterns: [],
    // https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/
    moduleNameMapper: {
      // lodash-es 是 esmodule 要特殊处理
      '^lodash-es$': 'lodash',
      // 如果项目中用了 svgr 将 svg 引入为 ReactComponent，这里统一将其 mock 为 div
      '\\.svg$': '<rootDir>/test/helpers/mock-svgr-component.ts',
      // 因为用 tsconfig.paths 做了 alias，所以解析时要转换一下
      ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
        prefix: '<rootDir>/packages/',
      }),
    },
    setupFiles: ['<rootDir>/test/setupJest.ts'],
    setupFilesAfterEnv: ['<rootDir>/test/setupAfterEnv.ts'],
    // jest-junit 生成报告配置见 package.json 中的 jest-junit 项
    testResultsProcessor: 'jest-junit',
    collectCoverageFrom: [
      `<rootDir>/packages/${project ?? '*'}/src/**/*.(ts|tsx)`,
      '!**/__tests__/**',
      '!**/*.(test|spec).(ts|tsx)',
    ],
    // https://gist.github.com/rishitells/3c4536131819cff4eba2c8ab5bbb4570
    coverageReporters: ['cobertura', 'text', 'text-summary'],
    reporters: ['default', 'jest-junit'],
    // 测试覆盖率报告生成目录
    coverageDirectory: project
      ? `<rootDir>/packages/${project}/out/Test`
      : 'out/Test',
  };
}

export function createGlobalJestConfig(
  packageName?: string
): InitialOptionsTsJest {
  return {
    ...createJestConfig(),
    displayName: packageName ?? 'root',
  };
}

export function createPackageJestConfig(
  packageName: string
): InitialOptionsTsJest {
  return {
    ...createJestConfig(packageName),
    displayName: packageName,
  };
}
