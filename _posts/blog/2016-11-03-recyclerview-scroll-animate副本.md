---
layout: blog
title:  "随着RecyclerView滚动的动画"
categories: android
tags: blog android
blogid: 1
---
## 随着RecyclerView滚动的动画

> 注：本文只说明大概的实现过程，并不放置完整的代码

#### 效果
![]({{site.mediaurl}}/blog/{{page.blogid}}/image-2016110302.gif)
![]({{site.mediaurl}}/blog/{{page.blogid}}/image-2016110301.png)

#### 需求
1. B可以横向滚动，C并不在B中（因为高度不一致）
2. C随着B移动，且随着C的移动B的高度会变化
3. C区可以左右滑动，也可以点击

#### 实现
##### 1、左右滑动过程
- B区采用RecyclerView, 第一个item放置一个空白item
- C区为相对布局在B区上方
- C区不设置点击事件，所以滑动C可以传递到B，完成滑动事件

##### 2、C随着B滑动，且B高度变化
- 这里是对RecyclerView的Scroll做监听
```java
mProductsRcv.addOnScrollListener(new RecyclerView.OnScrollListener() {
    @Override
    public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
        super.onScrollStateChanged(recyclerView, newState);
        if (newState == RecyclerView.SCROLL_STATE_IDLE) {
            //滑动停止后处理，可以做回弹工作
        }
    }

    @Override
    public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
        super.onScrolled(recyclerView, dx, dy);
		//滑动过程，记录dx，从而让C随着移动
    }
});
```
- 记录dx可以控制C的滑动，使用`setTranslationX`
- B的高度变化，目前是`adapter.notifyDataSetChanged`
- 手指放开回弹效果：在滑动停止时判断滑动的距离，看是否需要回弹，用`smoothScrollToPosition`

##### 3、C既能点击又能滑动B区
- C不设置Click事件就能滑动B区
- 点击事件就用本item(含ABC的view)做`onInterceptTouchEvent`拦截
```java
@Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        switch (ev.getAction()) {
            case MotionEvent.ACTION_DOWN:
                mTouchX = ev.getX();
                mTouchY = ev.getY();
                break;
            case MotionEvent.ACTION_MOVE:
                if (checkIsMove(ev.getX(), ev.getY())) {
                    mTouchX = mTouchY = 0;
                    isBrandInTouch = false;//不是点击事件了
                }
                break;
            case MotionEvent.ACTION_UP:
                if (mTouchX != 0 && mTouchY != 0 && isBrandInTouch
                        && !checkIsMove(ev.getX(), ev.getY())
                        && mBrandClickListener != null) {
                    // 触发点击事件咯
                }
                mTouchX = mTouchY = 0;
                isBrandInTouch = false;
                break;
        }
        return super.onInterceptTouchEvent(ev);
    }
	// mTouchSlop是较小点击判断
	// ViewConfiguration.get(getContext()).getScaledTouchSlop(); 
	private boolean checkIsMove(float x, float y) {
        return Math.abs(mTouchX - x) > mTouchSlop || Math.abs(mTouchY - y) > mTouchSlop;
    }
```