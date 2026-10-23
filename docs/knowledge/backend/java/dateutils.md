---
format: md
id: k-dateutils
title: "DATEUtils"
description: "DATEUtils"
tags:
  - Java
status: active
slug: /knowledge/k-dateutils
---
# DATEUtils

```java
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtils {
private static Calendar cal = Calendar.getInstance();

/**
 * 지정된 날짜를 지정된 포맷형식으로 변환한다.
 * @param date
 * @param format
 * @return
 */
public static String dateToString(Date date,
								  String format) {

	SimpleDateFormat sf = new SimpleDateFormat(format);
	return sf.format(date);
}

/**
 * 현재 날짜를 지정된 포맷형식으로 변환한다.
 * @param format
 * @return
 */
public static String dateToString(String format) {

	return dateToString(new Date(), format);
}

/**
 * 문자열을 날짜로 변환한다
 * @param format
 * @param date
 * @return
 * @throws ParseException
 */
public static Date stringToDate(String format, String date) {

	String oldstring = date;
	Date dt = null;
	try {
		dt = new SimpleDateFormat(format).parse(oldstring);
	} catch (ParseException e) {
		e.printStackTrace();
	}
	return dt;

}

/**
 * 오늘의 요일 구하기
 * @return
 */
public static int getNowDayOfWeek()
{
	return cal.get(Calendar.DAY_OF_WEEK); // 1 ~ 7 => 일,월~금,토
}

/**
 * 현재시간 구하기
 * @param format
 * @return
 */
public static String now(String format)
{
	SimpleDateFormat fmt = new SimpleDateFormat(format);
	return fmt.format(cal.getTime());
}

/**
 * 현재 시간 구하기
 * @return
 */
public static Date now()
{
	return cal.getTime();
}
}
```
