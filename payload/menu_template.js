// === ANTIGRAVITY_ZH_CN_MENU_BEGIN v2.2.0 ===
// Antigravity Chinese Localization Engine - Menu & Native Dialogs (v2.2.0)
(function() {
  const menuTranslationMap = {"File":"文件","Edit":"编辑","View":"视图","Window":"窗口","Help":"帮助","Speech":"语音","New Conversation":"新建对话","New Window":"新建窗口","Close Window":"关闭窗口","Close Tab":"关闭标签页","New Tab":"新建标签页","New Terminal Tab":"新建终端标签页","Reopen Closed Tab":"重新打开已关闭的标签页","Connect to WSL":"连接到 WSL","Reopen Locally":"在本地重新打开","Docs":"文档","Documentation":"文档","Check for Updates":"检查更新","Checking for Updates...":"正在检查更新…","Downloading Update...":"正在下载更新…","Restart to Update":"重启以应用更新","No agents running":"暂无运行中的智能体","Quit":"退出","Undo":"撤销","Redo":"重做","Cut":"剪切","Copy":"复制","Paste":"粘贴","Paste and Match Style":"粘贴并匹配样式","Delete":"删除","Select All":"全选","Start Speaking":"开始朗读","Stop Speaking":"停止朗读","Minimize":"最小化","Maximize":"最大化","Zoom":"缩放","Close":"关闭","Quit Antigravity":"退出 Antigravity","About Antigravity":"关于 Antigravity","Services":"服务","Hide Antigravity":"隐藏 Antigravity","Hide Others":"隐藏其他","Show All":"显示全部","Force Reload":"强制重新加载","Reload":"重新加载","Actual Size":"实际大小","Reset Zoom":"重置缩放","Zoom In":"放大","Zoom Out":"缩小","Toggle Full Screen":"切换全屏","Toggle Developer Tools":"切换开发者工具","Bring All to Front":"前置全部窗口","Front":"前置","Split":"分屏","Split Right":"向右分屏","Split Down":"向下分屏","Split Left":"向左分屏","Split Up":"向上分屏","Split Conversation Vertically":"垂直拆分对话","Split Conversation Horizontally":"水平拆分对话","Equalize Split Panes":"均分拆分面板","Replace With New":"替换为新建","Replace with New":"替换为新建","Close Others":"关闭其他","Close All":"全部关闭","Close to the Right":"关闭右侧","Close Tabs to the Right":"关闭右侧标签页","Close Saved":"关闭已保存","Pin":"置顶","Unpin":"取消置顶","Archive":"归档","Unarchive":"取消归档","Rename":"重命名","Duplicate":"制作副本","Duplicate Conversation":"复制对话","Mark Read":"标记为已读","Mark Unread":"标记为未读","Mark as Read":"标记为已读","Mark as Unread":"标记为未读","Copy Link":"复制链接","Copy link":"复制链接","Copy ID":"复制 ID","Copy Conversation ID":"复制对话 ID","Copy Conversation Link":"复制对话链接","Copy Path":"复制路径","Copy Relative Path":"复制相对路径","Copy Full Path":"复制完整路径","Open in File Explorer":"在文件资源管理器中打开","Show in File Explorer":"在文件资源管理器中显示","Reveal in Finder":"在访达中显示","Show in File Manager":"在文件管理器中显示","Open in Terminal":"在终端中打开","Open in IDE":"在 IDE 中打开","Open in Editor":"在编辑器中打开","Open in External Browser":"在外部浏览器中打开","Open in Browser":"在浏览器中打开","Open Link":"打开链接","Open link":"打开链接","Copy Link Address":"复制链接地址","Copy Image":"复制图片","Copy Image Address":"复制图片地址","Save Image As…":"图片另存为…","Save Image As...":"图片另存为…","Inspect Element":"检查元素","Inspect":"检查","Connection info…":"连接信息…","Connection info...":"连接信息…","Connection info":"连接信息","Add to Chat":"添加到对话","Quote Selection":"引用所选内容","Comment on Selection":"对所选内容添加评论","Side Question Selection":"对所选内容发起侧边提问","Insert in Terminal":"插入到终端","Export":"导出","Import":"导入","Remove from Recent":"从最近列表中移除","Open Settings":"打开设置","Open Folder":"打开文件夹","Add Workspace":"添加工作区","Delete Conversation":"删除对话","Archive Conversation":"归档对话","Unarchive Conversation":"取消归档对话","Stop SSH server":"停止 SSH 服务器","Restart SSH server":"重启 SSH 服务器"};
  const dialogTranslationMap = {"Confirm Quit":"确认退出","Are you sure you want to quit?":"您确定要退出吗？","There may be agents or background tasks running.":"当前可能仍有智能体或后台任务正在运行。","Cancel":"取消","Quit":"退出","OK":"确定","Yes":"是","No":"否","Allow":"允许","Don't Allow":"不允许","Sign In":"登录","Continue":"继续","Take Over":"接管","Restart":"重启","Later":"稍后","Stop Server":"停止服务器","Stop SSH server":"停止 SSH 服务器","Restart SSH server":"重启 SSH 服务器","SSH connection failed":"SSH 连接失败","Could not restart the SSH server":"无法重启 SSH 服务器","Microphone access":"麦克风访问权限","Shared home directory":"共享主目录","Passkeys":"通行密钥","Choose Another File…":"选择其他文件…","Choose Another File...":"选择其他文件…","Check for Updates":"检查更新","No updates available":"当前已是最新版本","Open workspace":"打开工作区","Open workspaces":"打开工作区","Select Folder":"选择文件夹","Select Download Folder":"选择下载文件夹","Cannot open folder":"无法打开文件夹","Choose an SSH config file":"选择 SSH 配置文件","Choose another SSH config file":"选择其他 SSH 配置文件","Binary not found":"未找到可执行文件","WSL setup failed":"WSL 配置失败","Startup failed":"启动失败","Folder is on the Windows filesystem":"文件夹位于 Windows 文件系统上","WSL distro not found":"未找到 WSL 发行版","Antigravity opened on Windows instead.":"Antigravity 已改为在 Windows 本地打开。","Connect a device":"连接设备","Select a device:":"请选择设备：","No compatible devices found.":"未找到兼容的设备。","Choose a Passkey":"选择通行密钥","Select a passkey account to continue:":"请选择通行密钥账号以继续：","Connection info":"连接信息"};

  function translateLabel(label) {
    if (!label || typeof label !== 'string') return label;
    if (Object.prototype.hasOwnProperty.call(menuTranslationMap, label)) {
      return menuTranslationMap[label];
    }
    let m;
    if ((m = label.match(/^Move to Group:\s*(.+)$/))) return '移动到分组：' + m[1];
    if ((m = label.match(/^Search Google for\s+"(.+)"$/))) return '在 Google 上搜索“' + m[1] + '”';
    if ((m = label.match(/^Open in\s+(.+)$/))) return '在 ' + m[1] + ' 中打开';
    if ((m = label.match(/^Show in\s+(.+)$/))) return '在 ' + m[1] + ' 中显示';
    if ((m = label.match(/^Remove\s+(.+?)\s+from Recent$/))) return '从最近列表中移除 ' + m[1];
    if ((m = label.match(/^Close\s+(.+)$/))) return '关闭 ' + m[1];
    if ((m = label.match(/^Delete\s+(.+)$/))) return '删除 ' + m[1];
    if ((m = label.match(/^(\d+)\s+agents?\s+running$/i))) return m[1] + ' 个智能体正在运行';
    return label;
  }

  function translateDialogStr(str) {
    if (!str || typeof str !== 'string') return str;
    if (Object.prototype.hasOwnProperty.call(dialogTranslationMap, str)) {
      return dialogTranslationMap[str];
    }
    let m;
    if ((m = str.match(/^The WSL distro "(.+?)" is no longer installed\.?$/))) {
      return 'WSL 发行版“' + m[1] + '”已卸载。';
    }
    if ((m = str.match(/^(.+?) wants to connect to a (.+)$/))) {
      return m[1] + ' 请求连接到 ' + m[2];
    }
    if ((m = str.match(/^Sign in to (.+)$/))) {
      return '登录 ' + m[1];
    }
    return str;
  }

  function translateMenuTemplate(item) {
    if (!item || typeof item !== 'object') return;
    if (item.label && item.id !== 'check-for-updates') {
      item.label = translateLabel(item.label);
    }
    if (item.submenu) {
      if (Array.isArray(item.submenu)) {
        item.submenu.forEach(translateMenuTemplate);
      } else if (Array.isArray(item.submenu.items)) {
        item.submenu.items.forEach(translateMenuTemplate);
      }
    }
  }

  function translateMenuInstance(menu) {
    if (!menu || !Array.isArray(menu.items)) return;
    menu.items.forEach((item) => {
      if (item.label && item.id !== 'check-for-updates') {
        try { item.label = translateLabel(item.label); } catch (_) {}
      }
      if (item.submenu && Array.isArray(item.submenu.items)) {
        translateMenuInstance(item.submenu);
      }
    });
  }

  function translateDialogOptions(opts) {
    if (!opts || typeof opts !== 'object') return opts;
    const copy = Object.assign({}, opts);
    if (typeof copy.title === 'string') copy.title = translateDialogStr(copy.title);
    if (typeof copy.message === 'string') copy.message = translateDialogStr(copy.message);
    if (typeof copy.detail === 'string') copy.detail = translateDialogStr(copy.detail);
    if (Array.isArray(copy.buttons)) {
      copy.buttons = copy.buttons.map((b) => typeof b === 'string' ? translateDialogStr(b) : b);
    }
    return copy;
  }

  try {
    const { Menu, Tray, dialog } = require('electron');
    if (Menu && Menu.buildFromTemplate && !Menu.__isTranslated) {
      const originalBuildFromTemplate = Menu.buildFromTemplate;
      Menu.buildFromTemplate = function(template) {
        if (template && Array.isArray(template)) {
          template.forEach(translateMenuTemplate);
        }
        return originalBuildFromTemplate.call(this, template);
      };
      if (typeof Menu.setApplicationMenu === 'function') {
        const originalSetAppMenu = Menu.setApplicationMenu;
        Menu.setApplicationMenu = function(menu) {
          if (menu) translateMenuInstance(menu);
          return originalSetAppMenu.call(this, menu);
        };
      }
      Menu.__isTranslated = true;
    }
    if (Tray && Tray.prototype && typeof Tray.prototype.setContextMenu === 'function' && !Tray.prototype.__isTranslated) {
      const origSetContextMenu = Tray.prototype.setContextMenu;
      Tray.prototype.setContextMenu = function(menu) {
        if (menu) translateMenuInstance(menu);
        return origSetContextMenu.call(this, menu);
      };
      Tray.prototype.__isTranslated = true;
    }
    if (dialog && !dialog.__isTranslated) {
      if (typeof dialog.showMessageBox === 'function') {
        const origMsg = dialog.showMessageBox;
        dialog.showMessageBox = function(a, b) {
          if (b !== undefined) return origMsg.call(this, a, translateDialogOptions(b));
          return origMsg.call(this, translateDialogOptions(a));
        };
      }
      if (typeof dialog.showOpenDialog === 'function') {
        const origOpen = dialog.showOpenDialog;
        dialog.showOpenDialog = function(a, b) {
          if (b !== undefined) return origOpen.call(this, a, translateDialogOptions(b));
          return origOpen.call(this, translateDialogOptions(a));
        };
      }
      dialog.__isTranslated = true;
    }
  } catch (e) {
    console.error('Menu/Dialog localization hooking failed:', e);
  }
})();
// === ANTIGRAVITY_ZH_CN_MENU_END ===
