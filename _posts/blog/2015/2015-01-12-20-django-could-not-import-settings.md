---
title: Django Could not import settings问题
layout: blog
categories: blog
tags: python django
blogId: 20
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

突然出现的问题：

```
ImportError: Could not import settings 'webconfig.settings' (Is it on sys.path? Is there an import error in the settings file?): No module named webconfig.settings
```

原因：我把web-config文件夹修改为webconfig，然后就蛋疼的问题来了。

然后就发现本地用manage.py runserver完全OK的，但是如果在服务器上是django-admin.py runserver就出现问题了。

如果是用django-admin.py runserver --settings='web-config.settings'这个旧的名字就OK，不过数据都不对。我猜测是在是有缓存之类的。

网上有说是路径问题，又说是权限问题，还是不知道怎么处理。

最后解决方案：

（尝试的过程，有先执行 sudo chmod -R 777 ./ ）

1、删掉webconfig文件夹，SVN提交到SAE；

2、备份的webconfig再添加进来，SVN提交到SAE；

3、然后就OK了。

手贱去修改了文件夹名字