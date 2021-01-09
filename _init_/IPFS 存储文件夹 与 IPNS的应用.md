# IPFS 存储文件夹 与 IPNS的应用

[TOC]

## 将文件夹添加到IPFS服务

###  1. 创建一个 `文件夹`和两个个文件

```shell
root@host# tree ipfs_dir/
ipfs_dir/
├── 1.txt
└── 2.txt
```

###  2. 将整个文件夹添加到`IPFS网络`

```shell
root@host# ipfs add -r ipfs_dir/ -w
added QmRn7HFCjt86BJRaJ2oWvpCiPzvZVv3tJ59mGvbJbyFgqh ipfs_dir/1.txt
added QmVZhStSNDVeHKt6CpVuRCAWge2z2QgszBNsHVqAdgDQBt ipfs_dir/2.txt
added QmTRao9yh5MMQDisFra6sqftyzHx4pzEQWRCuPAux4iWur ipfs_dir
added QmbTAHcYup8L3nYvvXDpeDC9bhe9rzTCLsfjoqYytmsbFb 
 32 B / 32 B [==================================================================================================================================================] 100.00%
```

访问数据：
[![sMlaVA.md.png](https://s3.ax1x.com/2021/01/09/sMlaVA.md.png)](https://imgchr.com/i/sMlaVA)

###  3. 改变目录中的一个文件，或者往目录中新增一个文件

```shell
root@host:~/test# cd ipfs_dir/
root@host:~/test/ipfs_dir# echo '第三个文件' > 3.txt
root@host:~/test/ipfs_dir# cd ../
root@hhost:~/test# ipfs add -r ipfs_dir/ -w
added QmRn7HFCjt86BJRaJ2oWvpCiPzvZVv3tJ59mGvbJbyFgqh ipfs_dir/1.txt
added QmVZhStSNDVeHKt6CpVuRCAWge2z2QgszBNsHVqAdgDQBt ipfs_dir/2.txt
added QmPPRrzoikSMv57biPaWJ4Y5We975wFcPKBqPVCHL8PDSZ ipfs_dir/3.txt
added QmczhDGTtwdwcMPXHbiYHDBFp8WV4eiBpDRh7WX7wADPeV ipfs_dir
added QmRo5M8FZzNydLz7hicVfX4PWSDWuNXkvTg4TJHJfTgwsV 
 48 B / 48 B [==================================================================================================================================================] 100.00%

```

可以看到，访问整个文件夹的`hash`变成了`QmRo5M8FZzNydLz7hicVfX4PWSDWuNXkvTg4TJHJfTgwsV`，也就是说一旦我们发布的内容有变动，那么别人通过旧的`hash`值是无法访问变动的内容

###  这可怎么办呢？

> IPNS

## IPNS

> `IPNS`类似于域名系统，由`IPFS节点`自己维护。`IPNS`是一个PKI名称空间， `IPNS名称`是`公钥`的`哈希`，`私钥`则用来发布`签名的名称`。 当`发布`或`解析名称`时，默认情况下总是使用发布者自身的节点ID，也就是节点公钥的哈希，但是可以更改

###  1. 使用 节点ID发布文件夹

```shell
root@host:~# !469
ipfs name publish /ipfs/QmRo5M8FZzNydLz7hicVfX4PWSDWuNXkvTg4TJHJfTgwsV

Published to k51qzi5uqu5dlie5lvrcf1l6tazfzc5lzqfqsf35bwp38cfjwealdk2w6j94kq: /ipfs/QmRo5M8FZzNydLz7hicVfX4PWSDWuNXkvTg4TJHJfTgwsV

```

通过浏览器访问：

[![sMldUI.md.png](https://s3.ax1x.com/2021/01/09/sMldUI.md.png)](https://imgchr.com/i/sMldUI)

### 2. 我们再添加一个文件 

```shell
root@host:~/test# ipfs add -r ipfs_dir/ -w
added QmRn7HFCjt86BJRaJ2oWvpCiPzvZVv3tJ59mGvbJbyFgqh ipfs_dir/1.txt
added QmVZhStSNDVeHKt6CpVuRCAWge2z2QgszBNsHVqAdgDQBt ipfs_dir/2.txt
added QmPPRrzoikSMv57biPaWJ4Y5We975wFcPKBqPVCHL8PDSZ ipfs_dir/3.txt
added QmeP8Vt8bpUnEvj8hGXETzeNi4aK2UmWDjVqBHfyEVEASd ipfs_dir/4.txt
added QmdtwgRb84L3twQ5PcFW8PFyppWBvLUx1BVd8Hv1wqUKS7 ipfs_dir
added QmXhNRJahjBf5A5uZijy3t1uofzufP2XAPWs4Lu513fnMH 
 64 B / 64 B [==================================================================================================================================================] 100.00%
 
root@host:~/test# ipfs name publish /ipfs/QmXhNRJahjBf5A5uZijy3t1uofzufP2XAPWs4Lu513fnMH
Published to k51qzi5uqu5dlie5lvrcf1l6tazfzc5lzqfqsf35bwp38cfjwealdk2w6j94kq: /ipfs/QmXhNRJahjBf5A5uZijy3t1uofzufP2XAPWs4Lu513fnMH

```

[![sMlw5t.md.png](https://s3.ax1x.com/2021/01/09/sMlw5t.md.png)](https://imgchr.com/i/sMlw5t)

可以看到，我们通过同样的链接，访问到了新增的 `4.txt`

### 3. 不同IPFS节点把内容发布到相同的`IPNS`地址

> 其实，谁能把内容发布到具体某个`IPNS`地址，取决于谁掌握了这个`IPNS`地址的密钥，类似于数字货币的钱包，大家都知道这个地址，但是只有掌握`私钥`的人才能打开钱包。上面的操作，只是默认使用了节点的`私钥和公钥(peerId)`
> 

####  生成密钥

```shell
## 生成一个基于rsa算法，长度为2048位的密钥对
root@host:~/test# ipfs key gen -t rsa -s 2048 test_key
k2k4r8jj6t82ky1se1luolxh1zfia9pgigfnbthov6rxgwaz67zdwkjj ## 公钥

## 查看ipfs管理的所有密钥对
root@hecs-x-large-2-linux-20200323214244:~/test# ipfs key list
self 			## ipfs节点使用的
mykey           ## 之前生成的
test_key		## 本次生成的

root@host:~/test# ipfs name publish --key=test_key /ipfs/QmXhNRJahjBf5A5uZijy3t1uofzufP2XAPWs4Lu513fnMH
Published to k2k4r8jj6t82ky1se1luolxh1zfia9pgigfnbthov6rxgwaz67zdwkjj: /ipfs/QmXhNRJahjBf5A5uZijy3t1uofzufP2XAPWs4Lu513fnMH

```
浏览器访问：

[![sMlBPP.md.png](https://s3.ax1x.com/2021/01/09/sMlBPP.md.png)](https://imgchr.com/i/sMlBPP)

可以看出`IPNS`地址发生了变更

####  导出、导入密钥

```shell

## 导出之前需要先停止IPFS服务，也可以安装两个IPFS，这样就不用停止服务了 

root@host:~/test# ps -ef | grep ipfs
root     21411 24751  0 11:07 pts/1    00:00:00 grep --color=auto ipfs
root     26682 24751  5 10:27 pts/1    00:01:59 /snap/ipfs/1682/ipfs daemon

root@host:~/test# kill -9 26682

root@host:~/test# sudo ipfs key export test_key
[2]+  Killed                  ipfs daemon  (wd: ~)
(wd now: ~/test)

root@host:~/test# ll
total 118144
drwxr-xr-x  3 root root      4096 Jan  9 11:07 ./
drwx------ 12 root root      4096 Jan  9 10:48 ../
drwxr-xr-x  2 root root      4096 Jan  9 10:51 ipfs_dir/
-rw-r--r--  1 root root      1197 Jan  9 11:07 test_key.key # 这就是导出的密钥

## 删除test_key
root@host:~/test# ipfs key rm test_key
test_key

root@ost:~/test# ipfs key list
self   ## 可以看出test_key被删掉了
mykey

## 导入之前备份的key
root@host:~/test# ipfs key import test_key_import test_key.key 
k2k4r8jj6t82ky1se1luolxh1zfia9pgigfnbthov6rxgwaz67zdwkjj

```

#### `IPNS`发布，访问较慢的问题

> 这个问题可以通过建立`IPFS`私有网络，得到一定程度上的解决



