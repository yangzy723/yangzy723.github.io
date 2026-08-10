---
layout: article
title: ROS-LLM：A ROS framework for embodied AI with task feedback and structured reasoning
categories: [论文阅读]
---
# 《ROS-LLM: A ROS framework for embodied AI with task feedback and structured reasoning》

**[原文](ROS-LLM.pdf)**

**[源码](https://github.com/huawei-noah/HEBO/tree/rosllm/ROSLLM)**

本文主要介绍一个机器人编程框架，该框架利用自然语言提示和来自机器人操作系统（ROS）的上下文信息。该系统集成了大规模语言模型（LLM），使非专业用户能够通过聊天界面向系统描述任务需求。

## 一、问题建模

### 1.1 Modified MDP Framework

一个强化学习（RL, reinforcement learning）框架，通过引入失败标志来指示任务的成功或失败

在标准强化学习中，马尔可夫决策过程（MDP）由五元组⟨S, A, r, P, γ⟩定义：
- **S**: 状态空间（代理可能遇到的所有情况）
- **A**: 动作空间（代理可以采取的所有可能动作）
- **r**: 奖励函数（根据状态和动作提供反馈的函数）
- **P**: 转移概率（给定一个动作，从一个状态转移到另一个状态的概率）
- **γ**: 折扣因子（平衡即时奖励和未来奖励）

在修改后的MDP中，增加了一个故障标志：
- f=0: 任务成功完成。
- f=1: 任务失败。

### 1.2 Single-Task Reinforcement Learning (RL)

在标准的单任务强化学习（RL）中，代理学习一个策略 $\mu$(a $\mid$ o)，其中：

- $\mu$:策略，用于将观察o（来自环境的信息，如图像）映射为动作a。
  
代理的目标是通过学习哪一系列动作能够导致最佳结果，从而最大化累积奖励。

### 1.3 Composing Atomic Actions to Form Behaviors

选择和组合这些行为的过程由一个行为策略 $\pi$(b $\mid$ o,h)驱动，其中：

- $\pi$: 行为策略，根据环境观察o和人类输入h（以文本形式提供）选择动作组合b。

behaviors are formed by sequencing or organizing atomic actions (policies) into a structure such as a sequence or a behavior tree. 

### 1.4 行为策略与回报函数

代理的行为策略 $\pi$ 负责选择一系列原子动作或行为b，其目标是在最大化成功率的同时最小化时间（即完成任务所用的动作数量）。

行为策略的回报函数定义为：
$$ R^\pi := E\left[ \sum_{\tau} -\beta^\tau (1 + \hat{f}_\tau) \right] $$

其中：

- $\tau$ 是行为策略 $\pi$ 中的一个时间步。
- $\hat{f}_\tau$ 是在时间步 $\tau$ 上的原子动作的故障指标。
- $\beta$ 是一个折扣因子，满足 $0<\beta\leq 1$。

### 1.5 分层强化学习

分层强化学习可用于更高级的设置，其中组织了多个级别的决策。在分层强化学习中，不同层次的策略可以在不同的抽象级别上运行，高级策略选择执行哪些行为(behavior)，低级策略处理原子操作(atomic action)

## 二、The ROS-LLM Framework

### 2.1 Atomic action library

完成longer-horizon task通过将其拆解为Atomic action。但是最初可以提供这些操作的初始集合，但它不太可能涵盖所有潜在的任务。因此，**系统包括一个工具，允许非专家用户通过模仿学习向库中添加额外的原子动作**。

框架结合atomic actions为*ROS action*或*ROS service*，对于库中的每个动作或服务，提供了一个文本描述，以传达其预期功能和使用方法：
- JSON文件
- “name”表示ROS动作/服务的名称
- “type”指定该原子动作是ROS动作还是ROS服务
- “description”描述原子动作及其输入/输出

设计了工具，使其能够在ROS环境中轻松检索动作库描述，以可读字符串的形式呈现，并通过提示暴露给LLM。这些原子动作随后可以由LLM代理进行组合和编排，以执行复杂的行为。

### 2.2 Environment observation

鉴于agent是一个语言模型，以文本形式表示环境观测值，作为模型的输入。

observation_manager的ROS包：
传感器观测结果 --映射--> 表转化文本表示

### 2.3 Human non-expert interface

每个步骤都是在从接口中收到人类反馈后执行的，一旦执行结束（成功或失败），将请求人类输入新文本。（语音）

### 2.4 Prompt generation

- task description
- action library description
- human-feedback
- environment observation
- chain-of-thought and few-shot prompting

### 2.5 Behavior representation

behavior是atomic actions的组合 -> LLM生成Python/XML code来represent a behavior

- Python output
    - action library is a set of Python function
- JSON output
    - a behavior is an action sequence
    - each action is a ROS service(rosllm_srvs/AtomicAction)
- XML output
    - behavior tree
    - 行为树由定义特定动作或条件的节点组成，并以树状结构组织。在树的根节点，行为选择器节点决定评估和执行子节点的顺序
    - 子节点可以包括顺序节点、并行节点、条件节点、动作节点和装饰器节点

### 2.6 Updating the atomic action library via imitation learning

一种基于模仿学习的更新机制

1. 集成DMP（动态动作原语）至框架中

2. 非专家提供任务的演示以及文本描述时，框架会自动将此信息转化为ROS服务，并将其添加到Atomic Action库中。该演示是使用动力学教学或远程操作捕获的，从而使非专家可以指导机器人通过所需的行为。