// Antigravity 简体中文汉化包自动化验证脚本
// 运行方式: node tests/verify.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const PAYLOAD = path.join(ROOT, 'payload');

console.log('==> [1/5] 校验 payload JSON 数据文件...');
const meta = JSON.parse(fs.readFileSync(path.join(PAYLOAD, 'meta.json'), 'utf8'));
const dictRaw = fs.readFileSync(path.join(PAYLOAD, 'dict.json'), 'utf8').trim();
const coreRaw = fs.readFileSync(path.join(PAYLOAD, 'core_words.json'), 'utf8').trim();
const prefixRaw = fs.readFileSync(path.join(PAYLOAD, 'prefix_rules.json'), 'utf8').trim();

const dictObj = JSON.parse(dictRaw);
const coreObj = JSON.parse(coreRaw);
const prefixArr = JSON.parse(prefixRaw);

assert.ok(Object.keys(dictObj).length >= 3000, '词典条数异常');
for (const [k, v] of Object.entries(dictObj)) {
  assert.strictEqual(typeof v, 'string', `词条 "${k}" 译文不是字符串`);
  assert.ok(v.trim().length > 0, `词条 "${k}" 译文为空`);
}
console.log(`    PASS: dict=${Object.keys(dictObj).length}, coreWords=${Object.keys(coreObj).length}, prefixRules=${prefixArr.length}, meta=v${meta.version}`);

console.log('==> [2/5] 组装并校验 preload_template.js 与 menu_template.js 语法...');
const preloadTpl = fs.readFileSync(path.join(PAYLOAD, 'preload_template.js'), 'utf8');
const menuTpl = fs.readFileSync(path.join(PAYLOAD, 'menu_template.js'), 'utf8');

assert.ok(preloadTpl.includes('__ZH_DICT__') && preloadTpl.includes('__ZH_CORE_WORDS__') && preloadTpl.includes('__ZH_PREFIX_RULES__'));
const assembledPreload = preloadTpl
  .replace('__ZH_DICT__', dictRaw)
  .replace('__ZH_CORE_WORDS__', coreRaw)
  .replace('__ZH_PREFIX_RULES__', prefixRaw);

// 语法检查（通过 vm.Script 编译校验）
new vm.Script(assembledPreload, { filename: 'preload_assembled.js' });
new vm.Script(menuTpl, { filename: 'menu_assembled.js' });
console.log(`    PASS: 语法校验通过 (preload=${(assembledPreload.length / 1024).toFixed(1)} KB, menu=${(menuTpl.length / 1024).toFixed(1)} KB)`);

// 在沙箱加载渲染层引擎进行功能与防误伤测试
console.log('==> [3/5] 校验动态模板规则与标点归一化...');
const testableEngine = assembledPreload.replace(
  /if \(document\.readyState === 'loading'\)[\s\S]*?\}\)\(\);/,
  'globalThis.__api = { translateText, processNode, translateElementAttrs, dynamicRules }; })();'
);
const sandbox = {
  MutationObserver: class { observe() {} },
  Node: { TEXT_NODE: 3, ELEMENT_NODE: 1 },
  document: { readyState: 'loading', addEventListener() {}, body: null }
};
sandbox.globalThis = sandbox;
vm.runInNewContext(testableEngine, sandbox);
const { translateText, processNode, dynamicRules } = sandbox.__api;

const dynCases = [
  ['Models & Usage', '模型与用量'],
  ['Toggle Side Panel', '切换侧面板'],
  ['Creating...', '正在创建…'],
  ['Plan, 2 of 5 steps done', '计划，已完成 2 / 5 步'],
  ['Show 3 earlier steps', '显示前 3 个步骤'],
  ['Show 2 more subagents', '再显示 2 个子智能体'],
  ['Waiting for command completion (up to 15 seconds)', '正在等待命令完成（最多 15 秒）'],
  ['12 lines added, 4 lines removed', '新增 12 行，删除 4 行'],
  ['Question 1 of 3', '第 1 / 3 个问题'],
  ['Step 2 of 4', '第 2 / 4 步'],
  ['Turn 3 of 10', '第 3 / 10 轮'],
  ['Unfold lines 10-25', '展开第 10-25 行'],
  ['Downloads, 50% complete', '下载中，已完成 50%'],
  ['Zoom 125%, reset to fit', '缩放 125%，点击重置以适应'],
  ['Your Plan: Ultra', '您的订阅方案：Ultra'],
  ['Available AI Credits: 2,500', '可用 AI 积分：2,500'],
  ['The folder “demo” does not exist. Would you like to create it?', '文件夹“demo”不存在。是否创建？'],
  ['No MCP servers found for "github"', '未找到与“github”匹配的 MCP 服务器'],
  ['Worked for 1m 23s', '运行耗时 1 分 23 秒'],
  ['5 minutes ago', '5 分钟前'],
  ['Orchestrator model selection', '编排器模型选择'],
  ['Available dictation languages', '可用语音听写语言'],
  ['Browser actuation rules', '浏览器操作规则'],
  ['System default (English)', '系统默认（English）'],
  ['Version 2.35.2', '版本 2.35.2'],
  ['Revoke all: GitHub', '全部撤销：GitHub'],
  ["Failed to archive conversation", '归档对话失败'],
  ['Fork in New Git Worktree', '在新建 Git 工作树中分叉'],
  ['Administrator access (UAC)', '管理员访问权限（UAC）'],
  ['Search settings', '搜索设置'],
  ['3 of 7 steps done', '已完成 3 / 7 步'],
  ['2 tasks running', '2 个任务正在运行'],
  ['Reply in thread to coordinator', '在话题中回复 coordinator']
];
for (const [inp, exp] of dynCases) {
  assert.strictEqual(translateText(inp, { isControl: false }), exp, `翻译断言失败: "${inp}"`);
}
console.log(`    PASS: ${dynCases.length} 项核心词条与动态模板断言通过 (共加载 ${dynamicRules.length} 条动态规则)`);

console.log('==> [4/5] 校验 DOM 防误伤保护（Markdown 正文 / 用户消息 / 代码块 / 编辑器）...');
class MockNode {
  constructor(nodeType, tagName, attrs = {}) {
    this.nodeType = nodeType;
    this.tagName = tagName;
    this.attrs = { ...attrs };
    this.parentElement = null;
    this.childNodes = [];
    this.textContent = '';
    this.placeholder = attrs.placeholder || '';
    this.title = attrs.title || '';
    this.classList = {
      _s: new Set((attrs.className || '').split(/\s+/).filter(Boolean)),
      contains(c) { return this._s.has(c); }
    };
  }
  getAttribute(k) { return this.attrs[k] ?? null; }
  setAttribute(k, v) { this.attrs[k] = v; }
  appendChild(c) { c.parentElement = this; this.childNodes.push(c); return c; }
  matches(sel) {
    return sel.split(',').map(s => s.trim()).some(part => {
      if (part.includes(' ')) {
        const segs = part.split(/\s+/);
        if (!this.matches(segs[segs.length - 1])) return false;
        let cur = this.parentElement;
        while (cur) { if (cur.matches(segs[0])) return true; cur = cur.parentElement; }
        return false;
      }
      if (part.startsWith('.')) return this.classList.contains(part.slice(1));
      if (part.startsWith('[')) {
        const m = part.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);
        if (!m) return false;
        const val = this.getAttribute(m[1]);
        return m[2] === undefined ? val !== null : val === m[2];
      }
      return this.tagName && this.tagName.toLowerCase() === part.toLowerCase();
    });
  }
  closest(sel) {
    let cur = this;
    while (cur) { if (cur.nodeType === 1 && cur.matches(sel)) return cur; cur = cur.parentElement; }
    return null;
  }
}
const textNode = s => { const n = new MockNode(3, null); n.textContent = s; return n; };

const dom = new MockNode(1, 'DIV');
const md = dom.appendChild(new MockNode(1, 'DIV', { 'data-markdown-root': '' }));
const mdProse = md.appendChild(new MockNode(1, 'P')).appendChild(textNode('Settings'));
const mdBtn = md.appendChild(new MockNode(1, 'BUTTON')).appendChild(textNode('Insert in Terminal'));
const userMsg = dom.appendChild(new MockNode(1, 'DIV', { 'data-testid': 'user-message' })).appendChild(textNode('Delete'));
const codeEl = dom.appendChild(new MockNode(1, 'PRE')).appendChild(new MockNode(1, 'CODE')).appendChild(textNode('Open Folder'));
const inputEl = dom.appendChild(new MockNode(1, 'INPUT', { placeholder: 'Search projects...', 'aria-label': 'Search Conversations' }));
const longProse = dom.appendChild(new MockNode(1, 'P')).appendChild(textNode('Using React hooks inside a custom component allows clean state reuse.'));

processNode(dom);
assert.strictEqual(mdProse.textContent, 'Settings');
assert.strictEqual(mdBtn.textContent, '插入到终端');
assert.strictEqual(userMsg.textContent, 'Delete');
assert.strictEqual(codeEl.textContent, 'Open Folder');
assert.strictEqual(inputEl.placeholder, '搜索项目...');
assert.strictEqual(inputEl.getAttribute('aria-label'), '搜索对话');
assert.strictEqual(longProse.textContent, 'Using React hooks inside a custom component allows clean state reuse.');
console.log('    PASS: 所有防误伤与控件属性翻译断言通过');

console.log('==> [5/5] 校验原生菜单与系统弹窗 Hook...');
const cap = {};
const fakeElectron = {
  Menu: {
    buildFromTemplate(tpl) { cap.tpl = tpl; return { items: tpl }; },
    setApplicationMenu(m) { cap.appMenu = m; }
  },
  dialog: {
    showMessageBox(w, o) { cap.msg = o; },
    showOpenDialog(o) { cap.open = o; }
  }
};
new Function('require', menuTpl)(id => { if (id === 'electron') return fakeElectron; throw new Error(id); });
fakeElectron.Menu.buildFromTemplate([{ label: 'Split Right' }, { label: 'Connect to WSL' }]);
assert.strictEqual(cap.tpl[0].label, '向右分屏');
assert.strictEqual(cap.tpl[1].label, '连接到 WSL');
const appMenu = { items: [{ label: 'File', submenu: { items: [{ label: 'New Window' }] } }] };
fakeElectron.Menu.setApplicationMenu(appMenu);
assert.strictEqual(appMenu.items[0].label, '文件');
assert.strictEqual(appMenu.items[0].submenu.items[0].label, '新建窗口');
fakeElectron.dialog.showMessageBox({}, { title: 'Confirm Quit', buttons: ['Cancel', 'Quit'] });
assert.strictEqual(cap.msg.title, '确认退出');
assert.deepStrictEqual(cap.msg.buttons, ['取消', '退出']);
fakeElectron.dialog.showOpenDialog({ title: 'Open workspace' });
assert.strictEqual(cap.open.title, '打开工作区');
console.log('    PASS: 菜单与系统对话框 Hook 断言通过');

console.log('\n全部 5 项校验全部通过！');
