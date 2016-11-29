---
title: 自己写个RxBus
layout: blog
categories: blog
tags: android
blogId: 50
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

Android事件分发

*   广播方式（写个广播挺麻烦的）

*   回调方式（耦合大大的）

*   otto/EventBus（方便实用~~）

还有最近比较火的RxJava方式，如果没听过，就要去学学咯。下面来说说我应用到项目的RxBus方式。（[参考](http://blog.kaush.co/2014/12/24/implementing-an-event-bus-with-rxjava-rxbus/)）

RxBus代码

```java
public class RxBus {
    private static volatile RxBus mInstance;

    private final SerializedSubject mBus;

    public RxBus() {
        mBus = new SerializedSubject<>(PublishSubject.create());
    }

    // 单例RxBus
    public static RxBus getInstance() {
        if (mInstance == null) {
            synchronized (RxBus.class) {
                if (mInstance == null) {
                    mInstance = new RxBus();
                }
            }
        }
        return mInstance;
    }

    public void post (Object o) {
        mBus.onNext(o);
    }

    // 多个订阅，自己写instanceof过滤
    public Observable<Object> toObservable() {
        return mBus;
    }

}
```

订阅方式在BaseActivity中，考虑到订阅后，需要取消订阅，所以每个Activity仅仅有一个订阅；

但是又有些Activity并没有需要订阅，就有些浪费，那么就判断当子类需要订阅才订阅。

初始化代码

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

事件发送

```java
RxBus.getInstance().post(new UpdateCartNumEvent());
```

事件接收Activity中

```java
@Override
protected void onSubscribe(Object o) {
    if (o instanceof UpdateCartNumEvent) {
        //...
    } else if (o instanceof MallTopEvent) {
        //...
    }
}
```

完事了

有几个我觉得不好的缺点：

1、采用到反射去判断是否重载，估计每个都注册也没什么

2、订阅者接收到的都是Object，而不是直接的订阅事件，还需要instanceof

3、接收者接收到的都是在主线程，不能更好的RxJava了

需要学习更好的方式，欢迎讨论~~~