---
title: Git脚本获取最近版本修改记录
layout: blog
categories: blog
tags: android gradle
blogId: 54
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

> 本文介绍从git log中获取最近两次版本之间的提交记录，最后附上在gradle的配置

#### 1. 获取最近版本配置文件的commit

由于修改build.gradle并不一定是改版本号，所以取10条

``` bash
git log -10 --pretty=format:'%h' app/build.gradle
```

输出：

``` bash
35be678
ad3a870
4b2bd33
...
```

#### 2. 从commit记录中判断是否是修改版本号的

``` bash
git show 35be678
```

从输出结果中判断是否包含版本号那行的修改

``` groovy
output.contains("-def VERSION_CODE") && output.contains("+def VERSION_CODE")
```

#### 3. 用最近2次的版本修改记录，来获取之间的提交记录

``` bash
git log preCommit..lastCommit --pretty=format:'- %s (%cN, %cr)' ../../android
```

最后结果

``` bash
- 删除空间的临时图片文件 #3363 (lff, 22 hours ago)
- 生活家空间图片压缩，修复生活家空间数据没有刷新的问题 #3359 (lff, 22 hours ago)
- 优化热点效果，生活家优惠券提示调整 #3350 (lff, 26 hours ago)
- 推送弹框按钮调整 #3349 (Renkai Zhang, 28 hours ago)
```

> 至于输出格式可以根据喜好配置

#### 5. 在android中gradle的配置源码

``` groovy
/**
 * 获取命令行输出结果：List<String>
 * @param execMap ["git", "log"]
 */
def getExecLines(def execMap) {
    Process p = execMap.execute()
    def lines = p.inputStream.readLines()
    p.inputStream.close()
    p.destroy()
    lines
}

def getExecValue(def execMap) {
    StringBuilder sb = new StringBuilder();
    for (def line : getExecLines(execMap)) {
        sb.append("\n").append(line)
    }
    if (sb.length() > 0) {
        sb.deleteCharAt(0)
    }
    sb.toString().replace("'", "")
}

def isVersionChanged(String value) {
    value.contains("-def VERSION_CODE") && value.contains("+def VERSION_CODE")
}

/**
 * 获取版本之间的提交记录
 */
def getVersionLog() {
    // 找到最近两个版本号变更记录
    def buildLogs = getExecLines(["git", "log", "-10", "--pretty=format:'%h'", "app/build.gradle"])
    def lastCommit
    def preCommit
    for(def line : buildLogs) {
        line = line.replace("'", "")
        def log = getExecValue(["git", "show", line])
        if (isVersionChanged(log)) {
            if (lastCommit == null) {
                lastCommit = line
            } else if (preCommit == null) {
                preCommit = line
            } else {
                break
            }
        }
    }
    // 判断当前是不是仅仅本地修改了版本号
    def currentDiff = getExecValue(["git", "diff", "app/build.gradle"])
    def withoutFirstLine = true
    if (isVersionChanged(currentDiff)) {
        withoutFirstLine = false
        preCommit = lastCommit
        lastCommit = getExecValue(["git", "log", "-1", "--pretty=format:'%h'", "../../android"])
    }

    // git log ad3a870..35be678 --graph --pretty=format:'- %s' ../../android
    def result = getExecValue(["git", "log", preCommit + ".." + lastCommit, "--pretty=format:'- %s (%cN, %cr)'", "../../android"])
    if (withoutFirstLine) {
        result = result.substring(result.indexOf("\n") + 1)
    }
    if (result.trim().length() == 0) {
        result = "- 只是改了版本号"
    }
    result
}
```