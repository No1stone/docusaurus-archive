---
format: md
id: k-docker-create
title: "Docker Create"
description: "Docker Create"
tags:
  - AWS
  - Docker
  - Kubernetes
  - nginx
status: active
slug: /knowledge/k-docker-create
---
# Docker Create

— nginx docker file 

```bash
mkdir environment
cd ~/environment/

cat << EOF > Dockerfile
FROM nginx:latest
RUN  echo '<h1> test nginx web page </h1>'  >> index.html
RUN cp /index.html /usr/share/nginx/html
EOF
```

—build

```bash
docker build -t test-image .

docker images

docker run -p 8080:80 --name test-nginx test-image

docker ps

docker logs -f test-nginx

docker exec -it test-nginx /bin/bash

docker stop test-nginx

docker rm test-nginx

docker rmi test-image
```
