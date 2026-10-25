---
format: md
id: k-aaa
title: "aaa"
description: "aaa"
tags:
  - Linux
status: active
slug: /knowledge/k-aaa
---
# aaa

리스타트 트리거

```bash
stage('Restart Service') {
    steps {
        echo "Restarting Application (${SERVICE_NAME}) on Server..."
        sh '''
        ssh -o StrictHostKeyChecking=no -i ${PEM_PATH} ${PROXY_USER}@${PROXY_IP} \
        "/usr/bin/sshpass -p '${OPERATION_PASSWORD}' ssh -o StrictHostKeyChecking=no -p 12321 ${OPERATION_USER}@${OPERATION_IP} 'nohup bash ${RESTART_SCRIPT} > /dev/null 2>&1 &'"
        '''
    }
}
```

서비스 트리거

```bash
stage('Restart Service') {
    steps {
        echo "Restarting Application (${SERVICE_NAME}) using Systemd..."
        sh '''
        ssh -o StrictHostKeyChecking=no -i ${PEM_PATH} ${PROXY_USER}@${PROXY_IP} \
        "/usr/bin/sshpass -p '${OPERATION_PASSWORD}' ssh -o StrictHostKeyChecking=no -p 12321 ${OPERATION_USER}@${OPERATION_IP} \
        'sudo systemctl restart ${SERVICE_NAME}.service > /dev/null 2>&1 &'"
        '''
    }
}
```
