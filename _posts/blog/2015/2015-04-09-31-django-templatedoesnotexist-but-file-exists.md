---
title: Django Templatedoesnotexist, but file exists
layout: blog
categories: blog
tags: django
blogId: 31
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

Template是django中很方便的工具，今天突然发现原先有个模板无法找到了。错误如下：

![]({{media_path}}/1.png)

可以看到，明明是File exists，但是却报了TemplateDoesNoExit。

有几个点要考虑：

1、该文件是否有权限读取，确认跟其他文件相同；

2、检查文件内容，发现有个extends的template名字写错了，改后就正常了。⊙﹏⊙b汗