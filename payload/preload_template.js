// === ANTIGRAVITY_ZH_CN_BEGIN v2.0.0 ===
// Antigravity Chinese Localization Engine (v2.0.0 - github.com/z1roce/Antigravity-zh-CN)
(function() {
  const dictionary = __ZH_DICT__;

  const coreWords = __ZH_CORE_WORDS__;

  const textPrefixRules = __ZH_PREFIX_RULES__;

  // 规范化查询表：自动兼容弯引号/直引号、Unicode 省略号/三个点、多余空白
  function normalizeKey(s) {
    return s
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\u2026/g, '...')
      .replace(/\u00A0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const normalizedDict = Object.create(null);
  for (const k in dictionary) {
    if (Object.prototype.hasOwnProperty.call(dictionary, k)) {
      const nk = normalizeKey(k);
      if (normalizedDict[nk] === undefined) {
        normalizedDict[nk] = dictionary[k];
      }
    }
  }

// Antigravity 动态模板翻译规则库（基于 hub/main.js 全量 285 条动态模板精编）
function fmtDuration(str) {
  return String(str)
    .replace(/\b(\d+(?:\.\d+)?)\s*days?\b/gi, '$1 天')
    .replace(/\b(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\b/gi, '$1 小时')
    .replace(/\b(\d+(?:\.\d+)?)\s*(?:minutes?|mins?)\b/gi, '$1 分钟')
    .replace(/\b(\d+(?:\.\d+)?)\s*(?:seconds?|secs?)\b/gi, '$1 秒')
    .replace(/(\d+(?:\.\d+)?)\s*ms\b/gi, '$1 毫秒')
    .replace(/(\d+(?:\.\d+)?)\s*h\b/g, '$1 小时')
    .replace(/(\d+(?:\.\d+)?)\s*m\b/g, '$1 分')
    .replace(/(\d+(?:\.\d+)?)\s*s\b/g, '$1 秒')
    .replace(/(\d+(?:\.\d+)?)\s*d\b/g, '$1 天')
    .replace(/,\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const subTerms = {
  'project': '项目', 'projects': '项目',
  'conversation': '对话', 'conversations': '对话',
  'workspace': '工作区', 'workspaces': '工作区',
  'folder': '文件夹', 'folders': '文件夹',
  'file': '文件', 'files': '文件',
  'skill': '技能', 'skills': '技能',
  'rule': '规则', 'rules': '规则',
  'plugin': '插件', 'plugins': '插件',
  'hook': '钩子', 'hooks': '钩子',
  'workflow': '工作流', 'workflows': '工作流',
  'automation': '自动化', 'automations': '自动化',
  'subagent': '子智能体', 'subagents': '子智能体',
  'agent': '智能体', 'agents': '智能体',
  'coordinator': '协调器', 'coordinators': '协调器',
  'tool': '工具', 'tools': '工具',
  'server': '服务器', 'servers': '服务器',
  'mcp server': 'MCP 服务器', 'mcp servers': 'MCP 服务器',
  'model': '模型', 'models': '模型',
  'branch': '分支', 'branches': '分支',
  'tab': '标签页', 'tabs': '标签页',
  'pane': '面板', 'panes': '面板',
  'panel': '面板', 'panels': '面板',
  'step': '步骤', 'steps': '步骤',
  'comment': '评论', 'comments': '评论',
  'artifact': '产物', 'artifacts': '产物',
  'terminal': '终端', 'terminals': '终端',
  'task': '任务', 'tasks': '任务',
  'window': '窗口', 'windows': '窗口',
  'account': '账号', 'accounts': '账号',
  'connector': '连接器', 'connectors': '连接器',
  'host': '主机', 'hosts': '主机',
  'bundle': '插件包', 'bundles': '插件包',
  'group': '分组', 'groups': '分组',
  'shortcut': '快捷键', 'shortcuts': '快捷键',
  'environment': '环境', 'environments': '环境',
  'prompt': '提示词', 'prompts': '提示词',
  'notification': '通知', 'notifications': '通知',
  'recording': '录制', 'recordings': '录制',
  'browser': '浏览器', 'preview': '预览', 'diff': '差异',
  'image': '图片', 'video': '视频', 'media': '媒体',
  'result': '结果', 'results': '结果', 'item': '项', 'items': '项',
  'line': '行', 'lines': '行', 'row': '行', 'rows': '行',
  'turn': '轮', 'turns': '轮', 'page': '页', 'pages': '页',
  'slide': '幻灯片', 'slides': '幻灯片',
  'theme': '主题', 'light': '浅色', 'dark': '深色', 'system': '跟随系统',
  'local': '本地', 'remote': '远程', 'global': '全局', 'cloud': '云端',
  'locally': '本地', 'remotely': '远程', 'in the cloud': '在云端',
  'archive': '归档', 'unarchive': '取消归档', 'delete': '删除', 'rename': '重命名',
  'pin': '置顶', 'unpin': '取消置顶', 'duplicate': '复制', 'export': '导出', 'import': '导入',
  'open': '打开', 'close': '关闭', 'start': '启动', 'stop': '停止', 'restart': '重启',
  'pause': '暂停', 'resume': '继续', 'enable': '启用', 'disable': '禁用',
  'create': '创建', 'update': '更新', 'save': '保存', 'load': '加载',
  'connect': '连接', 'disconnect': '断开连接', 'reconnect': '重新连接',
  'install': '安装', 'uninstall': '卸载', 'configure': '配置', 'edit': '编辑',
  'remove': '移除', 'add': '添加', 'copy': '复制', 'move': '移动', 'fork': '分叉',
  'mark as read': '标记为已读', 'mark as unread': '标记为未读',
  'was': '已', 'were': '已', 'is': '为', 'are': '为',
  'enabled': '已启用', 'disabled': '已禁用'
};

function trTerm(s, dict) {
  if (!s) return s;
  const k = s.trim();
  if (dict && dict[k]) return dict[k];
  const low = k.toLowerCase();
  if (subTerms[low]) return subTerms[low];
  return k;
}

const dynamicRules = [
  // 1. 配额、订阅与积分
  [/^Your Plan:\s*(.+)$/i, (m, d) => `您的订阅方案：${trTerm(m[1], d)}`],
  [/^Available AI Credits:\s*([\d,]+)$/i, (m) => `可用 AI 积分：${m[1]}`],
  [/^When toggled on,\s*(.+?)\s+will use your AI credits to fulfill model requests once you['’]re out of model quota\.\s*(.+?)\s+will always use your model quota first before using AI credits\.?$/i,
    (m) => `启用后，当您的模型配额用尽时，${m[1]} 将使用您的 AI 积分来完成模型请求。${m[2]} 将始终优先使用模型配额。`],
  [/^When toggled on,\s*(.+?)\s+collects usage data to help Google enhance performance and features\.?$/i,
    (m) => `启用后，${m[1]} 将收集使用数据，以帮助 Google 提升性能与功能体验。`],
  [/^Receive product updates, tips, and promotions from Google\s*(.+?)\s+via email\.?$/i,
    (m) => `通过电子邮件接收来自 Google ${m[1]} 的产品更新、使用技巧和优惠活动。`],
  [/^You have used some of your weekly limit, it will fully refresh in (.+?)\.?$/i,
    (m) => `您已使用部分每周限额，它将在 ${fmtDuration(m[1])} 后完全重置。`],
  [/^You have used some of your 5-hour limit, it will fully refresh in (.+?)\.?$/i,
    (m) => `您已使用部分五小时限额，它将在 ${fmtDuration(m[1])} 后完全重置。`],
  [/^Resets? in\s+(.+)$/i, (m) => `将在 ${fmtDuration(m[1])} 后重置`],
  [/^Cost summary:\s*(.+)$/i, (m) => `费用摘要：${m[1]}`],

  // 2. 自定义项预算 / Token / Rules / MCP 预算
  [/^(\d+(?:\.\d+)?)%\s*of the customization budget is available\.?$/i,
    (m) => `自定义项预算可用额度为 ${m[1]}%。`],
  [/^Exceeded the rules token budget\. Full rule content \((.+?) tokens?\) was replaced with a lightweight file-path pointer in context\.?$/i,
    (m) => `超出规则 Token 预算。完整规则内容（${m[1]} Tokens）已在上下文中替换为轻量级文件路径指针。`],
  [/^All tools in this MCP server \((.+?) tokens?\) exceeded the customization budget and were excluded from context\.?$/i,
    (m) => `此 MCP 服务器中的所有工具（${m[1]} Tokens）超出自定义项预算，已从上下文中排除。`],
  [/^(\d+)\s+(.+?)\s+in this MCP server \((.+?) tokens?\) exceeded the customization budget and (?:was|were) excluded from context\.?$/i,
    (m, d) => `此 MCP 服务器中的 ${m[1]} 个${trTerm(m[2], d)}（${m[3]} Tokens）超出自定义项预算，已从上下文中排除。`],
  [/^Exceeded the customization token budget \((.+?) tokens?\) and was excluded from context\.?$/i,
    (m) => `超出自定义项 Token 预算（${m[1]} Tokens），已从上下文中排除。`],
  [/^(\d+)\s+(.+?)\s+exceeded the rules budget and (?:was|were) demoted from full inline content to a file-path pointer\.?$/i,
    (m, d) => `${m[1]} 个${trTerm(m[2], d)}超出规则预算，已从完整内联内容降级为文件路径指针。`],
  [/^(\d+)\s+(.+?)\s+in\s+(.+?)\s+exceeded the customization budget and (?:was|were) excluded from context\.?$/i,
    (m, d) => `${m[3]} 中的 ${m[1]} 个${trTerm(m[2], d)}超出自定义项预算，已从上下文中排除。`],
  [/^(.+?):\s*([\d,.kKmM]+)\s+tokens?$/i, (m, d) => `${trTerm(m[1], d)}：${m[2]} Tokens`],
  [/^(\d+)\s+demoted$/i, (m) => `${m[1]} 项已降级`],
  [/^(\d+)\s+excluded$/i, (m) => `${m[1]} 项已排除`],
  [/^(\d+)\s+(.+?)\s+excluded$/i, (m, d) => `${m[1]} 个${trTerm(m[2], d)}已排除`],
  [/^Show\s+(\d+)\s+breakdowns?$/i, (m) => `显示 ${m[1]} 项明细`],

  // 3. 计划 / 步骤 / 对话进度 / 思考与运行耗时
  [/^Worked for\s+([\d.\s a-zA-Z]+)$/i, (m) => `运行耗时 ${fmtDuration(m[1])}`],
  [/^Thought for\s+([\d.\s a-zA-Z]+)$/i, (m) => `思考耗时 ${fmtDuration(m[1])}`],
  [/^Running for\s+(.+)$/i, (m) => `已运行 ${fmtDuration(m[1])}`],
  [/^Up\s+([\d.\s]+(?:ms|s|m|h|d|secs?|mins?|hrs?|days?|seconds?|minutes?|hours?))$/i, (m) => `已运行 ${fmtDuration(m[1])}`],
  [/^Waiting for command completion \(up to (\d+) seconds?\)$/i, (m) => `正在等待命令完成（最多 ${m[1]} 秒）`],
  [/^Waiting for your input(.*)$/i, (m) => `等待您的输入${m[1]}`],
  [/^Plan,\s*(\d+)\s+of\s+(\d+)\s+steps?\s+done$/i, (m) => `计划，已完成 ${m[1]} / ${m[2]} 步`],
  [/^Show\s+(\d+)\s+earlier steps?$/i, (m) => `显示前 ${m[1]} 个步骤`],
  [/^Show\s+(\d+)\s+more subagents?$/i, (m) => `再显示 ${m[1]} 个子智能体`],
  [/^\((\d+)\s+steps?\)$/i, (m) => `（${m[1]} 步）`],
  [/^Step\s+(\d+)\s+of\s+(\d+)$/i, (m) => `第 ${m[1]} / ${m[2]} 步`],
  [/^Question\s+(\d+)\s+of\s+(\d+)$/i, (m) => `第 ${m[1]} / ${m[2]} 个问题`],
  [/^Turn\s+(\d+)\s+of\s+(\d+)$/i, (m) => `第 ${m[1]} / ${m[2]} 轮`],
  [/^Go to turn\s+(\d+)\s+of\s+(\d+)$/i, (m) => `跳转到第 ${m[1]} / ${m[2]} 轮`],
  [/^Turn\s+(\d+)$/i, (m) => `第 ${m[1]} 轮`],
  [/^(\d+)\s+of\s+(\d+)$/i, (m) => `${m[1]} / ${m[2]}`],
  [/^Explored\s+(\d+)\s+files?\s*>$/i, (m) => `已浏览 ${m[1]} 个文件 >`],
  [/^Explored\s+(\d+)\s+files?$/i, (m) => `已浏览 ${m[1]} 个文件`],
  [/^Editing\s+(.+?)\s+\+(\d+)\s+-(\d+)$/i, (m) => `正在编辑 ${m[1]} +${m[2]} -${m[3]}`],
  [/^(\d+)\s+lines?\s+added,\s*(\d+)\s+lines?\s+removed$/i, (m) => `新增 ${m[1]} 行，删除 ${m[2]} 行`],
  [/^(\d+)\s+(files?|items?|lines?|changes?)\s+changed$/i, (m, d) => `已修改 ${m[1]} 个${trTerm(m[2], d)}`],
  [/^Unfold lines?\s+(\d+)\s*[-–]\s*(\d+)$/i, (m) => `展开第 ${m[1]}-${m[2]} 行`],
  [/^Fold lines?\s+(\d+)\s*[-–]\s*(\d+)$/i, (m) => `折叠第 ${m[1]}-${m[2]} 行`],
  [/^Line\s+(\d+)\s*→\s*(\d+)$/i, (m) => `第 ${m[1]} → ${m[2]} 行`],
  [/^Showing first\s+(\d+)\s+references?$/i, (m) => `显示前 ${m[1]} 条引用`],
  [/^(\d+)\s*\/\s*(\d+)\s+rows?$/i, (m) => `${m[1]} / ${m[2]} 行`],
  [/^(\d+)\s+rows?$/i, (m) => `${m[1]} 行`],
  [/^(\d+)\s+comments?$/i, (m) => `${m[1]} 条评论`],
  [/^(\d+)\s+seconds?$/i, (m) => `${m[1]} 秒`],
  [/^(\d+)\s+days?$/i, (m) => `${m[1]} 天`],
  [/^(\d+)\s+tools?$/i, (m) => `${m[1]} 个工具`],
  [/^(\d+)\s+tools?\s+enabled$/i, (m) => `已启用 ${m[1]} 个工具`],
  [/^(\d+)\s+tools?\s+disabled$/i, (m) => `已禁用 ${m[1]} 个工具`],
  [/^(\d+)\s+hidden hosts?$/i, (m) => `${m[1]} 个隐藏主机`],
  [/^(\d+)\s+accounts?$/i, (m) => `${m[1]} 个账号`],
  [/^\+(\d+)\s+more\s*\(Show all\)$/i, (m) => `还有 ${m[1]} 项（显示全部）`],
  [/^\+(\d+)\s+more$/i, (m) => `还有 ${m[1]} 项`],
  [/^\+(\d+)\s+attachments?$/i, (m) => `+${m[1]} 个附件`],
  [/^(\d+)\s+more$/i, (m) => `还有 ${m[1]} 项`],
  [/^Chunk\s+(\d+)$/i, (m) => `片段 ${m[1]}`],
  [/^Source\s+(\d+)$/i, (m) => `来源 ${m[1]}`],
  [/^Image\s+(\d+)$/i, (m) => `图片 ${m[1]}`],
  [/^Artifact image\s+(\d+)$/i, (m) => `产物图片 ${m[1]}`],
  [/^User uploaded media\s+(\d+)$/i, (m) => `用户上传的媒体 ${m[1]}`],
  [/^Open image\s+(\d+)\s+of\s+(\d+)$/i, (m) => `打开第 ${m[1]} / ${m[2]} 张图片`],
  [/^Go to slide\s+(\d+)$/i, (m) => `转到第 ${m[1]} 张幻灯片`],
  [/^Unnamed Agent\s+(\d+)$/i, (m) => `未命名智能体 ${m[1]}`],
  [/^Rule\s+(\d+)$/i, (m) => `规则 ${m[1]}`],
  [/^UI Plugin\s+(\d+)$/i, (m) => `UI 插件 ${m[1]}`],
  [/^Automation\s+(\d+)$/i, (m) => `自动化 ${m[1]}`],
  [/^(\d+)\s+CEL values?$/i, (m) => `${m[1]} 个 CEL 值`],

  // 4. 相对时间
  [/^(\d+)\s*s(?:\s*ago)?$/i, (m) => `${m[1]} 秒前`],
  [/^(\d+)\s*m(?:\s*ago)?$/i, (m) => `${m[1]} 分钟前`],
  [/^(\d+)\s*h(?:\s*ago)?$/i, (m) => `${m[1]} 小时前`],
  [/^(\d+)\s*d(?:\s*ago)?$/i, (m) => `${m[1]} 天前`],
  [/^(\d+)\s*w(?:\s*ago)?$/i, (m) => `${m[1]} 周前`],

  // 5. 计数栏与按钮
  [/^Files? Changed\s*(\d+)$/i, (m) => `已修改文件 ${m[1]}`],
  [/^Uploads?\s*(\d+)$/i, (m) => `已上传文件 ${m[1]}`],
  [/^Artifacts?\s*(\d+)$/i, (m) => `产物 ${m[1]}`],
  [/^Background Tasks?\s*(\d+)$/i, (m) => `后台任务 ${m[1]}`],
  [/^Terminals?\s*(\d+)$/i, (m) => `终端 ${m[1]}`],
  [/^See all\s*\((.+?)\)$/i, (m) => `查看全部 (${m[1]})`],
  [/^Send all\s*\((\d+)\)$/i, (m) => `全部发送 (${m[1]})`],
  [/^Add\s*\((\d+)\)$/i, (m) => `添加 (${m[1]})`],
  [/^Skip\s*\((.+?)\)$/i, (m) => `跳过 (${m[1]})`],
  [/^Skip All\s*\((.+?)\)$/i, (m) => `全部跳过 (${m[1]})`],
  [/^Cancel Questionnaire and Stop the Agent\s*\((.+?)\)$/i, (m) => `取消问卷并停止智能体 (${m[1]})`],
  [/^Sort and filter conversations\s*\((\d+)\s+active\)$/i, (m) => `排序和筛选对话（已启用 ${m[1]} 项）`],
  [/^Switch environment\s*\((.+?)\)$/i, (m, d) => `切换环境 (${trTerm(m[1], d)})`],
  [/^SSH Config\s*\((.+?)\)$/i, (m) => `SSH 配置 (${m[1]})`],
  [/^Stop\s+(\d+)\s+selected$/i, (m) => `停止已选中的 ${m[1]} 项`],
  [/^See\s+(\d+)\s+more\s+(.+)$/i, (m, d) => `再查看 ${m[1]} 个${trTerm(m[2], d)}`],
  [/^See more\s+(.+)$/i, (m, d) => `查看更多${trTerm(m[1], d)}`],
  [/^See more in\s+(.+)$/i, (m, d) => `在 ${trTerm(m[1], d)} 中查看更多`],
  [/^See less in\s+(.+)$/i, (m, d) => `在 ${trTerm(m[1], d)} 中收起`],

  // 6. 预览、端口、浏览器与下载
  [/^Playback speed\s*([\d.]+)x$/i, (m) => `播放速度 ${m[1]}x`],
  [/^Voice [Ss]peed,\s*([\d.]+)x$/i, (m) => `语音速度，${m[1]}x`],
  [/^Zoom\s*(\d+)%,\s*reset to fit$/i, (m) => `缩放 ${m[1]}%，点击重置以适应`],
  [/^The browser blocked the download of\s+(.+)$/i, (m) => `浏览器已拦截 ${m[1]} 的下载`],
  [/^The preview did not respond on port\s+(\d+)\.?$/i, (m) => `端口 ${m[1]} 上的预览未响应。`],
  [/^Nothing is running on port\s+(\d+)$/i, (m) => `端口 ${m[1]} 上没有运行中的服务`],
  [/^Resume the conversation to start its workspace again, then start the server on port\s+(\d+)\s+and retry\.?$/i,
    (m) => `恢复对话以重新启动其工作区，然后在端口 ${m[1]} 上启动服务器并重试。`],
  [/^No server is listening on port\s+(\d+)\s+inside the remote workspace\. Start it, or ask the agent to, then retry\.?$/i,
    (m) => `远程工作区的端口 ${m[1]} 上没有正在监听的服务器。请手动启动或让智能体启动后重试。`],
  [/^Downloads,\s*(\d+)%\s+complete$/i, (m) => `下载中，已完成 ${m[1]}%`],
  [/^(.+?)\s+download progress$/i, (m) => `${m[1]} 下载进度`],
  [/^Show\s+(.+?)\s+in folder$/i, (m) => `在文件夹中显示 ${m[1]}`],
  [/^Remove\s+(.+?)\s+from list$/i, (m) => `从列表中移除 ${m[1]}`],
  [/^(.+?)\.\s*View site information$/i, (m) => `${m[1]}。查看站点信息`],
  [/^Delete cookies for\s+(.+)$/i, (m) => `删除 ${m[1]} 的 Cookie`],
  [/^Preview unavailable\s*[—–-]\s*(.+)$/i, (m, d) => `无法预览 — ${trTerm(m[1], d)}`],
  [/^App view for\s+(.+)$/i, (m) => `${m[1]} 的应用视图`],
  [/^Search Google for\s+"(.+)"$/i, (m) => `在 Google 上搜索“${m[1]}”`],
  [/^Environment paused\. Click to resume it and load the\s+(.+?)\.?$/i, (m, d) => `环境已暂停。点击恢复并加载${trTerm(m[1], d)}。`],

  // 7. 快捷键与录制
  [/^Recording shortcut for\s+(.+?)\.\s*Press keys to bind, Enter to save, Escape to cancel\.?$/i,
    (m, d) => `正在录制“${trTerm(m[1], d)}”的快捷键。请按下组合键进行绑定，按 Enter 保存，按 Escape 取消。`],
  [/^Shortcut\s+(.+?)\s+for\s+(.+)$/i, (m, d) => `${trTerm(m[2], d)} 的快捷键 ${m[1]}`],
  [/^Remove shortcut\s+(.+?)\s+for\s+(.+)$/i, (m, d) => `移除 ${trTerm(m[2], d)} 的快捷键 ${m[1]}`],
  [/^Add shortcut for\s+(.+)$/i, (m, d) => `为 ${trTerm(m[1], d)} 添加快捷键`],
  [/^Reset\s+(.+?)\s+to default$/i, (m, d) => `将 ${trTerm(m[1], d)} 重置为默认值`],
  [/^Reset\s+(.+?)\s+overrides?$/i, (m, d) => `重置 ${trTerm(m[1], d)} 覆盖项`],
  [/^Toggle Word Wrap(.*)$/i, (m) => `切换自动换行${m[1]}`],

  // 8. 语音与麦克风
  [/^Choose\s+(.+?)['’]s Voice$/i, (m) => `选择 ${m[1]} 的语音`],
  [/^(.+?),\s*voice\s+(\d+)\s+of\s+(\d+)$/i, (m) => `${m[1]}，第 ${m[2]} / ${m[3]} 种语音`],
  [/^(.+?)\.\s*Switch microphone\.?$/i, (m) => `${m[1]}。切换麦克风。`],
  [/^(.+?)\.\s*Switch mic$/i, (m) => `${m[1]}。切换麦克风`],
  [/^Retrying transcription\s*\(attempt\s*(\d+)\)(?:\.{3}|…)?$/i, (m) => `正在重试语音转录（第 ${m[1]} 次尝试）…`],
  [/^Relaunch\s+(.+?)\s+to finish Screen Recording\.?$/i, (m) => `重启 ${m[1]} 以完成屏幕录制权限配置。`],
  [/^This deletes\s+(.+?)\s+\((.+?)\s*MB\)\s+from your machine\. You can['’]t undo this\.?$/i,
    (m) => `这将从您的设备上删除 ${m[1]}（${m[2]} MB）。此操作无法撤销。`],
  [/^Failed to delete recordings:\s*(.+)$/i, (m) => `删除录制失败：${m[1]}`],

  // 9. 插件、技能、MCP 服务器与账号连接
  [/^Build with\s+(.+?)\s+Plugins$/i, (m) => `使用 ${m[1]} 插件构建`],
  [/^Open\s+(.+?)\s+skill$/i, (m) => `打开 ${m[1]} 技能`],
  [/^Open the\s+(.+?)\s+plugin$/i, (m) => `打开 ${m[1]} 插件`],
  [/^Plugins in\s+(.+)$/i, (m, d) => `${trTerm(m[1], d)} 中的插件`],
  [/^Add bundle\s+(.+)$/i, (m) => `添加插件包 ${m[1]}`],
  [/^Adding plugins from\s+(.+)$/i, (m) => `正在从 ${m[1]} 添加插件`],
  [/^This plugin in\s+(.+?)\s+may have looser code review\. Review its contents before adding the bundle\.?$/i,
    (m) => `${m[1]} 中的此插件可能经过较宽松的代码审查。请在添加插件包前仔细检查其内容。`],
  [/^These plugins in\s+(.+?)\s+may have looser code review\. Review its contents before adding the bundle\.?$/i,
    (m) => `${m[1]} 中的这些插件可能经过较宽松的代码审查。请在添加插件包前仔细检查其内容。`],
  [/^Review\s+(.+?)\s+before installing$/i, (m) => `安装前先检查 ${m[1]}`],
  [/^The\s+(.+?)\s+MCP server requires configuration parameters before it can be started\.?$/i,
    (m) => `${m[1]} MCP 服务器需要先配置参数才能启动。`],
  [/^Account this MCP server uses:\s*(.+)$/i, (m) => `此 MCP 服务器使用的账号：${m[1]}`],
  [/^No MCP servers found for\s+["“](.+?)["”]$/i, (m) => `未找到与“${m[1]}”匹配的 MCP 服务器`],
  [/^No connectors match\s+["“](.+?)["”]$/i, (m) => `没有与“${m[1]}”匹配的连接器`],
  [/^Filter skills and rules:\s*(.+)$/i, (m, d) => `筛选技能和规则：${trTerm(m[1], d)}`],
  [/^Connect an account for\s+(.+?)\s+so the agent can run automations\.?$/i,
    (m) => `为 ${m[1]} 连接账号，以便智能体运行自动化任务。`],
  [/^Make\s+(.+?)\s+the default\s+(.+?)\s+account$/i, (m) => `将 ${m[1]} 设为默认 ${m[2]} 账号`],
  [/^Secret for a new\s+(.+?)\s+account$/i, (m) => `新 ${m[1]} 账号的密钥`],
  [/^Secret for\s+(.+)$/i, (m) => `${m[1]} 的密钥`],
  [/^New secret for\s+(.+)$/i, (m) => `${m[1]} 的新密钥`],
  [/^Label for\s+(.+)$/i, (m) => `${m[1]} 的标签`],
  [/^Auth(?:orization)? code for\s+(.+)$/i, (m) => `${m[1]} 的授权码`],
  [/^Sign in to\s+(.+?)\s+remotely$/i, (m) => `远程登录 ${m[1]}`],
  [/^Sign in to use\s+(.+?)!?$/i, (m) => `登录以使用 ${m[1]}！`],
  [/^Sign in from the\s+(.+?)\s+panel\.?$/i, (m, d) => `请从 ${trTerm(m[1], d)} 面板登录。`],
  [/^Sign in to\s+(.+)$/i, (m) => `登录 ${m[1]}`],
  [/^On top of those defaults,\s*(.+?)\s+requests the access below\.?$/i,
    (m) => `除上述默认权限外，${m[1]} 还请求以下访问权限。`],
  [/^Agents created by this\s+(.+?)\s+run in a dedicated\s+(.+?)\s+with its own permissions\. You can change the permissions in the\s+(.+?)\s+settings page\.?$/i,
    (m, d) => `由此${trTerm(m[1], d)}创建的智能体将在拥有独立权限的专用${trTerm(m[2], d)}中运行。您可以在${trTerm(m[3], d)}设置页面中更改权限。`],
  [/^Inherits your Global Permissions when working\s+(.+?)\.?$/i,
    (m, d) => `在${trTerm(m[1], d)}工作时继承您的全局权限。`],
  [/^Configure\s+(.+?),\s*values missing$/i, (m) => `配置 ${m[1]}（缺少必填值）`],
  [/^Configure\s+(.+)$/i, (m) => `配置 ${m[1]}`],
  [/^More actions for\s+(.+)$/i, (m) => `${m[1]} 的更多操作`],
  [/^More options for\s+(.+)$/i, (m) => `${m[1]} 的更多选项`],
  [/^More for\s+(.+)$/i, (m) => `${m[1]} 的更多选项`],
  [/^Details for\s+(.+)$/i, (m) => `${m[1]} 详情`],
  [/^Reconnect\s+(.+)$/i, (m) => `重新连接 ${m[1]}`],
  [/^Disconnect\s+(.+)$/i, (m) => `断开 ${m[1]}`],
  [/^Connect\s+(.+)$/i, (m) => `连接 ${m[1]}`],
  [/^Install\s+(.+)$/i, (m) => `安装 ${m[1]}`],
  [/^Install folder\s+"(.+?)"\s+is already in use$/i, (m) => `安装文件夹“${m[1]}”已被占用`],
  [/^Couldn['’]t disconnect\s+(.+?):\s*(.+)$/i, (m) => `无法断开 ${m[1]}：${m[2]}`],

  // 10. 项目、工作区、文件夹与远程 SSH
  [/^You['’]re signing in on\s+(.+?)\.\s*Your sign-in stays on that machine\.?$/i,
    (m) => `您正在 ${m[1]} 上登录。您的登录状态将保留在该设备上。`],
  [/^Connected to\s+(.+)$/i, (m) => `已连接到 ${m[1]}`],
  [/^Couldn['’]t connect to\s+(.+)$/i, (m) => `无法连接到 ${m[1]}`],
  [/^This window['’]s agents, files, and terminals are on\s+(.+?)\.?$/i,
    (m) => `此窗口的智能体、文件和终端均位于 ${m[1]}。`],
  [/^Remove\s+(.+?)\s+from Recent$/i, (m) => `从最近列表中移除 ${m[1]}`],
  [/^(.+?)\s*·\s*This computer$/i, (m) => `${m[1]} · 本机`],
  [/^Cannot add folder:\s*"(.+?)"\s+is not a valid folder location\.?$/i,
    (m) => `无法添加文件夹：“${m[1]}”不是有效的文件夹位置。`],
  [/^Failed to resolve folder:\s*(.+?)\s*\((.+?)\)$/i, (m) => `解析文件夹失败：${m[1]}（${m[2]}）`],
  [/^A file already exists at\s+(.+?)\.?$/i, (m) => `${m[1]} 处已存在同名文件。`],
  [/^Can['’]t create this path\s*[—–-]\s*["“](.+?)["”]\s+is a file, not a folder\.?$/i,
    (m) => `无法创建此路径——“${m[1]}”是文件而非文件夹。`],
  [/^The folder\s+["“](.+?)["”]\s+does not exist\. Would you like to create it\?$/i,
    (m) => `文件夹“${m[1]}”不存在。是否创建？`],
  [/^["“](.+?)["”]\s+isn['’]t a valid folder name\.?$/i, (m) => `“${m[1]}”不是有效的文件夹名称。`],
  [/^Duplicate\s+(.+?)\s+name$/i, (m, d) => `${trTerm(m[1], d)}名称重复`],
  [/^Using default\s+(.+?)\s+name$/i, (m, d) => `使用默认${trTerm(m[1], d)}名称`],
  [/^Edit\s+(.+?)\s+name$/i, (m, d) => `编辑${trTerm(m[1], d)}名称`],
  [/^Enter\s+(.+?)\s+name(?:\.{3}|…)?$/i, (m, d) => `输入${trTerm(m[1], d)}名称…`],
  [/^Opens the New Conversation screen for this\s+(.+)$/i, (m, d) => `为此${trTerm(m[1], d)}打开新建对话界面`],
  [/^(.+?)\.\s*Starting in local workspace\.?$/i, (m, d) => `${trTerm(m[1], d)}。正在本地工作区中启动。`],

  // 11. 模型对比 / Best of N / 分支 / 编辑器 / 面板
  [/^Compare responses from\s+(\d+)\s+models? side-by-side to find the best result\.?$/i,
    (m) => `并排对比 ${m[1]} 个模型的回复，以找出最佳结果。`],
  [/^Give each Best of N fork a full clone of your workspace, including its local commit history\. Choosing a winner then gives your workspace that fork['’]s state, so the commits it made are kept\. Forks take longer to create than the default CitC clone\.(.*)$/i,
    (m) => `为每个 Best of N 分叉提供工作区的完整克隆（包含本地提交历史）。选定胜出方案后，工作区将保留该分叉的状态和提交记录。创建分叉所需时间比默认的 CitC 克隆更长。${m[1]}`],
  [/^Give each Best of N fork its own clone of your Git repository instead of a copy-on-write overlay\. Each fork is then a real repository, so commits it makes are kept when you choose it as the winner\. Forks take longer to create, and the wait grows with the size of your repository\.(.*)$/i,
    (m) => `为每个 Best of N 分叉创建独立的 Git 仓库克隆，而不是写时复制覆盖层。每个分叉都是真实的仓库，选定胜出方案后会保留其提交记录。创建分叉耗时更长，且随仓库体积增大而增加。${m[1]}`],
  [/^Forked from\s+(.+)$/i, (m) => `分叉自 ${m[1]}`],
  [/^Detached at\s+(.+)$/i, (m) => `分离头指针于 ${m[1]}`],
  [/^Branch,\s*current:\s*(.+)$/i, (m) => `分支，当前：${m[1]}`],
  [/^Select model,\s*current:\s*(.+)$/i, (m) => `选择模型，当前：${m[1]}`],
  [/^Select project,\s*current:\s*(.+)$/i, (m) => `选择项目，当前：${m[1]}`],
  [/^Select model with\s+(.+)$/i, (m) => `选择带有 ${m[1]} 的模型`],
  [/^Select\s+(Light|Dark|System)\s+Theme$/i, (m, d) => `选择${trTerm(m[1], d)}主题`],
  [/^Move to Group:\s*(.+)$/i, (m) => `移动到分组：${m[1]}`],
  [/^Remove context from\s+(.+)$/i, (m) => `从 ${m[1]} 移除上下文`],
  [/^View Diff for\s+(.+)$/i, (m) => `查看 ${m[1]} 的差异`],
  [/^Open Subagent:\s*(.+)$/i, (m) => `打开子智能体：${m[1]}`],
  [/^Fix with Agent:\s*(.+)$/i, (m) => `使用智能体修复：${m[1]}`],
  [/^Edit comment:\s*(.+)$/i, (m) => `编辑评论：${m[1]}`],
  [/^Delete side question:\s*(.+)$/i, (m) => `删除侧边提问：${m[1]}`],
  [/^Edit side question title:\s*(.+)$/i, (m) => `编辑侧边提问标题：${m[1]}`],
  [/^Send now:\s*(.+)$/i, (m) => `立即发送：${m[1]}`],
  [/^Message from\s+(.+)$/i, (m) => `来自 ${m[1]} 的消息`],
  [/^(.+?)\s+terminal:$/i, (m, d) => `${trTerm(m[1], d)}终端：`],
  [/^(.+?),\s*showing\s+(\d+)\s+of\s+(\d+)$/i, (m, d) => `${trTerm(m[1], d)}，当前显示 ${m[2]} / ${m[3]}`],
  [/^Learn more about\s+(.+)$/i, (m, d) => `了解更多关于 ${trTerm(m[1], d)} 的信息`],
  [/^Manage\s+(.+?)\s+app settings\.?$/i, (m) => `管理 ${m[1]} 应用设置。`],
  [/^Welcome to\s+(.+?)!?$/i, (m) => `欢迎使用 ${m[1]}！`],
  [/^Help us improve\s+(.+?)\.?$/i, (m) => `帮助我们改进 ${m[1]}。`],

  // 12. 自动化与操作状态反馈（成功/失败/运行中）
  [/^Created automation\s+"(.+?)"\.?$/i, (m) => `已创建自动化任务“${m[1]}”。`],
  [/^Triggered\s+(.+)$/i, (m) => `已触发 ${m[1]}`],
  [/^Run\s+(.+?)\s+now$/i, (m) => `立即运行 ${m[1]}`],
  [/^Enabled\s+"(.+?)"\.?$/i, (m) => `已启用“${m[1]}”。`],
  [/^Started\s+"(.+?)"\.?$/i, (m) => `已启动“${m[1]}”。`],
  [/^Restarted\s+"(.+?)"\.?$/i, (m) => `已重启“${m[1]}”。`],
  [/^Deleted\s+"(.+?)"\.?$/i, (m) => `已删除“${m[1]}”。`],
  [/^Failed to start\s+"(.+?)"\.?$/i, (m) => `启动“${m[1]}”失败。`],
  [/^Failed to update\s+"(.+?)"\.?$/i, (m) => `更新“${m[1]}”失败。`],
  [/^Failed to delete\s+"(.+?)"\.?$/i, (m) => `删除“${m[1]}”失败。`],
  [/^Failed to save\s+"(.+?)"\.?$/i, (m) => `保存“${m[1]}”失败。`],
  [/^Failed to save project settings:\s*(.+)$/i, (m) => `保存项目设置失败：${m[1]}`],
  [/^Failed to save project permissions:\s*(.+)$/i, (m) => `保存项目权限失败：${m[1]}`],
  [/^Failed to save project Google3 configuration:\s*(.+)$/i, (m) => `保存项目 Google3 配置失败：${m[1]}`],
  [/^Failed to save cloud permission settings:\s*(.+)$/i, (m) => `保存云端权限设置失败：${m[1]}`],
  [/^Failed to save settings:\s*(.+)$/i, (m) => `保存设置失败：${m[1]}`],
  [/^Failed to save project:\s*(.+)$/i, (m) => `保存项目失败：${m[1]}`],
  [/^Failed to create project:\s*(.+)$/i, (m) => `创建项目失败：${m[1]}`],
  [/^Failed to unarchive project:\s*(.+)$/i, (m) => `取消归档项目失败：${m[1]}`],
  [/^Failed to select workspace:\s*(.+)$/i, (m) => `选择工作区失败：${m[1]}`],
  [/^Failed to load page\s+(\d+):\s*(.+)$/i, (m) => `加载第 ${m[1]} 页失败：${m[2]}`],
  [/^Failed to delete\s+(.+?):\s*(.+)$/i, (m, d) => `删除 ${trTerm(m[1], d)} 失败：${m[2]}`],
  [/^Failed to archive\s+(.+)$/i, (m, d) => `归档 ${trTerm(m[1], d)} 失败`],
  [/^Failed to delete\s+(.+)$/i, (m, d) => `删除 ${trTerm(m[1], d)} 失败`],
  [/^Failed to create\s+(.+)$/i, (m, d) => `创建 ${trTerm(m[1], d)} 失败`],
  [/^Failed to load\s+(.+)$/i, (m, d) => `加载 ${trTerm(m[1], d)} 失败`],
  [/^Failed to\s+(archive|unarchive|delete|rename|pin|unpin|duplicate|export|open|load)\s+conversation$/i,
    (m, d) => `${trTerm(m[1], d)}对话失败`],
  [/^Couldn['’]t\s+(archive|unarchive|delete|rename|pin|unpin|duplicate|export|open|load)\s+conversation$/i,
    (m, d) => `无法${trTerm(m[1], d)}对话`],
  [/^Error while\s+(.+)$/i, (m) => `执行 ${m[1]} 时出错`],
  [/^(.+?)\s+archived$/i, (m, d) => `${trTerm(m[1], d)}已归档`],
  [/^(.+?)\s+deleted$/i, (m, d) => `${trTerm(m[1], d)}已删除`],
  [/^(.+?)\s+\(disabled by admin\)$/i, (m, d) => `${trTerm(m[1], d)}（管理员已禁用）`],
  [/^(.+?),\s*setup required$/i, (m) => `${m[1]}，需要配置`],
  [/^(.+?),\s*error$/i, (m) => `${m[1]}，出错`],

  // 13. PDF / 文档标注与翻页
  [/^Comment on page\s+(\d+)$/i, (m) => `在第 ${m[1]} 页添加评论`],
  [/^Search match on page\s+(\d+)$/i, (m) => `第 ${m[1]} 页的搜索匹配项`],
  [/^(.+?)\s+annotation on page\s+(\d+)$/i, (m) => `第 ${m[2]} 页的 ${m[1]} 标注`],
  [/^Bounding box on page\s+(\d+)$/i, (m) => `第 ${m[1]} 页的边界框`],
  [/^Scroll to:\s*(.+?)\s+on page\s+(\d+)$/i, (m) => `滚动到第 ${m[2]} 页的 ${m[1]}`],
  [/^Page\s+(\d+)\s+failed to load$/i, (m) => `第 ${m[1]} 页加载失败`],
  [/^Go to page\s+(\d+)$/i, (m) => `跳转到第 ${m[1]} 页`],

  [/^(.+?)\.\s*Show in\s+(.+)$/i, (m, d) => `${m[1]}。在 ${trTerm(m[2], d)} 中显示`],
  [/^Failed to submit feedback to Listnr:\s*(.+)$/i, (m) => `向 Listnr 提交反馈失败：${m[1]}`],
  [/^(Enable|Disable)\s+(.+?)\s+tool for\s+(.+)$/i, (m, d) => `${trTerm(m[1], d)} ${m[3]} 的 ${m[2]} 工具`],
  [/^(.+?)\.\s*(.+?)\s+plan$/i, (m, d) => `${m[1]}。${trTerm(m[2], d)}订阅方案`],
  [/^You['’]ve reached your\s+(.+?)\s+limit\.?$/i, (m, d) => `您已达到${trTerm(m[1], d)}限额。`],
  [/^(\d+)\s+(?:minutes?|mins?)\s+ago$/i, (m) => `${m[1]} 分钟前`],
  [/^(\d+)\s+(?:hours?|hrs?)\s+ago$/i, (m) => `${m[1]} 小时前`],
  [/^(\d+)\s+days?\s+ago$/i, (m) => `${m[1]} 天前`],
  [/^(\d+)\s+(?:seconds?|secs?)\s+ago$/i, (m) => `${m[1]} 秒前`],
  [/^(\d+)\s+weeks?\s+ago$/i, (m) => `${m[1]} 周前`],
  [/^(\d+)\s+months?\s+ago$/i, (m) => `${m[1]} 个月前`],

  // 14. 通用安全动词短语（仅在特定可预测上下文触发）
  [/^Loading\s+(.+?)(?:\.{3}|…)$/i, (m, d) => `正在加载 ${trTerm(m[1], d)}…`],
  [/^No matching\s+(.+)$/i, (m, d) => `无匹配的${trTerm(m[1], d)}`],
  [/^No remote\s+(.+)$/i, (m, d) => `暂无远程${trTerm(m[1], d)}`],
  [/^No\s+(.+?)\s+found for$/i, (m, d) => `未找到相关${trTerm(m[1], d)}：`],
  [/^No\s+(projects?|conversations?|artifacts?|files?|models?|subagents?|results?|plugins?|skills?|rules?|hooks?|automations?|workflows?|workspaces?|tools?|servers?|terminals?|tasks?|branches?|accounts?|coordinators?|comments?|matches?)\s+found\.?$/i,
    (m, d) => `暂无${trTerm(m[1], d)}`],
  [/^All\s+(projects?|conversations?|artifacts?|files?|models?|subagents?|results?|plugins?|skills?|rules?|hooks?|automations?|workflows?|workspaces?|tools?|servers?|terminals?|tasks?|branches?|accounts?|notifications?)$/i,
    (m, d) => `全部${trTerm(m[1], d)}`],
  [/^Toggle\s+(.+)$/i, (m, d) => `切换 ${trTerm(m[1], d)}`],
  [/^Enable\s+(.+)$/i, (m, d) => `启用 ${trTerm(m[1], d)}`],
  [/^Pause\s+(.+)$/i, (m, d) => `暂停 ${trTerm(m[1], d)}`],
  [/^Resume\s+(.+)$/i, (m, d) => `继续 ${trTerm(m[1], d)}`],
  [/^Restart\s+(.+)$/i, (m, d) => `重启 ${trTerm(m[1], d)}`],
  [/^Stop\s+(.+?)\?$/i, (m, d) => `停止 ${trTerm(m[1], d)}？`],
  [/^Stop\s+(.+)$/i, (m, d) => `停止 ${trTerm(m[1], d)}`],
  [/^Cancel\s+(.+)$/i, (m, d) => `取消 ${trTerm(m[1], d)}`],
  [/^Delete\s+(.+)$/i, (m, d) => `删除 ${trTerm(m[1], d)}`],
  [/^Remove\s+(.+)$/i, (m, d) => `移除 ${trTerm(m[1], d)}`],
  [/^Close\s+(.+)$/i, (m, d) => `关闭 ${trTerm(m[1], d)}`],
  [/^Unpin\s+(.+)$/i, (m, d) => `取消置顶 ${trTerm(m[1], d)}`],
  [/^Add\s+(.+)$/i, (m, d) => `添加 ${trTerm(m[1], d)}`],
  [/^Open\s+(.+?),\s*(.+?)\.\s*Summarizing call$/i, (m) => `打开 ${m[1]}，${m[2]}。正在总结调用`],
  [/^Open\s+(.+)$/i, (m, d) => `打开 ${trTerm(m[1], d)}`],
  [/^View\s+(.+)$/i, (m, d) => `查看 ${trTerm(m[1], d)}`],
  [/^Using\s+(.+)$/i, (m, d) => `正在使用 ${trTerm(m[1], d)}`],
  [/^(.+?)\s+tab$/i, (m, d) => `${trTerm(m[1], d)}标签页`],
  [/^(.+?)\s+setting$/i, (m, d) => `${trTerm(m[1], d)}设置`],
  [/^(.+?)\s+Name$/i, (m, d) => `${trTerm(m[1], d)}名称`],
  [/^(.+?)\s+failed$/i, (m, d) => `${trTerm(m[1], d)}失败`],
  [/^See\s+(.+?):\s*(.+)$/i, (m, d) => `查看${trTerm(m[1], d)}：${m[2]}`],
];



  const HAS_LATIN = /[A-Za-z]{2}/;
  const UI_CONTROL_SELECTOR = 'button, [role="button"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="tab"], [role="option"], [role="switch"], [role="tooltip"], [role="dialog"] header, nav, label, th, summary, [data-tooltip-id]';
  const HARD_SKIP_SELECTOR = 'pre, code, kbd, samp, var, textarea, input, [contenteditable="true"], [contenteditable=""], .monaco-editor, .xterm, script, style, svg, [data-no-translate]';
  const USER_MSG_SELECTOR = '[data-testid="user-message"], .agy-user-bubble-frame';

  function isUiControlContext(node) {
    const el = node && node.nodeType === 1 ? node : node && node.parentElement;
    if (!el || !el.closest) return false;
    return !!el.closest(UI_CONTROL_SELECTOR);
  }

  function shouldSkipTextNode(textNode) {
    const parent = textNode.parentElement;
    if (!parent || !parent.closest) return false;
    // 1. 绝对保护区：代码、终端、编辑器、输入框
    if (parent.closest(HARD_SKIP_SELECTOR)) return true;
    // 2. 用户消息气泡内的文本保持原样（气泡外的操作按钮照常翻译）
    if (parent.closest(USER_MSG_SELECTOR) && !parent.closest('button, [role="button"], [role="tooltip"]')) {
      return true;
    }
    // 3. AI 回复的 Markdown 正文区保护（内部代码块工具栏按钮仍允许翻译）
    if (parent.closest('[data-markdown-root]') && !parent.closest('button, [role="button"], [role="tooltip"], [role="menu"], [role="menuitem"], [role="tab"]')) {
      return true;
    }
    return false;
  }

  function preserveWrap(original, trimmed, translated) {
    if (translated === trimmed) return original;
    const idx = original.indexOf(trimmed);
    if (idx === -1) return translated;
    return original.slice(0, idx) + translated + original.slice(idx + trimmed.length);
  }

  function translateText(text, options) {
    if (!text || typeof text !== 'string') return text;
    if (!HAS_LATIN.test(text)) return text;

    const trimmed = text.trim();
    if (!trimmed) return text;
    const isAttrOrControl = !!(options && options.isControl);

    // 1. 精确词典匹配（O(1)）
    if (Object.prototype.hasOwnProperty.call(dictionary, trimmed)) {
      return preserveWrap(text, trimmed, dictionary[trimmed]);
    }

    // 2. 标点与空白归一化词典匹配（兼容 ’ / … / 多空格）
    const norm = normalizeKey(trimmed);
    if (Object.prototype.hasOwnProperty.call(normalizedDict, norm)) {
      return preserveWrap(text, trimmed, normalizedDict[norm]);
    }

    // 兼容末尾冒号/省略号微差（仅短语 <= 80 字符）
    if (norm.length <= 80) {
      if (norm.endsWith(':')) {
        const base = norm.slice(0, -1).trim();
        if (Object.prototype.hasOwnProperty.call(normalizedDict, base)) {
          return preserveWrap(text, trimmed, normalizedDict[base] + '：');
        }
      } else if (norm.endsWith('...')) {
        const base = norm.slice(0, -3).trim();
        if (Object.prototype.hasOwnProperty.call(normalizedDict, base)) {
          return preserveWrap(text, trimmed, normalizedDict[base] + '…');
        }
      }
    }

    // 超长文本（> 600 字符）通常是日志/正文，直接跳过正则以保性能
    if (trimmed.length > 600) return text;

    // 3. 保留原有特殊多段规则
    if (trimmed.indexOf('of the customization budget is available') !== -1) {
      let replaced = text
        .replace(/(\d+(?:\.\d+)?)%\s*of the customization budget is available\.?/g, '自定义项预算可用额度为 $1%。')
        .replace(/%\s*of the customization budget is available\.?/g, '% 的自定义项预算可用额度。')
        .replace(/(^\s*)of the customization budget is available\.?/g, '$1的自定义项预算可用额度。');
      if (replaced !== text) return replaced;
    }

    if (/^Exploring\b/i.test(trimmed) || /running command/i.test(trimmed)) {
      const translatedActions = trimmed
        .replace(/Exploring files?/gi, '浏览文件')
        .replace(/running commands?/gi, '运行命令')
        .replace(/editing files?/gi, '编辑文件')
        .replace(/searching files?/gi, '搜索文件')
        .replace(/reading files?/gi, '读取文件')
        .replace(/,\s*/g, '、');
      if (translatedActions !== trimmed) return preserveWrap(text, trimmed, translatedActions);
    }

    if (trimmed.indexOf('Working') !== -1 && /^Working\.{0,3}$|^Working…$/.test(trimmed)) {
      return preserveWrap(text, trimmed, trimmed.replace(/^Working/, '运行中'));
    }

    if (trimmed.indexOf('Google Developer Knowledge') !== -1 || trimmed.indexOf('official developer documentation and retrieve') !== -1) {
      return 'Google Developer Knowledge MCP 服务器使 AI 驱动的开发工具能够搜索 Google 的官方开发者文档并检索相关内容…';
    }
    if (trimmed.indexOf('Ask questions. Get answers') !== -1) {
      if (trimmed.indexOf('PostHog') !== -1) {
        return '提出问题，获取答案。该 MCP 是您的编程智能体与之对话的服务器。用自然语言提问，它会针对您的 PostHog 数据运行查询并返回结果。';
      }
      return '提出问题，获取答案。该 MCP 是您的 ';
    }
    if (trimmed.indexOf('talks to. Ask a question in English') !== -1 || trimmed.indexOf('runs the query against your') !== -1) {
      return ' 与之对话的服务器。用自然语言提问，它会针对您的 ';
    }
    if (trimmed.indexOf('The answer lands') !== -1 || trimmed.indexOf('data. The answer') !== -1) {
      return ' 数据运行查询并返回结果。';
    }
    if (trimmed.indexOf('Configure the browser subagent') !== -1) {
      return text.replace(/Configure the browser subagent\.?/g, '配置浏览器子智能体。');
    }
    if (trimmed.indexOf('The browser subagent can be invoked by typing') !== -1) {
      return text.replace(/The browser subagent can be invoked by typing \/browser in the conversation input box\.?/g, '您可以在对话输入框中输入 /browser 来调用浏览器子智能体。');
    }
    if (trimmed.indexOf("You currently don't have any MCP Servers installed.") !== -1) {
      return text.replace(/You currently don't have any MCP Servers installed\./g, '您目前尚未安装任何 MCP 服务器。');
    }
    if (trimmed.indexOf('Add an MCP server above') !== -1) {
      return text.replace(/Add an MCP server above or add a custom one via the MCP Config\./g, '请在上方添加 MCP 服务器，或通过 MCP 配置添加自定义服务器。');
    }

    // 4. 动态正则模板匹配（区分专有句型与通用动词短语，防止误伤长句）
    // 索引 >= 135 的规则为通用短动词前缀（如 Open X / Delete X / Close X），仅对短标签生效
    const GENERIC_VERB_START_RE = /^(?:Toggle|Enable|Pause|Resume|Restart|Stop|Cancel|Delete|Remove|Close|Unpin|Add|Open|View|Using)\s+/i;
    for (let i = 0; i < dynamicRules.length; i++) {
      const rule = dynamicRules[i];
      const m = norm.match(rule[0]);
      if (m) {
        if (GENERIC_VERB_START_RE.test(norm) && !isAttrOrControl && (norm.length > 48 || /[.!?\n]/.test(norm))) {
          continue;
        }
        const out = rule[1](m, normalizedDict);
        if (out && out !== norm) {
          return preserveWrap(text, trimmed, out);
        }
      }
    }

    // 5. 插件与 MCP 长描述前缀匹配
    for (let i = 0; i < textPrefixRules.length; i++) {
      if (text.indexOf(textPrefixRules[i][0]) !== -1) {
        return textPrefixRules[i][1];
      }
    }

    // 6. 单词核心词兜底（仅对纯 UI 控件/属性上的 1 词生效，绝不误伤正文或文件名）
    if (isAttrOrControl && trimmed.length <= 24 && !/[\s./\\:]/.test(trimmed)) {
      const lowerText = trimmed.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(coreWords, lowerText)) {
        return preserveWrap(text, trimmed, coreWords[lowerText]);
      }
    }

    return text;
  }

  function translateElementAttrs(el) {
    if (!el || el.nodeType !== 1) return;
    if (el.placeholder) {
      const t = translateText(el.placeholder, { isControl: true });
      if (t !== el.placeholder) el.placeholder = t;
    }
    if (el.title) {
      const t = translateText(el.title, { isControl: true });
      if (t !== el.title) el.title = t;
    }
    if (el.getAttribute) {
      const aria = el.getAttribute('aria-label');
      if (aria) {
        const t = translateText(aria, { isControl: true });
        if (t !== aria) el.setAttribute('aria-label', t);
      }
    }
  }

  function processNode(node) {
    if (!node) return;
    if (node.nodeType === 3) { // Node.TEXT_NODE
      if (!node.textContent || !HAS_LATIN.test(node.textContent)) return;
      if (shouldSkipTextNode(node)) return;
      const isControl = isUiControlContext(node);
      const translated = translateText(node.textContent, { isControl });
      if (translated !== node.textContent) {
        node.textContent = translated;
      }
      return;
    }
    if (node.nodeType === 1) { // Node.ELEMENT_NODE
      const tag = node.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'SVG' || tag === 'NOSCRIPT') return;
      // 始终先翻译控件属性（含 input/textarea 的 placeholder / aria-label / title）
      translateElementAttrs(node);
      // 硬跳过区域不遍历其子节点文本
      if (tag === 'CODE' || tag === 'PRE' || tag === 'TEXTAREA' || tag === 'INPUT') return;
      if (node.classList && (node.classList.contains('monaco-editor') || node.classList.contains('xterm'))) return;
      if (node.getAttribute && (node.getAttribute('contenteditable') === 'true' || node.getAttribute('contenteditable') === '')) return;

      const children = node.childNodes;
      for (let i = 0; i < children.length; i++) {
        processNode(children[i]);
      }
    }
  }

  const observer = new MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      const mutation = mutations[i];
      if (mutation.type === 'childList') {
        const added = mutation.addedNodes;
        for (let j = 0; j < added.length; j++) {
          processNode(added[j]);
        }
      } else if (mutation.type === 'characterData') {
        processNode(mutation.target);
      } else if (mutation.type === 'attributes') {
        translateElementAttrs(mutation.target);
      }
    }
  });

  function startLocalization() {
    if (!document.body) return;
    processNode(document.body);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['title', 'placeholder', 'aria-label']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLocalization, { once: true });
  } else {
    startLocalization();
  }
})();
// === ANTIGRAVITY_ZH_CN_END ===
