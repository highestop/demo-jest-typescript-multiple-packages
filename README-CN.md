# 测试

为了保证测试配置统一、测试覆盖率正确：

- **CI 只在根目录执行 Jest 测试，只产生一份报告**
- 支持在各个 Project 下单独执行 Jest 测试（ 兼容 IDE 行为 ），但配置使用的是同一份，只根据 Project 做了部分裁剪

## 操作

- 执行 `yarn test` 进行测试或 `yarn test:dev` 进入 Watch 模式调试
- 可以在各个子目录下直接使用 Jest 命令进行测试
- 可以执行 `yarn test:config` 查看当前运行的配置
- 可以执行 `yarn test:list` 查看即将执行测试的文件
- 可以执行 `yarn test:coverage` 生成的报告，报告位于根目录的 `out/Test` 中

## 依赖

通用的 Jest 测试依赖，请安装在根目录的 `package.json` 中。可以使用 `yarn add --dev {packageName} -W` 来安装

部分子项目使用的特殊依赖，请安装在各个子模块的 `package.json` 中。可以使用 `yarn workspace {projectName} add --dev {packageName}` 来安装

## 配置

### 统一生成配置

全部配置见根目录下的 `jest.config.build.ts`

这里提供了 `createJestConfig` 方法来生成 Jest 配置，支持一个入参 `project?: string`

- 若不填，则使用全部配置。见根目录下的 `jest.config.ts`
- 若填写，请确保值与 `packages/` 下的**子目录名相同**。见各个子目录下的 `jest.config.ts`（ 请注意这里的入参为 `packageJson.name`，即要求**子项目的项目名与目录名保持一致** ）

特别地，如指定了子项目，则不会生成测试覆盖率报告

### 修改配置

如需修改配置，请**只在** `jest.config.build.ts` 文件中修改，这样能保证无论在哪个项目下执行 Jest 测试的行为都是一致的

特别地，部分配置中指向的文件位置在子项目中，如一个 AfterEnvSetupFile 是 `/packages/demo/test/setup-jest.ts`，这些配置会在 `createJestConfig` 被调用时根据传入的 `project` 来进行过滤，得到**所需**的配置

另外，`ts-jest` 的配置为 `tsconfig.json` 导入的 RawCompilerOptions。各个子项目下没有 TSConfig 配置文件，如修改请只修改根目录下的配置文件

需要注意的是，运行 Jest 测试所需的 TSConfig 与构建时所需的不同。构建时应使用 `tsconfig.app.json`，其中排除了所有测试模块中的文件

## 规范

对 `/src` 中非 `__tests__` 目录中的文件称为源文件。对 `/test` 和 `__tests__` 目录下的文件称为测试模块，其中 `*.(test|spec)` 文件称为测试文件，其余可能为测试工具、测试初始化配置等

- **需要**将测试文件统一命名为 `**.(test|spec).(ts|tsx)`。
- **需要**将测试文件放在 `__tests__` 目录下，**建议**与源文件相近
- **建议**将测试初始化配置文件放在根目录的 `/test` 目录下，如 `setup-jest.ts`
- **建议**将测试工具放在 `/test` 目录的 `helpers` 中
- **建议**将测试工具命名为 `**-test-helper.ts`
- **建议**在 `helpers` 目录中创建 `index.ts` 导出公共的测试工具供其它模块使用
- **建议**对公共的测试工具本身进行测试覆盖，如可以创建 `**-test-helper.spec.ts` 文件来测试它们
- **建议**在根目录的 `tsconfig.json` 中配置相应的路径指向这个出口文件，如 `@package/app/test`
- **允许**测试模块引用同一项目下的源文件，无论是否对外导出
- **允许**测试文件引用同一项目下的测试工具，无论是否对外导出

## 扩展

### 自定义 Matcher

定义一个 Matcher 函数，建议作为 TestHelper 写在 `test` 目录下

```ts
export function toCheckEqual(received: string, ..expected: any[]) { .. }
```

Matcher 的返回值类型为

```ts
{
  message: () => string
  pass: boolean
}
```

- 若 `pass` 为 `false` 则 `expect().toCheckEqual()` 断言错误，控制台展示 `message`
- 若 `pass` 为 `true` 则 `expect().toCheckEqual()` 断言正确，`message` 会在 `expect().not.toCheckEqual()` 断言中展示

在 Jest 的 SetupAfterEnv 阶段扩展到 Jest 上

```ts
expect.extend({
  toCheckEqual
})
```

在 `jest.d.ts` 的类型文件（ 没有则创建它并在 TSConfig 中 include 它 ）中声明它

```ts
declare namespace jest {
    interface Matchers<R> {
        toCheckEqual(..expected: any[]): R
    }
}
```
