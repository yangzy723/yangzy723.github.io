---
layout: mypost
title: Linux 和 Windows 双系统无法进入 GRUB 引导
categories: [Linux相关]
---

## 问题描述
台式电脑原有的硬盘上已经安装了 `Ubuntu 22.04`。随后我在另一块固态硬盘上安装 `Windows 10`，组成双硬盘、双操作系统环境。但安装完成并重启后，电脑会直接进入 Windows，而不会停留在 GRUB 引导界面供用户选择操作系统。

## 解决方案
在尝试了网上大多数解决方案后（包括禁用快速启动等），发现均无法解决当前面临的问题。

之后，经过多方尝试，找到以下方法可以解决该问题：
1. 尝试进入Ubuntu系统，方法有很多
    - 包括制作`Ubuntu`U盘启动盘，之后选择`TRY Ubuntu`选项
    - 进入`BIOS`系统，在BIOS中进入已经安装好的Ubuntu系统
2. 在Ubuntu系统中下载`boot-repair`软件
    ```shell
    sudo add-apt-repository ppa:yannubuntu/boot-repair && sudo apt update
    sudo apt install -y boot-repair && boot-repair
    ```
3. 打开`boot-repair`，跟随指引操作即可

经尝试，该方法可以解决无法进入 GRUB 引导界面的问题。
