---
title: PIL修改Django上传图片
layout: blog
categories: blog
tags: django
blogId: 32
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

网站中上传大尺寸图片，一般需要进行尺寸修改，格式转换等操作。

Python中可以使用Pillow进行处理。

views.py中处理上传图片(不做处理)：

<pre class="brush:python;toolbar:false">def upload(request):
    image = request.FILES['image']
    category = Service.objects.get(user=request.user)
    albumImage = AlbumImage()
    albumImage.image.save(image.name, image, save=False)
    albumImage.save()</pre>

PIL处理后照样保存在storage中

（PIL修改图片过程省略，可参考官方文档[http://pillow.readthedocs.org/en/latest/reference/Image.html#PIL.Image.format](http://pillow.readthedocs.org/en/latest/reference/Image.html#PIL.Image.format)）

<pre class="brush:python;toolbar:false"># -*- coding: utf-8 -*-
import os
import time
import random

IMAGE_FORMAT = "JPEG"

def random_file_name(name, format=None):
    #ext = os.path.splitext(name)[1]
    #new_name = time.strftime("%Y%m%d%H%M%S")
    #new_name = new_name + "_%d"%(random.randint(100,999))
    #name = new_name + ext
    if format == IMAGE_FORMAT:
        ext = ".jpg"
    else:
        ext = os.path.splitext(name)[1]
    name = "%s_%d%s"%(time.strftime("%Y%m%d%H%M%S"), random.randint(100,999), ext)
    return name

from PIL import Image
from django.core.files.base import ContentFile
from io import BytesIO

def resize_image_fit(imageField, file, image_w=None, image_h=None):
    '''
    resize the image file

    :type imageField: ImageField

    :type file: UploadedFile
    :param: the upload file from request.FILE['xx']

    :type image_w/image_h: int
    :param: the resize width/height of the file
    '''
    image = Image.open(file)
    w, h = image.size

    #png to jpeg
    if image.mode == "RGBA":
        bg = Image.new("RGB", image.size)
        bg.paste(image, image)
        image = bg

    #...处理部分省略...

    file_buffer = BytesIO()
    image.save(file_buffer, IMAGE_FORMAT)
    content = ContentFile(file_buffer.getvalue())
    name = random_file_name(file.name, IMAGE_FORMAT)#这是我对文件名的修改

    imageField.save(name, content, save=False)</pre>

大功告成，放到CentOS服务器，发现无法运行：

> decoder jpeg not available
> 
> encoder jpeg not available

jpeg图片处理没配置。安装如下：

> yum install libjpeg
> 
> yum install libjpeg-devel
> 
> yum install freetype
> 
> yum install freetype-devel

*注意，Pillow需要在以上配置后安装才行，已经安装，则先卸载。

> pip uninstall Pillow
> 
> pip install Pillow