---
title: Nodejs开发Web--Mongodb
layout: blog
categories: blog
tags: web
blogId: 45
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

> MongoDB是目前在IT行业非常流行的一种非关系型数据库(NoSql），其灵活的数据存储方式备受当前IT从业人员的青睐。MongoDB很好的实现了面向对象的思路，在MongoDB中每一条记录都是一个Document对象。MongoDB最大的优势在于所有的数据持久操作都无需开发人员手动编写SQL语句，直接调用方法就可以轻松的实现CRUD操作了。

一、下载安装

官网下载：[http://www.mongodb.org/downloads](http://www.mongodb.org/downloads) 

（不过貌似页面无法下载，我到云盘下载了一个）

二、运行

1、安装后，要添加环境变量到PATH中（bin那个目录）

2、命令行执行mongo

> Failed to connect to 127.0.0.1:27017, reason: errno:10061 由于目标计算机积极拒绝，无法连接。
> 
> 方法：
> 
> 1)新建一个mongo.config配置文件来指定dbpath路径
> 
> 2)mongo.config内容为：dbpath=c:\data\db
> 
> 3)执行mongod --config d:\....\mongo.config

3、不过2中的创建貌似有些奇怪，每次都要跑那个config。最后我直接在C盘创建一个data/db目录就OK了。

运行: mongod

数据查询: mongo

4、习惯使用图形界面操作数据库

Robomongo这个工具还不错[http://www.robomongo.org/](http://www.robomongo.org/)

简单记录而已

=========================

2015-11-05

以上是在Windows下面操作的。最近回到Mac系统，安装个mongodb也是蛋疼。

1、先安装个homebrew

<pre class="brush:ruby;toolbar:false">ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"</pre>

2、安装Mongodb

<pre class="brush:bash;toolbar:false">$ brew update
$ brew install mongodb
...
$ mkdir -p /data/db</pre>

3、如果上面mkdir创建目录失败的话，权限不够，使用如下方式：

<pre class="brush:bash;toolbar:false">$ sudo mkdir -p /data/db
$ sudo chown `id -u` /data/db</pre>

4、运行Mongodb

<pre class="brush:bash;toolbar:false">$ mongod</pre>