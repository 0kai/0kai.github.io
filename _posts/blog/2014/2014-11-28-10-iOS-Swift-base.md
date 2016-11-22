---
title: iOS/Swift开发从零开始(1)--Swift基础语法
layout: blog
categories: blog
tags: iOS swift
blogId: 10
---

充实一下自己，学习一下IOS开发。网上的教程很多，这里只是为了督促自己学习而写博客。

对于Object-C仅仅是纸上谈兵看过一下，跟其他语言相差太大，不是很懂（慢慢看吧）。

目前苹果发布了全新语言Swift，这个跟Lua/C语法有些相识，相对与OC很快能理解了。

本文介绍一下Swift的一些基本的语法。

### 1、常量和变量

*   使用前定义

<pre class="brush:cpp;toolbar:false">let constantValue = 10 //常量
var variableValue = 10 //变量</pre>

*   类型

Swift中类型会根据值来判断，也可以主动添加类型标注

<pre class="brush:cpp;toolbar:false">var a:String //字符串
var b:Int    //整形
var c:Float  //32位浮点数
var d:Double //64位浮点数
var e:Bool   //布尔值 true/false
var f:Array  //列
var g:Dictionary //字典
...</pre>

*   命名

可以使用任何字符命名（不过习惯上最好还是用英文吧）

不过，当然不能包含 数学符号，箭头，保留的（或者非法的）Unicode码位，连线与制表符，也不能哟哦那个数字开头。

<pre class="brush:cpp;toolbar:false">var π = 3.14159
var 变量 = "我是变量"
var ?!?! = "what?"</pre>

*   打印输出

<pre class="brush:cpp;toolbar:false">println(value) //任何变量都可以打印</pre>

*   注释

跟C、Java等一样的

<pre class="brush:cpp;toolbar:false">// 句子末尾注释
/*
单行、多行注释
*/</pre>

*   分号

有没有发现上面写的语句都没有用分号结尾。你要写也可以咯;;;;;

*   数值型字面量

<pre class="brush:cpp;toolbar:false">let decimalInteger = 17       //普通整数
let binaryInteger = 0b10001   //二进制前缀: 0b
let octalInteger = 0o21       //八进制前缀: 0o
let hexadecimalInteger = 0x11 //十六进制前缀: 0x</pre>

*   类型转换

<pre class="brush:cpp;toolbar:false">let Pi = 3.14159
let integerPi = Int(Pi) //强制转换，要显示写出来</pre>

*   类型别名

```
typealias  NewInt = Int //看你干嘛用咯
```

*   元组

```
let http404Error = (404, "Not Found") //任意类型都可以组合
```

*   可选值

这个比较新鲜（其实跟lua中差不多，lua的变量每值就是nil）,可以用判断语句

### 2、控制语句

*   if语句

```
if 1 + 1 == 2 {
    //is true
}else if 1 + 1 == 3{
    //is false
}else {
}

var a:String? //此时值是nil
if a {
}else {
    //here
}
```

*   for循环

```
//for-in
for index in 1...5 { //从1到5遍历
    println(index)
}

for _ in 1...5 {//仅仅遍历5次， _ 表示不获取值
}

//遍历数组
let arr = ["A", "B", "C", "D"]
for a in arr {
    println(a)
}

//遍历字典
let dict = ["name":"ZS", "age":9, "sex":"F"]
for (key, value) in dict {
    println("key is: \(key), value is: \(value)")
}

//遍历字符串
for c in "Hello Swift" {
}

//for-condition-increment 条件递增
for var index = 0; index < 3; ++index {
}
```

*   while循环

```
while a==b {
}

//do-while
do {
}while a==b
```

*   switch语句

switch必须是完整的，就是说至少要有一个要执行，添加default咯。

而且不需要写break，每个case下面必须有执行语句。

```
switch "a value" {

case "value 1":
    println("value")

case "value 2", "value 3"://如果想多个case执行同一个语句
    println("case 2")

case 1...3://范围匹配
    println(" ")

case (0, _)://元组
    println(" ")

case let (x, y) where x == y: //where语句
    continue

default:
    println('default')
}
```

*   控制跳转语句

```
//continue
//break
//return

//fallthrough 跑完这个case还要走下个case
let integerToDescribe = 5 
var description = "The number \(integerToDescribe) is" 
switch integerToDescribe { 
case 2, 3, 5, 7, 11, 13, 17, 19: 
    description += " a prime number, and also" 
    fallthrough 
default: 
    description += " an integer." 
} 
println(description) 
// prints "The number 5 is a prime number, and also an integer."
```

### 3、函数

```
//有参数，有返回
func sayHello(name:String)->String{
    return "Hello, " + name + "!"
}
println(sayHello("kkkk"))

//多个返回值
func sayHellos(name1:String, name2:String) -> (value:String, value2:String){
    value = "Hello, " + name1 + "!"
    value2 = "Hello, " + name2 + "!"
    return (value, value2)
}

//函数外部形参名
//通常函数形参都是给函数内部使用的，外部形参则是在函数外部调用时使用的
func afun(eName localName: String) {
    //only can use localName
}
afun(eName: "zhang")//要写名字了

//通常外部形参与形参名字相同，使用#号即可
func afun(#name: String) {
}
afun(name: "zhang")

//参数默认值
func afun(name: String = "zhang") {
}

//可变形参
func add(numbers: Int...) -> Int {
    var total: Int = 0
    for n in numbers {
        total += n
    }
    return total
}

//函数的形参默认是常量，如果在内部修改会报错的。如果需要修改形参值，可以使用变量形参
func afun(var num: Int) -> Int {
    return num * 2
}

//inout形参，类似于C中传递指针变量，可以在函数内修改值
func swap( inout a: Int, inout b: Int) {
    a = a + b
    b = a - b
    a = a - b
}
swap(&a, &b)//调用的时候要加&

//使用函数类型，跟给别名差不多,函数也可以作为另一个函数的参数/返回值
var newFun: (Int, Int) -> Int = oldFun

//嵌套函数
func first() {
    func second() {
    }
}
```

### 4、类

*   类与结构体的定义

Swift中类和结构体其实差不多（类有继承，计数等附加功能），只不过类的用法更多，用于面向对象。而且类只要在一个文件中写了，在其他文件都是能直接调用的，不需要声明。

```
struct Resolution { //结构体
    var width = 0 
    var heigth = 0 
} 
class VideoMode { //类
    var width = 0 
    var heigth = 0 
}
```

*   类是引用类型

与值类型不同，类被赋值给另一个变量仅仅是引用，并不是拷贝。（与java的类引用/C指针差不多）

*   恒等运算符

判断两个类变量是否是引用同一个类实例（等于，不等于是判断值的）

> 等价于 ===
> 
> 不等价于 !==

*   类和结构体的选择

结构体：赋值是值拷贝，保存值的，如一些基本属性集合（几何图形，坐标等）

类：引用赋值

*   类继承

```
class A {
    init(){
    }
    func a() -> Int {
        return 1
    }
    @final func b() {
    }
}
class B: A {
    init() {
        super.init()
        //...
    }
    override func a() -> Int {
        return 2
    }
    //无法重写b()
}
```

*   类嵌套

Swift中没有包的概念，可以用嵌套来代替

```
class com {
    class Z0Kai {
        class A {
        }
        class B {
        }
    }
}
var a = com.Z0Kai.A()
var b = com.Z0Kai.B()
```

### 5、更多

> 扩展--extensions
> 
> 协议--protocols
> 
> 等等

慢慢学习吧，语言博大精深。