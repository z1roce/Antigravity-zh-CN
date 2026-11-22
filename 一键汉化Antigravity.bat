@echo off
setlocal
chcp 65001 >nul 2>&1
title Antigravity 简体中文一键汉化工具

set "ROOT_DIR=%~dp0"
set "CORE_PS1=%ROOT_DIR%scripts\core.ps1"

if not exist "%CORE_PS1%" (
    echo [错误] 找不到主控脚本 "%CORE_PS1%"
    echo 请确认已将整个压缩包完整解压，不要在压缩包预览窗口中直接双击运行。
    pause
    exit /b 1
)

set "PS_EXE="
where powershell.exe >nul 2>&1 && set "PS_EXE=powershell.exe"
if not defined PS_EXE (
    where pwsh.exe >nul 2>&1 && set "PS_EXE=pwsh.exe"
)
if not defined PS_EXE (
    echo [错误] 未检测到 Windows PowerShell，无法运行。
    pause
    exit /b 1
)

rem 如果用户将 Antigravity 安装目录直接拖拽到此 bat 上（且不是以 - 开头的参数），自动作为 -InstallDir 传入
set "FIRST_ARG=%~1"
if defined FIRST_ARG (
    if not "%FIRST_ARG:~0,1%"=="-" (
        if exist "%FIRST_ARG%" (
            "%PS_EXE%" -NoProfile -ExecutionPolicy Bypass -File "%CORE_PS1%" -InstallDir "%FIRST_ARG%"
            exit /b %ERRORLEVEL%
        )
    )
)

"%PS_EXE%" -NoProfile -ExecutionPolicy Bypass -File "%CORE_PS1%" %*
exit /b %ERRORLEVEL%
