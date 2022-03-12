import { isMatch } from 'micromatch';
import { createJestConfig } from './create-jest-config';

function expectMatchersToMatchPath(
  matchers: string[] | undefined,
  matchee: string
): boolean {
  matchers = matchers ?? [];
  const include = matchers
    .filter(matcher => !matcher.startsWith('!'))
    .some(matcher => isMatch(matchee, matcher));
  const exclude = matchers
    .filter(matcher => matcher.startsWith('!'))
    .every(matcher => isMatch(matchee, matcher));
  return include && exclude;
}

const jestBuilderSpec = '<rootDir>/test/jest.config.builder.spec.ts';
const jestBuilder = '<rootDir>/test/jest.config.builder.ts';

const otherConfig = '<rootDir>/jest.config.ts';
const otherPackageConfig = '<rootDir>/packages/app/service.plugin.ts';

const srcScopedSpecTs =
  '<rootDir>/packages/app/src/component/__tests__/index.spec.ts';
const srcScopedSpecTsx =
  '<rootDir>/packages/app/src/component/__tests__/index.spec.tsx';
const srcScopedTestTs =
  '<rootDir>/packages/app/src/component/__tests__/index.spec.ts';
const srcScopedTestTsx =
  '<rootDir>/packages/app/src/component/__tests__/index.spec.tsx';
const srcScopedTs = '<rootDir>/packages/app/src/component/__tests__/index.ts';
const srcScopedTsx = '<rootDir>/packages/app/src/component/__tests__/index.tsx';

const srcUnscopedSpecTs = '<rootDir>/packages/app/src/component/index.spec.ts';
const srcUnscopedSpecTsx =
  '<rootDir>/packages/app/src/component/index.spec.tsx';
const srcUnscopedTestTs = '<rootDir>/packages/app/src/component/index.spec.ts';
const srcUnscopedTestTsx =
  '<rootDir>/packages/app/src/component/index.spec.tsx';
const srcUnscopedTs = '<rootDir>/packages/app/src/component/index.ts';
const srcUnscopedTsx = '<rootDir>/packages/app/src/component/index.tsx';

const helperSpecTs = '<rootDir>/packages/app/test/index.spec.ts';
const helperSpecTsx = '<rootDir>/packages/app/test/index.spec.tsx';
const helperTestTs = '<rootDir>/packages/app/test/index.spec.ts';
const helperTestTsx = '<rootDir>/packages/app/test/index.spec.tsx';
const helperTs = '<rootDir>/packages/app/test/index.ts';
const helperTsx = '<rootDir>/packages/app/test/index.tsx';

describe('Jest Config Builder', () => {
  test('指定 Project, 不应该生成 Coverage Path', () => {
    expect(
      createJestConfig('@package/app').collectCoverageFrom
    ).toBeUndefined();
  });
  describe('不指定 Project, Coverage Path 应该能正确匹配到路径', () => {
    test('packages/*/src 下非 __tests__ 下的 *.(ts|tsx) 应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          srcUnscopedTs
        )
      ).toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          srcUnscopedTsx
        )
      ).toBeTruthy();
    });
    test('packages/*/src 下非 __tests__ 下的 *.(spec|test).(ts|tsx) 不应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          srcUnscopedSpecTs
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          srcUnscopedSpecTsx
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          srcUnscopedTestTs
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          srcUnscopedTestTsx
        )
      ).not.toBeTruthy();
    });
    test('packages/*/src 下的 __tests__ 下的所有文件不应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          srcScopedSpecTs
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          srcScopedSpecTsx
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          srcScopedTestTs
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          srcScopedTestTsx
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          srcScopedTs
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          srcScopedTsx
        )
      ).not.toBeTruthy();
    });
    test('packages/*/test 下的 *.(ts|tsx) 应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          helperTs
        )
      ).toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          helperTsx
        )
      ).toBeTruthy();
    });
    test('packages/*/test 下的 *.(spec|test).(ts|tsx) 不应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          helperSpecTs
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          helperSpecTsx
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          helperTestTs
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          helperTestTsx
        )
      ).not.toBeTruthy();
    });
    test('packages/*/ 根目录下的 *.ts 不应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          otherConfig
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().collectCoverageFrom,
          otherPackageConfig
        )
      ).not.toBeTruthy();
    });
  });
  describe('指定 Project, Test Matcher 应该能正确匹配到路径', () => {
    test('packages/*/src 下的 __tests__/*.(spec|test).(ts|tsx) 文件应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          srcScopedSpecTs
        )
      ).toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          srcScopedTestTs
        )
      ).toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          srcScopedSpecTsx
        )
      ).toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          srcScopedTestTsx
        )
      ).toBeTruthy();
    });
    test('packages/*/src 下的 __tests__/*.(ts|tsx) 文件不应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          srcScopedTs
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          srcScopedTsx
        )
      ).not.toBeTruthy();
    });
    test('packages/*/src 下非 __tests__ 下的文件不应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          srcUnscopedSpecTs
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          srcUnscopedSpecTsx
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          srcUnscopedTestTs
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          srcUnscopedTestTsx
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          srcUnscopedTs
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          srcUnscopedTsx
        )
      ).not.toBeTruthy();
    });
    test('packages/*/test 下的 *.(spec|test).(ts|tsx) 文件应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          helperSpecTs
        )
      ).toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          helperTestTs
        )
      ).toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          helperSpecTsx
        )
      ).toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          helperTestTsx
        )
      ).toBeTruthy();
    });
    test('packages/*/test 下的 *.(ts|tsx) 文件不应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          helperTs
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          helperTsx
        )
      ).not.toBeTruthy();
    });
    test('build.spec.ts 自己应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          jestBuilderSpec
        )
      ).toBeTruthy();
    });
    test('build.ts 不应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          jestBuilder
        )
      ).not.toBeTruthy();
    });
    test('其它配置文件不应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          otherConfig
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig('@package/app').testMatch,
          otherPackageConfig
        )
      ).not.toBeTruthy();
    });
  });
  describe('不指定 Project, Test Matcher 应该能正确匹配到路径', () => {
    test('packages/*/src 下的 __tests__/*.(spec|test).(ts|tsx) 文件应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, srcScopedSpecTs)
      ).toBeTruthy();
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, srcScopedTestTs)
      ).toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().testMatch,
          srcScopedSpecTsx
        )
      ).toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().testMatch,
          srcScopedTestTsx
        )
      ).toBeTruthy();
    });
    test('packages/*/src 下的 __tests__/*.(ts|tsx) 文件不应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, srcScopedTs)
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, srcScopedTsx)
      ).not.toBeTruthy();
    });
    test('packages/*/src 下非 __tests__ 下的文件不应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(
          createJestConfig().testMatch,
          srcUnscopedSpecTs
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().testMatch,
          srcUnscopedSpecTsx
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().testMatch,
          srcUnscopedTestTs
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().testMatch,
          srcUnscopedTestTsx
        )
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, srcUnscopedTs)
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, srcUnscopedTsx)
      ).not.toBeTruthy();
    });
    test('packages/*/test 下的 *.(spec|test).(ts|tsx) 文件应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, helperSpecTs)
      ).toBeTruthy();
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, helperTestTs)
      ).toBeTruthy();
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, helperSpecTsx)
      ).toBeTruthy();
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, helperTestTsx)
      ).toBeTruthy();
    });
    test('packages/*/test 下的 *.(ts|tsx) 文件不应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, helperTs)
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, helperTsx)
      ).not.toBeTruthy();
    });
    test('build.spec.ts 自己应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, jestBuilderSpec)
      ).toBeTruthy();
    });
    test('build.ts 不应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, jestBuilder)
      ).not.toBeTruthy();
    });
    test('其它配置文件不应该能匹配到', () => {
      expect(
        expectMatchersToMatchPath(createJestConfig().testMatch, otherConfig)
      ).not.toBeTruthy();
      expect(
        expectMatchersToMatchPath(
          createJestConfig().testMatch,
          otherPackageConfig
        )
      ).not.toBeTruthy();
    });
  });
});
