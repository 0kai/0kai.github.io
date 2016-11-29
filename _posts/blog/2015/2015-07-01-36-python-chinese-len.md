---
title: Python中文字符串长度len
layout: blog
categories: blog
tags: python
blogId: 36
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

在python中使用len(str)去判断字符串时，对于中文情况，不同编码得到的结果不一样。

<pre class="brush:python;toolbar:false">>>> a = "中文"
>>> b = u"中文"
>>> len(a), len(b)
(6, 2)</pre>

遇到的问题：

> 使用urllib2.urlopen进行网络访问，上传的数据包不完整，导致一直访问错误（云通讯短信发送问题）。
> 
> 对方服务器根据Content-Length去判断数据长度。
> 
> 而当我上传包含中文的时候Content-Length长度小了。

方法一，直接主动传递Content-Length

<pre class="brush:python;toolbar:false">req.add_header("Content-Length", len(body.encode("utf-8")))</pre>

方法二，把上传的数据编码修改了

<pre class="brush:python;toolbar:false">req.add_data(body.encode("utf-8"))</pre>

另外：由于刚开始文件的编码格式不是utf-8，导致了很多问题。

方法一：直接在文件中转码

<pre class="brush:python;toolbar:false">import sys;
reload(sys);

sys.setdefaultencoding("utf8");</pre>

方法二：用编辑器修改文件编码

注意要把.pyc删掉重新生成，不然好像无效。

哎，我这服务器小白，还需更多的学习啊，不然不能担起大任！