---
format: md
id: pattern-방문자visitor-pattenr
title: "방문자(Visitor Pattenr)"
description: "방문자(Visitor Pattenr)"
tags:
  - GoF
  - Java
status: active
slug: /patterns/pattern-방문자visitor-pattenr
---
# 방문자(Visitor Pattenr)

공장에 복사할수있는 물체가있다고 하자.

방문자가 그복사할수 있는 물체를 복사해서 더할수있다.

공장인터페이스(비짓)

공장

방문자인터페이스(비짓에이블)사용자

방문자

공장은 사람이 다녀온걸 합한다.

어디에쓰는지...

아직정확하게는 이해못했으나 이런구조이다.

```java
package CodeTest.pattern.visitor;

import java.util.ArrayList;

public class Application {

	public static void main(String[] args) {

		VisitableA v1 = new VisitableA(1);
		
		ArrayList<Visitable> visitables = new ArrayList<Visitable>();
		
		visitables.add(new VisitableA(0));
		visitables.add(new VisitableA(1));
		visitables.add(new VisitableA(2));
		visitables.add(new VisitableA(3));
		visitables.add(new VisitableA(4));
		visitables.add(new VisitableA(5));
		
		Visitor visitor = new VisitorA();
	for(Visitable visitable :  visitables) {
		visitable.accept(visitor);
	}
	
	System.out.println(((VisitorA)visitor).getNumber());
	
		
	}
}
```

```java
package CodeTest.pattern.visitor;

public interface Visitable {
	public void accept(Visitor visitor);
}
```

```java
package CodeTest.pattern.visitor;

public class VisitableA implements Visitable {

	int numberOfMember;

	public VisitableA(int numberOfMember) {
		this.numberOfMember = numberOfMember;
	}

	@Override
	public void accept(Visitor visitor) {
		visitor.visit(this);
	}

	public int getNumberOfMember() {
		return numberOfMember;
	}

	public void setNumberOfMember(int numberOfMember) {
		this.numberOfMember = numberOfMember;
	}
	
	
}
```

```java
package CodeTest.pattern.visitor;

public interface Visitor {
	public void visit(Visitable visitable);
}
```

```java
package CodeTest.pattern.visitor;

public class VisitorA implements Visitor {

	private int number;
	
	
	
	public VisitorA() {
		this.number = 0;
	}
	
	@Override
	public void visit(Visitable visitable) {
		if(visitable instanceof VisitableA){
			number+=((VisitableA) visitable).numberOfMember;
		}else {
			//...
		}
	}
	
	public int getNumber() {
		return number;
	}
	
	public void setNumber(int number) {
		this.number = number;
	}
	
}
```
