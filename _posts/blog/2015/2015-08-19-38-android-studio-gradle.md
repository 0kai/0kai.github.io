---
title: Android Studio中Gradle的一些配置
layout: blog
categories: blog
tags: android
blogId: 38
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

AS也用了一段时间了，发现Gradle有些配置还是很方便的。不过还不是很熟悉，网上也有很多教程，自己记录的才印象深刻。

### 1、配置AndroidManifest.xml中的内容

<pre class="brush:html;toolbar:false">gradle:
manifestPlaceholders = [UMENG_CHANNEL_VALUE: "apj"]

manifest.xml:
<meta-data android:name="UMENG_CHANNEL" android:value="${UMENG_CHANNEL_VALUE}" /></pre>

### 2、多渠道打包

<pre class="brush:html;toolbar:false">manifest.xml:
<meta-data android:name="UMENG_CHANNEL" android:value="${UMENG_CHANNEL_VALUE}" />

gradle:
//for umeng channel,这是各个渠道名称
productFlavors {
    apj {}
    z0kai {}
    xiaomi {}
    qh360 {}
    baidu {}
    wandoujia {}
    qq {}
}

productFlavors.all {
    flavor -> flavor.manifestPlaceholders = [UMENG_CHANNEL_VALUE: name]
}

//这是打包输出
buildTypes {
    debug {
    }
    release {
        applicationVariants.all { variant ->
            variant.outputs.each { output ->
                def outputFile = output.outputFile
                if (outputFile != null && outputFile.name.endsWith('.apk')) {
                    // 输出apk名称为aipaiji_v1.0_20150115_xxx.apk
                    def fileName = "aipaiji_v${defaultConfig.versionName}(${defaultConfig.versionCode})_${variant.productFlavors[0].name}.apk"
                    output.outputFile = new File(outputFile.parent, fileName)
                }
            }
        }
    }
}</pre>

### 3、Gradle来设置java中的值

<pre class="brush:html;toolbar:false">android {
    buildTypes {
        debug {
            buildConfigField 'boolean', 'A_BOOLEAN', 'true'
            buildConfigField 'String', 'A_STRING', '\"string\"'
        }

        release {
            buildConfigField 'boolean', 'A_BOOLEAN', 'false'
            buildConfigField 'String', 'A_STRING', '\"string\"'
        }
    }
}</pre>

然后会在 BuildConfig.java里面生成，调用BuildConfig.A_BOOLEAN即可。记得要先编一次gradle。

对于String要加 \" 才可以

### 3、定义参数，仅在Gradle中使用

<pre class="brush:html;toolbar:false">def LOCAL_DEMO = false</pre>

更多待续，继续学习。

欢迎关注《爱拍纪》，加油！