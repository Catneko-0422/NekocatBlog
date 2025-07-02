---
title: 如何安裝archlinux
published: 2025-06-02
description: 快速安裝Archlinux教學
tags: [OS, Archlinux, linux]
category: linux
image: "./cover.jpg"
draft: false
---

# 從零安裝 Arch Linux

## 為什麼要安裝 Arch Linux？

如果你喜歡 DIY、追求極致自由、希望深入理解 Linux 原理，Arch Linux 是非常適合的選擇。安裝過程能讓你徹底熟悉 Linux 系統底層架構，對學習大有幫助。

---

## 1. 製作 USB 開機碟

1. 前往 [交大 archlinux iso](http://linux.cs.nctu.edu.tw/archlinux/iso/) 下載最新的 Arch Linux ISO。
2. Windows 用戶建議使用 [Rufus](https://rufus.ie/) 製作 USB 開機碟。
   *注意：這會清空 USB 的所有資料，請先備份。*

---

## 2. 進入安裝環境

1. 插入 USB，開機時進入 BIOS/UEFI（通常按 F12、F2 或 Del）。
2. 設定 USB 為第一開機裝置，儲存並重啟。
3. 成功進入安裝環境後，應該會看到 `root@archiso ~ #` 的提示。

---

## 3. 基本設定

### 設定字體

```bash
setfont iso01-12x22.psfu.gz
```

### 切換鍵盤配置（可選）

* 查看所有鍵盤配置：

  ```bash
  ls /usr/share/kbd/keymaps/**/*.map.gz | less
  ```

* 設定美式鍵盤：

  ```bash
  loadkeys us
  ```

---

## 4. 驗證開機模式

```bash
ls /sys/firmware/efi/efivars
```

有內容代表 UEFI 模式，沒有內容通常為 BIOS（建議使用 UEFI 並關閉 Secure Boot）。

---

## 5. 網路連線

* 檢查網路是否連線：

  ```bash
  ping archlinux.org
  ```

* 有線網路通常自動連線。

* 無線網路可使用 `iwctl` 連線：

  ```bash
  iwctl
  station <device> scan
  station <device> get-networks
  station <device> connect <SSID>
  ```

---

## 6. 同步網路時間

```bash
timedatectl set-ntp true
```

---

## 7. 磁碟分割

### 查看磁碟

```bash
lsblk
```

常見裝置如 `/dev/sda`、`/dev/nvme0n1`。

### 分割磁碟

```bash
cfdisk /dev/sda
```

建議使用 GPT 分割表。分割區建議如下：

|  分割區用途  |  建議大小 |   格式  |    掛載點    |
| :-----: | :---: | :---: | :-------: |
|   EFI   |  ≥1GB | FAT32 | /boot/efi |
|   swap  |  ≥4GB |  swap |    (無)    |
| root（/） | ≥64GB |  ext4 |     /     |
|   home  |  剩餘空間 |  ext4 |   /home   |

---

### 格式化分割區

* EFI 分割區（假設 `/dev/sda1`）：

  ```bash
  mkfs.fat -F32 /dev/sda1
  ```

* swap 分割區（假設 `/dev/sda2`）：

  ```bash
  mkswap /dev/sda2
  swapon /dev/sda2
  ```

* root 分割區（假設 `/dev/sda3`）：

  ```bash
  mkfs.ext4 /dev/sda3
  ```

* home 分割區（假設 `/dev/sda4`）：

  ```bash
  mkfs.ext4 /dev/sda4
  ```

---

## 8. 掛載分割區

1. 掛載 root：

   ```bash
   mount /dev/sda3 /mnt
   ```

2. 掛載 EFI：

   ```bash
   mkdir /mnt/boot
   mount /dev/sda1 /mnt/boot
   ```

3. 掛載 home：

   ```bash
   mkdir /mnt/home
   mount /dev/sda4 /mnt/home
   ```

---

## 9. 設定鏡像站

```bash
reflector --country Taiwan --latest 5 --sort rate --save /etc/pacman.d/mirrorlist
cat /etc/pacman.d/mirrorlist
```

---

## 10. 安裝基礎系統

```bash
pacstrap /mnt base linux linux-firmware vim nano git sudo
```

如果需要無線網路，建議同時安裝 `iw wpa_supplicant networkmanager`。

---

## 11. 產生 fstab 檔

```bash
genfstab -U /mnt >> /mnt/etc/fstab
cat /mnt/etc/fstab
```

---

## 12. 進入新系統

```bash
arch-chroot /mnt
```

---

## 13. 設定時區

```bash
ln -sf /usr/share/zoneinfo/Asia/Taipei /etc/localtime
hwclock --systohc
```

---

## 14. 設定語系

* 編輯 `/etc/locale.gen`，取消註解以下兩行：

  ```
  zh_TW.UTF-8 UTF-8
  en_US.UTF-8 UTF-8
  ```

* 生成語系：

  ```bash
  locale-gen
  ```

* 設定語系：

  ```bash
  echo "LANG=zh_TW.UTF-8" > /etc/locale.conf
  ```

---

## 15. 設定主機名稱與 hosts

* 設定主機名稱：

  ```bash
  echo "archlinux" > /etc/hostname
  ```

* 編輯 `/etc/hosts`：

  ```
  127.0.0.1    localhost
  ::1          localhost
  127.0.1.1    archlinux
  ```

---

## 16. 設定 root 密碼

```bash
passwd
```

---

## 17. 安裝 GRUB 開機管理器

```bash
pacman -S grub efibootmgr
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg
```

---

## 18. 重啟與收尾

1. 離開 chroot：

   ```bash
   exit
   ```

2. 卸載所有分割區：

   ```bash
   umount -R /mnt
   ```

3. 重開機：

   ```bash
   reboot
   ```

---

## 19. 網路設定（開機自動取得 IP）

* 查看網卡名稱：

  ```bash
  ip link
  ```

* 新增 `/etc/systemd/network/你的網卡.network`，內容範例如下：

  ```
  [Match]
  Name=你的網卡名稱

  [Network]
  DHCP=yes
  ```

* 啟動 Networkd：

  ```bash
  systemctl enable --now systemd-networkd systemd-resolved
  ```

* 驗證網路：

  ```bash
  ip a
  ```

---

## 20. 建立新使用者與 sudo 權限

* 建立新使用者（將 `your_username` 替換為實際帳號）：

  ```bash
  useradd -m -G wheel,audio,video,storage your_username
  passwd your_username
  ```

* 編輯 sudoers 檔案：

  ```bash
  EDITOR=vim visudo
  ```

  找到這一行，把註解 `#` 拿掉：

  ```
  %wheel ALL=(ALL:ALL) ALL
  ```

---

# 完成安裝

Arch Linux 現已安裝完成，後續可依需求安裝桌面環境、AUR 管理工具等。

如需其他進階設定，建議參考官方 Wiki 或社群文件。
