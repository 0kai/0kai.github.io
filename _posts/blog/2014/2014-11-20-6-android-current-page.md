---
title: Android中判断当前界面的方法
layout: blog
categories: blog
tags: android
blogId: 6
---

在“[桌面宠物：OP版]({{site.url}}/app/2014/08/01/4-pet-op)”应用中使用到，判断当前是否是手机的桌面。

研究参考了一些文章，有的说到了点，但都没有说明清楚。

本文代码经过实践，仅供参考！

### 1、获得属于桌面的应用

*   包括系统原装Launcher、Go桌面等等

*   这些应用都会包含："android.intent.category.Home"；

*   所以只要找出所有的声明为Home的activity的"android.intent.action.MAIN"所在的包名就可以了！

*   代码：获取桌面的包名列表

```
private List<String> getHomes() {  
    List<String> names = new ArrayList<String>();  
    PackageManager packageManager = this.getPackageManager();  
    //属性  
    Intent intent = new Intent(Intent.ACTION_MAIN);  
    intent.addCategory(Intent.CATEGORY_HOME);  
    List<ResolveInfo> resolveInfo = packageManager.queryIntentActivities(intent,  
            PackageManager.MATCH_DEFAULT_ONLY);  
    for(ResolveInfo ri : resolveInfo){  
        names.add(ri.activityInfo.packageName);  
        System.out.println(ri.activityInfo.packageName);  
    }  
    return names;  
}
```

### 2、在应用中使用

*   当前不是自己app，所以在服务中判断

*   既然要判断当前界面，那就要判断当前的RunningTasks中的第一个

*   引入ActivityManager获取RunningTasks

*   取出RunningTasks中的topActivity的PackageName

*   最后跟第一步得到的List做比较即可

*   别忘了添加权限

```
<uses-permission android:name="android.permission.GET_TASKS" />
```

*   代码：

```
public boolean isHome(){  
    ActivityManager mActivityManager = (ActivityManager)getSystemService(Context.ACTIVITY_SERVICE);  
    List<RunningTaskInfo> rti = mActivityManager.getRunningTasks(1);  
    return homePackageNames.contains(rti.get(0).topActivity.getPackageName());  
}
```

问：如何判断当前界面是否在自己的应用界面？

答：跟第一步一致，把应用的activity路径加入到判断列表中。

问：如果是用activity，那isHome不一直是这个activity了吗？

答：当然是用service或者线程来做，否则怎么会到其他应用界面去。