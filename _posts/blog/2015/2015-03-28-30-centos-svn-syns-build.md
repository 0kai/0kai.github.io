---
title: 阿里云CentOS搭建SVN同步部署
layout: blog
categories: blog
tags: centos
blogId: 30
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

本地开发后发布到阿里云，本文介绍使用SVN同步。

**SVN配置**

```
1\. 安装svn
yum -y install subversion

2\. 创建版本库目录
mkdir /apj/svndata
svnserve -d -r /apj/svndata

3\. 创建一个项目
svnadmin create /apj/svndata/apj

4\. 配置访问权限
vi /apj/svndata/apj/conf/svnserve.conf

去掉下列三个的注释，且开头无空格
anon-access=none
auth-access=write
password-db=passwd

vi /apj/svndata/apj/conf/passwd
#<用户1> = <密码1>

5\. 客户端连接，注意第二步中，已经将svn的目录设置为/apj/svndata了，所以下面这个apj是项目名字
svn co svn://IP/apj
```

**实现同步**

```
6\. 实现svn与web同步
1）设置web目录为/apj/www
2）checkout一份
svn co svn://localhost/apj /apj/www
(会先提示用root作为用户，直接按回车可以更换用户)

提示：
-----------------------------------------------------------------------
注意!  你的密码，对于认证域:

   <svn://localhost:3690> 272d37f1-9500-4b47-a7fc-22d9fcf9ecb1

只能明文保存在磁盘上!  如果可能的话，请考虑配置你的系统，让 Subversion
可以保存加密后的密码。请参阅文档以获得详细信息。

你可以通过在“/root/.subversion/servers”中设置选项“store-plaintext-passwords”为“yes”或“no”，
来避免再次出现此警告。
-----------------------------------------------------------------------
这个问题，如果有人能入侵到你的系统里面了，都可以直接修改了，没差这个密码了吧（后续再了解）

3）建立同步脚本
cd /apj/svndata/apj/hooks/
cp post-commit.tmpl post-commit
vi post-commit
最后添加
export.UTF-8
SVN=/usr/bin/svn
WEB=/apj/www/
$SVN update $WEB --username username --password password
chown -R www:www $WEB

4)增加脚本执行权限
chmod +x post-commit
（目前能实现的就只是能同步，貌似提交的用户名和post-commit用户名相同时的)
```

不过用这样的方法部署有些不好：

1）修改了代码也不一定是要部署的

2）没有多用户提交管理

3）后面研究一下git，类似github管理方法好点