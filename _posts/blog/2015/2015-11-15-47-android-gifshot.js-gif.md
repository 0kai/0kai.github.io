---
title: Android调用gifshot.js库实现合成gif
layout: blog
categories: blog
tags: android gif
blogId: 47
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

本文介绍Android通过使用gifshot.js来合成Gif，并分享Android与JS互调方法。

1、gifshot介绍[https://github.com/yahoo/gifshot](https://github.com/yahoo/gifshot "github地址")

> <span style="color: rgb(102, 102, 102); font-family: Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol'; line-height: 22.4px; background-color: rgb(255, 255, 255);">JavaScript library that can create animated GIFs from media streams, videos, or images</span>

<span style="color: rgb(102, 102, 102); font-family: Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol'; line-height: 22.4px; background-color: rgb(255, 255, 255);"></span>

<span style="color: rgb(102, 102, 102); font-family: Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol'; line-height: 22.4px; background-color: rgb(255, 255, 255);">2、gifshot使用方法
</span>

<span style="color:#666666;font-family:Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif, Segoe UI Emoji, Segoe UI Symbol"><span style="line-height: 22.4px; background-color: rgb(255, 255, 255);">放在Android的assets目录下即可</span></span>

```html
<!DOCTYPE html>
<html>
    <head>
    </head>

    <body>
      <script src="js/dependencies/gifshot.min.js"></script>
      <script>
      function createGif(width, height, workers, interval) {
          gifshot.createGIF({
               gifWidth: width,
               gifHeight: height,
               //numFrames: 8,
               interval: interval,
               numWorkers: workers,
              'images': ['images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg', 'images/5.jpg',
                        'images/4.jpg', 'images/3.jpg', 'images/2.jpg']
          },function(obj) {
              if(!obj.error) {
                  var image = obj.image,
                  animatedImage = document.createElement('img');
                  animatedImage.src = image;
                  document.body.appendChild(animatedImage);
              }
          });
      };
      </script>
    </body>
</html>
```

1）只需要index.html（如上代码），以及gifshot.min.js<span style="color:#666666;font-family:Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif, Segoe UI Emoji, Segoe UI Symbol"><span style="line-height: 22.4px; background-color: rgb(255, 255, 255);"></span></span>

2）几张images图片也是临时放在assets下的

3、android中使用WebView调用

<pre class="brush:java;toolbar:false">mWebView.getSettings().setJavaScriptEnabled(true);//允许使用javascript
mWebView.getSettings().setAllowFileAccess(true);//允许读取文件
mWebView.getSettings().setAllowContentAccess(true);
if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN){
    mWebView.getSettings().setAllowFileAccessFromFileURLs(true);
}

mWebView.loadUrl("file:///android_asset/index.html");//初始化读取网页

findViewById(R.id.create_gif_btn).setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        String url = String.format("javascript:createGif(%s, %s, %s, %s)",
                mET_Height.getText(), mET_Width.getText(), mET_NumberWorkers.getText(), mET_Interval.getText());
        mWebView.loadUrl(url);
    }
});</pre>

1）WebView调用js也是通过loadUrl，并传递参数进去的，就不多介绍了。

2）读取assets中的文件使用"file:///android_asset/"前缀

4、使用安卓拍摄的照片来合成

1）获取拍摄图片后保存成文件，然后传递到javascript中，如步骤3

2）javascript调用本地图片，使用"[file:///"+文件路径](http://file:///"+文件路径)

5、获取合成的gif

上面的方法最后合成的gif是在webview中显示，当然我们需要将gif保存成文件，或者再次处理。

1）gifshot.createGIF()的回调中obj.image就是我们要的数据，需要回传android

2）javascript回调android的方法，可以用addJavascriptInterface()方法（这个方法试过，自己倒是没用好，还有api的限制，待学习）

3）我是通过javascript的alert("the data string")将数据回传的，然后在android中来监听jsAlert就可以了

<pre class="brush:java;toolbar:false">this.mWebView.setWebChromeClient(new WebChromeClient() {
    @Override
    public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
        //message is the base64 data of gif
        if (mListener != null) {
            mListener.onCreated(saveData2Gif(message));
            deleteTempFiles();
        }
        result.confirm();
        return true;
    }
});</pre>

6、html中base64的图片数据保存为文件

<pre class="brush:java;toolbar:false">public String saveData2Gif(String base64Data){
    if (base64Data == null) //图像数据为空
        return "";

    //保存gif文件名(路径自己定义)
    String saveFilePath = "xxxx.gif";

    //去掉前缀
//        base64Data = base64Data.substring("data:image/gif;base64,".length());
    base64Data = base64Data.substring(22);
    try
    {
        byte[] b = Base64.decode(base64Data, Base64.DEFAULT);
        //生成图片
        OutputStream out = new FileOutputStream(saveFilePath);
        out.write(b);
        out.flush();
        out.close();
        return saveFilePath;
    }
    catch (Exception e)
    {

        return "";
    }
}</pre>

大功告成啦，不过使用的效果Gif合成不是太理想，感觉分辨率都不是很高的样子，不知道哪里出了问题没有，看gifshot那里的演示图片效果很好的。

gif合成有待研究分析~（忘高手指点）