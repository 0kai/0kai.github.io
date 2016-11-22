---
title: Django跨平台POST提交问题研究
layout: blog
categories: blog
tags: python django
blogId: 16
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

Django有防止跨站访问的功能，但是对于需要在各种客户端访问的需求，就需要不同的处理方案了。

### 1、CSRF_TOKEN介绍

> CSRF解决的不是灌水机、Bot之类的问题，CSRF主要是为了防止跨站请求。
> 
> 因为HTTP请求默认都会带上Cookie，所以攻击者可以在自己的网站上创建一个隐藏的表单并且用JS偷偷提交，而这个偷偷提交的请求是自动带有被攻击站点有效Cookie的。
> 
> 但是如果在Cookie里加一个每次登录都改变的csrf，并且在表单里加一个hidden域，提交时验证两者是否匹配，那么以上攻击就没法实现了，因为恶意网站无法读取你的Cookie（因为浏览器的同源策略），所以无法获得Cookie里的CSRF Token，无法伪造出csrf，POST就会失败，这样就不会产生安全问题。

如果有form提交时需要验证token，那么需要在html表单中添加{ % csrf_token % }，这样就能防止跨站访问了。

1) form提交时，会通过隐藏表单的方式提交cookie中的csrftoken记录

```
<input type="hidden"  value="4dc3a02f858e4bd54b57" name="csrfoken"/>
```

2) 服务器端接到POST请求时，会验证提交的Token和用户cookie中的Token值是否一致，如不一致就返回403错误。

有一点需要注意的，如果使用的是django.middleware.csrf.CsrfViewMiddleware这个中间件，django会默认验证每一个post请求，因此所有的<form>表单内都需要加上csrf_token的tag，否则站内提交也会被阻止，除非通过@csrf_exempt装饰器来显示声明不验证token值。

CSRF token missing or incorrect

--

*   在 templete 中, 为每个 POST form 增加一个 { % csrf_token % } tag. 如下:

```
    { % csrf_token % }
```

*   在 view 中, 使用 django.template.RequestContext 而不是 Context. render_to_response, 默认使用 Context. 需要改成 RequestContext.

给 render_to_response 增加一个参数:

```
 django.template import RequestContext
def your_view(request):
    ...
    return render_to_response('template.html',
          your_data,
          context_instance=RequestContext(request)
    )
```

### 2、使用@csrf_exempt装饰器

装饰器声明不验证token值，这个是否安全呢。

我们可以自定义一个装饰器来控制。Stackoverflow看的：

> Write own decorator and add some "secret" header to your request.
> 
> [https://code.djangoproject.com/browser/django/trunk/django/views/decorators/csrf.py](https://code.djangoproject.com/browser/django/trunk/django/views/decorators/csrf.py)

下面举个例子：（if 语句那里做判断即可，当然加点复杂的判断最好了）

```
def csrf_exempt(view_func):
        """
        Marks a view function as being exempt from the CSRF view protection.
        """
        # We could just do view_func.csrf_exempt = True, but decorators
        # are nicer if they don't have side-effects, so we return a new
        # function.
        def wrapped_view(request,*args, **kwargs):
            return view_func(request, *args, **kwargs)
            if request.META.has_key('HTTP_X_SKIP_CSRF'):
                wrapped_view.csrf_exempt = True
        return wraps(view_func, assigned=available_attrs(view_func))(wrapped_view)
```

有待继续研究。。。