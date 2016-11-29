---
title: 安卓WebView中上传文件的方式
layout: blog
categories: blog
tags: android
blogId: 43
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

WebView中的元素```<input type="file">```上传文件/图片，需要调用到系统的文件。仅仅是js enable也是不行的。简单记录一下。

1、首先要用个变量处理上传消息

```
private ValueCallback<Uri> mUploadMessage;
```

2、创建WebChromeClient来处理需要上传文件的事件

```
WebChromeClient wvcc = new WebChromeClient() {  
    // For Android < 3.0
    public void openFileChooser(ValueCallback<Uri> uploadFile) {
        openFileChooser( uploadFile, "*/*" );
    }

    // For Android 3.0+
    public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {
            if(mUploadMessage != null){
                return;
            }
            mUploadMessage = uploadMsg;
            showPics(acceptType);
     }

     // For Android  > 4.1.1
     public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
            openFileChooser(uploadMsg, acceptType);
     }

};
```

注：对于不用SDK版本似乎不一样的处理，showPics(type)的话，就是打开相机或者相册咯。

2.1、简单选择文件的方式

```
Intent i = new Intent(Intent.ACTION_GET_CONTENT);  
i.addCategory(Intent.CATEGORY_OPENABLE);  
i.setType(acceptType);  
startActivityForResult(Intent.createChooser(i, "选择文件"), 0);
```

3、需要在onActivityResult中去处理回传的图片地址，传递给webview，至于html怎么显示，那就跟网页一样了，不需要我们代码处理了

```
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (null == mUploadMessage)
        return;
    Uri result = data == null || resultCode != RESULT_OK ? null : data.getData();
    mUploadMessage.onReceiveValue(result);
    mUploadMessage = null;
}
```

============

貌似4.4以后这个openFileChooser调用不到啦

对于5.0，又有新接口

```java
// Android 4.4, 4.4.1, 4.4.2
// openFileChooser function is not called on Android 4.4, 4.4.1, 4.4.2,
// you may use your own java script interface or other hybrid framework.      

// file upload callback (Android 5.0 (API level 21) -- current) (public method)
@SuppressWarnings("all")
public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
    String acceptTypes[] = fileChooserParams.getAcceptTypes();
    String acceptType = "";
    for (int i = 0; i < acceptTypes.length; ++ i) {
        if (acceptTypes[i] != null && acceptTypes[i].length() != 0)
            acceptType += acceptTypes[i] + ";";
    }
    if (acceptType.length() == 0)
        acceptType = "*/*";

    final ValueCallback<Uri[]> finalFilePathCallback = filePathCallback;
    ValueCallback<Uri> uploadMsg = new ValueCallback<Uri>() {
        @Override
        public void onReceiveValue(Uri value) {

            Uri[] result;
            if (value != null)
                result = new Uri[]{value};
            else
                result = null;

            finalFilePathCallback.onReceiveValue(result);

        }
    };
   openFileChooser(uploadMsg, acceptType);

    return true;
}
```

============

学学、写写