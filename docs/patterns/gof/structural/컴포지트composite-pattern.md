---
format: md
id: pattern-컴포지트composite-pattern
title: "컴포지트(composite pattern)"
description: "컴포지트(composite pattern)"
tags:
  - GoF
  - Java
status: active
slug: /patterns/pattern-컴포지트composite-pattern
---
# 컴포지트(composite pattern)

리눅스 경로와 비슷한 패턴을 만드는 구조.

컴포지트 클래스생성

폴더와 파일이 상속받고.

슈퍼클래스로 이름을 올려줌.

폴더와 파일은 배열을줘서 여러개를 보관할수있게 만든다.

```java
package CodeTest.pattern.composite;

abstract public class Component {

	public Component(String name) {
	
	}
	
	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "Component [name=" + name + "]";
	}
}
```

```java
package CodeTest.pattern.composite;

public class File extends Component{
	public File(String name) {
		super(name);
		// TODO Auto-generated constructor stub
	}

	private Object data;

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	} 
	
}
```

```java
package CodeTest.pattern.composite;

import java.util.*;

public class Folder extends Component {

	public Folder(String name) {
		super(name);
	}
	List<Component> children = new ArrayList<>();
	
	public boolean addComponent(Component component) {
		return children.add(component);
	}
	public boolean removeComponent(Component component) {
		return children.remove(component);
	}
	public List<Component> getChildren() {
		return children;
	}
	
	
	
}
```

```java
package CodeTest.pattern.composite;

public class Main {

	public static void main(String[] args) {
	 Folder 
	 root = new Folder("root"), 
	 home = new Folder("home"), 
	 jang = new Folder("jang"), 
	 music = new Folder("music"), 
	 picture = new Folder("picture"), 
	 doc = new Folder("doc"), 
	 usr = new Folder("usr");
	 File 
	 track1 = new File("track1"), 
	 track2 = new File("track2"), 
	 pic1 = new File("pic1"), 
	 doc1 = new File("doc1"), 
	 java = new File("java");
	
	root.addComponent(home);
		home.addComponent(jang);
			jang.addComponent(music);
				music.addComponent(track1);
				music.addComponent(track2);
			jang.addComponent(picture);
				picture.addComponent(pic1);
			jang.addComponent(picture);
				doc.addComponent(doc1);
	
	root.addComponent(usr);
		usr.addComponent(java);
		
		show(root);
	}
	
	private static void show(Component component) {
		System.out.println(component.getClass().getName()+"|"+component.toString());
		if(component instanceof Folder) {
			for(Component c: ((Folder)component).getChildren()){
					show(c);
				}
			}
		}
	}
```
