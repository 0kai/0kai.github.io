---
title: 阿里云CentOS在MAC搭建FTP
layout: blog
categories: blog
tags: centos
blogId: 24
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

往CentOS服务器上上传文件，使用vsftpd

### 1、检测是否安装

ps -ef |grep vsftpd

### 2、安装

yum install vsftpd -y

### 3、开机启动

vim /etc/vsftpd/vsftpd.conf

anonymous_enable=YES 修改为NO

取消如下配置前的注释符号：

> local_enable=YES
> 
> write_enable=YES
> 
> chroot_local_user=YES

chkconfig --level 35 vsftpd on （把3和5开启）

### 4、FTP用户名、密码设置

useradd ftpadmin -s /sbin/nologin -d /alidata/ftp

（userdel username删除用户；userdel -r username同时删除用户的宿主目录）

修改该帐户密码:

passwd ftpadmin  <--上面的用户名

设置权限

chown ftpadmin /alidata/ftp

启动FTP

service vsftpd start

### 5、FileZilla 连接服务器

如果有如下报错：

500 OOPS: cannot change directory:/

setsebool ftpd_disable_trans 1

service vsftpd restart

参考：[http://help.aliyun.com/view/13435411.html](http://help.aliyun.com/view/13435411.html)