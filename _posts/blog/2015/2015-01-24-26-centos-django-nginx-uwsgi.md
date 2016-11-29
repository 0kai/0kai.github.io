---
title: 阿里云CentOS在搭建Django+nginx+uwsgi
layout: blog
categories: blog
tags: centos
blogId: 26
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

对于linux只是菜鸟，配置这些东西好蛋疼。所以简单记录吧。

网上其实好多教程，各种版本都有，还是要自己实践了才知道。

上一篇已经升级了python到2.7

### 1、安装一下pip，python必备

<pre class="brush:bash;toolbar:false">wget https://bootstrap.pypa.io/get-pip.py
python get-pip.py</pre>

### 2、安装Django

<pre class="brush:bash;toolbar:false">pip install Django #（装了1.7.3）
#验证版本：
python
import django
print(django.get_version())</pre>

### 3、安装mysql服务

虽然要使用阿里云的RDS，但貌似还要安装mysql服务才能连接。

<pre class="brush:bash;toolbar:false">yum install mysql-server

#安装setuptools
wget https://bootstrap.pypa.io/ez_setup.py -O - | python

yum install mysql-devel
pip install MySQL-python

#安装pil
wget http://effbot.org/downloads/Imaging-1.1.7.tar.gz
tar zxvf Imaging-1.1.7.tar.gz
cd Imaging-1.1.7
python setup.py install</pre>

> <span style="color: rgb(255, 0, 0);">2015-03-22, pil 将会被遗弃，建议使用Pillow(pip install Pillow)</span>

### 4、安装uwsgi

> <span style="color: rgb(255, 0, 0);">2015-03-22, pip install uwsgi</span>

<pre class="brush:bash;toolbar:false">wget https://pypi.python.org/packages/source/u/uWSGI/uwsgi-2.0.9.tar.gz
tar zxvf uwsgi-2.0.9.tar.gz
make
cp uwsgi /usr/bin #这句就能直接使用 uwsgi命令了</pre>

新建一个uwsgi.ini配置文件，随便放哪里都可以

<pre class="brush:bash;toolbar:false">vi uwsgi.ini
#内容
[uwsgi]
# set the http port
http-socket=:8001 #这句没必要可以去掉
# set socket port
socket=127.0.0.1:8000
# change to django project directory
chdir=/alidata/www/apj
# load django #wsgi.py目录
module=webconfig.wsgi:application
# auto reload when python file changed
py-autoreload=1</pre>

注意配置文件中配置了两个端口。第一个http-socket是配置可以通过端口访问的HTTP地址，http://127.0.0.1:8001访问（应该没必要）。

第二个配置SOCKET连接地址，就是给nginx配置用的。

### 5、安装nginx

<pre class="brush:bash;toolbar:false">wget http://nginx.org/download/nginx-1.6.2.tar.gz

#部分安装工具
yum install glib2-devel pcre-devel bzip2-devel
tar zxvf nginx-1.6.2.tar.gz
cd nginx-1.6.2
./configure
make install
cp /usr/local/nginx/sbin/nginx  /usr/bin</pre>

修改nginx.conf配置(vi /usr/local/nginx/conf/nginx.conf)

<pre class="brush:bash;toolbar:false">server {
    listen 80;
    server_name  0kai.net;

    location / {
        uwsgi_pass 127.0.0.1:8000;
        include uwsgi_params;
    }

    location ~ ^/static/ {
        root /alidata/www/apj/;  #<-- path that include /static/
        expires 24h;
        access_log   off;
    }
}</pre>

注：静态文件要在这里配置一下，urls.py里面配置已经无效了。

### 6、网站开启

<pre class="brush:bash;toolbar:false">nginx
uwsgi --master --ini uwsgi.ini #已经cd到uwsgi.ini目录了</pre>

这样就能用配置的域名直接访问了。万岁！！！

但是当uwsgi开启后，那个命令界面一直在，不知道有没有办法处理。后续再研究吧

### 7、关闭

<pre class="brush:bash;toolbar:false">nginx -s stop
killall -9 uwsgi</pre>