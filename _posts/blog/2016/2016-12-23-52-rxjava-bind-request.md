---
title: RxJava进阶-绑定事件处理
layout: blog
categories: blog
tags: android RecyclerView
blogId: 52
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}


> 摘要：在网络请求时，要弹出加载框或按钮不能二次点击，rxjava一句话搞定

#### 传统方式
1. 在请求网络开始前弹出加载框，禁止按钮点击
2. 请求成功、失败等情况都要在隐藏加载框，按钮可点击

#### 实现(写在工具类RxUtils.java)
##### 加载框的绑定 Transformer

```java
public static  <T> Observable.Transformer<T, T> loadingDialog() {
    final AppLoadingDialog dialog = new AppLoadingDialog();
    return new Observable.Transformer<T, T>() {
        @Override
        public Observable<T> call(Observable<T> tObservable) {
            return tObservable.doOnSubscribe(new Action0() {
                @Override
                public void call() {
                    dialog.show();
                }
            }).doOnCompleted(new Action0() {
                @Override
                public void call() {
                    dialog.dismiss();
                }
            }).doOnError(new Action1<Throwable>() {
                @Override
                public void call(Throwable throwable) {
                    dialog.dismiss();
                }
            });
        }
    };
}
```

##### 按钮Enable的绑定 Transformer

```java
public static <T> Observable.Transformer<T, T> disableButtons(final View... views) {
    return new Observable.Transformer<T, T>() {
        @Override
        public Observable<T> call(Observable<T> tObservable) {
            return tObservable.doOnSubscribe(new Action0() {
                @Override
                public void call() {
                    for (View v : views) {
                        v.setEnabled(false);
                    }
                }
            }).doOnCompleted(new Action0() {
                @Override
                public void call() {
                    for (View v : views) {
                        v.setEnabled(true);
                    }
                }
            }).doOnError(new Action1<Throwable>() {
                @Override
                public void call(Throwable throwable) {
                    for (View v : views) {
                        v.setEnabled(true);
                    }
                }
            });
        }
    };
}
```

##### 调用 compose

```java
observable.
.compose(RxUtils.<ApiPojo<Object>>disableButtons(disableView))
.compose(RxUtils.<ApiPojo<Object>>loadingDialog())
.subscribe();
```
一句话，是不是很简单呢。loadingDialog出现时界面已经不能点击了，所以并不需要disableButton

##### 困惑
- ApiPojo<Object>在loadingDialog无参数的时候会自动补齐
- 然而在disableButtongs带参数的情况并不会补齐泛型，这点有些疑惑