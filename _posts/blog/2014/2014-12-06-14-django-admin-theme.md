---
title: Django之admin皮肤美化
layout: blog
categories: blog
tags: python django
blogId: 14
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

Django开发网页，很简单就能做一个后台管理，不过原生的那个太丑了。

作为一个小网站，当然没有必要自己去完全修改后台UI了，下面介绍几个admin优化插件。

1、Django Suit [地址](http://djangosuit.com)

我现在后台就用这个修改了，看起来很不错，而且还能很好的扩展，详情看官网吧。

看看我的效果：

![]({{media_path}}/1.png)

2、Grappelli [地址](http://grappelliproject.com/)

![]({{media_path}}/2.png)

3、django-admin-bootstrapped [地址](https://github.com/django-admin-bootstrapped/django-admin-bootstrapped)

![]({{media_path}}/3.png)

还有很多，待补充。。。