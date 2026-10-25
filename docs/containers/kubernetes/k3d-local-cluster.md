---
id: k3d-local-cluster
title: "k3d 로컬 Kubernetes 클러스터 구축기 — 노드 확장과 역할 분리"
description: "k3d로 5노드 클러스터를 구성하고 Worker 확장·role 라벨로 역할을 분리한 기록"
tags:
  - k3d
  - k3s
  - kubernetes
  - docker
  - homelab
status: active
sidebar_position: 2
---

# k3d 로컬 Kubernetes 클러스터 구축기 — 노드 확장과 역할 분리

개인 인프라를 운영하면서 AWS EC2의 부족한 컴퓨팅 리소스를 보완하기 위해 집에 있는 Ubuntu 노트북을 활용하고 있다.

노트북은 8코어 CPU와 32GB 메모리를 가지고 있어 개인 개발 및 인프라 실습용으로 충분한 자원을 제공한다.

처음에는 가상머신(VM)을 여러 개 생성해 Kubernetes 클러스터를 구성하는 방법도 고려했다.

하지만 VM마다 CPU와 메모리를 고정 할당하면 사용하지 않는 리소스가 발생할 수 있고, 운영체제도 각각 관리해야 한다.

그래서 Docker 컨테이너 기반으로 K3s 클러스터를 구성할 수 있는 **k3d**를 선택했다.

이번에는 k3d를 이용해 클러스터를 생성하고, 노드를 확장한 뒤 역할별로 라벨을 적용하는 과정을 정리했다.

## 1. k3d 클러스터 구성

초기 목표는 Control Plane 1개와 Worker Node 3개를 구성하는 것이었다.

```bash
k3d cluster create origemite-local \
  --servers 1 \
  --agents 3
```

각 옵션의 의미는 다음과 같다.

| 옵션 | 설명 |
|---|---|
| `origemite-local` | 생성할 클러스터 이름 |
| `--servers 1` | Control Plane 역할의 서버 노드 1개 |
| `--agents 3` | 워커 노드 3개 |

클러스터 생성 후 상태를 확인했다.

```bash
k3d cluster list
kubectl get nodes
```

클러스터에는 Control Plane 1개와 Worker Node 3개, 총 4개 노드가 생성되었다.

모든 노드가 `Ready` 상태라면 정상적으로 실행되고 있는 것이다.

![초기 클러스터 및 노드 생성 확인](/img/containers/k3d/k3d-1.png)

## 2. Worker Node 추가

운영 구조를 생각하다 보니 노드별 역할을 조금 더 세분화할 필요가 있었다.

처음에는 Worker Node 3개로 시작했지만, Proxy와 애플리케이션, 인프라성 리소스를 구분하기 위해 노드를 하나 더 추가하기로 했다.

k3d는 기존 클러스터에 노드를 추가할 수 있다.

```bash
k3d node create agent --cluster origemite-local
```

기존 파드가 자동으로 새 노드로 이동하는 것은 아니다.

새로 생성되는 파드부터 스케줄링 대상이 될 수 있으며, 기존 파드를 이동하려면 재스케줄링 등의 별도 작업이 필요하다.

![Worker Node 추가 후 상태](/img/containers/k3d/k3d-2.png)

그런데 새로 생성된 노드 이름이 마음에 들지 않았다.

기존 노드들은 `k3d-origemite-local-agent-0` 형태였지만, 추가한 노드는 `k3d-agent-0`으로 생성되었다.

기능적으로 문제가 있는 것은 아니지만, 노드 이름이 일관되지 않는 점이 아쉬웠다.

처음에는 노드를 삭제하는 방법을 확인했다.

```bash
k3d node delete k3d-agent-0
kubectl delete node k3d-agent-0
```

결국 개인 실습 환경이고 아직 운영 워크로드가 없었기 때문에 클러스터를 다시 생성하기로 했다.

## 3. 클러스터 재생성

기존 클러스터를 삭제했다.

```bash
k3d cluster delete origemite-local
```

이번에는 처음부터 Worker Node 4개를 지정했다.

```bash
k3d cluster create origemite-local \
  --servers 1 \
  --agents 4
```

최종 구성은 다음과 같다.

| 구분 | 개수 |
|---|---:|
| Control Plane | 1 |
| Worker Node | 4 |
| 합계 | 5 |

노드 상태를 확인했다.

```bash
kubectl get nodes
```

![클러스터 재생성 및 5개 노드 Ready 확인](/img/containers/k3d/k3d-3.png)

이제 모든 노드가 동일한 클러스터 이름을 기준으로 생성되었다.

단, 클러스터를 삭제하면 기존 클러스터 내부의 리소스도 사라질 수 있으므로 실제 운영 환경에서는 단순히 이름을 정리하기 위해 재생성하는 방식은 피해야 한다.

이번에는 초기 구축 단계였기 때문에 가능한 선택이었다.

## 4. 노드별 역할 설계

노드를 여러 개 만들었다고 해서 자동으로 역할이 구분되는 것은 아니다.

Kubernetes는 기본적으로 스케줄러가 사용 가능한 노드에 파드를 배치한다.

하지만 개인 인프라에서도 Proxy, 애플리케이션, 공통 인프라 리소스를 논리적으로 구분하고 싶었다.

그래서 다음과 같이 역할을 나눴다.

| 노드 | 라벨 | 목적 |
|---|---|---|
| agent-0 | `role=proxy` | 프록시 및 네트워크 관련 워크로드 |
| agent-1 | `role=app` | 애플리케이션 워크로드 |
| agent-2 | `role=app` | 애플리케이션 워크로드 |
| agent-3 | `role=resource` | Redis, Kafka 등 인프라성 워크로드 |
| server-0 | Control Plane | 클러스터 제어 |

여기서 중요한 점은 **실제 물리 서버가 5대인 것은 아니라는 것**이다.

모든 노드는 하나의 Ubuntu 노트북에서 실행되는 Docker 컨테이너이며, 물리적인 CPU와 메모리는 공유한다.

따라서 노드 분리는 물리적인 리소스 격리가 아니라 Kubernetes 워크로드 배치와 관리 편의를 위한 논리적인 구분이다.

## 5. Kubernetes Node Label 적용

노드에 역할을 구분하는 라벨을 적용했다.

```bash
kubectl label node k3d-origemite-local-agent-0 role=proxy --overwrite
kubectl label node k3d-origemite-local-agent-1 role=app --overwrite
kubectl label node k3d-origemite-local-agent-2 role=app --overwrite
kubectl label node k3d-origemite-local-agent-3 role=resource --overwrite
```

`--overwrite` 옵션을 사용하면 동일한 키의 라벨이 이미 존재하더라도 값을 변경할 수 있다.

라벨이 적용되었는지 확인한다.

```bash
kubectl get nodes -L role
```

![노드 라벨 적용 확인](/img/containers/k3d/k3d-4.png)

출력 결과에서 각 Worker Node의 역할이 구분되는 것을 확인할 수 있다.

```text
agent-0    role=proxy
agent-1    role=app
agent-2    role=app
agent-3    role=resource
```

이제 Kubernetes 리소스를 배포할 때 해당 라벨을 기준으로 노드를 선택할 수 있다.

예를 들어 Proxy 역할의 노드에 특정 애플리케이션을 배포하려면 다음과 같이 설정할 수 있다.

```yaml
spec:
  template:
    spec:
      nodeSelector:
        role: proxy
```

다만 라벨을 적용했다고 해서 기존 파드가 자동으로 이동하거나, 해당 노드에 다른 종류의 파드가 배치되지 않는 것은 아니다.

실제로 역할별 배치를 강제하려면 `nodeSelector`, Node Affinity, 필요에 따라 Taints와 Tolerations 등을 함께 설정해야 한다.

## 6. 최종 클러스터 확인

클러스터 전체 상태를 다시 확인했다.

```bash
k3d cluster list
kubectl get nodes
kubectl get nodes -L role
```

![최종 클러스터 상태 확인](/img/containers/k3d/k3d-5.png)

최종적으로 다음과 같은 구성을 완료했다.

```text
Ubuntu Notebook
8 Core / 32GB RAM
        │
        ▼
      Docker
        │
        ▼
   k3d / K3s Cluster
        │
        ├── server-0
        │    └── Control Plane
        │
        ├── agent-0
        │    └── role=proxy
        │
        ├── agent-1
        │    └── role=app
        │
        ├── agent-2
        │    └── role=app
        │
        └── agent-3
             └── role=resource
```

## 7. 정리

처음에는 단순히 Kubernetes 실습 환경을 구축하려고 시작했다.

하지만 실제로 클러스터를 생성하고 노드를 추가하다 보니, 운영 구조를 처음부터 정리하는 것이 더 중요하다는 생각이 들었다.

이번 작업에서 확인한 점은 다음과 같다.

- VM 없이 Docker 기반 Kubernetes 클러스터 구성
- Control Plane 1개와 Worker Node 4개 생성
- 클러스터 생성 이후 Worker Node 확장 가능
- 기존 파드는 새 노드로 자동 이동하지 않음
- Node Label을 통한 역할 구분
- 노드 이름과 클러스터 구성의 일관성 확보

물론 이 구조는 하나의 물리 장비 위에서 동작하기 때문에 물리 서버 장애에 대한 고가용성을 제공하지 않는다.

그 대신 개인 인프라 환경에서는 별도의 VM을 여러 개 관리하지 않고 Kubernetes 구조를 실습하고 운영할 수 있다는 장점이 있다.

## 8. 결론

최종적으로 Ubuntu 노트북에 k3d 기반 5노드 클러스터를 구성했다.

앞으로는 이 클러스터를 기반으로 Proxy, 애플리케이션, 인프라성 리소스를 구분해 배포하고, Helm과 ArgoCD 등을 연계하는 방향으로 확장할 계획이다.

AWS EC2는 외부 접속을 위한 Proxy 및 Bastion Host 역할을 유지하고, 실제 리소스를 많이 사용하는 서비스는 집에 있는 노트북에서 실행하는 구조다.

**AWS의 작은 인스턴스와 로컬 Kubernetes 클러스터를 연결해, 개인 인프라를 최소 비용으로 확장하는 것이 최종 목표다.**
