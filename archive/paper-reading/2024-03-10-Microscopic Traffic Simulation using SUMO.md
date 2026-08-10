---
layout: article
title: Microscopic Traffic Simulation using SUMO》
categories: [论文阅读]
---
## Microscopic Traffic Simulation using SUMO
**[原文](Microscopic_Traffic_Simulation_using_SUMO.pdf)**

### INTRODUCTION

交通仿真工具的类别
- 宏观：模拟平均车辆动态，如交通密度
- 微观：每辆车及其动态被单独建模
- 中观：宏观和微观模型的混合
- 亚微观：每辆车以及车内功能都被明确模拟，例如换挡

本文着重介绍微观交通仿真

### WORKFLOW
着重论述交通模拟的工作流程：
1. 建立交通网（NETWORK SETUP）
2. 扩展网，例如公共交通专用道和信号灯（NETWORK SETUP）
3. 生成路径需求，即生成车辆实际进行行动的交通路径（Demand Modeling and Adaption）
...

### EXAMPLE: BOLOGNA SCENARIO
一个博洛尼亚街道的例子
...

### NETWORK SETUP

介绍SUMU网络：
SUMO网络由节点和单向边组成，表示街道、水路、轨道、自行车道和人行道。每条边的几何形状由一系列线段描述，包含一个或多个平行运行的车道。

为了确保网络表示一致，SUMO网络是使用NETCONVERT和NETEDIT应用程序创建的。
NETCONVERT是一个命令行工具，可用于从不同数据源（如OpenStreetMap（OSM）、OpenDRIVE、Shapefile）或从其他仿真器（如MATSim和Vissim）导入道路网络。NETCONVERT的一个关键特性是启发式地完善缺失的网络数据，以实现微观仿真所需的详细级别（例如为OSM网络合成交通灯计划、让行规则和交叉口几何形状）。

NETCONVERT？启发式？

由于输入数据与微观仿真所需的详细级别之间经常存在不匹配，网络和基础设施准备往往是一项具有挑战性的任务。可使用**NETCONVERT**

### Demand Modeling and Adaption

*A. Demand importing and generation*

需求建模即是生成一条有效的交通路径，介绍了很多基于网状路线静态结构特征生成交通路径的方法和工具

DFROUTER：主要概念是根据高速公路和相关匝道以及互通的检测到的流量，在每个检测器上生成路径。

*B. Demand adaptation*

对于规划好的路径，其可能并不太符合实际交通情况。即交通需求数据具有有限可用性的问题，在该章提出了三种解决方法。（基本都是使用外部开源程序修改或者丢弃路线，以调整不同路径的流量及存在性）

### Multi- and Intermodal Traffic

主要讲了多种交通方式联合交通的可能，以及SUMO的解决策略（利用内置的DUAROUTER计算跨模式路径）

公共交通的关键特征：公共交通由一组车辆（线路）服务于特定的站点序列

### Validation

如何检测模型正确性？ -> 当前没有一站式解决方案

模拟的输出应尽可能接近真实数据 -> 如何量化“接近程度”，在这方面已经提出了许多不同的度量方法。
根据作者经验，使用RMSE（均方根误差）之类更复杂的东西并不能带来太多好处。

如何调参使得模拟数据和真实数据尽可能接近？

### Pedestrians

SUMO中的行人模型：
- The Non-Interacting Model：未考虑行人之间的相互作用，未考虑行人和车辆之间的相互影响，只在网络上跟踪行程
- The Striping Model：SUMO中的默认模型，行人占据了人行道、人行道和人行横道的空间，可能会妨碍车辆或其他行人的移动。使用NETCONVERT启发式地生成人行横道，或者在NETEDIT中手动编辑它们
    - 该模型通过只考虑沿着分段线性路径的近距离交互来实现高执行速度（与行人数量成线性关系）。这是通过将可用空间沿着行走方向分成窄条带，并且每个条带只与最多一个其他交通对象进行交互来实现的

### Modeling enhancements

*A. Numerical Integration Scheme*
介绍了SUMO模拟过程中针对物体运动的工作原理：包括两种方案
- 一阶欧拉方案（first order Euler scheme）
- 弹道方案（ballis- tic scheme），更加平滑

*B. Action Points*
设置行动点与模拟步长协同工作，每次状态变化下限时间由模拟步长限制，上限由指定的行动步长限制（到达下一个行动点的时间）

*C. Sublane Model*
默认情况下，SUMO模拟交通时，每辆车都在其车道的中心行驶，只有使用额外的车道才会进行超车。当这种行为不足以满足需求时，SUMO内的子车道模型可以用来模拟异质交通和降低车道纪律。在使用该模型时，考虑车道宽度和车辆宽度，允许在单个车道内超车

*D. Overtaking through the oncoming lane*
...

### Simulator Coupling
提出了一种耦合两个或多个模拟器的方法
