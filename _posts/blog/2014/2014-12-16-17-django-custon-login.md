---
title: Django自定义登录方法
layout: blog
categories: blog
tags: python django
blogId: 17
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

Django有一个完善的登录系统，session处理机制。我们直接使用这个登录系统，还是比较方便的。本文就说说在admin之外的登录方法。

### 1、用户名、邮箱、电话号码等方式登录

首先自定义一个LoginBackend，判断Username就可以了（这里电话号码被我占时屏蔽了）

<pre class="brush:python;toolbar:false"># -*- coding: utf-8 -*-
import re
from django.contrib.auth.models import User

class LoginBackend(object):
    def authenticate(self, username=None, password=None):
        if username:
            #email
            if re.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$", username) != None:
                try:
                    user = User.objects.get(email=username)
                    if user.check_password(password):
                        return user
                except User.DoesNotExist:
                    return None
            #mobile
            elif False:# len(username)==11 and re.match("^(1[3458]\d{9})$", username) != None:
                try:
                    user = User.objects.get(mobile=username)
                    if user.check_password(password):
                        return user
                except User.DoesNotExist:
                    return None  
            #nick
            else:
                try:
                    user = User.objects.get(username=username)
                    if user.check_password(password):
                        return user
                except User.DoesNotExist:
                    return None                
        else:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None</pre>

然后，在settings.py中声明（然后你看看admin是不是可以用邮箱登录了）

<pre class="brush:python;toolbar:false">AUTHENTICATION_BACKENDS = (
    'account.backends.LoginBackend',
)</pre>

### 2、views.py中登录

<pre class="brush:python;toolbar:false">@require_POST
@csrf_exempt #占时屏蔽，让客户端访问
def j_Login(request):
    username = request.POST['username']
    password = request.POST['password']

    result = {"status": False, "data":""}

    if username=="" or username.isspace():
        result = {"status": False, "data": u"用户名不能为空"}
        return HttpResponse(simplejson.dumps(result, ensure_ascii = False))
    if password=="" or password.isspace():
        result = {"status": False, "data": u"密码不能为空"}
        return HttpResponse(simplejson.dumps(result, ensure_ascii = False))

    user = auth.authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            auth.login(request, user)
            result = {"status": True, "data": "OK"}
            return HttpResponse(simplejson.dumps(result, ensure_ascii = False))
        else:
            result = {"status": False, "data": "[" + username + u"]已被暂时禁用"}
            return HttpResponse(simplejson.dumps(result, ensure_ascii = False))
    else:
        result = {"status": False, "data": u"用户名或密码不正确，请重试"}
        return HttpResponse(simplejson.dumps(result, ensure_ascii = False))</pre>

几点说明一下：

*   ensure_ascii = False可以返回中文，而不是变成ascii编码了

*   话说都需要加一个mimetype="application/json"，或者content_type="application/json"，但是我加上去就中文乱码了

<pre class="brush:python;toolbar:false">return HttpResponse(simplejson.dumps(result, ensure_ascii = False), mimetype="application/json")</pre>

### 3、登录后，检测登录状态

这个可以用原来的@login_required，也可以自定义一个装饰器（用来返回json数据）

<pre class="brush:python;toolbar:false">def json_login_required():
    '''
    check login status. if no, will return "NO_LOGIN"
    '''
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if request.user.is_authenticated():
                return view_func(request, *args, **kwargs)
            else:
                return HttpResponse("NO_LOGIN")
        return _wrapped_view
    return decorator</pre>