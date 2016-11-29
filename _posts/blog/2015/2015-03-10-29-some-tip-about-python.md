---
title: 说说最近学习的几个python代码技巧
layout: blog
categories: blog
tags: python
blogId: 29
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

python开发，当代码存在很多重复性时，就会觉得很繁琐。重复性的操作就可以用独立一个函数来优化。主要方法就是用变量名的字符串去获取值。

例如下面这个类：

<pre class="brush:python;toolbar:false">class Test(object):
    a = 1
    b = 2
    c = 3
    d = 5
    ...</pre>

这个类的变量就非常多，操作上就会有很多重复性了。

**用字符串取值 getattr(self, key)**

例如我想取某些变量乘以权重求和，写个函数

<pre class="brush:python;toolbar:false"># Test的内部函数
def sum(self, **kw)
    total = 0
    for key in kw:
        total += getattr(self, key) * kw[key]

# 调用时
t = Test()
t.sum(a=10, c=2) # 同 sum = t.a*10 + t.c*2</pre>

**类似方法还有**

setattr(self, key, value)

hasattr(self, key)

delattr(self, key)

**内嵌函数**

python中，函数里面还可以定义另一个函数，可作为返回数等。

<pre class="brush:python;toolbar:false">def fun_1():
    str = ""
    m = 10
    l = []
    a = {}
    def fun_2():
        str = "bb"
        m = 20
        l.append({"a":1})
        a.update({"k":2})
    fun_2()
    print str
    print m
    print l
    print a
>>>fun_1() 
>>>
>>>10
>>>[{'a':1}]
>>>{'k':2}</pre>

可以发现内嵌函数内字符串数值变量都无法使用外部的。除非是在fun_1()外的全局变量。

若需要使用，放在字典和列表里面是OK的。

PS：瞎整理了一篇文章，哈哈