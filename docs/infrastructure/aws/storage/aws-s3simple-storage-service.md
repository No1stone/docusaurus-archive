---
format: md
id: k-aws-s3simple-storage-service
title: "Aws s3(simple storage service)"
description: "Aws s3(simple storage service)"
tags:
  - AWS
  - HTTP
status: active
slug: /knowledge/k-aws-s3simple-storage-service
---
# Aws s3(simple storage service)

## 개요

Aws s3(simple storage service)에 대한 메모입니다.

aws 파일저장시스템
S3 파일개념 4가지
Aws s3 용어
S3 Bach: Amazon S3 Management Console 작업
Aws S3 reference document
S3 standard: 자주쓰는 정보 저장
S3 standard -IA: 자주 쓰지 않는 데이터
S3 onezone-IA: 자주 쓰지 않는 데이터
S3 Glecier 아카이브 데이터(오래저장해야되는데이터)
S3 intelligent-tiering: 변경되거나 알수없는 엑세스패턴의 데이터 이동
S3 Flecier Deep Archive: 아카이브데이터
S3 on OutPosts : 온프레미스 데이터 저장기능

## 예제·코드

```
buckets: 최상위 디렉토리 객체 컨테이너 모든오브젝트를 버켓에 종속시킴
				 버킷은 Amazon S3에 저장된 객체에 대한 컨테이너입니다. 
			   모든 객체는 어떤 버킷에 포함됩니다. 
				 예를 들어 photos/puppy.jpg로 명명된 객체는 미국 서부(오레곤) 리전의 
				 awsexamplebucket1 버킷에 저장되며 
				 URL [https://awsexamplebucket1.s3.us-west-2.amazonaws.com/photos/puppy.jpg를](https://awsexamplebucket1.s3.us-west-2.amazonaws.com/photos/puppy.jpg%EB%A5%BC) 
				 사용하여 주소를 지정할 수 있습니다.

Object: 저장오브젝트
				객체는 객체 데이터와 메타데이터로 구성됩니다. 
				이 데이터 부분은 Amazon S3에서 볼 수 없습니다. 
				메타데이터는 객체를 설명하는 이름-값 페어의 집합입니다. 
				여기에는 마지막으로 수정한 날짜와 같은 몇 가지 기본 메타데이터 및 Content-Type 같은 
				표준 HTTP 메타데이터가 포함됩니다. 
				객체를 저장할 때 사용자 정의 메타데이터를 지정할 수도 있습니다.
				https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html

Keys: 버킷 內 고유 식별자
			**버킷 내 모든 객체는 정확히 하나의 키를 갖습니다.** 
			버킷, 키 및 버전 ID의 조합은 각 객체를 고유하게 식별합니다. 
			따라서 Amazon S3를 “버킷 + 키 + 버전”과 객체 자체 사이의 
			기본 데이터 맵으로 생각할 수 있습니다. Amazon S3 내 모든 객체는 
			웹 서비스 엔드포인트, 버킷 이름, 키, 그리고 선택 사항인 버전의 조합을 통해 
			고유하게 주소를 지정할 수 있습니다. 예를 들어, 
			https://doc.s3.amazonaws.com/2006-03-01/AmazonS3.wsdl이라는 URL에서 
			‘doc‘는 버킷의 이름이고 ‘2006-03-01/AmazonS3.wsdl‘은 키입니다.
			키생성시 피해야할 문자들
			https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
			
Regions: 저장된 리전
				 지연 시간 최적화, 비용 최소화, 규정 요구 사항 준수 등 다양한 필요에 따라 
				 리전을 선택할 수 있습니다. 
				 특정 리전에 저장된 객체는 사용자가 명시적으로 객체를 
				 다른 리전으로 전송하지 않는 한 해당 리전을 벗어나지 않습니다. 
				 예를 들어, 유럽(아일랜드) 리전에 저장된 객체는 유럽 밖으로 이동하지 않습니다.
				 계정에 대해 사용되는 AWS 리전 에서만 Amazon S3에 액세스하고 
				 해당 기능을 사용할 수 있습니다.
```

<details>
<summary>참고 자료</summary>

- [Amazon S3 기능 - 클라우드 객체 스토리지 - AWS](https://aws.amazon.com/ko/s3/features/?nc=sn&loc=2) — Amazon S3의 기능 오퍼링에 대해 알아보세요.
- [https://awsexamplebucket1.s3.us-west-2.amazonaws.com/photos/puppy.jpg를](https://awsexamplebucket1.s3.us-west-2.amazonaws.com/photos/puppy.jpg%EB%A5%BC)
- [Performing object operations in bulk with Batch Operations - Amazon Simple Storage Service](https://docs.aws.amazon.com/AmazonS3/latest/userguide/batch-ops.html) — Perform large-scale batch operations on Amazon S3 objects using S3 Batch Operations.
</details>
