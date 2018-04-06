---
title: mongodb异常被关闭问题
layout: blog
categories: blog
tags: mongodb
blogId: 59
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

#### 问题
最近经常发现mongodb突然莫名其妙被关闭了

#### 分析
1. 怀疑守护进程问题，从nohup改成mongod --fork
2. mongodb启动的时候带上日志信息，--logpath
```bash
mongod --dbpath /root/mongodb/data --logpath=/root/mongodb/mongo2.log --fork
```
> 然而mongo日志里面并没有太多有用的信息，都是直接被干掉了

3. 系统日志
日志位置：/var/log/message
![image]({{media_path}}/mongodb-error.png)
定位到是内存不足，mongodb直接被系统杀掉了

4. 服务器内存8G，mongodb和java占用的内存都较大
```bash
# java启动时限制内存大小
-Xmx500m -Xms500
```