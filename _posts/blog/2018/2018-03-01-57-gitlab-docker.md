---
title: Gitlab迁移及Docker化
layout: blog
categories: blog
tags: gitlab docker
blogId: 57
---
{% capture media_path %}{{site.media}}/blog/{{page.blogId}}{% endcapture %}

# 一、Gitlab docker安装

``` bash
# 下载
docker pull gitlab/gitlab-ce
# 安装
sudo docker run --detach \
    --hostname gitlab.jiniutech.com \
    --publish 8443:443 --publish 9090:80 --publish 2222:22 \
    --name gitlab \
    --restart always \
    --volume /mnt/gitlab/config:/etc/gitlab \
    --volume /mnt/gitlab/logs:/var/log/gitlab \
    --volume /mnt/gitlab/data:/var/opt/gitlab \
    gitlab/gitlab-ce:latest

# 进入container
docker exec -it gitlab bash
```

由于docker的ssh端口冲突所以改成2222端口
``` bash
vim /etc/gitlab/gitlab.rb
# 修改
gitlab_rails['gitlab_shell_ssh_port'] = 2222
# 重新启动
gitlab-ctl reconfigure
gitlab-ctl restart
```

# 二、Gitlab迁移

#### 旧版本升级
新旧gitlab需要版本相同（或者新服务安装同样版本）

#### 创建备份
备份会在/var/opt/gitlab/backups（或者被映射到其他位置）

``` bash
gitlab-rake gitlab:backup:create
```

#### 恢复备份
1. 拷贝生成的备份 xxxxx.tar到新服务器
2. chmod 777 xxx.tar 避免权限不够
3. 停止相关服务

``` bash
gitlab-ctl stop unicorn
gitlab-ctl stop sidekiq
```

4. 恢复
``` bash
# 文件1502357536_2017_08_10_9.4.3_gitlab_backup.tar，则编号为1502357536_2017_08_10_9.4.3
gitlab-rake gitlab:backup:restore BACKUP=备份文件编号
```

5. 启动gitlab
``` bash
sudo gitlab-ctl start
```

# 三、在centos镜像中安装gitlab
> 由于在centos基本镜像中安装会出现权限等问题，这里记录下安装采坑。提供：张叶民

- 启动centos

`docker run --privileged -d -p centos /sbin/init  `

`docker exec -it ${containerId} /bin/sh  `

``` bash
yum install sudo -y
sudo yum install -y curl policycoreutils-python openssh-server 

sudo systemctl enable sshd sudo systemctl start sshd 

yum install firewall-config -y
systemctl start firewalld.service
systemctl enable firewalld.service

sudo firewall-cmd --permanent --add-service=http 

sudo systemctl reload firewalld 

```

``` bash
sudo yum install postfix 
sudo systemctl enable postfix
cd /etc/postfix
vim main.cf 修改 inet_interfaces = all
sudo systemctl start postfix 
curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash 
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce 

```

### 问题
> 今天突然出现`Forbidden`网页无法访问

- docker里面能访问
- ssh正常

***

### 解决方案：
- 查看日志

```
gitlab-ctl tail
==> /var/log/gitlab/gitlab-rails/production.log <==
Started GET "/strategy/strategy-server/branches" for 172.17.0.1 at 2018-03-30 08:23:56 +0000
Rack_Attack: blacklist 172.17.0.1 GET /strategy/strategy-server/branches
```

- ip加白名单

``` shell
vi /etc/gitlab/gitlab.rb
gitlab_rails['rack_attack_git_basic_auth'] = {
'enabled' => true,
'ip_whitelist' => ["127.0.0.1"],
'maxretry' => 300,
'findtime' => 5,
'bantime' => 30
}
```

- 重新加载服务
`gitlab-ctl reconfigure`