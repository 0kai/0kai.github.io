---
title: iOS/Swift开发从零开始(3)--添加有米广告
layout: blog
categories: blog
tags: iOS swift
blogId: 12
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

本文知识点：

*   添加静态库文件.a

*   添加Framework和lib

*   Swift调用Object-C

### 1、下载有米插屏SDK

### 2、添加相关文件

*   将spotlib文件夹整个添加到工程代码中，.a静态文件会自动添加，不用处理

*   添加Framework

> storekit.framework
> 
> security.framework
> 
> cfnetwork.framework
> 
> systemconfiguration.framework
> 
> ImageIO.framework
> 
> libz.dylib
> 
> libsqlite3.dylib

步骤如下图：

![]({{media_path}}/1.png)

### 3、Swift调用Object-C

*   <span style="text-indent: 2em; font-size: 16px;">在项目中添加Project-Bridging-Header.h桥梁头文件</span>

*   在Bridging-Header.h里面添加有米的头文件ConfigHeader.h

*   然后就可以直接在swift中使用有米的类了

```
   //youmi init
    var appid = "xxx"
    var secretId = "xxxx"
    YouMiNewSpot.initYouMiDeveloperParams(appid, YM_SecretId: secretId)
    //使用前先初始化一下插屏
    YouMiNewSpot.initYouMiDeveLoperSpot(kSPOTSpotTypePortrait)//填上你对应的横竖屏模式

    //显示广告
    YouMiNewSpot.showYouMiSpotAction { (flag:Bool) -> Void in
        println(flag)
    }
```