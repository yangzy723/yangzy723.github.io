---
layout: mypost
title: Apple Rosetta 2 技术梗概
categories: [macOS]
---

## 背景介绍
Apple 在 2020 年 6 月宣布将 Mac 过渡到自研 Apple Silicon（ARM 架构）。作为这一“约两年完成过渡”计划的一部分，macOS Big Sur 引入了 Rosetta 2 翻译技术。Rosetta（译名“Rosetta Stone【罗塞塔石碑】”，那是一块帮助学者破译古埃及象形文字的石碑）最初用于 2006 年 PowerPC 向 Intel 转换，Rosetta 2 则帮助用户在新款 M 系列芯片上运行旧有的 Intel (x86_64) 应用。苹果宣称 Rosetta 2 旨在简化过渡，对用户来说“平均用户应该觉察不到它的存在”。

![Rosetta](rosetta.jpg){: width="1200" height="800" }

## Rosetta 2 的工作原理
Rosetta 2 是一个动态二进制翻译（Dynamic Binary Translation）系统，主要通过以下两种方式将 x86_64 指令转换为 ARM64：

- **运行时翻译 (JIT)**：系统捕获仅含 Intel 架构的可执行文件，Rosetta 在进程内实时翻译缺页的 x86_64 指令并执行。
    - Rosetta 在内核或用户态拦截缺页异常，并在那一刻翻译这些尚未加载的 x86_64 指令为 ARM 指令，然后将翻译好的代码存入内存，供程序执行
- **安装时提前翻译 (AOT)**：首次运行或安装应用时预翻译整个二进制文件，并缓存为 ARM64 版本，提高后续运行效率。

Rosetta 会验证签名哈希，确保翻译结果的安全性与一致性。macOS 不允许混用 ARM 与 x86 指令，一个进程要么全 ARM 要么全 x86。

## 性能表现
Apple Silicon 的性能表现非常出色，使 Rosetta 2 能高效运行：

- **CPU 密集型任务**：例如图像处理、数据压缩等，因需要翻译大量指令，可能稍逊于原生 ARM。
- **I/O 密集型任务**：如磁盘读写、网络访问，翻译开销较小，性能接近原生。
- **Rosetta 优化**：M 系列芯片对 x86 指令的部分硬件支持（如内存排序）大幅提高翻译效率。

> 例外：Rosetta 2 不支持 AVX/AVX2/AVX512 等高级向量指令，使用这些指令的程序无法运行。

## 软件兼容性现状

| 软件类型                   | 运行情况         | 说明 |
|----------------------------|------------------|------|
| 原生 Apple Silicon 应用    | 原生支持         | 无需 Rosetta |
| Universal 二进制           | 原生支持         | 默认运行 ARM，用户可选 Rosetta |
| Intel (x86_64) 应用        | 支持（Rosetta 2）| 自动翻译运行 |
| 32 位应用                  | 不支持           | macOS Catalina 起已废弃 |
| 驱动/内核扩展 (kext)       | 不支持           | 无法翻译系统级代码 |
| 使用 AVX/虚拟化指令的程序 | 不支持           | 翻译失败或崩溃 |

多数主流应用（如 Chrome、Office、Adobe）都已推出原生或通用版本。

## 开发者支持工具
Xcode 12 起支持 Universal 2 架构（arm64 + x86_64）。开发者可：

- 使用 Xcode 编译生成双架构应用；
- 利用 `arch` 和 `sysctl.proc_translated` 检查当前运行模式；
- 加入 Universal App Quick Start Program 获得 Apple Silicon 开发机与迁移文档。

Apple 鼓励尽早迁移至 ARM 原生架构，Rosetta 被视为临时解决方案。**苹果计划在 macOS 27 之前继续提供 Rosetta 来支持 Intel 应用的过渡，之后将只保留部分功能，用于支持老旧的游戏。**
- macOS 15 2025 Sequoia
- macOS 26 2026 Tahoe
- macOS 27 2027 U?

## 用户体验
Rosetta 2 对用户透明：

- 安装时系统自动提示；
- 第一次运行翻译应用可能略慢；
- 后续使用与原生无异。

> 苹果称：“在大多数情况下，使用 Rosetta 的应用不会注意到性能上的区别。”

## 总结
Rosetta 2 是 Apple Silicon 迁移中的关键技术：

- 提供高效的 Intel -> ARM 翻译能力；
- 确保过渡期用户体验无缝；
- 开发者仍需尽早完成向 ARM 原生架构迁移。

这项技术成功实现了架构跨越的“平滑过渡”，也为未来构建统一的 Apple 生态打下坚实基础。
