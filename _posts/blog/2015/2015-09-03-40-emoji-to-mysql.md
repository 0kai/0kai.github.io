---
title: emoji符号保存到mysql
layout: blog
categories: blog
tags: django
blogId: 40
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

emoji是iso和Mac OS系统特有的一系列“表情符号”,当用户在输入框中加入emoji时，保存到服务器sql中，就可能存在保存不完整的情况了。

方法一：网上有很多方法都是修改字段、数据库的编码格式为utf8mb4

<pre class="brush:bash;toolbar:false">[mysql]
default-character-set=utf8mb4
[mysqld]
character-set-server=utf8mb4
重启MySQL使配置生效，其实可以完全通过set names的方式实现这个调整，我这样做的目的是为了不改变代码，平滑过渡。

修改对应字段的编码格式
ALTER TABLE `表名` CHANGE COLUMN `字段名` `字段名` 类型(长度) CHARACTER SET utf8mb4 

比如：
ALTER TABLE `test`.`test1` CHANGE COLUMN `name` `name` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL;

建议只是个别字段开通，全表开通的方式：
alter table 表名 convert to character set utf8mb4 collate utf8mb4_bin;</pre>

自己试了一下，貌似也没效果，保存后部分emoji符号式???了，差评。

方法二：自己找了个方法，就是把文字内容保存为二进制。

<pre class="brush:bash;toolbar:false">#django中，其他的没修改，哈哈
models.BinaryField()</pre>

简单记录，记录自己的存在感