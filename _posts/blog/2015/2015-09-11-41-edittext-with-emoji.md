---
title: EditText中包含表情符号
layout: blog
categories: blog
tags: android
blogId: 41
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

聊天表情越来越丰富了，整理一下表情图片与EditText的结合（TextView同理）

先上个图：

![]({{media_path}}/1.png)

===========

1、通过ImageSpan将图片嵌入到文本中

<pre class="brush:java;toolbar:false">Drawable drawable;//图片
...
//让表情符号跟文字的大小一致
drawable.setBounds(0, 0, editText.getLineHeight(), editText.getLineHeight());
ImageSpan imageSpan = new ImageSpan(drawable);//也可以用Bitmap创建

//{:1:}对应一个表情符号
SpannableString spannableString = new SpannableString("{:1:}haha");
//0，5是{:1:}，在原来文本的位置
spannableString.setSpan(imageSpan, 0, 5, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);

editText.setText(spannableString);</pre>

2、利用反射去获取图片

<pre class="brush:java;toolbar:false">//key是图片名字，在drawable中，app package
getContext().getResources().getIdentifier(key, "drawable", getContext().getPackageName())</pre>

3、正则表达式来替换表情符号

<pre class="brush:java;toolbar:false">private CharSequence replace(String text) {
    SpannableString spannableString = new SpannableString(text);
    int start = 0;
    //{:n:} 1-2数字
    Pattern pattern = Pattern patternPattern.compile("\\{:\\d{1,2}:\\}", Pattern.CASE_INSENSITIVE);

    Matcher matcher = pattern.matcher(text);
    //遍历
    while (matcher.find()) {
        try{
            //获取对应的表情字段{:n:}中的n
    	String faceText = matcher.group();
    	String key = faceText.substring(2, faceText.lastIndexOf(":"));
    	key = String.format("face_%03d", Integer.parseInt(key));

    	//利用反射获取图片		
    	Drawable drawable = getContext().getResources().getDrawable( getContext().getResources().getIdentifier(key, "drawable", getContext().getPackageName()) );
    	drawable.setBounds(0, 0, getLineHeight(), getLineHeight());
    	ImageSpan imageSpan = new ImageSpan(drawable);
    	//防止找到重复的				
    	int startIndex = text.indexOf(faceText, start);
    	int endIndex = startIndex + faceText.length();
    	if (startIndex >= 0)
    	    spannableString.setSpan(imageSpan, startIndex, endIndex, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
    	start = (endIndex - 1);
        }catch(Exception e){
    	e.printStackTrace();
        }
    }
}</pre>

4、自定义EditText，让表情默默的显示

<pre class="brush:java;toolbar:false">public class EmoticonsEditText extends EditText {

	...

	@Override
	public void setText(CharSequence text, BufferType type) {
		if (!TextUtils.isEmpty(text)) {
			super.setText(replace(text.toString()), type);
		} else {
			super.setText(text, type);
		}
	}

	private CharSequence replace(String text) {...}
}</pre>

5、示意图的表情面板

（稍后再写一篇![](http://img.baidu.com/hi/jx2/j_0057.gif)）