---
title: iOS/Swift开发从零开始(2)--Xcode6.1使用
layout: blog
categories: blog
tags: iOS swift
blogId: 11
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

Xcode是IOS开发的IDE工具，storyboard这个功能很好用啊。（感觉IOS开发要比Android简单，不过别人都说IOS牛逼些![](http://img.baidu.com/hi/face/i_f04.gif)）

简单说一下Xcode的使用方法。

### 1、创建个工程

*   可以先创建个workspace: File->new->Workspace

*   创建工程: File->new->Project

*   IOS-Application选择single view application

*   一直往下点咯，这里语言选择Swift

*   可以Add到workspace中，方便管理

代码目录：

![]({{media_path}}/1.png)

*   cmd + R 跑模拟器，或者点左上角的 ![]({{media_path}}/2.png) 运行

### 2、简单介绍一下storyboard

*   点击Main.storyboard可以看到一个可视化的界面控制面板了。

*   我们将尺寸修改成iphone的，去掉use size classes

![]({{media_path}}/3.png)

*   整体视图，可以拖动右下角的组件到面板中，右上角就是各种属性

![]({{media_path}}/4.png)

*   点击button, 按住control移动鼠标可以多出个箭头指向另一个界面

*   点击button(或者其他组件), 按住control移动鼠标可以将组件移到代码中，声明或者action.(点击右上角的双圈可以打开代码)

### 3、API文档查看

关于代码，接口等，可以查看api文档咯。（本文不知所云，建议看看网上视频教学，看看几节别人怎么点就知道了。）

![](http://media.0kai.net/blog/xcode-6.png)