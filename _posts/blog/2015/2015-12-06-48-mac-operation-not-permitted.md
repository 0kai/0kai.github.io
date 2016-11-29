---
title: Mac ln命令Operation not permitted
layout: blog
categories: blog
tags: mac
blogId: 48
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

在很多情况下Mac安装配置，都需要把路径映射到/usr/bin目录下。

网上很多教程都是这样的，但是最近更新系统后，貌似都会报错：Operation not permitted。

另一个方式是：映射到/usr/local/bin

例如：

> <span style="font-family: Consolas, 'Courier New', Courier, mono, serif; font-size: 12px; line-height: 18px; background-color: rgb(255, 255, 255);">sudo ln -s /usr/local/mysql/bin/mysql /usr/local/bin</span>