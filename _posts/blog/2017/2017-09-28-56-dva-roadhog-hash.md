---
title: 浏览器缓存之-dva+roadhog
layout: blog
categories: blog
tags: react dva roadhog hash
blogId: 56
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

#### 浏览器缓存之-dva+roadhog

> 初学前端不久，先用用dva \
> 浏览器缓存确实是前端开发一个常用知识

#### 1、浏览器缓存处理方案
- Last-Modified
- etag
- max-age
- 不同资源

[参考](https://github.com/laizimo/zimo-article/issues/24?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)

#### 2、dva+roadhog
部署打包的时候会生成如下文件：

```
index.html
index.js
index.css
```

由于资源js和css名字不变，则浏览器在缓存情况下不会去更新

##### 2.1、升级roadhog
>好像roadhog要1.1.2之后才支持hash打包


##### 2.2、hash配置
.roadhogrc中添加

```
{
  ...
  "hash": true
}

```

##### 2.3、打包的时候index.html中并未引用带有hash的js/css
>public/index.html -> src/index.ejs

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your Title</title>
</head>
<body>

<div id="root"></div>

</body>
</html>

```

```
npm run build

> index.html
> index.8e4abfa9.js
> index.bde1a996.css
```
