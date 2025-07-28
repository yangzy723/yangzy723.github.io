---
layout: mypost
title: Linux 和 Windows 双系统无法进入grup引导
categories: [Linux相关]
---

# Linux 和 Windows 双系统无法进入 grup 引导

## 问题描述
在台式电脑原有的硬盘上已安装`Ubuntu22.04`操作系统。随后老师给了我另一块固态硬盘硬盘，于是计划在该硬盘上安装`Windows10`操作系统，实现双硬盘双操作系统的格局。但是在制作`Windows10`系统安装U盘并且将该`Windows10`系统写入新的硬盘后，重启电脑，发现该电脑直接进入`Windows10`系统，并不会停留在grip引导界面，等待用户选择操作系统使用。

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

经尝试，可以完美解决无法进入grup引导界面的问题。