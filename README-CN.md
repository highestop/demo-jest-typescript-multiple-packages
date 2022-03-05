# 测试

为了保证测试配置统一、测试覆盖率正确：

- **CI 只在根目录执行 Jest 测试，只产生一份报告**
- 支持在各个子项目下单独执行 Jest 测试（ 兼容 IDE 行为 ），但配置使用的是同一份，只根据 Project 做了部分裁剪

## 操作

- 在根目录下执行测试 `yarn test` 或 `yarn test:dev` 进入 Watch 模式
- 在各个子目录下执行测试 `yarn jest --watchAll`（ 这里没有 `test` 命令 ）
- 如需查看当前运行的配置，可执行 `yarn jest --showConfig`
- 如需查看即将执行测试的文件，可执行 `yarn jest --listTests`
- GitLab CI 会执行根目录下的 `yarn test:coverage`，生成的报告位于根目录的 `out/Test` 中

## 依赖

通用的 Jest 测试依赖，请安装在根目录的 `package.json` 中。可以使用 `yarn add --dev {package_name} -W` 来安装

部分子项目使用的特殊依赖，可以使用 `yarn workspace {package_name} add --dev {package_name}` 来安装到各个子模块的 `package.json` 中。但我们**建议**还是安装到最外层，管理起来比较简单直观

## 配置

### 测试配置生成

配置生成工具见根目录下的 `/testing/jest.config.builder.ts`

这里提供了 `createJestConfig` 方法来生成 Jest 配置，支持一个入参 `project?: string`

- 若不填，则使用全部配置。见根目录下的 `jest.config.ts`
- 若填写，请确保值与 `packages/` 下的**子目录名相同**。见各个子目录下的 `jest.config.ts`（ 请注意这里的入参为 `packageJson.name`，即要求**子项目的项目名与目录名保持一致** ）

特别地，如指定了子项目，则不会生成测试覆盖率报告

另外：很多 IDE 插件要求必须在包文件所在同级目录中存在 Jest 配置文件才能运行，这些插件会优先使用各个子项目的 Jest 配置。这些子项目配置需要用统一方式生成后再扩展自己想要的配置

### 测试配置修改

如需修改配置，请**只在** `jest.config.builder.ts` 文件中修改，这样能保证无论在哪个项目下执行 Jest 测试的行为都是一致的

特别地，部分配置中指向的文件位置在子项目中，如一个 AfterEnvSetupFile 是 `/packages/document/testing/setup-jest.ts`。这些配置会在 `createJestConfig` 被调用时根据传入的 `project` 来进行过滤，得到**仅所需**的配置

另外，`ts-jest` 的配置为 `tsconfig.json` 导入的 RawCompilerOptions。各个子项目下没有 TypeScript 配置文件，如修改请只修改根目录下的配置文件

## 测试文件规范

- 测试文件：Test Suite、Case 所在的文件
- 被测试文件：功能源码所在的文件
- 测试工具 = Helper
- ~~测试数据 = Mock~~
- ~~测试快照 = Snapshot~~

### 与测试相关的文件位置与命名规则

- 测试文件的文件名除扩展名外的后缀**必须**为 `spec` 或 `test`
    - 如 `app.spec.ts`、`input.test.tsx`
- 测试文件的文件名与被测试代码所在的**文件名一一对应**
    - 如 `app.spec.tsx` 这个测试文件测的是 `app.tsx` 文件中的代码
- 测试文件统一放在与被测试文件**同级**的 `__tests__` 目录中
    - 如 `libs/input.tsx` 的测试文件位于 `libs/__tests__/input.spec.tsx` 中
- 测试文件所需的测试工具放在根目录下的 `/testing/helpers` 目录中，且统一导出
    - 如 `/testing/helpers/document-builder.ts`，导出文件为 `/testing/helpers/index.ts`
- 测试框架所需的启动配置文件，直接位于根目录下的 `/test` 目录中
    - 如 `/testing/setup-jest.ts`

### 测试文件的导入与被导入规则

- 被测试文件**不能**依赖于任何测试文件或测试工具（ ESLint 会禁止这件事 ）
- 所有测试文件都**可以**导入任意被测试文件中的任意成员。实际上，所有需要被测试的模块，都**必须**从文件导出
- 所有测试文件都**可以**导入任意测试工具（ ESLint 会校验只能从 `/testing/helpers/index` 中导入 ）
