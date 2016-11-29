---
title: Django使用oneToOne扩展User注意
layout: blog
categories: blog
tags: python django
blogId: 21
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

在Django1.7已经移除了user.get_profile()的方法了，官方建议使用oneToOneFiled作为关联。

官方给出了两个方法：

[https://docs.djangoproject.com/en/dev/topics/auth/customizing/](https://docs.djangoproject.com/en/dev/topics/auth/customizing/)

这里说明一下第一种。

```
from django.contrib.auth.models import Userclass Employee(models.Model):
    user = models.OneToOneField(User)
    department = models.CharField(max_length=100)
```

调用时：

```
>>> u = User.objects.get(username='fsmith')
>>> freds_department = u.employee.department
```

但是有一点要注意：如果这个employee不存在，那么就会报错说这个参数不存在。

> Assuming an existing Employee Fred Smith who has both a User and Employee model