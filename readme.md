# 微信公众日常推送保姆教程（作者：沐晓）（node版）

如果没有Makedown查看不了.md文件，可以参考博主的文章（https://blog.csdn.net/MX_muxiao/article/details/126546131?spm=1001.2014.3001.5501）

## 1.先安装node环境(https://nodejs.org/en/)

#### 安装过程就是：双击直接安装，不建议更改默认安装位置（C:\），中途也保持默认设置，一路 “**Next**” 即可。

![image-20220826141539752](.\images\image-20220826141539752.png)

##### 查看是否安装成功

##### 打开cmd终端输入

```
node -v
```

## 2.下载项目代码文件

```
https://github.com/muxiao2/vx_muxiao_node_express.git
```

什么模块没有就npm什么模块

```
npm i 模块名
```

## 3.注册微信公众号的订阅号(注册完扫码登陆)

![image-20220826141922074](.\images\image-20220826141922074.png)

#### 选择开发者工具点击公众平台测试账号

![image-20220826142213306](.\images\image-20220826142213306.png)

## 4.申请测试号并校验接口配置

##### 要准备以下的信息

![image-20220826142540581](.\images\image-20220826142540581.png)

![image-20220826143042475](.\images\image-20220826143042475.png)

## 5.填写url和token，url为外网访问地址，token自定义，先运行服务，在配置测试号token

#### 首先要准备内网穿透

#### 下载natapp（https://natapp.cn/#download）选择适合自己电脑的版本

![image-20220826143551164](.\images\image-20220826143551164.png)

#### 登陆后选择购买隧道的免费隧道，端口号填写8080

![image-20220826143900513](.\images\image-20220826143900513.png)

##### 准备好authtoken后

![image-20220826144125106](.\images\image-20220826144125106.png)





##### 下载完后打开这个程序

![image-20220826143405228](.\images\image-20220826143405228.png)

##### 直接运行

```shell
natapp -authtoken=你刚刚复制的authtoken
```

#### 运行结果(复制这个url，这个窗口先不要关掉，需要挂载后台)

![image-20220826144442809](.\images\image-20220826144442809.png)

## 6.查看本项目文本注解

## 7.准备好天气接口要的数据（https://www.yiketianqi.com/user/login）

#### 先注册登录，查看自己账号里的AppId和AppSecret

![image-20220826141158788](.\images\image-20220826141158788.png)

#### 并且在项目文件夹中找到城市cityid表找到对应的城市id

## 8.用记事本打开config.js文件

```js
module.exports = {
    /**
 * [设置验证微信接口配置参数]
 */
    config: {
        token: '要填写', //对应测试号接口配置信息里填的token（自定义，但是要跟测试号里填的一样）
        appid: '要填写', //对应测试号信息里的appID
        secret: '要填写', //对应测试号信息里的appsecret
        grant_type: 'client_credential', //默认
        tel_id: '要填写', //模板的id
        vx_num: '要填写', //要发给谁就写谁，就是关注用户里的微信号
        //这个是天气的接口，需要注册完填写以下内容
        AppId: '要填写',//天气登陆注册接口id
        AppSecret: '要填写',//天气登陆注册接口的secret
        cityid: '要填写' //城市的编号（从附件cityid表中查）
    },

    /**这是作者沐晓的模板(模板修改在www.js文件)
     * {{month.DATA}} {{time.DATA}} 
     * 城市：{{city.DATA}} 
     * 今天天气：{{weather.DATA}} 
     * 最低气温：{{min.DATA}} 
     * 最高气温：{{max.DATA}} 
     * 今天是我们分别的第{{num.DATA}}天 
     * 距离我们再见还有{{date.DATA}}天 
     * {{english.DATA}} 
     * {{chinese.DATA}}
     */
};  
```

## 9.按照注释修改文件内容www.js

![image-20220826150743764](.\images\image-20220826150743764.png)

#### WEATHER数据对照表

![image-20220826150906417](.\images\image-20220826150906417.png)



## 9.按照上面的配置完后就可以运行程序了(打开cmd命令窗，cd到项目目录下执行)

```js
node www.js
```

#### 程序执行完后打开微信公众填写token

![image-20220826151729948](.\images\image-20220826151729948.png)

## 10.执行成功后发送(填写的关注用户就会收到)

![image-20220826151325176](.\images\image-20220826151325176.png)

## 11.定时推送

#### 安装pkg（cmd打开cd到项目目录运行以下代码）

```shell
npm install -g pkg
```

#### 在项目的根目录下修改package.json 配置(项目默认修改完，这步可不做)

```js
 "bin": "service.js",//入口文件
```

#### 使用打包工具

```shell
pkg -t win www.js
```

#### 然后win+r打开搜索框输入以下命令回车

```
compmgmt.msc
```

![image-20220826155507037](.\images\image-20220826155507037.png)

![image-20220826155639761](.\images\image-20220826155639761.png)

![image-20220826155813453](.\images\image-20220826155813453.png)
