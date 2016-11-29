---
title: 阿里云CentOS在MAC上远程+VNC
layout: blog
categories: blog
tags: centos
blogId: 23
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

### 1、申请了阿里云免费半年

其实要付费1元，可以再提款取出来，哈哈。

### 2、SSH连接

由于是在mac上操作，找了半天远程SSH访问，SecureCRT找了个破解版，结果在10.10不怎么怎么也跑不了。还有好多收费的，麻烦。。。

最后发现阿里云上面有，网页版本，省事了。哈哈

阿里云-》实例-》管理-》连接管理终端

后来有发现：

> 直接使用ssh命令进行连接 如：ssh root@您实例的公网IP，接着在输入该实例的root用户的密码，即可完成登录

结果呢，免费的没有公网IP，搞了一晚上，改天继续看吧。

参考连接：

 [Linux登录云服务器](http://help.aliyun.com/list/11108219.html?spm=5176.7224461.1997282917.3.dzrFj7) 

 [Vim命令](http://www.cnblogs.com/softwaretesting/archive/2011/07/12/2104435.html)

### 3、买了公共IP

记录一下怎么用VNC吧。在MAC电脑上操作

<pre class="brush:as3;toolbar:false">ssh root@xxx.xxx.xxx.xxx <--公网IP

1\. CentOS 6.0以后VNC叫tigervnc

rpm -qa|grep tigervnc （无显示则表示未安装,一般情况没有安装）

2\. 
安装VNC服务（-y表示不暂停安装）
yum install tigervnc tigervnc-server -y

安装桌面服务
yum groupinstall -y "Desktop" "X Window System"

PS：安装后回安装NetworkManager服务，会与network冲突，所以要停止改服务

chkconfig --list
查看NetworkManager 2 3 4 5是on

设置开机不启动
chkconfig NetworkManager off

停止运行
service NetworkManager stop (当前没运行，就显示FAILED)

3\. 启动vnc (或者重启会自动启动)
chkconfig vncserver on

4\. vnc 密码
vncserver (输入两次密码)

vncpasswd (可以修改密码)

5\. vnc 配置
cd /root/.vnc/

修改xstartup文件，把最后的 twm & 删掉， 添加 gnome-session &
vim xstartup
(输入i，可以插入-》修改后-》按Esc-》:wq 就保存了

重启vncserver服务
service vncserver restart 

(启动失败)
修改/
vim /etc/sysconfig/vncservers

修改为：
VNCSERVERS="1:root"
VNCSERVERARGS[2]="-geometry 800x600"

这样重启就正常了
service vncserver restart 

查看vnc进程
ps -axjf | grep vnc

/usr/bin/Xvnc :1 显示桌面号, 5901端口</pre>

### 4、VNC登录，自己下载一个VNC

登录就用

xxx.xxx.xx.xx:1或者:5901，密码是第3步那里设置的。

一天学习一点吧，服务器菜鸟一个。