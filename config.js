/**
 * 小程序配置文件
 */

// 

var host = "https://www.chuanguhai.com/api"

var config = {

    //  Server 
    host,
    // 通过code 获取 openId
    getOpenIdByCode:  `${host}/employee/getOpenId`,

};

module.exports = config
