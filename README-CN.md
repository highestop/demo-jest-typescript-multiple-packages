# 测试

为了保证测试配置统一、测试覆盖率正确：

- **CI 只在根目录执行 Jest 测试，只产生一份报告**
- 支持在各个子模块下单独执行 Jest 测试（ 兼容 IDE 行为 ），但配置使用的是同一份，只根据 Project 做了部分裁剪

## 操作

- 在根目录下执行测试 `yarn test` 或 `yarn test:dev` 进入 Watch 模式
- 支持在各个子目录下执行 `yarn jest` 或使用 IDE 插件单独运行测试
- 执行 `yarn test:config` 查看当前运行的配置
- 执行 `yarn test:list` 查看即将执行测试的文件
- GitLab CI 会执行根目录下的 `yarn test:coverage`，生成的报告位于根目录的 `out/Test` 中

## 依赖

通用的 Jest 测试依赖，请安装在根目录的 `package.json` 中。可以使用 `yarn add --dev {package_name} -W` 来安装

部分子模块使用的特殊依赖，可以使用 `yarn workspace {package_name} add --dev {package_name}` 来安装到各个子模块的 `package.json` 中。但我们**建议**还是安装到最外层，管理起来比较简单直观

## 配置

### 测试配置生成

配置生成工具见根目录下的 `/create-jest-config.ts`

这里提供了 `createJestConfig` 方法来生成 Jest 配置，支持一个入参 `project?: string`

- 若不填，则使用全部配置。见根目录下的 `jest.config.ts`
- 若填写，请确保值与 `packages/` 下的**子目录名相同**。见各个子目录下的 `jest.config.ts`（ 请注意这里的入参为 `packageJson.name`，即要求**子模块的模块名与目录名保持一致** ）

特别地，如指定了子模块，则不会生成测试覆盖率报告

另外：很多 IDE 插件要求必须在包文件所在同级目录中存在 Jest 配置文件才能运行，这些插件会优先使用各个子模块的 Jest 配置。这些子模块配置需要用统一方式生成后再扩展自己想要的配置。参考如下：

```ts
// jest.config.ts
import { Config } from '@jest/types';
import { createJestConfig } from './test/create-jest-config';
import packageJson from './package.json';

export default {
  ...createJestConfig(packageJson.name),
  displayName: packageJson.name,
} as Config.InitialOptions;
```

### 测试配置修改

如需修改配置，请**只在** `create-jest-config.ts` 文件中修改，这样能保证无论在哪个模块下执行 Jest 测试的行为都是一致的

特别地，部分配置中指向的文件位置在子模块中，如一个 AfterEnvSetupFile 是 `/packages/app/test/setup-jest.ts`。这些配置会在 `createJestConfig` 被调用时根据传入的 `project` 来进行过滤，得到**仅所需**的配置

另外，`ts-jest` 的配置为 `tsconfig.json` 导入的 RawCompilerOptions。各个子模块下没有 TypeScript 配置文件，如修改请只修改根目录下的配置文件
