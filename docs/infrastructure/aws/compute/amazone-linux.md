---
format: md
id: k-amazone-linux
title: "amazone linux"
description: "amazone linux"
tags:
  - AWS
  - HTTP
  - Java
  - Linux
status: active
slug: /knowledge/k-amazone-linux
---
# amazone linux

## 개요

amazone linux에 대한 메모입니다.

java -version
sudo yum list | grep jdk
sudo yum install java-1.8.0-openjdk.x86_64
java -version
javac -version
sudo yum install java-1.8.0-openjdk-devel.x86_64
vi /etc/profile
밑에 작성 root모드로해야함
vi /etc/profile
JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.282.b08-0.el7_7.x86_64
CATALINA_HOME=/usr/local/tomcat8.5
CLASSPATH=.:$JAVA_HOME/lib/tools.jar:$CATALINA_HOME/lib/jsp-api.jar:$CATALINA_HOME/lib/servlet-api.jar

![amazone-linux-1.png](/img/amazone-linux/amazone-linux-1.png)
![amazone-linux-2.png](/img/amazone-linux/amazone-linux-2.png)
![amazone-linux-3.png](/img/amazone-linux/amazone-linux-3.png)
![amazone-linux-4.png](/img/amazone-linux/amazone-linux-4.png)
![amazone-linux-5.png](/img/amazone-linux/amazone-linux-5.png)
![amazone-linux-6.png](/img/amazone-linux/amazone-linux-6.png)
![amazone-linux-7.png](/img/amazone-linux/amazone-linux-7.png)
![amazone-linux-8.png](/img/amazone-linux/amazone-linux-8.png)
![amazone-linux-9.png](/img/amazone-linux/amazone-linux-9.png)
![amazone-linux-10.png](/img/amazone-linux/amazone-linux-10.png)
![amazone-linux-11.png](/img/amazone-linux/amazone-linux-11.png)
![amazone-linux-12.png](/img/amazone-linux/amazone-linux-12.png)
![amazone-linux-13.png](/img/amazone-linux/amazone-linux-13.png)
![amazone-linux-14.png](/img/amazone-linux/amazone-linux-14.png)

## 예제·코드

```
$ sudo yum install tomcat
$ sudo yum install tomcat-admin-webapps
$ sudo yum install tomcat-webapps
$ sudo yum install tomcat-docs-webapp
```

```
// Tomcat 시작
$ sudo service tomcat start

// Tomcat 종료
$ sudo service tomcat stop

// Tomcat 재시작
$ sudo service tomcat restart
```

```
80포트사용

tomcat 서버를 80 포트로 설정하더라도 외부에서는 80 포트로 접속할 수 없다.

AWS EC2의 경우 유저 권한의 프로세스가 80 포트를 사용하는 것을 제한하기 때문이다.

80 포트로 들어오는 패킷을 tomcat 서버의 8080 포트로 리다이렉션 시켜주면 된다.

# iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080

# service iptables save
http://progtrend.blogspot.com/2018/06/aws-amazon-linux-2-jdk-tomcat.html
```

<details>
<summary>참고 자료</summary>

- [(AWS) Amazon Linux 2에 JDK & Tomcat 설치하기 ~ My Programming Trend Report](http://progtrend.blogspot.com/2018/06/aws-amazon-linux-2-jdk-tomcat.html) — Amazon Linux 2에 JDK & Tomcat 설치하기
- [https://yhmane.tistory.com/24?category=773048](https://yhmane.tistory.com/24?category=773048)
</details>
