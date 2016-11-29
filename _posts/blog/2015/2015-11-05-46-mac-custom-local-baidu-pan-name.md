---
title: Mac下自定义百度云同步盘名称方法
layout: blog
categories: blog
tags: other
blogId: 46
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}
百度云同步盘在Mac下竟然不能重命名，对于开发过程中一些命令用法就比较麻烦了。

好不容易找到一个方法，分享一下：

> <span style="color: rgb(51, 51, 51); font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 24px; background-color: rgb(255, 255, 255);">把百度云程序关掉之后，进入</span>
> <span style="color: rgb(51, 51, 51); font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 24px; background-color: rgb(255, 255, 255);">/Users/自己的用户名/Library/Application Support/百度云同步盘/6db082a4ea07b8aba9759a4700efcfa3/</span>
> <span style="color: rgb(51, 51, 51); font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 24px; background-color: rgb(255, 255, 255);">把macosnetdisk.plist中倒数第三行的<string>/....../....../百度云同步盘</string>中的汉字改成你想要的英文名即可。</span>