# Antigravity 简体中文一键汉化工具

面向 Windows 10/11 用户的 **Google Antigravity 桌面客户端** 深度简体中文离线汉化工具。  
无需安装 Node.js、Python 或任何第三方运行库，无需联网，双击即可在数秒内完成全界面汉化，并支持随时一键无损还原官方原版。

---

## 核心特性

- **零依赖开箱即用**：内置纯 C# 原生 Electron ASAR 无损解包引擎与 PowerShell 主控脚本，目标电脑只需 Windows 10/11 系统自带环境即可离线运行。
- **全界面深度覆盖**：基于客户端前端源码全量提取并逐条精校，内置 **3,507 条静态 UI 词条 + 293 条动态变量模板规则 + 106 条插件/MCP 描述规则**，全面覆盖：
  - 侧边栏、顶栏导航、命令面板、快捷键面板、反馈与更新提示
  - 设置页（常规、外观、模型与配额/AI 积分、自定义项、MCP 服务器、通知、终端、浏览器、远程控制、权限）
  - 应用市场、插件/技能/规则/工作流/钩子、自动化任务、智能体与子智能体协作
  - 代码审阅与差异视图（Diff）、Git/Worktree、终端标签、内置浏览器下载与端口预览、语音录制、PDF 标注
  - **Electron 原生顶栏菜单、右键上下文菜单与系统确认弹窗**（`menu.js` Hook）
- **精准防误伤保护**：
  - 自动保护用户消息气泡、AI 回复的 Markdown 正文、代码块、Monaco 编辑器、Xterm 终端和输入框，**绝不篡改对话内容与代码**；
  - 同步监听 `title` / `placeholder` / `aria-label` 动态属性变化，支持弯引号/省略号标点归一化匹配；
  - 不改写 React DOM 结构（零 `innerHTML` 暴力覆盖），运行轻量流畅（单次翻译约 2 微秒）。
- **无损备份与一键还原**：
  - 首次从官方 `app.asar` 解包时自动保留原文件为 `app.asar.disabled` 并备份原始 `preload.js` / `menu.js`；
  - 支持幂等重复运行（官方自动更新或汉化包升级后，再次双击选 `[1]` 即可平滑刷新）；
  - 随时选择 `[2]` 即可一键无损恢复官方英文原版。

---

## 快速使用（Windows）

1. 前往 [Releases](https://github.com/z1roce/Antigravity-zh-CN/releases) 下载最新压缩包（或克隆本仓库），**完整解压**到任意文件夹（注意：不要在压缩包预览窗口内直接双击）。
2. 双击运行 **`一键汉化Antigravity.bat`**。
3. 在菜单中输入 **`1`** 并回车：
   - 工具会自动定位 Antigravity 安装目录（若安装在了非标准路径，也可以直接把 Antigravity 安装文件夹拖拽到 `.bat` 图标上）；
   - 如检测到 Antigravity 正在运行，按提示输入 `Y` 自动关闭；
   - 等待 2~5 秒完成解包、注入与校验，按提示重启 Antigravity 即可享受完整简体中文界面。

### 菜单功能一览

| 选项 | 说明 |
| :---: | :--- |
| `[1]` | **一键安装 / 更新简体中文汉化**（同时兼容全新原版安装、官方升级后重刷、旧版汉化升级） |
| `[2]` | **一键还原为官方英文原版**（恢复原始 `app.asar` 并清理汉化文件） |
| `[3]` | **查看详细环境诊断信息**（安装路径、客户端版本、当前汉化状态、备份状态等） |

### 命令行静默调用（可选）

```bat
:: 静默安装（自动关闭进程、不暂停）
一键汉化Antigravity.bat -Action Install -ForceClose -NoLaunch -NoPause

:: 静默还原
一键汉化Antigravity.bat -Action Restore -ForceClose -NoPause

:: 查看诊断状态
一键汉化Antigravity.bat -Action Diagnose -NoPause

:: 指定自定义安装目录
一键汉化Antigravity.bat -Action Install -InstallDir "D:\Tools\Antigravity"
```

---

## 目录结构

```text
Antigravity-zh-CN/
├── 一键汉化Antigravity.bat        # 主入口（双击运行，支持拖拽目录与参数透传）
├── scripts/
│   ├── core.ps1                   # 主控脚本（自动检测/进程管理/解包/幂等注入/校验/还原/诊断）
│   └── AsarExtractor.cs           # 零依赖 C# 原生 Electron ASAR 无损解包器
├── payload/
│   ├── dict.json                  # 3,507 条精校简体中文静态 UI 词典
│   ├── core_words.json            # 纯 UI 控件短词兜底表
│   ├── prefix_rules.json          # 插件 / 技能 / MCP 服务器长描述规则
│   ├── preload_template.js        # 渲染层汉化引擎模板（含 293 条动态正则与防误伤保护）
│   ├── menu_template.js           # Electron 原生菜单、右键菜单与系统对话框汉化模板
│   └── meta.json                  # 汉化包版本与统计元信息
├── tests/
│   └── verify.js                  # 自动化语法、覆盖率与防误伤校验脚本
├── README.md
└── LICENSE
```

---

## 常见问题

**Q：Antigravity 官方自动更新后界面变回英文了怎么办？**  
A：官方更新会写入新的 `resources\app.asar`。重新双击 `一键汉化Antigravity.bat` 选择 `[1]`，工具会自动基于新版 `app.asar` 重新无损解包并注入汉化，无需重新下载工具。

**Q：会修改或上传我的对话数据、配置、账号或代码吗？**  
A：不会。本工具完全离线运行，不发起任何网络请求，仅在 Antigravity 客户端的渲染层脚本与菜单脚本末尾追加纯本地文本替换逻辑，且自动跳过对话正文、代码块、终端与编辑器内容。

**Q：发现个别遗漏的英文或想优化某条译文怎么参与贡献？**  
A：欢迎提交 Issue 或 Pull Request！词典数据完全模块化存放在 [`payload/dict.json`](./payload/dict.json) 中：
1. 编辑 `payload/dict.json`（或动态规则 `payload/preload_template.js`）；
2. 运行 `node tests/verify.js` 确保 5 项自动化测试全部通过；
3. 提交 PR 即可。

---

## 许可协议

本项目采用 [MIT License](./LICENSE) 开源，仅供学习交流与提升日常使用体验。Antigravity 为 Google 注册商标与产品，本工具与官方无隶属关系。
