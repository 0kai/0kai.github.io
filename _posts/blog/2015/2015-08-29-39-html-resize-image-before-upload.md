---
title: html前端压缩图片上传, Django后端获取
layout: blog
categories: blog
tags: html
blogId: 39
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

当前相机、手机等拍照的图片都是几个M，甚至更大，这样当大量图片上传时，是很伤带宽的，且用户等待时间很长。

html js是不允许修改本地文件的，现在有html5新方法。

方法：html5将图片读取成base64数据，然后提交到服务器。

压缩方法开源代码 lrz.js: [https://github.com/think2011/localResizeIMG4](https://github.com/think2011/localResizeIMG4 "https://github.com/think2011/localResizeIMG4")

### 方法一：

lrz.js 压缩后，直接把值放到input text里面，然后点提交到后台

(这里是多文件上传)

html代码

```
<input id="filesToUpload" multiple="" type="file" accept="image/*" onchange="makeFileList();" required>
<ul id="fileList" class="am-list am-list-static"><li>未选择图片</li></ul>
```

```
function changeSize (file) {
        lrz(file, {width: 720, quality: 1.0})
            .then(function (rst) {
                // 处理成功会执行
                //alert(rst.base64);
                var ul = document.getElementById("fileList");
                var input = document.createElement("input");
                input.type = "text";
                input.value = rst.base64;
                input.name = "images"
                ul.appendChild(input);
            })
            .catch(function (err) {
                // 处理失败会执行
            })
            .always(function () {
                // 不管是成功失败，都会执行
            });
    }

    function makeFileList() {
        var input = document.getElementById("filesToUpload");
        var ul = document.getElementById("fileList");
        while (ul.hasChildNodes()) {
            ul.removeChild(ul.firstChild);
        }
        for (var i = 0; i < input.files.length; i++) {
            changeSize(input.files[i]);
            var li = document.createElement("li");
            li.innerHTML = input.files[i].name;
            ul.appendChild(li);
        }
        if(!ul.hasChildNodes()) {
            var li = document.createElement("li");
            li.innerHTML = '未选择图片';
            ul.appendChild(li);
        }
    }
```

python/django代码

```
def __get_image_by_base64(data):
    print data
    p = data.partition('base64,')[2]
    c = ContentFile(base64.b64decode(p))
    #image = Image.open(c)
    #image.show()

    c.name = "a.jpg"
    return c

def albumImageAdd(request):
    result = {}

    file_list = request.POST.getlist("images")
    ...
    for image in file_list:
        if count < MAX_COUNT:
            count = count + 1
            albumImage = AlbumImage()
            albumImage.image = __get_image_by_base64(image)
            albumImage.save()
```

这个方法还行，在文件较小的情况下都OK。但是发现当图片高度比较大，即图片比较大时rst.base64的值很大，导致了input输入到了最大值了。（用textarea也没用）

所以这个适合在小文件。

### 方法二：

同样适用lrz.js，只是在base64数据处理不同

```html
<div class="am-form-group am-form-file">
  <button type="button" class="am-btn am-btn-default am-btn-sm">
    <i class="am-icon-cloud-upload"></i> 选择要上传的图片</button>
    <input id="filesToUpload" multiple="" type="file" accept="image/*" onchange="makeFileList();">
</div>
<ul id="fileList" class="am-list am-list-static"><li>未选择图片</li></ul>
```

```
function uploadImage(base64_image, element) {
        $.ajax({
            type: "POST",
            url: "/padmin/s/albumImageBase64Add/",
            //contentType: "application/json", //必须有
            dataType: "json", //表示返回值类型，不必须
            data: {'id':{{album.id}}, 'data':base64_image},
            success: function (result) {
                if(result.status == 1){
                    element.innerHTML = element.innerHTML.replace(/am-icon-spinner am-icon-spin/, "am-icon-check-circle");
                }else{
                    element.innerHTML = element.innerHTML.replace(/am-icon-spinner am-icon-spin/, "am-icon-close");
                }
            },
            complete: function() {
                uploading_image_count --;
                if(uploading_image_count <= 0){
                    $("#complete-button").attr("disabled", false);
                }
            }
        });
    }

    function changeSize (file, element) {
        lrz(file, {width: 720, quality: 1.0})
            .then(function (rst) {
                // 处理成功会执行
                //alert(rst.base64);
                uploadImage(rst.base64, element);
            })
            .catch(function (err) {
                // 处理失败会执行
            })
            .always(function () {
                // 不管是成功失败，都会执行
            });
    }

    function makeFileList() {
        var input = document.getElementById("filesToUpload");
        var ul = document.getElementById("fileList");
        while (uploading_image_count == 0 && ul.hasChildNodes()) {
            ul.removeChild(ul.firstChild);
        }

        $("#complete-button").attr("disabled", true);
        uploading_image_count += input.files.length;
        for (var i = 0; i < input.files.length; i++) {
            /**
            if(!checkSize(input.files[i].size)){
                input.outerHTML=input.outerHTML.replace(/(value=\").+\"/i,"$1\""); 
                break;
            }
            **/
            var li = document.createElement("li");
            li.innerHTML = input.files[i].name + '&nbsp;&nbsp;<i id="icon" class="am-icon-spinner am-icon-spin"></i>';
            //li.innerHTML = li.innerHTML.replace(/am-icon-spinner am-icon-spin/, "am-icon-check-circle am-warning");
            ul.appendChild(li);
            changeSize(input.files[i], li);
        }
        if(!ul.hasChildNodes()) {
            var li = document.createElement("li");
            li.innerHTML = '未选择图片';
            ul.appendChild(li);
        }
    }
```

uploadImage()处理ajax数据上传，并UI响应。后端处理与方法一类似。

仅供参考，代码没有太多整理。