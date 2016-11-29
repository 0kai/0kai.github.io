---
title: Django由客户端上传图片/文件
layout: blog
categories: blog
tags: django
blogId: 22
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

对于文字提交表单比较简单，文件上传就比较乱。

客户端调用，现在html中调试：

```
设置用户头像
        <form action="/account/SetUserIcon/" method="post" enctype="multipart/form-data">
            <p><input type="file" name="icon"></p>
            <p><input type="submit" value="提交"></p>
        </form>
```

views.py代码，@csrf_exempt非主网页要加

```
@require_POST
@csrf_exempt
def SetUserIcon(request):
    '''
    set user icon
    '''
    result = {}
    while True:
        if True:#try:
            icon = request.FILES['icon']
            #save profile
            try:
                profile = request.user.profile
            except:
                profile = Profile()
                profile.user = request.user
            profile.icon.save(icon.name, icon, save=False)
            profile.save()
            result = {"status": STATUS_SUCCESS}
        break
    return HttpResponse(json.dumps(result, ensure_ascii = False))
```

*   request.FILES['icon']获得UploadFile对象，有方法：read获得数据，name名字，size大小 等

*   然后UploadFile.save(name, content, save=False)调用了Storage.save(name, content)

*   往下的继续研究吧，这样就能保存了。

会发现图片更新后，其实原来的图片并没有被删除。

如需删除请看：[Django中delete_selected删除文件的方法](/blog/2014/11/26/8-django-delete-selected-file.html)