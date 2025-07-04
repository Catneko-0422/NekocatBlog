---
title: docker 使用教學
published: 2025-07-02
description: 快速學會使用docker
image: "./cover.jpg"
tags: [docker, dockerfile, containers]
category: "development tools"
draft: false
---

# Docker教學
Containers as a Service ( CaaS ) - 容器如同服務
Docker 是一個開源專案，出現於 2013 年初，最初是 Dotcloud 公司內部的 Side-Project。
它基於 Google 公司推出的 Go 語言實作。（ Dotcloud 公司後來改名為 Docker ）

# 目錄
- 什麼是Docker
- 基本介紹 - 映像檔、容器、倉庫
- Dockerfile 說明
- 進階應用 - docker compose
- 進階應用 - docker machine
- 實際案例

## 什麼是Docker
Docker 是一種容器化技術，可以讓你將應用程式、環境、相依套件一起打包成一個可攜帶、可重複部署的容器（Container），確保在任何地方運行時都有相同的行為。
簡單來說，Docker 就像把應用程式放進一個盒子裡，這個盒子裡有你需要的所有東西，去哪都可以直接用，解決「我這邊跑得好好的，怎麼你那邊就出錯」的問題。

## 基本介紹
### Docker 三個基本概念

#### 映像檔（Image）
- Docker 映像檔就是一個唯讀的模板。
- 映像檔可以用來建立 Docker 容器。

#### 容器（Container）
- 容器是從映像檔建立的執行實例。
- Docker 利用容器來執行應用。
- 可以被啟動、開始、停止、刪除。
- 每個容器都是相互隔離的、保證安全的平台。

#### 倉庫（Repository）
- 倉庫是集中存放映像檔檔案的場所。
- 每個倉庫中又包含了多個映像檔。
- 每個映像檔有不同的標籤（tag）。
- 倉庫分為公開倉庫（Public）和私有倉庫（Private）兩種形式。

![docker_life_circle](./docker_life_circle.png)

## 指令說明 - 安裝、指令

### 安裝Docker
[Get started with Docker for Mac](https://docs.docker.com/desktop/setup/sign-in/)
[Get started with Docker for Windows](https://docs.docker.com/desktop/setup/sign-in/)
[Docker Toolbox overview](https://docs.docker.com/retired/)

### Image 映像檔 常用指令
| 指令               | 說明 | 範例                            |
|-------------------|------|---------------------------------|
| `search`          | 搜尋 | docker search centos             |
| `pull`            | 下載 | docker pull centos               |
| `images`          | 列表 | docker images                    | 
| `run`             | 執行 | docker run -ti centos /bin/bash  |
| `rmi [Image ID]`  | 刪除 | docker rmi 615cb40d5d19          |
| `build`           | 建立 | docker build -t member:1 .       |
| `login`           | 登入 | docker login docker.okborn.com   |
| `push`            | 上傳 | docker push                      |

##### Search 搜尋 Centos 映像檔
```shell
$ docker search centos
NAME                                DESCRIPTION                                    STARS     OFFICIAL   AUTOMATED
centos                              The official build of CentOS.                  7000+     [OK]       
centos/systemd                      CentOS with systemd as init.                   200+                 [OK]
centos/mysql-57-centos7             MySQL 5.7 for CentOS 7                         150+                 [OK]
centos/httpd-24-centos7             Apache httpd 2.4 for CentOS 7                  100+                 [OK]
centos/python-36-centos7            Python 3.6 for CentOS 7                        90+                  [OK]
centos/postgresql-96-centos7        PostgreSQL 9.6 for CentOS 7                    85+                  [OK]
centos/nginx-112-centos7            Nginx 1.12 for CentOS 7                        60+                  [OK]
```
欄位說明：
NAME:映像檔名稱
DESCRIPTION:映像檔描述
STARS:社群給予的星星數，越高越熱門
OFFICIAL:有 OK 表示官方提供的映像檔
AUTOMATED:有 OK 表示自動化構建的映像檔

##### 顯示目前本機的 Images 列表
```shell
$ docker images

REPOSITORY       TAG          IMAGE ID       CREATED          SIZE
ubuntu           latest       26f74b3b1b7e   2 weeks ago      29MB
nginx            stable       605c77e624dd   3 weeks ago      133MB
mysql            8.0          a1b2c3d4e5f6   4 weeks ago      447MB
node             18-alpine    d5e6f7a8b9c0   5 weeks ago      116MB
python           3.11-slim    f1e2d3c4b5a6   2 months ago     45MB
redis            7.2          b7c8d9e0f1a2   2 months ago     55MB
my-python-app    v1.0         8f9e0d1c2b3a   3 days ago       50MB
```
欄位說明：
REPOSITORY：映像檔來源名稱，官方或自訂名稱
TAG：版本號或標籤
IMAGE ID：映像檔唯一識別碼
CREATED：映像檔建立時間
SIZE：映像檔大小

##### 啟動容器
```shell
$ docker run -ti centos /bin/bash
[root@d3f1a2b4c5d6 /]# cat /etc/redhat-release
CentOS Linux release 7.6.1810(Core)
[root@d3f1a2b4c5d6 /]# ^C
[root@d3f1a2b4c5d6 /]# exit
```
參數說明：
docker run：啟動容器
-i：讓容器的標準輸入保持打開
-t：讓Docker分配一個虛擬終端（pseudo-tty）並綁定到容器的標準輸入上
-d：背景執行
-e：設定環境變數(AAA=BBB)
-p：Port 對應(host port:container port)
-v：資料對應(host folder:container folder)
--name：設定容器名稱

** 在執行RUN 映像檔時，如果沒有下載會先下載在執行 **

rmi : 刪除映像檔前要先移除所有Container
build : 使用build 指令時要先切換到Dockerfile 目錄下面

### Container 容器 常用指令
| 指令                 | 說明                  | 範例                          |
|----------------------|----------------------|-------------------------------|
| `run`                | 新建或啟動            | docker run -d centos          |
| `start [Contain ID] `| 啟動                 | docker start a469b9226fc8     |
| `stop [Contain ID]`  | 停止                 | docker stop a469b9226fc8      | 
| `rm [Contain ID]`    | 刪除                 | docker rm a4                  |
| `ps -a`              | 列表                 | docker ps -a                  |
| `logs [Contain ID]`  | 查看容器內的資訊      | docker logs -f a4             |
| `exec [Contain ID]`  | 進入容器(開新console) | docker exec -ti a4 /bin/bash  |
| `attach`             | 進入容器(退出停止容器) | docker attach a4               |
| `inspect`            | 查看                  | docker inspect a4            |

##### 啟動一個 Container 並且執行 ping google.com
```shell
$ docker run centos ping google.com
PING google.com (142.250.200.78) 56(84) bytes of data.
64 bytes from 142.250.200.78: icmp_seq=1 ttl=118 time=22.5 ms
64 bytes from 142.250.200.78: icmp_seq=2 ttl=118 time=23.1 ms
...
```

##### 使用 查看 Container 指令
```shell
$ docker ps 
CONTAINER ID   IMAGE          COMMAND       CREATED         STATUS         PORTS     NAMES
d1f2a3b4c5d6   nginx:latest   "/docker-entrypoint.…"   5 minutes ago   Up 5 minutes   0.0.0.0:8080->80/tcp   web_server

$ docker ps -a
CONTAINER ID   IMAGE           COMMAND                  CREATED         STATUS                      PORTS                  NAMES
d1f2a3b4c5d6   nginx:latest    "/docker-entrypoint.…"   5 minutes ago   Up 5 minutes                0.0.0.0:8080->80/tcp   web_server
a1b2c3d4e5f6   centos          "/bin/bash"              10 minutes ago  Exited (0) 5 minutes ago                           centos_test
b7c8d9e0f1a2   ubuntu:latest   "bash"                   20 minutes ago  Exited (0) 15 minutes ago                          hopeful_volhard
```

ps : 參數說明 or docker ps --help 常用：
-a：顯示全部的容器

欄位說明：
CONTAINER ID：容器ID
IMAGE：映像檔名稱
COMMAND：執行指令
CREATED：創建時間
STATUS：容器狀態
POSTS：開啟的Port號
NAMES：容器名稱

##### 顯示容器的 log
```shell
$ docker logs -f 8a
172.17.0.1 - - [02/Jul/2025:11:00:15 +0000] "GET / HTTP/1.1" 200 612 "-" "Mozilla/5.0"
172.17.0.1 - - [02/Jul/2025:11:00:16 +0000] "GET /favicon.ico HTTP/1.1" 404 555 "-" "Mozilla/5.0"
172.17.0.1 - - [02/Jul/2025:11:00:20 +0000] "GET /index.html HTTP/1.1" 200 1024 "-" "Mozilla/5.0"
172.17.0.1 - - [02/Jul/2025:11:00:25 +0000] "GET /api/status HTTP/1.1" 200 128 "-" "curl/7.81.0"
```

參數說明:
docker logs：查看容器日誌
-f：不會跳出，會一直列印最新的log資訊

##### 進入容器
```shell
$ docker exec -ti 8a /bin/bash
[root@d1f2a3b4c5d6 /]#
```

參數說明:
docker exec：在已啟動的容器內執行指令
-i ：則讓容器的標準輸入保持打開
-t：讓Docker分配一個虛擬終端（pseudo-tty）並綁定到容器的標準輸入上
-e：設定環境變數(AAA=BBB)

##### 查看容器資訊
```shell
$ docker inspect 8a
[
    {
        "Id": "8a7b6c5d4e3f2g1h0i",
        "Created": "2025-07-02T02:30:15.123456789Z",
        "Path": "/bin/bash",
        "Args": [],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 12345,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2025-07-02T02:30:16.789012345Z",
            "FinishedAt": "0001-01-01T00:00:00Z"
        },
        "Image": "sha256:d5e6f7a8b9c01234",
        "Name": "/happy_mirzakhani",
        "RestartCount": 0,
        "NetworkSettings": {
            "IPAddress": "172.17.0.2",
            "Ports": {
                "80/tcp": [
                    {
                        "HostIp": "0.0.0.0",
                        "HostPort": "8080"
                    }
                ]
            }
        },
        "Mounts": []
    }
]
```

### Registry 倉庫 常用指令
| 指令     | 說明       | 範例                          |
|----------|----------|-------------------------------|
| `commit` | 容器存檔  | docker commit db aaa:v1                   |
| `pull`   | 下載      | docker pull docker.okborn.com/okborn:base |
| `tag`    | 標籤      | docker tag aaa docker.okborn.com/aaa      | 
| `push`   | 上傳      | docker push docker.okborn.com/member:1 |
| `login`  | 登入      | docker login docker.okborn.com |
| `export` | 匯出      | docker export 7691a814370e > ubuntu.tar |
| `import` | 匯入      | cat ubuntu.tar sudo docker import - test/ubuntu:v1.0 |

##### 對容器存檔
```Shell
$ docker commit 96 aaa:v1
sha256:5c9f90061b8802ac0b24d2bbab56305551304e6cbdc5d3bda1f5d2df12379d89
$ docker images
REPOSITORY          TAG         IMAGE ID            CREATED         SIZE
aaa                 v1          5c9f90061b88        3 seconds ago   188MB
```

##### 對映像檔打標籤
```Shell
$ docker tag centos aaa asia.gcr.io/joyi-205504/aaa:v1
$ docker images
REPOSITORY                  TAG         IMAGE ID            CREATED         SIZE
asia.gcr.io/joyi-205504/aaa v1          5c9f90061b88        3 seconds ago   188MB
aaa                         v1          5c9f90061b88        3 seconds ago   188MB
```

##### 上傳到 GCP Registry
```shell
$ gcloud docker -- push  asia.gcr.io/joyi-205504/aaa:v1
```

### 其他常用指令
##### 刪除
```shell
$ docker rmi `docker images|grep sele |awk '{print $3}'`
```

## Docker 資料管理

#### 資料卷（Data volumes）
- 資料卷可以在容器之間共享和重用
- 對資料卷的修改會立馬生效
- 對資料卷的更新，不會影響映像檔
- 卷會一直存在，直到沒有容器使用

**範例：建立一個 web 容器，並載入一個資料卷到容器的 /webapp 目錄**
```shell
$ docker run -d -P --name web -v /webapp training/webapp python app.py
```

**範例：本機的 /src/webapp 目錄到容器的 /opt/webapp 目錄**
```shell
$ docker run -d -P --name web -v /src/webapp:/opt/webapp training/webapp python app.py
```

**範例：Docker 掛載資料卷的預設權限是讀寫，使用者也可以透過 :ro 指定為唯讀**
```shell
$ docker run -d -P --name web -v /src/webapp:/opt/webapp:ro training/webapp python app.py
```

#### 資料卷容器（Data volume containers）
持續更新的資料需要在容器之間共享，最好建立資料卷容器。
一個正常的容器，專門用來提供資料卷供其它容器掛載的。

**範例：建立一個命名的資料卷容器 dbdata**
```shell
$ docker run -d -v /dbdata --name dbdata postgres echo Data-only container for postgres
```

**範例：其他容器中使用 --volumes-from 來掛載 dbdata 容器中的資料卷**
```shell
$ docker run -d -P --volumes-from dbdata --name db1 postgres
$ docker run -d -P --volumes-from dbdata --name db2 postgres
```

**範例：也可以從其他已經掛載了容器卷的容器來掛載資料卷。**
```shell
$ docker run -d --name db3 --volumes-from db1 postgres
```

**範例：備份**
首先使用 --volumes-from 標記來建立一個載入 dbdata 容器卷的容器，並從本地主機掛載當前到容器的 /backup 目錄。
```shell
$ docker run --volumes-from dbdata -v $(pwd):/backup ubuntu tar cvf /backup/backup.tar /dbdata
```

**範例：恢復**
恢復資料到一個容器，首先建立一個帶有資料卷的容器 dbdata2
```shell
$ docker run -v /dbdata --name dbdata2 ubuntu /bin/bash
```
然後建立另一個容器，掛載 dbdata2 的容器，並使用 untar 解壓備份檔案到掛載的容器卷中。
```shell
$ docker run --volumes-from dbdata2 -v $(pwd):/backup busybox tar xvf /backup/backup.tar
```

Docker 中的網路功能介紹
- 要讓外部也可以存取這些應用
- 可以通過-P或-p參數來指定連接埠映射。

**範例：隨機本機Port**
```shell
$ docker run -d -P training/webapp python app.py
```

**範例：指定本機Port**
```shell
$ docker run -d -p 5000:5000 training/webapp python app.py
```

**範例：綁定 localhost 的任意連接埠到容器的 5000 連接埠，本地主機會自動分配一個連接埠**
```shell
$ docker run -d -p 127.0.0.1::5000 training/webapp python app.py
```

**範例：還可以使用 udp 標記來指定 udp 連接埠**
```shell
$ docker run -d -p 127.0.0.1:5000:5000/udp training/webapp python app.py
```

**範例： -p 標記可以多次使用來綁定多個連接埠**
```shell
$ docker run -d -p 5000:5000  -p 3000:80 training/webapp python app.py
```

## Dockerfile 說明
- Dockerfile 由一行行命令語句組成，並且支援以 # 開頭的註解行。
- Dockerfile 分為四部分：
    - 基底映像檔資訊
    - 維護者資訊
    - 映像檔操作指令
    - 容器啟動時執行指令。

```shell
# This dockerfile uses the ubuntu image
# VERSION 2 - EDITION 1
# Author: docker_user
# Command format: Instruction [arguments / command] ..

# 基本映像檔，必須是第一個指令
FROM ubuntu

# 維護者： docker_user <docker_user at email.com> (@docker_user)
MAINTAINER docker_user docker_user@email.com

# 更新映像檔的指令
RUN echo "deb http://archive.ubuntu.com/ubuntu/ raring main universe" >> /etc/apt/sources.list
RUN apt-get update && apt-get install -y nginx
RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf

# 建立新容器時要執行的指令
CMD /usr/sbin/nginx
```

#### Dockerfile 基本語法
| 指令                                            | 說明                     | 範例                          |
|-------------------------------------------------|-------------------------|-------------------------------|
| `FORM:`                                         | 映像檔來源               | FROM python:3.5                   |
| `MAINTAINER`                                    | 維護者訊息               | MAINTAINER docker_user docker_user@email.com |
| `RUN`                                           | 創建映像檔時執行動作      | RUN apt-get -y update && apt-get install -y supervisor      | 
| `RUN ["executable", "param1", "param2"]`        | 創建映像檔時執行動作      | RUN ["/bin/bash", "-c", "echo hello"] |
| `CMD command param1 param2`                     | 啟動容器時執行的命令      | CMD pserve development.ini |
| `CMD ["executable","param1","param2"]`          | 啟動容器時執行的命令      |  |
| `CMD ["param1","param2"]`                       | 啟動容器時執行的命令     |  |
| `EXPOSE`                                        | 容器對外的埠號          | EXPOSE 8082 |
| `ADD`                                           | 複製檔案(單檔)          | ADD requirements.txt /usr/src/app/ |
| `COPY`                                          | 複製檔案(資料夾)        | COPY . /usr/src/app |
| `ENV`                                           | 環境變數                | ENV PG_VERSION 9.3.4 |
| `ENTRYPOINT command param1 param2`              | 指定容器啟動後執行的命令 |  |
| `ENTRYPOINT ["executable", "param1", "param2"]` | 指定容器啟動後執行的命令 | ENTRYPOINT ["/docker-entrypoint.sh"] |
| `VOLUME ["/data"]`                              | 掛載資料卷              | VOLUME /var/lib/postgresql/data |
| `USER daemon`                                   | 指定運行使用者          | RUN groupadd -r postgres && useradd -r -g postgres postgres |
| `WORKDIR /path/to/workdir`                      | 指定工作目錄            | WORKDIR /usr/src/app |
| `ONBUILD [INSTRUCTION]`                         | 基底映像檔建立時執行     | ONBUILD COPY . /usr/src/app |

RUN 當命令較長時可以使用 \ 來換行。
RUN : 在 shell 終端中運行命令，即 /bin/sh -c；
RUN ["executable", "param1", "param2"] : 使用 exec 執行。

CMD 指定啟動容器時執行的命令， 每個 Dockerfile 只能有一條 CMD 命令 。
如果指定了多條命令，只有最後一條會被執行。
CMD ["executable","param1","param2"] 使用 exec 執行，推薦使用；
CMD command param1 param2 在 /bin/sh 中執行，使用在給需要互動的指令；
CMD ["param1","param2"] 提供給 ENTRYPOINT 的預設參數；

ENTRYPOINT：每個 Dockerfile 中只能有一個 ENTRYPOINT，當指定多個時，只有最後一個會生效。
USER：要臨時取得管理員權限可以使用 gosu，而不推薦 sudo。
WORKDIR：可以使用多個 WORKDIR 指令，後續命令如果參數是相對路徑，則會基於之前命令指定的路徑

### Docker File Base
```shell
# 映像檔Image
FROM python:3.5
# 維護者
MAINTAINER Pellok "pellok@double-cash.com"
# 更新
RUN apt-get -y update && apt-get install -y supervisor
# 創建專案資料夾
RUN mkdir -p /usr/src/app
# 指定工作目錄在專案資料夾
WORKDIR /usr/src/app
# 預先要安裝的requirements複製到Docker裡面
ADD requirements.txt /usr/src/app/
# 安裝需要用的插件
RUN pip install --upgrade pip setuptools
RUN pip install --no-cache-dir -r requirements.txt
# 下次Build 的時候複製專案目錄到Docker 裡面
ONBUILD COPY . /usr/src/app
```

#### 建置
```shell
$ docker build -t sample:base .
```

Docker File for Project
```shell
#  挑選Image
FROM sample:base
# 安裝cryptography
RUN pip install cryptography 
# 設定工作目錄
WORKDIR /usr/src/app/
# 執行Python Setup
RUN python setup.py develop
# 開啟Port號
EXPOSE 8082
# 執行專案
CMD pserve development.ini
```
#### 建置
```shell
$ docker build -t project:v1 .
```

#### Pyramid 專案 Docker 化
```shell
#創建一個新專案
pcreate -s alchemy pyramid_dockerlize
cd pyramid_dockerlize
# 創建dockerfile
touch Dockerfile
# 編輯 Dockerfile
# 建置映像檔
docker build -t pyramid_dockerlize .
# 執行容器
docker run -d -P pyramid_dockerlize
```

#### Dockerfile
```shell
# This dockerfile uses the python pyramid
# VERSION 1 - EDITION 1
# Author: pellok
# Command describe

# 使用的python映像檔版本
FROM python:3.5

MAINTAINER pellok pellok@okborn.com

# 創建存放專案的資料夾
RUN mkdir -p /usr/src/app

# 複製當前目錄的所有檔案到容器內的，資料放在/usr/src/app
COPY . /usr/src/app

# 指定工作目錄
WORKDIR /usr/src/app/

# 安裝環境變數和相依性套件
RUN python setup.py develop

# 初始化DB
RUN initialize_pyramid_dockerlize_db development.ini

# 專案監聽的Port號
EXPOSE 6543

# 啟動專案
CMD pserve production.ini
```