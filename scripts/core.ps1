<#
.SYNOPSIS
  Antigravity 简体中文一键汉化工具主控脚本（零外部依赖，兼容 Windows PowerShell 5.1+ / 7+）
.DESCRIPTION
  自动定位 Antigravity 安装目录，支持从官方原版 app.asar 无损解包或对已解包版本幂等升级汉化，
  并提供一键还原官方原版与环境状态诊断功能。
#>
param(
    [ValidateSet('Menu', 'Install', 'Restore', 'Diagnose')]
    [string]$Action = 'Menu',
    [string]$InstallDir = '',
    [switch]$ForceClose,
    [switch]$NoLaunch,
    [switch]$NoPause
)

$ErrorActionPreference = 'Stop'

try {
    [Console]::InputEncoding  = [System.Text.UTF8Encoding]::new($false)
    [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
    $OutputEncoding           = [System.Text.UTF8Encoding]::new($false)
} catch {}

$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$PayloadDir  = Join-Path $ProjectRoot 'payload'
$StateRoot   = Join-Path $env:LOCALAPPDATA 'Antigravity-zh-CN'
$BackupRoot  = Join-Path $StateRoot 'backup'
$StateFile   = Join-Path $StateRoot 'state.json'
$Utf8NoBom   = New-Object System.Text.UTF8Encoding($false)

# ============================================================================
# 基础辅助函数
# ============================================================================
function Write-Info([string]$Msg)    { Write-Host "  [信息] $Msg" -ForegroundColor Cyan }
function Write-Ok([string]$Msg)      { Write-Host "  [成功] $Msg" -ForegroundColor Green }
function Write-Warn([string]$Msg)    { Write-Host "  [提示] $Msg" -ForegroundColor Yellow }
function Write-Err([string]$Msg)     { Write-Host "  [错误] $Msg" -ForegroundColor Red }
function Write-Step([string]$Msg)    { Write-Host "`n==> $Msg" -ForegroundColor White }

function Read-Utf8Text([string]$Path) {
    return [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
}

function Write-Utf8NoBom([string]$Path, [string]$Content) {
    $parent = Split-Path -Parent $Path
    if ($parent -and -not (Test-Path -LiteralPath $parent)) {
        New-Item -ItemType Directory -Force -Path $parent | Out-Null
    }
    [System.IO.File]::WriteAllText($Path, $Content, $Utf8NoBom)
}

function Get-FileSha256([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) { return '' }
    return (Get-FileHash -Algorithm SHA256 -LiteralPath $Path).Hash.ToLowerInvariant()
}

function Get-PayloadMeta {
    $metaPath = Join-Path $PayloadDir 'meta.json'
    if (-not (Test-Path -LiteralPath $metaPath)) {
        throw "缺少汉化数据包文件: $metaPath，请确认解压了完整的汉化工具目录。"
    }
    return (Read-Utf8Text $metaPath) | ConvertFrom-Json
}

function Ensure-AsarExtractor {
    if (-not ('AntigravityZhCn.AsarExtractor' -as [type])) {
        $csPath = Join-Path $ScriptDir 'AsarExtractor.cs'
        if (-not (Test-Path -LiteralPath $csPath)) {
            throw "缺少 ASAR 解包器源码: $csPath"
        }
        $code = Read-Utf8Text $csPath
        Add-Type -TypeDefinition $code -Language CSharp -ErrorAction Stop
    }
}

# ============================================================================
# Antigravity 安装目录自动探测
# ============================================================================
function Test-AntigravityRoot([string]$Dir) {
    if ([string]::IsNullOrWhiteSpace($Dir)) { return $null }
    $clean = $Dir.Trim().Trim('"').TrimEnd('\', '/')
    if (-not (Test-Path -LiteralPath $clean)) { return $null }

    # 如果用户拖入的是 Antigravity.exe 或 resources 目录，自动向上归一化
    if (Test-Path -LiteralPath $clean -PathType Leaf) {
        $clean = Split-Path -Parent $clean
    }
    if ((Split-Path -Leaf $clean) -ieq 'resources') {
        $clean = Split-Path -Parent $clean
    }

    $exePath = Join-Path $clean 'Antigravity.exe'
    $resDir  = Join-Path $clean 'resources'
    if ((Test-Path -LiteralPath $exePath) -and (Test-Path -LiteralPath $resDir)) {
        return $clean
    }
    return $null
}

function Find-AntigravityDir([string]$ExplicitDir) {
    # 1. 显式参数
    if ($ExplicitDir) {
        $ok = Test-AntigravityRoot $ExplicitDir
        if ($ok) { return $ok }
        throw "指定的目录不是有效的 Antigravity 安装目录（未找到 Antigravity.exe 与 resources 目录）: $ExplicitDir"
    }

    # 2. 常见安装路径
    $candidates = @(
        (Join-Path $env:LOCALAPPDATA 'Programs\antigravity'),
        (Join-Path $env:LOCALAPPDATA 'Programs\Antigravity'),
        (Join-Path $env:ProgramFiles 'Antigravity'),
        (Join-Path ${env:ProgramFiles(x86)} 'Antigravity')
    )
    foreach ($c in $candidates) {
        $ok = Test-AntigravityRoot $c
        if ($ok) { return $ok }
    }

    # 3. 注册表卸载信息
    $regPaths = @(
        'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*',
        'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*',
        'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*'
    )
    foreach ($rp in $regPaths) {
        try {
            $items = Get-ItemProperty -Path $rp -ErrorAction SilentlyContinue |
                Where-Object { $_.DisplayName -like '*Antigravity*' }
            foreach ($it in $items) {
                foreach ($probe in @($it.InstallLocation, ($it.DisplayIcon -replace ',.*$', ''))) {
                    $ok = Test-AntigravityRoot $probe
                    if ($ok) { return $ok }
                }
            }
        } catch {}
    }

    # 4. 桌面与开始菜单快捷方式
    $lnkDirs = @(
        [Environment]::GetFolderPath('Desktop'),
        (Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs')
    )
    try {
        $wsh = New-Object -ComObject WScript.Shell
        foreach ($ld in $lnkDirs) {
            if (-not (Test-Path -LiteralPath $ld)) { continue }
            $lnks = Get-ChildItem -LiteralPath $ld -Filter '*Antigravity*.lnk' -Recurse -ErrorAction SilentlyContinue | Select-Object -First 5
            foreach ($lnk in $lnks) {
                $target = $wsh.CreateShortcut($lnk.FullName).TargetPath
                $ok = Test-AntigravityRoot $target
                if ($ok) { return $ok }
            }
        }
    } catch {}

    return $null
}

function Resolve-TargetDirInteractive([string]$ExplicitDir) {
    $found = Find-AntigravityDir $ExplicitDir
    if ($found) { return $found }

    if ($NoPause -or $Action -ne 'Menu') {
        throw "未能自动找到 Antigravity 安装目录，请使用 -InstallDir 参数手动指定安装路径。"
    }

    Write-Warn "未能自动检测到 Antigravity 安装目录。"
    Write-Host "  请将 Antigravity 安装文件夹（含 Antigravity.exe 的目录）拖入此窗口后回车，或直接粘贴路径：" -ForegroundColor Gray
    $manual = Read-Host "  安装目录"
    $ok = Test-AntigravityRoot $manual
    if (-not $ok) {
        throw "输入的路径无效（未找到 Antigravity.exe 和 resources 目录）: $manual"
    }
    return $ok
}

# ============================================================================
# 进程管理（仅针对目标 Antigravity 安装目录，绝不误杀无关进程）
# ============================================================================
function Get-AntigravityProcesses([string]$RootDir) {
    $normRoot = [System.IO.Path]::GetFullPath($RootDir).TrimEnd('\') + '\'
    $matched = @()
    $procs = Get-Process -ErrorAction SilentlyContinue | Where-Object {
        $_.ProcessName -match '^(?i)(Antigravity|language_server)$'
    }
    foreach ($p in $procs) {
        try {
            $pPath = $p.Path
            if ($pPath -and $pPath.StartsWith($normRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
                $matched += $p
            }
        } catch {
            # 若无权读取路径但进程名明确为 Antigravity，也计入提示
            if ($p.ProcessName -ieq 'Antigravity') { $matched += $p }
        }
    }
    return $matched
}

function Stop-AntigravityIfNeeded([string]$RootDir, [bool]$AutoClose) {
    $procs = Get-AntigravityProcesses $RootDir
    if (-not $procs -or $procs.Count -eq 0) { return }

    Write-Warn "检测到 Antigravity 正在运行（共 $($procs.Count) 个相关进程）。"
    if (-not $AutoClose) {
        $ans = Read-Host "  是否自动关闭 Antigravity 以继续操作？[Y/n]（默认 Y）"
        if ($ans -match '^(?i)n') {
            throw "用户取消了操作。请先完全退出 Antigravity（含系统托盘图标）后再重试。"
        }
    }

    Write-Info "正在安全关闭 Antigravity 进程..."
    foreach ($p in $procs) {
        try {
            if ($p.MainWindowHandle -ne 0) { $null = $p.CloseMainWindow() }
        } catch {}
    }
    Start-Sleep -Milliseconds 1200

    $still = Get-AntigravityProcesses $RootDir
    foreach ($p in $still) {
        try { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } catch {}
    }

    # 等待文件句柄释放
    for ($i = 0; $i -lt 15; $i++) {
        $left = Get-AntigravityProcesses $RootDir
        if (-not $left -or $left.Count -eq 0) { break }
        Start-Sleep -Milliseconds 300
    }
    $finalLeft = Get-AntigravityProcesses $RootDir
    if ($finalLeft -and $finalLeft.Count -gt 0) {
        throw "仍有 $($finalLeft.Count) 个 Antigravity 进程未能关闭，请在任务管理器中手动结束后重试。"
    }
    Write-Ok "Antigravity 进程已全部退出。"
}

# ============================================================================
# 版本与状态识别
# ============================================================================
function Get-AntigravityVersion([string]$RootDir) {
    $pkgPath = Join-Path $RootDir 'resources\app\package.json'
    if (Test-Path -LiteralPath $pkgPath) {
        try {
            $pkg = (Read-Utf8Text $pkgPath) | ConvertFrom-Json
            if ($pkg.version) { return [string]$pkg.version }
        } catch {}
    }
    foreach ($asarName in @('resources\app.asar', 'resources\app.asar.disabled')) {
        $asarFile = Join-Path $RootDir $asarName
        if (Test-Path -LiteralPath $asarFile) {
            try {
                $fs = [System.IO.File]::Open($asarFile, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
                try {
                    $br = New-Object System.IO.BinaryReader($fs)
                    $null = $br.ReadUInt32()
                    $headerSize = $br.ReadUInt32()
                    $null = $br.ReadUInt32()
                    $jsonLen = $br.ReadUInt32()
                    if ($jsonLen -gt 0 -and $jsonLen -lt 16MB) {
                        $hdr = [System.Text.Encoding]::UTF8.GetString($br.ReadBytes([int]$jsonLen)) | ConvertFrom-Json
                        $pkgNode = $hdr.files.'package.json'
                        if ($pkgNode -and $pkgNode.size -gt 0 -and $pkgNode.size -lt 1MB) {
                            $fs.Position = 8L + [long]$headerSize + [long]$pkgNode.offset
                            $pkgJson = [System.Text.Encoding]::UTF8.GetString($br.ReadBytes([int]$pkgNode.size)) | ConvertFrom-Json
                            if ($pkgJson.version) { return [string]$pkgJson.version }
                        }
                    }
                } finally {
                    $fs.Dispose()
                }
            } catch {}
        }
    }
    $verFile = Join-Path $RootDir 'version'
    if (Test-Path -LiteralPath $verFile) {
        $v = (Read-Utf8Text $verFile).Trim()
        if ($v) { return $v }
    }
    try {
        $fv = (Get-Item -LiteralPath (Join-Path $RootDir 'Antigravity.exe')).VersionInfo.ProductVersion
        if ($fv) { return $fv }
    } catch {}
    return 'unknown'
}

function Strip-ExistingLocalization([string]$Content, [string]$Kind) {
    $markers = if ($Kind -eq 'preload') {
        @(
            '// === ANTIGRAVITY_ZH_CN_BEGIN',
            '// Antigravity Chinese Localization Engine'
        )
    } else {
        @(
            '// === ANTIGRAVITY_ZH_CN_MENU_BEGIN',
            '// Antigravity Chinese Localization Engine - Menu'
        )
    }

    $earliest = -1
    foreach ($mk in $markers) {
        $idx = $Content.IndexOf($mk, [System.StringComparison]::Ordinal)
        if ($idx -ge 0 -and ($earliest -lt 0 -or $idx -lt $earliest)) {
            $earliest = $idx
        }
    }

    if ($earliest -ge 0) {
        return $Content.Substring(0, $earliest).TrimEnd("`r", "`n") + "`r`n"
    }
    return $Content.TrimEnd("`r", "`n") + "`r`n"
}

function Get-LocalizationStatus([string]$RootDir) {
    $resDir      = Join-Path $RootDir 'resources'
    $asarPath    = Join-Path $resDir 'app.asar'
    $disabledAsar = Join-Path $resDir 'app.asar.disabled'
    $appDir      = Join-Path $resDir 'app'
    $preloadPath = Join-Path $appDir 'dist\preload.js'
    $menuPath    = Join-Path $appDir 'dist\menu.js'

    $hasAsar     = Test-Path -LiteralPath $asarPath
    $hasDisabled = Test-Path -LiteralPath $disabledAsar
    $hasAppDir   = Test-Path -LiteralPath $appDir
    $preloadVer  = '未汉化'
    $menuVer     = '未汉化'

    if (Test-Path -LiteralPath $preloadPath) {
        $pt = Read-Utf8Text $preloadPath
        if ($pt -match '// === ANTIGRAVITY_ZH_CN_BEGIN\s+v([^\s=]+)') {
            $preloadVer = "已汉化 (v$($matches[1]))"
        } elseif ($pt.Contains('// Antigravity Chinese Localization Engine')) {
            $preloadVer = '已汉化 (旧版)'
        }
    }
    if (Test-Path -LiteralPath $menuPath) {
        $mt = Read-Utf8Text $menuPath
        if ($mt -match '// === ANTIGRAVITY_ZH_CN_MENU_BEGIN\s+v([^\s=]+)') {
            $menuVer = "已汉化 (v$($matches[1]))"
        } elseif ($mt.Contains('// Antigravity Chinese Localization Engine - Menu')) {
            $menuVer = '已汉化 (旧版)'
        }
    }

    $mode = if ($hasAsar -and -not $hasAppDir) {
        '官方原版 (app.asar)'
    } elseif ($hasAsar -and $hasAppDir) {
        '检测到新版官方更新 (app.asar 与 app 目录共存，将优先加载英文原版)'
    } elseif (-not $hasAsar -and $hasAppDir) {
        '已解包运行模式 (resources\app)'
    } else {
        '异常：缺少 app.asar 与 app 目录'
    }

    return [pscustomobject]@{
        RootDir      = $RootDir
        Version      = Get-AntigravityVersion $RootDir
        Mode         = $mode
        HasAsar      = $hasAsar
        HasDisabled  = $hasDisabled
        HasAppDir    = $hasAppDir
        PreloadState = $preloadVer
        MenuState    = $menuVer
        RunningCount = (Get-AntigravityProcesses $RootDir).Count
    }
}

# ============================================================================
# 组装汉化载荷（纯文本拼接，零 JSON 序列化转义风险）
# ============================================================================
function Build-InjectionPayloads {
    $dictRaw   = (Read-Utf8Text (Join-Path $PayloadDir 'dict.json')).Trim()
    $coreRaw   = (Read-Utf8Text (Join-Path $PayloadDir 'core_words.json')).Trim()
    $prefixRaw = (Read-Utf8Text (Join-Path $PayloadDir 'prefix_rules.json')).Trim()
    $preloadTp = Read-Utf8Text (Join-Path $PayloadDir 'preload_template.js')
    $menuTp    = Read-Utf8Text (Join-Path $PayloadDir 'menu_template.js')

    if (-not ($dictRaw.StartsWith('{') -and $dictRaw.EndsWith('}'))) {
        throw "payload\dict.json 格式异常（不是合法 JSON 对象）。"
    }
    if (-not ($coreRaw.StartsWith('{') -and $coreRaw.EndsWith('}'))) {
        throw "payload\core_words.json 格式异常。"
    }
    if (-not ($prefixRaw.StartsWith('[') -and $prefixRaw.EndsWith(']'))) {
        throw "payload\prefix_rules.json 格式异常。"
    }
    if (-not ($preloadTp.Contains('__ZH_DICT__') -and $preloadTp.Contains('__ZH_CORE_WORDS__') -and $preloadTp.Contains('__ZH_PREFIX_RULES__'))) {
        throw "payload\preload_template.js 缺少必要占位符。"
    }

    $preloadPayload = $preloadTp.
        Replace('__ZH_DICT__', $dictRaw).
        Replace('__ZH_CORE_WORDS__', $coreRaw).
        Replace('__ZH_PREFIX_RULES__', $prefixRaw)

    return [pscustomobject]@{
        PreloadPayload = $preloadPayload
        MenuPayload    = $menuTp
    }
}

# ============================================================================
# 核心功能 1：一键安装 / 更新汉化
# ============================================================================
function Invoke-Install([string]$RootDir, [bool]$AutoClose) {
    $meta = Get-PayloadMeta
    Write-Step "准备安装 Antigravity 简体中文汉化包 v$($meta.version)（$($meta.dictCount) 条词典 + $($meta.dynamicRulesCount) 条动态规则）"
    Write-Info "目标安装目录: $RootDir"

    Stop-AntigravityIfNeeded $RootDir $AutoClose

    $resDir       = Join-Path $RootDir 'resources'
    $asarPath     = Join-Path $resDir 'app.asar'
    $disabledAsar = Join-Path $resDir 'app.asar.disabled'
    $appDir       = Join-Path $resDir 'app'
    $stageDir     = Join-Path $resDir 'app.__zh_staging__'
    $oldAppBackup = Join-Path $resDir 'app.__zh_old__'

    # 场景 A：存在官方 app.asar（首次汉化 或 官方自动更新后刷新）
    if (Test-Path -LiteralPath $asarPath) {
        Write-Step "检测到官方 app.asar，正在执行无损解包..."
        Ensure-AsarExtractor

        if (Test-Path -LiteralPath $stageDir) {
            Remove-Item -LiteralPath $stageDir -Recurse -Force
        }
        $extractRes = [AntigravityZhCn.AsarExtractor]::Extract($asarPath, $stageDir)
        Write-Ok "解包完成：提取 $($extractRes.ExtractedFiles) 个文件（$([math]::Round($extractRes.TotalBytes / 1MB, 2)) MB），保留 $($extractRes.SkippedUnpacked) 个原位 unpacked 依赖。"

        # 校验解包结果完整
        $stagePreload = Join-Path $stageDir 'dist\preload.js'
        $stageMenu    = Join-Path $stageDir 'dist\menu.js'
        if (-not ((Test-Path -LiteralPath $stagePreload) -and (Test-Path -LiteralPath $stageMenu))) {
            Remove-Item -LiteralPath $stageDir -Recurse -Force -ErrorAction SilentlyContinue
            throw "解包后的目录中未找到 dist\preload.js 或 dist\menu.js，可能当前版本结构已大幅变化，已中止操作以保护原程序。"
        }

        # 原子替换 resources\app
        try {
            if (Test-Path -LiteralPath $oldAppBackup) {
                Remove-Item -LiteralPath $oldAppBackup -Recurse -Force
            }
            if (Test-Path -LiteralPath $appDir) {
                Move-Item -LiteralPath $appDir -Destination $oldAppBackup -Force
            }
            Move-Item -LiteralPath $stageDir -Destination $appDir -Force

            # 将官方 app.asar 安全改名为 app.asar.disabled 留作一键还原备份
            if (Test-Path -LiteralPath $disabledAsar) {
                Remove-Item -LiteralPath $disabledAsar -Force
            }
            Move-Item -LiteralPath $asarPath -Destination $disabledAsar -Force

            if (Test-Path -LiteralPath $oldAppBackup) {
                Remove-Item -LiteralPath $oldAppBackup -Recurse -Force -ErrorAction SilentlyContinue
            }
            Write-Ok "已启用解包运行目录，并将官方 app.asar 备份为 app.asar.disabled。"
        } catch {
            # 出错回滚
            if (-not (Test-Path -LiteralPath $appDir) -and (Test-Path -LiteralPath $oldAppBackup)) {
                Move-Item -LiteralPath $oldAppBackup -Destination $appDir -Force -ErrorAction SilentlyContinue
            }
            throw "切换应用目录时失败（已尝试自动回滚）: $($_.Exception.Message)"
        }
    } elseif (-not (Test-Path -LiteralPath $appDir)) {
        throw "在 $resDir 中既找不到 app.asar 也找不到 app 目录，无法继续汉化。"
    } else {
        Write-Info "当前已处于解包模式，将直接平滑升级汉化引擎与词典。"
    }

    $preloadPath = Join-Path $appDir 'dist\preload.js'
    $menuPath    = Join-Path $appDir 'dist\menu.js'
    if (-not ((Test-Path -LiteralPath $preloadPath) -and (Test-Path -LiteralPath $menuPath))) {
        throw "未找到 $preloadPath 或 $menuPath。"
    }

    # 剥离历史汉化块以获得干净原版基线
    Write-Step "正在组装并注入新版简体中文汉化引擎..."
    $rawPreload   = Read-Utf8Text $preloadPath
    $rawMenu      = Read-Utf8Text $menuPath
    $cleanPreload = Strip-ExistingLocalization $rawPreload 'preload'
    $cleanMenu    = Strip-ExistingLocalization $rawMenu 'menu'

    # 保存一份干净原件备份（按 Antigravity 版本分目录，仅首次写入，绝不覆盖原始干净文件）
    $agVersion = Get-AntigravityVersion $RootDir
    $verBackupDir = Join-Path $BackupRoot $agVersion
    if (-not (Test-Path -LiteralPath $verBackupDir)) {
        New-Item -ItemType Directory -Force -Path $verBackupDir | Out-Null
    }
    $bakPreload = Join-Path $verBackupDir 'preload.js.orig'
    $bakMenu    = Join-Path $verBackupDir 'menu.js.orig'
    if (-not (Test-Path -LiteralPath $bakPreload)) { Write-Utf8NoBom $bakPreload $cleanPreload }
    if (-not (Test-Path -LiteralPath $bakMenu))    { Write-Utf8NoBom $bakMenu    $cleanMenu }

    # 自动清理非当前客户端版本的历史过期原件备份目录
    Get-ChildItem -LiteralPath $BackupRoot -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -ne $agVersion } |
        ForEach-Object { Remove-Item -LiteralPath $_.FullName -Recurse -Force -ErrorAction SilentlyContinue }

    # 组装并写入
    $payloads     = Build-InjectionPayloads
    $finalPreload = $cleanPreload + "`r`n" + $payloads.PreloadPayload
    $finalMenu    = $cleanMenu    + "`r`n" + $payloads.MenuPayload

    Write-Utf8NoBom $preloadPath $finalPreload
    Write-Utf8NoBom $menuPath    $finalMenu

    # 写入后自检
    Write-Step "正在校验写入结果..."
    $verifyPreload = Read-Utf8Text $preloadPath
    $verifyMenu    = Read-Utf8Text $menuPath
    if (-not ($verifyPreload.Contains('ANTIGRAVITY_ZH_CN_BEGIN') -and $verifyPreload.Contains('ANTIGRAVITY_ZH_CN_END'))) {
        throw "preload.js 写入校验失败：未检测到完整汉化标记。"
    }
    if (-not ($verifyMenu.Contains('ANTIGRAVITY_ZH_CN_MENU_BEGIN') -and $verifyMenu.Contains('ANTIGRAVITY_ZH_CN_MENU_END'))) {
        throw "menu.js 写入校验失败：未检测到完整汉化标记。"
    }

    # 核对无 UTF-8 BOM（避免 Electron/Node 模块解析异常）
    $pBytes = [System.IO.File]::ReadAllBytes($preloadPath)
    $mBytes = [System.IO.File]::ReadAllBytes($menuPath)
    if (($pBytes.Length -ge 3 -and $pBytes[0] -eq 0xEF -and $pBytes[1] -eq 0xBB -and $pBytes[2] -eq 0xBF) -or
        ($mBytes.Length -ge 3 -and $mBytes[0] -eq 0xEF -and $mBytes[1] -eq 0xBB -and $mBytes[2] -eq 0xBF)) {
        throw "编码校验失败：检测到意外的 UTF-8 BOM。"
    }

    # 记录状态
    if (-not (Test-Path -LiteralPath $StateRoot)) {
        New-Item -ItemType Directory -Force -Path $StateRoot | Out-Null
    }
    $state = [ordered]@{
        packVersion        = $meta.version
        antigravityVersion = $agVersion
        installDir         = $RootDir
        installedAt        = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
        preloadSha256      = Get-FileSha256 $preloadPath
        menuSha256         = Get-FileSha256 $menuPath
        dictCount          = $meta.dictCount
    }
    Write-Utf8NoBom $StateFile ($state | ConvertTo-Json -Depth 4)

    Write-Ok "preload.js 写入校验通过 ($([math]::Round($pBytes.Length / 1KB, 1)) KB)"
    Write-Ok "menu.js    写入校验通过 ($([math]::Round($mBytes.Length / 1KB, 1)) KB)"
    Write-Host "`n============================================================" -ForegroundColor Green
    Write-Host "  Antigravity v$agVersion 简体中文汉化完成！(v$($meta.version))" -ForegroundColor Green
    Write-Host "  静态词典: $($meta.dictCount) 条 | 动态规则: $($meta.dynamicRulesCount) 条" -ForegroundColor Green
    Write-Host "============================================================`n" -ForegroundColor Green

    if (-not $NoLaunch -and $Action -eq 'Menu') {
        $launch = Read-Host "  是否立即启动 Antigravity 体验中文界面？[Y/n]（默认 Y）"
        if ($launch -notmatch '^(?i)n') {
            Start-Process -FilePath (Join-Path $RootDir 'Antigravity.exe')
            Write-Ok "已启动 Antigravity！"
        }
    }
}

# ============================================================================
# 核心功能 2：一键还原官方原版
# ============================================================================
function Invoke-Restore([string]$RootDir, [bool]$AutoClose) {
    Write-Step "准备还原 Antigravity 至官方英文原版"
    Write-Info "目标安装目录: $RootDir"

    Stop-AntigravityIfNeeded $RootDir $AutoClose

    $resDir       = Join-Path $RootDir 'resources'
    $asarPath     = Join-Path $resDir 'app.asar'
    $disabledAsar = Join-Path $resDir 'app.asar.disabled'
    $appDir       = Join-Path $resDir 'app'

    if (Test-Path -LiteralPath $disabledAsar) {
        if (Test-Path -LiteralPath $asarPath) {
            Write-Info "检测到已存在官方 app.asar，正在清理残留解包目录与旧备份..."
            if (Test-Path -LiteralPath $appDir) {
                Remove-Item -LiteralPath $appDir -Recurse -Force
            }
            Remove-Item -LiteralPath $disabledAsar -Force
        } else {
            Write-Info "正在恢复官方原始 app.asar 并移除解包目录..."
            Move-Item -LiteralPath $disabledAsar -Destination $asarPath -Force
            if (Test-Path -LiteralPath $appDir) {
                Remove-Item -LiteralPath $appDir -Recurse -Force
            }
        }
        Write-Ok "已无损还原为官方原版 app.asar！"
    } elseif (Test-Path -LiteralPath $appDir) {
        Write-Warn "未找到 app.asar.disabled 备份，将直接从 resources\app 中清除汉化注入代码..."
        $preloadPath = Join-Path $appDir 'dist\preload.js'
        $menuPath    = Join-Path $appDir 'dist\menu.js'
        if (Test-Path -LiteralPath $preloadPath) {
            $cleanP = Strip-ExistingLocalization (Read-Utf8Text $preloadPath) 'preload'
            Write-Utf8NoBom $preloadPath $cleanP
        }
        if (Test-Path -LiteralPath $menuPath) {
            $cleanM = Strip-ExistingLocalization (Read-Utf8Text $menuPath) 'menu'
            Write-Utf8NoBom $menuPath $cleanM
        }
        Write-Ok "已清除 preload.js 与 menu.js 中的汉化代码，恢复为官方英文版！"
    } else {
        Write-Warn "当前目录已经是官方原版状态，无需还原。"
    }

    if (Test-Path -LiteralPath $StateFile) {
        Remove-Item -LiteralPath $StateFile -Force -ErrorAction SilentlyContinue
    }
}

# ============================================================================
# 核心功能 3：环境与汉化状态诊断
# ============================================================================
function Invoke-Diagnose([string]$ExplicitDir) {
    $meta = Get-PayloadMeta
    Write-Step "Antigravity 环境与汉化状态诊断"
    Write-Host "  汉化包版本   : v$($meta.version)（适配 Antigravity $($meta.targetAntigravityVersion)）"
    Write-Host "  词典统计     : 静态 $($meta.dictCount) 条 | 动态规则 $($meta.dynamicRulesCount) 条 | 前缀规则 $($meta.prefixRulesCount) 条"

    $dir = Find-AntigravityDir $ExplicitDir
    if (-not $dir) {
        Write-Err "未在本机自动检测到 Antigravity 安装目录。"
        return
    }
    $st = Get-LocalizationStatus $dir
    Write-Host "  安装目录     : $($st.RootDir)"
    Write-Host "  客户端版本   : v$($st.Version)"
    Write-Host "  当前运行模式 : $($st.Mode)"
    Write-Host "  渲染层状态   : $($st.PreloadState)"
    Write-Host "  菜单弹窗状态 : $($st.MenuState)"
    Write-Host "  原版包备份   : $(if ($st.HasDisabled) { '存在 (app.asar.disabled，可一键无损还原)' } elseif ($st.HasAsar) { '官方原版 app.asar 在位' } else { '无 asar 备份（可剥离代码还原）' })"
    Write-Host "  运行中进程   : $($st.RunningCount) 个"
}

# ============================================================================
# 交互式主菜单与入口调度
# ============================================================================
function Show-Banner {
    $meta = Get-PayloadMeta
    Write-Host ""
    Write-Host "  ============================================================" -ForegroundColor Cyan
    Write-Host "       Antigravity 简体中文一键汉化工具  v$($meta.version)" -ForegroundColor Cyan
    Write-Host "       零依赖离线运行 · 全界面深度汉化 · 一键无损还原" -ForegroundColor Gray
    Write-Host "  ============================================================" -ForegroundColor Cyan
    Write-Host ""
}

try {
    if ($Action -ne 'Menu') {
        switch ($Action) {
            'Diagnose' { Invoke-Diagnose $InstallDir }
            'Install'  {
                $target = Resolve-TargetDirInteractive $InstallDir
                Invoke-Install $target ($ForceClose.IsPresent -or $NoPause.IsPresent)
            }
            'Restore'  {
                $target = Resolve-TargetDirInteractive $InstallDir
                Invoke-Restore $target ($ForceClose.IsPresent -or $NoPause.IsPresent)
            }
        }
        exit 0
    }

    while ($true) {
        Show-Banner
        $detected = Find-AntigravityDir $InstallDir
        if ($detected) {
            $st = Get-LocalizationStatus $detected
            Write-Host "  已检测到安装: $($st.RootDir) (v$($st.Version))" -ForegroundColor Green
            Write-Host "  当前汉化状态: 界面 [$($st.PreloadState)] | 菜单 [$($st.MenuState)]" -ForegroundColor DarkCyan
        } else {
            Write-Host "  暂未自动检测到 Antigravity（选择功能后可手动指定路径）" -ForegroundColor Yellow
        }
        Write-Host ""
        Write-Host "    [1] 一键安装 / 更新简体中文汉化" -ForegroundColor White
        Write-Host "    [2] 一键还原为官方英文原版" -ForegroundColor White
        Write-Host "    [3] 查看详细环境诊断信息" -ForegroundColor White
        Write-Host "    [0] 退出程序" -ForegroundColor Gray
        Write-Host ""

        $choice = (Read-Host "  请输入数字并回车 [0-3]").Trim()
        switch ($choice) {
            '1' {
                $target = Resolve-TargetDirInteractive $InstallDir
                Invoke-Install $target $ForceClose.IsPresent
            }
            '2' {
                $target = Resolve-TargetDirInteractive $InstallDir
                Invoke-Restore $target $ForceClose.IsPresent
            }
            '3' {
                Invoke-Diagnose $InstallDir
            }
            '0' { break }
            default {
                Write-Warn "无效选项，请输入 0、1、2 或 3。"
            }
        }
        if ($choice -eq '0') { break }
        Write-Host ""
        Read-Host "  按回车键返回主菜单..." | Out-Null
        Clear-Host
    }
} catch {
    Write-Host ""
    Write-Err $_.Exception.Message
    if (-not $NoPause) {
        Write-Host ""
        Read-Host "  按回车键退出..." | Out-Null
    }
    exit 1
}
