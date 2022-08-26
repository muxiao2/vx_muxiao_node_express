const mysql = require('mysql');//导入mysql
const CONFIG = require("./config");
const https = require('https');
const crypto = require('crypto');
// 引入npm拓展
const jsonfile = require('jsonfile');
const path = require('path');
const { get } = require('http');
// 引入moment.js时间格式化库
const moment = require('moment');
// 可以使用exec 来执行系统的默认命令；child_process为内置模块 
const { exec } = require("child_process");

function openURL(url) {
    // 拿到当前系统的参数
    switch (process.platform) {
        //mac系统使用 一下命令打开url在浏览器
        case "darwin":
            exec(`open ${url}`);
        //win系统使用 一下命令打开url在浏览器
        case "win32":
            exec(`start ${url}`);
            // 默认mac系统
        default:
            exec(`open ${url}`);
    }
}
// 连接操作数据库函数
function query(db, sql) {
    return new Promise((resolve, reject) => {
        const {
            host,
            user,
            port,
            password
        } = CONFIG.databaseOptions;
        // 创建连接
        let con = mysql.createConnection({
            host,
            user,
            password,
            database: db
        })
        // 执行sql语句
        con.query(sql, (e, r) => {
            if (e) {
                reject(e)
            } else {
                resolve(r)
            }
        });
        // 断开连接
        con.end();
    })
}
// 封装使用node模块https发送post请求的函数
function postRequest(hostname, path, content) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: hostname,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www/form-urlencoded',
                'Content-Length': Buffer.byteLength(content)
            }
        };
        const req = https.request(options, res => {
            res.setEncoding('utf8');
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', err => reject(err));
        req.write(content);
        req.end();
    });
}
// 封装使用node模块https发送get请求的函数
function getRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', err => reject(err));
    });
};
// 获取AccessToken
function getAccessTokenFromWechatServer() {
    return new Promise(async (resolve, reject) => {
        try {
            const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${CONFIG.config.appid}&secret=${CONFIG.config.secret}`
            resolve(await getRequest(url))
        } catch (err) {
            reject(err);
        }
    })
}
function getAccessToken() {
    return new Promise(async (resolve, reject) => {
        const data = jsonfile.readFileSync(path.resolve(__dirname, 'data.json'))
        if (!data.accessToken.accessToken) {
            // 记录不存在
            const ACCESS_TOKEN = await getAccessTokenFromWechatServer();
            data.accessToken = {
                accessToken: ACCESS_TOKEN.access_token,
                expire_in: Date.now() + (ACCESS_TOKEN.expires_in * 1000)
            }
            jsonfile.writeFileSync(path.resolve(__dirname, 'data.json'), data, { spaces: 2 })
            resolve(ACCESS_TOKEN.access_token);
        } else {
            // 比对过期日期
            const nowTimestamp = Date.now();
            const timestampInDB = +data.accessToken.expire_in;
            if (timestampInDB < nowTimestamp) {
                data.accessToken = {
                    accessToken: "",
                    expire_in: ""
                }
                jsonfile.writeFileSync(path.resolve(__dirname, 'data.json'), data, { spaces: 2 })
            }
            else {
                resolve(data.accessToken.accessToken);
            }
        }
    })
}
// 封装两个日期相差多少天
function getDiffDay(date1, date2) {
    // 计算两个日期之间的差值
    let totalDays, diffDate
    let myDate1 = Date.parse(date1)
    let myDate2 = Date.parse(date2)
    // 将两个日期都转换为毫秒格式，然后做差
    diffDate = Math.abs(myDate1 - myDate2) // 取相差毫秒数的绝对值
    totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
    return totalDays    // 相差的天数
}
// 模板数据格式处理
function getTimeDate(time1, time2, time3) {
    return new Promise(async (resolve, reject) => {
        const month = moment(Date.now()).format('YYYY-MM-DD')//当日时间
        const date1 = getDiffDay(month, time1);//计算时间1
        const date2 = getDiffDay(month, time2)//计算时间2
        const date3 = getDiffDay(month, time3)//计算时间3
        const OBJTIME = {
            date1: date1,
            date2: date2,
            date3: date3
        }
        resolve(await OBJTIME);//返回请求结果
    })
}
// 获取天气接口
// https://www.yiketianqi.com/user/login
function getWeatherCity(appid, appsecret, cityid) {
    return new Promise(async (resolve, reject) => {
        const url = `https://www.yiketianqi.com/free/day?appid=${appid}&appsecret=${appsecret}&unescape=1&cityid=${cityid}`;
        resolve(await getRequest(url));//返回请求结果
    })
}
// 获取每日一句接口
// http://sentence.iciba.com/index.php?c=dailysentence&m=getdetail&title=2020-04-24
function getEnglish_Cn(datenow) {
    return new Promise(async (resolve, reject) => {
        const url = `https://sentence.iciba.com/index.php?c=dailysentence&m=getdetail&title=${datenow}`;
        resolve(await getRequest(url));//返回请求结果
    })
}
// 随机颜色
function getColor1() {//固定红色值
    var re = "#";
    var col = getColor();
    re += col + "FF";
    return re
}
function getColor2() {//固定蓝色值
    var re = "#FF";
    var col = getColor();
    re += col;
    return re
}
function getColor() {
    var re = "";
    for (var xunhuan = 0; xunhuan < 2; xunhuan++) {
        var temp = Math.floor(256 * Math.random());
        if (temp < 130 && xunhuan == 0) {
            temp = 130;
        }
        if (temp > 200 && xunhuan == 1) {
            temp = 200;
        }
        temp = temp.toString(16);//将数值转换成16进制
        if (temp.length !== 2) {
            temp = "0" + temp
        }
        re += temp//对颜色进行拼接
    }
    return re;
}


module.exports = {
    query,
    postRequest,
    getRequest,
    getAccessTokenFromWechatServer,
    getAccessToken,
    getTimeDate,
    getWeatherCity,
    getEnglish_Cn,
    getColor,
    getColor1,
    getColor2,
    openURL
}
/**
 * 作者：沐晓
 * 代码简单但是花了四五天编辑整理
 * 大佬可忽略
 */