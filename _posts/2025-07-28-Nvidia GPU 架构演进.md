---
layout: mypost
title: NVIDIA GPU 架构演进
categories: [AI Infrastructure]
description: NVIDIA 消费级与数据中心 GPU 架构的时间线、核心特性和代表型号对照。
---

## 游戏显卡架构演进

| 架构名称            | 中文名字           | 发布时间     | 核心参数（代表核心）                                    | 特点与优势                                                                 | 制程与晶体管数                       | 代表型号                      |
|---------------------|--------------------|--------------|---------------------------------------------------------|------------------------------------------------------------------------------|------------------------------------|-------------------------------|
| Fermi               | 费米               | 2010         | 512 CUDA Cores                                          | 首个完整 GPU 架构，支持 ECC 与缓存体系                                       | 40/28nm，约30亿晶体管             | GTX 480, GTX 580              |
| Kepler              | 开普勒             | 2012         | 每 SMX 192 FP32 + 64 FP64 CUDA Cores                    | 性能效率提升、支持 GPU Boost 与 GPU Direct                                  | 28nm，约71亿晶体管                 | GTX 680, GTX 780 Ti           |
| Maxwell             | 麦克斯韦           | 2014         | 每 SM 128 CUDA Cores                                    | 能效高、热控好，适合中高端游戏卡                                              | 28nm，约80亿晶体管                 | GTX 750 Ti, GTX 980           |
| Pascal              | 帕斯卡             | 2016         | 每 SM 64 FP32 CUDA Cores                                | GDDR5X 支持，高频显存，NVLink 第一代                                          | 16nm，约153亿晶体管                | GTX 1080, GTX 1070 Ti         |
| Turing              | 图灵               | 2018         | 64 FP32 + 64 Int32 + 8 Tensor Core / SM                | Tensor Core 2.0、RT Core 第一代，DLSS 1.0                                      | 12nm，约186亿晶体管                | RTX 2060, RTX 2080 Ti         |
| Ampere              | 安培               | 2020         | 64 FP32 + 64 Int32 + 4 Tensor Core / SM                | Tensor Core 3.0、RT Core 2.0、DLSS 2.0、MIG 1.0、NVLink 3.0                      | 8nm（三星），约283亿晶体管         | RTX 3080, RTX 3090            |
| Ada Lovelace        | 爱达·洛芙蕾丝       | 2022‑10‑12  | 每 SM 128 CUDA Cores + 第三代 RT Core + 第四代 Tensor Core | 第三代 RT Core 性能提升约 2×、SER 重排序提升帧率、第四代 Tensor Core 支持 FP8 | TSMC 定制 4N，CUDA Compute Capability 8.9 | RTX 4080, RTX 4090             |
| Blackwell | 布莱克韦尔       | 2025         | 最大 GB202：24,576 CUDA Cores                         | 第四代 RT Core + 第五代 Tensor Core（支持 FP4）、DLSS 4.0、神经渲染技术        | TSMC 定制 4N (消费级) / 4NP (数据中心)；GB202 含约 24,576 CUDA Cores | RTX 5090, RTX Pro 6000 Blackwell 等 |


## 数据中心与专业 GPU 架构演进

| 架构名称         | 中文名字         | 发布时间     | 核心参数（代表核心）                                   | 特点与优势                                                                      | 制程与晶体管数                  | 代表型号                             |
|------------------|------------------|--------------|--------------------------------------------------------|-----------------------------------------------------------------------------------|--------------------------------|--------------------------------------|
| Fermi            | 费米             | 2010         | 512 CUDA Cores                                         | 支持 ECC，双精度性能良好                                                         | 40/28nm，约30亿晶体管          | Tesla M2050                           |
| Kepler           | 开普勒           | 2012         | 每 SMX 192 FP32 + 64 FP64 CUDA Cores                   | GPU Direct 技术，ECC 支持                                                        | 28nm，约71亿晶体管             | Tesla K80, K40M                      |
| Maxwell          | 麦克斯韦         | 2014         | 每 SM 128 CUDA Cores                                   | 强调能效，双精度支持有限                                                          | 28nm，约80亿晶体管             | Quadro M5000 / M6000                 |
| Pascal           | 帕斯卡           | 2016         | GP100：60 SM × (64 CUDA + 32 DP Cores)                 | NVLink 1.0、HBM2 支持，高性能计算能力                                           | 16nm，约153亿晶体管            | Tesla P100, Quadro GP100             |
| Volta            | 伏特             | 2017         | 每 SM 包含 32 FP64 + 64 Int32 + 64 FP32 + 8 Tensor Core | 引入第一代 Tensor Core，NVLink2.0、NVSwitch1.0，AI 算力显著提升                  | 12nm，约211亿晶体管            | Tesla V100, Titan V                  |
| Turing           | 图灵             | 2018         | 包含 RT Core + Tensor Core 2.0                         | AI 推理优化，适合轻量级任务部署                                                 | 12nm，约186亿晶体管            | Tesla T4                             |
| Ampere           | 安培             | 2020         | A100：108 SM × (64 FP32 + 4 Tensor Core)               | Tensor Core 3.0；结构稀疏加速；MIG 1.0；NVLink 3.0                                | 7nm，约283亿晶体管             | A100, A30, A10                       |
| Hopper           | 赫柏             | 2022         | H100：132 SM × (128 FP32 + Tensor Core 4.0)            | Transformer 引擎 1.0、FP8 支持、MIG 2.0、NVLink 4.0                               | 4nm，约800亿晶体管             | H100                                 |
| Ada Lovelace L40 | 爱达·洛芙蕾丝 (L40) | 2023‑Early    | 18,176 CUDA Cores, Tensor Core Gen4 (568 units), RT Core Gen3 (142 units) | 48GB GDDR6 ECC、企业级稳定性、RT/AI 可视化加速、被广泛用于虚拟化和渲染任务             | TSMC 定制 4N，约76.3B 晶体管, 608 mm² die | NVIDIA L40 / L40S                         |
| Blackwell        | 布莱克韦尔       | 2024‑2025    | GB100 双芯片封装总计 2080 亿晶体管；GB100 包含两颗 GB100 die   | 第五代 Tensor Core（支持 FP4/FP6）、第二代 Transformer 引擎、NVLink5.0/NV-HBI，高效能/机密 AI 计算  | 客制 4NP，双 die 总晶体管数约 2080 亿 | B200 / GB200 NVL72 / RTX Pro 6000 Blackwell 等 |
