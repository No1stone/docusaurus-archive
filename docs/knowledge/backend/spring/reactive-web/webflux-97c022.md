---
format: md
id: k-webflux-97c022
title: "Webflux"
description: "Webflux"
tags:
  - Java
  - Spring
status: active
slug: /knowledge/k-webflux-97c022
---
# Webflux

```java
@RestController
@Slf4j
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final Sinks.Many<Customer> sink;

    //A요청
    //B요청
    // 머지할수있는 스트림

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
        this.sink = Sinks.many().multicast().onBackpressureBuffer();
    }

    @GetMapping("/flux")
    public Flux<Integer> fluxtest() {
        return Flux.just(1, 2, 3, 4, 5).delayElements(Duration.ofSeconds(1)).log();
    }

    @GetMapping(value = "/fluxStream", produces = MediaType.APPLICATION_STREAM_JSON_VALUE)
    public Flux<Integer> fluxtestStream() {
        return Flux.just(1, 2, 3, 4, 5).delayElements(Duration.ofSeconds(1)).log();
    }

    @GetMapping(path = "/customer")
    public Flux<Customer> findAll() {
        return customerRepository.findAll().log();
    }

    @GetMapping("/customer/{id}")
    public Mono<Customer> findByid(@PathVariable Long id) {
        return customerRepository.findById(id).log();
    }

    //연결을 계속 유지시킴
    //find All sse
    @GetMapping(value = "/customer/sse", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<Customer>> findAllsse() {
        return
                sink.asFlux().map(c -> ServerSentEvent.builder(c).build());
    }

    @GetMapping("/customer1")
    public Mono<Customer> sace() {
        return customerRepository.save(new Customer("gildong", "hong")).doOnNext(c ->
                {
                    sink.tryEmitNext(c);
                }
        );
    }

}
```

```java
public interface CustomerRepository extends ReactiveCrudRepository<Customer, Long> {

    @Query("SELECT * FROM customer WHERE last_name = :lastname")
    Flux<Customer> findByLastName(String lastName);

}
```

```java
@Data
public class Customer {
    @Id
    private Long id;

    private final String firstName;

    private final String lastName;

}
```

```java
@Slf4j
@Configuration
public class DBInit {

    @Bean
    ConnectionFactoryInitializer initializer(ConnectionFactory connectionFactory) {
        ConnectionFactoryInitializer initializer = new ConnectionFactoryInitializer();
        initializer.setConnectionFactory(connectionFactory);
        initializer.setDatabasePopulator(new ResourceDatabasePopulator(new ClassPathResource("schema.sql")));

        return initializer;
    }

    @Bean
    public CommandLineRunner demo(CustomerRepository repository) {

        return (args) -> {
            // save a few customers
            repository.saveAll(Arrays.asList(new Customer("Jack", "Bauer"),
                            new Customer("Chloe", "O'Brian"),
                            new Customer("Kim", "Bauer"),
                            new Customer("David", "Palmer"),
                            new Customer("Michelle", "Dessler")))
                    .blockLast(Duration.ofSeconds(10));

            // fetch all customers
            log.info("Customers found with findAll():");
            log.info("-------------------------------");
            repository.findAll().doOnNext(customer -> {
                log.info(customer.toString());
            }).blockLast(Duration.ofSeconds(10));

            log.info("");

            // fetch an individual customer by ID
            repository.findById(1L).doOnNext(customer -> {
                log.info("Customer found with findById(1L):");
                log.info("--------------------------------");
                log.info(customer.toString());
                log.info("");
            }).block(Duration.ofSeconds(10));

            // fetch customers by last name
            log.info("Customer found with findByLastName('Bauer'):");
            log.info("--------------------------------------------");
            repository.findByLastName("Bauer").doOnNext(bauer -> {
                log.info(bauer.toString());
            }).blockLast(Duration.ofSeconds(10));;
            log.info("");
        };
    }
}
```

```yaml
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-r2dbc'
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
    compileOnly 'org.projectlombok:lombok'
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
    runtimeOnly 'com.h2database:h2'
    runtimeOnly 'io.r2dbc:r2dbc-h2'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'io.projectreactor:reactor-test'
}
```
