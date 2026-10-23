---
format: md
id: k-authtokeninterceptor
title: "AuthTokenInterceptor"
description: "AuthTokenInterceptor"
tags:
  - GoF
  - HTTP
  - Java
  - Spring
status: active
slug: /knowledge/k-authtokeninterceptor
---
# AuthTokenInterceptor

```java
import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.costlab.msgbot.common.ErrorStatus;
import com.costlab.msgbot.common.utils.AES256Util;
import com.costlab.msgbot.common.utils.DateUtils;

@Component
public class AuthTokenInterceptor extends HandlerInterceptorAdapter {
private static final Logger log = LoggerFactory.getLogger(AuthTokenInterceptor.class);

@Value("${service.encrypt.key}")
private String authKey;
@Value("${service.token.expire}")
private long expireTime;	//토큰 만료시간(초)

private AES256Util aes256;

@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
		throws Exception {

	if (request.getMethod().equals("OPTIONS")) {
		//CORS인증 유효 처리를 위해
		return true;
	}

	this.aes256 = new AES256Util(this.authKey);

	try {
		//axios에서 헤더명이 소문자로 변환되는 버그가 있음
		String headerName = "authToken".toLowerCase();
		String authToken = request.getHeader(headerName).trim();
		//String authToken = "pz9Xmyl//Mn58xiQW0MXJlC67V2LNMKX9aaTZYmBw5I=";

		if (StringUtils.isEmpty(authToken)) {
			errResponse(response, ErrorStatus.TOKEN_NOT_EXIST, HttpServletResponse.SC_OK);
			return false;
		}

		//토큰 복호화
		String decodedAuthToken = aes256.aesDecode(authToken);
		//인증토큰을 검증함, 사이트 코드 + ';' +  토큰 생성 시간(yyyyMMddHHmmss)
		String arrToken[] = decodedAuthToken.split(";");

		//토큰 오류
		if (arrToken.length <= 0 || StringUtils.isEmpty(arrToken[0]) || StringUtils.isEmpty(arrToken[1])) {
			errResponse(response, ErrorStatus.TOKEN_ERROR, HttpServletResponse.SC_OK);
			return false;
		}

		//토큰생성시간 검증
		Date now = new Date();
		Date tkDate = DateUtils.stringToDate("yyyyMMddHHmmss", arrToken[1]);
		long nElapseSeconds = (now.getTime() - tkDate.getTime()) / 1000;

		if ( nElapseSeconds > this.expireTime) {
			//토큰만료
			errResponse(response, ErrorStatus.TOKEN_EXPIRED, HttpServletResponse.SC_OK);
			return false;
		}
	} catch (Exception ex) {

		log.info("Token Exception ==> {}", ex.getClass());
		errResponse(response, ErrorStatus.TOKEN_ERROR, HttpServletResponse.SC_OK);

		return false;

	}

	return true;
}

@Override
public void afterConcurrentHandlingStarted(HttpServletRequest request, HttpServletResponse response, Object handler)
		throws Exception {
	super.afterConcurrentHandlingStarted(request, response, handler);
}

@SuppressWarnings("unchecked")
private void errResponse(HttpServletResponse response, ErrorStatus errStatus, int status) throws IOException {

	JSONObject resJSON = new JSONObject();
	resJSON.put("resultCode", errStatus.getErrCode());
	resJSON.put("resultMsg", errStatus.getErrMsg());

	response.reset();
	response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
	response.setStatus(status);
	response.setHeader("Access-Control-Allow-Origin", "*"); //이거 안넣으면 CORS에러남
	response.getWriter().write(resJSON.toJSONString());
	response.getWriter().flush();
	response.getWriter().close();
}
}
```
