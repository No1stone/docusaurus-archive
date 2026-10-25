---
id: k3d-namespace-ingress
title: "k3d Kubernetes 클러스터 — Namespace 분리와 NGINX Ingress Controller 구성"
description: "k3d 클러스터에 Namespace를 분리하고 NGINX Ingress Controller를 설치한 기록"
tags:
  - k3d
  - k3s
  - kubernetes
  - ingress-nginx
  - namespace
status: active
sidebar_position: 3
slug: "/containers/kubernetes/k3d-namespace-ingress"
---

# k3d Kubernetes 클러스터 — Namespace 분리와 NGINX Ingress Controller 구성

앞서 Ubuntu 노트북에 k3d 기반 Kubernetes 클러스터를 구성했다.

Control Plane 1개와 Worker Node 4개를 생성하고, 각 노드에 역할별 라벨을 적용했다.

이번에는 클러스터 내부의 리소스를 목적에 따라 분리하고, 외부에서 들어오는 HTTP 요청을 처리하기 위한 NGINX Ingress Controller를 설치했다.

최종적으로는 AWS EC2가 외부 Proxy 및 Bastion Host 역할을 담당하고, 집에 있는 Ubuntu 노트북의 Kubernetes 클러스터가 실제 애플리케이션을 실행하는 구조를 목표로 하고 있다.

## 1. 노드 역할 확인

기존에 생성한 Worker Node 4개에 다음과 같이 라벨을 적용했다.

```bash
kubectl label node k3d-origemite-local-agent-0 role=proxy --overwrite
kubectl label node k3d-origemite-local-agent-1 role=app --overwrite
kubectl label node k3d-origemite-local-agent-2 role=app --overwrite
kubectl label node k3d-origemite-local-agent-3 role=resource --overwrite
```

각 노드의 역할은 다음과 같다.

| 노드 | 라벨 | 용도 |
|---|---|---|
| agent-0 | `role=proxy` | NGINX Ingress 등 네트워크 진입점 |
| agent-1 | `role=app` | 애플리케이션 |
| agent-2 | `role=app` | 애플리케이션 |
| agent-3 | `role=resource` | Redis, Kafka 등 인프라성 리소스 |
| server-0 | Control Plane | 클러스터 제어 |

이렇게 라벨을 지정해 두면 추후 Deployment에 `nodeSelector` 또는 Node Affinity를 설정하여 원하는 노드에 파드를 배치할 수 있다.

다만 라벨 자체가 파드 배치를 강제하는 것은 아니다.

## 2. Namespace 디렉터리 구성

Kubernetes는 Namespace를 이용해 하나의 클러스터 안에서 리소스를 논리적으로 구분할 수 있다.

이번에는 다음 네 가지 영역으로 구분했다.

- `ingress-nginx`: 외부 트래픽 진입점
- `gateway`: Spring Cloud Gateway 등 API Gateway
- `app`: 비즈니스 애플리케이션
- `resource`: 공통 인프라 리소스

먼저 로컬 Kubernetes 설정 파일을 관리할 디렉터리를 생성했다.

```bash
mkdir namespaces ingress-nginx gateway app resource
```

생성 후 디렉터리 구조는 다음과 같다.

```text
k8s/
├── namespaces/
├── ingress-nginx/
├── gateway/
├── app/
└── resource/
```

![Kubernetes 설정 디렉터리 구성](/img/containers/k3d/k3s-1.png)

이렇게 분리하면 이후 Helm Chart나 Kubernetes Manifest를 기능별로 관리하기 편리하다.

## 3. Namespace Manifest 작성

Namespace는 명령어로 직접 생성할 수도 있지만, 설정을 파일로 관리하는 편이 재현성과 유지보수에 유리하다.

`k8s/namespaces/namespaces.yaml`

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ingress-nginx
---
apiVersion: v1
kind: Namespace
metadata:
  name: gateway
---
apiVersion: v1
kind: Namespace
metadata:
  name: app
---
apiVersion: v1
kind: Namespace
metadata:
  name: resource
```

작성한 Manifest를 적용한다.

```bash
kubectl apply -f namespaces/namespaces.yaml
```

실제 작업에서는 `namespaces` 디렉터리 안에서 다음 명령을 실행했다.

```bash
kubectl apply -f namespaces.yaml
```

결과:

```text
namespace/ingress-nginx configured
namespace/gateway created
namespace/app created
namespace/resource created
```

`ingress-nginx`는 앞선 설치 과정에서 이미 존재했기 때문에 `configured`로 표시되었고, 나머지 세 Namespace는 새로 생성되었다.

적용 결과를 확인한다.

```bash
kubectl get namespace
```

![Namespace 적용 및 Active 상태 확인](/img/containers/k3d/k3s-2.png)

`app`, `gateway`, `ingress-nginx`, `resource` 모두 `Active` 상태인 것을 확인했다.

## 4. NGINX Ingress Controller 설치

Kubernetes에서 Ingress는 외부 HTTP/HTTPS 요청을 클러스터 내부 Service로 전달하기 위한 라우팅 규칙이다.

Ingress 리소스만 생성한다고 트래픽이 처리되는 것은 아니며, 실제로 라우팅을 수행할 Ingress Controller가 필요하다.

이번에는 NGINX Ingress Controller를 설치했다.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.3/deploy/static/provider/cloud/deploy.yaml
```

해당 명령은 지정된 버전의 ingress-nginx 배포 Manifest를 적용한다.

설치 후 컨트롤러가 정상 실행되는지 확인했다.

```bash
kubectl get pods -n ingress-nginx -o wide
```

![NGINX Ingress Controller Pod 실행 상태](/img/containers/k3d/k3s-3.png)

스크린샷에서는 다음과 같은 상태를 확인할 수 있었다.

- `ingress-nginx-admission-create`: Completed
- `ingress-nginx-admission-patch`: Completed
- `ingress-nginx-controller`: Running
- Controller Ready: `1/1`

Admission 관련 Job은 설치 과정에서 실행된 뒤 완료되는 리소스이므로 `Completed`가 정상이다.

실제 HTTP 요청을 처리하는 컨트롤러 Pod는 `Running` 상태로 확인되었다.

## 5. Ingress Controller의 노드 배치 확인

`kubectl get pods -o wide` 명령을 사용하면 각 파드가 어느 노드에 배치되었는지 확인할 수 있다.

스크린샷 기준으로 NGINX Ingress Controller는 다음 노드에서 실행 중이었다.

```text
k3d-origemite-local-agent-0
```

앞서 `role=proxy` 라벨을 적용한 노드다.

즉, 의도했던 Proxy 역할의 노드에서 Ingress Controller가 실행되는 것을 확인했다.

다만 이번 배치 결과만으로 라벨에 따른 스케줄링이 강제되었다고 볼 수는 없다. 향후 재배포 시에도 같은 노드에 배치하려면 `nodeSelector` 등의 설정이 필요하다.

## 6. Ingress Service 확인

Controller Pod가 정상 실행되었다면 다음으로 Service를 확인한다.

```bash
kubectl get svc -n ingress-nginx
```

여기서는 Ingress Controller가 어떤 Service 유형으로 노출되는지 확인한다.

특히 k3d는 Docker 컨테이너 내부에 Kubernetes 노드가 생성되므로, Kubernetes Service가 존재한다고 해서 외부 네트워크에서 바로 접근할 수 있는 것은 아니다.

외부 접근을 위해서는 k3d 로드밸런서, Docker 포트 매핑, 또는 별도의 프록시 구성이 필요할 수 있다.

이번 구조에서는 AWS EC2 프록시와 로컬 Ubuntu 노트북을 Reverse SSH로 연결해 둔 상태이므로, 추후 해당 경로를 활용할 계획이다.

## 7. Ingress Node의 Docker IP 확인

k3d 노드는 Docker 컨테이너로 실행된다.

따라서 Docker 네트워크 내부 IP를 확인할 수 있다.

```bash
docker inspect k3d-origemite-local-agent-0 -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
```

이 명령으로 Proxy 역할을 하는 agent-0 컨테이너의 IP 주소를 확인할 수 있다.

단, Docker 내부 IP는 컨테이너를 재생성하거나 네트워크 구성이 변경되면 달라질 수 있다.

따라서 장기 운영에서는 IP를 직접 고정해서 사용하는 것보다 안정적인 서비스 접근 경로를 설계하는 것이 중요하다.

## 8. Gateway Namespace 확인

Ingress Controller 다음 단계는 내부 Gateway 서비스다.

Spring Cloud Gateway 등을 배포할 `gateway` Namespace를 생성했으므로, 다음 명령으로 상태를 확인할 수 있다.

```bash
kubectl get pods -n gateway
```

특정 Pod의 상세 상태를 확인하려면 `describe`를 사용한다.

```bash
kubectl describe pod -n gateway gateway-6c8cf9cc87-nktfn
```

이 명령으로 다음 정보를 확인할 수 있다.

- Pod가 배치된 노드
- 컨테이너 실행 상태
- 이미지 Pull 상태
- Readiness 및 Liveness Probe
- 스케줄링 및 실행 이벤트

이번에 제공한 스크린샷에는 Gateway Pod의 실행 결과가 포함되어 있지 않으므로, Gateway의 정상 실행 여부는 별도 검증이 필요하다.

## 9. 최종 구성

현재까지 구축한 구조를 정리하면 다음과 같다.

```text
Internet
   │
   ▼
AWS EC2
Proxy / Bastion Host
   │
   │ Reverse SSH
   ▼
Ubuntu Notebook
Docker + k3d
   │
   ├── Control Plane
   │
   ├── agent-0 [role=proxy]
   │      └── NGINX Ingress Controller
   │
   ├── agent-1 [role=app]
   │      └── Application
   │
   ├── agent-2 [role=app]
   │      └── Application
   │
   └── agent-3 [role=resource]
          └── Infrastructure Resources
```

Namespace는 다음과 같이 논리적으로 분리했다.

```text
Kubernetes Cluster
├── ingress-nginx
├── gateway
├── app
└── resource
```

여기서 Node와 Namespace는 서로 다른 개념이다.

Node는 파드가 실행되는 컴퓨팅 환경이고, Namespace는 Kubernetes 리소스를 논리적으로 구분하는 영역이다.

따라서 `gateway` Namespace의 파드도 별도의 스케줄링 조건이 없다면 어느 Worker Node에서든 실행될 수 있다.

## 10. 정리

이번 작업에서는 k3d 클러스터에 Namespace를 구성하고 NGINX Ingress Controller를 설치했다.

실제로 확인한 결과는 다음과 같다.

- 역할별 Worker Node 라벨 적용
- Kubernetes 설정 디렉터리 분리
- Namespace 4개 구성
- NGINX Ingress Controller 설치
- Ingress Controller Pod `Running` 확인
- Proxy 노드에서 Ingress Controller 실행 확인

아직 외부에서 Ingress를 거쳐 Gateway와 애플리케이션까지 연결되는 전체 경로를 검증한 단계는 아니다.

하지만 Kubernetes 내부의 네트워크 진입점을 구성했고, 이후 서비스 배포를 위한 기본 구조를 준비했다.

## 11. 다음 단계

다음 작업은 Spring Cloud Gateway를 배포하고 NGINX Ingress Controller와 연결하는 것이다.

목표 흐름은 다음과 같다.

```text
Client
  ↓
AWS EC2 Proxy
  ↓
Reverse SSH
  ↓
NGINX Ingress Controller
  ↓
Spring Cloud Gateway
  ↓
Application Service
```

이후 Helm 기반 배포와 ArgoCD를 연계하면 Git 기반으로 클러스터 구성을 관리하는 방향으로 확장할 수 있다.

개인 인프라에서 비용을 최소화하면서도 Kubernetes 기반 운영 구조를 직접 구현하는 것이 이번 작업의 목적이다.
