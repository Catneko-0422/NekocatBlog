---
title: 我的 Windows 環境配置與 dotfiles
published: 2025-07-01
description: 我的 Windows 開發環境、常用 config 與 dotfiles 設定
image: "./cover.jpg"
tags: [Windows, Config, Dotfiles]
category: "Environment Setup"
draft: false
---

# 我的 Windows 環境配置與 dotfiles

這篇文章記錄在 Windows 上的開發、美化與日常操作設定，包含 Terminal、Window Manager、任務列美化、快捷鍵等

---

## 必裝工具列表

| 工具名稱      | 用途                           |
|---------------|--------------------------------|
| **Neovim + LazyVim** | 編輯器、開發環境                     |
| **Winget**          | Windows 軟體包管理器                |
| **fzf**             | 終端內模糊搜尋                      |
| **WezTerm**         | 高度可客製化的 Terminal              |
| **GlazeWM**         | Windows 上的 Tiling Window Manager |
| **Zebar**           | 簡潔透明頂部資訊列                  |
| **Powertoys Run**   | Spotlight 風格應用程式啟動器        |
| **Rainmeter**       | 自訂桌面小工具、時鐘                |
| **TranslucentTB**   | 任務列透明美化                      |

---

## 快速安裝指令

只要你的系統有安裝 [Winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) 就可以快速安裝：

```powershell
winget install Neovim.Neovim
winget install WezTerm.WezTerm
winget install glzr.io.GlazeWM
winget install TranslucentTB.TranslucentTB
winget install Microsoft.PowerToys
```

其他工具：

- **fzf**：請參考 [fzf GitHub](https://github.com/junegunn/fzf) 自行安裝  
- **Zebar**：可從 [Zebar 官方](https://github.com/jaimeenahn/zebar) 取得  
- **Rainmeter**：從 [Rainmeter 官網](https://www.rainmeter.net/) 下載

---

## Terminal 配置 - WezTerm

我使用 [WezTerm](https://wezterm.org/) 作為主要終端，支援高刷新率、字型微調、透明背景，以下重點設定：

✅ 字型：以下是`Iosevka Custom`的bulid plans:
```
[buildPlans.IosevkaCustom]
family = "Iosevka Custom"
spacing = "term"
serifs = "sans"
noCvSs = true
exportGlyphNames = false

  [buildPlans.IosevkaCustom.variants]
  inherits = "ss14"

  [buildPlans.IosevkaCustom.ligations]
  inherits = "haskell"

[buildPlans.IosevkaCustom.slopes.Upright]
angle = 0
shape = "upright"
menu = "upright"
css = "normal"
```
✅ 透明度：`90%`  
✅ 快捷鍵：  

| 快捷鍵                     | 功能說明                           |
|----------------------------|-------------------------------------|
| `Ctrl + Shift + Alt + E`   | 切換顏色主題                       |
| `Ctrl + Shift + Alt + H`   | 垂直分割窗格                       |
| `Ctrl + Shift + Alt + V`   | 水平分割窗格                       |
| `Ctrl + Shift + U/I/O/P`   | 調整窗格大小（左下上右）           |
| `Ctrl + 9`                 | 窗格快速切換模式                   |
| `Ctrl + L`                 | 顯示 Debug Overlay                 |
| `Ctrl + Alt + O`           | 切換透明度 90% / 100%              |

完整 Config 已附在[github](https://github.com/Catneko-0422/make-windows-pretty/blob/main/.wezterm.lua)，可直接複製使用。

---

## 窗口管理 - GlazeWM

[GlazeWM](https://github.com/glzr-io/glazewm) 是 Windows 上類似 i3wm 的平鋪式窗口管理器，支援快捷鍵快速操作：

| 快捷鍵                 | 功能說明                             |
|------------------------|---------------------------------------|
| `Alt + H/J/K/L`        | 窗口移動（左/下/上/右）              |
| `Alt + Shift + H/J/K/L`| 調整窗口大小                         |
| `Alt + U/P/I/O`        | 窗口微調大小                         |
| `Alt + T`              | 切換為平鋪模式                       |
| `Alt + Shift + Space`  | 切換為浮動模式                       |
| `Alt + F`              | 切換全螢幕                           |
| `Alt + M`              | 最小化窗口                           |
| `Alt + Shift + Q`      | 關閉窗口                             |
| `Alt + 1~9`            | 切換工作區                           |
| `Alt + Shift + 1~9`    | 將窗口移動至指定工作區               |
| `Alt + Enter`          | 開啟 WezTerm                         |
| `Alt + V`              | 切換平鋪方向                         |
| `Alt + Shift + E`      | 安全退出 GlazeWM                     |


完整 Config 已附在[github](https://github.com/Catneko-0422/make-windows-pretty/blob/main/config.yaml)，可直接複製使用。

---

## 上方資訊列 - Zebar

[Zebar](https://github.com/glzr-io/zebar)
簡潔美觀的透明頂部狀態列
相關config設定在[github](https://github.com/Catneko-0422/make-windows-pretty)


---

## 螢幕搜尋 - Powertoys Run

按下 `Alt + Space` 呼叫出全系統搜尋啟動器，類似 macOS Spotlight，非常方便。

---

## 其他美化工具

✅ **Rainmeter**：設置時鐘、天氣小工具，推薦簡潔主題  
✅ **TranslucentTB**：任務列透明化，搭配 Zebar 效果更佳  

---

## Wallpaper 壁紙

[Wallpaper](https://github.com/Catneko-0422/make-windows-pretty/blob/main/wallpaper.png)

---
