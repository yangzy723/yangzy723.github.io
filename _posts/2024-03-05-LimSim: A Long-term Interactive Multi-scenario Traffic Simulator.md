---
layout: mypost
title: LimSim：A Long-term Interactive Multi-scenario Traffic Simulator
categories: [论文阅读]
---
## LimSim: A Long-term Interactive Multi-scenario Traffic Simulator
**[源代码](http://github.com/PJLab-ADG/LimSim)**
**[原文](LimSim_A_Long-Term_Interactive_Multi-Scenario_Traffic_Simulator.pdf)**

### INTRODUCTION

1. 交通仿真器的作用：
    - 成为数字孪生城市建设中的关键要素
    - 面向场景的仿真在自动驾驶的开发和测试中也扮演着重要角色

2. 仿真器的类型
    - 基于流量的仿真器
        - 可以反映现实世界交通系统的特征并分析各种交通流条件
        - 但它们往往简化了车辆运动行为，未考虑多车辆交互和运动学约束
    - 基于车辆的仿真器
        - 旨在构建虚拟道路场景以验证开发的算法性能
        - 背景交通流的生成依赖于手动编辑场景或使用收集的道路数据，这无法准确复现实际场景的特征
    - 基于数据的仿真器
        - 通过从数据集中提取车辆运动特征，这些仿真器允许车辆与背景交通流进行交互
        - 数据集通常提供零散的小规模场景，导致这些仿真器无法进行长期连续的仿真

3. 介绍**LimSim**
    - 我认为比较trick的创新点在于"The range of microscopic simulation is defined by the scenario area. Vehicles outside this area are controlled by classic traffic flow models, while those within the range undergo precise decision-making and planning processes"
    - LimSim将整个道路网络的宏观交通流量模拟与微观车辆运动模拟结合在一起，在特定情况下，提供了交通行为的全面表示

### RELATED WORK
对三类仿真器的近期具体研究成果进行概述

*C. Data-based simulators* 看不太懂

基于数据的模拟器可以从自然驾驶环境中隐式学习多车辆交互，并模拟车辆之间的互动。然而，这些模拟依赖于收集的数据集，使得难以编辑和扩展场景，导致了场景碎片化的问题

### SYSYTEM OVERVIEW
LimSim包括四个模块来模拟长期交通场景：
- *Multi-scenario road network construction* 
- *Multi-source traffic flow generation*
- *Multi-vehicle joint decision-making and planning* 对于场景区域内的受控车辆，LimSim采用了称之为PDP过程的分层设计，包括三个步骤：预测、决策和规划
- *Multi-dimensional scenario analysis*

![Four Module](four_module.png)

根据系统模块的描述，LimSim的输入必须包括道路的几何尺寸和它们之间的拓扑连接。此外，交通信号方案或交通标志信息是可选的输入。LimSim支持在信号化交叉口进行车辆控制，并根据交通标志信息调整车辆控制策略，例如根据道路限速调整最大车速，或者根据交通标志信息限制车辆是否允许左转或右转。如果只提供道路网络信息，则LimSim可以随机生成车辆的需求和路线以进行随机仿真

### FEATURES
A. Long-term simulation and evaluation
1. 采用“碰撞时间”（TTC）作为衡量冲突严重程度的指标，TTC定义为“如果两辆车以当前速度并在同一路径上继续行驶，它们相撞所需的时间”。相对短TTC的片段，都发生在更为关键的场景中，即更有代表性、更具威胁的场景

B. Multi-vehicle motion control

2. PDP过程：
    - 使用蒙特卡洛树搜索（MCTS）进行多车辆的联合决策已被证明可以实现车辆之间的社交互动，并生成具有多样性的交通流。然而，当模拟繁忙的十字路口或拥挤的高速公路时，场景区域内大量车辆使搜索树呈指数增长。这导致计算效率和决策算法的成功率急剧下降。实际上，要求每辆车都关注其他车辆的每一个动作既不高效也不现实。在LimSim中，我们采用基于组的MCTS决策算法，针对多辆车辆，将全局车辆互动问题划分为一组子问题。
    - 具有并行架构的规划算法很适合作为上述决策的下游过程。规划器首先尝试根据每辆车的决策结果生成平滑连续的路径。它还检查路径是否满足车辆的运动学约束，包括转弯半径、速度/加速度限制等。如果上述尝试失败，车辆无法遵循其决策，规划器会切换到更大的目标状态空间以生成有效的轨迹，例如中止变道或紧急制动

![PDP过程](PDP.png)

C. Interactive scenario reconstruction

1. 目前的方法：场景回放和场景生成
    - 场景回放：在场景回放方法中，仿真系统为自车提供决策制定和规划方法，而场景中的其他车辆则按照记录的方式行驶。虽然易于实现，但通过这种方法控制的自车无法与其他车辆互动，仅能在极少数场景中测试其响应能力
    - 场景生成：对于场景生成方法，设计的模型被应用于计划从某一时刻到结束时的所有车辆的轨迹。虽然可以实现自车与其他车辆之间的互动，但由于模型的真实性不足，后续车辆的移动可能会完全偏离真实场景