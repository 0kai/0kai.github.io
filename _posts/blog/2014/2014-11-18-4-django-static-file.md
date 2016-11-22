---
title: Django静态文件迁移
layout: blog
categories: blog
tags: python django
blogId: 4
---

BAE/SAE的代码上传貌似都有限制（如100M），如果静态文件（图片、大文件等）都直接放置在代码里面，那么就不够了。最好能放置在云存储中，或者其他云控件吧。

*   静态文件路径可以在settings.py里面配置

STATIC_URL = '/static/'

MEDIA_URL = '/media/'

*   需要在views中传入context_instance=RequestContext(request)

*   然后可以在模版中是调用{{STATIC_URL}} {{MEDIA_URL}}

这样当静态文件需要迁移的时候，直接修改settings.py里面的配置就可以了。

![](http://img.baidu.com/hi/face/i_f15.gif)问题来了：如果博客文章中使用到的图片怎么办？

1、直接使用{{MEDIA_URL}}作为路径， X 不行

2、自定义tag然后替换文章中的路径，然后显示出来（没尝试过）

3、暴力、直接用sql语句修改数据库里面文章里面的路径

```
SET SQL_SAFE_UPDATES=0; -- 数据库safe问题
UPDATE `mydb`.`blog_article` set content=replace(content,'<img src=\"/meida_url/','<img src=\"http://img.xx.com/media_url');
```

以上，如果有更好的方法，欢迎讨论。