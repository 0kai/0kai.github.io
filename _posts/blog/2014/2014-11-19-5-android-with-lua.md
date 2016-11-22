---
title: Android中使用脚本语言Lua
layout: blog
categories: blog
tags: android lua
blogId: 5
---

Lua脚本语言是一个很强大的轻量级脚本，嵌入在App中扩展开发很不错的。

### 1、Android与Lua的环境搭建

*   直接下载网上编好的库（.so和.jar）放到libs下。[下载地址](http://download.csdn.net/detail/hpccn/4584559)

### 2、Android中调用Lua

1) 初始化以及变量赋值方法

```
LuaState mLuaState;  
mLuaState = LuaStateFactory.newLuaState();  
mLuaState.openLibs();//加载库  
mLuaState.LdoString("x = 101");//执行一段lua语言，这就是对变量x赋值了  
LuaObject obj = mLuaState.getLuaObject("x"); // 取得参数，以LuaObject类返回到java中  
System.out.println("result: "  + obj.toString());
```

2) Android类调用lua并回调

Android调用Lua函数，同时把类作为参数传递过去，然后再Lua中回调类的函数

*   调用lua

```
mLuaState = LuaStateFactory.newLuaState();  
mLuaState.openLibs();  
mLuaState.LdoString(KKLua.loadAssetsString(mContext, "lua/swallow.lua"));//将lua转换为字符串  
mLuaState.getField(LuaState.LUA_GLOBALSINDEX, "luaUpdate");//获取lua中的function  
mLuaState.pushJavaObject(this);//传递参数  
mLuaState.call(1, 0);//一个参数, 0个返回值
```

*   回调接口

```
public void luaDraw(int imageId, int x, int y, int scale) {//注意也必须要是public, lua才能调用到  
    System.out.println("imageId, x, y, scale: " + imageId + ", " + x + ", " + y + ", " + scale);  
}
```

*   lua代码

```
function luaUpdate(luaCanvas)  
  luaCanvas:luaDraw(0, 1, 2, 1)  
end
```

### 3、luajava介绍（在LuaJava库里面包含的）

lua中是没有类的，luajava库中有个luajava可以创建java中的类，并调用。下面介绍几个方法

*   newInstance(className, ...)

说明：可以根据类名创建一个Java类，同时返回一个lua变量与Java类对应。这样在lua中就可以直接调用Java中的方法了。

```
obj = luajava.newInstance("java.lang.Object")  
-- obj is now a reference to the new object  
-- created and any of its methods can be accessed.  

-- this creates a string tokenizer to the "a,b,c,d"  
-- string using "," as the token separator.  
strTk = luajava.newInstance("java.util.StringTokenizer",   
    "a,b,c,d", ",")  
while strTk:hasMoreTokens() do  
    print(strTk:nextToken())  
end
```

*   bindClass(className)

说明：可以让lua中的变量对应一个Java的类（是类，不是实例），这样就可以用lua的这个变量创建实例以及调用静态类

```
sys = luajava.bindClass("java.lang.System")  
print ( sys:currentTimeMillis() )  

-- this prints the time returned by the function.
```

*   new(javaClass)

说明：这个就是在bindClass的基础上创建的

```
str = luajava.bindClass("java.lang.String")  
strInstance = luajava.new(str)
```

*   createProxy(interfaceNames, luaObject)

*   loadLib(className, methodName)

这两个方法目前还没用到，以后会用了再介绍