---
title: Django写系统初始化脚本
layout: blog
categories: blog
tags: django
blogId: 27
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

### 需求：

网站开发过程中，可能有需要初始化的数据，比如一些权限、管理员数据等等。如果可以用类似于python manage.py syncdb这样的命令一键执行就不错了。

### 方法

1、研究一下manage.py代码

<pre class="brush:python;toolbar:false">#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "webconfig.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)</pre>

*   用if __name__ == "__main__": 作为接口，如果直接写的话就再python编译的时候就被运行了

*   添加Django的setting配置

2、看看execute_from_command_line的内容

<pre class="brush:python;toolbar:false">def execute_from_command_line(argv=None):
    """
    A simple method that runs a ManagementUtility.
    """
    utility = ManagementUtility(argv)
    utility.execute()</pre>

*   注意到ManagementUtility调用execute()的时候会跑django.setup()，这样就能使用django里面的接口

*   获取argv，就是python manage.py syncdb的syncdb这个命令，这样就能写多样化的命令了

3、贡献我部分代码

<pre class="brush:python;toolbar:false"># web_init.py

#!/usr/bin/env python
import os
import sys
import django

def init_padmin():
    #init padmin
    from django.contrib.auth.models import User
    from django.contrib.auth.models import Permission
    from django.contrib.contenttypes.models import ContentType

    django.setup()
    content_type = ContentType.objects.get_for_model(User)
    permission = Permission.objects.create(codename='can_login_padmin', name='Can Login Padmin', content_type=content_type)

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "webconfig.settings")
    try:
        command = sys.argv[1]
        if command == "all":
            init_padmin()
        elif command == "padmin":
            init_padmin()
    except:
        print ""
        print "=======please input command======="
        print "all: init all"
        print "padmin: init the padmin system"
        print "=======      end help      ========"
        print ""</pre>

*   注意，import django.contrib.auth.models等需要在DJANGO_SETTINGS_MODULE配置之后才可以。

*   运行方式：python web_init.py all

*   我是初学者，对应python了解不深，欢迎探讨