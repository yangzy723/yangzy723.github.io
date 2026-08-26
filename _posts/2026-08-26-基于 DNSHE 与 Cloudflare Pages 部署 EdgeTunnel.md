---
title: 基于 DNSHE 与 Cloudflare Pages 部署 EdgeTunnel
categories: [网络]
description: 使用 DNSHE、Cloudflare DNS、Pages、Workers KV 与 EdgeTunnel 构建 Serverless Edge Tunnel 的部署过程与系统架构。
---
本文记录如何使用 **DNSHE、Cloudflare DNS、Cloudflare Pages、Workers KV 与 EdgeTunnel** 搭建 Serverless Edge Tunnel，并说明域名、计算、存储和代理协议在系统中的职责。

与传统 VPS 方案不同，这套架构不需要维护公网服务器：客户端连接 Cloudflare 边缘网络，EdgeTunnel 在 Pages/Workers Runtime 中处理请求并建立出站连接。

> 为避免公开实际服务入口，本文统一使用 `<your-domain>`、`<project>.pages.dev` 等占位符。部署时请替换为自己的域名和项目名称。

---

## 1. 资源与参考资料

| 资源 | 用途 | 链接 |
| --- | --- | --- |
| DNSHE | 获取并管理可委派的域名 | [DNSHE](https://dnshe.com/) |
| Cloudflare | DNS、Pages、Workers、KV、TLS 与边缘网络 | [Cloudflare Dashboard](https://dash.cloudflare.com/) |
| EdgeTunnel | 本次部署使用的开源项目 | [cmliu/edgetunnel](https://github.com/cmliu/edgetunnel) |
| 零度博客教程 | 本次实际参考的图文教程 | [freedidi 教程](https://www.freedidi.com/23618.html) |
| Pages Direct Upload | Pages ZIP 上传方式 | [官方文档](https://developers.cloudflare.com/pages/get-started/direct-upload/) |
| Pages Bindings | Pages 与 KV 等资源的绑定方式 | [官方文档](https://developers.cloudflare.com/pages/functions/bindings/) |
| Pages Custom Domains | Pages 自定义域名配置 | [官方文档](https://developers.cloudflare.com/pages/configuration/custom-domains/) |
| Workers Limits | Workers 平台限制 | [官方文档](https://developers.cloudflare.com/workers/platform/limits/) |

---

## 2. 架构概览

系统可以分为控制面和数据面：

```text
                  Control Plane

DNSHE ── NS Delegation ──> Cloudflare DNS
                               │
                               ├── Custom Domain
                               ▼
                        Cloudflare Pages
                          │          │
                       ADMIN     KV Binding
                                     │
                                     ▼
                                Workers KV


                    Data Plane

Application
    │
    ▼
Proxy Client
    │  VLESS / WebSocket / TLS
    ▼
<your-domain>:443
    │
    ▼
Cloudflare Anycast Edge
    │
    ▼
EdgeTunnel Worker
    │  Outbound TCP
    ▼
Destination Server
```

各组件的职责如下：

- **DNSHE**：提供域名以及修改权威名称服务器的入口。
- **Cloudflare DNS**：接管该 Zone 的权威 DNS。
- **Cloudflare Edge**：提供公网入口、Anycast 网络与 TLS。
- **Cloudflare Pages/Workers**：运行 EdgeTunnel 的代理逻辑。
- **Workers KV**：保存跨请求、跨 Worker 实例的持久化配置。
- **VLESS、WebSocket 与 TLS**：分别承担代理协议、双向传输和链路保护。

控制面决定系统如何配置；数据面负责实际连接与流量转发。DNSHE 和 Cloudflare Dashboard 只参与控制，不位于持续的数据传输路径中。

---

## 3. 获取域名并委派 DNS

首先在 [DNSHE](https://dnshe.com/) 获取一个能够独立管理 DNS 的域名，例如 `<your-domain>`。新域名最初由 DNSHE 的权威 DNS 管理，名称服务器可能类似：

```text
ns1.dnshe.com
ns2.dnshe.com
```

进入 [Cloudflare Dashboard](https://dash.cloudflare.com/) 添加该域名。Cloudflare 会为 Zone 分配两台权威名称服务器，例如：

```text
xxxx.ns.cloudflare.com
yyyy.ns.cloudflare.com
```

回到 DNSHE，将原来的 Nameserver 替换为这两台 Cloudflare Nameserver。这个过程称为 **DNS Delegation**。完成后：

- 上级 DNS 会将该 Zone 的查询交给 Cloudflare；
- A、AAAA、CNAME 等具体记录应在 Cloudflare 中管理；
- NS 只指定“谁负责回答该 Zone 的 DNS 查询”，并不表示网站或代理服务器的地址。

等待 Cloudflare 显示 Zone 已激活后，再继续部署。

---

## 4. 创建并绑定 Workers KV

进入 Cloudflare：

```text
Storage & Databases
→ Workers KV
→ Create Namespace
```

创建一个 KV Namespace，例如 `DNSHE-KV`。此时无需手动添加 Key/Value，EdgeTunnel 会在运行时读取和写入配置。

随后进入 Pages 项目的绑定设置：

```text
Settings
→ Bindings
→ Add
→ KV Namespace
```

填写：

```text
Variable name: KV
KV namespace: DNSHE-KV
```

这里的两个名称职责不同：

- `DNSHE-KV` 是 Cloudflare 控制面中的实际 Namespace 名称，可以自行定义；
- `KV` 是程序访问资源时使用的 Binding Name，需要与 EdgeTunnel 的代码预期一致，即 `env.KV`。

Workers 是无状态的 Serverless Runtime，不能依赖某个实例的内存长期保存配置。KV 将配置与 Worker 生命周期分离，使管理后台写入的数据可以在后续请求和其他 Worker 实例中恢复。

添加或修改 Binding 后，需要重新部署 Pages。

---

## 5. 部署 EdgeTunnel 并配置 ADMIN

本次使用 [cmliu/edgetunnel](https://github.com/cmliu/edgetunnel)。按照项目说明和参考教程，获取适用于 Pages Direct Upload 的 `main.zip`。

进入：

```text
Cloudflare
→ Workers & Pages
→ Create
→ Pages
→ Upload assets
```

创建 Pages 项目并上传 `main.zip`。部署完成后，Cloudflare 会分配默认域名：

```text
https://<project>.pages.dev
```

先确认默认域名可以访问。这样可以把应用部署问题与自定义域名、DNS 或 TLS 问题分开排查。

然后在 Pages 的环境变量中添加：

```text
ADMIN = <strong-admin-password>
```

`ADMIN` 只用于 EdgeTunnel 管理后台认证，与 Cloudflare 或 DNSHE 的登录密码无关。程序通过 `env.ADMIN` 读取该变量。保存后重新部署，使环境变量进入生产 Deployment。

---

## 6. 配置自定义域名

进入：

```text
Pages
→ Custom Domains
→ Set up a custom domain
```

添加 `<your-domain>`。逻辑上，它会关联到 Pages 默认域名：

```text
<your-domain>
      │  Pages Custom Domain
      ▼
<project>.pages.dev
```

由于整个 DNS Zone 已托管在 Cloudflare，平台可以自动完成对应的 DNS 记录关联。等待 Custom Domain 和 TLS 证书状态正常后，应能够访问：

- 应用入口：`https://<your-domain>`
- 管理后台：`https://<your-domain>/admin`

如果自定义域名不可用而 `pages.dev` 正常，应优先检查 Nameserver 委派、Cloudflare DNS 记录、Custom Domain 状态和 TLS 初始化，而不是重新上传应用。

---

## 7. 数据路径与协议栈

假设应用需要访问 `example.com:443`，完整数据路径如下：

```text
Application
    │
    ▼
Proxy Client
    │  VLESS
    ▼
WebSocket
    │  over TLS
    ▼
Cloudflare Edge
    │
    ▼
EdgeTunnel Worker
    │  TCP connect()
    ▼
example.com:443
```

Worker 从代理请求中解析目标地址、目标端口和连接类型，建立 outbound TCP connection，并在客户端与目标服务器之间双向转发数据。返回流量沿相反方向传回应用。

三个协议位于不同层次：

| 组件 | 作用 |
| --- | --- |
| TLS | 加密客户端到 Cloudflare Edge 的通信，并提供完整性保护和服务器身份认证 |
| WebSocket | 在 HTTP/TLS 之上提供持续的全双工传输通道 |
| VLESS | 描述客户端身份、目标地址、目标端口、连接类型和 Payload |

可以将它们理解为：

```text
TLS
└── WebSocket
    └── VLESS
        └── Application Data
```

---

## 8. 这不是一台“免费 VPS”

Cloudflare 在这套系统中同时提供四种能力：

1. **DNS**：作为 `<your-domain>` 的权威 DNS Provider；
2. **Edge Network**：通过全球 Anycast 网络和 TLS 提供公网入口；
3. **Compute**：由 Pages/Workers Runtime 执行 EdgeTunnel；
4. **Storage**：由 Workers KV 保存持久化状态。

但用户并不会获得一台传统服务器，也没有专属公网 IP、固定 CPU、物理网卡或机房。更准确的描述是：这是一套组合 DNS、边缘网络、Serverless Compute 和持久化存储的 **Serverless Edge Application**。

DNS 只负责把客户端引导到正确入口。解析和连接建立完成后，实际数据路径是：

```text
Client → Cloudflare Edge → Worker → Destination
```

因此，这套方案也不能被理解为“免费无限流量 VPS”。实际性能取决于客户端 ISP、BGP 与 Peering、RTT、丢包、TCP 拥塞控制、Cloudflare Egress、目标服务器性能及平台限制。

使用前应阅读 [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/) 和 [Cloudflare Terms](https://www.cloudflare.com/terms/)，并遵守平台的服务条款与可接受使用政策。

---

## 9. 安全注意事项

公开部署记录时，不应上传或展示：

- `ADMIN` 密码；
- VLESS UUID；
- Subscription Token；
- 完整订阅 URL；
- 其他认证信息或实际服务入口。

订阅 URL 往往可以向客户端下发完整连接配置，应按照凭据保护。公开截图、日志和文章时，也应使用 `<your-domain>` 等占位符替代真实域名。

建议为 `ADMIN` 使用独立的高强度密码，不要复用 Cloudflare、DNSHE、GitHub 或其他账号密码。

---

## 10. 部署检查清单

按顺序确认以下状态：

1. 在 DNSHE 获取域名；
2. 将 Nameserver 委派给 Cloudflare；
3. 等待 Cloudflare Zone 激活；
4. 创建 Workers KV Namespace；
5. 获取 EdgeTunnel 的 Pages 部署包；
6. 上传 `main.zip` 并验证 `<project>.pages.dev`；
7. 设置 `ADMIN` 环境变量；
8. 以 `KV` 为 Binding Name 绑定 KV Namespace；
9. 重新部署 Pages；
10. 绑定 Custom Domain；
11. 等待 DNS 与 TLS 初始化完成；
12. 验证应用入口和管理后台。

最终系统由 DNS、Anycast Edge Network、Serverless Compute、Persistent KV Storage 与 Application-Level Proxy 共同组成。核心并不是寻找一台免费服务器，而是将名称解析、网络入口、计算和状态存储交给 Cloudflare 的不同服务，再由 EdgeTunnel 将它们组合成完整的 Serverless Edge Tunnel。
