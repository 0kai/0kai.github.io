---
title: Django 修改上传文件名字
layout: blog
categories: blog
tags: django
blogId: 28
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

在文件上传时，各种命名长短比较乱。笔者想用系统时间对于各个上传文件进行重命名。下面介绍两种方法，各有各的好处，仅供参考。

首先写一个自定义重命名函数

util/file.py

<pre class="brush:python;toolbar:false"># -*- coding: utf-8 -*-
import os
import time
import random

def random_file_name(name):
    ext = os.path.splitext(name)[1]
    new_name = time.strftime("%Y%m%d%H%M%S")
    new_name = new_name + "_%d"%(random.randint(100,999))
    name = new_name + ext
    return name</pre>

**方法一：**在views.py保存图片的时候做修改

<pre class="brush:python;toolbar:false">from util.file import random_file_name

def uploadImage(request):
    try:
        image = request.FILES['image']
        try:
            tImage = TImage()
            tImage.image.save(random_file_name(image.name), image, save=False)
            tImage.save()
        except:
            pass
    except:
        pass
    ...</pre>

缺点：每个上传的地方都需要调用，admin管理那里暂时不同意

**方法二：**修改storage，这样就是通用的方法了

storage.py

<pre class="brush:python;toolbar:false"># -*-coding:utf-8 -*-
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse
from django.conf import settings

from util.file import random_file_name

class FileStorage(FileSystemStorage):
    def __init__(self, location=settings.MEDIA_ROOT, base_url=settings.MEDIA_URL):
        #初始化
        super(FileStorage, self).__init__(location, base_url)

    #重写 _save方法        
    def _save(self, name, content):
        #调用父类方法
        return super(FileStorage, self)._save(random_file_name(name), content)</pre>

settings.py设置

<pre class="brush:python;toolbar:false">DEFAULT_FILE_STORAGE = "xxx.storage.FileStorage"</pre>

缺点：如果使用七牛、阿里OSS等云存储的storage，那么还需要对其storage分别修改，移植麻烦。