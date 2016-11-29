---
title: Django时区和时差问题
layout: blog
categories: blog
tags: python django
blogId: 19
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

刚在做一个当前时间与数据库存储时间比较的功能，结果总是出错。

发现原因是地区时差问题：

settings.py中

<pre class="brush:python;toolbar:false">TIME_ZONE = 'Asia/Shanghai'
USE_TZ = True</pre>

那么这样存在数据库中的时间会是UTC时间，比北京时间晚8个小时。

views.py中

<pre class="brush:python;toolbar:false">#我这里这个获取的确是系统时间，但是有人说应该是UTC时间
datetime.datetime.now()

#正确的获取UTC时间
datetime.datetime.utcnow()</pre>

时间的比较方法

*   由于设置了Time zone，所以不能从数据库时间还要格式化才能做比较

<pre class="brush:python;toolbar:false">db_table.time.replace(tzinfo=None)#但是这样获取的时UTC时间</pre>

*   时间的比较

> timedelta时间大小比较，参数：days,hours,minutes,seconds

<pre class="brush:python;toolbar:false">time_now = datetime.datetime.utcnow()
time_pre = telVerify.time.replace(tzinfo=None)
if time_now - time_pre < datetime.timedelta(minutes = 5):
    pass#时间差5分钟</pre>