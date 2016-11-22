---
title: Django中delete_selected删除文件的方法
layout: blog
categories: blog
tags: django
blogId: 8
---

Django中，当在admin中删除ImageField或FileField的时候，并不会删除掉Media中的文件。

这个是Django中设计上的处理吧，因为仅仅是数据库上删除文件，但是其他地方可能还是有引用这个文件的。所以要删除的话，要慎重。

本文就来介绍如何在admin delete_selected的时候顺便删除掉File的方法。

1）首先定义一个model

```
class FileModel(models.Model):
    file = models.FileField(upload_to='myfiles')
```

2）在这个model.py里面添加一个on_delete的回调方法，并注册

```
def on_delete(sender, instance, **kwargs):
    instance.file.delete(save=False)

models.signals.post_delete.connect(on_delete, sender=FileModel)
```

<span style="font-size: 16px;"></span>

<span style="font-size: 16px;">
</span>

<span style="font-size: 16px;">3）注意：instance.file.delete()这个方法要传入save=False，否则数据库还会保存一个值（可以查看源码中delete方法）</span>

```
def delete(self, save=True):
    # Only close the file if it's already open, which we know by the
    # presence of self._file
    if hasattr(self, '_file'):
        self.close()
        del self.file

    self.storage.delete(self.name)

    self.name = None
    setattr(self.instance, self.field.name, self.name)

    # Delete the filesize cache
    if hasattr(self, '_size'):
        del self._size
    self._committed = False

    if save: # <--注意这里，如果save为True的话，还是save一次
        self.instance.save()
```

PS：当更新一张新图片的时候，旧图片也没有被删除的。可以自己调用一下.delete()就OK了