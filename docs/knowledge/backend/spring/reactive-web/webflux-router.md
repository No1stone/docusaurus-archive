---
format: md
id: k-webflux-router
title: "WebFlux Router"
description: "WebFlux Router"
tags:
  - HTTP
  - Java
  - Spring
status: active
slug: /knowledge/k-webflux-router
---
# WebFlux Router

```java
// thymeleaf page lender
	@Bean
	public RouterFunction<ServerResponse> index() { // /요청에 대한 페이지 정의
		return RouterFunctions.route(RequestPredicates.GET("/").and(RequestPredicates.accept(MediaType.TEXT_HTML)),
				req -> ServerResponse.ok().render("index", new HashMap<Object, Object>()));
	}

	// thymeleaf page lender
	@Bean
	public RouterFunction<ServerResponse> firstpage() {
		return RouterFunctions.route(RequestPredicates.GET("/first").and(RequestPredicates.accept(MediaType.TEXT_HTML)),
				req -> ServerResponse.ok().render("firstpage", new HashMap<Object, Object>()));
	}

	//HandlerSetting
	@Bean
	public RouterFunction<ServerResponse> firstpage1(FirstHandler firstHandler) {
		return RouterFunctions
				.route(GET("/test1").and(accept(MediaType.APPLICATION_JSON)), firstHandler::test1);
	}
	//HandlerSetting
		@Bean
		public RouterFunction<ServerResponse> firstpage2(FirstHandler firstHandler) {
			return RouterFunctions
					.route(GET("/test2").and(accept(MediaType.APPLICATION_JSON)), firstHandler::test2);
		}
// HttpMethod type
	@Bean
	public RouterFunction<ServerResponse> firstpage3(FirstHandler fisrHandler) {
		return RouterFunctions.route()
				.GET("/test3", accept(MediaType.APPLICATION_JSON), fisrHandler::test3)
				.GET("/test3/{id}", accept(MediaType.APPLICATION_JSON), fisrHandler::test4)
				.POST("/test3", accept(MediaType.APPLICATION_JSON), fisrHandler::test5)
				.POST("/test3/{id}", accept(MediaType.APPLICATION_JSON), fisrHandler::test6)
				.build();
	}

	// Path HttpMethod type
	@Bean
	public RouterFunction<ServerResponse> firstpage4(FirstHandler fisrHandler) {
		return RouterFunctions.route().path("/test4", 
				builder -> builder 
				.GET("", accept(MediaType.APPLICATION_JSON), fisrHandler::test3)
				.GET("/{id}", accept(MediaType.APPLICATION_JSON), fisrHandler::test4)
				.POST("", accept(MediaType.APPLICATION_JSON), fisrHandler::test5)
				.POST("/{id}", accept(MediaType.APPLICATION_JSON), fisrHandler::test6)
				)
				.build();
	}

	// Path HttpMethod type
	@Bean
		public RouterFunction<ServerResponse> firstpage5(FirstHandler fisrHandler) {
			return RouterFunctions.route().path("/test5", 
					b1 -> b1
					.nest(accept(MediaType.APPLICATION_JSON), 
							b2 -> b2 
							.GET("", fisrHandler::test3)
							.GET("/{id}", fisrHandler::test4)
							.POST("", fisrHandler::test5)
							.POST("/{id}", fisrHandler::test6)
							)
					)
					.build();
		}

@Bean
	public RouterFunction<ServerResponse> routehello(FirstHandler handler) {
		return RouterFunctions
				.route(RequestPredicates.GET("/hello").and(RequestPredicates.accept(MediaType.TEXT_PLAIN)), arg -> {
					HashMap<Object, Object> result = new HashMap<Object, Object>();
					result.put("number", 1234);
					result.put("text", "webFlux");
					Mono<HashMap<Object, Object>> mapper = Mono.just(result);
					Mono<ServerResponse> response = ServerResponse.ok().contentType(MediaType.APPLICATION_JSON)
							.body(BodyInserters.fromProducer(mapper, HashMap.class));
					return response;
				});
	}

	@Bean
	public RouterFunction<ServerResponse> requestGetParam() {
		RequestPredicate predicate = RequestPredicates.GET("/request")
				.and(RequestPredicates.accept(MediaType.TEXT_PLAIN));
		// 1. Request + Predicate(요청 + ~이다) => 사용자의 요청 종류 및 형태

		// 2.웹플럭스에게 전달할 RouterFunction 클래스를 제작, 함수형태로 전달한다.
		RouterFunction<ServerResponse> response = RouterFunctions.route(predicate, (request) -> { // 3. 내부 람다식은
																									// HandlerFunction
																									// 인터페이스의 모양이다.
			System.out.println(request.queryParams());
			String justText = "get param";
			Mono<String> mapper = Mono.just(justText); // 4.Mono클래스를 통해서 전달할 내용을 만들고
			Mono<ServerResponse> res = ServerResponse.ok().contentType(MediaType.TEXT_PLAIN)
					.body(BodyInserters.fromProducer(mapper, String.class)); // 5. 어떤 형태로 전달할지 작성후
			return res; // 6.전달!
		});
		return response; // 7. 해당 함수를 웹플럭스에게 전달한다.
	}

	@Bean
	public RouterFunction<ServerResponse> requestPathAndParam() {
		System.out.println("METHOD START!!!!");
		final int number[] = { 10 };
		final RequestPredicate predicate = RequestPredicates.GET("/path/{name}")
				.and(RequestPredicates.accept(MediaType.TEXT_PLAIN));

		RouterFunction<ServerResponse> response = RouterFunctions.route(predicate, (request) -> {

			System.out.println(request.queryParams());
			System.out.println(request.pathVariables()); // path같은 것도 되는구나!

			String justText = "path and param";
			Mono<String> mapper = Mono.just(justText);
			Mono<ServerResponse> res = ServerResponse.ok().contentType(MediaType.TEXT_PLAIN)
					.body(BodyInserters.fromProducer(mapper, String.class));
			number[0] = number[0] + 1; // 출력하면 11이 계속 나오겠지??
			System.out.printf("number : %d\n", number[0]);
			return res;
		});
		System.out.println("METHOD END!!!!");
		return response;
	}

	// 파일 다운로드
	@Bean
	public RouterFunction<ServerResponse> fileDownload() {
		RequestPredicate predicate = RequestPredicates.GET("/file").and(RequestPredicates.accept(MediaType.TEXT_PLAIN));
		RouterFunction<ServerResponse> response = RouterFunctions.route(predicate, (request) -> {
			Resource resource = new FileSystemResource("c:/test.csv");
			Mono<Resource> mapper = Mono.just(resource); // Mono의 제네릭에 의해 다양한 클래스를 받을 수 있다.

			// 헤더라는 메소드와 바디라는 메소드는 이름만 봐도 어떠한 역할을 하는 지 알 것 같다.
			Mono<ServerResponse> res = ServerResponse.ok()
					.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"test.csv\"")
					.body(BodyInserters.fromProducer(mapper, Resource.class));
			return res;
		});
		return response;
	}

}
```
