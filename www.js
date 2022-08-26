const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = 8080;
const utils = require("./utils")
const CONFIG = require('./config')
const crypto = require('crypto');

server.listen(PORT, () => {
    utils.openURL("http://localhost:8080");
    console.log(`正在监听${PORT}端口...`);
});
// 发送模板消息接口
app.get('/', async (req, res) => {
    const q = req.query;
    const signature = q.signature;
    const token = CONFIG.config.token;
    const echostr = q.echostr;
    const timestamp = q.timestamp;
    const nonce = q.nonce;
    const array = new Array(token, timestamp, nonce);
    array.sort();
    let _signature = crypto.createHash('sha1')
        .update(array.toString().replace(/,/g, ""), 'utf-8')
        .digest('hex');
    if (_signature == signature) {
        console.log(echostr);
    } else {
        console.log("项目启动成功！");
    }
    const accessToken = await utils.getAccessToken();
    const hostname = 'api.weixin.qq.com';
    const path = `/cgi-bin/message/template/send?access_token=${accessToken}`
    const WEATHER = await utils.getWeatherCity(CONFIG.config.AppId, CONFIG.config.AppSecret, CONFIG.config.cityid);
    const ENGLISH_CN = await utils.getEnglish_Cn(WEATHER.date);
    let arrColor = [];
    for (let i = 0; i < 10; i++) {
        var random = Math.random();
        if (random < 0.618) {
            arrColor.push(utils.getColor1())
        } else {
            arrColor.push(utils.getColor2())
        }
    }



    /**
     * 新手从这里开始修改
     * 修改时按自己的模板
     * 以及后面的备注
     * 实在不会看readme.md文档
     * 在不会可私信作者
     */


    const OBJTIME = await utils.getTimeDate("2022-08-22", "2023-05-01");//计算距离时间()中的时间可改，用逗号分隔，最多写三个
    // 数据就是模板
    const data = {
        "touser": CONFIG.config.vx_num, //新手这行不要动
        "template_id": CONFIG.config.tel_id, //新手不要动这行
        "url": 'http://www.baidu.com',//可写可不写
        "data": {//这下面的数据就是模板的数据可以根据自己的需求改
            "month": { //这行可改，改成自己模板里的字母month
                "value": WEATHER.date, //日期
                "color": arrColor[0], //颜色可以自定义 #333333(可改可不改，默认是随机颜色)
            },
            "time": {//这行可改
                "value": WEATHER.week, //星期几
                "color": arrColor[1],
            },
            "city": {//这行可改
                "value": WEATHER.city, //城市
                "color": arrColor[2],
            },
            "weather": {//这行可改
                "value": WEATHER.wea, //天气
                "color": arrColor[3],
            },
            "min": {//这行可改
                "value": WEATHER.tem_night + "°", //最低温
                "color": arrColor[4],
            },
            "max": {//这行可改
                "value": WEATHER.tem_day + "°", //最高温
                "color": arrColor[5],
            },
            "num": {//这行可改
                "value": OBJTIME.date1, // 相距的天数（上面时间写几个下面就可以用几个）date1是第一个
                "color": arrColor[6],
            },
            "date": {//这行可改
                "value": OBJTIME.date2, // 相距天数 date2是第一个
                "color": arrColor[7],
            },
            "english": {//这行可改
                "value": ENGLISH_CN.content, // 英文摘要
                "color": arrColor[8],
            },
            "chinese": {//这行可改
                "value": ENGLISH_CN.note,  //中文摘要
                "color": arrColor[9],
            }
        }
    }
    utils.postRequest(hostname, path, JSON.stringify(data));
    res.send("模板已发送成功，用户已收到！");
});
