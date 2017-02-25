---
title: Gradle for Android
layout: blog
categories: blog
tags: android gradle
blogId: 53
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

> 分享一些关于Gradle在Android中的使用（内容来自内部分享的时候做的），创建一些有用的编译Task，能有效的改善开发效率。欢迎讨论。

-
-
-

[TOC]

# About Gradle?

## Accelerate developer productivity

> From mobile apps to microservices, from small startups to big enterprises, Gradle helps teams build, automate and deliver better software, faster.


### Build Anything
> Write in Java, C++, Python or your language of choice. Package for deployment on any platform. Go monorepo or multi-repo. And rely on Gradle's unparalleled versatility to build it all.

### Automate Everything
> Use Gradle's rich API and mature ecosystem of plugins and integrations to get ambitious about automation. Model, integrate and systematize the delivery of your software from end to end.

### Deliver Faster
> Scale out development with elegant, blazing-fast builds. From compile avoidance to advanced caching and beyond, we pursue performance relentlessly so your team can deliver continuously.

-
-
-

# Examples(for Android)
## Case 1: Release Test Version
### Original Tasks

```
graph LR
A[release apk]
B[upload to Fir.im]
C[modify download password]
D[notify DingTalk]
A --> B
B --> C
C --> D
```

#### Command

```
./gradlew publishRelease
```

#### Code

``` gradle
def PASSWORD = String.format("%04d", (int)(Math.random() * 9999))
def RELEASE_NOTE = '来自' + System.properties['user.name'] + '的Gradle自动发布'

task notifyDingTalk(type: Exec) {
    StringBuilder sb = new StringBuilder();
    sb.append("curl -X POST")
        .append(" -d name=不多不少家居")
        .append(" -d platform=Android")
        .append(" -d version=").append(android.defaultConfig.versionName)
        .append(" -d link=").append("http://fir.im/app_down")
        .append(" -d password=").append(PASSWORD)
        .append(" -d desc=").append(RELEASE_NOTE)
        .append(" https://example.com/1/web-hooks/app");

    commandLine 'sh', '-c', sb.toString()
}

task updateFirPasswd(type: Exec) {
    commandLine 'sh', '-c', ('curl -X PUT -d passwd=' + PASSWORD + ' -d api_token=your_app_token http://api.fir.im/apps/576a46....0002f')
}

// fir.im task 'publishApkRelease' include assembleRelease
task publishRelease(dependsOn:'publishApkRelease') {
    group = "publish"
    doFirst {
        updateFirPasswd.execute()
    }
    doLast {
        notifyDingTalk.execute()
    }
}

```

## Case 2: Release official Apks
### Original Tasks

```
graph TD
A0(start)
A[release apk]
B{open jiagu tool}
B1{login}
B2[config]
B3[upload]

C1(Get official Apks)
C2[upload mapping.txt to bugly]
D[upload to app stores]

A0 --> A
A --> B
A --> C2

subgraph 360jiagu
B --> |Yes| B1
B --> |Download| B
B1 --> |No| B1
B1 --> |Yes| B2
B2 --> B3
end

B3 --> C1

C1 -.-> D

```

#### Command

```
./gradlew releaseApks
```

#### Code

``` gradle
task download360jiagu() {
    doFirst {
        File zipFile = file("${linkProject}360jiagu.zip")
        if (!zipFile.exists()) {
            exec {
                executable = 'curl'
                args = ['-o', "${linkProject}360jiagu.zip", "http://down.360safe.com/360Jiagu/360jiagubao_mac.zip"]
            }
        }
    }
    doLast {
        ant.unzip(src: "${linkProject}360jiagu.zip", dest: "${linkProject}jiagu")
    }
}

task releaseApks(dependsOn: 'assembleRelease') {
    doFirst {
        File jarFile = file("${linkProject}jiagu/jiagu/jiagu.jar")
        if (!jarFile.exists()) {
            download360jiagu.execute()
        }
    }
    group = "publish"
    doLast {
        // 1. login
        exec {
            executable = 'java'
            args = ['-jar', "${linkProject}jiagu/jiagu/jiagu.jar", '-login',
                    '360_user_account', 'your_password']
        }
        // 2. import sign
        exec {
            executable = 'java'
            args = ['-jar', "${linkProject}jiagu/jiagu/jiagu.jar", '-importsign',
                    "${linkProject}android-key-store.jks",
                    signingConfigs.config.storePassword,
                    signingConfigs.config.keyAlias,
                    signingConfigs.config.keyPassword]
        }
        // 3. import channel
        exec {
            executable = 'java'
            args = ['-jar', "${linkProject}jiagu/jiagu/jiagu.jar", '-importmulpkg',
                    "${linkProject}channelInfo.txt"]
        }
        // 4. other config none
        exec {
            executable = 'java'
            args = ['-jar', "${linkProject}jiagu/jiagu/jiagu.jar", '-config', '-']
        }
        // you can also config in the tools instead of this 4 stop above 
        // output channel packages
        File apkOutputFile = file("${System.properties['user.home']}/Desktop/bdbs/")
        apkOutputFile.mkdirs()
        exec {
            executable = 'java'
            args = ['-jar', "${linkProject}jiagu/jiagu/jiagu.jar", '-jiagu',
                    output.outputFile.getAbsolutePath(),
                    apkOutputFile.getAbsoluteFile(),
                    '-autosign', '-automulpkg']
        }
    }

```

# Groovy
## Introduction
- Derived from Java
- Runs on JVM
- Simpler
- Straightforward

``` groovy
// in java
System.out.println("Hello world!");

// in groovy
println 'Hello world!'

// variables
def name = 'Luffy'
def greeting = "Hello, $name!"
def name_size = "Your name is ${name.size()} characters long."

def method 'size'
name."method"()

if (!password?.trim()) {
    println password
}
```

## Class and members
``` groovy
class MyGroovyClass {
    String name
    String getName() {
        return 'Zoro'
    }
}

def instance = new MyGroovyClass()
instance.setName 'Nami'
println instance.name
```

## Methods
``` groovy
// in java
public int square(int num) {
    return num * num;
}
square(2);

// in groovy
def square(def num) {
    num * num
}
// or
def square = { num ->
    num * num
}
```

## Closures
``` groovy
Closure square = {
    it * it
}
square 2
```
- default parameter 'it'
- closures all the time in gradle

## Collections
``` groovy
List list = [1, 2, 3, 4]
list.each() {
    println it
}

Map person = [name:chopper, reward:50]
person.get('name')
person['name']
person.name
```

## Groovy in Gradle
``` groovy
apply plugin: 'com.android.application'
```
equals
``` groovy
project.apply([plugin: 'com.android.application'])
```

``` groovy
dependencies {
    compile 'com.google.code.gson:gson:2.3'
}
```
equals
``` groovy
project.dependencies({
    add('comple', 'com.google.code.gson:gson:2.3', {
        // other config
    })
})
```

# Creating Tasks
## Defining tasks
``` groovy
task hello

task hello {
    println 'Hello, world!'
}

task hello << {
    println 'Hello, world!'
}

hello {
    println 'Configuration'
}

task(hello) << {
    println 'Hello, world!'
}

task('hello') << {
    println 'Hello, world!'
}

task.create(name: 'hello') << {
    println 'Hello, world!'
}
```

## Anatomy of a task

``` groovy
task hello {
    println 'Configuration'
    
    doLast {
        println 'Goodbye'
    }
    
    doFirst {
        println 'Hello'
    }
}
```

output

``` bash
$ ./gradlew hello
Configuration
:hello
Hellow
Goodbye
```

``` groovy
task2.mustRunAfter task1

task2.dependsOn task1
```

## plugin
> A collection of Gradle tasks that resure in serveral projects.
Written in the languages that make use of the JVM (Groovy/Java/Scala...).

# Others
## Setting Up CI
- Jenkins
- TeamCity
- Travis CI
- Further automation

## Using Ant
- ant.echo
- ant.zip


# Summary
> Automate the build process for your projects with Gradle.

# Thanks you!