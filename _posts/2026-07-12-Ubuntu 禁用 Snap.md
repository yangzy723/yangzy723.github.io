---
layout: mypost
title: Ubuntu 下删除并禁用 Snap
categories: [Linux]
description: 在 Ubuntu 中完整卸载 Snap、清理残留文件并阻止 apt 自动重新安装 snapd。
---

## 导语

**Snap** 是 Ubuntu 的母公司 Canonical 于 2016 年 4 月随 Ubuntu 16.04 LTS 引入的一种容器化软件包格式。自此，Ubuntu 操作系统便同时支持传统的 Debian (`.deb`) 格式与全新的 Snap 格式安装包。

尽管 Snap 具备独立沙箱、易于升级等部分优点，但在实际使用中，其缺点也十分明显：
1. **体积庞大**：占用大量磁盘空间。
2. **性能卡顿**：`snapd` 进程常导致系统重启时等待时间过长，甚至引发日常使用中的卡顿。
3. **桌面版体验不佳**：在 Ubuntu 22.04 桌面版中，两个核心程序—— **软件商店（Snap Store）** 和 **Firefox 浏览器** 默认均采用了 Snap 格式，卡顿感尤为明显。
4. **服务器版冗余**：对于服务器环境而言，这类容器化软件包基本毫无用武之地，但系统却默认安装了它。

因此，为了提升系统流畅度、精简系统空间，彻底删除 Snap 是一个非常实用的优化选择。

---

## 删除 Snap 的方法

以下提供两种卸载方法。**方法一**适合手动逐步卸载，**方法二**则更为彻底，能够直接清理缓存中的 `snapd` 包文件以及残留目录。推荐使用**方法二**。

### 方法一：手动顺序卸载

1. 首先，在终端中运行以下命令查看系统当前已安装的 Snap 软件包列表：
    ```bash
    snap list
    ```

    你将看到形如 Firefox、软件商店、系统主题以及核心依赖（如 `core20`、`bare` 等）的列表。

2. 按照依赖关系，由外向内依次移除这些软件包。先卸载上层应用（如 Firefox、Snap Store），最后卸载核心组件：
    ```bash
    sudo snap remove --purge firefox
    sudo snap remove --purge snap-store
    sudo snap remove --purge gnome-3-38-2004
    sudo snap remove --purge gtk-common-themes
    sudo snap remove --purge snapd-desktop-integration
    sudo snap remove --purge bare
    sudo snap remove --purge core20
    sudo snap remove --purge snapd
    ```


3. 最后，通过 `apt` 命令彻底移除 Snap 核心服务：
    ```bash
    sudo apt remove --autoremove snapd
    ```

### 方法二：脚本自动化彻底清理

1. 循环卸载所有已安装的 Snap 软件：
由于部分组件存在依赖关系，该循环命令可能需要执行 2~3 次（桌面版通常需要 3 次）。请多次执行直到没有软件残留：
    ```bash
    for p in $(snap list | awk '{print $1}'); do
        sudo snap remove $p
    done
    ```
    *提示：当执行后系统提示 `No snaps are installed yet. Try 'snap install hello-world'.` 时，说明已卸载干净。*

2. 停止并清理 Snap 核心底层文件：
    ```bash
    # 停止并禁用 snapd 服务与套接字
    sudo systemctl stop snapd
    sudo systemctl disable --now snapd.socket

    # 解除 snap core 的挂载
    for m in /snap/core/*; do
    sudo umount $m
    done
    ```
3. 清除 Snap 管理工具及残留配置：
    ```bash
    sudo apt autoremove --purge snapd
    ```

4. 强制删除所有残留的目录：
    ```bash
    rm -rf ~/snap
    sudo rm -rf /snap
    sudo rm -rf /var/snap
    sudo rm -rf /var/lib/snapd
    sudo rm -rf /var/cache/snapd
    ```
---

## 关键步骤：禁止 Apt 自动重新安装 Snap

即便你使用上述命令彻底清除了 Snap 软件包，但由于 Ubuntu 系统的特殊设置，当你执行 `sudo apt update` 或 `sudo apt install firefox` 时，`apt` 触发器依然会自动把 `snapd` 重新安装回来。

为了一劳永逸地关闭这个行为，我们需要在 `/etc/apt/preferences.d/` 目录下创建一个名为 `nosnap.pref` 的策略配置文件：

1. 使用编辑器打开（或创建）文件：
    ```bash
    sudo nano /etc/apt/preferences.d/nosnap.pref
    ```

2. 将以下内容粘贴进去并保存：
    ```ini
    Package: snapd
    Pin: release a=*
    Pin-Priority: -10
    ```

3. 保存并关闭文件。此配置会赋予 `snapd` 极低的优先级（-10），从而阻止 `apt` 自动下载并安装它。

4. 最终效果验证：配置完成后，你可以尝试执行安装命令。如果出现如下提示，表明系统已彻底拒绝安装 snapd，操作成功完成：
    ```shell
    $ sudo apt install snapd
    [sudo] yangzy 的密码：
    正在读取软件包列表... 完成
    正在分析软件包的依赖关系树... 完成
    正在读取状态信息... 完成
    没有可用的软件包 snapd，但是它被其它的软件包引用了。
    这可能意味着这个缺失的软件包可能已被废弃，
    或者只能在其他发布源中找到

    E: 软件包 snapd 没有可安装候选
    ```

---

## 常见问题：出现 “rm: 无法删除 'XXX': 只读文件系统” 解决方案

在 Ubuntu 中执行卸载时（例如卸载 Firefox），有时会遭遇如下报错：

```text
error: cannot perform the following tasks:
- Remove data for snap "firefox" (1943) (unlinkat /var/snap/firefox/common/host-hunspell/en_ZA.dic: read-only file system)
```

### 原因分析

这是因为 Firefox 的某些语言包或字典文件（如 `host-hunspell`）通过虚拟文件系统直接挂载在系统目录中，处于只读状态，因此无法直接被 `rm` 或 `snap remove` 清除。

### 解决方案

1. 验证挂载状态：
运行以下命令验证该目录是否确实作为 `ext4` 或挂载点处于只读（`RO=1`）状态：
    ```bash
    lsblk -fe7 -o+ro
    ```

2. 停止并禁用该挂载服务：
利用 `systemctl` 停用并屏蔽该特定的文件挂载服务（注意：由于服务名包含特殊字符，系统会使用 `\\x2d` 转义连字符 `-`）：
    ```bash
    sudo systemctl stop var-snap-firefox-common-host\\x2dhunspell.mount
    sudo systemctl disable var-snap-firefox-common-host\\x2dhunspell.mount
    ```
    *执行后，系统会提示类似于下面的信息，表示成功解绑：*
    ```text
    Removed /etc/systemd/system/default.target.wants/var-snap-firefox-common-host\x2dhunspell.mount.
    Removed /etc/systemd/system/multi-user.target.wants/var-snap-firefox-common-host\x2dhunspell.mount.
    ```

3. 继续清理：
挂载服务关闭后，该目录将不再显示为“只读文件系统”，此时你便可以顺利执行 `sudo snap remove --purge firefox` 或直接使用 `rm -rf` 顺利删除了。
