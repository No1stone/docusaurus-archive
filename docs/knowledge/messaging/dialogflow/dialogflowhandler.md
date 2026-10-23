---
format: md
id: k-dialogflowhandler
title: "DialogFlowHandler"
description: "DialogFlowHandler"
tags:
  - Git
  - GoF
  - HTTP
  - Java
  - Spring
status: active
slug: /knowledge/k-dialogflowhandler
---
# DialogFlowHandler

## 개요

DialogFlowHandler에 대한 메모입니다.

## 예제·코드

```java
import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.dialogflow.v2.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class GDFHandler {
private final String languageCode = "ko";
@Autowired
private GoogleCredentials gdfCredential;
public QueryResult detectIntentTexts(String message) {
    QueryResult queryResult = null;
    try {
        String projectId = ((ServiceAccountCredentials)gdfCredential).getProjectId();
        SessionsClient sessionsClient = createSessionClient();
        SessionName sessionName = SessionName.of(projectId, UUID.randomUUID().toString());

        // Set the text (hello) and language code (en-US) for the query
        TextInput.Builder textInput =
                TextInput.newBuilder().setText(message).setLanguageCode(languageCode);

        // Build the query with the TextInput
        QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();

        // Performs the detect intent request
        DetectIntentResponse response = sessionsClient.detectIntent(sessionName, queryInput);

        // Display the query result
        queryResult = response.getQueryResult();

        System.out.println("====================");
        System.out.format("Query Text: '%s'\\n", queryResult.getQueryText());
        System.out.format(
                "Detected Intent: %s (confidence: %f)\\n",
                queryResult.getIntent().getDisplayName(), queryResult.getIntentDetectionConfidence());
        System.out.format("Fulfillment Text: '%s'\\n", queryResult.getFulfillmentText());

    } catch (Exception ex) {
        ex.printStackTrace();
    }
    return queryResult;
}

private SessionsClient createSessionClient() throws IOException {
    // authentication refresh
    gdfCredential.refreshIfExpired();

    SessionsSettings.Builder settingsBuilder = SessionsSettings.newBuilder();
    SessionsSettings sessionsSettings = settingsBuilder.setCredentialsProvider(FixedCredentialsProvider.create(gdfCredential)).build();
    return SessionsClient.create(sessionsSettings);
}
}
```

<details>
<summary>참고 자료</summary>

- [https://github.com/googleapis/java-dialogflow/blob/master/samples/snippets/src/main/java/com/example/dialogflow/DetectIntentTexts.java](https://github.com/googleapis/java-dialogflow/blob/master/samples/snippets/src/main/java/com/example/dialogflow/DetectIntentTexts.java)
</details>
