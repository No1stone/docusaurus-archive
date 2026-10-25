---
format: md
id: k-r2dbcservice
title: "R2dbcService"
description: "R2dbcService"
tags:
  - GoF
  - Java
  - Spring
status: active
slug: /knowledge/k-r2dbcservice
---
# R2dbcService

```java
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.relational.core.query.CriteriaDefinition;
import org.springframework.data.relational.core.query.Query;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Service;

import com.example.client.entity.AccountInfoEntity;

import io.r2dbc.spi.ConnectionFactory;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class TestService {
	private final Logger logger = LoggerFactory.getLogger(TestService.class);
	private final ConnectionFactory connectionFactory;
	private final R2dbcEntityTemplate r2dbcEntityTemplate;
	private final DatabaseClient databaseClient;
//	public TestService(ConnectionFactory connectionFactory,R2dbcEntityTemplate r2dbcEntityTemplate){
//		this.connectionFactory = connectionFactory;
//		this.r2dbcEntityTemplate = r2dbcEntityTemplate;
//	}
	
	//입력
	public <T> Mono<T> InsertService(T entity) {
		return r2dbcEntityTemplate.insert(entity);
	}
	//업데이트
	public <T> Mono<T> UpdateService(T entity) {
		return r2dbcEntityTemplate.update(entity);
	}
	//삭제
	public <T> Mono<T> DeleteService(T entity) {
		return r2dbcEntityTemplate.delete(entity);
	}
	//전체검색
	public <T> Flux<T> SelectService(Class<T> entity) {
		return r2dbcEntityTemplate.select(entity).all();
	}
	//uniqueKey 검색
	public <T> Mono<T> SelectOneService(Class<T> entity, String select) {
		Field[] getFieldList = entity.getDeclaredFields();
		List<String> columnValue = new ArrayList();
		for(Field f : getFieldList) {
			columnValue.add(f.getAnnotation(Column.class).value());
		}
		logger.info("columnValue - {}",columnValue);
		return r2dbcEntityTemplate.selectOne(
				Query.query(CriteriaDefinition.from(
						Criteria.where(columnValue.get(0)).is(select))) ,entity);
	}
	//pk,fk 검색했을경우 리스트일때
	public <T> Flux<T> SelectIdListService(Class<T> entity, String select) {
		Field[] getFieldList = entity.getDeclaredFields();
		List<String> columnValue = new ArrayList();
		for(Field f : getFieldList) {
			columnValue.add(f.getAnnotation(Column.class).value());
		}
		logger.info("columnValue - {}",columnValue);
		return r2dbcEntityTemplate.select(
				Query.query(CriteriaDefinition.from(
						Criteria.where(columnValue.get(0)).is(select))) ,entity);
	}

//Native Query Style
public Mono<Map<String, Object>> AccountInfoEntitySelectOneService(String accountId) {
		return databaseClient
				.sql("SELECT " 
						+ "account_id, " 
						+ "account_email, " 
						+ "account_password, " 
						+ "account_role_type, "
						+ "access_token, " 
						+ "access_token_create_dtm, " 
						+ "refresh_token, "
						+ "refresh_token_create_dtm, " 
						+ "join_timestamp, " 
						+ "use_yn, " 
						+ "is_business_yn, "
						+ "business_type_yn " 
						+ "FROM ui_test_account_info " 
						+ "WHERE account_id = :accountId")
				.bind("accountId", accountId).fetch().first();
	}
public Mono<Integer> AccountInfoEntityInsertService(AccountInfoEntity aie) {
		//LocalDateTime aa = LocalDateTime.now();
		//logger.info(" - {}", aa);
		//aie.setJoinTimestamp(aa);
		return databaseClient
				.sql("INSERT INTO ui_test_account_info" 
						+ " (" 
						+ "account_id, " 
						+ "account_email, "
						+ "account_password, " 
						+ "account_role_type, " 
						+ "access_token, " 
						+ "access_token_create_dtm, "
						+ "refresh_token, " 
						+ "refresh_token_create_dtm, " 
						+ "join_timestamp, " 
						+ "use_yn, "
						+ "is_business_yn, " 
						+ "business_type_yn)" 
						+ "	VALUES (" 
						+ ":accountId, " 
						+ ":accountEmail, "
						+ ":accountPassword, " 
						+ ":accountRoleType, " 
						+ ":accessToken, " 
						+ ":accessTokenCreateDtm, "
						+ ":refreshToken, " 
						+ ":refreshTokenCreateDtm, " 
						+ ":joinTimestamp, " 
						+ ":useYn, "
						+ ":isBusinessYn, " 
						+ ":businessTypeYn)")
				.filter(s -> s.returnGeneratedValues("account_id")
//						.add().bindNull("accountEmail", String.class)
//						.add().bindNull("accountPassword", String.class)
//						.add().bindNull("accountRoleType", String.class)
//						.add().bindNull("accessToken", String.class)
//						.add().bindNull("refreshToken", String.class)
//						.add().bindNull("useYn", String.class)
//						.add().bindNull("isBusinessYn", String.class)
//						.add().bindNull("businessTypeYn", String.class)
				)
				.bind("accountId",  aie.getAccountId())
				.bind("accountEmail", aie.getAccountEmail())
				.bind("accountPassword", aie.getAccountPassword())
				.bind("accountRoleType", aie.getAccountRoleType())
				.bind("accessToken", aie.getAccessToken())
				//.bind("accessTokenCreateDtm", aie.getAccessTokenCreateDtm())
				.bind("refreshToken", aie.getRefreshToken())
				.bind("refreshTokenCreateDtm", aie.getRefreshTokenCreateDtm())
				//.bind("joinTimestamp", aa)
				.bind("joinTimestamp", aie.getJoinTimestamp())
				.bind("useYn", aie.getUseYn())
				.bind("isBusinessYn", aie.getIsBusinessYn())
				.bind("businessTypeYn", aie.getBusinessTypeYn()).fetch()
				.rowsUpdated();
	}
public Mono<Integer> AccountInfoEntityUpdateService(String accountId, AccountInfoEntity aie) {
		return databaseClient.sql("UPDATE ui_test_account_info "
				+ "SET "
				+ "account_email = :accountEmail, "
				+ "account_password = :accountPassword, "
				+ "account_role_type = :accountRoleType, "
				+ "access_token = :accessToken, "
				+ "access_token_create_dtm = :accessTokenCreateDtm, "
				+ "refresh_token= :refreshToken, "
				+ "refresh_token_create_dtm= :refreshTokenCreateDtm , "
				//+ "join_timestamp= :joinTimestamp, "
				+ "use_yn= :useYn, "
				+ "is_business_yn= :isBusinessYn, "
				+ "business_type_yn= :businessTypeYn "
				+ "WHERE "
				+ "account_id = :accountId")
				.filter(s -> s.returnGeneratedValues("account_id")
//						.add().bindNull("account_email", String.class)
//						.add().bindNull("account_password", String.class)
//						.add().bindNull("account_role_type", String.class)
//						.add().bindNull("access_token", String.class)
//						.add().bindNull("refresh_token", String.class)
//						.add().bindNull("use_yn", String.class)
//						.add().bindNull("is_business_yn", String.class)
//						.add().bindNull("business_type_yn", String.class)
						)
				.bind("accountId", aie.getAccountId())
				.bind("accountEmail", aie.getAccountEmail())
	            .bind("accountPassword", aie.getAccountPassword())
	            .bind("accountRoleType", aie.getAccountRoleType())
	            .bind("accessToken", aie.getAccessToken())
	            .bind("accessTokenCreateDtm", aie.getAccessTokenCreateDtm())
	            .bind("refreshToken", aie.getRefreshToken())
	            .bind("refreshTokenCreateDtm", aie.getRefreshTokenCreateDtm())
	            //.bind("joinTimestamp", aie.getJoinTimestamp())
	            .bind("useYn", aie.getUseYn())
	            .bind("isBusinessYn", aie.getIsBusinessYn())
	            .bind("businessTypeYn", aie.getBusinessTypeYn())
	            .fetch().rowsUpdated();
	}
public Mono<Integer> AccountInfoEntityDeleteService(String accountId) {
		return databaseClient.sql("DELETE FROM ui_test_account_info "
				+ "WHERE "
				+ "account_id = :accountId")
				.bind("accountId", accountId)
	            .fetch().rowsUpdated();
	}
}
```
