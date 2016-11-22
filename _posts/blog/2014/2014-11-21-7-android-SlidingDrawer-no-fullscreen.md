---
title: Android自定义SlidingDrawer非全屏使用
layout: blog
categories: blog
tags: android SlidingDrawer
blogId: 7
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

SlidingDrawer是一个滑动抽屉，不过一般情况都是只能全屏显示了。

想要实现拨号键盘那样的效果layout="wrap_content"却没有效果。

原因：源码SlidingDrawer中的onMeasure()方法中layout_height值一直都是fill_parent了。

如果我们设置layout_height为一个固定值也是OK的。

以下重写SlidingDrawer，实现效果如右图：

![]({{media_path}}/1.jpeg) --> ![]({{media_path}}/2.jpeg)

代码：

```
/** 
 * 使得SlidingDrawer在屏幕低端，而不会填满整个屏幕 
 * @author akai 2012-03-06 
 */  
public class WrapSlidingDrawer extends SlidingDrawer {  
    private boolean mVertical;  
    private int mTopOffset;  

    public WrapSlidingDrawer(Context context, AttributeSet attrs, int defStyle) {  
        super(context, attrs, defStyle);  
        int orientation = attrs.getAttributeIntValue("android", "orientation", ORIENTATION_VERTICAL);  
        mTopOffset = attrs.getAttributeIntValue("android", "topOffset", 0);  
        mVertical = (orientation == SlidingDrawer.ORIENTATION_VERTICAL);  
    }  

    public WrapSlidingDrawer(Context context, AttributeSet attrs) {  
        super(context, attrs);  
        int orientation = attrs.getAttributeIntValue("android", "orientation", ORIENTATION_VERTICAL);  
        mTopOffset = attrs.getAttributeIntValue("android", "topOffset", 0);  
        mVertical = (orientation == SlidingDrawer.ORIENTATION_VERTICAL);  
    }  

    @Override  
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {  
        int widthSpecMode = MeasureSpec.getMode(widthMeasureSpec);  
        int widthSpecSize =  MeasureSpec.getSize(widthMeasureSpec);  
        int heightSpecMode = MeasureSpec.getMode(heightMeasureSpec);  
        int heightSpecSize =  MeasureSpec.getSize(heightMeasureSpec);  

        final View handle = getHandle();  
        final View content = getContent();  
        measureChild(handle, widthMeasureSpec, heightMeasureSpec);  

        if (mVertical) {  
            int height = heightSpecSize - handle.getMeasuredHeight() - mTopOffset;  
            content.measure(widthMeasureSpec, MeasureSpec.makeMeasureSpec(height, heightSpecMode));  
            heightSpecSize = handle.getMeasuredHeight() + mTopOffset + content.getMeasuredHeight();  
            widthSpecSize = content.getMeasuredWidth();  
            if (handle.getMeasuredWidth() > widthSpecSize) widthSpecSize = handle.getMeasuredWidth();  
        }  
        else {  
            int width = widthSpecSize - handle.getMeasuredWidth() - mTopOffset;  
            getContent().measure(MeasureSpec.makeMeasureSpec(width, widthSpecMode), heightMeasureSpec);  
            widthSpecSize = handle.getMeasuredWidth() + mTopOffset + content.getMeasuredWidth();  
            heightSpecSize = content.getMeasuredHeight();  
            if (handle.getMeasuredHeight() > heightSpecSize) heightSpecSize = handle.getMeasuredHeight();  
        }  

        setMeasuredDimension(widthSpecSize, heightSpecSize);  
    }  
}
```

使用方法：

*   本代码可以直接使用，新建一个类

*   在布局文件中，原先使用<SlidingDrawer>替换为<packagePath.WrapSlidingDrawer>

*   最后添加layout_width="wrap_content"