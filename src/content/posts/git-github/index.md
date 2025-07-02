---
title: Git 與 GitHub 使用教學入門
published: 2025-07-01
description: 快速學會 Git 與 GitHub
image: "./cover.jpg"
tags: [Git, GitHub, version control]
category: "development tools"
draft: false
---

# Git 與 GitHub 使用教學入門
想要團隊協作、版本控制、上傳作品到雲端，Git 跟 GitHub 絕對是你的好幫手，不管你是程式開發、寫報告、管理專案，這些工具都能大大提升效率

## Git 是什麼？
Git 是一個「版本控制系統」，就像你寫作業每改一版就存一份，Git 幫你自動管理所有歷史版本，還能隨時回溯、不怕搞砸

### 常見用途
- 紀錄每次修改
- 團隊共同開發
- 不小心改壞也能救回來

## GitHub 是什麼？
GitHub 是基於 Git 的雲端平台，提供：
- 免費備份程式碼
- 線上展示作品
- 團隊一起開發、拉請求（PR）
- 個人作品集平台

# 安裝與設定 Git
1️⃣ 安裝 Git
[前往 Git 官網下載](https://git-scm.com/downloads)

2️⃣ 基本設定（只做一次）
```
git config --global user.name "你的暱稱"
git config --global user.email "你的Email"
```
建議用跟 GitHub 一樣的 Email


---

## 📝 常用 Git 指令速查

| 指令                             | 說明                                  |
|----------------------------------|---------------------------------------|
| `git init`                      | 初始化 Git 倉庫（資料夾變 Git 專案） |
| `git status`                    | 查看目前狀態（有沒有東西沒存檔）      |
| `git add 檔名`                  | 加入暫存區（準備提交）                |
| `git commit -m "描述內容"`      | 提交版本，留下紀錄訊息                |
| `git log`                       | 查看版本歷史                          |
| `git diff`                      | 看改了什麼地方                        |
| `git clone 倉庫網址`            | 複製別人的 GitHub 專案下來            |
| `git push`                      | 上傳到 GitHub                         |
| `git pull`                      | 從 GitHub 下載更新                    |

---

## GitHub 基本操作

### 1️⃣ 註冊帳號
[前往 GitHub 註冊](https://github.com)

### 2️⃣ 建立新倉庫（Repository）
可線上建立空白專案，並選擇是否公開。

### 3️⃣ 本地git專案綁定 GitHub 倉庫
```bash
git remote add origin 倉庫網址
git branch -M main
git push -u origin main
```
之後只要 `git push` 就能更新上傳

---

## 分支控制教學

### 常見分支策略：
- `main`: 穩定版、部屬用
- `dev`: 開發版、測試中
- `feature/功能名稱`: 功能開發分支
- `hotfix/修正內容`: 緊急修復分支

---

### 常用分支指令：
| 指令                             | 說明                                  |
|----------------------------------|---------------------------------------|
| `git branch`                     | 查看目前所有分支                       |
| `git branch 分支名`               | 新增分支                              |
| `git checkout 分支名`             | 切換分支                              |
| `git checkout -b 分支名`          | 新增並切換分支                         |
| `git merge 分支名`                | 將指定分支合併到目前分支                |
| `git branch -d 分支名`            | 刪除分支(已合併)                       |
| `git push origin 分支名`          | 上傳分支到GitHub                      |
| `git pull origin 分支名`          | 下載遠端分支                           |
---

### 分支操作流程:
```shell
git checkout -b feature/new-ui # 建立功能分支
# 開發中，修改檔案...
git add .
git commit -m "完成新UI功能"
git push origin feature/new-ui # 上傳到github
```
開發完成後，切回主分支合併:
```shell
git checkout main
git pull # 確保主分支最新
git merge feature/new-ui
git push origin main
```

## 團隊協作小技巧

- 使用 `git clone` 下載別人專案
- 每次改完：`git add` ➡️ `git commit` ➡️ `git push`
- 更新別人改的內容：`git pull`
- 遇到衝突別怕，Git 會提示手動解決

---

## 常見問題與解法
| 問題                             | 解法                                  |
|----------------------------------|---------------------------------------|
| commit 忘記加檔案                 | 補上`git add`，再用`git commit --amend`|
| 不想被版本控制的檔案               | 新增`.gitignore`檔案                   |
| 改壞想回到上個版本                 | `git checkout` 檔案名 或`git reset`    |
---