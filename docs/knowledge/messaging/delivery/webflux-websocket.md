---
format: md
id: k-webflux-websocket
title: "WebFlux WebSocket"
description: "WebFlux WebSocket"
tags:
  - GoF
  - Java
  - Spring
status: active
slug: /knowledge/k-webflux-websocket
---
# WebFlux WebSocket

## 개요

WebFlux WebSocket에 대한 메모입니다.

@Configuration
Implements WebSocketHandler
Javascript

## 예제·코드

```java
//socket config
	@Bean
	public EchoHandler echoHandler() {
		return new EchoHandler();
	}
	//socket config
	@Bean
	public HandlerMapping handlerMapping() {
		Map<String, WebSocketHandler> map = new HashMap<>();
		map.put("/echo", echoHandler());
		SimpleUrlHandlerMapping mapping = new SimpleUrlHandlerMapping();
		mapping.setUrlMap(map);
		mapping.setOrder(Ordered.HIGHEST_PRECEDENCE);
		return mapping;
	}
	//socket config
	@Bean
	public WebSocketHandlerAdapter handlerAdapter() {
		return new WebSocketHandlerAdapter(webSocketService());
	}
	//socket config
	@Bean
	public WebSocketService webSocketService() {
		return new HandshakeWebSocketService(new ReactorNettyRequestUpgradeStrategy());
	}
```

```java
public class EchoHandler implements WebSocketHandler 
{
    @Override
    public Mono<Void> handle(WebSocketSession session) 
    {
        return session
                .send( session.receive()
                        .map(msg -> "RECEIVED ON SERVER :: " + msg.getPayloadAsText())
                        .map(session::textMessage) 
                    
                    );
    }
}
```

```jsx
var ws = null;
var url = "ws://localhost:8080/echo";
 
function setConnected(connected) 
{
    document.getElementById('connect').disabled = connected;
    document.getElementById('disconnect').disabled = !connected;
    document.getElementById('echo').disabled = !connected;
}
 
function connect() 
{
    ws = new WebSocket(url);
    ws.onopen = function() {
        setConnected(true);
        log('Info: Connection Established.');
    };
     
    ws.onmessage = function(event) {
        log(event.data);
    };
     
    ws.onclose = function(event) {
        setConnected(false);
        log('Info: Closing Connection.');
    };
}
 
function disconnect() 
{
    if (ws != null) {
        ws.close();
        ws = null;
    }
    setConnected(false);
}
 
function echo() 
{
    if (ws != null) 
    {
        var message = document.getElementById('message').value;
        log('Sent to server :: ' + message);
        ws.send(message);
    } else {
        alert('connection not established, please connect.');
    }
}
 
function log(message) 
{
    var console = document.getElementById('logging');
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(message));
    console.appendChild(p);
}
```

<details>
<summary>참고 자료</summary>

- [https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.10/semantic.min.css](https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.10/semantic.min.css)
</details>
