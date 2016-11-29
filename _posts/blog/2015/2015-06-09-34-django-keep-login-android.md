---
title: Android客户端保持Django服务器登录状态
layout: blog
categories: blog
tags: django android
blogId: 34
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

最近在开发移动客户端，Django在登录后是由session能判断登录状态，一开始在Android上面链接登录服务器后，操作都是登录状态。但是退出app，然后清理一下内存，Duang~ 没有登录了。因为cookie被清理了。

要保持登录，那么就需要与服务器保存的session相同。

方案：登录后，将session保存在本地，下次启动应用时Http client设置header就可以了。

登录后Response的处理（我这里用了android-lite-http库，类似处理即可）

```
for (NameValuePair nv : res.getHeaders()) {
            if ("Set-Cookie".equals(nv.getName()) && nv.getValue().startsWith("sessionid=")) {
                AppPreferences.putString(App.LOGIN_SESSION_COOKIE, nv.getValue());
                break;
            }
        }
```

下次启动app，给HttpClient的header设置cookie就可以了。

```
mClient = LiteHttpClient.newApacheHttpClient(this);
        String session = AppPreferences.getString(App.LOGIN_SESSION_COOKIE);
        if(session != null){
            List<NameValuePair> pairList = new ArrayList<>();
            pairList.add(new NameValuePair("cookie", session));
            mClient.setCommonHeader(pairList);
        }
```

中间过程用到自己写的一些东西，知道原理即可。