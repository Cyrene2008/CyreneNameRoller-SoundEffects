# 来点音效

Cyrene2008 官方示例插件，版本 1.2.1，已使用 Plugin API 1.2 生命周期事件即时同步设置。

插件声明采用拆分格式：`manifest.yml` 保存身份、入口与权限，`contributions.json` 保存宿主声明的 `settings`。两者不能与旧的 `manifest.json` 同时存在。

安装后会在插件管理卡片上显示「插件设置」入口，由宿主原生 Fluent 组件渲染设置页，可以分别为随机点名、翻牌点名和抽奖选择本地音频，设置音量和播放逻辑。

- 每次操作播放一次：多人抽取只播放一次。
- 每次结果都播放：每个逐项揭晓结果都播放一次。

支持 mp3、m4a、wav、flac、ogg。音频以插件数据形式保存在本机，单文件上限为 16 MB。

## 开发

```bash
npm install
npm run validate
npm run build
```

`validate` / `build` 使用 `vendor/` 中随附的 `@starcyrene/cyrene-name-roller` SDK（1.4.0），它与宿主使用同一套声明读取与校验逻辑。

打包只收录 `scripts/stage-plugin.mjs` 中 `publishFiles` 列出的文件——即双声明文件与宿主引用的载荷（Worker、图标、README）。`scripts/`、CI 工作流、`bun.lock`、`vendor/` 这些开发期内容不会进入 `.cnrp`。新增页面资源时记得同步该清单：漏登记会被校验拦住（清单引用的文件缺失，或页面 HTML 引用了未列入清单的同级资源）。

本插件也是官方模板的实际应用示例。新插件建议从 [CyreneNameRoller Plugin Template](https://github.com/Cyrene2008/CyreneNameRoller-Plugin-Template) 开始。

## 更新日志

- 1.2.1：插件声明迁移到 `manifest.yml` + `contributions.json` 拆分格式（身份、入口与权限在 YAML，`settings` 在 JSON）；校验与打包改用随附的 1.4 SDK，发布文件清单收窄到声明与宿主引用的载荷。
- 1.2.0：同步宿主插件 SDK 1.4，兼容通用宿主能力发现、资源查询和宿主管理事务模型；音效插件本身仍只使用音频、存储和结果事件权限。
