---
format: md
id: k-uricomponent
title: "UriComponent"
description: "UriComponent"
tags:
  - HTTP
  - Java
  - Spring
status: active
slug: /knowledge/k-uricomponent
---
# UriComponent

```java
String accessToken = encryptData(userInfo);
		if (accessToken == null)
			return null;
		List<Report> reports = null;
		Gson gson = new Gson();
		reports = new ArrayList<>();
		final HttpHeaders headers = new HttpHeaders();
		headers.set("AuthToken", accessToken);
		UriComponentsBuilder builder = UriComponentsBuilder.newInstance()
				.scheme("http").host(mediopiaBaseUrl)
				.path("/Api.do").queryParam("cmd", "myReportInfos")
				.queryParam("listScale", 3)
				.queryParam("pageToken", pageToken);
		if (StringUtils.isEmpty(filter) == false) {
			builder.queryParam("filter", filter);
		}
		UriComponents uriComponents = builder.build();
		System.out.println(uriComponents.toString());
		
		HttpEntity<String> entity = new HttpEntity<>(headers);
		
		ResponseEntity<String> response = restTemplate.exchange(uriComponents.toUriString(), HttpMethod.GET, entity,
				String.class);

		//System.out.println(response.toString());
		
//        HttpEntity<String> httpRes = restTemplate.getForEntity(uriComponents.toUriString(), String.class);
		JSONObject obj = new JSONObject(response.getBody());
		JSONObject jsonObject = obj.getJSONObject("result");
		if (ObjectUtils.isEmpty(jsonObject))
			return null;
		if ("200".equals(jsonObject.getString("resultCd")) == false)
			return null;

		JSONArray array = jsonObject.getJSONArray("list");

		
		if (ObjectUtils.isEmpty(array) == false) {
			for (int i = 0; i < array.length(); i++) {
				Report report = gson.fromJson(array.get(i).toString(), Report.class);
				reports.add(report);
			}
		}
		
		
		return reports;
```
