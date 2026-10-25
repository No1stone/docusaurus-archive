---
format: md
id: k-stomp
title: "Stomp"
description: "Stomp"
tags:
  - AWS
  - HTTP
  - Java
  - PostgreSQL
  - Redis
  - Spring
status: active
slug: /knowledge/k-stomp
---
# Stomp

```yaml
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-redis'
    compile("org.springframework.boot:spring-boot-starter-websocket")
    compile("org.webjars:webjars-locator-core")
    compile("org.webjars:sockjs-client:1.0.2")
    compile("org.webjars:stomp-websocket:2.3.3")
    compile("org.webjars:bootstrap:3.3.7")
    compile("org.webjars.npm:jquery:3.6.0")
    implementation group: 'org.apache.httpcomponents', name: 'httpclient', version: '4.5.13'
    implementation group: 'org.bgee.log4jdbc-log4j2', name:'log4jdbc-log4j2-jdbc4.1', version: '1.16'

    compile group: 'org.postgresql', name: 'postgresql', version: '42.1.4'
    compile group: 'org.mybatis.spring.boot', name: 'mybatis-spring-boot-starter', version: '1.3.2'

    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    testCompile("org.springframework.boot:spring-boot-starter-test")
}

bootJar{
    archivesBaseName = 'sparwkProject'
    archiveFileName = 'sparwkProject.jar'
    archiveVersion = "1.0.0"
}

jib {
    from {
        image = "adoptopenjdk/openjdk11:alpine"
    }
    to {
        image = "867358377572.dkr.ecr.ap-northeast-2.amazonaws.com/demo_ecr"
        credHelper = 'ecr-login'
        tags = ['latest', "Sparwk-${project.name}-" + System.currentTimeMillis()]
    }
    container {
        creationTime = "USE_CURRENT_TIMESTAMP"
        // Set JVM options.
        jvmFlags = ['-Dspring.profiles.active=prod', '-XX:+UseContainerSupport', '-Dserver.port=8002', '-XX:+DisableExplicitGC', '-Dfile.encoding=UTF-8']
        // Expose different port.
        ports = ['8002']
        // Add labels.
        user = "nobody:nogroup"
    }
}
```

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/user", "/topic", "/queue");

        registry.setApplicationDestinationPrefixes("/app");
    }

    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/notification").setAllowedOriginPatterns("*").withSockJS();
    }
}
```

```java
@Service
public class NotificationService {
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private final SimpMessagingTemplate simpMessagingTemplate;   //1

    @Autowired
    private ProfileDao profileDao;

    @Autowired
    private CompanyDao companyDao;

    @Autowired
    private ProjectDao projectDao;

    public NotificationService(SimpMessagingTemplate simpMessagingTemplate){
        System.out.println("NotificationService 생성자 호출");
        this.simpMessagingTemplate = simpMessagingTemplate; //1
        //
    }

    public void sendToUser(Notification notification){
        simpMessagingTemplate.convertAndSendToUser(notification.getProfileId(), "/msg", notification);
    }

    public void sendToUser(SendNotification sendNotification){
        simpMessagingTemplate.convertAndSendToUser(sendNotification.getProfileId(), "/msg", sendNotification);
    }

    public void requestNotification(ReceiveNotification receiveNotification) {
        System.out.println(receiveNotification.toString());

        SendNotification result = null;

        switch (receiveNotification.getNotiCode()){
            case NotificationCodes.NOTI_002: //회사 로스트 승인
                processNoti002(receiveNotification);
                break;
            case NotificationCodes.NOTI_003: //회사 로스터 제외
                processNoti003(receiveNotification);
                break;
            case NotificationCodes.NOTI_005: //Mattermost 메시지 도착
                processNoti005(receiveNotification);
                break;
            case NotificationCodes.NOTI_001: //여권 인증
            case NotificationCodes.NOTI_004: //IPI Name Number 인증
            case NotificationCodes.NOTI_008: //신고
            case NotificationCodes.NOTI_010: //Account 인증(회사인증)
            case NotificationCodes.NOTI_011: //Account 인증(그룹인증)
                processNormalSystem(receiveNotification);
                break;
            case NotificationCodes.NOTI_012:
                processNoti012(receiveNotification);
        }

    }

    private void processNoti012(ReceiveNotification receiveNotification) {
        String projectId = receiveNotification.getData().get("project_id");
        Map<String, String> project = projectDao.getProjectInfo(projectId);
        Map<String, String> data = new HashMap<>();
        data.put("project_id", String.valueOf(project.get("proj_id")));
        data.put("project_name", String.valueOf(project.get("proj_title")));

        Map<String, String> profile = profileDao.getProfileInfo(receiveNotification.getNotiOwner());

        for (String profileId : receiveNotification.getToUsers()) {

            SendNotification sendNotification = SendNotification.builder()
                    .profileId(profileId)
                    .notiCode(receiveNotification.getNotiCode())
                    .notiOwner(receiveNotification.getNotiOwner())
                    .notiImg(profile.get("profile_img_url"))
                    .isView(false)
                    .regUTCTime(String.valueOf(Instant.now().getEpochSecond()))
                    .data(data)
                    .build();
            System.out.println(sendNotification);

            saveToDatabase(sendNotification);

            sendToUser(sendNotification);
        }
    }

    private void processNormalSystem(ReceiveNotification receiveNotification) {
        for (String profileId : receiveNotification.getToUsers()) {
            SendNotification sendNotification = SendNotification.builder()
                    .profileId(profileId)
                    .notiCode(receiveNotification.getNotiCode())
                    .notiOwner(NotificationCodes.NOTI_OWNER_SYSTEN)
                    .notiImg("-")
                    .isView(false)
                    .regUTCTime(String.valueOf(Instant.now().getEpochSecond()))
                    .build();
            System.out.println(sendNotification);

            saveToDatabase(sendNotification);

            sendToUser(sendNotification);
        }
    }

    private void processNoti005(ReceiveNotification receiveNotification) {
        for (String profileId : receiveNotification.getToUsers()) {
            Map<String, String> profile = profileDao.getProfileInfo(profileId);
            Map<String, String> data = new HashMap<>();
            data.put("mattermost_id", String.valueOf(profile.get("mattermost_id")));

            SendNotification sendNotification = SendNotification.builder()
                    .profileId(profileId)
                    .notiCode(receiveNotification.getNotiCode())
                    .notiOwner(NotificationCodes.NOTI_OWNER_SYSTEN)
                    .notiImg("-")
                    .isView(false)
                    .regUTCTime(String.valueOf(Instant.now().getEpochSecond()))
                    .data(data)
                    .build();
            System.out.println(sendNotification);

            saveToDatabase(sendNotification);

            sendToUser(sendNotification);
        }
    }

    private void processNoti003(ReceiveNotification receiveNotification) {
        Map<String, String> company = companyDao.getCompanyInfo(receiveNotification.getNotiOwner());

        for (String profileId : receiveNotification.getToUsers()) {
            Map<String, String> data = new HashMap<>();
            data.put("company_id", String.valueOf(company.get("profile_id")));
            data.put("company_name", company.get("profile_company_name"));
            SendNotification sendNotification = SendNotification.builder()
                    .profileId(profileId)
                    .notiCode(receiveNotification.getNotiCode())
                    .notiOwner(receiveNotification.getNotiOwner())
                    .notiImg(company.get("profile_img_url"))
                    .isView(false)
                    .regUTCTime(String.valueOf(Instant.now().getEpochSecond()))
                    .data(data)
                    .build();
            System.out.println(sendNotification);

            saveToDatabase(sendNotification);

            sendToUser(sendNotification);
        }
    }

    private void processNoti002(ReceiveNotification receiveNotification) {
        Map<String, String> company = companyDao.getCompanyInfo(receiveNotification.getNotiOwner());

        for (String profileId : receiveNotification.getToUsers()) {
            Map<String, String> data = new HashMap<>();
            data.put("company_id", String.valueOf(company.get("profile_id")));
            data.put("company_name", company.get("profile_company_name"));
            SendNotification sendNotification = SendNotification.builder()
                    .profileId(profileId)
                    .notiCode(receiveNotification.getNotiCode())
                    .notiOwner(receiveNotification.getNotiOwner())
                    .notiImg(company.get("profile_img_url"))
                    .isView(false)
                    .regUTCTime(String.valueOf(Instant.now().getEpochSecond()))
                    .data(data)
                    .build();
            System.out.println(sendNotification);

            saveToDatabase(sendNotification);

            sendToUser(sendNotification);
        }
    }

    private void saveToDatabase(SendNotification sendNotification){

    }
}
```
