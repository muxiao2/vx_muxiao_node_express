module.exports = {
    // 可以不用数据库，要用者自己加
    databaseOptions: {
        //公网IP
        host: 'localhost',
        // 数据库用户名
        user: 'root',
        // 默认端口号
        port: '3306',
        // 登录数据库的密码
        password: 'root'
    },
    /**
 * [设置验证微信接口配置参数]
 */
    config: {
        token: 'muxiao', //对应测试号接口配置信息里填的token（自定义，但是要跟测试号里填的一样）
        appid: '自己填数据', //对应测试号信息里的appID
        secret: '自己填数据', //对应测试号信息里的appsecret
        grant_type: '自己填数据', //默认
        tel_id: '自己填数据', //模板id
        vx_num: '自己填数据', //要发给谁就写关注用户里的微信号
        //这个是天气的接口，需要注册完填写以下内容
        // https://www.yiketianqi.com/user/login
        AppId: '自己填数据',//注册接口id
        AppSecret: '自己填数据',//注册接口的secret
        cityid: '自己填数据' //城市的编号（从附件city表中查）
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
