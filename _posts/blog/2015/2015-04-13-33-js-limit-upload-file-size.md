---
title: JS限制上传图片大小
layout: blog
categories: blog
tags: django
blogId: 33
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

网上有很多在html上传是判断文件大小的例子，但是都有各种兼容问题。综合了一些方法，不知道兼容如何，有待验证。（目前至少IE9、猎豹、QQ等都OK）。

最后的成果：

```
<input type="file" name="file1" id="file1" size="40" onchange="fileChange(this)"/>
<script type="text/javascript">
function fileCheckSize(target, fileSize) {
    var size = fileSize / 1024;
    if(size > 1024*2){
         alert("file > 2M");
         //target.value = ""; //这句话在IE有点问题，修改如下
         target.outerHTML=target.outerHTML.replace(/(value=\").+\"/i,"$1\""); 
    }
}
function fileChange(target) {
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    var fileSize = 0;
    if (isIE && !target.files) {
        var img = null;
        img = document.createElement("img");
        img.src = target.value;
        img.onreadystatechange = function ()
        {
            if (img.readyState == "complete")
            {
                fileCheckSize(target, img.fileSize)
            }
        }
    } else {
        fileCheckSize(target, target.files[0].size);
    }
}
</script>
```

在IE的情况下，有使用ActiveX的，但是每次都提示，很奇葩（不过对应各种类型都OK）

```
   if (isIE && !target.files) {
          var filePath = target.value;
          var fileSystem = new ActiveXObject("Scripting.FileSystemObject");

          var file = fileSystem.GetFile (filePath);
          fileSize = file.Size;
    }
```

这个是最新的html支持的，IE10，等一些新的内核都OK的

```target.files[0].size```

由于我只需要判断图片，所以结合了个方法，去掉ActiveX，使用图片判断。待各路大神指点！！！