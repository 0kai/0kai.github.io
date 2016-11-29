---
title: Java判断子类是否继承父类的方法
layout: blog
categories: blog
tags: java
blogId: 49
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

奇葩的想法，看看子类是否继承父类的某一方法，然后在基类做对应的操作。

对应的问题：当子类重写了方法onSubscribe(Object)后，才会去注册监听器，避免过多无用的引用。

方案：Class的getDeclaredMethod()，判断该类**独有**的方法。

其实我是做了一个RxBus的分发，在基类中统一注册（仅当子类重写了该方法）、取消订阅。

部分代码如下：

```java
private void initSubscription() {
    // 判断子类是否重写了 onSubscribe() 方法
    Class clazz = getClass();
    while(clazz != BaseActivity.class) {
        try {
            clazz.getDeclaredMethod("onSubscribe", Object.class);
            break;
        } catch (NoSuchMethodException e) {
        }
        clazz = clazz.getSuperclass();
    }
    if (clazz == BaseActivity.class) {
        return;
    }

    mSubscription = RxBus.getInstance().toObservable()
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(new Action1<Object>() {
                @Override
                public void call(Object o) {
                    onSubscribe(o);
                }
            });
}

/**
 * 主线程操作，请勿做太多业务
 */
protected void onSubscribe(Object o) {
}
```