---
title: Android，ScrollView嵌套列表
layout: blog
categories: blog
tags: android
blogId: 37
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

一个滚动界面，包含多个可滚动视图（ListView/GridView/ScrollView等)；虽然也有人建议不要这么做，但是还是有很多需求。

1.  用LinearLayout把item一个一个加进去

2.  计算View的高度，然后设置height，然后全部放在同一个ScrollView里面

3.  ListView里面的item根据不同的id去设置不同的视图，达到不同的ListView效果

让ListView/GridView自动适应高度的方法，达到完整显示：

<pre class="brush:java;toolbar:false">import android.content.Context;
import android.util.AttributeSet;
import android.widget.ListView;

/**
 * Created by renkai on 15/7/30.
 */
public class InsideListView extends ListView {
    public InsideListView(Context context) {
        super(context);
    }

    public InsideListView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public InsideListView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int expandSpec = MeasureSpec.makeMeasureSpec(
                Integer.MAX_VALUE >> 2, MeasureSpec.AT_MOST);
        super.onMeasure(widthMeasureSpec, expandSpec);
    }
}</pre>

遇到一个问题：

界面中有ListView，还有一个StaggeredGridView，要达到同时在一个ScrollView中展示。StaggeredGridView不能使用上述方法，这是继承于AbsListView的，本身的onMeasure不能对child进行自动计算。

解决方案：

ListView和其他视图作为StaggeredGridView的HeaderView，哈哈，搞定了。

很多时候HeaderView和FooterView还是很有用的，多学习吧。

（简单纪录一下，继续学习）