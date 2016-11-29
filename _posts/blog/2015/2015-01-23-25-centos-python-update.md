---
title: 阿里云CentOS升级Python2.7.9
layout: blog
categories: blog
tags: centos
blogId: 25
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

### 升级python

CentOS 6.5默认是2.6.6的，这里我们要升级到2.7版本

先安装依赖包

<pre class="brush:bash;toolbar:false;">yum install -y zlib-devel
yum install -y openssl-devel</pre>

安装gcc, 否则 ./configure 会报错

<pre class="brush:bash;toolbar:false;">yum install -y gcc</pre>

下载python 2.7.9

<pre class="brush:bash;toolbar:false;">wget https://www.python.org/ftp/python/2.7.9/Python-2.7.9.tgz</pre>

解压

<pre class="brush:bash;toolbar:false;">tar zxvf Python-2.7.9.tgz</pre>

安装

<pre class="brush:bash;toolbar:false">./configure
make all
make install
make clean
make distclean</pre>

> <span style="color: rgb(255, 0, 0);">2015-03-22 发现下面部分没有配置也能正常使用，CentOS 6.5</span>

将系统默认的python指向python2.7版本

<pre class="brush:bash;toolbar:false">mv /usr/bin/python /usr/bin/python2.6.6
ln -s /usr/local/bin/python2.7 /usr/bin/python</pre>

解决系统 Python 软链接指向 Python2.7 版本后，因为yum是不兼容 Python 2.7的，所以yum不能正常工作，我们需要指定 yum 的Python版本

<pre class="brush:bash;toolbar:false">vi /usr/bin/yum</pre>

将文件头部

<pre class="brush:bash;toolbar:false">#!/usr/bin/python</pre>

修改成

<pre class="brush:bash;toolbar:false">#!/usr/bin/python2.6.6</pre>