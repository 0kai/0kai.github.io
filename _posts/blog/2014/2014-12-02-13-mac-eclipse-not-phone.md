---
title: 解决Mac10.10 Eclipse运行时无法识别手机
layout: blog
categories: blog
tags: android
blogId: 13
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

一段时间没使用Eclipse了，发现项目run的时候竟然无法检测到android手机了，但是在DDMS里面是能看到的。

不知道什么原因，也有可能是我安装了一个mac下的“android文件传输”（mac检测android usb的）。

找了两种方法，

*   方法一：

> 保持Deivce Chooser 对话框打开，然后在手机上，把debug调试的复选框，取消，再勾选一次，就能出现真机设

这种方法是有效，不过我再run一次就无效了。

*   方法二：

> 可以进入该项目的，Run Configurations设置界面，选择target，选择Launch on all compatible devices/AVDs。
> 
> 在下拉框选择Active Device. apply之后，每次run时，都会自动安装apk到真机。不用弹出chooser对话框。请看下图

![]({{media_path}}/1.png)

这种方法固然有效，不过呢，你要是还想跑模拟器，就要到这里再修改咯。（或者不能有多个设备同时连接）